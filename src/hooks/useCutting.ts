import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { EnhancedCuttingJob, CuttingStats, WorkOrderPriority } from "@/data/enhancedProductionData";

type CuttingJobStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

const mapDbToCuttingJob = (db: any): EnhancedCuttingJob => {
  const workOrder = db.work_orders || {};
  const inventory = db.inventory_items || {};
  const product = inventory?.products || {};
  const assigneeProfile = db.assignee_profile || {};
  
  const cuts = (db.cuts || []).map(Number);
  const stockLength = Number(db.stock_length) || 6000;
  const stocksUsed = Number(db.stocks_used) || 1;
  const totalCutLength = cuts.reduce((s: number, c: number) => s + c, 0);
  const totalStock = stockLength * stocksUsed;
  const waste = Number(db.waste) || Math.max(0, totalStock - totalCutLength);
  const wastePercent = Number(db.waste_percent) || (totalStock > 0 ? Number(((waste / totalStock) * 100).toFixed(1)) : 0);
  const efficiency = Number(db.efficiency) || (totalStock > 0 ? Number(((totalCutLength / totalStock) * 100).toFixed(1)) : 0);

  return {
    id: db.id,
    jobNumber: db.job_number,
    workOrderId: db.work_order_id || undefined,
    workOrderNumber: workOrder?.work_order_number || undefined,
    projectId: workOrder?.project_id || undefined,
    projectName: undefined,
    customerId: workOrder?.customer_id || undefined,
    customerName: workOrder?.customers?.name || undefined,
    inventoryItemId: db.inventory_item_id || undefined,
    materialCode: inventory?.item_code || '',
    materialName: db.material_name || product?.name || inventory?.item_code || 'Unknown Material',
    materialCategory: db.material_category || product?.category || 'Profile',
    alloyType: db.alloy_type || product?.alloy_type,
    temper: db.temper || product?.temper,
    stockLength,
    stocksUsed,
    cuts,
    totalCuts: Number(db.total_cuts) || cuts.length,
    totalCutLength: Number(db.total_cut_length) || totalCutLength,
    waste,
    wastePercent,
    optimized: db.optimized || false,
    optimizationLayout: db.optimization_layout || undefined,
    efficiency,
    remnants: db.remnants || [],
    assignee: assigneeProfile?.full_name || db.assignee || 'Unassigned',
    assigneeName: assigneeProfile?.full_name,
    machine: db.machine || 'Double Head Cutting Saw',
    scheduledDate: db.scheduled_date || undefined,
    startTime: db.start_time || undefined,
    endTime: db.end_time || undefined,
    materialCost: Number(db.material_cost) || 0,
    wasteCost: Number(db.waste_cost) || 0,
    laborCost: Number(db.labor_cost) || 0,
    totalCost: Number(db.material_cost || 0) + Number(db.labor_cost || 0) + Number(db.waste_cost || 0),
    status: db.status as CuttingJobStatus,
    priority: db.priority as WorkOrderPriority,
    qualityChecked: db.quality_checked || false,
    qualityResult: db.quality_result || undefined,
    qualityNotes: db.quality_notes || undefined,
    notes: db.notes || undefined,
    createdAt: db.created_at,
    createdBy: db.created_by || '',
    updatedAt: db.updated_at,
  };
};

