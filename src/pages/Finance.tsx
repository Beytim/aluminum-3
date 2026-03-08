import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, CreditCard, TrendingDown } from "lucide-react";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import {
  type EnhancedInvoice, type EnhancedPayment, type Expense,
  sampleEnhancedInvoices, sampleEnhancedPayments, sampleExpenses,
  calculateFinanceStats, formatCurrency,
} from "@/data/enhancedFinanceData";

import FinanceStatsComponent from "@/components/finance/FinanceStats";
import FinanceFilters from "@/components/finance/FinanceFilters";
import FinanceBulkActions from "@/components/finance/FinanceBulkActions";
import InvoiceTable from "@/components/finance/InvoiceTable";
import PaymentTable from "@/components/finance/PaymentTable";
import ExpenseTable from "@/components/finance/ExpenseTable";
import AgingReport from "@/components/finance/AgingReport";
import CashFlowChart from "@/components/finance/CashFlowChart";
import ProfitLossChart from "@/components/finance/ProfitLossChart";
import AddInvoiceDialog from "@/components/finance/AddInvoiceDialog";
import InvoiceDetailsDialog from "@/components/finance/InvoiceDetailsDialog";
import RecordPaymentDialog from "@/components/finance/RecordPaymentDialog";
import AddExpenseDialog from "@/components/finance/AddExpenseDialog";

