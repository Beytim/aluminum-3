import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import type { EnhancedProject, ProjectProduct, ProjectMilestones, ProjectTimelineEvent } from "@/data/enhancedProjectData";

type ProjectRow = Tables<"projects">;
type ProjectProductRow = Tables<"project_products">;

// Map DB row to EnhancedProject
function mapRowToProject(row: ProjectRow, products: ProjectProductRow[]): EnhancedProject {
  return {
    id: row.id,
    projectNumber: row.project_number,
    name: row.name,
    nameAm: row.name_am,
    customerId: row.customer_id || '',
    customerName: row.customer_name,
    customerContact: row.customer_contact || undefined,
    customerPhone: row.customer_phone || undefined,
    type: row.type as EnhancedProject['type'],
    status: row.status as EnhancedProject['status'],
    value: Number(row.value),
    deposit: Number(row.deposit),
    depositPercentage: Number(row.deposit_percentage),
    balance: Number(row.balance),
    materialCost: Number(row.material_cost),
    laborCost: Number(row.labor_cost),
    overheadCost: Number(row.overhead_cost),
    totalCost: Number(row.total_cost),
    profit: Number(row.profit),
    profitMargin: Number(row.profit_margin),
    orderDate: row.order_date,
    startDate: row.start_date || undefined,
    dueDate: row.due_date,
    completedDate: row.completed_date || undefined,
    progress: Number(row.progress),
    milestones: (row.milestones as unknown as ProjectMilestones) || {
      depositPaid: false, materialsOrdered: false, materialsReceived: false,
      productionStarted: false, productionCompleted: false, installationStarted: false,
      installationCompleted: false, finalPayment: false,
    },
    quoteId: row.quote_id || undefined,
    workOrderIds: row.work_order_ids || [],
    purchaseOrderIds: row.purchase_order_ids || [],
    invoiceIds: row.invoice_ids || [],
    paymentIds: row.payment_ids || [],
    installationIds: row.installation_ids || [],
    products: products.map(pp => ({
      productId: pp.product_id || '',
      productName: pp.product_name,
      quantity: Number(pp.quantity),
      unitPrice: Number(pp.unit_price),
      totalPrice: Number(pp.total_price),
      status: pp.status as ProjectProduct['status'],
      notes: pp.notes || undefined,
    })),
    projectManager: row.project_manager,
    projectManagerId: row.project_manager_id || undefined,
    teamMembers: row.team_members || undefined,
    notes: row.notes || undefined,
    internalNotes: row.internal_notes || undefined,
    isOverdue: row.is_overdue,
    isAtRisk: row.is_at_risk,
    timeline: (row.timeline as unknown as ProjectTimelineEvent[]) || [],
    createdAt: row.created_at,
    createdBy: row.created_by,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

export function useProjects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all projects with their products
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const [projectsRes, productsRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('project_products').select('*'),
      ]);
      if (projectsRes.error) throw projectsRes.error;
      if (productsRes.error) throw productsRes.error;

      const productsByProject = new Map<string, ProjectProductRow[]>();
      (productsRes.data || []).forEach(pp => {
        const list = productsByProject.get(pp.project_id) || [];
        list.push(pp);
        productsByProject.set(pp.project_id, list);
      });

      return (projectsRes.data || []).map(row =>
        mapRowToProject(row, productsByProject.get(row.id) || [])
      );
    },
  });

  // Add project
  const addProject = useMutation({
    mutationFn: async (project: EnhancedProject) => {
      const { data, error } = await supabase.from('projects').insert({
        project_number: project.projectNumber,
        name: project.name,
        name_am: project.nameAm,
        customer_id: project.customerId || null,
        customer_name: project.customerName,
        customer_contact: project.customerContact || null,
        customer_phone: project.customerPhone || null,
        type: project.type as any,
        status: project.status as any,
        value: project.value,
        deposit: project.deposit,
        deposit_percentage: project.depositPercentage,
        balance: project.balance,
        material_cost: project.materialCost,
        labor_cost: project.laborCost,
        overhead_cost: project.overheadCost,
        total_cost: project.totalCost,
        profit: project.profit,
        profit_margin: project.profitMargin,
        order_date: project.orderDate,
        start_date: project.startDate || null,
        due_date: project.dueDate,
        progress: project.progress,
        milestones: project.milestones as any,
        quote_id: project.quoteId || null,
        work_order_ids: project.workOrderIds,
        project_manager: project.projectManager,
        notes: project.notes || null,
        is_overdue: project.isOverdue,
        is_at_risk: project.isAtRisk,
        timeline: project.timeline as any,
        created_by: project.createdBy,
        updated_by: project.updatedBy,
      }).select().single();
      if (error) throw error;

      // Insert project products
      if (project.products.length > 0) {
        const { error: ppError } = await supabase.from('project_products').insert(
          project.products.map(pp => ({
            project_id: data.id,
            product_id: pp.productId || null,
            product_name: pp.productName,
            quantity: pp.quantity,
            unit_price: pp.unitPrice,
            total_price: pp.totalPrice,
            status: pp.status as any,
          }))
        );
        if (ppError) throw ppError;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project Created', description: 'New project added successfully.' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Update project
  const updateProject = useMutation({
    mutationFn: async (project: EnhancedProject) => {
      const { error } = await supabase.from('projects').update({
        name: project.name,
        name_am: project.nameAm,
        customer_id: project.customerId || null,
        customer_name: project.customerName,
        customer_contact: project.customerContact || null,
        customer_phone: project.customerPhone || null,
        type: project.type as any,
        status: project.status as any,
        value: project.value,
        deposit: project.deposit,
        deposit_percentage: project.depositPercentage,
        balance: project.balance,
        material_cost: project.materialCost,
        labor_cost: project.laborCost,
        overhead_cost: project.overheadCost,
        total_cost: project.totalCost,
        profit: project.profit,
        profit_margin: project.profitMargin,
        start_date: project.startDate || null,
        due_date: project.dueDate,
        completed_date: project.completedDate || null,
        progress: project.progress,
        milestones: project.milestones as any,
        project_manager: project.projectManager,
        notes: project.notes || null,
        internal_notes: project.internalNotes || null,
        is_overdue: project.isOverdue,
        is_at_risk: project.isAtRisk,
        timeline: project.timeline as any,
        updated_by: 'Admin',
        work_order_ids: project.workOrderIds,
        purchase_order_ids: project.purchaseOrderIds,
        invoice_ids: project.invoiceIds,
        payment_ids: project.paymentIds,
        installation_ids: project.installationIds,
      }).eq('id', project.id);
      if (error) throw error;

      // Replace project products
      await supabase.from('project_products').delete().eq('project_id', project.id);
      if (project.products.length > 0) {
        const { error: ppError } = await supabase.from('project_products').insert(
          project.products.map(pp => ({
            project_id: project.id,
            product_id: pp.productId || null,
            product_name: pp.productName,
            quantity: pp.quantity,
            unit_price: pp.unitPrice,
            total_price: pp.totalPrice,
            status: pp.status as any,
          }))
        );
        if (ppError) throw ppError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Updated', description: 'Project saved successfully.' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Delete project
  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Deleted', description: 'Project removed.' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Bulk delete
  const bulkDelete = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('projects').delete().in('id', ids);
      if (error) throw error;
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Deleted', description: `${ids.length} projects removed.` });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Bulk status change
  const bulkStatusChange = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      const { error } = await supabase.from('projects').update({ status: status as any }).in('id', ids);
      if (error) throw error;
    },
    onSuccess: (_, { ids, status }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Updated', description: `${ids.length} projects updated to ${status}.` });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Generate next project number
  const getNextProjectNumber = () => {
    const count = projects.length;
    return `PJ-${String(count + 1).padStart(3, '0')}`;
  };

  return {
    projects,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    bulkDelete,
    bulkStatusChange,
    getNextProjectNumber,
  };
}
