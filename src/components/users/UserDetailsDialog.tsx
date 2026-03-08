import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, UserCog, User, Calendar, Shield } from "lucide-react";

type AppRole = "admin" | "manager" | "user";

interface UserWithRole {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  roles: AppRole[];
  created_at: string;
}

const roleConfig: Record<AppRole, { label: string; icon: React.ElementType; class: string }> = {
  admin: { label: "Admin", icon: Crown, class: "bg-destructive/10 text-destructive" },
  manager: { label: "Manager", icon: UserCog, class: "bg-warning/10 text-warning" },
  user: { label: "User", icon: User, class: "bg-primary/10 text-primary" },
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithRole | null;
  onChangeRole: (userId: string, role: AppRole) => void;
  isAdmin: boolean;
  currentUserId: string | undefined;
}

export function UserDetailsDialog({ open, onOpenChange, user, onChangeRole, isAdmin, currentUserId }: Props) {
  if (!user) return null;

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">User Details</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 py-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary font-bold">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {user.full_name || "Unnamed User"}
            </h3>
            {user.id === currentUserId && (
              <p className="text-xs text-muted-foreground">This is your account</p>
            )}
            <div className="flex gap-1 mt-1.5">
              {user.roles.map((r) => {
                const cfg = roleConfig[r];
                return (
                  <span key={r} className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${cfg.class}`}>
                    {cfg.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Joined:</span>
            <span className="font-medium text-foreground">{new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Shield className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">User ID:</span>
            <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">{user.id.slice(0, 8)}...</code>
          </div>
        </div>

        {isAdmin && user.id !== currentUserId && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Change Role</p>
              <Select defaultValue={user.roles[0]} onValueChange={(val) => onChangeRole(user.id, val as AppRole)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin — Full system access</SelectItem>
                  <SelectItem value="manager">Manager — Department access</SelectItem>
                  <SelectItem value="user">User — Standard access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
