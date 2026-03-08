import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateSupplier, type Supplier } from "@/hooks/useSuppliers";

const countries = ['China', 'UAE', 'Turkey', 'Ethiopia', 'Germany', 'Italy', 'India', 'USA', 'UK', 'Other'];
const categories = ['Profiles', 'Sheets', 'Glass', 'Hardware', 'Sealants', 'Accessories', 'Tools', 'Bars', 'Tubes'];
const certs = ['ISO 9001', 'ISO 14001', 'CE', 'ASTM B221', 'EN 12150', 'DIN EN ISO 14001'];
const businessTypes = ['Manufacturer', 'Distributor', 'Agent', 'Trader', 'Importer'];
const currencies = ['ETB', 'USD', 'EUR', 'CNY', 'AED', 'TRY', 'GBP'];
const paymentTermsList = ['COD', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'LC', 'TT Advance', 'TT Partial'];
const statuses = ['Active', 'Inactive', 'Pending', 'Blacklisted', 'Prospect'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
}

export default function EditSupplierDialog({ open, onOpenChange, supplier }: Props) {
  const updateSupplier = useUpdateSupplier();
  const [tab, setTab] = useState("basic");
  const [form, setForm] = useState({
    companyName: '', companyNameAm: '', tradingName: '', businessType: 'Manufacturer',
    contactPerson: '', position: '', phone: '', phoneSecondary: '', email: '', website: '',
    country: 'Ethiopia', city: '', address: '', taxId: '',
    paymentTerms: 'Net 30', currency: 'ETB', status: 'Active',
    bankName: '', bankAccount: '', swiftCode: '',
    creditLimit: '0', averageLeadTime: '30', minOrderQty: '',
    preferred: false, approved: false,
    notes: '', selectedCategories: [] as string[], selectedCerts: [] as string[],
  });

  useEffect(() => {
    if (supplier) {
      setForm({
        companyName: supplier.company_name, companyNameAm: supplier.company_name_am,
        tradingName: supplier.trading_name || '', businessType: supplier.business_type,
        contactPerson: supplier.contact_person, position: supplier.position || '',
        phone: supplier.phone, phoneSecondary: supplier.phone_secondary || '',
        email: supplier.email, website: supplier.website || '',
        country: supplier.country, city: supplier.city || '', address: supplier.address || '',
        taxId: supplier.tax_id || '', paymentTerms: supplier.payment_terms, currency: supplier.currency,
        status: supplier.status,
        bankName: supplier.bank_name || '', bankAccount: supplier.bank_account || '', swiftCode: supplier.swift_code || '',
        creditLimit: String(supplier.credit_limit), averageLeadTime: String(supplier.average_lead_time),
        minOrderQty: String(supplier.min_order_qty || ''),
        preferred: supplier.preferred, approved: supplier.approved,
        notes: supplier.notes || '',
        selectedCategories: supplier.product_categories || [],
        selectedCerts: supplier.certifications || [],
      });
      setTab("basic");
    }
  }, [supplier]);

  const handleSave = async () => {
    if (!form.companyName.trim() || !supplier) return;
    await updateSupplier.mutateAsync({
      id: supplier.id,
      company_name: form.companyName.trim(),
      company_name_am: form.companyNameAm.trim(),
      trading_name: form.tradingName || null,
      business_type: form.businessType as any,
      contact_person: form.contactPerson.trim(),
      position: form.position || null,
      phone: form.phone.trim(),
      phone_secondary: form.phoneSecondary || null,
      email: form.email.trim(),
      website: form.website || null,
      country: form.country,
      city: form.city || null,
      address: form.address || null,
      tax_id: form.taxId || null,
      payment_terms: form.paymentTerms as any,
      currency: form.currency as any,
      status: form.status as any,
      bank_name: form.bankName || null,
      bank_account: form.bankAccount || null,
      swift_code: form.swiftCode || null,
      credit_limit: Number(form.creditLimit) || 0,
      average_lead_time: Number(form.averageLeadTime) || 30,
      min_order_qty: Number(form.minOrderQty) || null,
      product_categories: form.selectedCategories,
      certifications: form.selectedCerts,
      preferred: form.preferred,
      approved: form.approved,
      notes: form.notes || null,
    });
    onOpenChange(false);
  };

  const F = (field: string, label: string, opts?: { type?: string; span?: boolean }) => (
    <div className={opts?.span ? 'sm:col-span-2' : ''}>
      <Label className="text-xs">{label}</Label>
      <Input type={opts?.type || 'text'} className="h-8 text-xs" value={(form as any)[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Supplier</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 w-full h-8">
            <TabsTrigger value="basic" className="text-xs">Basic Info</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs">Contact & Payment</TabsTrigger>
            <TabsTrigger value="products" className="text-xs">Products & Certs</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {F('companyName', 'Company Name *')}
              {F('companyNameAm', 'Company Name (AM)')}
              {F('tradingName', 'Trading Name')}
              <div>
                <Label className="text-xs">Business Type</Label>
                <Select value={form.businessType} onValueChange={v => setForm(p => ({ ...p, businessType: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{businessTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Country</Label>
                <Select value={form.country} onValueChange={v => setForm(p => ({ ...p, country: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {F('city', 'City')}
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {F('taxId', 'Tax ID')}
              {F('address', 'Address', { span: true })}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-3 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {F('contactPerson', 'Contact Person')}
              {F('position', 'Position')}
              {F('phone', 'Phone')}
              {F('phoneSecondary', 'Phone Secondary')}
              {F('email', 'Email')}
              {F('website', 'Website')}
              <div>
                <Label className="text-xs">Currency</Label>
                <Select value={form.currency} onValueChange={v => setForm(p => ({ ...p, currency: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Payment Terms</Label>
                <Select value={form.paymentTerms} onValueChange={v => setForm(p => ({ ...p, paymentTerms: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{paymentTermsList.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {F('bankName', 'Bank Name')}
              {F('bankAccount', 'Bank Account')}
              {F('swiftCode', 'SWIFT Code')}
              {F('creditLimit', 'Credit Limit (ETB)', { type: 'number' })}
              {F('averageLeadTime', 'Lead Time (days)', { type: 'number' })}
              {F('minOrderQty', 'Min Order Qty', { type: 'number' })}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4 mt-3">
            <div>
              <Label className="text-xs mb-2 block font-medium">Product Categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <label key={c} className="flex items-center gap-1.5 text-xs">
                    <Checkbox checked={form.selectedCategories.includes(c)} onCheckedChange={checked => setForm(prev => ({ ...prev, selectedCategories: checked ? [...prev.selectedCategories, c] : prev.selectedCategories.filter(x => x !== c) }))} />
                    {c}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs mb-2 block font-medium">Certifications</Label>
              <div className="flex flex-wrap gap-2">
                {certs.map(c => (
                  <label key={c} className="flex items-center gap-1.5 text-xs">
                    <Checkbox checked={form.selectedCerts.includes(c)} onCheckedChange={checked => setForm(prev => ({ ...prev, selectedCerts: checked ? [...prev.selectedCerts, c] : prev.selectedCerts.filter(x => x !== c) }))} />
                    {c}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs">
                <Checkbox checked={form.preferred} onCheckedChange={checked => setForm(p => ({ ...p, preferred: !!checked }))} />
                Preferred Supplier
              </label>
              <label className="flex items-center gap-2 text-xs">
                <Checkbox checked={form.approved} onCheckedChange={checked => setForm(p => ({ ...p, approved: !!checked }))} />
                Approved
              </label>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-3">
            <Label className="text-xs">Notes</Label>
            <Textarea className="text-xs" rows={4} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={updateSupplier.isPending}>
            {updateSupplier.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