export function useCutting() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cuttingJobs = [], isLoading } = useQuery({
    queryKey: ['cutting_jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cutting_jobs')
        .select(`
          *,
          work_orders(*, customers(*)),
          inventory_items(*, products(*)),
          assignee_profile:profiles!cutting_jobs_assignee_fkey(full_name)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapDbToCuttingJob);
    },
  });

  const addCuttingJob = useMutation({
    mutationFn: async (job: Partial<EnhancedCuttingJob> & { jobNumber: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const cuts = job.cuts || [];
      const stockLength = job.stockLength || 6000;
      const stocksUsed = job.stocksUsed || 1;
      const totalCutLength = cuts.reduce((s, c) => s + c, 0);
      const totalStock = stockLength * stocksUsed;
      const waste = Math.max(0, totalStock - totalCutLength);

      const { data, error } = await supabase
        .from('cutting_jobs')
        .insert({
          job_number: job.jobNumber,
          work_order_id: job.workOrderId || null,
          inventory_item_id: job.inventoryItemId || null,
          material_name: job.materialName || '',
          material_category: job.materialCategory || 'Profile',
          alloy_type: job.alloyType || null,
          temper: job.temper || null,
          stock_length: stockLength,
          stocks_used: stocksUsed,
          cuts: cuts,
          total_cuts: cuts.length,
          total_cut_length: totalCutLength,
          waste: waste,
          waste_percent: totalStock > 0 ? Number(((waste / totalStock) * 100).toFixed(1)) : 0,
          efficiency: totalStock > 0 ? Number(((totalCutLength / totalStock) * 100).toFixed(1)) : 0,
          remnants: job.remnants || (waste > 200 ? [{ length: waste, reusable: true }] : waste > 0 ? [{ length: waste, reusable: false }] : []),
          machine: job.machine || 'Double Head Cutting Saw',
          assignee: job.assignee || null,
          scheduled_date: job.scheduledDate || null,
          material_cost: job.materialCost || totalStock * 0.085,
          waste_cost: job.wasteCost || waste * 0.085,
          labor_cost: job.laborCost || 345,
          status: 'Pending',
          priority: job.priority || 'Medium',
          notes: job.notes || null,
          created_by: user?.id || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cutting_jobs'] });
      toast({ title: 'Cutting Job Created' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateCuttingJob = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { data, error } = await supabase
        .from('cutting_jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cutting_jobs'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteCuttingJob = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cutting_jobs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cutting_jobs'] });
      toast({ title: 'Cutting Job Deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateStatus = async (id: string, status: CuttingJobStatus) => {
    const updates: Record<string, any> = { status };
    if (status === 'In Progress') {
      updates.start_time = new Date().toISOString();
    } else if (status === 'Completed') {
      updates.end_time = new Date().toISOString();
    }
    updateCuttingJob.mutate({ id, updates });
    toast({ title: 'Status Updated', description: `Job updated to ${status}` });
  };

  const applyOptimization = async (jobId: string, layout: number[][], stockNeeded: number, totalWaste: number) => {
    const job = cuttingJobs.find(j => j.id === jobId);
    if (!job) return;
    
    const totalStock = job.stockLength * stockNeeded;
    const totalCutLength = layout.flat().reduce((s, c) => s + c, 0);
    
    updateCuttingJob.mutate({
      id: jobId,
      updates: {
        optimized: true,
        optimization_layout: layout,
        stocks_used: stockNeeded,
        waste: totalWaste,
        waste_percent: totalStock > 0 ? Number(((totalWaste / totalStock) * 100).toFixed(1)) : 0,
        efficiency: totalStock > 0 ? Number(((totalCutLength / totalStock) * 100).toFixed(1)) : 0,
      },
    });
    toast({ title: 'Optimization Applied', description: `${stockNeeded} stocks, ${totalWaste}mm waste` });
  };

  // Calculate stats
  const stats: CuttingStats = {
    totalJobs: cuttingJobs.length,
    pendingJobs: cuttingJobs.filter(j => j.status === 'Pending').length,
    inProgressJobs: cuttingJobs.filter(j => j.status === 'In Progress').length,
    completedJobs: cuttingJobs.filter(j => j.status === 'Completed').length,
    totalCuts: cuttingJobs.reduce((s, j) => s + j.totalCuts, 0),
    totalStockUsed: cuttingJobs.reduce((s, j) => s + j.stockLength * j.stocksUsed, 0),
    totalWaste: cuttingJobs.reduce((s, j) => s + j.waste, 0),
    averageWastePercent: cuttingJobs.length > 0 ? Math.round((cuttingJobs.reduce((s, j) => s + j.wastePercent, 0) / cuttingJobs.length) * 10) / 10 : 0,
    averageEfficiency: cuttingJobs.length > 0 ? Math.round((cuttingJobs.reduce((s, j) => s + j.efficiency, 0) / cuttingJobs.length) * 10) / 10 : 0,
    totalMaterialCost: cuttingJobs.reduce((s, j) => s + j.materialCost, 0),
    totalWasteCost: cuttingJobs.reduce((s, j) => s + j.wasteCost, 0),
    remnantsCreated: cuttingJobs.reduce((s, j) => s + j.remnants.length, 0),
    reusableRemnants: cuttingJobs.reduce((s, j) => s + j.remnants.filter((r: any) => r.reusable).length, 0),
    byMachine: cuttingJobs.reduce((acc, j) => {
      acc[j.machine] = (acc[j.machine] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return {
    cuttingJobs,
    isLoading,
    stats,
    addCuttingJob: addCuttingJob.mutate,
    updateCuttingJob: updateCuttingJob.mutate,
    deleteCuttingJob: deleteCuttingJob.mutate,
    updateStatus,
    applyOptimization,
  };
}
