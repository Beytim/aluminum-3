import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EnhancedQuote } from "@/data/enhancedQuoteData";

const mapRow = (r: any): EnhancedQuote => ({
  id: r.id,
  quoteNumber: r.quote_number,
  version: r.version,
  versionHistory: r.version_history || [],
  customerId: r.customer_id || '',
  customerName: r.customer_name,
  customerCode: r.customer_code,
  customerContact: r.customer_contact,
  customerEmail: r.customer_email,
  customerPhone: r.customer_phone,
  customerSnapshot: r.customer_snapshot || { healthScore: 100, outstandingBalance: 0, creditLimit: 0, paymentTerms: 'Net 30' },
  projectId: r.project_id,
  projectName: r.project_name,
  projectStatus: r.project_status,
  title: r.title,
  description: r.description,
  items: r.items || [],
  subtotal: Number(r.subtotal),
  discountType: r.discount_type,
  discountValue: Number(r.discount_value || 0),
  discountAmount: Number(r.discount_amount),
  taxableAmount: Number(r.taxable_amount),
  installationCost: Number(r.installation_cost),
  transportCost: Number(r.transport_cost),
  cuttingFee: Number(r.cutting_fee),
  finishUpcharge: Number(r.finish_upcharge),
  rushFee: Number(r.rush_fee),
  otherFees: Number(r.other_fees),
  feesDescription: r.fees_description,
  taxRate: Number(r.tax_rate),
  taxAmount: Number(r.tax_amount),
  total: Number(r.total),
  totalCost: Number(r.total_cost),
  totalProfit: Number(r.total_profit),
  profitMargin: Number(r.profit_margin),
  quoteDate: r.quote_date,
  expiryDate: r.expiry_date,
  validityDays: r.validity_days,
  convertedDate: r.converted_date,
  status: r.status,
  paymentTerms: r.payment_terms,
  deliveryTerms: r.delivery_terms,
  warranty: r.warranty,
  finishType: r.finish_type,
  notes: r.notes,
  termsAndConditions: r.terms_and_conditions,
  internalNotes: r.internal_notes,
  activityLog: r.activity_log || [],
  isExpired: r.is_expired,
  isConverted: r.is_converted,
  currency: r.currency || 'ETB',
  createdBy: r.created_by,
  createdByName: r.created_by_name,
  createdAt: r.created_at,
  updatedBy: r.updated_by,
  updatedByName: r.updated_by_name,
  updatedAt: r.updated_at,
});

const toDb = (q: Partial<EnhancedQuote>) => ({
  quote_number: q.quoteNumber,
  version: q.version,
  version_history: q.versionHistory as any,
  customer_id: q.customerId || null,
  customer_name: q.customerName,
  customer_code: q.customerCode,
  customer_contact: q.customerContact,
  customer_email: q.customerEmail,
  customer_phone: q.customerPhone,
  customer_snapshot: q.customerSnapshot as any,
  project_id: q.projectId || null,
  project_name: q.projectName,
  project_status: q.projectStatus,
  title: q.title,
  description: q.description,
  items: q.items as any,
  subtotal: q.subtotal,
  discount_type: q.discountType,
  discount_value: q.discountValue,
  discount_amount: q.discountAmount,
  taxable_amount: q.taxableAmount,
  installation_cost: q.installationCost,
  transport_cost: q.transportCost,
  cutting_fee: q.cuttingFee,
  finish_upcharge: q.finishUpcharge,
  rush_fee: q.rushFee,
  other_fees: q.otherFees,
  fees_description: q.feesDescription,
  tax_rate: q.taxRate,
  tax_amount: q.taxAmount,
  total: q.total,
  total_cost: q.totalCost,
  total_profit: q.totalProfit,
  profit_margin: q.profitMargin,
  quote_date: q.quoteDate,
  expiry_date: q.expiryDate,
  validity_days: q.validityDays,
  converted_date: q.convertedDate,
  status: q.status,
  payment_terms: q.paymentTerms,
  delivery_terms: q.deliveryTerms,
  warranty: q.warranty,
  finish_type: q.finishType,
  notes: q.notes,
  terms_and_conditions: q.termsAndConditions,
  internal_notes: q.internalNotes,
  activity_log: q.activityLog as any,
  is_expired: q.isExpired,
  is_converted: q.isConverted,
  currency: q.currency,
});

export function useQuotes() {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quotes").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    },
  });
}

export function useQuoteMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["quotes"] });

  const addQuote = useMutation({
    mutationFn: async (q: EnhancedQuote) => {
      const { error } = await supabase.from("quotes").insert(toDb(q) as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateQuote = useMutation({
    mutationFn: async (q: EnhancedQuote) => {
      const { error } = await supabase.from("quotes").update(toDb(q) as any).eq("id", q.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteQuote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("quotes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { addQuote, updateQuote, deleteQuote };
}
