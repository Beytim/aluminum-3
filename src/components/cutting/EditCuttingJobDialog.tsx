import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EnhancedCuttingJob, WorkOrderPriority } from "@/data/enhancedProductionData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: EnhancedCuttingJob | null;
  onSave: (id: string, updates: Record<string, any>) => void;
}

export function EditCuttingJobDialog({ open, onOpenChange, job, onSave }: Props) {
  const [form, setForm] = useState({
    materialName: '',
    machine: '',
    priority: 'Medium' as WorkOrderPriority,
    stockLength: 0,
    notes: '',
  });

  useEffect(() => {
    if (job) {
      setForm({
        materialName: job.materialName,
        machine: job.machine,
        priority: job.priority,
        stockLength: job.stockLength,
        notes: job.notes || '',
      });
    }
  }, [job]);

  if (!job) return null;

  const handleSave = () => {
    onSave(job.id, {
      material_name: form.materialName,
      machine: form.machine,
      priority: form.priority,
      stock_length: form.stockLength,
      notes: form.notes || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {job.jobNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Material Name</Label>
            <Input value={form.materialName} onChange={e => setForm(f => ({ ...f, materialName: e.target.value }))} className="h-9" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Machine</Label>
              <Select value={form.machine} onValueChange={v => setForm(f => ({ ...f, machine: v }))}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Double Head Cutting Saw">Double Head Cutting Saw</SelectItem>
                  <SelectItem value="CNC Router">CNC Router</SelectItem>
                  <SelectItem value="Manual Mitre Saw">Manual Mitre Saw</SelectItem>
                  <SelectItem value="Glass Cutting Table">Glass Cutting Table</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v as WorkOrderPriority }))}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Low', 'Medium', 'High', 'Urgent', 'Critical'].map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Stock Length (mm)</Label>
            <Input type="number" value={form.stockLength} onChange={e => setForm(f => ({ ...f, stockLength: Number(e.target.value) }))} className="h-9" />
          </div>
          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
