import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Star, Globe, Trash2, ChevronRight, Ship, Plane, TruckIcon } from "lucide-react";
import { sampleSuppliers, samplePurchaseOrders } from "@/data/sampleData";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import type { Supplier, PurchaseOrder } from "@/data/sampleData";

const poStatusColor: Record<string, string> = {
  Draft: 'bg-muted text-muted-foreground', Sent: 'bg-info/10 text-info',
  Confirmed: 'bg-primary/10 text-primary', Shipped: 'bg-warning/10 text-warning',
  Received: 'bg-success/10 text-success', 'Partially Received': 'bg-warning/10 text-warning',
  Cancelled: 'bg-destructive/10 text-destructive',
};

const shippingIcon: Record<string, any> = { Sea: Ship, Air: Plane, Land: TruckIcon };

export default function Procurement() {
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>(STORAGE_KEYS.SUPPLIERS, sampleSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useLocalStorage<PurchaseOrder[]>(STORAGE_KEYS.PURCHASE_ORDERS, samplePurchaseOrders);
  const [supplierDialog, setSupplierDialog] = useState(false);
  const [poDialog, setPoDialog] = useState(false);
  const { t } = useI18n();
  const { toast } = useToast();

  const [supForm, setSupForm] = useState({ company: '', contact: '', phone: '', email: '', country: '', leadTime: '', paymentTerms: '', website: '', minOrderQty: '', notes: '' });
  const [poForm, setPoForm] = useState({ supplierId: '', expectedDelivery: '', shippingMethod: '', notes: '' });

  const totalPOValue = purchaseOrders.reduce((s, po) => s + po.total, 0);
  const pendingPOs = purchaseOrders.filter(po => !['Received', 'Cancelled'].includes(po.status)).length;

  const handleAddSupplier = () => {
    if (!supForm.company.trim()) return;
    const supplier: Supplier = {
      id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      company: supForm.company.trim(), contact: supForm.contact.trim(),
      phone: supForm.phone, email: supForm.email, website: supForm.website,
      country: supForm.country || 'Ethiopia', address: '',
      leadTime: Number(supForm.leadTime) || 7, minOrderQty: Number(supForm.minOrderQty) || 0,
      rating: 3, preferred: false,
      paymentTerms: supForm.paymentTerms || 'Net 30', certifications: [], notes: supForm.notes,
    };
    setSuppliers(prev => [...prev, supplier]);
    toast({ title: "Supplier Added", description: supplier.company });
    setSupForm({ company: '', contact: '', phone: '', email: '', country: '', leadTime: '', paymentTerms: '', website: '', minOrderQty: '', notes: '' });
    setSupplierDialog(false);
  };

  const handleAddPO = () => {
    const supplier = suppliers.find(s => s.id === poForm.supplierId);
    if (!supplier) return;
    const po: PurchaseOrder = {
      id: `PO-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      supplierId: supplier.id, supplierName: supplier.company,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: poForm.expectedDelivery || new Date().toISOString().split('T')[0],
      status: 'Draft', items: [], subtotal: 0, shipping: 0, total: 0, paid: 0,
      shippingMethod: (poForm.shippingMethod || undefined) as PurchaseOrder['shippingMethod'],
      notes: poForm.notes,
    };
    setPurchaseOrders(prev => [...prev, po]);
    toast({ title: "PO Created", description: po.id });
    setPoForm({ supplierId: '', expectedDelivery: '', shippingMethod: '', notes: '' });
    setPoDialog(false);
  };

  const advancePO = (id: string) => {
    const flow: PurchaseOrder['status'][] = ['Draft', 'Sent', 'Confirmed', 'Shipped', 'Received'];
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id !== id) return po;
      const idx = flow.indexOf(po.status);
      if (idx >= 0 && idx < flow.length - 1) return { ...po, status: flow[idx + 1] };
      return po;
    }));
    toast({ title: "PO Status Updated" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.procurement')}</h1>
          <p className="text-sm text-muted-foreground">{suppliers.length} suppliers · {purchaseOrders.length} POs · ETB {totalPOValue.toLocaleString()} total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPoDialog(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New PO</Button>
          <Button size="sm" onClick={() => setSupplierDialog(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />Add Supplier</Button>
        </div>
      </div>

      <Tabs defaultValue="suppliers">
        <TabsList>
          <TabsTrigger value="suppliers">Suppliers ({suppliers.length})</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders ({purchaseOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers">
          <Card className="shadow-card">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">Company</TableHead>
                    <TableHead className="text-xs">Contact</TableHead>
                    <TableHead className="text-xs">Country</TableHead>
                    <TableHead className="text-xs">Lead Time</TableHead>
                    <TableHead className="text-xs">Min Qty</TableHead>
                    <TableHead className="text-xs">Rating</TableHead>
                    <TableHead className="text-xs">Terms</TableHead>
                    <TableHead className="text-xs">Certs</TableHead>
                    <TableHead className="text-xs">Preferred</TableHead>
                    <TableHead className="text-xs"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="text-xs font-mono">{s.id}</TableCell>
                      <TableCell className="text-xs font-medium">{s.company}</TableCell>
                      <TableCell>
                        <div><p className="text-xs">{s.contact}</p><p className="text-[10px] text-muted-foreground">{s.email}</p></div>
                      </TableCell>
                      <TableCell><div className="flex items-center gap-1 text-xs"><Globe className="h-3 w-3 text-muted-foreground" />{s.country}</div></TableCell>
                      <TableCell className="text-xs">{s.leadTime} days</TableCell>
                      <TableCell className="text-xs">{s.minOrderQty || '—'}</TableCell>
                      <TableCell>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < s.rating ? 'text-warning fill-warning' : 'text-muted'}`} />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{s.paymentTerms}</TableCell>
                      <TableCell><div className="flex flex-wrap gap-1">{s.certifications.map(c => <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)}</div></TableCell>
                      <TableCell>{s.preferred && <Badge className="text-[10px] bg-success/10 text-success border-0">Preferred</Badge>}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSuppliers(prev => prev.filter(x => x.id !== s.id)); toast({ title: "Deleted" }); }}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase-orders">
          <Card className="shadow-card">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">PO #</TableHead>
                    <TableHead className="text-xs">Supplier</TableHead>
                    <TableHead className="text-xs">Order Date</TableHead>
                    <TableHead className="text-xs">Expected</TableHead>
                    <TableHead className="text-xs">Shipping</TableHead>
                    <TableHead className="text-xs text-center">Items</TableHead>
                    <TableHead className="text-xs text-right">Total</TableHead>
                    <TableHead className="text-xs text-right">Paid</TableHead>
                    <TableHead className="text-xs">{t('common.status')}</TableHead>
                    <TableHead className="text-xs text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map(po => (
                    <TableRow key={po.id}>
                      <TableCell className="text-xs font-mono font-medium">{po.id}</TableCell>
                      <TableCell className="text-xs">{po.supplierName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{po.orderDate}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{po.expectedDelivery}</TableCell>
                      <TableCell className="text-xs">{po.shippingMethod ? <Badge variant="outline" className="text-[10px]">{po.shippingMethod}</Badge> : '—'}</TableCell>
                      <TableCell className="text-xs text-center">{po.items.length}</TableCell>
                      <TableCell className="text-xs text-right font-semibold">ETB {po.total.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right text-success">ETB {po.paid.toLocaleString()}</TableCell>
                      <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${poStatusColor[po.status]}`}>{po.status}</span></TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          {!['Received', 'Cancelled'].includes(po.status) && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => advancePO(po.id)}>
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setPurchaseOrders(prev => prev.filter(x => x.id !== po.id)); toast({ title: "Deleted" }); }}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Supplier Dialog */}
      <Dialog open={supplierDialog} onOpenChange={setSupplierDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Supplier</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><Label className="text-xs">Company *</Label><Input value={supForm.company} onChange={e => setSupForm(p => ({ ...p, company: e.target.value }))} /></div>
            <div><Label className="text-xs">Contact</Label><Input value={supForm.contact} onChange={e => setSupForm(p => ({ ...p, contact: e.target.value }))} /></div>
            <div><Label className="text-xs">Phone</Label><Input value={supForm.phone} onChange={e => setSupForm(p => ({ ...p, phone: e.target.value }))} /></div>
            <div><Label className="text-xs">Email</Label><Input value={supForm.email} onChange={e => setSupForm(p => ({ ...p, email: e.target.value }))} /></div>
            <div><Label className="text-xs">Website</Label><Input value={supForm.website} onChange={e => setSupForm(p => ({ ...p, website: e.target.value }))} /></div>
            <div><Label className="text-xs">Country</Label><Input value={supForm.country} onChange={e => setSupForm(p => ({ ...p, country: e.target.value }))} placeholder="Ethiopia" /></div>
            <div><Label className="text-xs">Lead Time (days)</Label><Input type="number" value={supForm.leadTime} onChange={e => setSupForm(p => ({ ...p, leadTime: e.target.value }))} /></div>
            <div><Label className="text-xs">Min Order Qty</Label><Input type="number" value={supForm.minOrderQty} onChange={e => setSupForm(p => ({ ...p, minOrderQty: e.target.value }))} /></div>
            <div><Label className="text-xs">Payment Terms</Label><Input value={supForm.paymentTerms} onChange={e => setSupForm(p => ({ ...p, paymentTerms: e.target.value }))} placeholder="Net 30" /></div>
            <div><Label className="text-xs">Notes</Label><Input value={supForm.notes} onChange={e => setSupForm(p => ({ ...p, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setSupplierDialog(false)}>Cancel</Button><Button onClick={handleAddSupplier}>Add Supplier</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add PO Dialog */}
      <Dialog open={poDialog} onOpenChange={setPoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Purchase Order</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><Label className="text-xs">Supplier *</Label>
              <Select value={poForm.supplierId} onValueChange={v => setPoForm(p => ({ ...p, supplierId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.company}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Expected Delivery</Label><Input type="date" value={poForm.expectedDelivery} onChange={e => setPoForm(p => ({ ...p, expectedDelivery: e.target.value }))} /></div>
            <div><Label className="text-xs">Shipping Method</Label>
              <Select value={poForm.shippingMethod} onValueChange={v => setPoForm(p => ({ ...p, shippingMethod: v }))}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sea">Sea</SelectItem>
                  <SelectItem value="Air">Air</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2"><Label className="text-xs">Notes</Label><Input value={poForm.notes} onChange={e => setPoForm(p => ({ ...p, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setPoDialog(false)}>Cancel</Button><Button onClick={handleAddPO}>Create PO</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
