import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getHealthColor, getHealthBgColor } from "@/lib/customerHelpers";
import type { EnhancedCustomer } from "@/data/customerTypes";

interface Props {
  customer: EnhancedCustomer;
}

export function CustomerHealth({ customer }: Props) {
  const factors = [
    { label: 'Payment History', value: customer.paymentHistory ? Math.round(100 - (customer.paymentHistory.late / Math.max(1, customer.paymentHistory.onTime + customer.paymentHistory.late)) * 100) : 70, weight: '40%' },
    { label: 'Project Value', value: Math.min(100, Math.round((customer.totalValue / 5000000) * 100)), weight: '25%' },
    { label: 'Frequency', value: Math.min(100, Math.round((customer.projects / 10) * 100)), weight: '20%' },
    { label: 'Outstanding Ratio', value: customer.totalValue > 0 ? Math.round((1 - customer.outstanding / customer.totalValue) * 100) : 100, weight: '15%' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className={`relative h-16 w-16 rounded-full flex items-center justify-center ${getHealthBgColor(customer.healthStatus)}`}>
          <span className={`text-lg font-bold ${getHealthColor(customer.healthStatus)}`}>{customer.healthScore}</span>
        </div>
        <div>
          <Badge className={`text-xs capitalize ${getHealthBgColor(customer.healthStatus)} ${getHealthColor(customer.healthStatus)} border-0`}>
            {customer.healthStatus}
          </Badge>
          <p className="text-[10px] text-muted-foreground mt-1">Customer Health Score</p>
        </div>
      </div>

      <div className="space-y-2">
        {factors.map(f => (
          <div key={f.label}>
            <div className="flex justify-between text-[10px] mb-0.5">
              <span className="text-muted-foreground">{f.label} ({f.weight})</span>
              <span className="font-medium">{f.value}%</span>
            </div>
            <Progress value={f.value} className="h-1.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
