import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ClipboardCheck, CheckCircle, XCircle, AlertTriangle, ShieldAlert, Users, DollarSign, TrendingUp } from "lucide-react";
import type { QualityStats as QualityStatsType } from "@/data/enhancedQualityData";
import { formatETBShort } from "@/data/enhancedQualityData";

interface Props { stats: QualityStatsType }

const cards = (s: QualityStatsType) => [
  { label: 'Pass Rate', value: `${s.passRate}%`, sub: `${s.totalInspections} total inspections`, icon: CheckCircle, color: 'text-success bg-success/10', good: s.passRate >= 90 },
  { label: 'Inspections MTD', value: String(s.inspectionsThisMonth), sub: `${s.totalInspections} all time`, icon: ClipboardCheck, color: 'text-primary bg-primary/10' },
  { label: 'Open NCRs', value: String(s.openNCRs), sub: `${s.totalNCRs} total · ${s.closedNCRs} closed`, icon: ShieldAlert, color: s.openNCRs > 3 ? 'text-destructive bg-destructive/10' : 'text-warning bg-warning/10' },
  { label: 'Critical Defects', value: String(s.criticalDefects), sub: `${s.totalDefects} total · ${s.openDefects} open`, icon: AlertTriangle, color: s.criticalDefects > 0 ? 'text-destructive bg-destructive/10' : 'text-success bg-success/10' },
  { label: 'Cost of Quality', value: formatETBShort(s.costOfQuality), sub: `Rework: ${formatETBShort(s.reworkCost)} · Scrap: ${formatETBShort(s.scrapCost)}`, icon: DollarSign, color: 'text-warning bg-warning/10' },
  { label: 'Fail Rate', value: `${s.failRate}%`, sub: `Conditional: ${s.conditionalRate}%`, icon: XCircle, color: s.failRate > 10 ? 'text-destructive bg-destructive/10' : 'text-muted-foreground bg-muted' },
  { label: 'Complaints', value: String(s.totalComplaints), sub: `${s.openComplaints} open`, icon: Users, color: s.openComplaints > 0 ? 'text-warning bg-warning/10' : 'text-success bg-success/10' },
  { label: 'Defect Rate', value: s.totalInspections > 0 ? `${((s.totalDefects / s.totalInspections) * 100).toFixed(1)}%` : '0%', sub: `${s.totalDefects} defects found`, icon: TrendingUp, color: 'text-info bg-info/10' },
];

export default function QualityStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards(stats).map(c => (
        <Tooltip key={c.label}>
          <TooltipTrigger asChild>
            <Card className="shadow-sm hover:shadow-md transition-shadow cursor-default">
              <CardContent className="p-3 flex items-start gap-3">
                <div className={`p-2 rounded-lg ${c.color}`}><c.icon className="h-4 w-4" /></div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{c.label}</p>
                  <p className="text-lg font-bold text-foreground">{c.value}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{c.sub}</p>
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent><p className="text-xs">{c.sub}</p></TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
