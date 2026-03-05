import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, AlertTriangle, Wrench, Trash2 } from "lucide-react";
import { sampleMaintenanceTasks } from "@/data/sampleData";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import type { MaintenanceTask } from "@/data/sampleData";

const statusColor: Record<string, string> = {
  Scheduled: 'bg-info/10 text-info',
  'In Progress': 'bg-warning/10 text-warning',
  Completed: 'bg-success/10 text-success',
  Overdue: 'bg-destructive/10 text-destructive',
};

const typeColor: Record<string, string> = {
  Preventive: 'bg-primary/10 text-primary',
  Corrective: 'bg-warning/10 text-warning',
  Predictive: 'bg-info/10 text-info',
};

export default function Maintenance() {
  const [tasks, setTasks] = useLocalStorage<MaintenanceTask[]>(STORAGE_KEYS.MAINTENANCE_TASKS, sampleMaintenanceTasks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useI18n();
  const { toast } = useToast();
  const [form, setForm] = useState({ machineName: '', type: '', scheduledDate: '', assignee: '', notes: '' });

  const overdueCount = tasks.filter(m => m.status === 'Overdue').length;

  const handleAdd = () => {
    if (!form.machineName.trim() || !form.scheduledDate) return;
    const task: MaintenanceTask = {
      id: `MT-${String(tasks.length + 1).padStart(3, '0')}`,
      machineId: `M-${String(tasks.length + 1).padStart(3, '0')}`,
      machineName: form.machineName.trim(),
      type: (form.type || 'Preventive') as MaintenanceTask['type'],
      scheduledDate: form.scheduledDate,
      status: 'Scheduled',
      assignee: form.assignee || 'Unassigned',
      notes: form.notes,
    };
    setTasks(prev => [...prev, task]);
    toast({ title: "Task Created", description: task.id });
    setForm({ machineName: '', type: '', scheduledDate: '', assignee: '', notes: '' });
    setDialogOpen(false);
  };

  const updateStatus = (id: string, status: MaintenanceTask['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    toast({ title: "Status Updated" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.maintenance')}</h1>
          <p className="text-sm text-muted-foreground">
            {tasks.length} tasks
            {overdueCount > 0 && <span className="text-destructive font-medium ml-2">· {overdueCount} overdue</span>}
          </p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Task</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map(task => (
          <Card key={task.id} className={`shadow-card ${task.status === 'Overdue' ? 'border-destructive/30' : ''}`}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className={`h-4 w-4 ${task.status === 'Overdue' ? 'text-destructive' : 'text-primary'}`} />
                  <div>
                    <p className="text-sm font-semibold">{task.machineName}</p>
                    <p className="text-[10px] text-muted-foreground">{task.machineId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[task.status]}`}>{task.status}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setTasks(prev => prev.filter(t => t.id !== task.id)); toast({ title: "Deleted" }); }}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <span className="text-muted-foreground">Type: <Badge className={`text-[10px] ${typeColor[task.type]}`}>{task.type}</Badge></span>
                <span className="text-muted-foreground">Date: <strong className="text-foreground">{task.scheduledDate}</strong></span>
                <span className="text-muted-foreground">Assignee: <strong className="text-foreground">{task.assignee}</strong></span>
              </div>
              <p className="text-[10px] text-muted-foreground border-t pt-2">{task.notes}</p>
              <div className="flex gap-1">
                {task.status === 'Scheduled' && <Button size="sm" variant="outline" className="text-[10px] h-6" onClick={() => updateStatus(task.id, 'In Progress')}>Start</Button>}
                {(task.status === 'In Progress' || task.status === 'Overdue') && <Button size="sm" variant="outline" className="text-[10px] h-6" onClick={() => updateStatus(task.id, 'Completed')}>Complete</Button>}
              </div>
              {task.status === 'Overdue' && (
                <div className="flex items-center gap-1 text-[10px] text-destructive">
                  <AlertTriangle className="h-3 w-3" />Maintenance overdue - requires immediate attention
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Maintenance Task</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><Label className="text-xs">Machine Name *</Label><Input value={form.machineName} onChange={e => setForm(p => ({ ...p, machineName: e.target.value }))} /></div>
            <div><Label className="text-xs">Type</Label><Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}><SelectTrigger><SelectValue placeholder="Preventive" /></SelectTrigger><SelectContent><SelectItem value="Preventive">Preventive</SelectItem><SelectItem value="Corrective">Corrective</SelectItem><SelectItem value="Predictive">Predictive</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs">Date *</Label><Input type="date" value={form.scheduledDate} onChange={e => setForm(p => ({ ...p, scheduledDate: e.target.value }))} /></div>
            <div><Label className="text-xs">Assignee</Label><Input value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))} /></div>
            <div><Label className="text-xs">Notes</Label><Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleAdd}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
