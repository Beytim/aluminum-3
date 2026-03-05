import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Customer } from "@/data/sampleData";

const customerTypes = ['Individual', 'Company', 'Contractor', 'Developer', 'Retail', 'Wholesale', 'Fabricator', 'Distributor'] as const;
const paymentTerms = ['COD', 'Net 15', 'Net 30', 'Net 60'] as const;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSave: (customer: Customer) => void;
}

export function EditCustomerDialog({ open, onOpenChange, customer, onSave }: Props) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', nameAm: '', contact: '', type: '', phone: '', phoneSecondary: '',
    email: '', address: '', shippingAddress: '', taxId: '', paymentTerms: '',
    creditLimit: '', source: '', notes: '',
  });

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name, nameAm: customer.nameAm, contact: customer.contact,
        type: customer.type, phone: customer.phone, phoneSecondary: customer.phoneSecondary || '',
        email: customer.email, address: customer.address, shippingAddress: customer.shippingAddress || '',
        taxId: customer.taxId || '', paymentTerms: customer.paymentTerms || '',
        creditLimit: String(customer.creditLimit || ''), source: customer.source || '',
        notes: customer.notes || '',
      });
      setErrors({});
    }
  }, [customer]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.nameAm.trim()) e.nameAm = 'Required';
    if (!form.type) e.type = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !customer) return;
    const updated: Customer = {
      ...customer,
      name: form.name.trim(), nameAm: form.nameAm.trim(), contact: form.contact.trim() || form.name.trim(),
      type: form.type as Customer['type'], phone: form.phone.trim(),
      phoneSecondary: form.phoneSecondary || undefined, email: form.email.trim(),
      address: form.address.trim(), shippingAddress: form.shippingAddress || undefined,
      taxId: form.taxId || undefined, paymentTerms: form.paymentTerms || undefined,
      creditLimit: Number(form.creditLimit) || undefined, source: form.source || undefined,
      notes: form.notes || undefined,
    };
    onSave(updated);
    toast({ title: "Updated", description: `${updated.name} saved.` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Customer</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Name (EN) *</Label>
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={errors.name ? 'border-destructive' : ''} />
          </div>
          <div>
            <Label className="text-xs">ስም (AM) *</Label>
            <Input value={form.nameAm} onChange={e => setForm(p => ({ ...p, nameAm: e.target.value }))} className={errors.nameAm ? 'border-destructive' : ''} />
          </div>
          <div>
            <Label className="text-xs">Contact Person</Label>
            <Input value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Type *</Label>
            <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
              <SelectTrigger className={errors.type ? 'border-destructive' : ''}><SelectValue /></SelectTrigger>
              <SelectContent>{customerTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Phone *</Label>
            <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={errors.phone ? 'border-destructive' : ''} />
          </div>
          <div>
            <Label className="text-xs">Secondary Phone</Label>
            <Input value={form.phoneSecondary} onChange={e => setForm(p => ({ ...p, phoneSecondary: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Tax ID / VAT</Label>
            <Input value={form.taxId} onChange={e => setForm(p => ({ ...p, taxId: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Payment Terms</Label>
            <Select value={form.paymentTerms} onValueChange={v => setForm(p => ({ ...p, paymentTerms: v }))}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{paymentTerms.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Credit Limit (ETB)</Label>
            <Input type="number" value={form.creditLimit} onChange={e => setForm(p => ({ ...p, creditLimit: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Address</Label>
            <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Shipping Address</Label>
            <Input value={form.shippingAddress} onChange={e => setForm(p => ({ ...p, shippingAddress: e.target.value }))} />
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
