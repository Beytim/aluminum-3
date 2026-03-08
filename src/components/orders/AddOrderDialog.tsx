import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Search } from "lucide-react";
import { sampleProducts, sampleCustomers, sampleProjects, sampleQuotes } from "@/data/sampleData";
import type { EnhancedOrder, EnhancedOrderItem } from "@/data/enhancedOrderData";
import { formatETBFull } from "@/data/enhancedOrderData";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (order: EnhancedOrder) => void;
  existingCount: number;
}

export function AddOrderDialog({ open, onOpenChange, onSave, existingCount }: Props) {
  const [tab, setTab] = useState('customer');
  const [customerId, setCustomerId] = useState('');
  const [quoteId, setQuoteId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<EnhancedOrderItem[]>([]);
  const [productSearch, setProductSearch] = useState('');

  const customer = sampleCustomers.find(c => c.id === customerId);
  const filteredProducts = sampleProducts.filter(p => p.status === 'Active' && (!productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.code.toLowerCase().includes(productSearch.toLowerCase())));

  const addProduct = (p: typeof sampleProducts[0]) => {
    if (items.find(i => i.productId === p.id)) return;
    setItems(prev => [...prev, {
      id: `OI-NEW-${Date.now()}`, productId: p.id, productCode: p.code, productName: p.name,
      productNameAm: p.nameAm, category: p.category, quantity: 1, quantityShipped: 0, quantityDelivered: 0,
      unitPrice: p.sellingPrice, unitCost: p.materialCost, discountPercent: 0, discountAmount: 0,
      lineTotal: p.sellingPrice, lineCost: p.materialCost, lineProfit: p.sellingPrice - p.materialCost,
      lineMargin: ((p.sellingPrice - p.materialCost) / p.sellingPrice) * 100,
    }]);
  };

  const updateQty = (id: string, qty: number) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const lt = qty * i.unitPrice;
      const lc = qty * i.unitCost;
      return { ...i, quantity: qty, lineTotal: lt, lineCost: lc, lineProfit: lt - lc, lineMargin: lt > 0 ? ((lt - lc) / lt) * 100 : 0 };
    }));
  };

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;
  const totalCost = items.reduce((s, i) => s + i.lineCost, 0);

  const handleSubmit = () => {
    if (!customerId || items.length === 0) return;
    const num = `ORD-${String(existingCount + 1).padStart(3, '0')}`;
    const order: EnhancedOrder = {
      id: num, orderNumber: num,
      customerId, customerName: customer?.name || '', customerPhone: customer?.phone,
      quoteId: quoteId || undefined, quoteNumber: quoteId || undefined,
      projectId: projectId || undefined, projectName: sampleProjects.find(p => p.id === projectId)?.name,
      workOrderIds: [], cuttingJobIds: [],
      orderDate, requestedDelivery: deliveryDate || orderDate, dueDate: deliveryDate || orderDate,
      status: 'Draft', paymentStatus: 'Unpaid', isOverdue: false,
      shippingMethod: (shippingMethod || undefined) as any, shippingAddress: shippingAddress || undefined,
      items, subtotal, discountTotal: 0, taxRate: 15, tax, total,
      totalCost, totalProfit: subtotal - totalCost, profitMargin: subtotal > 0 ? ((subtotal - totalCost) / subtotal) * 100 : 0,
      payments: [], totalPaid: 0, balance: total,
      deliveries: [], totalShipped: 0, totalDelivered: 0,
      activityLog: [{ id: `AL-${Date.now()}`, date: orderDate, type: 'created', description: 'Order created', user: 'Current User' }],
      notes: notes || undefined,
      createdAt: new Date().toISOString(), createdBy: 'EMP-001', createdByName: 'Current User',
      updatedAt: new Date().toISOString(), updatedBy: 'EMP-001', updatedByName: 'Current User',
    };
    onSave(order);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTab('customer'); setCustomerId(''); setQuoteId(''); setProjectId('');
    setOrderDate(new Date().toISOString().split('T')[0]); setDeliveryDate('');
    setShippingMethod(''); setShippingAddress(''); setNotes(''); setItems([]);
  };

  const customerQuotes = sampleQuotes.filter(q => q.customerId === customerId && (q.status === 'Accepted' || q.status === 'Pending'));
  const customerProjects = sampleProjects.filter(p => p.customerId === customerId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Order</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="customer" className="text-xs">Customer</TabsTrigger>
            <TabsTrigger value="items" className="text-xs">Items ({items.length})</TabsTrigger>
            <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
            <TabsTrigger value="review" className="text-xs">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="space-y-3">
            <div>
              <Label className="text-xs">Customer *</Label>
              <Select value={customerId} onValueChange={v => { setCustomerId(v); setQuoteId(''); setProjectId(''); }}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>{sampleCustomers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {customer && (
              <Card><CardContent className="p-3 text-xs space-y-1">
                <p className="font-medium">{customer.name}</p>
                <p className="text-muted-foreground">{customer.phone} · {customer.email}</p>
                <p className="text-muted-foreground">{customer.address}</p>
              </CardContent></Card>
            )}
            {customerQuotes.length > 0 && (
              <div>
                <Label className="text-xs">From Quote (optional)</Label>
                <Select value={quoteId} onValueChange={setQuoteId}>
                  <SelectTrigger><SelectValue placeholder="Select quote" /></SelectTrigger>
                  <SelectContent>{customerQuotes.map(q => <SelectItem key={q.id} value={q.id}>{q.id} - {q.projectName} ({formatETBFull(q.total)})</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}
            {customerProjects.length > 0 && (
              <div>
                <Label className="text-xs">Link to Project (optional)</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>{customerProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.id} - {p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Order Date</Label><Input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} /></div>
              <div><Label className="text-xs">Delivery Date</Label><Input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} /></div>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-8 h-9 text-xs" value={productSearch} onChange={e => setProductSearch(e.target.value)} />
            </div>
            <div className="max-h-40 overflow-y-auto border rounded-md">
              {filteredProducts.slice(0, 10).map(p => (
                <div key={p.id} className="flex items-center justify-between px-3 py-2 border-b last:border-0 hover:bg-muted/50">
                  <div><p className="text-xs font-medium">{p.name}</p><p className="text-[10px] text-muted-foreground">{p.code} · {formatETBFull(p.sellingPrice)}</p></div>
                  <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => addProduct(p)} disabled={!!items.find(i => i.productId === p.id)}>
                    <Plus className="h-3 w-3 mr-0.5" />Add
                  </Button>
                </div>
              ))}
            </div>
            {items.length > 0 && (
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Product</TableHead>
                  <TableHead className="text-xs w-20">Qty</TableHead>
                  <TableHead className="text-xs text-right">Price</TableHead>
                  <TableHead className="text-xs text-right">Total</TableHead>
                  <TableHead className="w-8" />
                </TableRow></TableHeader>
                <TableBody>
                  {items.map(i => (
                    <TableRow key={i.id}>
                      <TableCell className="text-xs">{i.productName}</TableCell>
                      <TableCell><Input type="number" min={1} className="h-7 text-xs w-16" value={i.quantity} onChange={e => updateQty(i.id, Number(e.target.value) || 1)} /></TableCell>
                      <TableCell className="text-xs text-right">{formatETBFull(i.unitPrice)}</TableCell>
                      <TableCell className="text-xs text-right font-medium">{formatETBFull(i.lineTotal)}</TableCell>
                      <TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setItems(prev => prev.filter(x => x.id !== i.id))}><Trash2 className="h-3 w-3 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="text-right text-xs font-medium">Subtotal: {formatETBFull(subtotal)}</div>
          </TabsContent>

          <TabsContent value="details" className="space-y-3">
            <div>
              <Label className="text-xs">Shipping Method</Label>
              <Select value={shippingMethod} onValueChange={setShippingMethod}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{['Pickup', 'Local Delivery', 'Freight', 'Courier'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Shipping Address</Label><Input value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} placeholder={customer?.address || ''} /></div>
            <div><Label className="text-xs">Notes</Label><Input value={notes} onChange={e => setNotes(e.target.value)} /></div>
          </TabsContent>

          <TabsContent value="review" className="space-y-3">
            <Card><CardContent className="p-3 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-medium">{customer?.name || '—'}</span></div>
              {quoteId && <div className="flex justify-between"><span className="text-muted-foreground">Quote</span><span>{quoteId}</span></div>}
              {projectId && <div className="flex justify-between"><span className="text-muted-foreground">Project</span><span>{sampleProjects.find(p => p.id === projectId)?.name}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span>{items.length} products</span></div>
              <div className="border-t pt-2 mt-2 space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatETBFull(subtotal)}</span></div>
                <div className="flex justify-between"><span>VAT (15%)</span><span>{formatETBFull(tax)}</span></div>
                <div className="flex justify-between font-bold text-sm"><span>Total</span><span>{formatETBFull(total)}</span></div>
              </div>
            </CardContent></Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {tab === 'review' ? (
            <Button onClick={handleSubmit} disabled={!customerId || items.length === 0}>Create Order</Button>
          ) : (
            <Button onClick={() => {
              const tabs = ['customer', 'items', 'details', 'review'];
              const idx = tabs.indexOf(tab);
              if (idx < tabs.length - 1) setTab(tabs[idx + 1]);
            }}>Next</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
