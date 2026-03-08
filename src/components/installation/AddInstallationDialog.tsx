import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import type { EnhancedInstallation, InstallationItem, InstallationPriority } from "@/data/enhancedInstallationData";
import { enhancedCustomers } from "@/data/enhancedCustomerData";
import { sampleProducts } from "@/data/sampleData";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAdd: (inst: EnhancedInstallation) => void;
  existingCount: number;
}

export function AddInstallationDialog({ open, onOpenChange, onAdd, existingCount }: Props) {
  const [tab, setTab] = useState('customer');
  const [form, setForm] = useState({
    customerId: '', projectName: '', orderId: '', siteAddress: '', siteCity: 'Addis Ababa', siteSubCity: '',
    siteContactPerson: '', siteContactPhone: '', accessInstructions: '',
    scheduledDate: '', scheduledStartTime: '', estimatedDuration: '8',
    priority: 'medium' as InstallationPriority,
    teamLead: 'Dawit Hailu', teamLeadId: 'EMP-005',
    notes: '', notesAm: '', internalNotes: '',
  });
  const [items, setItems] = useState<Partial<InstallationItem>[]>([]);

  const selectedCustomer = enhancedCustomers.find(c => c.id === form.customerId);

  const addItem = (productId: string) => {
    const p = sampleProducts.find(pr => pr.id === productId);
    if (!p || items.find(i => i.productId === productId)) return;
    setItems(prev => [...prev, { id: `II-NEW-${Date.now()}`, productId: p.id, productName: p.name, productCode: p.code, quantity: 1, installedQuantity: 0, remainingQuantity: 1, isInstalled: false }]);
  };

  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!form.customerId || !form.scheduledDate || items.length === 0) return;
    const num = `INST-${String(existingCount + 1).padStart(3, '0')}`;
    const inst: EnhancedInstallation = {
      id: num, installationNumber: num,
      customerId: form.customerId,
      customerName: selectedCustomer?.name || '',
      customerCode: selectedCustomer?.code || '',
      customerContact: selectedCustomer?.contact,
      customerPhone: selectedCustomer?.phone,
      customerEmail: selectedCustomer?.email,
      projectName: form.projectName || undefined,
      siteAddress: form.siteAddress || selectedCustomer?.address || '',
      siteCity: form.siteCity, siteSubCity: form.siteSubCity,
      siteContactPerson: form.siteContactPerson, siteContactPhone: form.siteContactPhone,
      accessInstructions: form.accessInstructions,
      items: items.map(i => ({ ...i, quantity: i.quantity || 1, installedQuantity: 0, remainingQuantity: i.quantity || 1, isInstalled: false } as InstallationItem)),
      scheduledDate: form.scheduledDate, scheduledStartTime: form.scheduledStartTime,
      estimatedDuration: Number(form.estimatedDuration) || 8,
      status: 'scheduled', priority: form.priority,
      teamLead: form.teamLead, teamLeadId: form.teamLeadId,
      teamMembers: [{ employeeId: 'EMP-005', name: 'Dawit Hailu', role: 'lead', hourlyRate: 125 }],
      teamSize: 1,
      completionPhotos: [], issues: [], hasIssues: false, issueCount: 0,
      isOverdue: false, isToday: false, requiresFollowUp: false,
      notes: form.notes, notesAm: form.notesAm, internalNotes: form.internalNotes,
      activityLog: [{ date: new Date().toISOString().split('T')[0], user: 'EMP-001', userName: 'Abebe Tekle', action: 'Installation scheduled' }],
      createdAt: new Date().toISOString().split('T')[0], createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
      updatedAt: new Date().toISOString().split('T')[0], updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
    };
    onAdd(inst);
    onOpenChange(false);
    setForm({ customerId: '', projectName: '', orderId: '', siteAddress: '', siteCity: 'Addis Ababa', siteSubCity: '', siteContactPerson: '', siteContactPhone: '', accessInstructions: '', scheduledDate: '', scheduledStartTime: '', estimatedDuration: '8', priority: 'medium', teamLead: 'Dawit Hailu', teamLeadId: 'EMP-005', notes: '', notesAm: '', internalNotes: '' });
    setItems([]);
    setTab('customer');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Schedule Installation</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="customer" className="text-xs">Customer & Site</TabsTrigger>
            <TabsTrigger value="items" className="text-xs">Items</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs">Schedule & Team</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Customer *</Label>
                <Select value={form.customerId} onValueChange={v => {
                  const c = enhancedCustomers.find(cu => cu.id === v);
                  setForm(p => ({ ...p, customerId: v, siteAddress: c?.address || p.siteAddress }));
                }}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>
                    {enhancedCustomers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Project</Label>
                <Input className="h-8 text-xs" value={form.projectName} onChange={e => setForm(p => ({ ...p, projectName: e.target.value }))} placeholder="Project name" />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Site Address *</Label>
                <Input className="h-8 text-xs" value={form.siteAddress} onChange={e => setForm(p => ({ ...p, siteAddress: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">City</Label>
                <Input className="h-8 text-xs" value={form.siteCity} onChange={e => setForm(p => ({ ...p, siteCity: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Sub City</Label>
                <Input className="h-8 text-xs" value={form.siteSubCity} onChange={e => setForm(p => ({ ...p, siteSubCity: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Site Contact Person</Label>
                <Input className="h-8 text-xs" value={form.siteContactPerson} onChange={e => setForm(p => ({ ...p, siteContactPerson: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Site Contact Phone</Label>
                <Input className="h-8 text-xs" value={form.siteContactPhone} onChange={e => setForm(p => ({ ...p, siteContactPhone: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Access Instructions</Label>
                <Textarea className="text-xs" rows={2} value={form.accessInstructions} onChange={e => setForm(p => ({ ...p, accessInstructions: e.target.value }))} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-3 mt-3">
            <div>
              <Label className="text-xs">Add Product</Label>
              <Select onValueChange={addItem}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select product to add" /></SelectTrigger>
                <SelectContent>
                  {sampleProducts.filter(p => p.status === 'Active').map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.code} - {p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {items.length > 0 ? (
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 border rounded-md">
                    <div className="flex-1">
                      <p className="text-xs font-medium">{item.productName}</p>
                      <p className="text-[10px] text-muted-foreground">{item.productCode}</p>
                    </div>
                    <div className="w-20">
                      <Input type="number" min={1} className="h-7 text-xs" value={item.quantity} onChange={e => {
                        const q = Number(e.target.value) || 1;
                        setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: q, remainingQuantity: q } : it));
                      }} />
                    </div>
                    <Input className="h-7 text-xs w-32" placeholder="Location" value={item.location || ''} onChange={e => {
                      setItems(prev => prev.map((it, i) => i === idx ? { ...it, location: e.target.value } : it));
                    }} />
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeItem(idx)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">{items.reduce((s, i) => s + (i.quantity || 0), 0)} total units</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">No items added yet</p>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Scheduled Date *</Label>
                <Input type="date" className="h-8 text-xs" value={form.scheduledDate} onChange={e => setForm(p => ({ ...p, scheduledDate: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Start Time</Label>
                <Input type="time" className="h-8 text-xs" value={form.scheduledStartTime} onChange={e => setForm(p => ({ ...p, scheduledStartTime: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Estimated Duration (hrs)</Label>
                <Input type="number" className="h-8 text-xs" value={form.estimatedDuration} onChange={e => setForm(p => ({ ...p, estimatedDuration: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v as InstallationPriority }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Team Lead</Label>
                <Input className="h-8 text-xs" value={form.teamLead} onChange={e => setForm(p => ({ ...p, teamLead: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Vehicle</Label>
                <Input className="h-8 text-xs" placeholder="e.g., Vehicle 01 - Toyota Hilux" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-3 mt-3">
            <div>
              <Label className="text-xs">Notes (EN)</Label>
              <Textarea className="text-xs" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">ማስታወሻ (AM)</Label>
              <Textarea className="text-xs" rows={2} value={form.notesAm} onChange={e => setForm(p => ({ ...p, notesAm: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Internal Notes</Label>
              <Textarea className="text-xs" rows={2} value={form.internalNotes} onChange={e => setForm(p => ({ ...p, internalNotes: e.target.value }))} placeholder="Visible to staff only" />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.customerId || !form.scheduledDate || items.length === 0}>
            Schedule Installation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
