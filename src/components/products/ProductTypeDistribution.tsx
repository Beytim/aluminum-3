import { Card, CardContent } from "@/components/ui/card";
import type { ProductStats } from "@/hooks/useProducts";

interface Props {
  stats: ProductStats;
  total: number;
}

const typeBar = [
  { key: 'Raw Material', label: 'Raw Material', color: 'bg-chart-1' },
  { key: 'Fabricated', label: 'Fabricated', color: 'bg-chart-3' },
  { key: 'System', label: 'Systems', color: 'bg-chart-2' },
  { key: 'Custom', label: 'Custom', color: 'bg-chart-4' },
];

export default function ProductTypeDistribution({ stats, total }: Props) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-3">
        <p className="text-xs font-semibold text-foreground mb-2">Product Type Distribution</p>
        <div className="flex h-3 rounded-full overflow-hidden bg-muted">
          {typeBar.map(tb => {
            const count = stats.byType[tb.key]?.count || 0;
            return count > 0 ? (
              <div key={tb.key} className={`${tb.color} transition-all`} style={{ width: `${(count / (total || 1)) * 100}%` }} title={`${tb.label}: ${count}`} />
            ) : null;
          })}
        </div>
        <div className="flex gap-4 mt-2 flex-wrap">
          {typeBar.map(tb => (
            <div key={tb.key} className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${tb.color}`} />
              <span className="text-[10px] text-muted-foreground">{tb.label} <span className="font-semibold text-foreground">{stats.byType[tb.key]?.count || 0}</span></span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
