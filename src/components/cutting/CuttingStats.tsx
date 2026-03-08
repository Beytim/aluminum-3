import { Card, CardContent } from "@/components/ui/card";
import { Scissors, AlertTriangle, CheckCircle, Clock, TrendingUp, Recycle, Gauge, DollarSign } from "lucide-react";
import type { CuttingStats as CuttingStatsType } from "@/data/enhancedProductionData";
import { formatETBShort } from "@/data/enhancedProductionData";

interface Props {
  stats: CuttingStatsType;
}

export function CuttingStats({ stats }: Props) {
  const cards = [
    {
      label: 'Total Jobs',
      value: stats.totalJobs,
      sub: `${stats.pendingJobs} pending · ${stats.inProgressJobs} active`,
      icon: Scissors,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Completed',
      value: stats.completedJobs,
      sub: `${stats.totalCuts} total cuts made`,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Avg Efficiency',
      value: `${stats.averageEfficiency}%`,
      sub: stats.averageEfficiency >= 90 ? 'Excellent' : stats.averageEfficiency >= 80 ? 'Good' : 'Needs improvement',
      icon: Gauge,
      color: stats.averageEfficiency >= 90 ? 'text-success' : stats.averageEfficiency >= 80 ? 'text-warning' : 'text-destructive',
      bg: stats.averageEfficiency >= 90 ? 'bg-success/10' : stats.averageEfficiency >= 80 ? 'bg-warning/10' : 'bg-destructive/10',
    },
    {
      label: 'Avg Waste',
      value: `${stats.averageWastePercent}%`,
      sub: `${stats.totalWaste}mm total waste`,
      icon: AlertTriangle,
      color: stats.averageWastePercent <= 5 ? 'text-success' : stats.averageWastePercent <= 10 ? 'text-warning' : 'text-destructive',
      bg: stats.averageWastePercent <= 5 ? 'bg-success/10' : stats.averageWastePercent <= 10 ? 'bg-warning/10' : 'bg-destructive/10',
    },
    {
      label: 'Material Cost',
      value: formatETBShort(stats.totalMaterialCost),
      sub: 'Total material consumed',
      icon: DollarSign,
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      label: 'Waste Cost',
      value: formatETBShort(stats.totalWasteCost),
      sub: `${((stats.totalWasteCost / (stats.totalMaterialCost || 1)) * 100).toFixed(1)}% of material`,
      icon: TrendingUp,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    {
      label: 'Remnants',
      value: `${stats.reusableRemnants}/${stats.remnantsCreated}`,
      sub: `${stats.reusableRemnants} reusable pieces`,
      icon: Recycle,
      color: 'text-chart-4',
      bg: 'bg-chart-4/10',
    },
    {
      label: 'Stock Used',
      value: `${(stats.totalStockUsed / 1000).toFixed(1)}m`,
      sub: `${stats.totalCuts} cuts from stock`,
      icon: Clock,
      color: 'text-muted-foreground',
      bg: 'bg-muted',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
      {cards.map((card, i) => (
        <Card key={i} className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`p-1 rounded ${card.bg}`}>
                <card.icon className={`h-3 w-3 ${card.color}`} />
              </div>
              <p className="text-[10px] text-muted-foreground font-medium truncate">{card.label}</p>
            </div>
            <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
            <p className="text-[9px] text-muted-foreground truncate">{card.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
