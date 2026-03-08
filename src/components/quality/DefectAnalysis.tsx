import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { QualityStats } from "@/data/enhancedQualityData";

interface Props { stats: QualityStats }

const COLORS = [
  'hsl(var(--destructive))', 'hsl(var(--warning))', 'hsl(var(--primary))',
  'hsl(var(--success))', 'hsl(var(--info))', 'hsl(280,60%,50%)',
];

export default function DefectAnalysis({ stats }: Props) {
  const catData = Object.entries(stats.defectsByCategory).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const sevData = Object.entries(stats.defectsBySeverity).map(([name, value]) => ({ name, value }));
  const topData = stats.topDefects.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Defects by Category</CardTitle></CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={catData} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={55} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Defects by Severity</CardTitle></CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={sevData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {sevData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Top Defects (Pareto)</CardTitle></CardHeader>
        <CardContent className="h-[250px]">
          {topData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="description" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No defect data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
