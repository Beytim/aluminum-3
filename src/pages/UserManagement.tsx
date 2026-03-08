import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Plus, LayoutGrid, List, RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { UserStats } from "@/components/users/UserStats";
import { UserFilters, defaultUserFilters, type UserFilterState } from "@/components/users/UserFilters";
import { UserTable } from "@/components/users/UserTable";
import { UserCard } from "@/components/users/UserCard";
import { UserDetailsDialog } from "@/components/users/UserDetailsDialog";
import { UserBulkActions } from "@/components/users/UserBulkActions";
import { ActivityLog } from "@/components/users/ActivityLog";
import { PendingApprovals } from "@/components/users/PendingApprovals";

type AppRole = "admin" | "manager" | "user";

interface UserWithRole {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  roles: AppRole[];
  created_at: string;
  approved: boolean;
}

export default function UserManagement() {
  const { t } = useI18n();
  const { hasRole, user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilterState>(defaultUserFilters);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewUser, setViewUser] = useState<UserWithRole | null>(null);
  const [logRefresh, setLogRefresh] = useState(0);
  const isAdmin = hasRole("admin");

  const fetchUsers = async () => {
    setLoading(true);
    const [profileRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("id, full_name, avatar_url, created_at, approved"),
      supabase.from("user_roles").select("user_id, role"),
    ]);

    if (profileRes.data) {
      const roleMap = new Map<string, AppRole[]>();
      rolesRes.data?.forEach((r) => {
        const existing = roleMap.get(r.user_id) || [];
        existing.push(r.role as AppRole);
        roleMap.set(r.user_id, existing);
      });

      setUsers(
        profileRes.data.map((p) => ({
          id: p.id,
          full_name: p.full_name,
          avatar_url: p.avatar_url,
          roles: roleMap.get(p.id) || ["user"],
          created_at: p.created_at,
          approved: p.approved ?? false,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const approvedUsers = useMemo(() => users.filter(u => u.approved), [users]);
  const pendingUsers = useMemo(() => users.filter(u => !u.approved), [users]);

  const filtered = useMemo(() => {
    return approvedUsers.filter((u) => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!(u.full_name?.toLowerCase().includes(s))) return false;
      }
      if (filters.role !== "all" && !u.roles.includes(filters.role as AppRole)) return false;
      if (filters.joinedPeriod !== "all") {
        const now = new Date();
        const days = filters.joinedPeriod === "7d" ? 7 : filters.joinedPeriod === "30d" ? 30 : 90;
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        if (new Date(u.created_at) < cutoff) return false;
      }
      return true;
    });
  }, [users, filters]);

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    const targetUser = users.find(u => u.id === userId);
    const oldRole = targetUser?.roles[0] || "user";
    
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Log the activity
      await supabase.from("activity_log").insert({
        actor_id: currentUser?.id,
        action: "role_changed",
        target_user_id: userId,
        details: { from_role: oldRole, to_role: newRole },
      });
      toast({ title: "Role updated", description: `User role changed to ${newRole}.` });
      setLogRefresh(prev => prev + 1);
      fetchUsers();
    }
  };

  const handleBulkRole = async (role: AppRole) => {
    for (const id of selectedIds) {
      await supabase.from("user_roles").delete().eq("user_id", id);
      await supabase.from("user_roles").insert({ user_id: id, role });
    }
    // Log bulk action
    await supabase.from("activity_log").insert({
      actor_id: currentUser?.id,
      action: "bulk_role_change",
      details: { to_role: role, count: selectedIds.length, user_ids: selectedIds },
    });
    toast({ title: "Roles updated", description: `${selectedIds.length} users set to ${role}.` });
    setSelectedIds([]);
    setLogRefresh(prev => prev + 1);
    fetchUsers();
  };

  const handleDelete = async (userId: string) => {
    // Delete roles first, then profile
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await supabase.from("activity_log").insert({
        actor_id: currentUser?.id,
        action: "user_removed",
        target_user_id: userId,
        details: {},
      });
      toast({ title: "User removed", description: "User profile and roles deleted." });
      setLogRefresh(prev => prev + 1);
      fetchUsers();
    }
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await supabase.from("user_roles").delete().eq("user_id", id);
      await supabase.from("profiles").delete().eq("id", id);
    }
    toast({ title: "Users removed", description: `${selectedIds.length} users deleted.` });
    setSelectedIds([]);
    setLogRefresh(prev => prev + 1);
    fetchUsers();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t("nav.users")}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {filtered.length} of {users.length} users
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <UserStats users={approvedUsers} />

      {/* Pending Approvals */}
      {isAdmin && pendingUsers.length > 0 && (
        <PendingApprovals
          pendingUsers={pendingUsers}
          onRefresh={fetchUsers}
          currentUserId={currentUser?.id}
        />
      )}

      {/* Filters */}
      <UserFilters filters={filters} onChange={setFilters} />

      {/* Bulk Actions */}
      {isAdmin && (
        <UserBulkActions
          count={selectedIds.length}
          onSetRole={handleBulkRole}
          onDelete={handleBulkDelete}
          onClear={() => setSelectedIds([])}
        />
      )}

      {/* Main content grid with activity log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* View Toggle + Count */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{filtered.length} results</p>
            <div className="flex gap-1 border rounded-md p-0.5">
              <Button variant={viewMode === "table" ? "default" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("table")}>
                <List className="h-3.5 w-3.5" />
              </Button>
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("grid")}>
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <Card className="shadow-card">
              <CardContent className="flex items-center justify-center p-12">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </CardContent>
            </Card>
          ) : viewMode === "table" ? (
            <Card className="shadow-card">
              <CardContent className="p-0 overflow-x-auto">
                <UserTable
                  users={filtered}
                  selectedIds={selectedIds}
                  onSelectIds={setSelectedIds}
                  onView={(u) => setViewUser(u as any)}
                  onChangeRole={handleRoleChange}
                  onDelete={handleDelete}
                  isAdmin={isAdmin}
                  currentUserId={currentUser?.id}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((u) => (
                <UserCard
                  key={u.id}
                  user={u}
                  onView={(u) => setViewUser(u as any)}
                  onChangeRole={handleRoleChange}
                  isAdmin={isAdmin}
                  currentUserId={currentUser?.id}
                />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-muted-foreground">No users found matching your filters.</p>
                <Button size="sm" variant="outline" className="mt-2" onClick={() => setFilters(defaultUserFilters)}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Activity Log Sidebar */}
        <div>
          <ActivityLog
            refreshTrigger={logRefresh}
            userMap={new Map(users.map(u => [u.id, u.full_name || "Unnamed User"]))}
          />
        </div>
      </div>

      {/* Details Dialog */}
      <UserDetailsDialog
        open={!!viewUser}
        onOpenChange={(open) => { if (!open) setViewUser(null); }}
        user={viewUser}
        onChangeRole={handleRoleChange}
        isAdmin={isAdmin}
        currentUserId={currentUser?.id}
      />
    </div>
  );
}
