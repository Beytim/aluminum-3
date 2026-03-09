import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/useProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EnhancedWorkOrder, WorkOrderPriority } from "@/data/enhancedProductionData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrder: EnhancedWorkOrder | null;
  onSave: (id: string, updates: Record<string, any>) => void;
}

export function EditWorkOrderDialog({ open, onOpenChange, workOrder, onSave }: Props) {
  const { data: products = [] } = useProducts();
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await supabase.from('customers').select('id, name, code').order('name');
      return data || [];
    },
  });

  const [form, setForm] = useState({
    customerId: '',
    productId: '',
    quantity: '',
    priority: 'Medium' as WorkOrderPriority,
    scheduledStart: '',
    scheduledEnd: '',
    notes: '',
    supervisorNotes: '',
  });

  useEffect(() => {
    if (workOrder) {
      setForm({
        customerId: workOrder.customerId || '',
        productId: workOrder.productId || '',
        quantity: String(workOrder.quantity),
        priority: workOrder.priority,
        scheduledStart: workOrder.scheduledStart?.split('T')[0] || '',
        scheduledEnd: workOrder.scheduledEnd?.split('T')[0] || '',
        notes: workOrder.notes || '',
        supervisorNotes: workOrder.supervisorNotes || '',
      });
    }
  }, [workOrder]);

  if (!workOrder) return null;

  const isCompleted = workOrder.status === 'Completed' || workOrder.status === 'Cancelled';

  const handleSave = () => {
    onSave(workOrder.id, {
      customer_id: form.customerId || null,
      product_id: form.productId || null,
      quantity: Number(form.quantity),
      priority: form.priority,
      scheduled_start: form.scheduledStart || null,
      scheduled_end: form.scheduledEnd || null,
      notes: form.notes || null,
      supervisor_notes: form.supervisorNotes || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {workOrder.workOrderNumber}</DialogTitle>
          <DialogDescription>Update work order details</DialogDescription>
        </DialogHeader>

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
              <Label className="text-xs">Product</Label>
              <Select value={form.productId} onValueChange={v => setForm(p => ({ ...p, productId: v }))} disabled={isCompleted}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {products.filter(p => p.status === 'Active').map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {p.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Quantity</Label>
                <Input type="number" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} disabled={isCompleted} />
              </div>
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
            <div><Label className="text-xs">Notes</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} /></div>
            <div><Label className="text-xs">Supervisor Notes</Label><Textarea value={form.supervisorNotes} onChange={e => setForm(p => ({ ...p, supervisorNotes: e.target.value }))} rows={3} /></div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
