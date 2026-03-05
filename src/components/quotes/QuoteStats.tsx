import { Card, CardContent } from "@/components/ui/card";
import { FileText, TrendingUp, Target, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import type { QuoteStats as QuoteStatsType } from "@/data/enhancedQuoteData";
import { formatETBCompact } from "@/data/enhancedQuoteData";

interface QuoteStatsProps {
  stats: QuoteStatsType;
}

export function QuoteStats({ stats }: QuoteStatsProps) {
  const cards = [
    { label: 'Total Quotes', value: stats.totalQuotes, sub: `${stats.pendingQuotes} pending · ${stats.acceptedQuotes} accepted`, icon: FileText, color: 'text-primary' },
    { label: 'Total Value', value: formatETBCompact(stats.totalValue), sub: `Avg ${formatETBCompact(stats.averageValue)}`, icon: TrendingUp, color: 'text-chart-2' },
    { label: 'Conversion Rate', value: `${stats.conversionRate.toFixed(0)}%`, sub: `${stats.acceptedQuotes + stats.convertedQuotes} of ${stats.totalQuotes} converted`, icon: Target, color: 'text-success' },
    { label: 'Avg Margin', value: `${stats.averageMargin.toFixed(0)}%`, sub: stats.averageMargin >= 35 ? 'Healthy margin' : 'Below target', icon: TrendingUp, color: stats.averageMargin >= 35 ? 'text-success' : 'text-warning' },
    { label: 'Expiring Soon', value: stats.expiringThisWeek, sub: `${stats.expiringThisMonth} this month`, icon: AlertTriangle, color: stats.expiringThisWeek > 0 ? 'text-destructive' : 'text-muted-foreground' },
    { label: 'Pending Value', value: formatETBCompact(stats.pendingValue), sub: `${stats.pendingQuotes} quotes awaiting`, icon: Clock, color: 'text-warning' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map(c => (
        <Card key={c.label} className="shadow-card">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <c.icon className={`h-3.5 w-3.5 ${c.color}`} />
              <span className="text-[10px] text-muted-foreground font-medium">{c.label}</span>
            </div>
            <p className="text-lg font-bold text-foreground">{c.value}</p>
            <p className="text-[10px] text-muted-foreground">{c.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
