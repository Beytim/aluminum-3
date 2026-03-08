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

type AppRole = "admin" | "manager" | "user";

interface UserWithRole {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  roles: AppRole[];
  created_at: string;
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
  const isAdmin = hasRole("admin");

  const fetchUsers = async () => {
    setLoading(true);
    const [profileRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("id, full_name, avatar_url, created_at"),
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
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
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
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role updated", description: `User role changed to ${newRole}.` });
      fetchUsers();
    }
  };

  const handleBulkRole = async (role: AppRole) => {
    for (const id of selectedIds) {
      await supabase.from("user_roles").delete().eq("user_id", id);
      await supabase.from("user_roles").insert({ user_id: id, role });
    }
    toast({ title: "Roles updated", description: `${selectedIds.length} users set to ${role}.` });
    setSelectedIds([]);
    fetchUsers();
  };

  const handleDelete = async (userId: string) => {
    toast({ title: "Not allowed", description: "User deletion requires backend admin access.", variant: "destructive" });
  };

  const handleBulkDelete = () => {
    toast({ title: "Not allowed", description: "Bulk user deletion requires backend admin access.", variant: "destructive" });
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
      <UserStats users={users} />

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
              onView={(u) => setViewUser(u)}
              onChangeRole={handleRoleChange}
              onDelete={handleDelete}
              isAdmin={isAdmin}
              currentUserId={currentUser?.id}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              onView={(u) => setViewUser(u)}
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
