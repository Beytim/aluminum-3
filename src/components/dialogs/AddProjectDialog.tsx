import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import type { Project, Customer } from "@/data/sampleData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (project: Project) => void;
  customers: Customer[];
  existingCount: number;
}

export function AddProjectDialog({ open, onOpenChange, onAdd, customers, existingCount }: Props) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', nameAm: '', customerId: '', type: '', value: '', deposit: '', dueDate: '',
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.nameAm.trim()) e.nameAm = 'Required';
    if (!form.customerId) e.customerId = 'Required';
    if (!form.type) e.type = 'Required';
    if (!form.value || Number(form.value) <= 0) e.value = 'Must be > 0';
    if (!form.dueDate) e.dueDate = 'Required';
    if (Number(form.deposit) > Number(form.value)) e.deposit = 'Cannot exceed value';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const customer = customers.find(c => c.id === form.customerId);
    const val = Number(form.value);
    const dep = Number(form.deposit) || 0;
    const project: Project = {
      id: `PJ-${String(existingCount + 1).padStart(3, '0')}`,
      name: form.name.trim(), nameAm: form.nameAm.trim(),
      customerId: form.customerId,
      customerName: customer?.name || '',
      type: form.type as Project['type'],
      status: dep > 0 ? 'Deposit' : 'Quote',
      value: val, deposit: dep, balance: val - dep,
      progress: 0,
      orderDate: new Date().toISOString().split('T')[0],
      dueDate: form.dueDate,
    };
    onAdd(project);
    toast({ title: 'Project Created', description: `${project.name} added.` });
    setForm({ name: '', nameAm: '', customerId: '', type: '', value: '', deposit: '', dueDate: '' });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Name (EN) *</Label>
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={errors.name ? 'border-destructive' : ''} />
            {errors.name && <p className="text-[10px] text-destructive mt-0.5">{errors.name}</p>}
          </div>
          <div>
            <Label className="text-xs">ስም (AM) *</Label>
            <Input value={form.nameAm} onChange={e => setForm(p => ({ ...p, nameAm: e.target.value }))} className={errors.nameAm ? 'border-destructive' : ''} />
            {errors.nameAm && <p className="text-[10px] text-destructive mt-0.5">{errors.nameAm}</p>}
          </div>
          <div>
            <Label className="text-xs">Customer *</Label>
            <Select value={form.customerId} onValueChange={v => setForm(p => ({ ...p, customerId: v }))}>
              <SelectTrigger className={errors.customerId ? 'border-destructive' : ''}><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
            {errors.customerId && <p className="text-[10px] text-destructive mt-0.5">{errors.customerId}</p>}
          </div>
          <div>
            <Label className="text-xs">Type *</Label>
            <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
              <SelectTrigger className={errors.type ? 'border-destructive' : ''}><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-[10px] text-destructive mt-0.5">{errors.type}</p>}
          </div>
          <div>
            <Label className="text-xs">Value (ETB) *</Label>
            <Input type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} className={errors.value ? 'border-destructive' : ''} />
            {errors.value && <p className="text-[10px] text-destructive mt-0.5">{errors.value}</p>}
          </div>
          <div>
            <Label className="text-xs">Deposit (ETB)</Label>
            <Input type="number" value={form.deposit} onChange={e => setForm(p => ({ ...p, deposit: e.target.value }))} className={errors.deposit ? 'border-destructive' : ''} />
            {errors.deposit && <p className="text-[10px] text-destructive mt-0.5">{errors.deposit}</p>}
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Due Date *</Label>
            <Input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className={errors.dueDate ? 'border-destructive' : ''} />
            {errors.dueDate && <p className="text-[10px] text-destructive mt-0.5">{errors.dueDate}</p>}
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit}>{t('common.add')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
