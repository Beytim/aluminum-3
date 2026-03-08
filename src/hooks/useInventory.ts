import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { EnhancedInventoryItem, StockMovement, InventoryCategory, ProductType, QualityStatus, ReservationStatus, MovementType } from "@/data/enhancedInventoryData";
import { enhancedSampleInventory } from "@/data/enhancedInventoryData";

// Temporary transformation functions to map between DB and frontend models
const mapDbToItem = (dbItem: any, product: any = {}): EnhancedInventoryItem => ({
  id: dbItem.id,
  itemCode: dbItem.item_code,
  productId: dbItem.product_id || '',
  productCode: product?.code || '',
  productName: product?.name || 'Unknown Product',
  productNameAm: product?.name_am || '',
  category: (product?.category as InventoryCategory) || 'Finished Product',
  productType: (product?.product_type as ProductType) || 'Fabricated',
  alloyType: product?.alloy_type,
  temper: product?.temper,
  profile: product?.profile,
  glass: product?.glass,
  color: product?.colors?.[0],
  length: product?.length,
  width: product?.width,
  thickness: product?.thickness,
  diameter: product?.diameter,
  primaryUnit: product?.unit || 'pcs',
  stock: Number(dbItem.stock) || 0,
  reserved: Number(dbItem.reserved) || 0,
  available: Number(dbItem.stock) - Number(dbItem.reserved),
  minimum: Number(product?.min_stock) || 10,
  maximum: Number(product?.max_stock) || 100,
  reorderPoint: Number(product?.min_stock) || 15,
  reorderQuantity: 20,
  warehouse: dbItem.warehouse || 'Main',
  zone: dbItem.zone || 'A',
  rack: dbItem.rack || 'R01',
  shelf: dbItem.shelf || 'S01',
  bin: dbItem.bin || 'B01',
  isRemnant: dbItem.is_remnant || false,
  batchNumber: dbItem.batch_number,
  receivedDate: dbItem.received_date || dbItem.created_at,
  age: Math.floor((new Date().getTime() - new Date(dbItem.received_date || dbItem.created_at).getTime()) / (1000 * 3600 * 24)),
  supplierId: product?.supplier_id,
  supplierName: product?.supplier_name,
  unitCost: Number(dbItem.unit_cost) || Number(product?.material_cost) || 0,
  averageCost: Number(dbItem.unit_cost) || 0,
  sellingPrice: Number(product?.selling_price) || 0,
  totalValue: (Number(dbItem.stock) || 0) * (Number(dbItem.unit_cost) || 0),
  qualityStatus: (dbItem.quality_status as QualityStatus) || 'approved',
  status: dbItem.status || 'active',
  notes: dbItem.notes,
  createdAt: dbItem.created_at,
  createdBy: dbItem.created_by || '',
  updatedAt: dbItem.updated_at,
  updatedBy: dbItem.updated_by || ''
});

export function useInventory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select(`*, products(*)`);
      
      if (error) {
        console.error('Error fetching inventory:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      return data.map(item => mapDbToItem(item, item.products));
    }
  });

  const addItem = useMutation({
    mutationFn: async (item: Partial<EnhancedInventoryItem>) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert({
          product_id: item.productId,
          item_code: item.itemCode || `INV-${Date.now()}`,
          stock: item.stock || 0,
          warehouse: item.warehouse || 'Main',
          zone: item.zone || 'A',
          rack: item.rack || 'R01',
          shelf: item.shelf || 'S01',
          unit_cost: item.unitCost || 0,
          quality_status: item.qualityStatus || 'approved',
          status: item.status || 'active',
          is_remnant: item.isRemnant || false,
          batch_number: item.batchNumber
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory_items'] });
      toast({ title: 'Success', description: 'Inventory item added.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<EnhancedInventoryItem> }) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .update({
          stock: updates.stock,
          warehouse: updates.warehouse,
          zone: updates.zone,
          rack: updates.rack,
          shelf: updates.shelf,
          unit_cost: updates.unitCost,
          quality_status: updates.qualityStatus,
          status: updates.status,
          notes: updates.notes
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory_items'] });
    }
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('inventory_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory_items'] });
      toast({ title: 'Success', description: 'Item deleted.' });
    }
  });

  const addMovement = useMutation({
    mutationFn: async (movement: Partial<StockMovement>) => {
      const { data, error } = await supabase
        .from('inventory_movements')
        .insert({
          inventory_item_id: movement.inventoryItemId,
          movement_number: movement.movementNumber || `MOV-${Date.now()}`,
          type: movement.type as any,
          quantity: movement.quantity || 0,
          previous_stock: movement.previousStock || 0,
          new_stock: movement.newStock || 0,
          notes: movement.notes
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory_items'] });
      queryClient.invalidateQueries({ queryKey: ['inventory_movements'] });
    }
  });

  return {
    inventory,
    isLoading,
    addItem: addItem.mutate,
    updateItem: updateItem.mutate,
    deleteItem: deleteItem.mutate,
    addMovement: addMovement.mutate
  };
}
