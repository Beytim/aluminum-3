import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, Star, Clock, Globe, DollarSign, TrendingUp, Award } from "lucide-react";
import type { SupplierStats as Stats } from "@/hooks/useSuppliers";

interface Props {
  stats: Stats;
}

const formatETBShort = (n: number) => {
  if (n >= 1_000_000) return `ETB ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `ETB ${(n / 1_000).toFixed(0)}K`;
  return `ETB ${n.toLocaleString()}`;
};

export default function SupplierStats({ stats }: Props) {
  const cards = [
    { icon: Users, label: 'Total Suppliers', value: String(stats.total), sub: `${Object.keys(stats.byCountry).length} countries`, color: 'bg-primary' },
    { icon: CheckCircle, label: 'Active', value: String(stats.active), sub: `${stats.total - stats.active} inactive`, color: 'bg-chart-2' },
    { icon: Award, label: 'Preferred', value: String(stats.preferred), sub: 'Top-rated suppliers', color: 'bg-chart-3' },
    { icon: Star, label: 'Avg Rating', value: stats.avgRating.toFixed(1), sub: 'Out of 5.0', color: 'bg-chart-4' },
    { icon: Clock, label: 'Avg Lead Time', value: `${Math.round(stats.avgLeadTime)}d`, sub: 'Across all suppliers', color: 'bg-chart-5' },
    { icon: DollarSign, label: 'Total Spent', value: formatETBShort(stats.totalSpent), sub: `${stats.total} suppliers`, color: 'bg-chart-1' },
    { icon: Globe, label: 'Top Country', value: Object.entries(stats.byCountry).sort((a, b) => b[1] - a[1])[0]?.[0] || '—', sub: `${Object.entries(stats.byCountry).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} suppliers`, color: 'bg-accent' },
    { icon: TrendingUp, label: 'Status Mix', value: `${stats.byStatus['Active'] || 0}/${stats.byStatus['Pending'] || 0}`, sub: 'Active / Pending', color: 'bg-destructive' },
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
