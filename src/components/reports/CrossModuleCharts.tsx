import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
const fmtK = (v: number) => v >= 1_000_000 ? `${(v/1e6).toFixed(1)}M` : v >= 1_000 ? `${(v/1e3).toFixed(0)}K` : String(v);

interface Props {
  revenueVsCost: { month: string; revenue: number; cost: number; profit: number }[];
  ordersByStatus: { name: string; value: number }[];
  qualityTrend: { month: string; passRate: number; defectRate: number }[];
  productionPipeline: { stage: string; count: number }[];
  expenseBreakdown: { name: string; value: number }[];
  moduleHealth: { module: string; score: number }[];
  customerRevenue: { name: string; revenue: number; orders: number }[];
  inventoryByCategory: { category: string; value: number; qty: number }[];
}

export default function CrossModuleCharts({
  revenueVsCost, ordersByStatus, qualityTrend, productionPipeline,
  expenseBreakdown, moduleHealth, customerRevenue, inventoryByCategory,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Row 1: Revenue + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="py-3 px-4"><CardTitle className="text-sm">Revenue vs Cost & Profit Trend</CardTitle></CardHeader>
          <CardContent className="p-3">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueVsCost}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => fmtK(v)} />
                <Tooltip formatter={(v: number) => `ETB ${v.toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="revenue" stackId="1" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" fillOpacity={0.3} name="Revenue" />
                <Area type="monotone" dataKey="cost" stackId="2" fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" fillOpacity={0.3} name="Cost" />
                <Line type="monotone" dataKey="profit" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 3 }} name="Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="py-3 px-4"><CardTitle className="text-sm">Orders by Status</CardTitle></CardHeader>
          <CardContent className="p-3">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={ordersByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => v} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Quality + Production */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="py-3 px-4"><CardTitle className="text-sm">Quality Trend (Pass Rate %)</CardTitle></CardHeader>
          <CardContent className="p-3">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={qualityTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="passRate" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 3 }} name="Pass Rate" />
                <Line type="monotone" dataKey="defectRate" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 3 }} name="Defect Rate" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="py-3 px-4"><CardTitle className="text-sm">Production Pipeline</CardTitle></CardHeader>
          <CardContent className="p-3">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={productionPipeline} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 10 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Expenses + Module Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader className="py-3 px-4"><CardTitle className="text-sm">Expense Breakdown</CardTitle></CardHeader>
          <CardContent className="p-3">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={expenseBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {expenseBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `ETB ${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="py-3 px-4"><CardTitle className="text-sm">Module Health Score</CardTitle></CardHeader>
          <CardContent className="p-3">
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={moduleHealth}>
                <PolarGrid className="stroke-border" />
                <PolarAngleAxis dataKey="module" tick={{ fontSize: 9 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Health" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="py-3 px-4"><CardTitle className="text-sm">Top Customers by Revenue</CardTitle></CardHeader>
          <CardContent className="p-3">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={customerRevenue.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => fmtK(v)} />
                <Tooltip formatter={(v: number) => `ETB ${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Inventory */}
      <Card className="shadow-card">
        <CardHeader className="py-3 px-4"><CardTitle className="text-sm">Inventory Valuation by Category</CardTitle></CardHeader>
        <CardContent className="p-3">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={inventoryByCategory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => fmtK(v)} />
              <Tooltip formatter={(v: number, name: string) => name === 'qty' ? v : `ETB ${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Value (ETB)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
