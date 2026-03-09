import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import type { EnhancedCustomer } from "@/data/customerTypes";

type CustomerRow = Tables<"customers">;

// Map DB row to EnhancedCustomer
function mapRowToCustomer(row: CustomerRow): EnhancedCustomer {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    nameAm: row.name_am,
    contact: row.contact,
    type: row.type as EnhancedCustomer['type'],
    phone: row.phone,
    phoneSecondary: row.phone_secondary || undefined,
    email: row.email || '',
    address: row.address || '',
    shippingAddress: row.shipping_address || undefined,
    taxId: row.tax_id || undefined,
    paymentTerms: row.payment_terms || undefined,
    creditLimit: Number(row.credit_limit) || undefined,
    source: row.source || undefined,
    projects: row.projects_count || 0,
    totalValue: Number(row.total_value) || 0,
    outstanding: Number(row.outstanding) || 0,
    status: row.status as EnhancedCustomer['status'],
    notes: row.notes || undefined,
    website: row.website || undefined,
    location: row.city || row.sub_city ? {
      city: row.city || '',
      subCity: row.sub_city || '',
    } : undefined,
    healthScore: row.health_score || 100,
    healthStatus: (row.health_status as EnhancedCustomer['healthStatus']) || 'healthy',
    lastActivityDate: row.last_activity_date || undefined,
    lastActivityType: row.last_activity_type as EnhancedCustomer['lastActivityType'] || undefined,
    customerSince: row.customer_since || row.created_at.split('T')[0],
    preferredContact: row.preferred_contact as EnhancedCustomer['preferredContact'] || 'phone',
    language: row.language as EnhancedCustomer['language'] || 'en',
    tags: row.tags || [],
    segments: (row.segments || []) as EnhancedCustomer['segments'],
    referredBy: row.referred_by || undefined,
    referralCount: 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function useCustomers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all customers
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRowToCustomer);
    },
  });

  // Add customer
  const addCustomer = useMutation({
    mutationFn: async (customer: EnhancedCustomer) => {
      const { data, error } = await supabase.from('customers').insert({
        code: customer.code,
        name: customer.name,
        name_am: customer.nameAm,
        contact: customer.contact,
        type: customer.type as any,
        phone: customer.phone,
        phone_secondary: customer.phoneSecondary || null,
        email: customer.email || null,
        address: customer.address || null,
        shipping_address: customer.shippingAddress || null,
        tax_id: customer.taxId || null,
        payment_terms: customer.paymentTerms || null,
        credit_limit: customer.creditLimit || 0,
        source: customer.source || null,
        projects_count: customer.projects || 0,
        total_value: customer.totalValue || 0,
        outstanding: customer.outstanding || 0,
        status: customer.status as any,
        notes: customer.notes || null,
        website: customer.website || null,
        city: customer.location?.city || null,
        sub_city: customer.location?.subCity || null,
        health_score: customer.healthScore || 100,
        health_status: customer.healthStatus || 'healthy',
        customer_since: customer.customerSince || null,
        preferred_contact: customer.preferredContact as any,
        language: customer.language as any,
        tags: customer.tags || [],
        segments: customer.segments || [],
        referred_by: customer.referredBy || null,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: 'Customer Added', description: 'New customer created successfully.' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Update customer
  const updateCustomer = useMutation({
    mutationFn: async (customer: EnhancedCustomer) => {
      const { error } = await supabase.from('customers').update({
        name: customer.name,
        name_am: customer.nameAm,
        contact: customer.contact,
        type: customer.type as any,
        phone: customer.phone,
        phone_secondary: customer.phoneSecondary || null,
        email: customer.email || null,
        address: customer.address || null,
        shipping_address: customer.shippingAddress || null,
        tax_id: customer.taxId || null,
        payment_terms: customer.paymentTerms || null,
        credit_limit: customer.creditLimit || 0,
        source: customer.source || null,
        projects_count: customer.projects || 0,
        total_value: customer.totalValue || 0,
        outstanding: customer.outstanding || 0,
        status: customer.status as any,
        notes: customer.notes || null,
        website: customer.website || null,
        city: customer.location?.city || null,
        sub_city: customer.location?.subCity || null,
        health_score: customer.healthScore || 100,
        health_status: customer.healthStatus || 'healthy',
        preferred_contact: customer.preferredContact as any,
        language: customer.language as any,
        tags: customer.tags || [],
        segments: customer.segments || [],
        referred_by: customer.referredBy || null,
      }).eq('id', customer.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: 'Updated', description: 'Customer saved successfully.' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Delete customer
  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: 'Deleted', description: 'Customer removed.' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Bulk delete
  const bulkDelete = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('customers').delete().in('id', ids);
      if (error) throw error;
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: 'Deleted', description: `${ids.length} customers removed.` });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  // Generate next customer code
  const getNextCode = () => {
    const count = customers.length;
    return `CUS-${String(count + 1).padStart(3, '0')}`;
  };

  return {
    customers,
    isLoading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    bulkDelete,
    getNextCode,
  };
}
