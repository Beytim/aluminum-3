import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { type EnhancedSupplier, type PaymentTerms, type ProcCurrency, type ShippingTerms } from "@/data/enhancedProcurementData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (supplier: EnhancedSupplier) => void;
  supplierCount: number;
}

const countries = ['China', 'UAE', 'Turkey', 'Ethiopia', 'Germany', 'Italy', 'India', 'USA', 'UK'];
const categories = ['Profiles', 'Sheets', 'Glass', 'Hardware', 'Sealants', 'Accessories', 'Tools', 'Bars', 'Tubes'];
const certs = ['ISO 9001', 'ISO 14001', 'CE', 'ASTM B221', 'EN 12150', 'DIN EN ISO 14001'];

export default function AddSupplierDialog({ open, onOpenChange, onAdd, supplierCount }: Props) {
  const [tab, setTab] = useState('basic');
  const [form, setForm] = useState({
    companyName: '', tradingName: '', businessType: 'Manufacturer' as EnhancedSupplier['businessType'],
    contactPerson: '', position: '', phone: '', phoneSecondary: '', email: '', website: '',
    country: 'China', city: '', address: '', taxId: '',
    paymentTerms: 'Net 30' as PaymentTerms, currency: 'USD' as ProcCurrency,
    bankName: '', bankAccount: '', swiftCode: '',
    averageLeadTime: 30, minOrderQty: 0, preferred: false,
    notes: '',
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);

  const handleCreate = () => {
    if (!form.companyName) return;
    const num = String(supplierCount + 1).padStart(4, '0');
    const supplier: EnhancedSupplier = {
      id: `SUP-${num}`, supplierCode: `SUP-${num}`,
      companyName: form.companyName, tradingName: form.tradingName || undefined,
      businessType: form.businessType,
      contactPerson: form.contactPerson, position: form.position || undefined,
      phone: form.phone, phoneSecondary: form.phoneSecondary || undefined,
      email: form.email, website: form.website || undefined,
      country: form.country, city: form.city || undefined, address: form.address || undefined,
      taxId: form.taxId || undefined,
      paymentTerms: form.paymentTerms, currency: form.currency,
      bankName: form.bankName || undefined, bankAccount: form.bankAccount || undefined, swiftCode: form.swiftCode || undefined,
      creditLimit: 0, creditUsed: 0,
      productCategories: selectedCategories, certifications: selectedCerts,
      rating: 3,
      performance: { onTimeDeliveryRate: 0, qualityRating: 0, responseTime: 0, totalOrders: 0, totalSpent: 0, averageOrderValue: 0 },
      averageLeadTime: form.averageLeadTime, minOrderQty: form.minOrderQty || undefined,
      shippingTerms: ['FOB'], preferred: form.preferred, approved: false,
      status: 'Pending', notes: form.notes || undefined,
      activityLog: [{ date: new Date().toISOString().split('T')[0], user: 'USR-001', userName: 'Admin', action: 'Supplier created' }],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    onAdd(supplier);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Supplier</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="basic" className="text-xs">Basic Info</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs">Contact</TabsTrigger>
            <TabsTrigger value="products" className="text-xs">Products</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Company Name *</Label><Input className="h-9 text-xs" value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} /></div>
              <div><Label className="text-xs">Trading Name</Label><Input className="h-9 text-xs" value={form.tradingName} onChange={e => setForm(p => ({ ...p, tradingName: e.target.value }))} /></div>
              <div>
                <Label className="text-xs">Business Type</Label>
                <Select value={form.businessType} onValueChange={v => setForm(p => ({ ...p, businessType: v as any }))}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>{['Manufacturer', 'Distributor', 'Agent', 'Trader', 'Importer'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Country</Label>
                <Select value={form.country} onValueChange={v => setForm(p => ({ ...p, country: v }))}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">City</Label><Input className="h-9 text-xs" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} /></div>
              <div><Label className="text-xs">Tax ID</Label><Input className="h-9 text-xs" value={form.taxId} onChange={e => setForm(p => ({ ...p, taxId: e.target.value }))} /></div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Contact Person</Label><Input className="h-9 text-xs" value={form.contactPerson} onChange={e => setForm(p => ({ ...p, contactPerson: e.target.value }))} /></div>
              <div><Label className="text-xs">Position</Label><Input className="h-9 text-xs" value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} /></div>
              <div><Label className="text-xs">Phone</Label><Input className="h-9 text-xs" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
              <div><Label className="text-xs">Email</Label><Input className="h-9 text-xs" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
              <div><Label className="text-xs">Website</Label><Input className="h-9 text-xs" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} /></div>
              <div>
                <Label className="text-xs">Currency</Label>
                <Select value={form.currency} onValueChange={v => setForm(p => ({ ...p, currency: v as ProcCurrency }))}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>{['ETB', 'USD', 'EUR', 'CNY', 'AED', 'TRY', 'GBP'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Payment Terms</Label>
                <Select value={form.paymentTerms} onValueChange={v => setForm(p => ({ ...p, paymentTerms: v as PaymentTerms }))}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>{['COD', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'LC', 'TT Advance'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Bank Name</Label><Input className="h-9 text-xs" value={form.bankName} onChange={e => setForm(p => ({ ...p, bankName: e.target.value }))} /></div>
              <div><Label className="text-xs">SWIFT Code</Label><Input className="h-9 text-xs" value={form.swiftCode} onChange={e => setForm(p => ({ ...p, swiftCode: e.target.value }))} /></div>
              <div><Label className="text-xs">Lead Time (days)</Label><Input type="number" className="h-9 text-xs" value={form.averageLeadTime} onChange={e => setForm(p => ({ ...p, averageLeadTime: +e.target.value }))} /></div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-3 mt-3">
            <div>
              <Label className="text-xs mb-2 block">Product Categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <label key={c} className="flex items-center gap-1.5 text-xs">
                    <Checkbox checked={selectedCategories.includes(c)} onCheckedChange={checked => setSelectedCategories(prev => checked ? [...prev, c] : prev.filter(x => x !== c))} />
                    {c}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs mb-2 block">Certifications</Label>
              <div className="flex flex-wrap gap-2">
                {certs.map(c => (
                  <label key={c} className="flex items-center gap-1.5 text-xs">
                    <Checkbox checked={selectedCerts.includes(c)} onCheckedChange={checked => setSelectedCerts(prev => checked ? [...prev, c] : prev.filter(x => x !== c))} />
                    {c}
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <Checkbox checked={form.preferred} onCheckedChange={checked => setForm(p => ({ ...p, preferred: !!checked }))} />
              Mark as Preferred Supplier
            </label>
          </TabsContent>

          <TabsContent value="notes" className="mt-3">
            <Label className="text-xs">Notes</Label>
            <Textarea className="text-xs" rows={4} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {tab !== 'notes' ? (
            <Button onClick={() => { const tabs = ['basic', 'contact', 'products', 'notes']; const idx = tabs.indexOf(tab); if (idx < tabs.length - 1) setTab(tabs[idx + 1]); }}>Next</Button>
          ) : (
            <Button onClick={handleCreate} disabled={!form.companyName}>Add Supplier</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
