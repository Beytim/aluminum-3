import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { formatETB, daysOverdue, type EnhancedInvoice } from "@/data/enhancedFinanceData";

interface Props { invoices: EnhancedInvoice[] }

interface AgingBucket { current: number; d1to30: number; d31to60: number; d61to90: number; d90plus: number }

export default function AgingReport({ invoices }: Props) {
  const { totals, byCustomer } = useMemo(() => {
    const unpaid = invoices.filter(i => !['Paid', 'Cancelled'].includes(i.status) && i.balance > 0);
    const buckets: AgingBucket = { current: 0, d1to30: 0, d31to60: 0, d61to90: 0, d90plus: 0 };
    const custMap: Record<string, { name: string; buckets: AgingBucket }> = {};

    unpaid.forEach(inv => {
      const days = daysOverdue(inv.dueDate);
      const bal = inv.balanceInETB;
      const key = days <= 0 ? 'current' : days <= 30 ? 'd1to30' : days <= 60 ? 'd31to60' : days <= 90 ? 'd61to90' : 'd90plus';
      buckets[key] += bal;
      if (!custMap[inv.customerId]) custMap[inv.customerId] = { name: inv.customerName, buckets: { current: 0, d1to30: 0, d31to60: 0, d61to90: 0, d90plus: 0 } };
      custMap[inv.customerId].buckets[key] += bal;
    });

    return { totals: buckets, byCustomer: Object.values(custMap) };
  }, [invoices]);

  const grandTotal = totals.current + totals.d1to30 + totals.d31to60 + totals.d61to90 + totals.d90plus;
  const bucketLabels = [
    { key: 'current' as const, label: 'Current', color: 'bg-success' },
    { key: 'd1to30' as const, label: '1-30 Days', color: 'bg-warning' },
    { key: 'd31to60' as const, label: '31-60 Days', color: 'bg-orange-500' },
    { key: 'd61to90' as const, label: '61-90 Days', color: 'bg-destructive/70' },
    { key: 'd90plus' as const, label: '90+ Days', color: 'bg-destructive' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {bucketLabels.map(b => (
          <Card key={b.key} className="shadow-card">
            <CardContent className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground">{b.label}</p>
              <p className="text-sm font-bold">{formatETB(totals[b.key])}</p>
              <Progress value={grandTotal > 0 ? (totals[b.key] / grandTotal) * 100 : 0} className="h-1 mt-1" />
              <p className="text-[10px] text-muted-foreground">{grandTotal > 0 ? ((totals[b.key] / grandTotal) * 100).toFixed(0) : 0}%</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader className="py-3 px-4"><CardTitle className="text-sm">Aging by Customer</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Customer</TableHead>
                {bucketLabels.map(b => <TableHead key={b.key} className="text-xs text-right">{b.label}</TableHead>)}
                <TableHead className="text-xs text-right font-bold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byCustomer.map((c, i) => {
                const total = c.buckets.current + c.buckets.d1to30 + c.buckets.d31to60 + c.buckets.d61to90 + c.buckets.d90plus;
                return (
                  <TableRow key={i}>
                    <TableCell className="text-xs font-medium">{c.name}</TableCell>
                    {bucketLabels.map(b => (
                      <TableCell key={b.key} className={`text-xs text-right ${c.buckets[b.key] > 0 ? 'font-medium' : 'text-muted-foreground'}`}>
                        {c.buckets[b.key] > 0 ? formatETB(c.buckets[b.key]) : '—'}
                      </TableCell>
                    ))}
                    <TableCell className="text-xs text-right font-bold">{formatETB(total)}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="bg-muted/30 font-bold">
                <TableCell className="text-xs">Total</TableCell>
                {bucketLabels.map(b => <TableCell key={b.key} className="text-xs text-right">{formatETB(totals[b.key])}</TableCell>)}
                <TableCell className="text-xs text-right">{formatETB(grandTotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
