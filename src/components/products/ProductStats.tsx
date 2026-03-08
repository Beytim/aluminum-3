import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Package, Layers, AlertTriangle, Box, Wrench, BarChart3 } from "lucide-react";
import type { ProductStats as Stats } from "@/hooks/useProducts";
import { formatETBShort } from "@/hooks/useProducts";

interface Props {
  stats: Stats;
}

export default function ProductStats({ stats }: Props) {
  const cards = [
    { icon: DollarSign, label: 'Revenue Potential', value: formatETBShort(stats.totalRevenuePotential), sub: `Cost: ${formatETBShort(stats.totalInventoryValue)}`, color: 'bg-primary' },
    { icon: TrendingUp, label: 'Avg Margin', value: `${stats.avgMargin.toFixed(0)}%`, sub: `${stats.totalProducts} products`, color: 'bg-chart-3' },
    { icon: Package, label: 'Active Products', value: String(stats.activeProducts), sub: `${stats.inactiveProducts} inactive`, color: 'bg-chart-2' },
    { icon: Layers, label: 'Inventory Value', value: formatETBShort(stats.totalInventoryValue), sub: `${stats.totalProducts} SKUs`, color: 'bg-chart-4' },
    { icon: AlertTriangle, label: 'Low Stock', value: String(stats.lowStockCount), sub: `${stats.criticalStockCount} critical`, color: 'bg-destructive' },
    { icon: Box, label: 'Raw Materials', value: String(stats.byType['Raw Material']?.count || 0), sub: `Margin: ${(stats.byType['Raw Material']?.margin || 0).toFixed(0)}%`, color: 'bg-chart-1' },
    { icon: Wrench, label: 'Fabricated', value: String(stats.byType['Fabricated']?.count || 0), sub: `Margin: ${(stats.byType['Fabricated']?.margin || 0).toFixed(0)}%`, color: 'bg-chart-5' },
    { icon: BarChart3, label: 'Systems & Custom', value: String((stats.byType['System']?.count || 0) + (stats.byType['Custom']?.count || 0)), sub: `${Object.keys(stats.byCategory).length} categories`, color: 'bg-accent' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            <p className="text-[10px] text-muted-foreground mt-0.5">{c.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
