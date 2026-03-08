import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import type { EnhancedEmployee } from "@/data/enhancedHRData";
import { getEmploymentStatusColor, getDepartmentLabel, formatETB, getPerformanceRatingColor, calculateTenure } from "@/data/enhancedHRData";

interface Props {
  employee: EnhancedEmployee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: string;
}

export default function EmployeeDetailsDialog({ employee, open, onOpenChange, language }: Props) {
  if (!employee) return null;
  const e = employee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{e.firstName[0]}{e.lastName[0]}</div>
            <div>
              <span>{language === 'am' && e.fullNameAm ? e.fullNameAm : e.fullName}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground font-normal">{e.employeeNumber}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${getEmploymentStatusColor(e.status)}`}>{e.status.replace('_', ' ')}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview" className="text-[10px]">Overview</TabsTrigger>
            <TabsTrigger value="employment" className="text-[10px]">Employment</TabsTrigger>
            <TabsTrigger value="attendance" className="text-[10px]">Attendance</TabsTrigger>
            <TabsTrigger value="performance" className="text-[10px]">Performance</TabsTrigger>
            <TabsTrigger value="skills" className="text-[10px]">Skills</TabsTrigger>
            <TabsTrigger value="work" className="text-[10px]">Work History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Position</p><p className="text-sm font-medium">{e.position}</p><p className="text-[10px] text-muted-foreground">{getDepartmentLabel(e.department)}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Tenure</p><p className="text-sm font-medium">{calculateTenure(e.hireDate)} years</p><p className="text-[10px] text-muted-foreground">Since {e.hireDate}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Salary</p><p className="text-sm font-medium">{formatETB(e.salary)}/mo</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Leave Balance</p><p className="text-sm font-medium">{e.leaveBalances.annual}d annual · {e.leaveBalances.sick}d sick</p></CardContent></Card>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-muted-foreground">Email:</span> {e.workEmail}</div>
              <div><span className="text-muted-foreground">Phone:</span> {e.personalPhone}</div>
              <div><span className="text-muted-foreground">Gender:</span> <span className="capitalize">{e.gender}</span></div>
              <div><span className="text-muted-foreground">DOB:</span> {e.dateOfBirth}</div>
              <div><span className="text-muted-foreground">City:</span> {e.city}{e.subCity && `, ${e.subCity}`}</div>
              {e.reportsToName && <div><span className="text-muted-foreground">Reports to:</span> {e.reportsToName}</div>}
              {e.emergencyContactName && <div><span className="text-muted-foreground">Emergency:</span> {e.emergencyContactName} ({e.emergencyContactRelation})</div>}
            </div>
          </TabsContent>

          <TabsContent value="employment" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-muted-foreground">Department:</span> {getDepartmentLabel(e.department)}</div>
              <div><span className="text-muted-foreground">Position:</span> {e.position}</div>
              <div><span className="text-muted-foreground">Level:</span> <span className="capitalize">{e.positionLevel}</span></div>
              <div><span className="text-muted-foreground">Type:</span> <span className="capitalize">{e.employmentType.replace('_', ' ')}</span></div>
              <div><span className="text-muted-foreground">Hire Date:</span> {e.hireDate}</div>
              {e.confirmationDate && <div><span className="text-muted-foreground">Confirmed:</span> {e.confirmationDate}</div>}
              {e.probationEndDate && <div><span className="text-muted-foreground">Probation End:</span> {e.probationEndDate}</div>}
            </div>
            <h4 className="text-xs font-semibold mt-4">Compensation</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Base Salary: <strong>{formatETB(e.salary)}</strong></div>
              <div>Transport: <strong>{formatETB(e.transportationAllowance)}</strong></div>
              <div>Meal: <strong>{formatETB(e.mealAllowance)}</strong></div>
              <div>Housing: <strong>{formatETB(e.housingAllowance)}</strong></div>
              <div>Total: <strong>{formatETB(e.salary + e.transportationAllowance + e.mealAllowance + e.housingAllowance)}/mo</strong></div>
            </div>
            {e.bankName && <p className="text-xs text-muted-foreground mt-2">Bank: {e.bankName} · {e.bankAccount}</p>}
          </TabsContent>

          <TabsContent value="attendance" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Attendance Rate</p><Progress value={e.attendance.attendanceRate} className="h-2 mt-1" /><p className="text-sm font-bold mt-1">{e.attendance.attendanceRate}%</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Present</p><p className="text-sm font-bold">{e.attendance.presentDays}/{e.attendance.totalDays} days</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Absent</p><p className="text-sm font-bold">{e.attendance.absentDays} days</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Overtime</p><p className="text-sm font-bold">{e.attendance.overtime} hrs</p></CardContent></Card>
            </div>
            <h4 className="text-xs font-semibold">Leave Balances</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 border rounded-lg text-center"><p className="text-[10px] text-muted-foreground">Annual</p><p className="font-bold">{e.leaveBalances.annual}d</p></div>
              <div className="p-2 border rounded-lg text-center"><p className="text-[10px] text-muted-foreground">Sick</p><p className="font-bold">{e.leaveBalances.sick}d</p></div>
              {e.leaveBalances.maternity != null && <div className="p-2 border rounded-lg text-center"><p className="text-[10px] text-muted-foreground">Maternity</p><p className="font-bold">{e.leaveBalances.maternity}d</p></div>}
              {e.leaveBalances.paternity != null && <div className="p-2 border rounded-lg text-center"><p className="text-[10px] text-muted-foreground">Paternity</p><p className="font-bold">{e.leaveBalances.paternity}d</p></div>}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-3 mt-3">
            <Card><CardContent className="p-3">
              <p className="text-[10px] text-muted-foreground">Current Rating</p>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < e.performanceRating ? `fill-current ${getPerformanceRatingColor(e.performanceRating)}` : 'text-muted'}`} />
                ))}
                <span className={`ml-2 text-lg font-bold ${getPerformanceRatingColor(e.performanceRating)}`}>{e.performanceRating}/5</span>
              </div>
            </CardContent></Card>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {e.lastReviewDate && <div><span className="text-muted-foreground">Last Review:</span> {e.lastReviewDate}</div>}
              {e.nextReviewDate && <div><span className="text-muted-foreground">Next Review:</span> {e.nextReviewDate}</div>}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-3 mt-3">
            {e.skills.length > 0 ? (
              <div className="space-y-2">
                {e.skills.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 border rounded-lg">
                    <span className="text-xs font-medium">{s.name}</span>
                    <Badge variant="outline" className="text-[10px] capitalize">{s.level}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No skills recorded</p>
            )}
          </TabsContent>

          <TabsContent value="work" className="space-y-3 mt-3">
            <div className="text-xs space-y-2">
              <p className="text-muted-foreground">Work assignments linked from Production, Installation, Quality, and Maintenance modules.</p>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{getDepartmentLabel(e.department)} Department</p>
                <p className="text-muted-foreground">{e.position} · {e.positionLevel} level</p>
                <p className="text-muted-foreground mt-1">Joined: {e.hireDate} · Tenure: {calculateTenure(e.hireDate)}y</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
