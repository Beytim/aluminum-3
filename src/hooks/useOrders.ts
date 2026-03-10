import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EnhancedOrder } from "@/data/enhancedOrderData";

const mapRow = (r: any): EnhancedOrder => ({
  id: r.id,
  orderNumber: r.order_number,
  customerId: r.customer_id || '',
  customerName: r.customer_name,
  customerPhone: r.customer_phone,
  quoteId: r.quote_id,
  quoteNumber: r.quote_number,
  projectId: r.project_id,
  projectName: r.project_name,
  workOrderIds: r.work_order_ids || [],
  cuttingJobIds: r.cutting_job_ids || [],
  orderDate: r.order_date,
  requestedDelivery: r.requested_delivery || r.due_date,
  actualDelivery: r.actual_delivery,
  dueDate: r.due_date,
  status: r.status,
  paymentStatus: r.payment_status,
  isOverdue: r.is_overdue,
  shippingMethod: r.shipping_method,
  shippingAddress: r.shipping_address,
  trackingNumber: r.tracking_number,
  items: r.items || [],
  subtotal: Number(r.subtotal),
  discountTotal: Number(r.discount_total),
  taxRate: Number(r.tax_rate),
  tax: Number(r.tax),
  total: Number(r.total),
  totalCost: Number(r.total_cost),
  totalProfit: Number(r.total_profit),
  profitMargin: Number(r.profit_margin),
  payments: r.payments || [],
  totalPaid: Number(r.total_paid),
  balance: Number(r.balance),
  paymentMethod: r.payment_method,
  deliveries: r.deliveries || [],
  totalShipped: r.total_shipped,
  totalDelivered: r.total_delivered,
  activityLog: r.activity_log || [],
  notes: r.notes,
  internalNotes: r.internal_notes,
  createdAt: r.created_at,
  createdBy: r.created_by,
  createdByName: r.created_by_name,
  updatedAt: r.updated_at,
  updatedBy: r.updated_by,
  updatedByName: r.updated_by_name,
});

const toDb = (o: Partial<EnhancedOrder>) => ({
  order_number: o.orderNumber,
  customer_id: o.customerId || null,
  customer_name: o.customerName,
  customer_phone: o.customerPhone,
  quote_id: o.quoteId,
  quote_number: o.quoteNumber,
  project_id: o.projectId || null,
  project_name: o.projectName,
  work_order_ids: o.workOrderIds,
  cutting_job_ids: o.cuttingJobIds,
  order_date: o.orderDate,
  requested_delivery: o.requestedDelivery,
  actual_delivery: o.actualDelivery,
  due_date: o.dueDate,
  status: o.status,
  payment_status: o.paymentStatus,
  is_overdue: o.isOverdue,
  shipping_method: o.shippingMethod,
  shipping_address: o.shippingAddress,
  tracking_number: o.trackingNumber,
  items: o.items as any,
  subtotal: o.subtotal,
  discount_total: o.discountTotal,
  tax_rate: o.taxRate,
  tax: o.tax,
  total: o.total,
  total_cost: o.totalCost,
  total_profit: o.totalProfit,
  profit_margin: o.profitMargin,
  payments: o.payments as any,
  total_paid: o.totalPaid,
  balance: o.balance,
  payment_method: o.paymentMethod,
  deliveries: o.deliveries as any,
  total_shipped: o.totalShipped,
  total_delivered: o.totalDelivered,
  activity_log: o.activityLog as any,
  notes: o.notes,
  internal_notes: o.internalNotes,
});

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    },
  });
}

export function useOrderMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["orders"] });

  const addOrder = useMutation({
    mutationFn: async (o: EnhancedOrder) => {
      const { error } = await supabase.from("orders").insert(toDb(o) as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateOrder = useMutation({
    mutationFn: async (o: EnhancedOrder) => {
      const { error } = await supabase.from("orders").update(toDb(o) as any).eq("id", o.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { addOrder, updateOrder, deleteOrder };
}
