import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Truck, Factory, Scissors, AlertTriangle, Plus } from "lucide-react";
import type { EnhancedOrder, OrderPayment, PaymentMethod } from "@/data/enhancedOrderData";
import { getOrderStatusColor, getPaymentStatusColor, formatETBFull } from "@/data/enhancedOrderData";

interface Props {
  order: EnhancedOrder | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onUpdate: (order: EnhancedOrder) => void;
}

export function OrderDetailsDialog({ order, open, onOpenChange, onUpdate }: Props) {
  const [payOpen, setPayOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Cash');
  const [payRef, setPayRef] = useState('');

  if (!order) return null;

  const payPct = order.total > 0 ? (order.totalPaid / order.total) * 100 : 0;
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);
  const shippedQty = order.items.reduce((s, i) => s + i.quantityShipped, 0);

  const handleRecordPayment = () => {
    const amount = Number(payAmount);
    if (!amount || amount <= 0) return;
    const payment: OrderPayment = {
      id: `PAY-${Date.now()}`, date: new Date().toISOString().split('T')[0],
      amount, method: payMethod, reference: payRef || undefined,
      recordedBy: 'EMP-001', recordedByName: 'Current User', createdAt: new Date().toISOString(),
    };
    const newPaid = order.totalPaid + amount;
    const newBalance = order.total - newPaid;
    const newPaymentStatus = newBalance <= 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Unpaid';
    const newStatus = order.status === 'Draft' || order.status === 'Quote Accepted' ? 'Payment Received' : order.status;
    onUpdate({
      ...order,
      payments: [...order.payments, payment],
      totalPaid: newPaid, balance: Math.max(0, newBalance),
      paymentStatus: newPaymentStatus as any, paymentMethod: payMethod,
      status: newStatus as any,
      activityLog: [...order.activityLog, { id: `AL-${Date.now()}`, date: payment.date, type: 'payment', description: `Payment ${formatETBFull(amount)} via ${payMethod}`, user: 'Current User' }],
      updatedAt: new Date().toISOString(),
    });
    setPayOpen(false); setPayAmount(''); setPayRef('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {order.orderNumber}
            {order.isOverdue && <AlertTriangle className="h-4 w-4 text-destructive" />}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getOrderStatusColor(order.status)}`}>{order.status}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="items" className="text-xs">Items</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs">Payments</TabsTrigger>
            <TabsTrigger value="delivery" className="text-xs">Delivery</TabsTrigger>
            <TabsTrigger value="production" className="text-xs">Production</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Card><CardContent className="p-3 text-xs space-y-1">
                <p className="font-semibold text-sm">{order.customerName}</p>
                {order.customerPhone && <p className="text-muted-foreground">{order.customerPhone}</p>}
                {order.shippingAddress && <p className="text-muted-foreground">{order.shippingAddress}</p>}
                {order.projectName && <p className="text-muted-foreground">📁 {order.projectName}</p>}
                {order.quoteNumber && <p className="text-muted-foreground">📋 Quote: {order.quoteNumber}</p>}
              </CardContent></Card>
              <Card><CardContent className="p-3 text-xs space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold text-sm">{formatETBFull(order.total)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="text-success font-medium">{formatETBFull(order.totalPaid)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Balance</span><span className={order.balance > 0 ? 'text-warning font-medium' : 'text-success'}>{formatETBFull(order.balance)}</span></div>
                <Progress value={payPct} className="h-2" />
                <div className="flex justify-between"><span className="text-muted-foreground">Profit</span><span className="text-success">{formatETBFull(order.totalProfit)} ({order.profitMargin.toFixed(1)}%)</span></div>
              </CardContent></Card>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">Items</p><p className="text-lg font-bold">{order.items.length}</p></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">Total Qty</p><p className="text-lg font-bold">{totalQty}</p></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">Shipped</p><p className="text-lg font-bold">{shippedQty}/{totalQty}</p></CardContent></Card>
              <Card><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">Work Orders</p><p className="text-lg font-bold">{order.workOrderIds.length}</p></CardContent></Card>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" className="text-xs" onClick={() => setPayOpen(true)}><CreditCard className="h-3 w-3 mr-1" />Record Payment</Button>
            </div>
          </TabsContent>

          {/* ITEMS */}
          <TabsContent value="items">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="text-xs">Product</TableHead>
                <TableHead className="text-xs text-center">Qty</TableHead>
                <TableHead className="text-xs text-center">Shipped</TableHead>
                <TableHead className="text-xs text-right">Price</TableHead>
                <TableHead className="text-xs text-right">Total</TableHead>
                <TableHead className="text-xs text-right">Profit</TableHead>
                <TableHead className="text-xs hidden md:table-cell">Links</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {order.items.map(i => (
                  <TableRow key={i.id}>
                    <TableCell className="text-xs"><p className="font-medium">{i.productName}</p><p className="text-[10px] text-muted-foreground">{i.productCode}</p></TableCell>
                    <TableCell className="text-xs text-center">{i.quantity}</TableCell>
                    <TableCell className="text-xs text-center">{i.quantityShipped}/{i.quantity}</TableCell>
                    <TableCell className="text-xs text-right">{formatETBFull(i.unitPrice)}</TableCell>
                    <TableCell className="text-xs text-right font-medium">{formatETBFull(i.lineTotal)}</TableCell>
                    <TableCell className="text-xs text-right text-success">{i.lineMargin.toFixed(1)}%</TableCell>
                    <TableCell className="text-xs hidden md:table-cell">
                      <div className="flex gap-1">
                        {i.workOrderId && <Badge variant="outline" className="text-[9px]"><Factory className="h-2.5 w-2.5 mr-0.5" />{i.workOrderId}</Badge>}
                        {i.cuttingJobIds?.map(cj => <Badge key={cj} variant="outline" className="text-[9px]"><Scissors className="h-2.5 w-2.5 mr-0.5" />{cj}</Badge>)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-right text-xs mt-2 space-y-1">
              <p>Subtotal: {formatETBFull(order.subtotal)}</p>
              {order.discountTotal > 0 && <p className="text-success">Discount: -{formatETBFull(order.discountTotal)}</p>}
              <p>VAT (15%): {formatETBFull(order.tax)}</p>
              <p className="font-bold text-sm">Total: {formatETBFull(order.total)}</p>
            </div>
          </TabsContent>

          {/* PAYMENTS */}
          <TabsContent value="payments" className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-xs">
                <span className={`px-2 py-0.5 rounded font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
                <span className="ml-2 text-muted-foreground">Paid {formatETBFull(order.totalPaid)} of {formatETBFull(order.total)}</span>
              </div>
              <Button size="sm" className="text-xs" onClick={() => setPayOpen(true)}><Plus className="h-3 w-3 mr-1" />Record Payment</Button>
            </div>
            <Progress value={payPct} className="h-2" />
            {order.payments.length > 0 ? (
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Method</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                  <TableHead className="text-xs">Reference</TableHead>
                  <TableHead className="text-xs">By</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {order.payments.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="text-xs">{p.date}</TableCell>
                      <TableCell className="text-xs">{p.method}</TableCell>
                      <TableCell className="text-xs text-right font-medium text-success">{formatETBFull(p.amount)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.reference || '—'}</TableCell>
                      <TableCell className="text-xs">{p.recordedByName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : <p className="text-xs text-muted-foreground text-center py-6">No payments recorded</p>}

            {payOpen && (
              <Card><CardContent className="p-3 space-y-3">
                <p className="text-xs font-semibold">Record Payment</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Amount (ETB) *</Label><Input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder={String(order.balance)} /></div>
                  <div><Label className="text-xs">Method</Label>
                    <Select value={payMethod} onValueChange={v => setPayMethod(v as PaymentMethod)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{['Cash', 'Bank Transfer', 'TeleBirr', 'Cheque', 'Credit'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2"><Label className="text-xs">Reference</Label><Input value={payRef} onChange={e => setPayRef(e.target.value)} /></div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setPayOpen(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleRecordPayment}>Save Payment</Button>
                </div>
              </CardContent></Card>
            )}
          </TabsContent>

          {/* DELIVERY */}
          <TabsContent value="delivery">
            {order.deliveries.length > 0 ? (
              <div className="space-y-3">
                {order.deliveries.map(d => (
                  <Card key={d.id}><CardContent className="p-3 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{d.date}</span>
                      <Badge variant={d.status === 'delivered' ? 'default' : 'outline'} className="text-[10px]">{d.status}</Badge>
                    </div>
                    <p className="text-muted-foreground">{d.shippingMethod}{d.trackingNumber ? ` · ${d.trackingNumber}` : ''}</p>
                    {d.items.map(i => <p key={i.productId}>• {i.productName} × {i.quantity}</p>)}
                    {d.receivedBy && <p className="text-muted-foreground">Received by: {d.receivedBy}</p>}
                  </CardContent></Card>
                ))}
              </div>
            ) : <p className="text-xs text-muted-foreground text-center py-6">No deliveries recorded</p>}
          </TabsContent>

          {/* PRODUCTION LINKS */}
          <TabsContent value="production" className="space-y-3">
            {order.workOrderIds.length > 0 ? (
              <div>
                <p className="text-xs font-semibold mb-2">Work Orders ({order.workOrderIds.length})</p>
                {order.workOrderIds.map(wo => (
                  <Card key={wo} className="mb-2"><CardContent className="p-3 text-xs flex items-center gap-2">
                    <Factory className="h-4 w-4 text-primary" />
                    <span className="font-mono font-medium">{wo}</span>
                  </CardContent></Card>
                ))}
              </div>
            ) : <p className="text-xs text-muted-foreground">No work orders linked</p>}
            {order.cuttingJobIds.length > 0 ? (
              <div>
                <p className="text-xs font-semibold mb-2">Cutting Jobs ({order.cuttingJobIds.length})</p>
                {order.cuttingJobIds.map(cj => (
                  <Card key={cj} className="mb-2"><CardContent className="p-3 text-xs flex items-center gap-2">
                    <Scissors className="h-4 w-4 text-accent-foreground" />
                    <span className="font-mono font-medium">{cj}</span>
                  </CardContent></Card>
                ))}
              </div>
            ) : <p className="text-xs text-muted-foreground">No cutting jobs linked</p>}
          </TabsContent>

          {/* ACTIVITY */}
          <TabsContent value="activity">
            <div className="space-y-2">
              {order.activityLog.map(a => (
                <div key={a.id} className="flex gap-3 text-xs border-l-2 border-border pl-3 py-1">
                  <span className="text-muted-foreground whitespace-nowrap">{a.date}</span>
                  <span>{a.description}</span>
                  <span className="text-muted-foreground ml-auto">{a.user}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
