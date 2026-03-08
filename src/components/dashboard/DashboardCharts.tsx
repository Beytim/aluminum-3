import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";

interface Props {
  revenueData: { month: string; revenue: number; cost: number; profit: number }[];
  moduleLoadData: { name: string; value: number; color: string }[];
  qualityTrend: { month: string; rate: number }[];
  productionData: { stage: string; count: number }[];
}

export default function DashboardCharts({ revenueData, moduleLoadData, qualityTrend, productionData }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Revenue vs Cost */}
      <Card className="shadow-card">
        <CardHeader className="pb-2 px-3 pt-3">
          <CardTitle className="text-xs font-semibold">Revenue vs Cost (6 months)</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 18%, 86%)" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="hsl(215, 12%, 50%)" />
              <YAxis tick={{ fontSize: 9 }} stroke="hsl(215, 12%, 50%)" tickFormatter={v => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [`ETB ${v.toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(212, 72%, 42%)" fill="hsl(212, 72%, 42%)" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="cost" stroke="hsl(0, 72%, 51%)" fill="hsl(0, 72%, 51%)" fillOpacity={0.08} strokeWidth={1.5} />
              <Area type="monotone" dataKey="profit" stroke="hsl(142, 72%, 40%)" fill="hsl(142, 72%, 40%)" fillOpacity={0.1} strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-1">
            {[{ label: 'Revenue', color: 'bg-primary' }, { label: 'Cost', color: 'bg-destructive' }, { label: 'Profit', color: 'bg-success' }].map(l => (
              <div key={l.label} className="flex items-center gap-1"><div className={`h-2 w-2 rounded-full ${l.color}`} /><span className="text-[10px] text-muted-foreground">{l.label}</span></div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Distribution */}
      <Card className="shadow-card">
        <CardHeader className="pb-2 px-3 pt-3">
          <CardTitle className="text-xs font-semibold">Active Work by Module</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={moduleLoadData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {moduleLoadData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [v, 'Active items']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-1">
            {moduleLoadData.map(e => (
              <div key={e.name} className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: e.color }} />
                <span className="text-[10px] text-muted-foreground">{e.name} ({e.value})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Trend */}
      <Card className="shadow-card">
        <CardHeader className="pb-2 px-3 pt-3">
          <CardTitle className="text-xs font-semibold">Quality Pass Rate Trend</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={qualityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 18%, 86%)" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="hsl(215, 12%, 50%)" />
              <YAxis domain={[80, 100]} tick={{ fontSize: 9 }} stroke="hsl(215, 12%, 50%)" tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Pass Rate']} />
              <Line type="monotone" dataKey="rate" stroke="hsl(142, 72%, 40%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Production Pipeline */}
      <Card className="shadow-card">
        <CardHeader className="pb-2 px-3 pt-3">
          <CardTitle className="text-xs font-semibold">Production Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 18%, 86%)" />
              <XAxis dataKey="stage" tick={{ fontSize: 8 }} stroke="hsl(215, 12%, 50%)" />
              <YAxis tick={{ fontSize: 9 }} stroke="hsl(215, 12%, 50%)" />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(212, 72%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
