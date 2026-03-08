import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Plus, Crown, UserCog, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type AppRole = "admin" | "manager" | "user";

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  roles: AppRole[];
  created_at: string;
}

const roleConfig: Record<AppRole, { label: string; icon: React.ElementType; class: string }> = {
  admin: { label: "Admin", icon: Crown, class: "bg-destructive/10 text-destructive" },
  manager: { label: "Manager", icon: UserCog, class: "bg-primary/10 text-primary" },
  user: { label: "User", icon: User, class: "bg-success/10 text-success" },
};

export default function UserManagement() {
  const { t } = useI18n();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = hasRole("admin");

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, created_at");

    const { data: allRoles } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (profiles) {
      const roleMap = new Map<string, AppRole[]>();
      allRoles?.forEach((r) => {
        const existing = roleMap.get(r.user_id) || [];
        existing.push(r.role as AppRole);
        roleMap.set(r.user_id, existing);
      });

      setUsers(
        profiles.map((p) => ({
          id: p.id,
          email: "",
          full_name: p.full_name,
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

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    // Remove existing roles, add new one
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role updated" });
      fetchUsers();
    }
  };

  const roleCounts = { admin: 0, manager: 0, user: 0 };
  users.forEach((u) => u.roles.forEach((r) => { roleCounts[r] = (roleCounts[r] || 0) + 1; }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("nav.users")}</h1>
          <p className="text-sm text-muted-foreground">Manage roles and access control</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(["admin", "manager", "user"] as AppRole[]).map((role) => {
          const cfg = roleConfig[role];
          const Icon = cfg.icon;
          return (
            <Card key={role} className="shadow-card">
              <CardContent className="p-3 text-center">
                <Icon className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-xs font-semibold">{cfg.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {roleCounts[role]} user(s)
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{t("common.name")}</TableHead>
                  <TableHead className="text-xs">Role</TableHead>
                  <TableHead className="text-xs">Joined</TableHead>
                  {isAdmin && <TableHead className="text-xs">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="text-xs font-medium">
                      {u.full_name || "Unnamed User"}
                    </TableCell>
                    <TableCell>
                      {u.roles.map((r) => (
                        <span
                          key={r}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${roleConfig[r]?.class || "bg-muted text-muted-foreground"}`}
                        >
                          {roleConfig[r]?.label || r}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Select
                          defaultValue={u.roles[0]}
                          onValueChange={(val) => handleRoleChange(u.id, val as AppRole)}
                        >
                          <SelectTrigger className="h-7 w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 4 : 3} className="text-center text-xs text-muted-foreground py-8">
                      No users found. Sign up to create the first user.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
