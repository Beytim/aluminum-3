import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Briefcase, TrendingUp, AlertTriangle, CalendarClock, CheckCircle2, DollarSign } from "lucide-react";
import type { ProjectStats as Stats } from "@/data/enhancedProjectData";
import { formatETBShort } from "@/data/enhancedProjectData";

interface Props {
  stats: Stats;
}

export function ProjectStats({ stats }: Props) {
  const cards = [
    { icon: Briefcase, label: 'Total Projects', value: String(stats.totalProjects), sub: `${stats.activeProjects} active`, color: 'bg-primary' },
    { icon: DollarSign, label: 'Total Value', value: formatETBShort(stats.totalValue), sub: `Avg ${formatETBShort(stats.averageValue)}`, color: 'bg-chart-3' },
    { icon: TrendingUp, label: 'Avg Progress', value: `${stats.averageProgress.toFixed(0)}%`, progress: stats.averageProgress, color: 'bg-chart-2' },
    { icon: AlertTriangle, label: 'At Risk', value: String(stats.atRiskProjects + stats.overdueProjects), sub: `${stats.overdueProjects} overdue`, color: 'bg-destructive' },
    { icon: CalendarClock, label: 'Due This Month', value: String(stats.dueThisMonth), sub: `${stats.startingThisMonth} starting`, color: 'bg-warning' },
    { icon: CheckCircle2, label: 'Completed', value: String(stats.completedProjects), sub: `${stats.completingThisMonth} this month`, color: 'bg-success' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map(c => (
        <Card key={c.label} className="shadow-card">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-7 w-7 rounded flex items-center justify-center ${c.color}`}>
                <c.icon className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{c.label}</span>
            </div>
            <p className="text-lg font-bold text-foreground">{c.value}</p>
            {c.progress !== undefined && <Progress value={c.progress} className="h-1.5 mt-1" />}
            {c.sub && <p className="text-[10px] text-muted-foreground mt-0.5">{c.sub}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
