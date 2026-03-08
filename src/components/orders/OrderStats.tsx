import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, DollarSign, TrendingUp, AlertCircle, Truck, CheckCircle, CalendarDays, CreditCard } from "lucide-react";
import type { OrderStats as Stats } from "@/data/enhancedOrderData";
import { formatETB } from "@/data/enhancedOrderData";

interface Props { stats: Stats; }

export function OrderStats({ stats }: Props) {
  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, sub: `${stats.processingCount} processing · ${stats.shippedCount} shipped`, icon: ShoppingCart, color: 'text-primary' },
    { label: 'Total Value', value: formatETB(stats.totalValue), sub: `Avg ${formatETB(stats.totalOrders > 0 ? stats.totalValue / stats.totalOrders : 0)}`, icon: DollarSign, color: 'text-success' },
    { label: 'Total Profit', value: formatETB(stats.totalProfit), sub: `${stats.averageMargin.toFixed(1)}% avg margin`, icon: TrendingUp, color: 'text-info' },
    { label: 'Receivable', value: formatETB(stats.receivable), sub: `${stats.overdueCount} overdue`, icon: AlertCircle, color: stats.overdueCount > 0 ? 'text-destructive' : 'text-warning' },
    { label: 'To Ship', value: stats.toShip, sub: 'Ready for delivery', icon: Truck, color: 'text-accent-foreground' },
    { label: 'Completed', value: stats.completedOrders, sub: `of ${stats.totalOrders} total`, icon: CheckCircle, color: 'text-success' },
    { label: 'This Month', value: stats.thisMonthOrders, sub: formatETB(stats.thisMonthValue), icon: CalendarDays, color: 'text-primary' },
    { label: 'Payments', value: `${stats.paidCount}/${stats.totalOrders}`, sub: `${stats.partialCount} partial · ${stats.unpaidCount} unpaid`, icon: CreditCard, color: 'text-info' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(c => (
        <Card key={c.label} className="shadow-card">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <c.icon className={`h-4 w-4 ${c.color}`} />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{c.label}</span>
            </div>
            <p className="text-lg font-bold text-foreground">{c.value}</p>
            <p className="text-[10px] text-muted-foreground">{c.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
