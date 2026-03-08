import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Shield, Crown, UserCog, User } from "lucide-react";

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
  user: UserWithRole;
  onView: (user: UserWithRole) => void;
  onChangeRole: (userId: string, role: AppRole) => void;
  isAdmin: boolean;
  currentUserId: string | undefined;
}

export function UserCard({ user: u, onView, onChangeRole, isAdmin, currentUserId }: Props) {
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <Card className="shadow-card hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(u)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={u.avatar_url || undefined} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {getInitials(u.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">
                {u.full_name || "Unnamed User"}
                {u.id === currentUserId && <span className="text-[10px] text-muted-foreground ml-1">(You)</span>}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Joined {new Date(u.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex gap-1 mt-3">
          {u.roles.map((r) => {
            const cfg = roleConfig[r];
            return (
              <span key={r} className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${cfg.class}`}>
                {cfg.label}
              </span>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
