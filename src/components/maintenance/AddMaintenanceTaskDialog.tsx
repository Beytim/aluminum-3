import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type { EnhancedMaintenanceTask, MaintenanceType, MaintenancePriority, Equipment } from "@/data/enhancedMaintenanceData";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAdd: (t: EnhancedMaintenanceTask) => void;
  equipment: Equipment[];
  existingCount: number;
}

export function AddMaintenanceTaskDialog({ open, onOpenChange, onAdd, equipment, existingCount }: Props) {
  const [tab, setTab] = useState('basic');
  const [form, setForm] = useState({
    equipmentId: '', type: 'preventive' as MaintenanceType, priority: 'medium' as MaintenancePriority,
    title: '', description: '', scheduledDate: '', scheduledDuration: '4',
    assignee: 'Girma Assefa', assigneeId: 'EMP-007',
    requiresShutdown: false, notes: '',
  });
  const [checklist, setChecklist] = useState<{ item: string; completed: boolean }[]>([]);
  const [newCheckItem, setNewCheckItem] = useState('');

  const selectedEquipment = equipment.find(e => e.id === form.equipmentId);

  const addCheckItem = () => {
    if (!newCheckItem.trim()) return;
    setChecklist(prev => [...prev, { item: newCheckItem.trim(), completed: false }]);
    setNewCheckItem('');
  };

  const handleSubmit = () => {
    if (!form.equipmentId || !form.title.trim() || !form.scheduledDate) return;
    const num = `MT-${String(existingCount + 1).padStart(3, '0')}`;
    const task: EnhancedMaintenanceTask = {
      id: num, taskNumber: num,
      equipmentId: form.equipmentId,
      equipmentName: selectedEquipment?.name || '',
      equipmentNumber: selectedEquipment?.equipmentNumber || '',
      equipmentCategory: selectedEquipment?.category || 'hand_tools',
      type: form.type, priority: form.priority, status: 'scheduled',
      scheduledDate: form.scheduledDate, scheduledDuration: Number(form.scheduledDuration) || 4,
      title: form.title.trim(), description: form.description,
      checklist,
      assignedTo: [form.assigneeId], assignedToNames: [form.assignee], leadTechnician: form.assignee,
      partsUsed: [],
      laborHours: 0, laborRate: 150, laborCost: 0, partsCost: 0, totalCost: 0,
      isOverdue: false, isEmergency: form.type === 'emergency', requiresShutdown: form.requiresShutdown,
      followUpRequired: false, notes: form.notes,
      activityLog: [{ date: new Date().toISOString().split('T')[0], user: 'EMP-001', userName: 'Abebe Tekle', action: 'Task created' }],
      createdAt: new Date().toISOString().split('T')[0], createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onAdd(task);
    onOpenChange(false);
    setForm({ equipmentId: '', type: 'preventive', priority: 'medium', title: '', description: '', scheduledDate: '', scheduledDuration: '4', assignee: 'Girma Assefa', assigneeId: 'EMP-007', requiresShutdown: false, notes: '' });
    setChecklist([]);
    setTab('basic');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Maintenance Task</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="basic" className="text-xs">Equipment & Info</TabsTrigger>
            <TabsTrigger value="checklist" className="text-xs">Checklist</TabsTrigger>
            <TabsTrigger value="assignment" className="text-xs">Assignment</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-xs">Equipment *</Label>
                <Select value={form.equipmentId} onValueChange={v => setForm(p => ({ ...p, equipmentId: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select equipment" /></SelectTrigger>
                  <SelectContent>
                    {equipment.map(e => <SelectItem key={e.id} value={e.id}>{e.equipmentNumber} - {e.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {selectedEquipment && (
                  <p className="text-[10px] text-muted-foreground mt-1">{selectedEquipment.manufacturer} {selectedEquipment.model} · {selectedEquipment.department} · Health: {selectedEquipment.healthScore}%</p>
                )}
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Title *</Label>
                <Input className="h-8 text-xs" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g., Monthly PM - Blade Inspection" />
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as MaintenanceType }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['preventive', 'corrective', 'emergency', 'predictive', 'calibration', 'inspection', 'overhaul'] as MaintenanceType[]).map(t => (
                      <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v as MaintenancePriority }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['critical', 'high', 'medium', 'low', 'planned'] as MaintenancePriority[]).map(p => (
                      <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Scheduled Date *</Label>
                <Input type="date" className="h-8 text-xs" value={form.scheduledDate} onChange={e => setForm(p => ({ ...p, scheduledDate: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Duration (hrs)</Label>
                <Input type="number" className="h-8 text-xs" value={form.scheduledDuration} onChange={e => setForm(p => ({ ...p, scheduledDuration: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Description</Label>
                <Textarea className="text-xs" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-3 mt-3">
            <div className="flex gap-2">
              <Input className="h-8 text-xs flex-1" placeholder="Add checklist item" value={newCheckItem} onChange={e => setNewCheckItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCheckItem()} />
              <Button size="sm" className="h-8" onClick={addCheckItem}><Plus className="h-3 w-3" /></Button>
            </div>
            {checklist.length > 0 ? (
              <div className="space-y-1.5">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 border rounded-md">
                    <span className="text-xs">{item.item}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => setChecklist(prev => prev.filter((_, i) => i !== idx))}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">No checklist items</p>
            )}
          </TabsContent>

          <TabsContent value="assignment" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Lead Technician</Label>
                <Select value={form.assigneeId} onValueChange={v => {
                  const names: Record<string, string> = { 'EMP-007': 'Girma Assefa', 'EMP-008': 'Solomon Tadesse' };
                  setForm(p => ({ ...p, assigneeId: v, assignee: names[v] || v }));
                }}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMP-007">Girma Assefa (Lead Technician)</SelectItem>
                    <SelectItem value="EMP-008">Solomon Tadesse (Technician)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={form.requiresShutdown} onChange={e => setForm(p => ({ ...p, requiresShutdown: e.target.checked }))} />
                  Requires equipment shutdown
                </label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-3 mt-3">
            <div>
              <Label className="text-xs">Notes</Label>
              <Textarea className="text-xs" rows={3} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.equipmentId || !form.title.trim() || !form.scheduledDate}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
