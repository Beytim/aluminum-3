import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EnhancedInvoice, EnhancedPayment, Expense } from "@/data/enhancedFinanceData";

// ═══ INVOICES ═══
const mapInvoice = (r: any): EnhancedInvoice => ({
  id: r.id, invoiceNumber: r.invoice_number,
  customerId: r.customer_id || '', customerName: r.customer_name, customerCode: r.customer_code,
  customerTaxId: r.customer_tax_id, customerAddress: r.customer_address,
  projectId: r.project_id, projectName: r.project_name,
  orderId: r.order_id, orderNumber: r.order_number,
  quoteId: r.quote_id, quoteNumber: r.quote_number,
  issueDate: r.issue_date, dueDate: r.due_date, paidDate: r.paid_date,
  status: r.status, currency: r.currency, exchangeRate: Number(r.exchange_rate),
  items: r.items || [], subtotal: Number(r.subtotal), discountAmount: Number(r.discount_amount),
  taxableAmount: Number(r.taxable_amount), taxRate: Number(r.tax_rate), taxAmount: Number(r.tax_amount),
  shippingCost: Number(r.shipping_cost), otherCharges: Number(r.other_charges), chargesDescription: r.charges_description,
  total: Number(r.total), totalInETB: Number(r.total_in_etb),
  payments: r.payments || [], totalPaid: Number(r.total_paid), totalPaidInETB: Number(r.total_paid_in_etb),
  balance: Number(r.balance), balanceInETB: Number(r.balance_in_etb),
  paymentTerms: r.payment_terms, paymentDueDays: r.payment_due_days,
  notes: r.notes, termsAndConditions: r.terms_and_conditions, internalNotes: r.internal_notes,
  isOverdue: r.is_overdue, isFullyPaid: r.is_fully_paid,
  activityLog: r.activity_log || [],
  createdAt: r.created_at, createdBy: r.created_by, createdByName: r.created_by_name, updatedAt: r.updated_at,
});

const invoiceToDb = (i: Partial<EnhancedInvoice>) => ({
  invoice_number: i.invoiceNumber, customer_id: i.customerId || null, customer_name: i.customerName,
  customer_code: i.customerCode, customer_tax_id: i.customerTaxId, customer_address: i.customerAddress,
  project_id: i.projectId || null, project_name: i.projectName,
  order_id: i.orderId || null, order_number: i.orderNumber,
  quote_id: i.quoteId || null, quote_number: i.quoteNumber,
  issue_date: i.issueDate, due_date: i.dueDate, paid_date: i.paidDate,
  status: i.status, currency: i.currency, exchange_rate: i.exchangeRate,
  items: i.items as any, subtotal: i.subtotal, discount_amount: i.discountAmount,
  taxable_amount: i.taxableAmount, tax_rate: i.taxRate, tax_amount: i.taxAmount,
  shipping_cost: i.shippingCost, other_charges: i.otherCharges, charges_description: i.chargesDescription,
  total: i.total, total_in_etb: i.totalInETB,
  payments: i.payments as any, total_paid: i.totalPaid, total_paid_in_etb: i.totalPaidInETB,
  balance: i.balance, balance_in_etb: i.balanceInETB,
  payment_terms: i.paymentTerms, payment_due_days: i.paymentDueDays,
  notes: i.notes, terms_and_conditions: i.termsAndConditions, internal_notes: i.internalNotes,
  is_overdue: i.isOverdue, is_fully_paid: i.isFullyPaid, activity_log: i.activityLog as any,
});

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapInvoice);
    },
  });
}

export function useInvoiceMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["invoices"] });
  return {
    addInvoice: useMutation({ mutationFn: async (i: EnhancedInvoice) => { const { error } = await supabase.from("invoices").insert(invoiceToDb(i) as any); if (error) throw error; }, onSuccess: inv }),
    updateInvoice: useMutation({ mutationFn: async (i: EnhancedInvoice) => { const { error } = await supabase.from("invoices").update(invoiceToDb(i) as any).eq("id", i.id); if (error) throw error; }, onSuccess: inv }),
    deleteInvoice: useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("invoices").delete().eq("id", id); if (error) throw error; }, onSuccess: inv }),
  };
}

