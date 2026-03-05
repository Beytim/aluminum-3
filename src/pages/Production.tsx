import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { sampleWorkOrders } from "@/data/sampleData";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import type { WorkOrder } from "@/data/sampleData";

const stages = ['Cutting', 'Machining', 'Assembly', 'Welding', 'Glazing', 'Quality Check', 'Packaging'] as const;
const priorityColor = { High: 'bg-destructive/10 text-destructive', Medium: 'bg-warning/10 text-warning', Low: 'bg-muted text-muted-foreground' };
const stageColor: Record<string, string> = {
  Cutting: 'bg-info/10 text-info', Machining: 'bg-primary/10 text-primary', Assembly: 'bg-warning/10 text-warning',
  Welding: 'bg-destructive/10 text-destructive', Glazing: 'bg-success/10 text-success',
  'Quality Check': 'bg-info/10 text-info', Packaging: 'bg-success/10 text-success',
};

export default function Production() {
  const [workOrders, setWorkOrders] = useLocalStorage<WorkOrder[]>(STORAGE_KEYS.WORK_ORDERS, sampleWorkOrders);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useI18n();
  const { toast } = useToast();
  const [form, setForm] = useState({ productName: '', quantity: '', assignee: '', priority: '', stage: '', dueDate: '' });

  const handleAdd = () => {
    if (!form.productName.trim() || !form.quantity) return;
    const wo: WorkOrder = {
      id: `WO-${String(workOrders.length + 1).padStart(3, '0')}`,
      projectId: '', productId: '', productName: form.productName.trim(),
      quantity: Number(form.quantity), completed: 0,
      assignee: form.assignee || 'Unassigned',
      priority: (form.priority || 'Medium') as WorkOrder['priority'],
      stage: (form.stage || 'Cutting') as WorkOrder['stage'],
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      dueDate: form.dueDate || new Date().toISOString().split('T')[0],
    };
    setWorkOrders(prev => [...prev, wo]);
    toast({ title: "Work Order Created", description: wo.id });
    setForm({ productName: '', quantity: '', assignee: '', priority: '', stage: '', dueDate: '' });
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setWorkOrders(prev => prev.filter(w => w.id !== id));
    toast({ title: "Deleted" });
  };

  const advanceStage = (id: string) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== id) return wo;
      const idx = stages.indexOf(wo.stage as typeof stages[number]);
      if (idx < stages.length - 1) {
        return { ...wo, stage: stages[idx + 1], progress: Math.min(100, wo.progress + 15) };
      }
      return { ...wo, progress: 100 };
    }));
    toast({ title: "Stage Advanced" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('production.title')}</h1>
          <p className="text-sm text-muted-foreground">{workOrders.length} {t('production.work_order').toLowerCase()}s</p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Work Order</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {stages.map(stage => {
          const count = workOrders.filter(w => w.stage === stage).length;
          return (
            <Card key={stage} className="shadow-card">
              <CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground font-medium">{stage}</p>
                <p className="text-xl font-bold text-foreground mt-1">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workOrders.map(wo => (
          <Card key={wo.id} className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono font-medium">{wo.id}</p>
                  <p className="text-sm font-semibold mt-0.5">{wo.productName}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColor[wo.priority]}`}>{wo.priority}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(wo.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <span className="text-muted-foreground">Stage: <strong className="text-foreground">{wo.stage}</strong></span>
                <span className="text-muted-foreground">Team: <strong className="text-foreground">{wo.assignee}</strong></span>
                <span className="text-muted-foreground">Qty: <strong className="text-foreground">{wo.completed}/{wo.quantity}</strong></span>
                <span className="text-muted-foreground">Due: <strong className="text-foreground">{wo.dueDate}</strong></span>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{wo.progress}%</span>
                </div>
                <Progress value={wo.progress} className="h-1.5" />
              </div>
              <div className="flex justify-between items-center">
                <Badge className={`text-[10px] ${stageColor[wo.stage]}`}>{wo.stage}</Badge>
                {wo.progress < 100 && <Button size="sm" variant="outline" className="text-[10px] h-6" onClick={() => advanceStage(wo.id)}>Advance →</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Work Order</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><Label className="text-xs">Product Name *</Label><Input value={form.productName} onChange={e => setForm(p => ({ ...p, productName: e.target.value }))} /></div>
            <div><Label className="text-xs">Quantity *</Label><Input type="number" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} /></div>
            <div><Label className="text-xs">Assignee</Label><Input value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))} /></div>
            <div><Label className="text-xs">Priority</Label><Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v }))}><SelectTrigger><SelectValue placeholder="Medium" /></SelectTrigger><SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs">Stage</Label><Select value={form.stage} onValueChange={v => setForm(p => ({ ...p, stage: v }))}><SelectTrigger><SelectValue placeholder="Cutting" /></SelectTrigger><SelectContent>{stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            <div className="sm:col-span-2"><Label className="text-xs">Due Date</Label><Input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} /></div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleAdd}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
