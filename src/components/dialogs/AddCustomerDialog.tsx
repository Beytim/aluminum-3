import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import type { Customer } from "@/data/sampleData";

const customerTypes = ['Individual', 'Company', 'Contractor', 'Developer'] as const;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (customer: Customer) => void;
  existingCount: number;
}

export function AddCustomerDialog({ open, onOpenChange, onAdd, existingCount }: Props) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', nameAm: '', contact: '', type: '', phone: '', email: '', address: '',
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.nameAm.trim()) e.nameAm = 'Required';
    if (!form.type) e.type = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const customer: Customer = {
      id: `CUS-${String(existingCount + 1).padStart(3, '0')}`,
      name: form.name.trim(), nameAm: form.nameAm.trim(),
      contact: form.contact.trim() || form.name.trim(),
      type: form.type as Customer['type'],
      phone: form.phone.trim(), email: form.email.trim(),
      address: form.address.trim(),
      projects: 0, totalValue: 0, outstanding: 0,
    };
    onAdd(customer);
    toast({ title: t('common.add'), description: `${customer.name} added.` });
    setForm({ name: '', nameAm: '', contact: '', type: '', phone: '', email: '', address: '' });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Customer</DialogTitle></DialogHeader>
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
            <Label className="text-xs">Contact Person</Label>
            <Input value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Type *</Label>
            <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
              <SelectTrigger className={errors.type ? 'border-destructive' : ''}><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{customerTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            {errors.type && <p className="text-[10px] text-destructive mt-0.5">{errors.type}</p>}
          </div>
          <div>
            <Label className="text-xs">Phone *</Label>
            <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={errors.phone ? 'border-destructive' : ''} />
            {errors.phone && <p className="text-[10px] text-destructive mt-0.5">{errors.phone}</p>}
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={errors.email ? 'border-destructive' : ''} />
            {errors.email && <p className="text-[10px] text-destructive mt-0.5">{errors.email}</p>}
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Address</Label>
            <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
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
