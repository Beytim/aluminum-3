import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatETBShort, type EnhancedPayment, type Expense } from "@/data/enhancedFinanceData";

interface Props { payments: EnhancedPayment[]; expenses: Expense[] }

export default function CashFlowChart({ payments, expenses }: Props) {
  const data = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((m, idx) => {
      const inflow = payments.filter(p => new Date(p.date).getMonth() === idx).reduce((s, p) => s + p.amountInETB, 0);
      const outflow = expenses.filter(e => new Date(e.date).getMonth() === idx).reduce((s, e) => s + e.amountInETB, 0);
      return { month: m, Inflow: inflow, Outflow: outflow, Net: inflow - outflow };
    });
  }, [payments, expenses]);

  return (
    <Card className="shadow-card">
      <CardHeader className="py-3 px-4"><CardTitle className="text-sm">Cash Flow</CardTitle></CardHeader>
      <CardContent className="p-3">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => formatETBShort(v)} />
            <Tooltip formatter={(v: number) => formatETBShort(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Inflow" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Outflow" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
