import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Clock } from "lucide-react";
import { type EnhancedPurchaseOrder, getPOStatusColor, procFormatCurrency, procFormatETB } from "@/data/enhancedProcurementData";

interface Props {
  po: EnhancedPurchaseOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PODetailsDialog({ po, open, onOpenChange }: Props) {
  if (!po) return null;
  const totalQty = po.items.reduce((s, i) => s + i.quantity, 0);
  const recQty = po.items.reduce((s, i) => s + i.received, 0);
  const recPct = totalQty > 0 ? (recQty / totalQty) * 100 : 0;
  const paidPct = po.total > 0 ? (po.paid / po.total) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {po.poNumber}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPOStatusColor(po.status)}`}>{po.status}</span>
            {po.isOverdue && <AlertTriangle className="h-4 w-4 text-destructive" />}
            {po.isUrgent && <Clock className="h-4 w-4 text-warning" />}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="items" className="text-xs">Items</TabsTrigger>
            <TabsTrigger value="receiving" className="text-xs">Receiving</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs">Payments</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <Card><CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Supplier</p>
                <p className="text-sm font-medium">{po.supplierName}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{po.supplierCode}</p>
              </CardContent></Card>
              <Card><CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Financial</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span>Total</span><span className="font-bold">{procFormatCurrency(po.total, po.currency)}</span></div>
                  <div className="flex justify-between"><span>Paid</span><span className="text-success">{procFormatCurrency(po.paid, po.currency)}</span></div>
                  <div className="flex justify-between"><span>Balance</span><span className="font-bold">{procFormatCurrency(po.balance, po.currency)}</span></div>
                  <Progress value={paidPct} className="h-1.5 mt-1" />
                </div>
              </CardContent></Card>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div><span className="text-muted-foreground">Order Date:</span> {po.orderDate}</div>
              <div><span className="text-muted-foreground">Expected:</span> {po.expectedDelivery}</div>
              <div><span className="text-muted-foreground">Shipping:</span> {po.shippingTerms} {po.shippingMethod && `(${po.shippingMethod})`}</div>
            </div>
            {po.projectName && <div className="text-xs"><span className="text-muted-foreground">Project:</span> {po.projectName}</div>}
            <div className="text-xs">
              <span className="text-muted-foreground">Receiving Progress:</span>
              <Progress value={recPct} className="h-2 mt-1" />
              <span className="text-[10px] text-muted-foreground">{recPct.toFixed(0)}% ({recQty}/{totalQty} items)</span>
            </div>
          </TabsContent>

          <TabsContent value="items" className="mt-3">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="text-xs">Item</TableHead>
                <TableHead className="text-xs text-right">Qty</TableHead>
                <TableHead className="text-xs">Unit</TableHead>
                <TableHead className="text-xs text-right">Price</TableHead>
                <TableHead className="text-xs text-right">Total</TableHead>
                <TableHead className="text-xs text-right">Received</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {po.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="text-xs">{item.productName}</TableCell>
                    <TableCell className="text-xs text-right">{item.quantity}</TableCell>
                    <TableCell className="text-xs">{item.unit}</TableCell>
                    <TableCell className="text-xs text-right">{procFormatCurrency(item.unitPrice, po.currency)}</TableCell>
                    <TableCell className="text-xs text-right font-medium">{procFormatCurrency(item.lineTotal, po.currency)}</TableCell>
                    <TableCell className="text-xs text-right">{item.received}/{item.quantity}</TableCell>
                    <TableCell><Badge variant={item.status === 'Received' ? 'default' : 'secondary'} className="text-[9px]">{item.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-right space-y-0.5 mt-3 text-xs">
              <p>Subtotal: {procFormatCurrency(po.subtotal, po.currency)}</p>
              {po.shippingCost > 0 && <p>Shipping: {procFormatCurrency(po.shippingCost, po.currency)}</p>}
              {po.insurance > 0 && <p>Insurance: {procFormatCurrency(po.insurance, po.currency)}</p>}
              {po.customsDuty > 0 && <p>Customs: {procFormatCurrency(po.customsDuty, po.currency)}</p>}
              <p className="font-bold text-sm">Total: {procFormatCurrency(po.total, po.currency)}</p>
              {po.currency !== 'ETB' && <p className="text-muted-foreground">({procFormatETB(po.totalInETB)})</p>}
            </div>
          </TabsContent>

          <TabsContent value="receiving" className="mt-3">
            {po.receipts.length > 0 ? (
              <div className="space-y-2">
                {po.receipts.map(r => (
                  <div key={r.id} className="p-3 bg-muted/20 rounded text-xs space-y-1">
                    <div className="flex justify-between"><span className="font-medium">Receipt {r.id}</span><span>{r.date}</span></div>
                    <p className="text-muted-foreground">Received by: {r.receivedBy}</p>
                    {r.items.map(ri => (
                      <div key={ri.itemId} className="flex justify-between pl-3">
                        <span>Qty: {ri.quantity}</span>
                        <span className="text-success">Accepted: {ri.accepted}</span>
                        {ri.rejected > 0 && <span className="text-destructive">Rejected: {ri.rejected}</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-8">No goods received yet</p>}
          </TabsContent>

          <TabsContent value="payments" className="mt-3">
            {po.payments.length > 0 ? (
              <div className="space-y-2">
                {po.payments.map(p => (
                  <div key={p.id} className="flex justify-between p-2 bg-muted/20 rounded text-xs">
                    <div><span className="font-mono">{p.reference}</span><span className="text-muted-foreground ml-2">{p.date}</span></div>
                    <div><span className="font-medium text-success">{procFormatCurrency(p.amount, po.currency)}</span><span className="text-muted-foreground ml-2">{p.method}</span></div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-8">No payments recorded</p>}
          </TabsContent>

          <TabsContent value="activity" className="mt-3">
            <div className="space-y-2">
              {po.activityLog.map((log, i) => (
                <div key={i} className="flex gap-3 text-xs p-2 bg-muted/20 rounded">
                  <span className="text-muted-foreground shrink-0 w-20">{log.date}</span>
                  <span className="font-medium shrink-0">{log.userName}</span>
                  <span>{log.action}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
