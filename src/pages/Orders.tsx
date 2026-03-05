import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Trash2, ChevronRight, ShoppingCart, Clock, CheckCircle, Truck, Pencil, FileText, Download } from "lucide-react";
import { sampleOrders, sampleCustomers } from "@/data/sampleData";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import { EditOrderDialog } from "@/components/dialogs/EditOrderDialog";
import { generateOrderInvoicePDF, generateReportPDF } from "@/lib/pdfExport";
import type { Order, Customer } from "@/data/sampleData";

const statusFlow: Order['status'][] = ['Draft', 'Quote Accepted', 'Payment Received', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Completed'];

const statusColor: Record<string, string> = {
  Draft: 'bg-muted text-muted-foreground',
  'Quote Accepted': 'bg-info/10 text-info',
  'Payment Received': 'bg-success/10 text-success',
  Processing: 'bg-primary/10 text-primary',
  Ready: 'bg-success/10 text-success',
  Shipped: 'bg-info/10 text-info',
  Delivered: 'bg-success/10 text-success',
  Completed: 'bg-success/10 text-success',
  Cancelled: 'bg-destructive/10 text-destructive',
};

const paymentColor: Record<string, string> = {
  Paid: 'bg-success/10 text-success',
  Partial: 'bg-warning/10 text-warning',
  Unpaid: 'bg-destructive/10 text-destructive',
};

export default function Orders() {
  const [orders, setOrders] = useLocalStorage<Order[]>(STORAGE_KEYS.ORDERS, sampleOrders);
  const [customers] = useLocalStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, sampleCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const { t } = useI18n();
  const { toast } = useToast();

  const [form, setForm] = useState({ customerId: '', requestedDelivery: '', shippingMethod: '', paymentMethod: '', notes: '' });

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = !search || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, orders]);

  const totalRevenue = orders.reduce((s, o) => s + o.paid, 0);
  const totalPending = orders.reduce((s, o) => s + o.balance, 0);

  const advanceStatus = (id: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const idx = statusFlow.indexOf(o.status);
      if (idx >= 0 && idx < statusFlow.length - 1) {
        return { ...o, status: statusFlow[idx + 1] };
      }
      return o;
    }));
    toast({ title: "Order Status Updated" });
  };

  const handleAdd = () => {
    const customer = customers.find(c => c.id === form.customerId);
    if (!customer) return;
    const order: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customerId: customer.id, customerName: customer.name,
      orderDate: new Date().toISOString().split('T')[0],
      requestedDelivery: form.requestedDelivery || new Date().toISOString().split('T')[0],
      status: 'Draft', paymentStatus: 'Unpaid',
      paymentMethod: (form.paymentMethod || 'Cash') as Order['paymentMethod'],
      shippingMethod: (form.shippingMethod || 'Pickup') as Order['shippingMethod'],
      subtotal: 0, tax: 0, total: 0, paid: 0, balance: 0,
      items: [], notes: form.notes,
    };
    setOrders(prev => [...prev, order]);
    toast({ title: "Order Created", description: order.id });
    setForm({ customerId: '', requestedDelivery: '', shippingMethod: '', paymentMethod: '', notes: '' });
    setDialogOpen(false);
  };

  const handleExportAll = () => {
    generateReportPDF("Orders Report",
      ['Order #', 'Customer', 'Date', 'Total', 'Paid', 'Balance', 'Status'],
      filtered.map(o => [o.id, o.customerName, o.orderDate, `ETB ${o.total.toLocaleString()}`, `ETB ${o.paid.toLocaleString()}`, `ETB ${o.balance.toLocaleString()}`, o.status])
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Order Management</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{orders.length} orders · Revenue: ETB {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportAll}><Download className="h-3.5 w-3.5 mr-1.5" />PDF</Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Draft', icon: ShoppingCart, count: orders.filter(o => o.status === 'Draft').length },
          { label: 'Processing', icon: Clock, count: orders.filter(o => ['Processing', 'Payment Received'].includes(o.status)).length },
          { label: 'Shipped', icon: Truck, count: orders.filter(o => ['Shipped', 'Ready'].includes(o.status)).length },
          { label: 'Completed', icon: CheckCircle, count: orders.filter(o => o.status === 'Completed').length },
        ].map(s => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="p-3 flex items-center gap-2">
              <s.icon className="h-4 w-4 text-primary" />
              <div><p className="text-[10px] text-muted-foreground">{s.label}</p><p className="text-lg font-bold">{s.count}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardContent className="p-3 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 sm:w-40 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusFlow.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Order #</TableHead>
                <TableHead className="text-xs">Customer</TableHead>
                <TableHead className="text-xs hidden md:table-cell">Date</TableHead>
                <TableHead className="text-xs text-right">Total</TableHead>
                <TableHead className="text-xs text-right hidden sm:table-cell">Balance</TableHead>
                <TableHead className="text-xs hidden sm:table-cell">Payment</TableHead>
                <TableHead className="text-xs">{t('common.status')}</TableHead>
                <TableHead className="text-xs text-right w-28">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(o => (
                <TableRow key={o.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setEditOrder(o)}>
                  <TableCell className="text-xs font-mono font-medium">{o.id}</TableCell>
                  <TableCell className="text-xs">{o.customerName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{o.orderDate}</TableCell>
                  <TableCell className="text-xs text-right font-semibold">ETB {o.total.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-right hidden sm:table-cell">
                    <span className={o.balance > 0 ? 'text-warning font-medium' : 'text-success'}>
                      {o.balance > 0 ? `ETB ${o.balance.toLocaleString()}` : '—'}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${paymentColor[o.paymentStatus]}`}>{o.paymentStatus}</span></TableCell>
                  <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[o.status]}`}>{o.status}</span></TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Invoice PDF" onClick={e => { e.stopPropagation(); generateOrderInvoicePDF(o); }}>
                        <FileText className="h-3 w-3" />
                      </Button>
                      {o.status !== 'Completed' && o.status !== 'Cancelled' && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Advance" onClick={e => { e.stopPropagation(); advanceStatus(o.id); }}>
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); setOrders(prev => prev.filter(x => x.id !== o.id)); toast({ title: "Deleted" }); }}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Order Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Order</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <Label className="text-xs">Customer *</Label>
              <Select value={form.customerId} onValueChange={v => setForm(p => ({ ...p, customerId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Delivery Date</Label><Input type="date" value={form.requestedDelivery} onChange={e => setForm(p => ({ ...p, requestedDelivery: e.target.value }))} /></div>
            <div><Label className="text-xs">Payment Method</Label>
              <Select value={form.paymentMethod} onValueChange={v => setForm(p => ({ ...p, paymentMethod: v }))}>
                <SelectTrigger><SelectValue placeholder="Cash" /></SelectTrigger>
                <SelectContent>
                  {['Cash', 'Card', 'Bank Transfer', 'Credit', 'TeleBirr'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Shipping Method</Label>
              <Select value={form.shippingMethod} onValueChange={v => setForm(p => ({ ...p, shippingMethod: v }))}>
                <SelectTrigger><SelectValue placeholder="Pickup" /></SelectTrigger>
                <SelectContent>
                  {['Pickup', 'Local Delivery', 'Freight', 'Courier'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Notes</Label><Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleAdd}>Create Order</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <EditOrderDialog open={!!editOrder} onOpenChange={open => { if (!open) setEditOrder(null); }} order={editOrder} customers={customers} onSave={updated => setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))} />
    </div>
  );
}
