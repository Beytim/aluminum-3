import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type Expense, type ExpenseCategory, type FinancePaymentMethod, type Currency, exchangeRates } from "@/data/enhancedFinanceData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (expense: Expense) => void;
  expenseCount: number;
}

const categories: ExpenseCategory[] = ['Materials', 'Labor', 'Equipment', 'Transport', 'Utilities', 'Rent', 'Salaries', 'Marketing', 'Other'];
const methods: FinancePaymentMethod[] = ['Cash', 'Bank Transfer', 'TeleBirr', 'Cheque'];

export default function AddExpenseDialog({ open, onOpenChange, onAdd, expenseCount }: Props) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Materials' as ExpenseCategory,
    description: '', amount: '', currency: 'ETB' as Currency,
    method: 'Cash' as FinancePaymentMethod, notes: '',
  });

  const handleAdd = () => {
    const amt = Number(form.amount);
    if (!form.description || amt <= 0) return;
    const num = String(expenseCount + 1).padStart(4, '0');
    const rate = exchangeRates[form.currency] || 1;
    const tax = amt * 0.15;

    const expense: Expense = {
      id: `EXP-${num}`, expenseNumber: `EXP-${num}`,
      date: form.date, category: form.category, description: form.description,
      amount: amt, currency: form.currency, exchangeRate: rate, amountInETB: amt * rate,
      taxRate: 15, taxAmount: tax, paymentMethod: form.method, paid: true, paidDate: form.date,
      notes: form.notes || undefined,
      createdBy: 'USR-001', createdByName: 'Admin', createdAt: new Date().toISOString(),
    };
    onAdd(expense);
    setForm({ date: new Date().toISOString().split('T')[0], category: 'Materials', description: '', amount: '', currency: 'ETB', method: 'Cash', notes: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Record Expense</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Date</Label><Input type="date" className="h-9 text-xs" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v as ExpenseCategory }))}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label className="text-xs">Description *</Label><Input className="h-9 text-xs" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label className="text-xs">Amount *</Label><Input type="number" className="h-9 text-xs" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} /></div>
            <div>
              <Label className="text-xs">Currency</Label>
              <Select value={form.currency} onValueChange={v => setForm(p => ({ ...p, currency: v as Currency }))}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{(['ETB', 'USD', 'EUR'] as Currency[]).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Method</Label>
              <Select value={form.method} onValueChange={v => setForm(p => ({ ...p, method: v as FinancePaymentMethod }))}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{methods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label className="text-xs">Notes</Label><Textarea className="text-xs" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
        </div>
        <DialogFooter className="mt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!form.description || !form.amount}>Add Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
