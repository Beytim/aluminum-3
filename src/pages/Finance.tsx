import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Plus, Trash2 } from "lucide-react";
import { sampleInvoices, samplePayments } from "@/data/sampleData";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import type { Invoice, Payment } from "@/data/sampleData";

const invStatusColor: Record<string, string> = {
  Paid: 'bg-success/10 text-success',
  Partial: 'bg-warning/10 text-warning',
  Overdue: 'bg-destructive/10 text-destructive',
};

export default function Finance() {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>(STORAGE_KEYS.INVOICES, sampleInvoices);
  const [payments, setPayments] = useLocalStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, samplePayments);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const { t } = useI18n();
  const { toast } = useToast();

  const [payForm, setPayForm] = useState({ invoiceId: '', amount: '', method: '', reference: '', customerName: '' });

  const totalReceivable = invoices.reduce((s, i) => s + i.balance, 0);
  const totalPaid = invoices.reduce((s, i) => s + i.paid, 0);
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;

  const handleAddPayment = () => {
    if (!payForm.invoiceId || !payForm.amount || Number(payForm.amount) <= 0) return;
    const payment: Payment = {
      id: `PAY-${String(payments.length + 1).padStart(3, '0')}`,
      invoiceId: payForm.invoiceId,
      date: new Date().toISOString().split('T')[0],
      customerName: payForm.customerName,
      amount: Number(payForm.amount),
      method: (payForm.method || 'Cash') as Payment['method'],
      reference: payForm.reference || `REF-${Date.now()}`,
    };
    setPayments(prev => [...prev, payment]);

    // Update invoice
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== payForm.invoiceId) return inv;
      const newPaid = inv.paid + Number(payForm.amount);
      const newBalance = Math.max(0, inv.amount - newPaid);
      return { ...inv, paid: newPaid, balance: newBalance, status: newBalance <= 0 ? 'Paid' : 'Partial' };
    }));

    toast({ title: "Payment Recorded", description: `${payment.id} - ETB ${payment.amount.toLocaleString()}` });
    setPayForm({ invoiceId: '', amount: '', method: '', reference: '', customerName: '' });
    setPayDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('finance.title')}</h1>
          <p className="text-sm text-muted-foreground">Financial overview</p>
        </div>
        <Button size="sm" onClick={() => setPayDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />Record Payment</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-success" /></div>
            <div><p className="text-xs text-muted-foreground">Total Collected</p><p className="text-xl font-bold">ETB {totalPaid.toLocaleString()}</p></div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-warning" /></div>
            <div><p className="text-xs text-muted-foreground">Receivable</p><p className="text-xl font-bold">ETB {totalReceivable.toLocaleString()}</p></div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
            <div><p className="text-xs text-muted-foreground">Overdue</p><p className="text-xl font-bold">{overdueCount} invoices</p></div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">{t('finance.invoices')}</TabsTrigger>
          <TabsTrigger value="payments">{t('finance.payments')}</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card className="shadow-card">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Invoice #</TableHead>
                    <TableHead className="text-xs">Project</TableHead>
                    <TableHead className="text-xs">Customer</TableHead>
                    <TableHead className="text-xs text-right">{t('common.amount')}</TableHead>
                    <TableHead className="text-xs text-right">Paid</TableHead>
                    <TableHead className="text-xs text-right">Balance</TableHead>
                    <TableHead className="text-xs">Due Date</TableHead>
                    <TableHead className="text-xs">{t('common.status')}</TableHead>
                    <TableHead className="text-xs"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map(inv => (
                    <TableRow key={inv.id}>
                      <TableCell className="text-xs font-mono">{inv.id}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{inv.projectId}</TableCell>
                      <TableCell className="text-xs">{inv.customerName}</TableCell>
                      <TableCell className="text-xs text-right">ETB {inv.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right text-success">ETB {inv.paid.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right font-semibold">{inv.balance > 0 ? `ETB ${inv.balance.toLocaleString()}` : '—'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{inv.dueDate}</TableCell>
                      <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${invStatusColor[inv.status]}`}>{inv.status}</span></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setInvoices(prev => prev.filter(i => i.id !== inv.id)); toast({ title: "Deleted" }); }}>
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

        <TabsContent value="payments">
          <Card className="shadow-card">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">Invoice</TableHead>
                    <TableHead className="text-xs">{t('common.date')}</TableHead>
                    <TableHead className="text-xs">Customer</TableHead>
                    <TableHead className="text-xs text-right">{t('common.amount')}</TableHead>
                    <TableHead className="text-xs">Method</TableHead>
                    <TableHead className="text-xs">Reference</TableHead>
                    <TableHead className="text-xs"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map(pay => (
                    <TableRow key={pay.id}>
                      <TableCell className="text-xs font-mono">{pay.id}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{pay.invoiceId}</TableCell>
                      <TableCell className="text-xs">{pay.date}</TableCell>
                      <TableCell className="text-xs">{pay.customerName}</TableCell>
                      <TableCell className="text-xs text-right font-semibold text-success">ETB {pay.amount.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">{pay.method}</Badge></TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{pay.reference}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setPayments(prev => prev.filter(p => p.id !== pay.id)); toast({ title: "Deleted" }); }}>
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
      </Tabs>

      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Invoice *</Label>
              <Select value={payForm.invoiceId} onValueChange={v => {
                const inv = invoices.find(i => i.id === v);
                setPayForm(p => ({ ...p, invoiceId: v, customerName: inv?.customerName || '' }));
              }}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{invoices.filter(i => i.balance > 0).map(i => <SelectItem key={i.id} value={i.id}>{i.id} - {i.customerName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Amount (ETB) *</Label><Input type="number" value={payForm.amount} onChange={e => setPayForm(p => ({ ...p, amount: e.target.value }))} /></div>
            <div>
              <Label className="text-xs">Method</Label>
              <Select value={payForm.method} onValueChange={v => setPayForm(p => ({ ...p, method: v }))}>
                <SelectTrigger><SelectValue placeholder="Cash" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="TeleBirr">TeleBirr</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Reference</Label><Input value={payForm.reference} onChange={e => setPayForm(p => ({ ...p, reference: e.target.value }))} /></div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setPayDialogOpen(false)}>Cancel</Button><Button onClick={handleAddPayment}>Record</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
