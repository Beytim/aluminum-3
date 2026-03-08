import { Card, CardContent } from "@/components/ui/card";
import { Wrench, AlertTriangle, Clock, DollarSign, Activity, Heart, CheckCircle, TrendingUp } from "lucide-react";
import type { MaintenanceStats as MStats } from "@/data/enhancedMaintenanceData";
import { formatETB, getHealthColor } from "@/data/enhancedMaintenanceData";

interface Props { stats: MStats; }

export function MaintenanceStats({ stats }: Props) {
  const cards = [
    { label: 'Total Tasks', value: stats.totalTasks, sub: `${stats.openTasks} open · ${stats.inProgressTasks} active`, icon: Wrench, color: 'text-primary bg-primary/10' },
    { label: 'Overdue', value: stats.overdueTasks, sub: `${stats.criticalTasks} critical`, icon: AlertTriangle, color: stats.overdueTasks > 0 ? 'text-destructive bg-destructive/10' : 'text-muted-foreground bg-muted' },
    { label: 'Critical', value: stats.criticalTasks, sub: `${stats.emergencyTasks} emergency`, icon: AlertTriangle, color: stats.criticalTasks > 0 ? 'text-orange-500 bg-orange-500/10' : 'text-muted-foreground bg-muted' },
    { label: 'MTD Cost', value: formatETB(stats.totalCostMTD), sub: `Parts ${formatETB(stats.partsCostMTD)} · Labor ${formatETB(stats.laborCostMTD)}`, icon: DollarSign, color: 'text-warning bg-warning/10' },
    { label: 'Downtime', value: `${stats.totalDowntimeHours}hrs`, sub: `${stats.equipmentWithIssues} equipment affected`, icon: Clock, color: stats.totalDowntimeHours > 20 ? 'text-destructive bg-destructive/10' : 'text-info bg-info/10' },
    { label: 'Equip. Health', value: `${stats.averageHealthScore}%`, sub: `${stats.totalEquipment} total · ${stats.equipmentWithIssues} issues`, icon: Heart, color: `${getHealthColor(stats.averageHealthScore)} bg-success/10` },
    { label: 'Preventive %', value: stats.totalTasks > 0 ? `${Math.round((stats.preventiveTasks / stats.totalTasks) * 100)}%` : '0%', sub: `${stats.preventiveTasks} preventive · ${stats.correctiveTasks} corrective`, icon: Activity, color: 'text-success bg-success/10' },
    { label: 'Completion', value: `${stats.completionRate}%`, sub: `${stats.completedTasks} completed`, icon: CheckCircle, color: stats.completionRate >= 80 ? 'text-success bg-success/10' : 'text-warning bg-warning/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map(c => (
        <Card key={c.label} className="shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`p-1.5 rounded-md ${c.color}`}><c.icon className="h-3.5 w-3.5" /></div>
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
