import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// ═══ TYPES ═══

export interface Product {
  id: string;
  code: string;
  name: string;
  name_am: string;
  category: string;
  subcategory: string;
  product_type: string;
  status: string;
  profile: string;
  glass: string;
  colors: string[];
  alloy_type: string | null;
  temper: string | null;
  form: string | null;
  width: number | null;
  length: number | null;
  height: number | null;
  thickness: number | null;
  diameter: number | null;
  wall_thickness: number | null;
  weight_per_meter: number | null;
  weight_per_piece: number | null;
  labor_hrs: number;
  unit: string;
  profile_cost: number;
  glass_cost: number;
  hardware_cost: number;
  accessories_cost: number;
  fab_labor_cost: number;
  install_labor_cost: number;
  overhead_percent: number;
  material_cost: number;
  selling_price: number;
  purchase_price: number | null;
  markup_percent: number | null;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  reserved_stock: number;
  warehouse_location: string | null;
  supplier_id: string | null;
  supplier_name: string | null;
  lead_time_days: number | null;
  moq: number | null;
  inspection_required: boolean;
  defect_rate: number | null;
  version: string;
  effective_date: string | null;
  batch_number: string | null;
  mill_certificate: boolean | null;
  date_received: string | null;
  tags: string[];
  notes: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductBOM {
  id: string;
  product_id: string;
  component_type: string;
  name: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  total: number;
  inventory_item_id: string | null;
  sort_order: number;
}

export interface ProductPriceHistory {
  id: string;
  product_id: string;
  selling_price: number;
  cost_price: number;
  changed_by: string | null;
  changed_by_name: string;
  reason: string | null;
  created_at: string;
}

export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at">;

// ═══ HELPERS ═══

export function calcTotalCost(p: Product): number {
  const sub = p.profile_cost + p.glass_cost + p.hardware_cost + p.accessories_cost + p.fab_labor_cost + p.install_labor_cost;
  const tc = sub + (sub * (p.overhead_percent / 100));
  return tc > 0 ? tc : p.material_cost;
}

export function calcMargin(p: Product): number {
  const cost = calcTotalCost(p);
  return p.selling_price > 0 ? ((p.selling_price - cost) / p.selling_price) * 100 : 0;
}

export function formatETBShort(amount: number): string {
  if (amount >= 1_000_000) return `ETB ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `ETB ${(amount / 1_000).toFixed(0)}K`;
  return `ETB ${amount}`;
}

// ═══ STATS ═══

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockCount: number;
  criticalStockCount: number;
  totalInventoryValue: number;
  totalRevenuePotential: number;
  avgMargin: number;
  byType: Record<string, { count: number; margin: number }>;
  byCategory: Record<string, number>;
  topMarginProducts: { name: string; margin: number }[];
  lowMarginProducts: { name: string; margin: number }[];
}

export function calculateProductStats(products: Product[]): ProductStats {
  const active = products.filter(p => p.status === 'Active');
  const lowStock = products.filter(p => p.current_stock <= p.min_stock && p.current_stock > 0);
  const criticalStock = products.filter(p => p.current_stock <= p.min_stock * 0.5);

  const byType: Record<string, { count: number; margin: number }> = {};
  const byCategory: Record<string, number> = {};

  for (const p of products) {
    if (!byType[p.product_type]) byType[p.product_type] = { count: 0, margin: 0 };
    byType[p.product_type].count++;
    byType[p.product_type].margin += calcMargin(p);
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  }

  for (const key of Object.keys(byType)) {
    if (byType[key].count > 0) byType[key].margin /= byType[key].count;
  }

  const margins = products.map(p => ({ name: p.name, margin: calcMargin(p) })).sort((a, b) => b.margin - a.margin);

  return {
    totalProducts: products.length,
    activeProducts: active.length,
    inactiveProducts: products.length - active.length,
    lowStockCount: lowStock.length,
    criticalStockCount: criticalStock.length,
    totalInventoryValue: products.reduce((s, p) => s + calcTotalCost(p) * p.current_stock, 0),
    totalRevenuePotential: products.reduce((s, p) => s + p.selling_price * p.current_stock, 0),
    avgMargin: products.length > 0 ? products.reduce((s, p) => s + calcMargin(p), 0) / products.length : 0,
    byType,
    byCategory,
    topMarginProducts: margins.slice(0, 5),
    lowMarginProducts: margins.slice(-5).reverse(),
  };
}

// ═══ HOOKS ═══

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, inventory_items(stock, reserved)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      
      return (data || []).map((p: any) => {
        const isRawMaterial = p.product_type === 'Raw Material';
        const hasInventoryItems = p.inventory_items && p.inventory_items.length > 0;
        
        // For Raw Materials, we pull stock from inventory_items
        // For Finished Goods, we always use the isolated current_stock on the product
        const calculatedStock = (isRawMaterial && hasInventoryItems)
          ? p.inventory_items.reduce((sum: number, item: any) => sum + (Number(item.stock) || 0), 0) 
          : p.current_stock;
          
        const calculatedReserved = (isRawMaterial && hasInventoryItems)
          ? p.inventory_items.reduce((sum: number, item: any) => sum + (Number(item.reserved) || 0), 0) 
          : p.reserved_stock;
        
        const { inventory_items, ...rest } = p;
        return {
          ...rest,
          current_stock: calculatedStock,
          reserved_stock: calculatedReserved
        };
      }) as Product[];
    },
  });
}

export function useProductBOM(productId: string | null) {
  return useQuery({
    queryKey: ["product_bom", productId],
    enabled: !!productId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_bom")
        .select("*")
        .eq("product_id", productId!)
        .order("sort_order");
      if (error) throw error;
      return (data || []) as ProductBOM[];
    },
  });
}

export function useProductPriceHistory(productId: string | null) {
  return useQuery({
    queryKey: ["product_price_history", productId],
    enabled: !!productId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_price_history")
        .select("*")
        .eq("product_id", productId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as ProductPriceHistory[];
    },
  });
}

export function useAddProduct() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("products")
        .insert({ ...product, created_by: user?.id, updated_by: user?.id } as any)
        .select()
        .single();
      if (error) throw error;
      return data as Product;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product Added", description: data.name });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update({ ...updates, updated_by: user?.id } as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Product;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Updated", description: `${data.name} saved.` });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Deleted", description: "Product removed." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useDeleteProducts() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("products").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: (_, ids) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Deleted", description: `${ids.length} products removed.` });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

// ═══ BOM Mutations ═══

export function useSaveBOM() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, bom }: { productId: string; bom: Omit<ProductBOM, "id" | "product_id">[] }) => {
      // Delete existing BOM
      await supabase.from("product_bom").delete().eq("product_id", productId);
      // Insert new
      if (bom.length > 0) {
        const { error } = await supabase.from("product_bom").insert(
          bom.map((b, i) => ({ ...b, product_id: productId, sort_order: i })) as any
        );
        if (error) throw error;
      }
    },
    onSuccess: (_, { productId }) => {
      qc.invalidateQueries({ queryKey: ["product_bom", productId] });
    },
  });
}
