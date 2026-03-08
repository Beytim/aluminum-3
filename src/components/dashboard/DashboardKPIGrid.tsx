import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign, TrendingUp, Package, Users, ShoppingCart, FileText,
  Wrench, Shield, Truck, Warehouse, Factory, Scissors,
  HardHat, UserCheck, AlertTriangle, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

interface KPICard {
  icon: any;
  label: string;
  value: string;
  sub: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: string;
}

interface Props {
  cards: KPICard[];
}

export default function DashboardKPIGrid({ cards }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((c, i) => (
        <Card key={i} className="shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
          <CardContent className="p-3 relative">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.04]">
              <c.icon className="w-full h-full" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-7 w-7 rounded flex items-center justify-center ${c.color}`}>
                <c.icon className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{c.label}</span>
            </div>
            <p className="text-lg font-bold text-foreground">{c.value}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {c.trend === 'up' && <ArrowUpRight className="h-3 w-3 text-success" />}
              {c.trend === 'down' && <ArrowDownRight className="h-3 w-3 text-destructive" />}
              <p className="text-[10px] text-muted-foreground">{c.trendValue || c.sub}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export { DollarSign, TrendingUp, Package, Users, ShoppingCart, FileText, Wrench, Shield, Truck, Warehouse, Factory, Scissors, HardHat, UserCheck, AlertTriangle };
