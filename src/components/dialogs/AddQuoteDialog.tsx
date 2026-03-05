import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import type { Quote, Customer } from "@/data/sampleData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (quote: Quote) => void;
  customers: Customer[];
  existingCount: number;
}

export function AddQuoteDialog({ open, onOpenChange, onAdd, customers, existingCount }: Props) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    customerId: '', projectName: '', items: '', materialCost: '', laborCost: '', installCost: '', transportCost: '', validity: '',
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerId) e.customerId = 'Required';
    if (!form.projectName.trim()) e.projectName = 'Required';
    if (!form.items || Number(form.items) <= 0) e.items = 'Must be > 0';
    if (!form.materialCost || Number(form.materialCost) <= 0) e.materialCost = 'Must be > 0';
    if (!form.validity) e.validity = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const customer = customers.find(c => c.id === form.customerId);
    const mat = Number(form.materialCost) || 0;
    const lab = Number(form.laborCost) || 0;
    const inst = Number(form.installCost) || 0;
    const trans = Number(form.transportCost) || 0;
    const subtotal = mat + lab + inst + trans;
    const vat = subtotal * 0.15;
    const quote: Quote = {
      id: `QT-${String(existingCount + 1).padStart(3, '0')}`,
      customerId: form.customerId,
      customerName: customer?.name || '',
      projectName: form.projectName.trim(),
      items: Number(form.items),
      materialCost: mat, laborCost: lab, installCost: inst, transportCost: trans,
      subtotal, vat, total: subtotal + vat,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      validity: form.validity,
    };
    onAdd(quote);
    toast({ title: 'Quote Created', description: `${quote.id} for ${quote.customerName}.` });
    setForm({ customerId: '', projectName: '', items: '', materialCost: '', laborCost: '', installCost: '', transportCost: '', validity: '' });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Quote</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Customer *</Label>
            <Select value={form.customerId} onValueChange={v => setForm(p => ({ ...p, customerId: v }))}>
              <SelectTrigger className={errors.customerId ? 'border-destructive' : ''}><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
            {errors.customerId && <p className="text-[10px] text-destructive mt-0.5">{errors.customerId}</p>}
          </div>
          <div>
            <Label className="text-xs">Project Name *</Label>
            <Input value={form.projectName} onChange={e => setForm(p => ({ ...p, projectName: e.target.value }))} className={errors.projectName ? 'border-destructive' : ''} />
            {errors.projectName && <p className="text-[10px] text-destructive mt-0.5">{errors.projectName}</p>}
          </div>
          <div>
            <Label className="text-xs">Items Count *</Label>
            <Input type="number" value={form.items} onChange={e => setForm(p => ({ ...p, items: e.target.value }))} className={errors.items ? 'border-destructive' : ''} />
            {errors.items && <p className="text-[10px] text-destructive mt-0.5">{errors.items}</p>}
          </div>
          <div>
            <Label className="text-xs">Material Cost (ETB) *</Label>
            <Input type="number" value={form.materialCost} onChange={e => setForm(p => ({ ...p, materialCost: e.target.value }))} className={errors.materialCost ? 'border-destructive' : ''} />
            {errors.materialCost && <p className="text-[10px] text-destructive mt-0.5">{errors.materialCost}</p>}
          </div>
          <div>
            <Label className="text-xs">Labor Cost (ETB)</Label>
            <Input type="number" value={form.laborCost} onChange={e => setForm(p => ({ ...p, laborCost: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Install Cost (ETB)</Label>
            <Input type="number" value={form.installCost} onChange={e => setForm(p => ({ ...p, installCost: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Transport Cost (ETB)</Label>
            <Input type="number" value={form.transportCost} onChange={e => setForm(p => ({ ...p, transportCost: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Valid Until *</Label>
            <Input type="date" value={form.validity} onChange={e => setForm(p => ({ ...p, validity: e.target.value }))} className={errors.validity ? 'border-destructive' : ''} />
            {errors.validity && <p className="text-[10px] text-destructive mt-0.5">{errors.validity}</p>}
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
