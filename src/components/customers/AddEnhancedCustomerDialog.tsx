import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { generateCustomerCode, findDuplicates } from "@/lib/customerHelpers";
import type { EnhancedCustomer } from "@/data/customerTypes";
import { X } from "lucide-react";

const customerTypes = ['Individual', 'Company', 'Contractor', 'Developer', 'Retail', 'Wholesale', 'Fabricator', 'Distributor'] as const;
const paymentTerms = ['COD', 'Net 15', 'Net 30', 'Net 60'] as const;
const contactPrefs = ['phone', 'email', 'whatsapp', 'in-person', 'telegram'] as const;
const languages = ['en', 'am', 'both'] as const;
const commonTags = ['vip', 'new', 'repeat', 'high-value', 'commercial', 'residential', 'government', 'prospect'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (customer: EnhancedCustomer) => void;
  existingCustomers: EnhancedCustomer[];
}

export function AddEnhancedCustomerDialog({ open, onOpenChange, onAdd, existingCustomers }: Props) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicates, setDuplicates] = useState<EnhancedCustomer[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '', nameAm: '', contact: '', type: '', phone: '', phoneSecondary: '',
    email: '', address: '', shippingAddress: '', taxId: '', paymentTerms: '',
    creditLimit: '', source: '', notes: '', website: '', preferredContact: 'phone',
    language: 'both', city: '', subCity: '', telegram: '', whatsapp: '',
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

  const checkDuplicates = () => {
    const dupes = findDuplicates(existingCustomers, { name: form.name, email: form.email, phone: form.phone });
    setDuplicates(dupes);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const code = generateCustomerCode(existingCustomers.length);
    const now = new Date().toISOString().split('T')[0];

    const customer: EnhancedCustomer = {
      id: `CUS-${String(existingCustomers.length + 1).padStart(3, '0')}`,
      code,
      name: form.name.trim(), nameAm: form.nameAm.trim(),
      contact: form.contact.trim() || form.name.trim(),
      type: form.type as EnhancedCustomer['type'],
      phone: form.phone.trim(),
      phoneSecondary: form.phoneSecondary || undefined,
      email: form.email.trim(),
      address: form.address.trim(),
      shippingAddress: form.shippingAddress || undefined,
      taxId: form.taxId || undefined,
      paymentTerms: form.paymentTerms || undefined,
      creditLimit: Number(form.creditLimit) || undefined,
      source: form.source || undefined,
      notes: form.notes || undefined,
      projects: 0, totalValue: 0, outstanding: 0, status: 'Active',
      website: form.website || undefined,
      socialMedia: (form.telegram || form.whatsapp) ? { telegram: form.telegram || undefined, whatsapp: form.whatsapp || undefined } : undefined,
      location: (form.city || form.subCity) ? { city: form.city || 'Addis Ababa', subCity: form.subCity } : undefined,
      healthScore: 50, healthStatus: 'attention',
      customerSince: now,
      preferredContact: form.preferredContact as EnhancedCustomer['preferredContact'],
      language: form.language as EnhancedCustomer['language'],
      tags: selectedTags,
      segments: [],
      referralCount: 0,
      createdAt: now, updatedAt: now,
    };

    onAdd(customer);
    toast({ title: t('common.add'), description: `${customer.name} added.` });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setForm({ name: '', nameAm: '', contact: '', type: '', phone: '', phoneSecondary: '', email: '', address: '', shippingAddress: '', taxId: '', paymentTerms: '', creditLimit: '', source: '', notes: '', website: '', preferredContact: 'phone', language: 'both', city: '', subCity: '', telegram: '', whatsapp: '' });
    setErrors({});
    setDuplicates([]);
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Customer</DialogTitle></DialogHeader>

        {duplicates.length > 0 && (
          <div className="p-2 bg-warning/10 border border-warning/20 rounded-md text-xs">
            <p className="font-semibold text-warning">⚠ Possible duplicates found:</p>
            {duplicates.map(d => <p key={d.id} className="text-muted-foreground">{d.name} ({d.phone})</p>)}
          </div>
        )}

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
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} onBlur={checkDuplicates} className={errors.name ? 'border-destructive' : ''} />
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
                <Label className="text-xs">Source</Label>
                <Select value={form.source} onValueChange={v => setForm(p => ({ ...p, source: v }))}>
                  <SelectTrigger><SelectValue placeholder="How they found us" /></SelectTrigger>
                  <SelectContent>
                    {['Direct', 'Referral', 'Website', 'Trade Show', 'Social Media', 'Other'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Preferred Language</Label>
                <Select value={form.language} onValueChange={v => setForm(p => ({ ...p, language: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {languages.map(l => <SelectItem key={l} value={l}>{l === 'en' ? 'English' : l === 'am' ? 'Amharic' : 'Both'}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-3 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Phone *</Label>
                <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} onBlur={checkDuplicates} className={errors.phone ? 'border-destructive' : ''} />
                {errors.phone && <p className="text-[10px] text-destructive mt-0.5">{errors.phone}</p>}
              </div>
              <div>
                <Label className="text-xs">Secondary Phone</Label>
                <Input value={form.phoneSecondary} onChange={e => setForm(p => ({ ...p, phoneSecondary: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} onBlur={checkDuplicates} className={errors.email ? 'border-destructive' : ''} />
                {errors.email && <p className="text-[10px] text-destructive mt-0.5">{errors.email}</p>}
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
                <Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="Addis Ababa" />
              </div>
              <div>
                <Label className="text-xs">Sub-city</Label>
                <Input value={form.subCity} onChange={e => setForm(p => ({ ...p, subCity: e.target.value }))} placeholder="Bole" />
              </div>
              <div>
                <Label className="text-xs">Telegram</Label>
                <Input value={form.telegram} onChange={e => setForm(p => ({ ...p, telegram: e.target.value }))} placeholder="@username" />
              </div>
              <div>
                <Label className="text-xs">WhatsApp</Label>
                <Input value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="+251..." />
              </div>
              <div>
                <Label className="text-xs">Website</Label>
                <Input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
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
                  <SelectContent>{paymentTerms.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Credit Limit (ETB)</Label>
                <Input type="number" value={form.creditLimit} onChange={e => setForm(p => ({ ...p, creditLimit: e.target.value }))} />
              </div>
              <div>
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
            <p className="text-xs text-muted-foreground">Select tags for this customer:</p>
            <div className="flex flex-wrap gap-1.5">
              {commonTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && <X className="h-2.5 w-2.5 ml-1" />}
                </Badge>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit}>{t('common.add')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
