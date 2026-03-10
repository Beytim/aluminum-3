import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EnhancedInspection, NCR, CustomerComplaint } from "@/data/enhancedQualityData";

// ═══ INSPECTIONS ═══
const mapInspection = (r: any): EnhancedInspection => ({
  id: r.id, inspectionNumber: r.inspection_number, type: r.type,
  productId: r.product_id, productName: r.product_name, productCode: r.product_code,
  workOrderId: r.work_order_id, workOrderNumber: r.work_order_number,
  purchaseOrderId: r.purchase_order_id, purchaseOrderNumber: r.purchase_order_number,
  inventoryItemId: r.inventory_item_id, inventoryItemCode: r.inventory_item_code,
  projectId: r.project_id, projectName: r.project_name,
  orderId: r.order_id, orderNumber: r.order_number,
  installationId: r.installation_id, equipmentId: r.equipment_id,
  supplierId: r.supplier_id, supplierName: r.supplier_name,
  inspectorId: r.inspector_id, inspectorName: r.inspector_name, inspectorDept: r.inspector_dept,
  scheduledDate: r.scheduled_date, inspectionDate: r.inspection_date, completedDate: r.completed_date,
  checklistId: r.checklist_id, checklistName: r.checklist_name,
  result: r.result, score: r.score ? Number(r.score) : undefined,
  checklistResults: r.checklist_results || [], defects: r.defects || [], defectCount: r.defect_count,
  measurements: r.measurements, ncrId: r.ncr_id, ncrNumber: r.ncr_number,
  status: r.status, notes: r.notes,
  createdBy: r.created_by, createdByName: r.created_by_name, createdAt: r.created_at,
  updatedBy: r.updated_by, updatedByName: r.updated_by_name, updatedAt: r.updated_at,
});

export function useInspections() {
  return useQuery({
    queryKey: ["inspections"],
    queryFn: async () => {
      const { data, error } = await supabase.from("inspections").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapInspection);
    },
  });
}

export function useInspectionMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["inspections"] });
  return {
    addInspection: useMutation({
      mutationFn: async (i: EnhancedInspection) => {
        const { error } = await supabase.from("inspections").insert({
          inspection_number: i.inspectionNumber, type: i.type,
          product_id: i.productId || null, product_name: i.productName, product_code: i.productCode,
          work_order_id: i.workOrderId || null, work_order_number: i.workOrderNumber,
          project_id: i.projectId || null, project_name: i.projectName,
          supplier_id: i.supplierId || null, supplier_name: i.supplierName,
          inspector_id: i.inspectorId, inspector_name: i.inspectorName, inspector_dept: i.inspectorDept,
          scheduled_date: i.scheduledDate, inspection_date: i.inspectionDate,
          result: i.result, score: i.score,
          checklist_results: i.checklistResults as any, defects: i.defects as any, defect_count: i.defectCount,
          measurements: i.measurements as any, status: i.status, notes: i.notes,
        } as any);
        if (error) throw error;
      },
      onSuccess: inv,
    }),
    updateInspection: useMutation({
      mutationFn: async (i: EnhancedInspection) => {
        const { error } = await supabase.from("inspections").update({
          result: i.result, status: i.status, score: i.score, completed_date: i.completedDate,
          defects: i.defects as any, defect_count: i.defectCount, notes: i.notes,
          ncr_id: i.ncrId, ncr_number: i.ncrNumber,
        } as any).eq("id", i.id);
        if (error) throw error;
      },
      onSuccess: inv,
    }),
    deleteInspection: useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("inspections").delete().eq("id", id); if (error) throw error; }, onSuccess: inv }),
  };
}

// ═══ NCRs ═══
const mapNCR = (r: any): NCR => ({
  id: r.id, ncrNumber: r.ncr_number,
  inspectionId: r.inspection_id, inspectionNumber: r.inspection_number,
  productId: r.product_id, productName: r.product_name,
  workOrderId: r.work_order_id, workOrderNumber: r.work_order_number,
  purchaseOrderId: r.purchase_order_id, purchaseOrderNumber: r.purchase_order_number,
  supplierId: r.supplier_id, supplierName: r.supplier_name,
  customerId: r.customer_id, customerName: r.customer_name,
  orderId: r.order_id, orderNumber: r.order_number,
  title: r.title, description: r.description,
  reportedDate: r.reported_date, reportedBy: r.reported_by, reportedByName: r.reported_by_name,
  severity: r.severity, category: r.category,
  quantityAffected: Number(r.quantity_affected), quantityUnit: r.quantity_unit,
  immediateAction: r.immediate_action, quarantineLocation: r.quarantine_location,
  investigationRequired: r.investigation_required, investigationStatus: r.investigation_status,
  investigationSummary: r.investigation_summary, rootCause: r.root_cause, rootCauseCategory: r.root_cause_category,
  capaRequired: r.capa_required, capaId: r.capa_id, capaNumber: r.capa_number, preventiveAction: r.preventive_action,
  verificationRequired: r.verification_required, verificationStatus: r.verification_status,
  verifiedBy: r.verified_by, verifiedDate: r.verified_date,
  closureDate: r.closure_date, closedBy: r.closed_by,
  costImpact: Number(r.cost_impact), timeImpact: Number(r.time_impact), scrapValue: r.scrap_value ? Number(r.scrap_value) : undefined,
  status: r.status, notes: r.notes, activityLog: r.activity_log || [],
  createdAt: r.created_at, createdBy: r.created_by, createdByName: r.created_by_name,
  updatedAt: r.updated_at, updatedBy: r.updated_by, updatedByName: r.updated_by_name,
});

