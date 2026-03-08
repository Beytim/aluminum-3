import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { LeaveRequest } from "@/data/enhancedHRData";
import { getLeaveStatusColor } from "@/data/enhancedHRData";

interface Props {
  requests: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function LeaveTable({ requests, onApprove, onReject, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">#</TableHead>
          <TableHead className="text-xs">Employee</TableHead>
          <TableHead className="text-xs">Type</TableHead>
          <TableHead className="text-xs">Start</TableHead>
          <TableHead className="text-xs">End</TableHead>
          <TableHead className="text-xs">Days</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs">Approved By</TableHead>
          <TableHead className="text-xs">Reason</TableHead>
          <TableHead className="text-xs"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map(r => (
          <TableRow key={r.id}>
            <TableCell className="text-xs font-mono">{r.requestNumber}</TableCell>
            <TableCell className="text-xs font-medium">{r.employeeName}</TableCell>
            <TableCell><Badge variant="outline" className="text-[10px] capitalize">{r.leaveType}</Badge></TableCell>
            <TableCell className="text-xs text-muted-foreground">{r.startDate}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{r.endDate}</TableCell>
            <TableCell className="text-xs font-medium">{r.daysRequested}</TableCell>
            <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${getLeaveStatusColor(r.status)}`}>{r.status}</span></TableCell>
            <TableCell className="text-xs text-muted-foreground">{r.approvedByName || '—'}</TableCell>
            <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">{r.reason}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                {r.status === 'pending' && (
                  <>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onApprove(r.id)}><Check className="h-3 w-3 text-success" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onReject(r.id)}><X className="h-3 w-3 text-destructive" /></Button>
                  </>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(r.id)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {requests.length === 0 && (
          <TableRow><TableCell colSpan={10} className="text-center text-sm text-muted-foreground py-8">No leave requests</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
