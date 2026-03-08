import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, AlertTriangle, Users, Star, TrendingUp, CalendarDays } from "lucide-react";
import type { InstallationStats as IStats } from "@/data/enhancedInstallationData";

interface Props {
  stats: IStats;
}

export function InstallationStats({ stats }: Props) {
  const cards = [
    { label: 'Total', value: stats.totalInstallations, sub: `${stats.scheduledInstallations} scheduled · ${stats.inProgressInstallations} active`, icon: Calendar, color: 'text-primary bg-primary/10' },
    { label: "Today's", value: stats.todayInstallations, sub: `${stats.thisWeekInstallations} this week`, icon: CalendarDays, color: 'text-info bg-info/10' },
    { label: 'Completed', value: stats.completedInstallations, sub: `${stats.onTimeRate}% on-time`, icon: CheckCircle, color: 'text-success bg-success/10' },
    { label: 'Delayed', value: stats.delayedInstallations, sub: `${stats.urgentInstallations} urgent`, icon: AlertTriangle, color: stats.delayedInstallations > 0 ? 'text-destructive bg-destructive/10' : 'text-muted-foreground bg-muted' },
    { label: 'Issues', value: stats.installationsWithIssues, sub: `${stats.unresolvedIssues} unresolved`, icon: AlertTriangle, color: stats.unresolvedIssues > 0 ? 'text-warning bg-warning/10' : 'text-muted-foreground bg-muted' },
    { label: 'On-Time Rate', value: `${stats.onTimeRate}%`, sub: `Avg ${stats.averageCompletionTime.toFixed(0)}hrs`, icon: Clock, color: stats.onTimeRate >= 80 ? 'text-success bg-success/10' : 'text-warning bg-warning/10' },
    { label: 'Satisfaction', value: stats.customerSatisfaction > 0 ? `${stats.customerSatisfaction}/5` : 'N/A', sub: stats.customerSatisfaction >= 4 ? 'Excellent' : stats.customerSatisfaction >= 3 ? 'Good' : 'Needs improvement', icon: Star, color: 'text-warning bg-warning/10' },
    { label: 'Upcoming', value: stats.upcomingWeek, sub: `${stats.thisMonthInstallations} this month`, icon: TrendingUp, color: 'text-primary bg-primary/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map(c => (
        <Card key={c.label} className="shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`p-1.5 rounded-md ${c.color}`}>
                <c.icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{c.label}</span>
            </div>
            <p className="text-lg font-bold text-foreground">{c.value}</p>
            <p className="text-[10px] text-muted-foreground truncate">{c.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
