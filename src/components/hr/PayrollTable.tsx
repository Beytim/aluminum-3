import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Eye } from "lucide-react";
import type { Payroll } from "@/data/enhancedHRData";
import { formatETB, getDepartmentLabel } from "@/data/enhancedHRData";

interface Props {
  payrolls: Payroll[];
  onApprove: (id: string) => void;
  onPay: (id: string) => void;
}

const statusColor: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  calculated: 'bg-warning/10 text-warning',
  approved: 'bg-info/10 text-info',
  paid: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function PayrollTable({ payrolls, onApprove, onPay }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">#</TableHead>
          <TableHead className="text-xs">Period</TableHead>
          <TableHead className="text-xs">Employee</TableHead>
          <TableHead className="text-xs">Dept</TableHead>
          <TableHead className="text-xs text-right">Base</TableHead>
          <TableHead className="text-xs text-right">OT</TableHead>
          <TableHead className="text-xs text-right">Allowances</TableHead>
          <TableHead className="text-xs text-right">Gross</TableHead>
          <TableHead className="text-xs text-right">Deductions</TableHead>
          <TableHead className="text-xs text-right font-bold">Net Pay</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payrolls.map(p => (
          <TableRow key={p.id}>
            <TableCell className="text-xs font-mono">{p.payrollNumber}</TableCell>
            <TableCell className="text-xs">{p.period}</TableCell>
            <TableCell className="text-xs font-medium">{p.employeeName}</TableCell>
            <TableCell><Badge variant="secondary" className="text-[10px]">{getDepartmentLabel(p.department)}</Badge></TableCell>
            <TableCell className="text-xs text-right">{formatETB(p.baseSalary)}</TableCell>
            <TableCell className="text-xs text-right">{formatETB(p.overtimePay)}</TableCell>
            <TableCell className="text-xs text-right">{formatETB(p.totalAllowances)}</TableCell>
            <TableCell className="text-xs text-right font-medium">{formatETB(p.grossPay)}</TableCell>
            <TableCell className="text-xs text-right text-destructive">{formatETB(p.totalDeductions)}</TableCell>
            <TableCell className="text-xs text-right font-bold">{formatETB(p.netPay)}</TableCell>
            <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[p.status]}`}>{p.status}</span></TableCell>
            <TableCell>
              <div className="flex gap-1">
                {p.status === 'calculated' && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onApprove(p.id)}><Check className="h-3 w-3 text-success" /></Button>}
                {p.status === 'approved' && <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => onPay(p.id)}>Pay</Button>}
              </div>
            </TableCell>
          </TableRow>
        ))}
        {payrolls.length === 0 && (
          <TableRow><TableCell colSpan={12} className="text-center text-sm text-muted-foreground py-8">No payroll records</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
