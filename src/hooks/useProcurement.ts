import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EnhancedPurchaseOrder } from "@/data/enhancedProcurementData";

const mapRow = (r: any): EnhancedPurchaseOrder => ({
  id: r.id, poNumber: r.po_number,
  supplierId: r.supplier_id || '', supplierName: r.supplier_name, supplierCode: r.supplier_code,
  projectId: r.project_id, projectName: r.project_name,
  orderDate: r.order_date, expectedDelivery: r.expected_delivery,
  shippedDate: r.shipped_date, receivedDate: r.received_date,
  status: r.status, approvalStatus: r.approval_status, approvedBy: r.approved_by,
  currency: r.currency, exchangeRate: Number(r.exchange_rate),
  items: r.items || [],
  subtotal: Number(r.subtotal), discountAmount: Number(r.discount_amount),
  taxAmount: Number(r.tax_amount), shippingCost: Number(r.shipping_cost),
  shippingTerms: r.shipping_terms, shippingMethod: r.shipping_method,
  trackingNumber: r.tracking_number, carrier: r.carrier,
  insurance: Number(r.insurance), customsDuty: Number(r.customs_duty),
  otherCharges: Number(r.other_charges),
  total: Number(r.total), totalInETB: Number(r.total_in_etb),
  paymentTerms: r.payment_terms,
  paid: Number(r.paid), paidInETB: Number(r.paid_in_etb),
  balance: Number(r.balance), balanceInETB: Number(r.balance_in_etb),
  payments: r.payments || [], receipts: r.receipts || [],
  isOverdue: r.is_overdue, isUrgent: r.is_urgent,
  notes: r.notes, internalNotes: r.internal_notes,
  activityLog: r.activity_log || [],
  createdBy: r.created_by, createdByName: r.created_by_name,
  createdAt: r.created_at, updatedAt: r.updated_at,
});

const toDb = (po: Partial<EnhancedPurchaseOrder>) => ({
  po_number: po.poNumber,
  supplier_id: po.supplierId || null, supplier_name: po.supplierName, supplier_code: po.supplierCode,
  project_id: po.projectId || null, project_name: po.projectName,
  order_date: po.orderDate, expected_delivery: po.expectedDelivery,
  shipped_date: po.shippedDate, received_date: po.receivedDate,
  status: po.status, approval_status: po.approvalStatus, approved_by: po.approvedBy,
  currency: po.currency, exchange_rate: po.exchangeRate,
  items: po.items as any,
  subtotal: po.subtotal, discount_amount: po.discountAmount,
  tax_amount: po.taxAmount, shipping_cost: po.shippingCost,
  shipping_terms: po.shippingTerms, shipping_method: po.shippingMethod,
  tracking_number: po.trackingNumber, carrier: po.carrier,
  insurance: po.insurance, customs_duty: po.customsDuty, other_charges: po.otherCharges,
  total: po.total, total_in_etb: po.totalInETB,
  payment_terms: po.paymentTerms,
  paid: po.paid, paid_in_etb: po.paidInETB,
  balance: po.balance, balance_in_etb: po.balanceInETB,
  payments: po.payments as any, receipts: po.receipts as any,
  is_overdue: po.isOverdue, is_urgent: po.isUrgent,
  notes: po.notes, internal_notes: po.internalNotes,
  activity_log: po.activityLog as any,
});

export function usePurchaseOrders() {
  return useQuery({
    queryKey: ["purchase_orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("purchase_orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    },
  });
}

export function usePurchaseOrderMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["purchase_orders"] });
  return {
    addPO: useMutation({ mutationFn: async (po: EnhancedPurchaseOrder) => { const { error } = await supabase.from("purchase_orders").insert(toDb(po) as any); if (error) throw error; }, onSuccess: inv }),
    updatePO: useMutation({ mutationFn: async (po: EnhancedPurchaseOrder) => { const { error } = await supabase.from("purchase_orders").update(toDb(po) as any).eq("id", po.id); if (error) throw error; }, onSuccess: inv }),
    deletePO: useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("purchase_orders").delete().eq("id", id); if (error) throw error; }, onSuccess: inv }),
  };
}
