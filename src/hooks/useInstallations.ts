import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EnhancedInstallation } from "@/data/enhancedInstallationData";

const mapRow = (r: any): EnhancedInstallation => ({
  id: r.id, installationNumber: r.installation_number,
  projectId: r.project_id, projectName: r.project_name,
  orderId: r.order_id, orderNumber: r.order_number,
  customerId: r.customer_id || '', customerName: r.customer_name, customerCode: r.customer_code,
  customerContact: r.customer_contact, customerPhone: r.customer_phone, customerEmail: r.customer_email,
  quoteId: r.quote_id,
  siteAddress: r.site_address, siteCity: r.site_city, siteSubCity: r.site_sub_city,
  siteContactPerson: r.site_contact_person, siteContactPhone: r.site_contact_phone,
  accessInstructions: r.access_instructions,
  items: r.items || [],
  scheduledDate: r.scheduled_date, scheduledStartTime: r.scheduled_start_time, scheduledEndTime: r.scheduled_end_time,
  estimatedDuration: Number(r.estimated_duration), actualStartDate: r.actual_start_date, actualEndDate: r.actual_end_date,
  status: r.status, priority: r.priority,
  teamLead: r.team_lead, teamLeadId: r.team_lead_id,
  teamMembers: r.team_members || [], teamSize: r.team_size, assignedVehicle: r.assigned_vehicle,
  completionNotes: r.completion_notes, customerSignature: r.customer_signature,
  completionPhotos: r.completion_photos || [], completedBy: r.completed_by, completedAt: r.completed_at,
  issues: r.issues || [], hasIssues: r.has_issues, issueCount: r.issue_count,
  weatherDelay: r.weather_delay, siteAccessDelay: r.site_access_delay, materialDelay: r.material_delay,
  delayReasons: r.delay_reasons || [], delayHours: Number(r.delay_hours || 0),
  customerRating: r.customer_rating, customerFeedback: r.customer_feedback,
  isOverdue: r.is_overdue, isToday: r.is_today, requiresFollowUp: r.requires_follow_up,
  notes: r.notes, notesAm: r.notes_am, internalNotes: r.internal_notes,
  activityLog: r.activity_log || [],
  createdAt: r.created_at, createdBy: r.created_by, createdByName: r.created_by_name,
  updatedAt: r.updated_at, updatedBy: r.updated_by, updatedByName: r.updated_by_name,
});

const toDb = (i: Partial<EnhancedInstallation>) => ({
  installation_number: i.installationNumber,
  project_id: i.projectId || null, project_name: i.projectName,
  order_id: i.orderId || null, order_number: i.orderNumber,
  customer_id: i.customerId || null, customer_name: i.customerName, customer_code: i.customerCode,
  customer_contact: i.customerContact, customer_phone: i.customerPhone, customer_email: i.customerEmail,
  quote_id: i.quoteId,
  site_address: i.siteAddress, site_city: i.siteCity, site_sub_city: i.siteSubCity,
  site_contact_person: i.siteContactPerson, site_contact_phone: i.siteContactPhone,
  access_instructions: i.accessInstructions,
  items: i.items as any,
  scheduled_date: i.scheduledDate, scheduled_start_time: i.scheduledStartTime, scheduled_end_time: i.scheduledEndTime,
  estimated_duration: i.estimatedDuration, actual_start_date: i.actualStartDate, actual_end_date: i.actualEndDate,
  status: i.status, priority: i.priority,
  team_lead: i.teamLead, team_lead_id: i.teamLeadId,
  team_members: i.teamMembers as any, team_size: i.teamSize, assigned_vehicle: i.assignedVehicle,
  completion_notes: i.completionNotes, completion_photos: i.completionPhotos as any,
  issues: i.issues as any, has_issues: i.hasIssues, issue_count: i.issueCount,
  weather_delay: i.weatherDelay, site_access_delay: i.siteAccessDelay, material_delay: i.materialDelay,
  delay_reasons: i.delayReasons, delay_hours: i.delayHours,
  customer_rating: i.customerRating, customer_feedback: i.customerFeedback,
  is_overdue: i.isOverdue, requires_follow_up: i.requiresFollowUp,
  notes: i.notes, notes_am: i.notesAm, internal_notes: i.internalNotes,
  activity_log: i.activityLog as any,
});

export function useInstallations() {
  return useQuery({
    queryKey: ["installations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("installations").select("*").order("scheduled_date", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapRow);
    },
  });
}

export function useInstallationMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["installations"] });
  return {
    addInstallation: useMutation({ mutationFn: async (i: EnhancedInstallation) => { const { error } = await supabase.from("installations").insert(toDb(i) as any); if (error) throw error; }, onSuccess: inv }),
    updateInstallation: useMutation({ mutationFn: async (i: EnhancedInstallation) => { const { error } = await supabase.from("installations").update(toDb(i) as any).eq("id", i.id); if (error) throw error; }, onSuccess: inv }),
    deleteInstallation: useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("installations").delete().eq("id", id); if (error) throw error; }, onSuccess: inv }),
  };
}
