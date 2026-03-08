import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Eye, Trash2, Star } from "lucide-react";
import type { EnhancedEmployee } from "@/data/enhancedHRData";
import { getEmploymentStatusColor, getDepartmentLabel, formatETB, getPerformanceRatingColor } from "@/data/enhancedHRData";

interface Props {
  employees: EnhancedEmployee[];
  selected: string[];
  onSelect: (ids: string[]) => void;
  onView: (e: EnhancedEmployee) => void;
  onDelete: (id: string) => void;
  language: string;
}

export default function EmployeeTable({ employees, selected, onSelect, onView, onDelete, language }: Props) {
  const allSelected = employees.length > 0 && selected.length === employees.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={c => onSelect(c ? employees.map(e => e.id) : [])} /></TableHead>
          <TableHead className="text-xs">ID</TableHead>
          <TableHead className="text-xs">Name</TableHead>
          <TableHead className="text-xs">Department</TableHead>
          <TableHead className="text-xs">Position</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs">Type</TableHead>
          <TableHead className="text-xs">Phone</TableHead>
          <TableHead className="text-xs">Hire Date</TableHead>
          <TableHead className="text-xs">Rating</TableHead>
          <TableHead className="text-xs text-right">Salary</TableHead>
          <TableHead className="text-xs">Attendance</TableHead>
          <TableHead className="text-xs">Leave</TableHead>
          <TableHead className="text-xs"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map(e => (
          <TableRow key={e.id}>
            <TableCell><Checkbox checked={selected.includes(e.id)} onCheckedChange={c => onSelect(c ? [...selected, e.id] : selected.filter(s => s !== e.id))} /></TableCell>
            <TableCell className="text-xs font-mono">{e.employeeNumber}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                  {e.firstName[0]}{e.lastName[0]}
                </div>
                <div>
                  <p className="text-xs font-medium">{language === 'am' && e.fullNameAm ? e.fullNameAm : e.fullName}</p>
                  <p className="text-[10px] text-muted-foreground">{e.workEmail}</p>
                </div>
              </div>
            </TableCell>
            <TableCell><Badge variant="secondary" className="text-[10px]">{getDepartmentLabel(e.department)}</Badge></TableCell>
            <TableCell className="text-xs">{e.position}</TableCell>
            <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${getEmploymentStatusColor(e.status)}`}>{e.status.replace('_', ' ')}</span></TableCell>
            <TableCell className="text-[10px] capitalize">{e.employmentType.replace('_', ' ')}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{e.personalPhone}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{e.hireDate}</TableCell>
            <TableCell>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < e.performanceRating ? `fill-current ${getPerformanceRatingColor(e.performanceRating)}` : 'text-muted'}`} />
                ))}
              </div>
            </TableCell>
            <TableCell className="text-xs text-right font-medium">{formatETB(e.salary)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Progress value={e.attendance.attendanceRate} className="h-1.5 w-12" />
                <span className="text-[10px]">{e.attendance.attendanceRate}%</span>
              </div>
            </TableCell>
            <TableCell className="text-[10px]">{e.leaveBalances.annual}d</TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(e)}><Eye className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(e.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {employees.length === 0 && (
          <TableRow><TableCell colSpan={14} className="text-center text-sm text-muted-foreground py-8">No employees found</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
