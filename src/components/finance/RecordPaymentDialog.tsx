import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type EnhancedInvoice, type EnhancedPayment, type FinancePaymentMethod, type Currency, exchangeRates, formatCurrency } from "@/data/enhancedFinanceData";

interface Props {
  invoice: EnhancedInvoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecord: (payment: EnhancedPayment) => void;
  paymentCount: number;
}

const methods: FinancePaymentMethod[] = ['Cash', 'Bank Transfer', 'TeleBirr', 'Cheque', 'Credit Card', 'CBE Birr', 'HelloCash'];

export default function RecordPaymentDialog({ invoice, open, onOpenChange, onRecord, paymentCount }: Props) {
  const [form, setForm] = useState({ amount: '', method: 'Cash' as FinancePaymentMethod, reference: '', bankName: '', notes: '', date: new Date().toISOString().split('T')[0] });

  if (!invoice) return null;

  const handleRecord = () => {
    const amt = Number(form.amount);
    if (!amt || amt <= 0) return;
    const num = String(paymentCount + 1).padStart(4, '0');
    const rate = exchangeRates[invoice.currency] || 1;

    const payment: EnhancedPayment = {
      id: `PAY-${num}`, paymentNumber: `PAY-${num}`,
      invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber,
      customerId: invoice.customerId, customerName: invoice.customerName,
      date: form.date, amount: amt, currency: invoice.currency, exchangeRate: rate, amountInETB: amt * rate,
      method: form.method, reference: form.reference || `REF-${Date.now()}`,
      bankName: form.bankName || undefined,
      status: 'Completed', reconciled: false,
      notes: form.notes || undefined,
      recordedBy: 'USR-001', recordedByName: 'Admin', recordedAt: new Date().toISOString(),
    };
    onRecord(payment);
    setForm({ amount: '', method: 'Cash', reference: '', bankName: '', notes: '', date: new Date().toISOString().split('T')[0] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="bg-muted/30 p-3 rounded-lg text-xs space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">Invoice</span><span className="font-mono">{invoice.invoiceNumber}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span>{invoice.customerName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-medium">{formatCurrency(invoice.total, invoice.currency)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="text-success">{formatCurrency(invoice.totalPaid, invoice.currency)}</span></div>
            <div className="flex justify-between font-bold"><span>Balance</span><span>{formatCurrency(invoice.balance, invoice.currency)}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Date</Label><Input type="date" className="h-9 text-xs" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
            <div><Label className="text-xs">Amount ({invoice.currency}) *</Label><Input type="number" className="h-9 text-xs" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder={String(invoice.balance)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Method</Label>
              <Select value={form.method} onValueChange={v => setForm(p => ({ ...p, method: v as FinancePaymentMethod }))}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{methods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Reference</Label><Input className="h-9 text-xs" value={form.reference} onChange={e => setForm(p => ({ ...p, reference: e.target.value }))} /></div>
          </div>
          {(form.method === 'Bank Transfer' || form.method === 'Cheque') && (
            <div><Label className="text-xs">Bank Name</Label><Input className="h-9 text-xs" value={form.bankName} onChange={e => setForm(p => ({ ...p, bankName: e.target.value }))} /></div>
          )}
          <div><Label className="text-xs">Notes</Label><Textarea className="text-xs" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>

          {form.amount && Number(form.amount) > 0 && (
            <div className="bg-success/5 border border-success/20 p-2 rounded text-xs space-y-0.5">
              <div className="flex justify-between"><span>New Payment</span><span className="text-success font-medium">{formatCurrency(Number(form.amount), invoice.currency)}</span></div>
              <div className="flex justify-between"><span>Remaining Balance</span><span className="font-bold">{formatCurrency(Math.max(0, invoice.balance - Number(form.amount)), invoice.currency)}</span></div>
            </div>
          )}
        </div>
        <DialogFooter className="mt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleRecord} disabled={!form.amount || Number(form.amount) <= 0}>Record Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
