import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Project, Customer } from "@/data/sampleData";

const statuses = ['Quote', 'Deposit', 'Materials Ordered', 'Production', 'Ready', 'Installation', 'Completed'] as const;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  customers: Customer[];
  onSave: (project: Project) => void;
}

export function EditProjectDialog({ open, onOpenChange, project, customers, onSave }: Props) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', nameAm: '', customerId: '', type: '', status: '', value: '', deposit: '', dueDate: '', progress: '',
  });

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name, nameAm: project.nameAm, customerId: project.customerId,
        type: project.type, status: project.status, value: String(project.value),
        deposit: String(project.deposit), dueDate: project.dueDate, progress: String(project.progress),
      });
      setErrors({});
    }
  }, [project]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.customerId) e.customerId = 'Required';
    if (!form.value || Number(form.value) <= 0) e.value = 'Must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !project) return;
    const customer = customers.find(c => c.id === form.customerId);
    const val = Number(form.value);
    const dep = Number(form.deposit) || 0;
    const updated: Project = {
      ...project,
      name: form.name.trim(), nameAm: form.nameAm.trim(),
      customerId: form.customerId, customerName: customer?.name || project.customerName,
      type: form.type as Project['type'], status: form.status as Project['status'],
      value: val, deposit: dep, balance: val - dep,
      dueDate: form.dueDate, progress: Number(form.progress) || 0,
    };
    onSave(updated);
    toast({ title: "Updated", description: `${updated.name} saved.` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Name (EN) *</Label>
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={errors.name ? 'border-destructive' : ''} />
          </div>
          <div>
            <Label className="text-xs">ስም (AM) *</Label>
            <Input value={form.nameAm} onChange={e => setForm(p => ({ ...p, nameAm: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Customer *</Label>
            <Select value={form.customerId} onValueChange={v => setForm(p => ({ ...p, customerId: v }))}>
              <SelectTrigger className={errors.customerId ? 'border-destructive' : ''}><SelectValue /></SelectTrigger>
              <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Type</Label>
            <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Progress %</Label>
            <Input type="number" min="0" max="100" value={form.progress} onChange={e => setForm(p => ({ ...p, progress: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Value (ETB) *</Label>
            <Input type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} className={errors.value ? 'border-destructive' : ''} />
          </div>
          <div>
            <Label className="text-xs">Deposit (ETB)</Label>
            <Input type="number" value={form.deposit} onChange={e => setForm(p => ({ ...p, deposit: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Due Date</Label>
            <Input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
