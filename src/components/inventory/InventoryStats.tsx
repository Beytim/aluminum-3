import { Card, CardContent } from "@/components/ui/card";
import { Package, DollarSign, AlertTriangle, RotateCcw, Scissors, ShieldAlert, TrendingUp, Clock } from "lucide-react";
import { formatETBShort, type InventoryStats as IStats } from "@/data/enhancedInventoryData";

interface Props {
  stats: IStats;
}

export default function InventoryStats({ stats }: Props) {
  const cards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      subtitle: `${stats.activeItems} active · ${stats.lowStockItems} low`,
      icon: Package,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Inventory Value',
      value: formatETBShort(stats.totalValue),
      subtitle: `Avg ${formatETBShort(stats.averageItemValue)}/item`,
      icon: DollarSign,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems + stats.outOfStockItems,
      subtitle: `${stats.outOfStockItems} out of stock · ${stats.lowStockItems} low`,
      icon: AlertTriangle,
      color: stats.lowStockItems + stats.outOfStockItems > 3 ? 'text-destructive' : 'text-warning',
      bg: stats.lowStockItems + stats.outOfStockItems > 3 ? 'bg-destructive/10' : 'bg-warning/10',
    },
    {
      title: 'Turnover Rate',
      value: `${stats.turnoverRate}x`,
      subtitle: `${stats.daysOfStock} avg days of stock`,
      icon: TrendingUp,
      color: 'text-chart-4',
      bg: 'bg-chart-4/10',
    },
    {
      title: 'Items to Reorder',
      value: stats.itemsToReorder,
      subtitle: `Est. ${formatETBShort(stats.estimatedReorderCost)}`,
      icon: RotateCcw,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      title: 'Remnant Value',
      value: formatETBShort(stats.remnantValue),
      subtitle: `${stats.remnantCount} remnant items`,
      icon: Scissors,
      color: 'text-chart-3',
      bg: 'bg-chart-3/10',
    },
    {
      title: 'In Quarantine',
      value: stats.itemsInQuarantine,
      subtitle: 'Pending quality check',
      icon: ShieldAlert,
      color: stats.itemsInQuarantine > 0 ? 'text-warning' : 'text-muted-foreground',
      bg: stats.itemsInQuarantine > 0 ? 'bg-warning/10' : 'bg-muted',
    },
    {
      title: 'Slow Moving',
      value: stats.slowMovingItems,
      subtitle: '> 90 days in stock',
      icon: Clock,
      color: stats.slowMovingItems > 2 ? 'text-destructive' : 'text-muted-foreground',
      bg: stats.slowMovingItems > 2 ? 'bg-destructive/10' : 'bg-muted',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <Card key={i} className="shadow-card">
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[11px] font-medium text-muted-foreground">{card.title}</p>
              <div className={`p-1.5 rounded-md ${card.bg}`}>
                <card.icon className={`h-3.5 w-3.5 ${card.color}`} />
              </div>
            </div>
            <p className="text-lg font-bold text-foreground">{card.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
