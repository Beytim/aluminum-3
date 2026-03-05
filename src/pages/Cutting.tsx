import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Plus, Scissors, AlertTriangle, Trash2, Calculator } from "lucide-react";
import { sampleCuttingJobs } from "@/data/sampleData";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import type { CuttingJob } from "@/data/sampleData";

const statusColor: Record<string, string> = {
  Pending: 'bg-muted text-muted-foreground',
  'In Progress': 'bg-warning/10 text-warning',
  Completed: 'bg-success/10 text-success',
};

export default function Cutting() {
  const [jobs, setJobs] = useLocalStorage<CuttingJob[]>(STORAGE_KEYS.CUTTING_JOBS, sampleCuttingJobs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [optimizerOpen, setOptimizerOpen] = useState(false);
  const { t, language } = useI18n();
  const { toast } = useToast();

  const [form, setForm] = useState({ productName: '', originalLength: '', cuts: '', assignee: '', machine: '' });
  const [optForm, setOptForm] = useState({ stockLength: '6000', requiredCuts: '' });
  const [optResult, setOptResult] = useState<{ layout: number[][]; stockNeeded: number; totalWaste: number } | null>(null);

  const totalWaste = jobs.reduce((s, j) => s + j.waste, 0);
  const avgWaste = jobs.length > 0 ? (jobs.reduce((s, j) => s + j.wastePercent, 0) / jobs.length).toFixed(1) : '0';

  const handleAdd = () => {
    if (!form.productName.trim() || !form.originalLength || !form.cuts) return;
    const cuts = form.cuts.split(',').map(c => Number(c.trim())).filter(c => c > 0);
    const originalLength = Number(form.originalLength);
    const totalCutLength = cuts.reduce((s, c) => s + c, 0);
    const waste = Math.max(0, originalLength - totalCutLength);

    const job: CuttingJob = {
      id: `CJ-${String(jobs.length + 1).padStart(3, '0')}`,
      productName: form.productName.trim(), originalLength,
      cuts, totalCuts: cuts.length, waste,
      wastePercent: Number(((waste / originalLength) * 100).toFixed(1)),
      assignee: form.assignee || 'Unassigned', machine: form.machine || 'Double Head Cutting',
      status: 'Pending',
    };
    setJobs(prev => [...prev, job]);
    toast({ title: "Cutting Job Created", description: `${job.id} - ${job.totalCuts} cuts` });
    setForm({ productName: '', originalLength: '', cuts: '', assignee: '', machine: '' });
    setDialogOpen(false);
  };

  const runOptimizer = () => {
    const stockLength = Number(optForm.stockLength);
    const required = optForm.requiredCuts.split(',').map(c => Number(c.trim())).filter(c => c > 0).sort((a, b) => b - a);
    if (!stockLength || required.length === 0) return;

    // First Fit Decreasing bin packing
    const bins: number[][] = [];
    const remaining: number[] = [];
    
    for (const cut of required) {
      let placed = false;
      for (let i = 0; i < bins.length; i++) {
        const used = bins[i].reduce((s, c) => s + c, 0);
        if (used + cut <= stockLength) {
          bins[i].push(cut);
          placed = true;
          break;
        }
      }
      if (!placed) {
        bins.push([cut]);
      }
    }

    const totalWaste = bins.reduce((s, bin) => s + (stockLength - bin.reduce((ss, c) => ss + c, 0)), 0);
    setOptResult({ layout: bins, stockNeeded: bins.length, totalWaste });
  };

  const updateStatus = (id: string, status: CuttingJob['status']) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status, ...(status === 'In Progress' ? { startTime: new Date().toISOString() } : status === 'Completed' ? { endTime: new Date().toISOString() } : {}) } : j));
    toast({ title: "Status Updated" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.cutting')}</h1>
          <p className="text-sm text-muted-foreground">{jobs.length} jobs · Avg waste: {avgWaste}% · Total waste: {totalWaste}mm</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setOptimizerOpen(true)}><Calculator className="h-3.5 w-3.5 mr-1.5" />Cut Optimizer</Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Cut Job</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {(['Pending', 'In Progress', 'Completed'] as const).map(status => (
          <Card key={status} className="shadow-card">
            <CardContent className="p-3 text-center">
              <p className="text-[10px] text-muted-foreground">{status}</p>
              <p className="text-xl font-bold">{jobs.filter(j => j.status === status).length}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Jobs Table */}
      <Card className="shadow-card">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Job #</TableHead>
                <TableHead className="text-xs">Product</TableHead>
                <TableHead className="text-xs">Original (mm)</TableHead>
                <TableHead className="text-xs">Cut List</TableHead>
                <TableHead className="text-xs text-center">Cuts</TableHead>
                <TableHead className="text-xs text-right">Waste</TableHead>
                <TableHead className="text-xs">Assignee</TableHead>
                <TableHead className="text-xs">Machine</TableHead>
                <TableHead className="text-xs">{t('common.status')}</TableHead>
                <TableHead className="text-xs text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map(job => (
                <TableRow key={job.id} className={job.wastePercent > 15 ? 'bg-warning/5' : ''}>
                  <TableCell className="text-xs font-mono font-medium">{job.id}</TableCell>
                  <TableCell className="text-xs">{job.productName}</TableCell>
                  <TableCell className="text-xs font-mono">{job.originalLength}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{job.cuts.join(', ')}</TableCell>
                  <TableCell className="text-xs text-center">{job.totalCuts}</TableCell>
                  <TableCell className="text-xs text-right">
                    <span className={job.wastePercent > 15 ? 'text-warning font-medium' : job.wastePercent === 0 ? 'text-success' : ''}>
                      {job.waste}mm ({job.wastePercent}%)
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">{job.assignee}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{job.machine}</TableCell>
                  <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[job.status]}`}>{job.status}</span></TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      {job.status === 'Pending' && <Button size="sm" variant="outline" className="text-[10px] h-6" onClick={() => updateStatus(job.id, 'In Progress')}>Start</Button>}
                      {job.status === 'In Progress' && <Button size="sm" variant="outline" className="text-[10px] h-6" onClick={() => updateStatus(job.id, 'Completed')}>Done</Button>}
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setJobs(prev => prev.filter(j => j.id !== job.id)); toast({ title: "Deleted" }); }}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Job Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Cutting Job</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><Label className="text-xs">Product Name *</Label><Input value={form.productName} onChange={e => setForm(p => ({ ...p, productName: e.target.value }))} /></div>
            <div><Label className="text-xs">Stock Length (mm) *</Label><Input type="number" value={form.originalLength} onChange={e => setForm(p => ({ ...p, originalLength: e.target.value }))} placeholder="6000" /></div>
            <div><Label className="text-xs">Assignee</Label><Input value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))} /></div>
            <div className="sm:col-span-2"><Label className="text-xs">Cut Lengths (comma-separated mm) *</Label><Input value={form.cuts} onChange={e => setForm(p => ({ ...p, cuts: e.target.value }))} placeholder="1200, 1200, 1500, 900" /></div>
            <div className="sm:col-span-2"><Label className="text-xs">Machine</Label><Input value={form.machine} onChange={e => setForm(p => ({ ...p, machine: e.target.value }))} placeholder="Double Head Cutting" /></div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleAdd}>Create Job</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cut Optimizer Dialog */}
      <Dialog open={optimizerOpen} onOpenChange={setOptimizerOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle><Calculator className="h-4 w-4 inline mr-2" />Cut Optimizer</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Stock Length (mm)</Label><Input type="number" value={optForm.stockLength} onChange={e => setOptForm(p => ({ ...p, stockLength: e.target.value }))} /></div>
            <div><Label className="text-xs">Required Cut Lengths (comma-separated mm)</Label><Input value={optForm.requiredCuts} onChange={e => setOptForm(p => ({ ...p, requiredCuts: e.target.value }))} placeholder="1200, 1200, 1500, 900, 800, 1800, 600" /></div>
            <Button onClick={runOptimizer} className="w-full">Optimize</Button>

            {optResult && (
              <div className="space-y-3 pt-3 border-t">
                <div className="grid grid-cols-3 gap-3">
                  <Card><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">Stock Needed</p><p className="text-lg font-bold text-primary">{optResult.stockNeeded} pcs</p></CardContent></Card>
                  <Card><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">Total Waste</p><p className="text-lg font-bold text-warning">{optResult.totalWaste}mm</p></CardContent></Card>
                  <Card><CardContent className="p-3 text-center"><p className="text-[10px] text-muted-foreground">Efficiency</p><p className="text-lg font-bold text-success">{(100 - (optResult.totalWaste / (Number(optForm.stockLength) * optResult.stockNeeded)) * 100).toFixed(1)}%</p></CardContent></Card>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold">Cutting Layout:</p>
                  {optResult.layout.map((bin, idx) => {
                    const used = bin.reduce((s, c) => s + c, 0);
                    const waste = Number(optForm.stockLength) - used;
                    return (
                      <div key={idx} className="p-2 border rounded-lg">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="font-medium">Stock #{idx + 1}</span>
                          <span className="text-muted-foreground">Waste: {waste}mm ({((waste / Number(optForm.stockLength)) * 100).toFixed(1)}%)</span>
                        </div>
                        <div className="flex gap-0.5 h-6 rounded overflow-hidden">
                          {bin.map((cut, ci) => (
                            <div key={ci} className="bg-primary/80 flex items-center justify-center text-[9px] text-primary-foreground font-mono" style={{ width: `${(cut / Number(optForm.stockLength)) * 100}%` }}>
                              {cut}
                            </div>
                          ))}
                          {waste > 0 && (
                            <div className="bg-destructive/20 flex items-center justify-center text-[9px] text-destructive font-mono" style={{ width: `${(waste / Number(optForm.stockLength)) * 100}%` }}>
                              {waste}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
