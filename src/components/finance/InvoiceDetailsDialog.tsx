import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { type EnhancedInvoice, type EnhancedPayment, getInvoiceStatusColor, getPaymentMethodColor, formatCurrency, formatETB, daysOverdue } from "@/data/enhancedFinanceData";

interface Props {
  invoice: EnhancedInvoice | null;
  payments: EnhancedPayment[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordPayment: () => void;
}

export default function InvoiceDetailsDialog({ invoice, payments, open, onOpenChange, onRecordPayment }: Props) {
  if (!invoice) return null;
  const invPayments = payments.filter(p => p.invoiceId === invoice.id);
  const paidPct = invoice.total > 0 ? (invoice.totalPaid / invoice.total) * 100 : 0;
  const overdueDays = invoice.isOverdue ? daysOverdue(invoice.dueDate) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {invoice.invoiceNumber}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getInvoiceStatusColor(invoice.status)}`}>{invoice.status}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="items" className="text-xs">Items</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs">Payments</TabsTrigger>
            <TabsTrigger value="related" className="text-xs">Related</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <Card><CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Customer</p>
                <p className="text-sm font-medium">{invoice.customerName}</p>
                <p className="text-[10px] text-muted-foreground">{invoice.customerAddress}</p>
                {invoice.customerTaxId && <p className="text-[10px] text-muted-foreground">TIN: {invoice.customerTaxId}</p>}
              </CardContent></Card>
              <Card><CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Financial Summary</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span>Total</span><span className="font-bold">{formatCurrency(invoice.total, invoice.currency)}</span></div>
                  <div className="flex justify-between"><span>Paid</span><span className="text-success">{formatCurrency(invoice.totalPaid, invoice.currency)}</span></div>
                  <div className="flex justify-between"><span>Balance</span><span className="font-bold">{formatCurrency(invoice.balance, invoice.currency)}</span></div>
                  <Progress value={paidPct} className="h-1.5 mt-1" />
                  <p className="text-[10px] text-muted-foreground text-center">{paidPct.toFixed(0)}% paid</p>
                </div>
              </CardContent></Card>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div><span className="text-muted-foreground">Issue Date:</span> {invoice.issueDate}</div>
              <div><span className="text-muted-foreground">Due Date:</span> {invoice.dueDate} {overdueDays > 0 && <span className="text-destructive">({overdueDays}d overdue)</span>}</div>
              <div><span className="text-muted-foreground">Terms:</span> {invoice.paymentTerms}</div>
            </div>
            {invoice.projectName && <div className="text-xs"><span className="text-muted-foreground">Project:</span> {invoice.projectName}</div>}
            {invoice.orderNumber && <div className="text-xs"><span className="text-muted-foreground">Order:</span> {invoice.orderNumber}</div>}
            {!invoice.isFullyPaid && (
              <Button size="sm" className="gap-1" onClick={onRecordPayment}><CreditCard className="h-3.5 w-3.5" />Record Payment</Button>
            )}
          </TabsContent>

          <TabsContent value="items" className="mt-3">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="text-xs">Description</TableHead>
                <TableHead className="text-xs text-right">Qty</TableHead>
                <TableHead className="text-xs text-right">Price</TableHead>
                <TableHead className="text-xs text-right">Tax</TableHead>
                <TableHead className="text-xs text-right">Total</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {invoice.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="text-xs">{item.description}{item.productCode && <span className="text-muted-foreground ml-1">({item.productCode})</span>}</TableCell>
                    <TableCell className="text-xs text-right">{item.quantity} {item.unit}</TableCell>
                    <TableCell className="text-xs text-right">{formatCurrency(item.unitPrice, invoice.currency)}</TableCell>
                    <TableCell className="text-xs text-right">{formatCurrency(item.taxAmount, invoice.currency)}</TableCell>
                    <TableCell className="text-xs text-right font-medium">{formatCurrency(item.lineTotalWithTax, invoice.currency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-right space-y-0.5 mt-3 text-xs">
              <p>Subtotal: {formatCurrency(invoice.subtotal, invoice.currency)}</p>
              {invoice.discountAmount > 0 && <p>Discount: -{formatCurrency(invoice.discountAmount, invoice.currency)}</p>}
              <p>VAT ({invoice.taxRate}%): {formatCurrency(invoice.taxAmount, invoice.currency)}</p>
              {invoice.shippingCost > 0 && <p>Shipping: {formatCurrency(invoice.shippingCost, invoice.currency)}</p>}
              <p className="font-bold text-sm">Total: {formatCurrency(invoice.total, invoice.currency)}</p>
              {invoice.currency !== 'ETB' && <p className="text-muted-foreground">({formatETB(invoice.totalInETB)})</p>}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-3">
            {invPayments.length > 0 ? (
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Method</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                  <TableHead className="text-xs">Reference</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {invPayments.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="text-xs">{p.date}</TableCell>
                      <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full ${getPaymentMethodColor(p.method)}`}>{p.method}</span></TableCell>
                      <TableCell className="text-xs text-right font-medium text-success">{formatCurrency(p.amount, p.currency)}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{p.reference}</TableCell>
                      <TableCell><Badge variant={p.status === 'Completed' ? 'default' : 'secondary'} className="text-[10px]">{p.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No payments recorded yet</p>
            )}
          </TabsContent>

          <TabsContent value="related" className="mt-3 space-y-2 text-xs">
            {invoice.projectName && <div className="p-2 bg-muted/30 rounded"><span className="text-muted-foreground">Project:</span> {invoice.projectName} ({invoice.projectId})</div>}
            {invoice.orderNumber && <div className="p-2 bg-muted/30 rounded"><span className="text-muted-foreground">Order:</span> {invoice.orderNumber} ({invoice.orderId})</div>}
            {invoice.quoteNumber && <div className="p-2 bg-muted/30 rounded"><span className="text-muted-foreground">Quote:</span> {invoice.quoteNumber}</div>}
            {!invoice.projectName && !invoice.orderNumber && !invoice.quoteNumber && <p className="text-muted-foreground text-center py-4">No related documents</p>}
          </TabsContent>

          <TabsContent value="activity" className="mt-3">
            <div className="space-y-2">
              {invoice.activityLog.map((log, i) => (
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
