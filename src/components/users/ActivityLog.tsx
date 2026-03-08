import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, UserPlus, UserMinus, Clock, Crown, UserCog, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LogEntry {
  id: string;
  actor_id: string;
  action: string;
  target_user_id: string | null;
  details: Record<string, any>;
  created_at: string;
}

interface Props {
  refreshTrigger: number;
  userMap: Map<string, string>; // userId -> displayName
}

const actionConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  role_changed: { icon: Shield, label: "Role Changed", color: "text-warning" },
  user_created: { icon: UserPlus, label: "User Joined", color: "text-success" },
  user_removed: { icon: UserMinus, label: "User Removed", color: "text-destructive" },
  bulk_role_change: { icon: Crown, label: "Bulk Role Change", color: "text-primary" },
};

export function ActivityLog({ refreshTrigger, userMap }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) setLogs(data as LogEntry[]);
      setLoading(false);
    };
    fetchLogs();
  }, [refreshTrigger]);

  const getName = (id: string | null) => {
    if (!id) return "Unknown";
    return userMap.get(id) || id.slice(0, 8) + "...";
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const roleLabel = (role: string) => {
    const labels: Record<string, string> = { admin: "Admin", manager: "Manager", user: "User" };
    return labels[role] || role;
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-xs text-muted-foreground">No activity recorded yet.</p>
            <p className="text-[10px] text-muted-foreground mt-1">Role changes will appear here.</p>
          </div>
        ) : (
          <ScrollArea className="h-[320px]">
            <div className="divide-y divide-border">
              {logs.map((log) => {
                const config = actionConfig[log.action] || { icon: Shield, label: log.action, color: "text-muted-foreground" };
                const Icon = config.icon;
                return (
                  <div key={log.id} className="px-4 py-3 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                    <div className={`mt-0.5 p-1.5 rounded-md bg-muted/50`}>
                      <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground">
                        <span className="font-medium">{getName(log.actor_id)}</span>
                        {" "}
                        {log.action === "role_changed" && log.details && (
                          <>
                            changed <span className="font-medium">{getName(log.target_user_id)}</span>'s role
                            {log.details.from_role && (
                              <> from <Badge variant="outline" className="text-[9px] px-1 py-0 mx-0.5">{roleLabel(log.details.from_role)}</Badge></>
                            )}
                            {" "}to <Badge variant="secondary" className="text-[9px] px-1 py-0 mx-0.5">{roleLabel(log.details.to_role)}</Badge>
                          </>
                        )}
                        {log.action === "bulk_role_change" && log.details && (
                          <>
                            bulk-changed {log.details.count} user(s) to <Badge variant="secondary" className="text-[9px] px-1 py-0 mx-0.5">{roleLabel(log.details.to_role)}</Badge>
                          </>
                        )}
                        {!["role_changed", "bulk_role_change"].includes(log.action) && (
                          <span className="text-muted-foreground"> {config.label.toLowerCase()}</span>
                        )}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{formatTime(log.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
