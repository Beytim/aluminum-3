import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, MapPin, Trash2 } from "lucide-react";
import { sampleInstallations } from "@/data/sampleData";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import type { Installation } from "@/data/sampleData";

const statusColor: Record<string, string> = {
  Scheduled: 'bg-info/10 text-info',
  'In Progress': 'bg-warning/10 text-warning',
  Completed: 'bg-success/10 text-success',
};

export default function InstallationPage() {
  const [installations, setInstallations] = useLocalStorage<Installation[]>(STORAGE_KEYS.INSTALLATIONS, sampleInstallations);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t, language } = useI18n();
  const { toast } = useToast();
  const [form, setForm] = useState({ projectName: '', customerName: '', address: '', scheduledDate: '', team: '', notes: '', notesAm: '' });

  const handleAdd = () => {
    if (!form.projectName.trim() || !form.scheduledDate) return;
    const inst: Installation = {
      id: `INST-${String(installations.length + 1).padStart(3, '0')}`,
      projectId: '', projectName: form.projectName.trim(),
      customerName: form.customerName.trim(), address: form.address.trim(),
      scheduledDate: form.scheduledDate, team: form.team || 'Install Team A',
      status: 'Scheduled', notes: form.notes, notesAm: form.notesAm,
    };
    setInstallations(prev => [...prev, inst]);
    toast({ title: "Installation Scheduled", description: inst.id });
    setForm({ projectName: '', customerName: '', address: '', scheduledDate: '', team: '', notes: '', notesAm: '' });
    setDialogOpen(false);
  };

  const updateStatus = (id: string, status: Installation['status']) => {
    setInstallations(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    toast({ title: "Status Updated" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.installation')}</h1>
          <p className="text-sm text-muted-foreground">{installations.length} installations</p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />Schedule Installation</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {installations.map(inst => (
          <Card key={inst.id} className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono text-muted-foreground">{inst.id}</p>
                  <h3 className="text-sm font-semibold mt-0.5">{inst.projectName}</h3>
                  <p className="text-[10px] text-muted-foreground">{inst.customerName}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[inst.status]}`}>{inst.status}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setInstallations(prev => prev.filter(i => i.id !== inst.id)); toast({ title: "Deleted" }); }}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><MapPin className="h-3 w-3" />{inst.address}</div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><Calendar className="h-3 w-3" />{inst.scheduledDate}</div>
              </div>
              <p className="text-[10px] text-muted-foreground border-t pt-2">{language === 'am' ? inst.notesAm : inst.notes}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px]">{inst.team}</Badge>
                {inst.status === 'Scheduled' && <Button size="sm" variant="outline" className="text-[10px] h-6" onClick={() => updateStatus(inst.id, 'In Progress')}>Start</Button>}
                {inst.status === 'In Progress' && <Button size="sm" variant="outline" className="text-[10px] h-6" onClick={() => updateStatus(inst.id, 'Completed')}>Complete</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Schedule Installation</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><Label className="text-xs">Project *</Label><Input value={form.projectName} onChange={e => setForm(p => ({ ...p, projectName: e.target.value }))} /></div>
            <div><Label className="text-xs">Customer</Label><Input value={form.customerName} onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} /></div>
            <div className="sm:col-span-2"><Label className="text-xs">Address</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} /></div>
            <div><Label className="text-xs">Date *</Label><Input type="date" value={form.scheduledDate} onChange={e => setForm(p => ({ ...p, scheduledDate: e.target.value }))} /></div>
            <div><Label className="text-xs">Team</Label><Input value={form.team} onChange={e => setForm(p => ({ ...p, team: e.target.value }))} placeholder="Install Team A" /></div>
            <div><Label className="text-xs">Notes (EN)</Label><Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
            <div><Label className="text-xs">ማስታወሻ (AM)</Label><Input value={form.notesAm} onChange={e => setForm(p => ({ ...p, notesAm: e.target.value }))} /></div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleAdd}>Schedule</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
