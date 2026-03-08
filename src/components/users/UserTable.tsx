import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Shield, Trash2, Crown, UserCog, User } from "lucide-react";

type AppRole = "admin" | "manager" | "user";

interface UserWithRole {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  roles: AppRole[];
  created_at: string;
}

const roleConfig: Record<AppRole, { label: string; icon: React.ElementType; class: string }> = {
  admin: { label: "Admin", icon: Crown, class: "bg-destructive/10 text-destructive border-destructive/20" },
  manager: { label: "Manager", icon: UserCog, class: "bg-warning/10 text-warning border-warning/20" },
  user: { label: "User", icon: User, class: "bg-primary/10 text-primary border-primary/20" },
};

interface Props {
  users: UserWithRole[];
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
  onView: (user: UserWithRole) => void;
  onChangeRole: (userId: string, role: AppRole) => void;
  onDelete: (userId: string) => void;
  isAdmin: boolean;
  currentUserId: string | undefined;
}

export function UserTable({ users, selectedIds, onSelectIds, onView, onChangeRole, onDelete, isAdmin, currentUserId }: Props) {
  const allSelected = users.length > 0 && selectedIds.length === users.length;

  const toggleAll = () => {
    onSelectIds(allSelected ? [] : users.map((u) => u.id));
  };

  const toggle = (id: string) => {
    onSelectIds(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
          </TableHead>
          <TableHead className="text-xs">User</TableHead>
          <TableHead className="text-xs">Role</TableHead>
          <TableHead className="text-xs hidden md:table-cell">Joined</TableHead>
          <TableHead className="text-xs w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onView(u)}>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Checkbox checked={selectedIds.includes(u.id)} onCheckedChange={() => toggle(u.id)} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={u.avatar_url || undefined} />
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                    {getInitials(u.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium text-foreground">{u.full_name || "Unnamed User"}</p>
                  {u.id === currentUserId && (
                    <span className="text-[9px] text-muted-foreground">(You)</span>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 flex-wrap">
                {u.roles.map((r) => {
                  const cfg = roleConfig[r];
                  return (
                    <span key={r} className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${cfg.class}`}>
                      {cfg.label}
                    </span>
                  );
                })}
              </div>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
              {new Date(u.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(u)}>
                      <Eye className="h-3.5 w-3.5 mr-2" /> View Details
                    </DropdownMenuItem>
                    {(["admin", "manager", "user"] as AppRole[]).filter(r => !u.roles.includes(r)).map((r) => (
                      <DropdownMenuItem key={r} onClick={() => onChangeRole(u.id, r)}>
                        <Shield className="h-3.5 w-3.5 mr-2" /> Set as {roleConfig[r].label}
                      </DropdownMenuItem>
                    ))}
                    {u.id !== currentUserId && (
                      <DropdownMenuItem className="text-destructive" onClick={() => onDelete(u.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Remove User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TableCell>
          </TableRow>
        ))}
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
