import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, Clock, DollarSign, Gauge, Package, TrendingUp } from "lucide-react";
import type { ProductionStats as Stats } from "@/data/enhancedProductionData";
import { formatETBShort } from "@/data/enhancedProductionData";

interface Props {
  stats: Stats;
}

export function ProductionStats({ stats }: Props) {
  const cards = [
    {
      label: 'Active Work Orders',
      value: stats.activeWorkOrders,
      sub: `${stats.totalWorkOrders} total · ${stats.completedWorkOrders} completed`,
      icon: Activity,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Completion Rate',
      value: stats.totalWorkOrders > 0 ? `${Math.round((stats.completedWorkOrders / stats.totalWorkOrders) * 100)}%` : '0%',
      sub: `${stats.completedThisMonth} this month`,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Avg Efficiency',
      value: stats.averageEfficiency > 0 ? `${stats.averageEfficiency}%` : 'N/A',
      sub: stats.averageEfficiency === 0 ? 'No data yet' : stats.averageEfficiency >= 90 ? 'Excellent' : stats.averageEfficiency >= 70 ? 'Good' : 'Needs improvement',
      icon: Gauge,
      color: stats.averageEfficiency === 0 ? 'text-muted-foreground' : stats.averageEfficiency >= 90 ? 'text-success' : stats.averageEfficiency >= 70 ? 'text-warning' : 'text-destructive',
      bg: stats.averageEfficiency === 0 ? 'bg-muted' : stats.averageEfficiency >= 90 ? 'bg-success/10' : stats.averageEfficiency >= 70 ? 'bg-warning/10' : 'bg-destructive/10',
    },
    {
      label: 'On-Time Rate',
      value: `${stats.onTimeRate}%`,
      sub: `${stats.overdueCount} overdue`,
      icon: Clock,
      color: stats.onTimeRate >= 85 ? 'text-success' : 'text-warning',
      bg: stats.onTimeRate >= 85 ? 'bg-success/10' : 'bg-warning/10',
    },
    {
      label: 'Material Cost',
      value: formatETBShort(stats.totalMaterialCost),
      sub: 'consumed this period',
      icon: Package,
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      label: 'Labor Cost',
      value: formatETBShort(stats.totalLaborCost),
      sub: 'this period',
      icon: DollarSign,
      color: 'text-chart-4',
      bg: 'bg-chart-4/10',
    },
    {
      label: 'Cost Variance',
      value: stats.costVariance !== 0 ? formatETBShort(Math.abs(stats.costVariance)) : 'ETB 0',
      sub: stats.costVariance === 0 ? 'On budget' : stats.costVariance > 0 ? '✅ Under budget' : '⚠️ Over budget',
      icon: TrendingUp,
      color: stats.costVariance === 0 ? 'text-muted-foreground' : stats.costVariance > 0 ? 'text-success' : 'text-destructive',
      bg: stats.costVariance === 0 ? 'bg-muted' : stats.costVariance > 0 ? 'bg-success/10' : 'bg-destructive/10',
    },
    {
      label: 'At Risk / Blocked',
      value: `${stats.atRiskCount + stats.blockedCount}`,
      sub: `${stats.atRiskCount} at risk · ${stats.blockedCount} blocked`,
      icon: AlertTriangle,
      color: stats.atRiskCount + stats.blockedCount > 0 ? 'text-destructive' : 'text-success',
      bg: stats.atRiskCount + stats.blockedCount > 0 ? 'bg-destructive/10' : 'bg-success/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
      {cards.map((card, i) => (
        <Card key={i} className="shadow-card">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`p-1 rounded ${card.bg}`}>
                <card.icon className={`h-3 w-3 ${card.color}`} />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium truncate">{card.label}</span>
            </div>
            <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
            <p className="text-[10px] text-muted-foreground truncate">{card.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
