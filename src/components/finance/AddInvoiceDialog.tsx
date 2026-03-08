import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { enhancedCustomers } from "@/data/enhancedCustomerData";
import { type Currency, type EnhancedInvoice, type EnhancedInvoiceItem, exchangeRates, formatCurrency, calculateVAT } from "@/data/enhancedFinanceData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (invoice: EnhancedInvoice) => void;
  invoiceCount: number;
}

export default function AddInvoiceDialog({ open, onOpenChange, onAdd, invoiceCount }: Props) {
  const [tab, setTab] = useState('customer');
  const [form, setForm] = useState({
    customerId: '', projectName: '', orderNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: 'ETB' as Currency,
    paymentTerms: 'Net 30',
    notes: '',
  });
  const [items, setItems] = useState<{ desc: string; qty: number; price: number; unit: string }[]>([]);
  const [newItem, setNewItem] = useState({ desc: '', qty: 1, price: 0, unit: 'pcs' });

  const customer = enhancedCustomers.find(c => c.id === form.customerId);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = calculateVAT(subtotal);
  const total = subtotal + tax;
  const rate = exchangeRates[form.currency] || 1;

  const addItem = () => {
    if (!newItem.desc || newItem.price <= 0) return;
    setItems(prev => [...prev, { ...newItem }]);
    setNewItem({ desc: '', qty: 1, price: 0, unit: 'pcs' });
  };

  const handleCreate = () => {
    if (!form.customerId || items.length === 0) return;
    const num = String(invoiceCount + 1).padStart(4, '0');
    const invoiceItems: EnhancedInvoiceItem[] = items.map((it, i) => {
      const lineTotal = it.qty * it.price;
      const taxAmt = lineTotal * 0.15;
      return {
        id: `ITEM-${i}`, description: it.desc, quantity: it.qty, unit: it.unit,
        unitPrice: it.price, discountPercent: 0, discountAmount: 0, netPrice: it.price,
        taxRate: 15, taxAmount: taxAmt, lineTotal, lineTotalWithTax: lineTotal + taxAmt,
      };
    });

    const invoice: EnhancedInvoice = {
      id: `INV-${num}`, invoiceNumber: `INV-${num}`,
      customerId: form.customerId, customerName: customer?.name || '', customerCode: customer?.code || '',
      customerAddress: customer?.address, projectName: form.projectName || undefined,
      orderNumber: form.orderNumber || undefined,
      issueDate: form.issueDate, dueDate: form.dueDate || form.issueDate,
      status: 'Draft', currency: form.currency, exchangeRate: rate,
      items: invoiceItems,
      subtotal, discountAmount: 0, taxableAmount: subtotal, taxRate: 15, taxAmount: tax,
      shippingCost: 0, otherCharges: 0, total, totalInETB: total * rate,
      payments: [], totalPaid: 0, totalPaidInETB: 0, balance: total, balanceInETB: total * rate,
      paymentTerms: form.paymentTerms, paymentDueDays: 30,
      notes: form.notes || undefined, isOverdue: false, isFullyPaid: false,
      activityLog: [{ date: form.issueDate, user: 'USR-001', userName: 'Admin', action: 'Invoice created' }],
      createdAt: new Date().toISOString(), createdBy: 'USR-001', createdByName: 'Admin', updatedAt: new Date().toISOString(),
    };
    onAdd(invoice);
    setForm({ customerId: '', projectName: '', orderNumber: '', issueDate: new Date().toISOString().split('T')[0], dueDate: '', currency: 'ETB', paymentTerms: 'Net 30', notes: '' });
    setItems([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="customer" className="text-xs">Customer</TabsTrigger>
            <TabsTrigger value="items" className="text-xs">Items</TabsTrigger>
            <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
            <TabsTrigger value="review" className="text-xs">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="space-y-3 mt-3">
            <div>
              <Label className="text-xs">Customer *</Label>
              <Select value={form.customerId} onValueChange={v => setForm(p => ({ ...p, customerId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>{enhancedCustomers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              {customer && <p className="text-[10px] text-muted-foreground mt-1">{customer.address} • {customer.phone}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Project (optional)</Label><Input className="h-9 text-xs" value={form.projectName} onChange={e => setForm(p => ({ ...p, projectName: e.target.value }))} /></div>
              <div><Label className="text-xs">Order # (optional)</Label><Input className="h-9 text-xs" value={form.orderNumber} onChange={e => setForm(p => ({ ...p, orderNumber: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Issue Date</Label><Input type="date" className="h-9 text-xs" value={form.issueDate} onChange={e => setForm(p => ({ ...p, issueDate: e.target.value }))} /></div>
              <div><Label className="text-xs">Due Date</Label><Input type="date" className="h-9 text-xs" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} /></div>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-3 mt-3">
            <div className="flex gap-2 items-end">
              <div className="flex-1"><Label className="text-xs">Description</Label><Input className="h-8 text-xs" value={newItem.desc} onChange={e => setNewItem(p => ({ ...p, desc: e.target.value }))} /></div>
              <div className="w-16"><Label className="text-xs">Qty</Label><Input type="number" className="h-8 text-xs" value={newItem.qty} onChange={e => setNewItem(p => ({ ...p, qty: +e.target.value }))} /></div>
              <div className="w-24"><Label className="text-xs">Price</Label><Input type="number" className="h-8 text-xs" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: +e.target.value }))} /></div>
              <Button size="sm" className="h-8" onClick={addItem}><Plus className="h-3 w-3" /></Button>
            </div>
            {items.length > 0 && (
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs text-right">Qty</TableHead>
                  <TableHead className="text-xs text-right">Price</TableHead>
                  <TableHead className="text-xs text-right">Total</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {items.map((it, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs">{it.desc}</TableCell>
                      <TableCell className="text-xs text-right">{it.qty}</TableCell>
                      <TableCell className="text-xs text-right">{formatCurrency(it.price, form.currency)}</TableCell>
                      <TableCell className="text-xs text-right font-medium">{formatCurrency(it.qty * it.price, form.currency)}</TableCell>
                      <TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setItems(p => p.filter((_, idx) => idx !== i))}><Trash2 className="h-3 w-3 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="text-right text-xs space-y-0.5">
              <p>Subtotal: {formatCurrency(subtotal, form.currency)}</p>
              <p>VAT (15%): {formatCurrency(tax, form.currency)}</p>
              <p className="font-bold text-sm">Total: {formatCurrency(total, form.currency)}</p>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Currency</Label>
                <Select value={form.currency} onValueChange={v => setForm(p => ({ ...p, currency: v as Currency }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETB">ETB - Ethiopian Birr</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Payment Terms</Label>
                <Select value={form.paymentTerms} onValueChange={v => setForm(p => ({ ...p, paymentTerms: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COD">COD</SelectItem>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label className="text-xs">Notes</Label><Textarea className="text-xs" rows={3} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
          </TabsContent>

          <TabsContent value="review" className="mt-3">
            <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Customer</span><span className="font-medium">{customer?.name || '—'}</span></div>
              {form.projectName && <div className="flex justify-between text-xs"><span className="text-muted-foreground">Project</span><span>{form.projectName}</span></div>}
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Items</span><span>{items.length} item(s)</span></div>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Currency</span><span>{form.currency}</span></div>
              <hr className="border-border" />
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(subtotal, form.currency)}</span></div>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">VAT (15%)</span><span>{formatCurrency(tax, form.currency)}</span></div>
              <div className="flex justify-between text-sm font-bold"><span>Total</span><span>{formatCurrency(total, form.currency)}</span></div>
              {form.currency !== 'ETB' && <div className="flex justify-between text-xs text-muted-foreground"><span>Total in ETB</span><span>ETB {(total * rate).toLocaleString()}</span></div>}
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {tab !== 'review' ? (
            <Button onClick={() => {
              const tabs = ['customer', 'items', 'details', 'review'];
              const idx = tabs.indexOf(tab);
              if (idx < tabs.length - 1) setTab(tabs[idx + 1]);
            }}>Next</Button>
          ) : (
            <Button onClick={handleCreate} disabled={!form.customerId || items.length === 0}>Create Invoice</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
