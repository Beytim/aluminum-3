import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertTriangle, Wallet, BarChart3, Clock, FileText, CreditCard } from "lucide-react";
import { formatETB, formatETBShort, type FinanceStats as Stats } from "@/data/enhancedFinanceData";

interface Props { stats: Stats }

const cards = [
  { key: 'revenue', label: 'Revenue MTD', icon: DollarSign, color: 'bg-success/10 text-success', getValue: (s: Stats) => formatETBShort(s.totalRevenueMTD), getSub: (s: Stats) => `YTD: ${formatETBShort(s.totalRevenueYTD)}` },
  { key: 'receivables', label: 'Receivables', icon: TrendingUp, color: 'bg-warning/10 text-warning', getValue: (s: Stats) => formatETBShort(s.totalReceivables), getSub: (s: Stats) => `${s.unpaidInvoices} unpaid invoices` },
  { key: 'overdue', label: 'Overdue', icon: AlertTriangle, color: 'bg-destructive/10 text-destructive', getValue: (s: Stats) => formatETBShort(s.overdueReceivables), getSub: (s: Stats) => `${s.overdueInvoices} overdue invoices` },
  { key: 'cash', label: 'Cash Balance', icon: Wallet, color: 'bg-primary/10 text-primary', getValue: (s: Stats) => formatETBShort(s.currentCashBalance), getSub: () => 'Estimated position' },
  { key: 'margin', label: 'Gross Margin', icon: BarChart3, color: 'bg-info/10 text-info', getValue: (s: Stats) => `${s.grossMarginMTD.toFixed(1)}%`, getSub: (s: Stats) => `Profit: ${formatETBShort(s.grossProfitMTD)}` },
  { key: 'dso', label: 'Avg DSO', icon: Clock, color: 'bg-accent/10 text-accent', getValue: (s: Stats) => `${s.avgDaysOutstanding} days`, getSub: () => 'Days Sales Outstanding' },
  { key: 'invoices', label: 'Invoices MTD', icon: FileText, color: 'bg-primary/10 text-primary', getValue: (s: Stats) => String(s.totalInvoices), getSub: (s: Stats) => `${s.paidInvoices} paid / ${s.unpaidInvoices} unpaid` },
  { key: 'payments', label: 'Payments MTD', icon: CreditCard, color: 'bg-success/10 text-success', getValue: (s: Stats) => formatETBShort(s.totalPaymentsMTD), getSub: (s: Stats) => `Expenses: ${formatETBShort(s.totalExpensesMTD)}` },
];

export default function FinanceStatsComponent({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(c => (
        <Card key={c.key} className="shadow-card">
          <CardContent className="p-3 flex items-center gap-2.5">
            <div className={`h-9 w-9 rounded-lg ${c.color} flex items-center justify-center shrink-0`}>
              <c.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground truncate">{c.label}</p>
              <p className="text-sm font-bold truncate">{c.getValue(stats)}</p>
              <p className="text-[10px] text-muted-foreground truncate">{c.getSub(stats)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