export function useNCRs() {
  return useQuery({
    queryKey: ["ncrs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ncrs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapNCR);
    },
  });
}

export function useNCRMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["ncrs"] });
  return {
    addNCR: useMutation({
      mutationFn: async (n: NCR) => {
        const { error } = await supabase.from("ncrs").insert({
          ncr_number: n.ncrNumber, inspection_id: n.inspectionId || null, inspection_number: n.inspectionNumber,
          product_id: n.productId || null, product_name: n.productName,
          work_order_id: n.workOrderId || null, work_order_number: n.workOrderNumber,
          supplier_id: n.supplierId || null, supplier_name: n.supplierName,
          customer_id: n.customerId || null, customer_name: n.customerName,
          title: n.title, description: n.description,
          reported_date: n.reportedDate, reported_by: n.reportedBy, reported_by_name: n.reportedByName,
          severity: n.severity, category: n.category,
          quantity_affected: n.quantityAffected, quantity_unit: n.quantityUnit,
          immediate_action: n.immediateAction, investigation_required: n.investigationRequired,
          cost_impact: n.costImpact, time_impact: n.timeImpact, status: n.status, notes: n.notes,
        } as any);
        if (error) throw error;
      },
      onSuccess: inv,
    }),
    updateNCR: useMutation({
      mutationFn: async (n: NCR) => {
        const { error } = await supabase.from("ncrs").update({
          status: n.status, investigation_status: n.investigationStatus, investigation_summary: n.investigationSummary,
          root_cause: n.rootCause, corrective_action: n.preventiveAction,
          closure_date: n.closureDate, closed_by: n.closedBy, notes: n.notes,
        } as any).eq("id", n.id);
        if (error) throw error;
      },
      onSuccess: inv,
    }),
  };
}

// ═══ COMPLAINTS ═══
const mapComplaint = (r: any): CustomerComplaint => ({
  id: r.id, complaintNumber: r.complaint_number,
  customerId: r.customer_id || '', customerName: r.customer_name,
  orderId: r.order_id, orderNumber: r.order_number,
  productId: r.product_id, productName: r.product_name,
  installationId: r.installation_id,
  date: r.date, receivedBy: r.received_by, channel: r.channel,
  subject: r.subject, description: r.description, category: r.category, severity: r.severity,
  responseRequired: r.response_required, responseDeadline: r.response_deadline,
  responded: r.responded, respondedDate: r.responded_date, responseNotes: r.response_notes,
  resolution: r.resolution, resolved: r.resolved, resolvedDate: r.resolved_date, resolvedBy: r.resolved_by,
  ncrId: r.ncr_id, ncrNumber: r.ncr_number,
  costOfResolution: Number(r.cost_of_resolution), customerSatisfaction: r.customer_satisfaction,
  status: r.status, notes: r.notes, activityLog: r.activity_log || [],
  createdAt: r.created_at, createdBy: r.created_by, updatedAt: r.updated_at,
});

export function useComplaints() {
  return useQuery({
    queryKey: ["customer_complaints"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customer_complaints").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapComplaint);
    },
  });
}

export function useComplaintMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["customer_complaints"] });
  return {
    addComplaint: useMutation({
      mutationFn: async (c: CustomerComplaint) => {
        const { error } = await supabase.from("customer_complaints").insert({
          complaint_number: c.complaintNumber, customer_id: c.customerId || null, customer_name: c.customerName,
          order_id: c.orderId || null, product_id: c.productId || null, product_name: c.productName,
          date: c.date, received_by: c.receivedBy, channel: c.channel,
          subject: c.subject, description: c.description, category: c.category, severity: c.severity,
          response_required: c.responseRequired, response_deadline: c.responseDeadline,
          status: c.status, notes: c.notes,
        } as any);
        if (error) throw error;
      },
      onSuccess: inv,
    }),
  };
}
