import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, UserCheck, Clock, DollarSign, Star, Briefcase, TrendingDown, GraduationCap } from "lucide-react";
import type { HRStats as HRStatsType } from "@/data/enhancedHRData";
import { formatETBShort } from "@/data/enhancedHRData";

interface Props { stats: HRStatsType }

const cards = (s: HRStatsType) => [
  { label: 'Total Employees', value: String(s.totalEmployees), sub: `${s.activeEmployees} active · ${s.onLeaveEmployees} on leave`, icon: Users, color: 'text-primary bg-primary/10' },
  { label: 'Present Today', value: String(s.presentToday), sub: `${s.averageAttendanceRate}% avg attendance`, icon: UserCheck, color: s.averageAttendanceRate >= 90 ? 'text-success bg-success/10' : 'text-warning bg-warning/10' },
  { label: 'Pending Leave', value: String(s.pendingLeaveRequests), sub: `Requests awaiting approval`, icon: Clock, color: s.pendingLeaveRequests > 0 ? 'text-warning bg-warning/10' : 'text-success bg-success/10' },
  { label: 'Payroll MTD', value: formatETBShort(s.totalPayrollThisMonth), sub: `Avg: ${formatETBShort(s.averageSalary)}/employee`, icon: DollarSign, color: 'text-info bg-info/10' },
  { label: 'Avg Performance', value: s.averagePerformanceRating.toFixed(1), sub: `${s.topPerformers} top performers (4-5★)`, icon: Star, color: s.averagePerformanceRating >= 3.5 ? 'text-success bg-success/10' : 'text-warning bg-warning/10' },
  { label: 'Departments', value: String(Object.keys(s.employeesByDepartment).length), sub: `${s.fullTimeCount} FT · ${s.contractCount} contract`, icon: Briefcase, color: 'text-primary bg-primary/10' },
  { label: 'Turnover Rate', value: `${s.turnoverRate}%`, sub: `Avg tenure: ${s.averageTenure}y`, icon: TrendingDown, color: s.turnoverRate > 15 ? 'text-destructive bg-destructive/10' : 'text-success bg-success/10' },
  { label: 'Probation', value: String(s.probationEmployees), sub: `${s.genderRatio.male}M · ${s.genderRatio.female}F`, icon: GraduationCap, color: 'text-warning bg-warning/10' },
];

export default function HRStats({ stats }: Props) {
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
