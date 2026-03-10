import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, CreditCard, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/lib/settingsContext";
import { calculateFinanceStats } from "@/data/enhancedFinanceData";
import type { EnhancedInvoice, EnhancedPayment, Expense } from "@/data/enhancedFinanceData";
import { useInvoices, useInvoiceMutations, usePayments, usePaymentMutations, useExpenses, useExpenseMutations } from "@/hooks/useFinance";

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
  const { data: invoices = [], isLoading: loadingInv } = useInvoices();
  const { addInvoice, updateInvoice, deleteInvoice } = useInvoiceMutations();
  const { data: payments = [] } = usePayments();
  const { addPayment } = usePaymentMutations();
  const { data: expenses = [] } = useExpenses();
  const { addExpense, deleteExpense } = useExpenseMutations();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({ search: '', status: '', currency: '', quickFilter: 'all' });
  const [addInvoiceOpen, setAddInvoiceOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [detailsInvoice, setDetailsInvoice] = useState<EnhancedInvoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<EnhancedInvoice | null>(null);

  const { toast } = useToast();
  const { formatCurrency: fmtCurrency } = useSettings();

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

  const handleRecordPayment = (payment: EnhancedPayment) => {
    addPayment.mutate(payment);
    // Update invoice balance
    const inv = invoices.find(i => i.id === payment.invoiceId);
    if (inv) {
      const newPaid = inv.totalPaid + payment.amount;
      const newBalance = Math.max(0, inv.total - newPaid);
      updateInvoice.mutate({
        ...inv, totalPaid: newPaid, balance: newBalance,
        status: newBalance <= 0 ? 'Paid' : 'Partial',
        isFullyPaid: newBalance <= 0,
        paidDate: newBalance <= 0 ? payment.date : undefined,
      });
    }
    toast({ title: "Payment Recorded", description: `${payment.paymentNumber} - ${fmtCurrency(payment.amount)}` });
  };

  if (loadingInv) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

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
          <FinanceBulkActions count={selectedIds.length} onExport={() => toast({ title: "Exported" })} onDelete={() => { selectedIds.forEach(id => deleteInvoice.mutate(id)); setSelectedIds([]); toast({ title: "Deleted" }); }} onClear={() => setSelectedIds([])} />
          <Card className="shadow-card">
            <CardContent className="p-0 overflow-x-auto">
              <InvoiceTable invoices={filteredInvoices} selectedIds={selectedIds}
                onSelectToggle={id => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
                onSelectAll={() => setSelectedIds(prev => prev.length === filteredInvoices.length ? [] : filteredInvoices.map(i => i.id))}
                onView={setDetailsInvoice} onRecordPayment={setPaymentInvoice}
                onDelete={id => { deleteInvoice.mutate(id); toast({ title: "Invoice Deleted" }); }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="shadow-card"><CardContent className="p-0 overflow-x-auto">
            <PaymentTable payments={payments} onDelete={id => toast({ title: "Delete not supported for payments" })} />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card className="shadow-card"><CardContent className="p-0 overflow-x-auto">
            <ExpenseTable expenses={expenses} onDelete={id => { deleteExpense.mutate(id); toast({ title: "Expense Deleted" }); }} />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <AgingReport invoices={invoices} />
          <CashFlowChart payments={payments} expenses={expenses} />
          <ProfitLossChart invoices={invoices} expenses={expenses} />
        </TabsContent>
      </Tabs>

      <AddInvoiceDialog open={addInvoiceOpen} onOpenChange={setAddInvoiceOpen} onAdd={inv => { addInvoice.mutate(inv); toast({ title: "Invoice Created", description: inv.invoiceNumber }); }} invoiceCount={invoices.length} />
      <InvoiceDetailsDialog invoice={detailsInvoice} payments={payments} open={!!detailsInvoice} onOpenChange={() => setDetailsInvoice(null)} onRecordPayment={() => { setPaymentInvoice(detailsInvoice); setDetailsInvoice(null); }} />
      <RecordPaymentDialog invoice={paymentInvoice} open={!!paymentInvoice} onOpenChange={() => setPaymentInvoice(null)} onRecord={handleRecordPayment} paymentCount={payments.length} />
      <AddExpenseDialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen} onAdd={exp => { addExpense.mutate(exp); toast({ title: "Expense Recorded", description: exp.expenseNumber }); }} expenseCount={expenses.length} />
    </div>
  );
}
