import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Quote, Customer } from "@/data/sampleData";

const finishTypes = ['Mill Finish', 'Anodized', 'Powder Coated', 'Polished', 'Custom'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: Quote | null;
  customers: Customer[];
  onSave: (quote: Quote) => void;
}

export function EditQuoteDialog({ open, onOpenChange, quote, customers, onSave }: Props) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    customerId: '', projectName: '', items: '', materialCost: '', laborCost: '',
    installCost: '', transportCost: '', cuttingFee: '', discount: '',
    status: '', validity: '', finishType: '', notes: '',
  });

  useEffect(() => {
    if (quote) {
      setForm({
        customerId: quote.customerId, projectName: quote.projectName, items: String(quote.items),
        materialCost: String(quote.materialCost), laborCost: String(quote.laborCost),
        installCost: String(quote.installCost), transportCost: String(quote.transportCost),
        cuttingFee: String(quote.cuttingFee || ''), discount: String(quote.discount || ''),
        status: quote.status, validity: quote.validity,
        finishType: quote.finishType || '', notes: quote.notes || '',
      });
      setErrors({});
    }
  }, [quote]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerId) e.customerId = 'Required';
    if (!form.projectName.trim()) e.projectName = 'Required';
    if (!form.materialCost || Number(form.materialCost) <= 0) e.materialCost = 'Must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !quote) return;
    const customer = customers.find(c => c.id === form.customerId);
    const mat = Number(form.materialCost) || 0;
    const lab = Number(form.laborCost) || 0;
    const inst = Number(form.installCost) || 0;
    const trans = Number(form.transportCost) || 0;
    const cutting = Number(form.cuttingFee) || 0;
    const disc = Number(form.discount) || 0;
    const subtotal = mat + lab + inst + trans + cutting - disc;
    const vat = subtotal * 0.15;
    const updated: Quote = {
      ...quote,
      customerId: form.customerId, customerName: customer?.name || quote.customerName,
      projectName: form.projectName.trim(), items: Number(form.items) || 1,
      materialCost: mat, laborCost: lab, installCost: inst, transportCost: trans,
      cuttingFee: cutting || undefined, discount: disc || undefined,
      subtotal, vat, total: subtotal + vat,
      status: form.status as Quote['status'], validity: form.validity,
      finishType: form.finishType || undefined, notes: form.notes || undefined,
      marginPercent: mat > 0 ? Math.round(((subtotal - mat) / mat) * 100) : undefined,
    };
    onSave(updated);
    toast({ title: "Updated", description: `${updated.id} saved.` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Quote {quote?.id}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Customer *</Label>
            <Select value={form.customerId} onValueChange={v => setForm(p => ({ ...p, customerId: v }))}>
              <SelectTrigger className={errors.customerId ? 'border-destructive' : ''}><SelectValue /></SelectTrigger>
              <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Project Name *</Label>
            <Input value={form.projectName} onChange={e => setForm(p => ({ ...p, projectName: e.target.value }))} className={errors.projectName ? 'border-destructive' : ''} />
          </div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Pending', 'Accepted', 'Rejected', 'Expired'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Finish Type</Label>
            <Select value={form.finishType} onValueChange={v => setForm(p => ({ ...p, finishType: v }))}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{finishTypes.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Items Count</Label>
            <Input type="number" value={form.items} onChange={e => setForm(p => ({ ...p, items: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Material Cost (ETB) *</Label>
            <Input type="number" value={form.materialCost} onChange={e => setForm(p => ({ ...p, materialCost: e.target.value }))} className={errors.materialCost ? 'border-destructive' : ''} />
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
            <Label className="text-xs">Cutting Fee (ETB)</Label>
            <Input type="number" value={form.cuttingFee} onChange={e => setForm(p => ({ ...p, cuttingFee: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Discount (ETB)</Label>
            <Input type="number" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Valid Until</Label>
            <Input type="date" value={form.validity} onChange={e => setForm(p => ({ ...p, validity: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Transport Cost (ETB)</Label>
            <Input type="number" value={form.transportCost} onChange={e => setForm(p => ({ ...p, transportCost: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Notes</Label>
            <Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
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
