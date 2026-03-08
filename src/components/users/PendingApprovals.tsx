import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PendingUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface Props {
  pendingUsers: PendingUser[];
  onRefresh: () => void;
  currentUserId: string | undefined;
}

export function PendingApprovals({ pendingUsers, onRefresh, currentUserId }: Props) {
  const { toast } = useToast();

  const handleApprove = async (userId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ approved: true })
      .eq("id", userId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Log activity
      await supabase.from("activity_log").insert({
        actor_id: currentUserId,
        action: "user_approved",
        target_user_id: userId,
        details: {},
      });
      toast({ title: "User approved", description: "User can now access the system." });
      onRefresh();
    }
  };

  const handleReject = async (userId: string) => {
    // Delete the user's roles and profile
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await supabase.from("activity_log").insert({
        actor_id: currentUserId,
        action: "user_removed",
        target_user_id: userId,
        details: { reason: "rejected" },
      });
      toast({ title: "User rejected", description: "User has been removed." });
      onRefresh();
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (pendingUsers.length === 0) return null;

  return (
    <Card className="shadow-card border-warning/30 bg-warning/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-warning" />
          Pending Approvals
          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-warning/20 text-warning">
            {pendingUsers.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {pendingUsers.map((u) => (
          <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg bg-background border">
            <Avatar className="h-8 w-8">
              <AvatarImage src={u.avatar_url || undefined} />
              <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-semibold">
                {getInitials(u.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {u.full_name || "Unnamed User"}
              </p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {new Date(u.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                className="h-7 text-[10px] gap-1"
                onClick={() => handleApprove(u.id)}
              >
                <CheckCircle className="h-3 w-3" /> Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[10px] gap-1 text-destructive hover:text-destructive"
                onClick={() => handleReject(u.id)}
              >
                <XCircle className="h-3 w-3" /> Reject
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