export default function Finance() {
  const [invoices, setInvoices] = useLocalStorage<EnhancedInvoice[]>(STORAGE_KEYS.INVOICES, sampleEnhancedInvoices);
  const [payments, setPayments] = useLocalStorage<EnhancedPayment[]>(STORAGE_KEYS.PAYMENTS, sampleEnhancedPayments);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', sampleExpenses);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({ search: '', status: '', currency: '', quickFilter: 'all' });
  const [addInvoiceOpen, setAddInvoiceOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [detailsInvoice, setDetailsInvoice] = useState<EnhancedInvoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<EnhancedInvoice | null>(null);

  const { toast } = useToast();

  const stats = useMemo(() => calculateFinanceStats(invoices, payments, expenses), [invoices, payments, expenses]);

  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(i => i.invoiceNumber.toLowerCase().includes(s) || i.customerName.toLowerCase().includes(s) || (i.projectName || '').toLowerCase().includes(s));
    }
    if (filters.status) result = result.filter(i => i.status === filters.status);
    if (filters.currency) result = result.filter(i => i.currency === filters.currency);
    switch (filters.quickFilter) {
      case 'unpaid': result = result.filter(i => !['Paid', 'Cancelled'].includes(i.status)); break;
      case 'partial': result = result.filter(i => i.status === 'Partial'); break;
      case 'paid': result = result.filter(i => i.status === 'Paid'); break;
      case 'overdue': result = result.filter(i => i.isOverdue); break;
      case 'thisMonth': {
        const now = new Date();
        result = result.filter(i => { const d = new Date(i.issueDate); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
        break;
      }
    }
    return result;
  }, [invoices, filters]);

  const handleAddInvoice = (inv: EnhancedInvoice) => {
    setInvoices(prev => [...prev, inv]);
    toast({ title: "Invoice Created", description: inv.invoiceNumber });
  };

  const handleRecordPayment = (payment: EnhancedPayment) => {
    setPayments(prev => [...prev, payment]);
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== payment.invoiceId) return inv;
      const newPaid = inv.totalPaid + payment.amount;
      const newBalance = Math.max(0, inv.total - newPaid);
      const newPaidETB = inv.totalPaidInETB + payment.amountInETB;
      const newBalETB = Math.max(0, inv.totalInETB - newPaidETB);
      return {
        ...inv, totalPaid: newPaid, totalPaidInETB: newPaidETB, balance: newBalance, balanceInETB: newBalETB,
        status: newBalance <= 0 ? 'Paid' : 'Partial', isFullyPaid: newBalance <= 0,
        paidDate: newBalance <= 0 ? payment.date : undefined,
        activityLog: [...inv.activityLog, { date: payment.date, user: 'USR-001', userName: 'Admin', action: `Payment recorded ${formatCurrency(payment.amount, payment.currency)}` }],
      };
    }));
    toast({ title: "Payment Recorded", description: `${payment.paymentNumber} - ${formatCurrency(payment.amount, payment.currency)}` });
  };

  const handleAddExpense = (exp: Expense) => {
    setExpenses(prev => [...prev, exp]);
    toast({ title: "Expense Recorded", description: exp.expenseNumber });
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
    toast({ title: "Invoice Deleted" });
  };

  const handleBulkDelete = () => {
    setInvoices(prev => prev.filter(i => !selectedIds.includes(i.id)));
    setSelectedIds([]);
    toast({ title: `${selectedIds.length} invoices deleted` });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance</h1>
          <p className="text-sm text-muted-foreground">Invoicing, payments, and financial reporting</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setAddExpenseOpen(true)}><TrendingDown className="h-3.5 w-3.5 mr-1.5" />Add Expense</Button>
          <Button size="sm" onClick={() => setAddInvoiceOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Invoice</Button>
        </div>
      </div>

      <FinanceStatsComponent stats={stats} />

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices" className="gap-1"><Receipt className="h-3.5 w-3.5" />Invoices</TabsTrigger>
          <TabsTrigger value="payments" className="gap-1"><CreditCard className="h-3.5 w-3.5" />Payments</TabsTrigger>
          <TabsTrigger value="expenses" className="gap-1"><TrendingDown className="h-3.5 w-3.5" />Expenses</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-3">
          <FinanceFilters filters={filters} onFiltersChange={setFilters} resultCount={filteredInvoices.length} />
          <FinanceBulkActions count={selectedIds.length} onExport={() => toast({ title: "Exported" })} onDelete={handleBulkDelete} onClear={() => setSelectedIds([])} />
          <Card className="shadow-card">
            <CardContent className="p-0 overflow-x-auto">
              <InvoiceTable
                invoices={filteredInvoices}
                selectedIds={selectedIds}
                onSelectToggle={id => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
                onSelectAll={() => setSelectedIds(prev => prev.length === filteredInvoices.length ? [] : filteredInvoices.map(i => i.id))}
                onView={setDetailsInvoice}
                onRecordPayment={setPaymentInvoice}
                onDelete={handleDeleteInvoice}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="shadow-card">
            <CardContent className="p-0 overflow-x-auto">
              <PaymentTable payments={payments} onDelete={id => { setPayments(prev => prev.filter(p => p.id !== id)); toast({ title: "Payment Deleted" }); }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card className="shadow-card">
            <CardContent className="p-0 overflow-x-auto">
              <ExpenseTable expenses={expenses} onDelete={id => { setExpenses(prev => prev.filter(e => e.id !== id)); toast({ title: "Expense Deleted" }); }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <AgingReport invoices={invoices} />
          <CashFlowChart payments={payments} expenses={expenses} />
          <ProfitLossChart invoices={invoices} expenses={expenses} />
        </TabsContent>
      </Tabs>

      <AddInvoiceDialog open={addInvoiceOpen} onOpenChange={setAddInvoiceOpen} onAdd={handleAddInvoice} invoiceCount={invoices.length} />
      <InvoiceDetailsDialog invoice={detailsInvoice} payments={payments} open={!!detailsInvoice} onOpenChange={() => setDetailsInvoice(null)} onRecordPayment={() => { setPaymentInvoice(detailsInvoice); setDetailsInvoice(null); }} />
      <RecordPaymentDialog invoice={paymentInvoice} open={!!paymentInvoice} onOpenChange={() => setPaymentInvoice(null)} onRecord={handleRecordPayment} paymentCount={payments.length} />
      <AddExpenseDialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen} onAdd={handleAddExpense} expenseCount={expenses.length} />
    </div>
  );
}
