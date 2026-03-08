import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

export interface ReportCard {
  title: string;
  icon: LucideIcon;
  desc: string;
  category: string;
  dataPoints: number;
  onClick: () => void;
}

interface Props { cards: ReportCard[] }

export default function ReportCardGrid({ cards }: Props) {
  const categoryColors: Record<string, string> = {
    Finance: 'bg-chart-1/10 text-chart-1',
    Operations: 'bg-chart-2/10 text-chart-2',
    Quality: 'bg-chart-3/10 text-chart-3',
    HR: 'bg-chart-4/10 text-chart-4',
    Inventory: 'bg-chart-5/10 text-chart-5',
    Sales: 'bg-primary/10 text-primary',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {cards.map((r) => (
        <Card key={r.title} className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group" onClick={r.onClick}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <r.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
              <Badge variant="secondary" className={`text-[9px] ${categoryColors[r.category] || ''}`}>{r.category}</Badge>
            </div>
            <h3 className="text-sm font-semibold text-foreground">{r.title}</h3>
            <p className="text-[11px] text-muted-foreground mt-1">{r.desc}</p>
            <p className="text-[10px] text-muted-foreground mt-2">{r.dataPoints} data points</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
