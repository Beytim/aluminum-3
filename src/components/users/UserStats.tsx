import { Card, CardContent } from "@/components/ui/card";
import { Users, Crown, UserCog, User, ShieldCheck, Clock } from "lucide-react";

interface UserWithRole {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  roles: ("admin" | "manager" | "user")[];
  created_at: string;
}

interface Props {
  users: UserWithRole[];
}

export function UserStats({ users }: Props) {
  const admins = users.filter(u => u.roles.includes("admin")).length;
  const managers = users.filter(u => u.roles.includes("manager")).length;
  const regularUsers = users.filter(u => u.roles.includes("user") && !u.roles.includes("admin") && !u.roles.includes("manager")).length;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentUsers = users.filter(u => new Date(u.created_at) >= thirtyDaysAgo).length;

  const stats = [
    { label: "Total Users", value: users.length, sub: `${recentUsers} joined last 30 days`, icon: Users, color: "text-primary" },
    { label: "Admins", value: admins, sub: "Full system access", icon: Crown, color: "text-destructive" },
    { label: "Managers", value: managers, sub: "Department access", icon: UserCog, color: "text-warning" },
    { label: "Users", value: regularUsers, sub: "Standard access", icon: User, color: "text-success" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <Card key={s.label} className="shadow-card">
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-lg font-bold text-foreground mt-0.5">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
                </div>
                <div className={`p-1.5 rounded-lg bg-muted/50`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
