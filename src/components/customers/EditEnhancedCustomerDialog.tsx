import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { EnhancedCustomer } from "@/data/customerTypes";
import { X } from "lucide-react";

const customerTypes = ['Individual', 'Company', 'Contractor', 'Developer', 'Retail', 'Wholesale', 'Fabricator', 'Distributor'] as const;
const paymentTermsList = ['COD', 'Net 15', 'Net 30', 'Net 60'] as const;
const contactPrefs = ['phone', 'email', 'whatsapp', 'in-person', 'telegram'] as const;
const languagesList = ['en', 'am', 'both'] as const;
const commonTags = ['vip', 'new', 'repeat', 'high-value', 'commercial', 'residential', 'government', 'prospect', 'at-risk'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: EnhancedCustomer | null;
  onSave: (customer: EnhancedCustomer) => void;
}

export function EditEnhancedCustomerDialog({ open, onOpenChange, customer, onSave }: Props) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '', nameAm: '', contact: '', type: '', phone: '', phoneSecondary: '',
    email: '', address: '', shippingAddress: '', taxId: '', paymentTerms: '',
    creditLimit: '', source: '', notes: '', website: '', preferredContact: 'phone',
    language: 'both', city: '', subCity: '', telegram: '', whatsapp: '', status: 'Active',
  });

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name, nameAm: customer.nameAm, contact: customer.contact,
        type: customer.type, phone: customer.phone, phoneSecondary: customer.phoneSecondary || '',
        email: customer.email, address: customer.address, shippingAddress: customer.shippingAddress || '',
        taxId: customer.taxId || '', paymentTerms: customer.paymentTerms || '',
        creditLimit: String(customer.creditLimit || ''), source: customer.source || '',
        notes: customer.notes || '', website: customer.website || '',
        preferredContact: customer.preferredContact || 'phone',
        language: customer.language || 'both',
        city: customer.location?.city || '', subCity: customer.location?.subCity || '',
        telegram: customer.socialMedia?.telegram || '', whatsapp: customer.socialMedia?.whatsapp || '',
        status: customer.status || 'Active',
      });
      setSelectedTags(customer.tags || []);
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
    const now = new Date().toISOString().split('T')[0];
    const updated: EnhancedCustomer = {
      ...customer,
      name: form.name.trim(), nameAm: form.nameAm.trim(),
      contact: form.contact.trim() || form.name.trim(),
      type: form.type as EnhancedCustomer['type'],
      phone: form.phone.trim(), phoneSecondary: form.phoneSecondary || undefined,
      email: form.email.trim(), address: form.address.trim(),
      shippingAddress: form.shippingAddress || undefined,
      taxId: form.taxId || undefined, paymentTerms: form.paymentTerms || undefined,
      creditLimit: Number(form.creditLimit) || undefined,
      source: form.source || undefined, notes: form.notes || undefined,
      website: form.website || undefined,
      socialMedia: (form.telegram || form.whatsapp) ? { telegram: form.telegram || undefined, whatsapp: form.whatsapp || undefined } : undefined,
      location: (form.city || form.subCity) ? { city: form.city || 'Addis Ababa', subCity: form.subCity } : undefined,
      preferredContact: form.preferredContact as EnhancedCustomer['preferredContact'],
      language: form.language as EnhancedCustomer['language'],
      status: form.status as EnhancedCustomer['status'],
      tags: selectedTags,
      updatedAt: now,
    };
    onSave(updated);
    toast({ title: "Updated", description: `${updated.name} saved.` });
    onOpenChange(false);
  };

  const toggleTag = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Customer</DialogTitle></DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="w-full">
            <TabsTrigger value="basic" className="text-xs flex-1">Basic Info</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs flex-1">Contact</TabsTrigger>
            <TabsTrigger value="business" className="text-xs flex-1">Business</TabsTrigger>
            <TabsTrigger value="tags" className="text-xs flex-1">Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Name (EN) *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={errors.name ? 'border-destructive' : ''} />
                {errors.name && <p className="text-[10px] text-destructive mt-0.5">{errors.name}</p>}
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
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Source</Label>
                <Select value={form.source} onValueChange={v => setForm(p => ({ ...p, source: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {['Direct', 'Referral', 'Website', 'Trade Show', 'Social Media', 'Other'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-3 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <Label className="text-xs">Preferred Contact</Label>
                <Select value={form.preferredContact} onValueChange={v => setForm(p => ({ ...p, preferredContact: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{contactPrefs.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Address</Label>
                <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">City</Label>
                <Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Sub-city</Label>
                <Input value={form.subCity} onChange={e => setForm(p => ({ ...p, subCity: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Telegram</Label>
                <Input value={form.telegram} onChange={e => setForm(p => ({ ...p, telegram: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">WhatsApp</Label>
                <Input value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-3 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Tax ID / VAT</Label>
                <Input value={form.taxId} onChange={e => setForm(p => ({ ...p, taxId: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Payment Terms</Label>
                <Select value={form.paymentTerms} onValueChange={v => setForm(p => ({ ...p, paymentTerms: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{paymentTermsList.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Credit Limit (ETB)</Label>
                <Input type="number" value={form.creditLimit} onChange={e => setForm(p => ({ ...p, creditLimit: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Website</Label>
                <Input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Shipping Address</Label>
                <Input value={form.shippingAddress} onChange={e => setForm(p => ({ ...p, shippingAddress: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Notes</Label>
                <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="h-20" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tags" className="space-y-3 mt-3">
            <p className="text-xs text-muted-foreground">Select tags:</p>
            <div className="flex flex-wrap gap-1.5">
              {commonTags.map(tag => (
                <Badge key={tag} variant={selectedTags.includes(tag) ? 'default' : 'outline'} className="cursor-pointer text-xs" onClick={() => toggleTag(tag)}>
                  {tag} {selectedTags.includes(tag) && <X className="h-2.5 w-2.5 ml-1" />}
                </Badge>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
