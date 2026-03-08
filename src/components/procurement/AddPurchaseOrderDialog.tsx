import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import {
  type EnhancedSupplier, type EnhancedPurchaseOrder, type EnhancedPOItem, type PaymentTerms, type ShippingTerms,
  procExchangeRates, procFormatCurrency,
} from "@/data/enhancedProcurementData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (po: EnhancedPurchaseOrder) => void;
  suppliers: EnhancedSupplier[];
  poCount: number;
  preSelectedSupplierId?: string;
}

export default function AddPurchaseOrderDialog({ open, onOpenChange, onAdd, suppliers, poCount, preSelectedSupplierId }: Props) {
  const [tab, setTab] = useState('supplier');
  const [form, setForm] = useState({
    supplierId: preSelectedSupplierId || '',
    projectName: '', orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '', paymentTerms: 'Net 30' as PaymentTerms,
    shippingTerms: 'FOB' as ShippingTerms, shippingMethod: '' as string,
    shippingCost: 0, insurance: 0, customsDuty: 0, otherCharges: 0,
    notes: '',
  });
  const [items, setItems] = useState<{ name: string; qty: number; price: number; unit: string }[]>([]);
  const [newItem, setNewItem] = useState({ name: '', qty: 1, price: 0, unit: 'pcs' });

  const supplier = suppliers.find(s => s.id === form.supplierId);
  const currency = supplier?.currency || 'USD';
  const rate = procExchangeRates[currency] || 1;
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const total = subtotal + form.shippingCost + form.insurance + form.customsDuty + form.otherCharges;

  const addItem = () => {
    if (!newItem.name || newItem.price <= 0) return;
    setItems(prev => [...prev, { ...newItem }]);
    setNewItem({ name: '', qty: 1, price: 0, unit: 'pcs' });
  };

  const handleCreate = () => {
    if (!form.supplierId || items.length === 0) return;
    const num = String(poCount + 1).padStart(4, '0');

    const poItems: EnhancedPOItem[] = items.map((it, i) => ({
      id: `POI-${i}`, productName: it.name, description: it.name,
      quantity: it.qty, unit: it.unit, received: 0, rejected: 0, remaining: it.qty,
      unitPrice: it.price, discountPercent: 0, discountAmount: 0, lineTotal: it.qty * it.price,
      unitPriceInETB: it.price * rate, lineTotalInETB: it.qty * it.price * rate,
      taxRate: 0, taxAmount: 0, landedUnitCost: it.price * 1.15,
      inspected: false, status: 'Pending' as const,
    }));

    const po: EnhancedPurchaseOrder = {
      id: `PO-${num}`, poNumber: `PO-${num}`,
      supplierId: form.supplierId, supplierName: supplier!.companyName, supplierCode: supplier!.supplierCode,
      projectName: form.projectName || undefined,
      orderDate: form.orderDate, expectedDelivery: form.expectedDelivery || form.orderDate,
      status: 'Draft', approvalStatus: 'Pending',
      currency, exchangeRate: rate,
      items: poItems,
      subtotal, discountAmount: 0, taxAmount: 0,
      shippingCost: form.shippingCost, shippingTerms: form.shippingTerms,
      shippingMethod: form.shippingMethod as any || undefined,
      insurance: form.insurance, customsDuty: form.customsDuty, otherCharges: form.otherCharges,
      total, totalInETB: total * rate,
      paymentTerms: form.paymentTerms,
      paid: 0, paidInETB: 0, balance: total, balanceInETB: total * rate,
      payments: [], receipts: [],
      isOverdue: false, isUrgent: false, notes: form.notes || undefined,
      activityLog: [{ date: form.orderDate, user: 'USR-001', userName: 'Admin', action: 'PO created' }],
      createdBy: 'USR-001', createdByName: 'Admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    onAdd(po);
    setItems([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Create Purchase Order</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="supplier" className="text-xs">Supplier</TabsTrigger>
            <TabsTrigger value="items" className="text-xs">Items</TabsTrigger>
            <TabsTrigger value="shipping" className="text-xs">Shipping & Costs</TabsTrigger>
            <TabsTrigger value="review" className="text-xs">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="supplier" className="space-y-3 mt-3">
            <div>
              <Label className="text-xs">Supplier *</Label>
              <Select value={form.supplierId} onValueChange={v => setForm(p => ({ ...p, supplierId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.companyName} ({s.country})</SelectItem>)}</SelectContent>
              </Select>
              {supplier && <p className="text-[10px] text-muted-foreground mt-1">{supplier.contactPerson} · {supplier.currency} · Lead: {supplier.averageLeadTime}d</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Project (optional)</Label><Input className="h-9 text-xs" value={form.projectName} onChange={e => setForm(p => ({ ...p, projectName: e.target.value }))} /></div>
              <div><Label className="text-xs">Order Date</Label><Input type="date" className="h-9 text-xs" value={form.orderDate} onChange={e => setForm(p => ({ ...p, orderDate: e.target.value }))} /></div>
              <div><Label className="text-xs">Expected Delivery</Label><Input type="date" className="h-9 text-xs" value={form.expectedDelivery} onChange={e => setForm(p => ({ ...p, expectedDelivery: e.target.value }))} /></div>
              <div>
                <Label className="text-xs">Payment Terms</Label>
                <Select value={form.paymentTerms} onValueChange={v => setForm(p => ({ ...p, paymentTerms: v as PaymentTerms }))}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>{['COD', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'LC', 'TT Advance'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-3 mt-3">
            <div className="flex gap-2 items-end">
              <div className="flex-1"><Label className="text-xs">Item</Label><Input className="h-8 text-xs" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} /></div>
              <div className="w-16"><Label className="text-xs">Qty</Label><Input type="number" className="h-8 text-xs" value={newItem.qty} onChange={e => setNewItem(p => ({ ...p, qty: +e.target.value }))} /></div>
              <div className="w-16"><Label className="text-xs">Unit</Label><Input className="h-8 text-xs" value={newItem.unit} onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))} /></div>
              <div className="w-24"><Label className="text-xs">Price ({currency})</Label><Input type="number" className="h-8 text-xs" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: +e.target.value }))} /></div>
              <Button size="sm" className="h-8" onClick={addItem}><Plus className="h-3 w-3" /></Button>
            </div>
            {items.length > 0 && (
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Item</TableHead>
                  <TableHead className="text-xs text-right">Qty</TableHead>
                  <TableHead className="text-xs">Unit</TableHead>
                  <TableHead className="text-xs text-right">Price</TableHead>
                  <TableHead className="text-xs text-right">Total</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {items.map((it, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs">{it.name}</TableCell>
                      <TableCell className="text-xs text-right">{it.qty}</TableCell>
                      <TableCell className="text-xs">{it.unit}</TableCell>
                      <TableCell className="text-xs text-right">{procFormatCurrency(it.price, currency)}</TableCell>
                      <TableCell className="text-xs text-right font-medium">{procFormatCurrency(it.qty * it.price, currency)}</TableCell>
                      <TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setItems(p => p.filter((_, idx) => idx !== i))}><Trash2 className="h-3 w-3 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <p className="text-right text-xs font-medium">Subtotal: {procFormatCurrency(subtotal, currency)}</p>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Shipping Terms</Label>
                <Select value={form.shippingTerms} onValueChange={v => setForm(p => ({ ...p, shippingTerms: v as ShippingTerms }))}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>{['EXW', 'FOB', 'CIF', 'CIP', 'DAP', 'DDP'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Shipping Method</Label>
                <Select value={form.shippingMethod} onValueChange={v => setForm(p => ({ ...p, shippingMethod: v }))}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{['Sea', 'Air', 'Land', 'Courier'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Shipping Cost</Label><Input type="number" className="h-9 text-xs" value={form.shippingCost} onChange={e => setForm(p => ({ ...p, shippingCost: +e.target.value }))} /></div>
              <div><Label className="text-xs">Insurance</Label><Input type="number" className="h-9 text-xs" value={form.insurance} onChange={e => setForm(p => ({ ...p, insurance: +e.target.value }))} /></div>
              <div><Label className="text-xs">Customs Duty</Label><Input type="number" className="h-9 text-xs" value={form.customsDuty} onChange={e => setForm(p => ({ ...p, customsDuty: +e.target.value }))} /></div>
              <div><Label className="text-xs">Other Charges</Label><Input type="number" className="h-9 text-xs" value={form.otherCharges} onChange={e => setForm(p => ({ ...p, otherCharges: +e.target.value }))} /></div>
            </div>
            <div><Label className="text-xs">Notes</Label><Textarea className="text-xs" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
          </TabsContent>

          <TabsContent value="review" className="mt-3">
            <div className="space-y-2 bg-muted/30 p-4 rounded-lg text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Supplier</span><span className="font-medium">{supplier?.companyName || '—'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span>{items.length} item(s)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Currency</span><span>{currency}</span></div>
              <hr className="border-border" />
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{procFormatCurrency(subtotal, currency)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{procFormatCurrency(form.shippingCost, currency)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Insurance + Duty + Other</span><span>{procFormatCurrency(form.insurance + form.customsDuty + form.otherCharges, currency)}</span></div>
              <div className="flex justify-between text-sm font-bold"><span>Total</span><span>{procFormatCurrency(total, currency)}</span></div>
              {currency !== 'ETB' && <div className="flex justify-between text-muted-foreground"><span>Total in ETB</span><span>ETB {(total * rate).toLocaleString()}</span></div>}
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {tab !== 'review' ? (
            <Button onClick={() => { const tabs = ['supplier', 'items', 'shipping', 'review']; const idx = tabs.indexOf(tab); if (idx < tabs.length - 1) setTab(tabs[idx + 1]); }}>Next</Button>
          ) : (
            <Button onClick={handleCreate} disabled={!form.supplierId || items.length === 0}>Create PO</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