// ═══ PAYMENTS ═══
const mapPayment = (r: any): EnhancedPayment => ({
  id: r.id, paymentNumber: r.payment_number,
  invoiceId: r.invoice_id || '', invoiceNumber: r.invoice_number,
  customerId: r.customer_id || '', customerName: r.customer_name,
  date: r.date, amount: Number(r.amount), currency: r.currency, exchangeRate: Number(r.exchange_rate),
  amountInETB: Number(r.amount_in_etb), method: r.method, reference: r.reference,
  bankName: r.bank_name, accountNumber: r.account_number, transactionId: r.transaction_id,
  chequeNumber: r.cheque_number, phoneNumber: r.phone_number,
  status: r.status, reconciled: r.reconciled, reconciledDate: r.reconciled_date,
  notes: r.notes, recordedBy: r.recorded_by, recordedByName: r.recorded_by_name, recordedAt: r.recorded_at,
});

export function usePayments() {
  return useQuery({
    queryKey: ["finance_payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("finance_payments").select("*").order("recorded_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapPayment);
    },
  });
}

export function usePaymentMutations() {
  const qc = useQueryClient();
  const inv = () => { qc.invalidateQueries({ queryKey: ["finance_payments"] }); qc.invalidateQueries({ queryKey: ["invoices"] }); };
  return {
    addPayment: useMutation({
      mutationFn: async (p: EnhancedPayment) => {
        const { error } = await supabase.from("finance_payments").insert({
          payment_number: p.paymentNumber, invoice_id: p.invoiceId || null, invoice_number: p.invoiceNumber,
          customer_id: p.customerId || null, customer_name: p.customerName,
          date: p.date, amount: p.amount, currency: p.currency, exchange_rate: p.exchangeRate,
          amount_in_etb: p.amountInETB, method: p.method, reference: p.reference,
          bank_name: p.bankName, account_number: p.accountNumber, transaction_id: p.transactionId,
          cheque_number: p.chequeNumber, phone_number: p.phoneNumber,
          status: p.status, reconciled: p.reconciled, notes: p.notes,
          recorded_by: p.recordedBy, recorded_by_name: p.recordedByName,
        } as any);
        if (error) throw error;
      },
      onSuccess: inv,
    }),
  };
}

// ═══ EXPENSES ═══
const mapExpense = (r: any): Expense => ({
  id: r.id, expenseNumber: r.expense_number,
  supplierId: r.supplier_id, supplierName: r.supplier_name,
  projectId: r.project_id, projectName: r.project_name,
  date: r.date, category: r.category, description: r.description,
  amount: Number(r.amount), currency: r.currency, exchangeRate: Number(r.exchange_rate),
  amountInETB: Number(r.amount_in_etb), taxRate: Number(r.tax_rate), taxAmount: Number(r.tax_amount),
  paymentMethod: r.payment_method, paid: r.paid, paidDate: r.paid_date,
  notes: r.notes, createdBy: r.created_by, createdByName: r.created_by_name, createdAt: r.created_at,
});

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("expenses").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapExpense);
    },
  });
}

export function useExpenseMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["expenses"] });
  return {
    addExpense: useMutation({
      mutationFn: async (e: Expense) => {
        const { error } = await supabase.from("expenses").insert({
          expense_number: e.expenseNumber, supplier_id: e.supplierId || null, supplier_name: e.supplierName,
          project_id: e.projectId || null, project_name: e.projectName,
          date: e.date, category: e.category, description: e.description,
          amount: e.amount, currency: e.currency, exchange_rate: e.exchangeRate,
          amount_in_etb: e.amountInETB, tax_rate: e.taxRate, tax_amount: e.taxAmount,
          payment_method: e.paymentMethod, paid: e.paid, paid_date: e.paidDate,
          notes: e.notes, created_by: e.createdBy, created_by_name: e.createdByName,
        } as any);
        if (error) throw error;
      },
      onSuccess: inv,
    }),
    deleteExpense: useMutation({
      mutationFn: async (id: string) => { const { error } = await supabase.from("expenses").delete().eq("id", id); if (error) throw error; },
      onSuccess: inv,
    }),
  };
}
