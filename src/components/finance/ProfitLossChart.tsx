import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { formatETB, formatETBShort, type EnhancedInvoice, type Expense } from "@/data/enhancedFinanceData";

interface Props { invoices: EnhancedInvoice[]; expenses: Expense[] }

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function ProfitLossChart({ invoices, expenses }: Props) {
  const { plData, categoryData, summary } = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar'];
    const plData = months.map((m, idx) => {
      const rev = invoices.filter(i => new Date(i.issueDate).getMonth() === idx).reduce((s, i) => s + i.totalInETB, 0);
      const exp = expenses.filter(e => new Date(e.date).getMonth() === idx).reduce((s, e) => s + e.amountInETB, 0);
      return { month: m, Revenue: rev, Expenses: exp, Profit: rev - exp };
    });

    const catMap: Record<string, number> = {};
    expenses.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amountInETB; });
    const categoryData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

    const totalRev = invoices.reduce((s, i) => s + i.totalInETB, 0);
    const totalExp = expenses.reduce((s, e) => s + e.amountInETB, 0);

    return { plData, categoryData, summary: { revenue: totalRev, expenses: totalExp, profit: totalRev - totalExp, margin: totalRev > 0 ? ((totalRev - totalExp) / totalRev * 100) : 0 } };
  }, [invoices, expenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="shadow-card">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Revenue vs Expenses</CardTitle>
          <div className="flex gap-4 text-[10px] text-muted-foreground">
            <span>Revenue: {formatETBShort(summary.revenue)}</span>
            <span>Expenses: {formatETBShort(summary.expenses)}</span>
            <span className={summary.profit >= 0 ? 'text-success' : 'text-destructive'}>Profit: {formatETBShort(summary.profit)} ({summary.margin.toFixed(1)}%)</span>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={plData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => formatETBShort(v)} />
              <Tooltip formatter={(v: number) => formatETB(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Revenue" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="py-3 px-4"><CardTitle className="text-sm">Expense Breakdown</CardTitle></CardHeader>
        <CardContent className="p-3">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatETB(v)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
