import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { LeaveRequest, LeaveType, EnhancedEmployee } from "@/data/enhancedHRData";
import { calculateLeaveDays } from "@/data/enhancedHRData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (req: LeaveRequest) => void;
  employees: EnhancedEmployee[];
  existingCount: number;
}

const leaveTypes: LeaveType[] = ['annual', 'sick', 'maternity', 'paternity', 'bereavement', 'unpaid', 'study', 'compensatory', 'emergency', 'other'];

export default function LeaveRequestDialog({ open, onOpenChange, onAdd, employees, existingCount }: Props) {
  const [form, setForm] = useState({ employeeId: '', leaveType: '' as LeaveType | '', startDate: '', endDate: '', reason: '', handoverTo: '', handoverNotes: '' });

  const selectedEmployee = employees.find(e => e.id === form.employeeId);
  const days = form.startDate && form.endDate ? calculateLeaveDays(form.startDate, form.endDate) : 0;

  const reset = () => setForm({ employeeId: '', leaveType: '', startDate: '', endDate: '', reason: '', handoverTo: '', handoverNotes: '' });

  const handleSubmit = () => {
    if (!form.employeeId || !form.leaveType || !form.startDate || !form.endDate || !form.reason) return;
    const num = existingCount + 1;
    const balance = selectedEmployee?.leaveBalances?.annual || 0;
    const req: LeaveRequest = {
      id: `LV-${String(num).padStart(3, '0')}`,
      requestNumber: `LV-2025-${String(num).padStart(3, '0')}`,
      employeeId: form.employeeId,
      employeeName: selectedEmployee?.fullName || '',
      leaveType: form.leaveType as LeaveType,
      startDate: form.startDate, endDate: form.endDate,
      daysRequested: days,
      reason: form.reason,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      handoverTo: form.handoverTo || undefined,
      handoverNotes: form.handoverNotes || undefined,
      remainingBalanceAfter: Math.max(0, balance - days),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onAdd(req);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Leave Request</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Employee *</Label>
            <Select value={form.employeeId} onValueChange={v => setForm(p => ({ ...p, employeeId: v }))}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>{employees.filter(e => e.status === 'active').map(e => <SelectItem key={e.id} value={e.id}>{e.fullName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Leave Type *</Label>
            <Select value={form.leaveType} onValueChange={v => setForm(p => ({ ...p, leaveType: v as LeaveType }))}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{leaveTypes.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Start Date *</Label><Input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} /></div>
            <div><Label className="text-xs">End Date *</Label><Input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} /></div>
          </div>
          {days > 0 && (
            <div className="p-2 bg-muted rounded-lg text-xs">
              <strong>{days}</strong> working day(s)
              {selectedEmployee && <span className="text-muted-foreground"> · Balance after: {Math.max(0, (selectedEmployee.leaveBalances.annual || 0) - days)}d</span>}
            </div>
          )}
          <div><Label className="text-xs">Reason *</Label><Textarea value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} rows={2} /></div>
          <div><Label className="text-xs">Handover To</Label><Input value={form.handoverTo} onChange={e => setForm(p => ({ ...p, handoverTo: e.target.value }))} /></div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.employeeId || !form.leaveType || !form.startDate || !form.endDate || !form.reason}>Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
