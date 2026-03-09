import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type {
  EnhancedWorkOrder, WorkOrderMaterial, LaborEntry, ProductionIssue,
  ProductionStage, WorkOrderPriority, WorkOrderStatus,
  StageHistoryEntry, CuttingJobReference, QualityCheckReference,
} from "@/data/enhancedProductionData";

const mapDbToWorkOrder = (db: any): EnhancedWorkOrder => {
  const product = db.products || {};
  const customer = db.customers || {};
  const now = new Date();
  const scheduledEnd = db.scheduled_end ? new Date(db.scheduled_end) : null;
  const isOverdue = scheduledEnd ? scheduledEnd < now && db.status !== 'Completed' && db.status !== 'Cancelled' : false;
  const daysUntilDue = scheduledEnd ? Math.ceil((scheduledEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 999;
  const isAtRisk = !isOverdue && daysUntilDue <= 3 && db.status !== 'Completed' && db.status !== 'Cancelled';

  const estTotal = Number(db.est_labor_cost || 0) + Number(db.est_material_cost || 0) + Number(db.est_overhead_cost || 0);
  const actTotal = Number(db.act_labor_cost || 0) + Number(db.act_material_cost || 0) + Number(db.act_overhead_cost || 0);

  return {
    id: db.id,
    workOrderNumber: db.work_order_number,
    projectId: db.project_id || '',
    projectName: '', // Projects not yet in DB
    projectCode: '',
    customerId: db.customer_id,
    customerName: customer?.name || '',
    quoteId: db.quote_id,
    quoteNumber: '',
    productId: db.product_id || '',
    productCode: product?.code || '',
    productName: product?.name || 'Unknown Product',
    productNameAm: product?.name_am || '',
    productCategory: product?.category || '',
    productType: product?.product_type || 'Fabricated',
    specifications: {
      width: product?.width,
      height: product?.height,
      thickness: product?.thickness,
      profile: product?.profile,
      glass: product?.glass,
      color: product?.colors?.[0],
      alloyType: product?.alloy_type,
      temper: product?.temper,
    },
    quantity: db.quantity || 0,
    completed: db.completed || 0,
    remaining: db.remaining || 0,
    scrap: db.scrap || 0,
    rework: db.rework || 0,
    goodUnits: db.good_units || 0,
    createdAt: db.created_at,
    scheduledStart: db.scheduled_start || '',
    scheduledEnd: db.scheduled_end || '',
    actualStart: db.actual_start,
    actualEnd: db.actual_end,
    estimated: {
      hours: Number(db.est_hours || 0),
      laborCost: Number(db.est_labor_cost || 0),
      materialCost: Number(db.est_material_cost || 0),
      overheadCost: Number(db.est_overhead_cost || 0),
      totalCost: estTotal,
    },
    actual: {
      hours: Number(db.act_hours || 0),
      laborCost: Number(db.act_labor_cost || 0),
      materialCost: Number(db.act_material_cost || 0),
      overheadCost: Number(db.act_overhead_cost || 0),
      totalCost: actTotal,
    },
    variances: {
      hoursVariance: Number(db.est_hours || 0) - Number(db.act_hours || 0),
      costVariance: estTotal - actTotal,
      efficiency: Number(db.act_hours || 0) > 0 ? Math.round((Number(db.est_hours || 0) / Number(db.act_hours || 0)) * 100) : 0,
      scheduleVariance: 0,
    },
    status: db.status as WorkOrderStatus,
    currentStage: db.current_stage as ProductionStage,
    priority: db.priority as WorkOrderPriority,
    progress: Number(db.progress || 0),
    stageHistory: [],
    assignedTeam: undefined,
    assignedWorkers: [],
    materials: [],
    cuttingJobs: [],
    qualityChecks: [],
    laborEntries: [],
    issues: [],
    notes: db.notes,
    supervisorNotes: db.supervisor_notes,
    isOverdue,
    isAtRisk,
    isBlocked: db.is_blocked || false,
    createdBy: db.created_by || '',
    createdByName: '',
    updatedBy: db.updated_by || '',
    updatedByName: '',
    updatedAt: db.updated_at,
  };
};

export function useProduction() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workOrders = [], isLoading } = useQuery({
    queryKey: ['work_orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_orders')
        .select('*, products(*), customers(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapDbToWorkOrder);
    },
  });

  const addWorkOrder = useMutation({
    mutationFn: async (wo: Partial<EnhancedWorkOrder>) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('work_orders')
        .insert({
          work_order_number: wo.workOrderNumber || `WO-${Date.now()}`,
          project_id: wo.projectId || null,
          customer_id: wo.customerId || null,
          product_id: wo.productId || null,
          quantity: wo.quantity || 1,
          remaining: wo.quantity || 1,
          scheduled_start: wo.scheduledStart || null,
          scheduled_end: wo.scheduledEnd || null,
          est_hours: wo.estimated?.hours || 0,
          est_labor_cost: wo.estimated?.laborCost || 0,
          est_material_cost: wo.estimated?.materialCost || 0,
          est_overhead_cost: wo.estimated?.overheadCost || 0,
          est_total_cost: wo.estimated?.totalCost || 0,
          status: (wo.status as any) || 'Draft',
          current_stage: (wo.currentStage as any) || 'Pending',
          priority: (wo.priority as any) || 'Medium',
          notes: wo.notes || null,
          created_by: user?.id || null,
          updated_by: user?.id || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work_orders'] });
      toast({ title: 'Work Order Created' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateWorkOrder = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('work_orders')
        .update({ ...updates, updated_by: user?.id || null })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work_orders'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteWorkOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('work_orders').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work_orders'] });
      toast({ title: 'Work Order Deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const startWorkOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc('start_work_order', { p_work_order_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work_orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory_items'] });
      toast({ title: 'Work Order Started', description: 'Materials have been reserved.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error starting Work Order', description: error.message, variant: 'destructive' });
    }
  });

  const completeWorkOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc('complete_work_order', { p_work_order_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work_orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory_items'] });
      toast({ title: 'Work Order Completed', description: 'Materials consumed and finished goods added to inventory.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error completing Work Order', description: error.message, variant: 'destructive' });
    }
  });

  const advanceStage = async (id: string): Promise<'needs_output' | 'ok'> => {
    const wo = workOrders.find(w => w.id === id);
    if (!wo) return 'ok';
    const stages: ProductionStage[] = ['Pending', 'Cutting', 'Machining', 'Assembly', 'Welding', 'Glazing', 'Quality Check', 'Packaging', 'Completed'];
    const idx = stages.indexOf(wo.currentStage);
    if (idx < 0 || idx >= stages.length - 1) return 'ok';
    const nextStage = stages[idx + 1];
    
    if (wo.currentStage === 'Pending' && (wo.status === 'Draft' || wo.status === 'Scheduled')) {
      startWorkOrder.mutate(id);
      return 'ok';
    }

    if (nextStage === 'Completed') {
      if (wo.goodUnits <= 0) {
        return 'needs_output';
      }
      completeWorkOrder.mutate(id);
      return 'ok';
    }

    const newProgress = Math.min(100, Math.round(((idx + 2) / stages.length) * 100));
    
    updateWorkOrder.mutate({
      id,
      updates: {
        current_stage: nextStage,
        progress: newProgress,
        status: 'In Progress',
      },
    });
    toast({ title: `Stage Advanced to ${nextStage}` });
    return 'ok';
  };

  return {
    workOrders,
    isLoading,
    addWorkOrder: addWorkOrder.mutate,
    updateWorkOrder: updateWorkOrder.mutate,
    deleteWorkOrder: deleteWorkOrder.mutate,
    startWorkOrder: startWorkOrder.mutate,
    completeWorkOrder: completeWorkOrder.mutate,
    advanceStage,
  };
}
