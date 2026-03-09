import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProduction } from "@/hooks/useProduction";
import { useInventory } from "@/hooks/useInventory";
import type { EnhancedCuttingJob, WorkOrderPriority } from "@/data/enhancedProductionData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (job: Partial<EnhancedCuttingJob> & { jobNumber: string }) => void;
  existingCount: number;
}

export function AddCuttingJobDialog({ open, onOpenChange, onAdd, existingCount }: Props) {
  const { workOrders } = useProduction();
  const { inventory } = useInventory();
  
  const [form, setForm] = useState({
    workOrderId: '',
    inventoryItemId: '',
    materialName: '',
    materialCategory: 'Profile',
    alloyType: '6063',
    temper: 'T5',
    stockLength: '6000',
    stocksUsed: '1',
    cuts: '',
    assignee: '',
    machine: 'Double Head Cutting Saw',
    priority: 'Medium' as WorkOrderPriority,
    scheduledDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const selectedWO = workOrders.find(w => w.id === form.workOrderId);
  const activeWOs = workOrders.filter(w => w.status !== 'Completed' && w.status !== 'Cancelled');
  const profileInventory = inventory.filter(i => 
    i.category?.includes('Profile') || 
    i.category?.includes('Bar') || 
    i.category?.includes('Tube')
  );

  useEffect(() => {
    if (form.inventoryItemId) {
      const inv = inventory.find(i => i.id === form.inventoryItemId);
      if (inv) {
        setForm(p => ({
          ...p,
          materialName: inv.productName || inv.itemCode,
          materialCategory: inv.category || 'Profile',
        }));
      }
    }
  }, [form.inventoryItemId, inventory]);

  const handleSubmit = () => {
    if (!form.materialName.trim() || !form.stockLength || !form.cuts) return;
    const cuts = form.cuts.split(',').map(c => Number(c.trim())).filter(c => c > 0);
    const stockLength = Number(form.stockLength);
    const stocksUsed = Number(form.stocksUsed) || 1;
    const totalCutLength = cuts.reduce((s, c) => s + c, 0);
    const totalStock = stockLength * stocksUsed;
    const waste = Math.max(0, totalStock - totalCutLength);
    
    const year = new Date().getFullYear();
    const num = String(existingCount + 1).padStart(3, '0');

    const job: Partial<EnhancedCuttingJob> & { jobNumber: string } = {
      jobNumber: `CJ-${year}-${num}`,
      workOrderId: form.workOrderId || undefined,
      inventoryItemId: form.inventoryItemId || undefined,
      materialName: form.materialName.trim(),
      materialCategory: form.materialCategory,
      alloyType: form.alloyType || undefined,
      temper: form.temper || undefined,
      stockLength,
      stocksUsed,
      cuts,
      totalCuts: cuts.length,
      totalCutLength,
      waste,
      wastePercent: Number(((waste / totalStock) * 100).toFixed(1)),
      efficiency: Number(((totalCutLength / totalStock) * 100).toFixed(1)),
      remnants: waste > 200 ? [{ length: waste, reusable: true }] : waste > 0 ? [{ length: waste, reusable: false }] : [],
      machine: form.machine,
      scheduledDate: form.scheduledDate,
      materialCost: totalStock * 0.085,
      wasteCost: waste * 0.085,
      laborCost: 345,
      priority: form.priority,
      notes: form.notes || undefined,
    };

    onAdd(job);
    onOpenChange(false);
    setForm({
      workOrderId: '', inventoryItemId: '', materialName: '', materialCategory: 'Profile', 
      alloyType: '6063', temper: 'T5', stockLength: '6000', stocksUsed: '1', cuts: '', 
      assignee: '', machine: 'Double Head Cutting Saw', priority: 'Medium', 
      scheduledDate: new Date().toISOString().split('T')[0], notes: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Cutting Job</DialogTitle></DialogHeader>

        <Tabs defaultValue="basic" className="mt-2">
          <TabsList className="h-8 w-full">
            <TabsTrigger value="basic" className="text-xs flex-1">Basic Info</TabsTrigger>
            <TabsTrigger value="material" className="text-xs flex-1">Material</TabsTrigger>
            <TabsTrigger value="cuts" className="text-xs flex-1">Cuts</TabsTrigger>
            <TabsTrigger value="assignment" className="text-xs flex-1">Assignment</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3 mt-3">
            <div>
              <Label className="text-xs">Link to Work Order</Label>
              <Select value={form.workOrderId} onValueChange={v => {
                const wo = workOrders.find(w => w.id === v);
                setForm(p => ({
                  ...p,
                  workOrderId: v,
                  materialName: p.materialName || (wo ? `${wo.specifications.profile || wo.productName} Profile` : ''),
                }));
              }}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select work order (optional)" /></SelectTrigger>
                <SelectContent>
                  {activeWOs.map(w => (
                    <SelectItem key={w.id} value={w.id}>
                      <span className="font-mono text-xs">{w.workOrderNumber}</span> — {w.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedWO && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  Customer: {selectedWO.customerName || '—'} · Qty: {selectedWO.quantity}
                </p>
              )}
            </div>
            <div>
              <Label className="text-xs">Priority *</Label>
              <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v as WorkOrderPriority }))}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['Low', 'Medium', 'High', 'Urgent'] as WorkOrderPriority[]).map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Scheduled Date</Label>
              <Input type="date" value={form.scheduledDate} onChange={e => setForm(p => ({ ...p, scheduledDate: e.target.value }))} className="h-9" />
            </div>
          </TabsContent>

          <TabsContent value="material" className="space-y-3 mt-3">
            <div>
              <Label className="text-xs">Select from Inventory</Label>
              <Select value={form.inventoryItemId} onValueChange={v => setForm(p => ({ ...p, inventoryItemId: v }))}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select inventory item (optional)" /></SelectTrigger>
                <SelectContent>
                  {profileInventory.map(i => (
                    <SelectItem key={i.id} value={i.id}>
                      <span className="font-mono text-xs">{i.itemCode}</span> — {i.productName} ({i.stock} {i.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Material Name *</Label>
              <Input value={form.materialName} onChange={e => setForm(p => ({ ...p, materialName: e.target.value }))} placeholder="e.g. Window Frame Profile 6063" className="h-9" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Category</Label>
                <Select value={form.materialCategory} onValueChange={v => setForm(p => ({ ...p, materialCategory: v }))}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Profile">Profile</SelectItem>
                    <SelectItem value="Sheet">Sheet</SelectItem>
                    <SelectItem value="Glass">Glass</SelectItem>
                    <SelectItem value="Tube">Tube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Alloy</Label>
                <Select value={form.alloyType} onValueChange={v => setForm(p => ({ ...p, alloyType: v }))}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6063">6063</SelectItem>
                    <SelectItem value="6061">6061</SelectItem>
                    <SelectItem value="6060">6060</SelectItem>
                    <SelectItem value="5052">5052</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Stock Length (mm) *</Label>
                <Input type="number" value={form.stockLength} onChange={e => setForm(p => ({ ...p, stockLength: e.target.value }))} className="h-9" />
              </div>
              <div>
                <Label className="text-xs">Stocks Used</Label>
                <Input type="number" value={form.stocksUsed} onChange={e => setForm(p => ({ ...p, stocksUsed: e.target.value }))} min="1" className="h-9" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cuts" className="space-y-3 mt-3">
            <div>
              <Label className="text-xs">Cut Lengths (comma-separated mm) *</Label>
              <Textarea
                value={form.cuts}
                onChange={e => setForm(p => ({ ...p, cuts: e.target.value }))}
                placeholder="1200, 1200, 1500, 900, 800, 1800"
                className="min-h-[80px] text-sm font-mono"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Enter each required cut length separated by commas</p>
            </div>
            {form.cuts && (
              <div className="p-3 border rounded-lg bg-muted/30 space-y-1">
                <p className="text-xs font-medium">Preview</p>
                {(() => {
                  const cuts = form.cuts.split(',').map(c => Number(c.trim())).filter(c => c > 0);
                  const total = cuts.reduce((s, c) => s + c, 0);
                  const stock = Number(form.stockLength) * (Number(form.stocksUsed) || 1);
                  const waste = Math.max(0, stock - total);
                  return (
                    <>
                      <p className="text-[10px] text-muted-foreground">Cuts: {cuts.length} · Total: {total}mm · Stock: {stock}mm · Waste: {waste}mm ({((waste / stock) * 100).toFixed(1)}%)</p>
                      <div className="flex gap-px h-5 rounded overflow-hidden border border-border mt-1">
                        {cuts.map((cut, ci) => (
                          <div key={ci} className="bg-primary/70 flex items-center justify-center text-[7px] text-primary-foreground font-mono" style={{ width: `${(cut / stock) * 100}%` }}>
                            {cut >= 300 ? cut : ''}
                          </div>
                        ))}
                        {waste > 0 && <div className="bg-destructive/20 flex items-center justify-center text-[7px] text-destructive font-mono" style={{ width: `${(waste / stock) * 100}%` }}>{waste}</div>}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </TabsContent>

          <TabsContent value="assignment" className="space-y-3 mt-3">
            <div>
              <Label className="text-xs">Machine</Label>
              <Select value={form.machine} onValueChange={v => setForm(p => ({ ...p, machine: v }))}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Double Head Cutting Saw">Double Head Cutting Saw</SelectItem>
                  <SelectItem value="CNC Router">CNC Router</SelectItem>
                  <SelectItem value="Manual Mitre Saw">Manual Mitre Saw</SelectItem>
                  <SelectItem value="Glass Cutting Table">Glass Cutting Table</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Operator</Label>
              <Input value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))} placeholder="Operator name" className="h-9" />
            </div>
            <div>
              <Label className="text-xs">Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Additional instructions..." className="min-h-[60px]" />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.materialName.trim() || !form.cuts}>Create Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
