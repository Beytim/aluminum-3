import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EnhancedMaintenanceTask, Equipment } from "@/data/enhancedMaintenanceData";

const mapTask = (r: any): EnhancedMaintenanceTask => ({
  id: r.id, taskNumber: r.task_number,
  equipmentId: r.equipment_id || '', equipmentName: r.equipment_name, equipmentNumber: r.equipment_number,
  equipmentCategory: r.equipment_category,
  type: r.type, priority: r.priority, status: r.status,
  scheduledDate: r.scheduled_date, scheduledDuration: Number(r.scheduled_duration),
  startDate: r.start_date, completionDate: r.completion_date,
  title: r.title, description: r.description,
  checklist: r.checklist || [],
  assignedTo: r.assigned_to || [], assignedToNames: r.assigned_to_names || [],
  leadTechnician: r.lead_technician,
  partsUsed: r.parts_used || [],
  laborHours: Number(r.labor_hours), laborRate: Number(r.labor_rate), laborCost: Number(r.labor_cost),
  partsCost: Number(r.parts_cost), totalCost: Number(r.total_cost),
  downtimeHours: r.downtime_hours ? Number(r.downtime_hours) : undefined,
  productionImpact: r.production_impact,
  issuesFound: r.issues_found || [],
  rootCause: r.root_cause, correctiveAction: r.corrective_action,
  outcome: r.outcome, followUpRequired: r.follow_up_required,
  affectedWorkOrders: r.affected_work_orders || [], affectedProjects: r.affected_projects || [],
  notes: r.notes, technicianNotes: r.technician_notes,
  isOverdue: r.is_overdue, isEmergency: r.is_emergency, requiresShutdown: r.requires_shutdown,
  activityLog: r.activity_log || [],
  createdAt: r.created_at, createdBy: r.created_by, createdByName: r.created_by_name, updatedAt: r.updated_at,
});

const taskToDb = (t: Partial<EnhancedMaintenanceTask>) => ({
  task_number: t.taskNumber, equipment_id: t.equipmentId || null,
  equipment_name: t.equipmentName, equipment_number: t.equipmentNumber, equipment_category: t.equipmentCategory,
  type: t.type, priority: t.priority, status: t.status,
  scheduled_date: t.scheduledDate, scheduled_duration: t.scheduledDuration,
  start_date: t.startDate, completion_date: t.completionDate,
  title: t.title, description: t.description, checklist: t.checklist as any,
  assigned_to: t.assignedTo, assigned_to_names: t.assignedToNames, lead_technician: t.leadTechnician,
  parts_used: t.partsUsed as any,
  labor_hours: t.laborHours, labor_rate: t.laborRate, labor_cost: t.laborCost,
  parts_cost: t.partsCost, total_cost: t.totalCost,
  downtime_hours: t.downtimeHours, production_impact: t.productionImpact,
  issues_found: t.issuesFound, root_cause: t.rootCause, corrective_action: t.correctiveAction,
  outcome: t.outcome, follow_up_required: t.followUpRequired,
  affected_work_orders: t.affectedWorkOrders, affected_projects: t.affectedProjects,
  notes: t.notes, technician_notes: t.technicianNotes,
  is_overdue: t.isOverdue, is_emergency: t.isEmergency, requires_shutdown: t.requiresShutdown,
  activity_log: t.activityLog as any,
});

export function useMaintenanceTasks() {
  return useQuery({
    queryKey: ["maintenance_tasks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("maintenance_tasks").select("*").order("scheduled_date", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapTask);
    },
  });
}

export function useMaintenanceMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["maintenance_tasks"] });
  return {
    addTask: useMutation({ mutationFn: async (t: EnhancedMaintenanceTask) => { const { error } = await supabase.from("maintenance_tasks").insert(taskToDb(t) as any); if (error) throw error; }, onSuccess: inv }),
    updateTask: useMutation({ mutationFn: async (t: EnhancedMaintenanceTask) => { const { error } = await supabase.from("maintenance_tasks").update(taskToDb(t) as any).eq("id", t.id); if (error) throw error; }, onSuccess: inv }),
    deleteTask: useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("maintenance_tasks").delete().eq("id", id); if (error) throw error; }, onSuccess: inv }),
  };
}

// ═══ EQUIPMENT ═══
const mapEquipment = (r: any): Equipment => ({
  id: r.id, equipmentNumber: r.equipment_number, name: r.name, nameAm: r.name_am,
  category: r.category, manufacturer: r.manufacturer, model: r.model, serialNumber: r.serial_number,
  yearOfManufacture: r.year_of_manufacture, purchaseDate: r.purchase_date, purchaseCost: Number(r.purchase_cost),
  location: r.location, department: r.department, powerRating: r.power_rating, capacity: r.capacity,
  maintenanceFrequency: r.maintenance_frequency || { type: 'monthly', value: 1 },
  totalOperatingHours: Number(r.total_operating_hours), warrantyExpiry: r.warranty_expiry,
  supplierId: r.supplier_id, supplierName: r.supplier_name,
  status: r.status, healthScore: r.health_score, criticality: r.criticality,
  notes: r.notes, createdAt: r.created_at, updatedAt: r.updated_at,
});

export function useEquipment() {
  return useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const { data, error } = await supabase.from("equipment").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapEquipment);
    },
  });
}

export function useEquipmentMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["equipment"] });
  return {
    addEquipment: useMutation({
      mutationFn: async (e: Equipment) => {
        const { error } = await supabase.from("equipment").insert({
          equipment_number: e.equipmentNumber, name: e.name, name_am: e.nameAm,
          category: e.category, manufacturer: e.manufacturer, model: e.model, serial_number: e.serialNumber,
          year_of_manufacture: e.yearOfManufacture, purchase_date: e.purchaseDate, purchase_cost: e.purchaseCost,
          location: e.location, department: e.department, power_rating: e.powerRating, capacity: e.capacity,
          maintenance_frequency: e.maintenanceFrequency as any, total_operating_hours: e.totalOperatingHours,
          warranty_expiry: e.warrantyExpiry, supplier_id: e.supplierId || null, supplier_name: e.supplierName,
          status: e.status, health_score: e.healthScore, criticality: e.criticality, notes: e.notes,
        } as any);
        if (error) throw error;
      },
      onSuccess: inv,
    }),
  };
}
