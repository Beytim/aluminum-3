import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { enhancedSampleProjects } from "@/data/enhancedProjectData";
import { enhancedCustomers } from "@/data/enhancedCustomerData";
import type { EnhancedWorkOrder, WorkOrderPriority } from "@/data/enhancedProductionData";
import { useProducts } from "@/hooks/useProducts";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (wo: EnhancedWorkOrder) => void;
  existingCount: number;
}

export function AddWorkOrderDialog({ open, onOpenChange, onAdd, existingCount }: Props) {
  const { data: products = [] } = useProducts();
  const [form, setForm] = useState({
    projectId: '', productId: '', quantity: '',
    priority: 'Medium' as WorkOrderPriority,
    scheduledStart: new Date().toISOString().split('T')[0],
    scheduledEnd: '',
    team: '', notes: '',
  });

  const selectedProject = enhancedSampleProjects.find(p => p.id === form.projectId);
  const selectedProduct = products.find(p => p.id === form.productId);
  const customer = selectedProject ? enhancedCustomers.find(c => c.id === selectedProject.customerId) : null;

  const handleAdd = () => {
    if (!form.projectId || !form.productId || !form.quantity) return;
    const num = String(existingCount + 1).padStart(3, '0');
    const wo: EnhancedWorkOrder = {
      id: `WO-${num}`, workOrderNumber: `WO-2025-${num}`,
      projectId: form.projectId, projectName: selectedProject?.name || '', projectCode: form.projectId,
      customerId: selectedProject?.customerId, customerName: selectedProject?.customerName,
      productId: form.productId, productCode: selectedProduct?.code || '',
      productName: selectedProduct?.name || '', productNameAm: selectedProduct?.nameAm,
      productCategory: selectedProduct?.category || '', productType: selectedProduct?.productType || 'Fabricated',
      specifications: {
        profile: selectedProduct?.profile, glass: selectedProduct?.glass,
        color: selectedProduct?.colors?.[0], alloyType: selectedProduct?.alloyType, temper: selectedProduct?.temper,
      },
      quantity: Number(form.quantity), completed: 0, remaining: Number(form.quantity), scrap: 0, rework: 0, goodUnits: 0,
      createdAt: new Date().toISOString().split('T')[0],
      scheduledStart: form.scheduledStart,
      scheduledEnd: form.scheduledEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimated: {
        hours: (selectedProduct?.laborHrs || 2) * Number(form.quantity),
        laborCost: (selectedProduct?.laborHrs || 2) * Number(form.quantity) * 140,
        materialCost: (selectedProduct?.materialCost || 5000) * Number(form.quantity),
        overheadCost: Math.round((selectedProduct?.materialCost || 5000) * Number(form.quantity) * 0.05),
        totalCost: 0,
      },
      actual: { hours: 0, laborCost: 0, materialCost: 0, overheadCost: 0, totalCost: 0 },
      variances: { hoursVariance: 0, costVariance: 0, efficiency: 0, scheduleVariance: 0 },
      status: 'Scheduled', currentStage: 'Pending', priority: form.priority, progress: 0,
      stageHistory: [],
      assignedTeam: form.team || undefined, assignedWorkers: [],
      materials: [], cuttingJobs: [], qualityChecks: [], laborEntries: [], issues: [],
      notes: form.notes || undefined,
      isOverdue: false, isAtRisk: false, isBlocked: false,
      createdBy: 'EMP-001', createdByName: 'Admin', updatedBy: 'EMP-001', updatedByName: 'Admin',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    wo.estimated.totalCost = wo.estimated.laborCost + wo.estimated.materialCost + wo.estimated.overheadCost;
    onAdd(wo);
    setForm({ projectId: '', productId: '', quantity: '', priority: 'Medium', scheduledStart: new Date().toISOString().split('T')[0], scheduledEnd: '', team: '', notes: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Work Order</DialogTitle></DialogHeader>
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="text-xs">Basic Info</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs">Schedule & Team</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3 mt-3">
            <div>
              <Label className="text-xs">Project *</Label>
              <Select value={form.projectId} onValueChange={v => setForm(p => ({ ...p, projectId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                <SelectContent>
                  {enhancedSampleProjects.filter(p => p.status !== 'Completed' && p.status !== 'Cancelled').map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {p.customerName}
                      <span className="text-muted-foreground text-[10px] ml-1">({p.status})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customer && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">Customer: {customer.name}</span>
                  <Badge className={`text-[9px] ${customer.healthStatus === 'healthy' ? 'bg-success/10 text-success' : customer.healthStatus === 'attention' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
                    Health: {customer.healthScore}
                  </Badge>
                </div>
              )}
            </div>
            <div>
              <Label className="text-xs">Product *</Label>
              <Select value={form.productId} onValueChange={v => setForm(p => ({ ...p, productId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {sampleProducts.filter(p => p.status === 'Active').map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {p.category}
                      <span className="text-muted-foreground text-[10px] ml-1">(ETB {p.sellingPrice.toLocaleString()})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProduct && (
                <div className="mt-1 text-[10px] text-muted-foreground">
                  {selectedProduct.code} · {selectedProduct.profile} · {selectedProduct.laborHrs}h labor · Stock: {selectedProduct.currentStock || 0}
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
            <div>
              <Label className="text-xs">Assigned Team</Label>
              <Select value={form.team} onValueChange={v => setForm(p => ({ ...p, team: v }))}>
                <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Team Alpha">Team Alpha</SelectItem>
                  <SelectItem value="Team Beta">Team Beta</SelectItem>
                  <SelectItem value="Team Gamma">Team Gamma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-3 mt-3">
            <div><Label className="text-xs">Notes</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={4} placeholder="Special instructions..." /></div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!form.projectId || !form.productId || !form.quantity}>Create Work Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
