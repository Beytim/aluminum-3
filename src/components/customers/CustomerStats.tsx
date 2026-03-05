import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, AlertTriangle, DollarSign, TrendingUp, CreditCard, Activity, UserPlus } from "lucide-react";
import type { EnhancedCustomer } from "@/data/customerTypes";
import { formatETB } from "@/lib/customerHelpers";

interface Props {
  customers: EnhancedCustomer[];
}

export function CustomerStats({ customers }: Props) {
  const active = customers.filter(c => c.status === 'Active').length;
  const inactive = customers.filter(c => c.status === 'Inactive').length;
  const totalValue = customers.reduce((s, c) => s + c.totalValue, 0);
  const totalOutstanding = customers.reduce((s, c) => s + c.outstanding, 0);
  const totalCreditLimit = customers.reduce((s, c) => s + (c.creditLimit || 0), 0);
  const creditUtil = totalCreditLimit > 0 ? Math.round((totalOutstanding / totalCreditLimit) * 100) : 0;

  const healthy = customers.filter(c => c.healthStatus === 'healthy').length;
  const attention = customers.filter(c => c.healthStatus === 'attention').length;
  const atRisk = customers.filter(c => c.healthStatus === 'at-risk').length;
  const critical = customers.filter(c => c.healthStatus === 'critical').length;

  const stats = [
    { label: 'Total Customers', value: customers.length, sub: `${active} active, ${inactive} inactive`, icon: Users, color: 'text-primary' },
    { label: 'Total Value', value: formatETB(totalValue), sub: `Avg: ${formatETB(Math.round(totalValue / Math.max(1, customers.length)))}`, icon: DollarSign, color: 'text-success' },
    { label: 'Outstanding', value: formatETB(totalOutstanding), sub: `${creditUtil}% credit used`, icon: CreditCard, color: 'text-warning' },
    { label: 'Health Overview', value: `${healthy} Healthy`, sub: `${attention} attention, ${atRisk} at-risk`, icon: Activity, color: 'text-info' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <Card key={i} className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">{s.label}</p>
                <p className="text-sm sm:text-lg font-bold mt-0.5 truncate">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{s.sub}</p>
              </div>
              <div className={`h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            {s.label === 'Outstanding' && (
              <Progress value={creditUtil} className="h-1.5 mt-2" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
