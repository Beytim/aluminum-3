import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/useProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { WorkOrderPriority } from "@/data/enhancedProductionData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (wo: any) => void;
  existingCount: number;
}

export function AddWorkOrderDialog({ open, onOpenChange, onAdd, existingCount }: Props) {
  const { data: products = [] } = useProducts();
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await supabase.from('customers').select('id, name, code').order('name');
      return data || [];
    },
  });

  const [form, setForm] = useState({
    customerId: '', productId: '', quantity: '',
    priority: 'Medium' as WorkOrderPriority,
    scheduledStart: new Date().toISOString().split('T')[0],
    scheduledEnd: '',
    notes: '',
  });

  const selectedProduct = products.find(p => p.id === form.productId);
  const selectedCustomer = customers.find(c => c.id === form.customerId);

  const handleAdd = () => {
    if (!form.productId || !form.quantity) return;
    const num = String(existingCount + 1).padStart(3, '0');
    const qty = Number(form.quantity);
    const estHours = (selectedProduct?.labor_hrs || 2) * qty;
    const estLaborCost = estHours * 140;
    const estMaterialCost = (selectedProduct?.material_cost || 5000) * qty;
    const estOverheadCost = Math.round(estMaterialCost * 0.05);

    onAdd({
      workOrderNumber: `WO-2025-${num}`,
      customerId: form.customerId || null,
      productId: form.productId,
      quantity: qty,
      scheduledStart: form.scheduledStart,
      scheduledEnd: form.scheduledEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimated: {
        hours: estHours,
        laborCost: estLaborCost,
        materialCost: estMaterialCost,
        overheadCost: estOverheadCost,
        totalCost: estLaborCost + estMaterialCost + estOverheadCost,
      },
      status: 'Scheduled',
      currentStage: 'Pending',
      priority: form.priority,
      notes: form.notes || null,
    });
    setForm({ customerId: '', productId: '', quantity: '', priority: 'Medium', scheduledStart: new Date().toISOString().split('T')[0], scheduledEnd: '', notes: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Work Order</DialogTitle></DialogHeader>
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="text-xs">Basic Info</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs">Schedule</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3 mt-3">
            <div>
              <Label className="text-xs">Customer</Label>
              <Select value={form.customerId} onValueChange={v => setForm(p => ({ ...p, customerId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select customer (optional)" /></SelectTrigger>
                <SelectContent>
                  {customers.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} ({c.code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Product *</Label>
              <Select value={form.productId} onValueChange={v => setForm(p => ({ ...p, productId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {products.filter(p => p.status === 'Active').map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {p.category}
                      <span className="text-muted-foreground text-[10px] ml-1">(ETB {p.selling_price?.toLocaleString()})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProduct && (
                <div className="mt-1 text-[10px] text-muted-foreground">
                  {selectedProduct.code} · {selectedProduct.profile} · {selectedProduct.labor_hrs}h labor · Stock: {selectedProduct.current_stock || 0}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Quantity *</Label><Input type="number" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} placeholder="Enter qty" /></div>
              <div>
                <Label className="text-xs">Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v as WorkOrderPriority }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['Low', 'Medium', 'High', 'Urgent', 'Critical'] as WorkOrderPriority[]).map(pr => (
                      <SelectItem key={pr} value={pr}>{pr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Scheduled Start</Label><Input type="date" value={form.scheduledStart} onChange={e => setForm(p => ({ ...p, scheduledStart: e.target.value }))} /></div>
              <div><Label className="text-xs">Scheduled End</Label><Input type="date" value={form.scheduledEnd} onChange={e => setForm(p => ({ ...p, scheduledEnd: e.target.value }))} /></div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-3 mt-3">
            <div><Label className="text-xs">Notes</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={4} placeholder="Special instructions..." /></div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!form.productId || !form.quantity}>Create Work Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
