import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ReportKPI {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  color: string;
}

interface Props { kpis: ReportKPI[] }

export default function ReportKPIs({ kpis }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {kpis.map((k) => (
        <Card key={k.label} className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-md ${k.color}`}>
                <k.icon className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium truncate">{k.label}</span>
            </div>
            <p className="text-base font-bold text-foreground">{k.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {k.trend === 'up' ? <TrendingUp className="h-3 w-3 text-success" /> : k.trend === 'down' ? <TrendingDown className="h-3 w-3 text-destructive" /> : <Minus className="h-3 w-3 text-muted-foreground" />}
              <span className="text-[10px] text-muted-foreground">{k.trendValue}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{k.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
