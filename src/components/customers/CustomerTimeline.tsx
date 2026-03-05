import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Calendar, FileText, ShoppingCart, Briefcase, DollarSign, MessageSquare } from "lucide-react";
import type { CustomerActivityLog } from "@/data/customerTypes";
import { getRelativeTime } from "@/lib/customerHelpers";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  call: Phone, email: Mail, meeting: Calendar, note: MessageSquare,
  quote: FileText, order: ShoppingCart, project: Briefcase, payment: DollarSign,
};

const colorMap: Record<string, string> = {
  call: 'bg-info/10 text-info', email: 'bg-primary/10 text-primary',
  meeting: 'bg-accent/10 text-accent-foreground', note: 'bg-muted text-muted-foreground',
  quote: 'bg-warning/10 text-warning', order: 'bg-success/10 text-success',
  project: 'bg-primary/10 text-primary', payment: 'bg-success/10 text-success',
};

interface Props {
  activities: CustomerActivityLog[];
}

export function CustomerTimeline({ activities }: Props) {
  const sorted = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sorted.length === 0) {
    return <p className="text-xs text-muted-foreground text-center py-6">No activity yet</p>;
  }

  return (
    <div className="space-y-3">
      {sorted.map((act) => {
        const Icon = iconMap[act.type] || MessageSquare;
        return (
          <div key={act.id} className="flex gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${colorMap[act.type] || 'bg-muted'}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[9px] h-4 capitalize">{act.type}</Badge>
                <span className="text-[10px] text-muted-foreground">{getRelativeTime(act.date)}</span>
              </div>
              <p className="text-xs mt-0.5">{act.description}</p>
              <p className="text-[10px] text-muted-foreground">by {act.user}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
