import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// ═══ TYPES ═══

export interface Supplier {
  id: string;
  supplier_code: string;
  company_name: string;
  company_name_am: string;
  trading_name: string | null;
  business_type: string;
  contact_person: string;
  position: string | null;
  phone: string;
  phone_secondary: string | null;
  email: string;
  website: string | null;
  country: string;
  city: string | null;
  address: string | null;
  tax_id: string | null;
  payment_terms: string;
  currency: string;
  bank_name: string | null;
  bank_account: string | null;
  swift_code: string | null;
  credit_limit: number;
  credit_used: number;
  product_categories: string[];
  certifications: string[];
  rating: number;
  on_time_delivery_rate: number;
  quality_rating: number;
  response_time_hrs: number;
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  last_order_date: string | null;
  average_lead_time: number;
  min_order_qty: number | null;
  shipping_terms: string[];
  preferred: boolean;
  approved: boolean;
  status: string;
  notes: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export type SupplierInsert = Omit<Supplier, "id" | "created_at" | "updated_at">;

// ═══ STATS ═══

export interface SupplierStats {
  total: number;
  active: number;
  preferred: number;
  avgRating: number;
  avgLeadTime: number;
  totalSpent: number;
  byCountry: Record<string, number>;
  byStatus: Record<string, number>;
}

export function calculateSupplierStats(suppliers: Supplier[]): SupplierStats {
  const active = suppliers.filter(s => s.status === 'Active');
  const preferred = suppliers.filter(s => s.preferred);
  const byCountry: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  for (const s of suppliers) {
    byCountry[s.country] = (byCountry[s.country] || 0) + 1;
    byStatus[s.status] = (byStatus[s.status] || 0) + 1;
  }

  return {
    total: suppliers.length,
    active: active.length,
    preferred: preferred.length,
    avgRating: suppliers.length > 0 ? suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length : 0,
    avgLeadTime: suppliers.length > 0 ? suppliers.reduce((sum, s) => sum + s.average_lead_time, 0) / suppliers.length : 0,
    totalSpent: suppliers.reduce((sum, s) => sum + s.total_spent, 0),
    byCountry,
    byStatus,
  };
}

// ═══ HOOKS ═══

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("company_name");
      if (error) throw error;
      return (data || []) as Supplier[];
    },
  });
}

export function useAddSupplier() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (supplier: Omit<Supplier, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("suppliers")
        .insert({ ...supplier, created_by: user?.id, updated_by: user?.id } as any)
        .select()
        .single();
      if (error) throw error;
      return data as Supplier;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
      toast({ title: "Supplier Added", description: data.company_name });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Supplier> & { id: string }) => {
      const { data, error } = await supabase
        .from("suppliers")
        .update({ ...updates, updated_by: user?.id } as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Supplier;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
      toast({ title: "Updated", description: `${data.company_name} saved.` });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("suppliers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
      toast({ title: "Deleted", description: "Supplier removed." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useDeleteSuppliers() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("suppliers").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: (_, ids) => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
      toast({ title: "Deleted", description: `${ids.length} suppliers removed.` });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}
