import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Plus, Scissors, Trash2, Calculator, LayoutGrid, List, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import { enhancedSampleCuttingJobs, calculateCuttingStats, formatETBShort, formatETBFull } from "@/data/enhancedProductionData";
import type { EnhancedCuttingJob, WorkOrderPriority } from "@/data/enhancedProductionData";
import { enhancedSampleWorkOrders } from "@/data/enhancedProductionData";

const statusColor: Record<string, string> = {
  Pending: 'bg-muted text-muted-foreground',
  'In Progress': 'bg-warning/10 text-warning',
  Completed: 'bg-success/10 text-success',
  Cancelled: 'bg-destructive/10 text-destructive',
};

export default function Cutting() {
  const [jobs, setJobs] = useLocalStorage<EnhancedCuttingJob[]>(STORAGE_KEYS.CUTTING_JOBS, enhancedSampleCuttingJobs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [optimizerOpen, setOptimizerOpen] = useState(false);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { t } = useI18n();
  const { toast } = useToast();

  const [form, setForm] = useState({ workOrderId: '', materialName: '', stockLength: '6000', cuts: '', assignee: '', machine: 'Double Head Cutting Saw' });
  const [optForm, setOptForm] = useState({ stockLength: '6000', requiredCuts: '' });
  const [optResult, setOptResult] = useState<{ layout: number[][]; stockNeeded: number; totalWaste: number } | null>(null);

  const stats = useMemo(() => calculateCuttingStats(jobs), [jobs]);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];
    if (statusFilter !== 'all') result = result.filter(j => j.status === statusFilter);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(j => j.jobNumber.toLowerCase().includes(s) || j.materialName.toLowerCase().includes(s) || (j.projectName || '').toLowerCase().includes(s) || (j.workOrderNumber || '').toLowerCase().includes(s));
    }
    return result;
  }, [jobs, statusFilter, search]);

  const handleAdd = () => {
    if (!form.materialName.trim() || !form.stockLength || !form.cuts) return;
    const cuts = form.cuts.split(',').map(c => Number(c.trim())).filter(c => c > 0);
    const stockLength = Number(form.stockLength);
    const totalCutLength = cuts.reduce((s, c) => s + c, 0);
    const waste = Math.max(0, stockLength - totalCutLength);
    const num = String(jobs.length + 1).padStart(3, '0');
    const selectedWO = enhancedSampleWorkOrders.find(w => w.id === form.workOrderId);

    const job: EnhancedCuttingJob = {
      id: `CJ-${num}`, jobNumber: `CJ-2025-${num}`,
      workOrderId: form.workOrderId || undefined, workOrderNumber: selectedWO?.workOrderNumber,
      projectId: selectedWO?.projectId, projectName: selectedWO?.projectName,
      customerId: selectedWO?.customerId, customerName: selectedWO?.customerName,
      materialCode: '', materialName: form.materialName.trim(), materialCategory: 'Profile',
      stockLength, stocksUsed: 1,
      cuts, totalCuts: cuts.length, totalCutLength, waste,
      wastePercent: Number(((waste / stockLength) * 100).toFixed(1)),
      optimized: false, efficiency: Number(((totalCutLength / stockLength) * 100).toFixed(1)),
      remnants: waste > 200 ? [{ length: waste, reusable: true }] : waste > 0 ? [{ length: waste, reusable: false }] : [],
      assignee: form.assignee || 'Unassigned', machine: form.machine || 'Double Head Cutting Saw',
      materialCost: stockLength * 0.085, wasteCost: waste * 0.085, laborCost: 345,
      totalCost: stockLength * 0.085 + 345,
      status: 'Pending', priority: 'Medium' as WorkOrderPriority,
      qualityChecked: false,
      createdAt: new Date().toISOString().split('T')[0], createdBy: 'EMP-001',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setJobs(prev => [...prev, job]);
    toast({ title: "Cutting Job Created", description: `${job.jobNumber} - ${job.totalCuts} cuts` });
    setForm({ workOrderId: '', materialName: '', stockLength: '6000', cuts: '', assignee: '', machine: 'Double Head Cutting Saw' });
    setDialogOpen(false);
  };

  const updateStatus = (id: string, status: EnhancedCuttingJob['status']) => {
    setJobs(prev => prev.map(j => j.id === id ? {
      ...j, status,
      startTime: status === 'In Progress' ? new Date().toISOString() : j.startTime,
      endTime: status === 'Completed' ? new Date().toISOString() : j.endTime,
      updatedAt: new Date().toISOString().split('T')[0],
    } : j));
    toast({ title: "Status Updated" });
  };

  const runOptimizer = () => {
    const stockLength = Number(optForm.stockLength);
    const required = optForm.requiredCuts.split(',').map(c => Number(c.trim())).filter(c => c > 0).sort((a, b) => b - a);
    if (!stockLength || required.length === 0) return;
    const bins: number[][] = [];
    for (const cut of required) {
      let placed = false;
      for (let i = 0; i < bins.length; i++) {
        const used = bins[i].reduce((s, c) => s + c, 0);
        if (used + cut <= stockLength) { bins[i].push(cut); placed = true; break; }
      }
      if (!placed) bins.push([cut]);
    }
    const totalWaste = bins.reduce((s, bin) => s + (stockLength - bin.reduce((ss, c) => ss + c, 0)), 0);
    setOptResult({ layout: bins, stockNeeded: bins.length, totalWaste });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.cutting')}</h1>
          <p className="text-sm text-muted-foreground">{filteredJobs.length} of {jobs.length} cutting jobs · Avg waste: {stats.averageWastePercent}%</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setOptimizerOpen(true)}><Calculator className="h-3.5 w-3.5 mr-1.5" />Cut Optimizer</Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Cut Job</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {[
          { label: 'Total Jobs', value: stats.totalJobs, color: 'text-foreground' },
          { label: 'Pending', value: stats.pendingJobs, color: 'text-muted-foreground' },
          { label: 'In Progress', value: stats.inProgressJobs, color: 'text-warning' },
          { label: 'Completed', value: stats.completedJobs, color: 'text-success' },
          { label: 'Avg Efficiency', value: `${stats.averageEfficiency}%`, color: stats.averageEfficiency >= 90 ? 'text-success' : 'text-warning' },
          { label: 'Total Waste', value: `${stats.totalWaste}mm`, color: 'text-destructive' },
          { label: 'Waste Cost', value: formatETBShort(stats.totalWasteCost), color: 'text-destructive' },
          { label: 'Remnants', value: `${stats.reusableRemnants}/${stats.remnantsCreated}`, color: 'text-info' },
        ].map((s, i) => (
          <Card key={i} className="shadow-card"><CardContent className="p-3 text-center">
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {['all', 'Pending', 'In Progress', 'Completed'].map(st => (
          <Button key={st} variant={statusFilter === st ? 'default' : 'outline'} size="sm" className="text-xs h-7" onClick={() => setStatusFilter(st)}>
            {st === 'all' ? 'All' : st}
          </Button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 w-48 text-xs" />
        </div>
        <div className="flex border rounded-md">
          <Button variant={view === 'table' ? 'default' : 'ghost'} size="icon" className="h-8 w-8 rounded-r-none" onClick={() => setView('table')}><List className="h-3.5 w-3.5" /></Button>
          <Button variant={view === 'grid' ? 'default' : 'ghost'} size="icon" className="h-8 w-8 rounded-l-none" onClick={() => setView('grid')}><LayoutGrid className="h-3.5 w-3.5" /></Button>
        </div>
      </div>

      {/* Table View */}
      {view === 'table' && (
        <Card className="shadow-card">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Job #</TableHead>
                  <TableHead className="text-xs">Material</TableHead>
                  <TableHead className="text-xs">Work Order</TableHead>
                  <TableHead className="text-xs">Project</TableHead>
                  <TableHead className="text-xs text-center">Cuts</TableHead>
                  <TableHead className="text-xs text-right">Stock (mm)</TableHead>
                  <TableHead className="text-xs text-right">Waste</TableHead>
                  <TableHead className="text-xs text-right">Efficiency</TableHead>
                  <TableHead className="text-xs">Machine</TableHead>
                  <TableHead className="text-xs">Assignee</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Cost</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map(job => (
                  <TableRow key={job.id} className={job.wastePercent > 15 ? 'bg-warning/5' : ''}>
                    <TableCell className="text-xs font-mono font-medium">{job.jobNumber}</TableCell>
                    <TableCell className="text-xs max-w-[120px] truncate">{job.materialName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{job.workOrderNumber || '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[100px] truncate">{job.projectName || '—'}</TableCell>
                    <TableCell className="text-xs text-center">{job.totalCuts}</TableCell>
                    <TableCell className="text-xs text-right font-mono">{job.stockLength}×{job.stocksUsed}</TableCell>
                    <TableCell className="text-xs text-right">
                      <span className={job.wastePercent > 15 ? 'text-warning font-medium' : job.wastePercent === 0 ? 'text-success' : ''}>{job.waste}mm ({job.wastePercent}%)</span>
                    </TableCell>
                    <TableCell className="text-xs text-right">
                      <span className={job.efficiency >= 95 ? 'text-success font-medium' : job.efficiency >= 85 ? 'text-foreground' : 'text-warning'}>{job.efficiency}%</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{job.machine}</TableCell>
                    <TableCell className="text-xs">{job.assignee}</TableCell>
                    <TableCell><Badge className={`text-[10px] ${statusColor[job.status]}`}>{job.status}</Badge></TableCell>
                    <TableCell className="text-xs text-right font-mono">{formatETBShort(job.totalCost)}</TableCell>
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
      )}

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map(job => (
            <Card key={job.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-mono font-medium">{job.jobNumber}</p>
                    <p className="text-sm font-semibold">{job.materialName}</p>
                    {job.projectName && <p className="text-[10px] text-muted-foreground">{job.projectName}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={`text-[10px] ${statusColor[job.status]}`}>{job.status}</Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setJobs(prev => prev.filter(j => j.id !== job.id)); toast({ title: "Deleted" }); }}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <span className="text-muted-foreground">Cuts: <strong className="text-foreground">{job.totalCuts}</strong></span>
                  <span className="text-muted-foreground">Stock: <strong className="text-foreground">{job.stockLength}×{job.stocksUsed}</strong></span>
                  <span className="text-muted-foreground">Waste: <strong className={job.wastePercent > 15 ? 'text-warning' : 'text-foreground'}>{job.waste}mm ({job.wastePercent}%)</strong></span>
                  <span className="text-muted-foreground">Eff: <strong className={job.efficiency >= 95 ? 'text-success' : 'text-foreground'}>{job.efficiency}%</strong></span>
                </div>
                {job.remnants.length > 0 && (
                  <div className="text-[10px] text-muted-foreground">
                    Remnants: {job.remnants.map((r, i) => <span key={i} className={r.reusable ? 'text-success' : 'text-destructive'}>{r.length}mm{r.reusable ? ' ✓' : ''}{i < job.remnants.length - 1 ? ', ' : ''}</span>)}
                  </div>
                )}
                <div className="text-[10px] text-muted-foreground">
                  Cost: <strong className="text-foreground">{formatETBShort(job.totalCost)}</strong> · {job.machine} · {job.assignee}
                </div>
                {/* Cut visualization */}
                <div className="flex gap-0.5 h-4 rounded overflow-hidden">
                  {job.cuts.map((cut, ci) => (
                    <div key={ci} className="bg-primary/70 flex items-center justify-center text-[7px] text-primary-foreground font-mono" style={{ width: `${(cut / (job.stockLength * job.stocksUsed)) * 100}%` }}>
                      {cut}
                    </div>
                  ))}
                  {job.waste > 0 && (
                    <div className="bg-destructive/20 flex items-center justify-center text-[7px] text-destructive font-mono" style={{ width: `${(job.waste / (job.stockLength * job.stocksUsed)) * 100}%` }}>
                      {job.waste}
                    </div>
                  )}
                </div>
                {job.status === 'Pending' && <Button size="sm" variant="outline" className="text-[10px] h-6 w-full" onClick={() => updateStatus(job.id, 'In Progress')}>Start Cutting</Button>}
                {job.status === 'In Progress' && <Button size="sm" variant="outline" className="text-[10px] h-6 w-full" onClick={() => updateStatus(job.id, 'Completed')}>Mark Complete</Button>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Job Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Cutting Job</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <Label className="text-xs">Work Order (optional)</Label>
              <Select value={form.workOrderId} onValueChange={v => setForm(p => ({ ...p, workOrderId: v }))}>
                <SelectTrigger><SelectValue placeholder="Link to work order" /></SelectTrigger>
                <SelectContent>
                  {enhancedSampleWorkOrders.filter(w => w.status !== 'Completed').map(w => (
                    <SelectItem key={w.id} value={w.id}>{w.workOrderNumber} — {w.productName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2"><Label className="text-xs">Material *</Label><Input value={form.materialName} onChange={e => setForm(p => ({ ...p, materialName: e.target.value }))} placeholder="e.g. Window Frame Profile 6063" /></div>
            <div><Label className="text-xs">Stock Length (mm) *</Label><Input type="number" value={form.stockLength} onChange={e => setForm(p => ({ ...p, stockLength: e.target.value }))} /></div>
            <div><Label className="text-xs">Assignee</Label><Input value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))} /></div>
            <div className="sm:col-span-2"><Label className="text-xs">Cut Lengths (comma-separated mm) *</Label><Input value={form.cuts} onChange={e => setForm(p => ({ ...p, cuts: e.target.value }))} placeholder="1200, 1200, 1500, 900" /></div>
            <div className="sm:col-span-2">
              <Label className="text-xs">Machine</Label>
              <Select value={form.machine} onValueChange={v => setForm(p => ({ ...p, machine: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Double Head Cutting Saw">Double Head Cutting Saw</SelectItem>
                  <SelectItem value="CNC Router">CNC Router</SelectItem>
                  <SelectItem value="Manual Mitre Saw">Manual Mitre Saw</SelectItem>
                  <SelectItem value="Glass Cutting Table">Glass Cutting Table</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleAdd}>Create Job</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Optimizer Dialog */}
      <Dialog open={optimizerOpen} onOpenChange={setOptimizerOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle><Calculator className="h-4 w-4 inline mr-2" />Cut Optimizer</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Stock Length (mm)</Label><Input type="number" value={optForm.stockLength} onChange={e => setOptForm(p => ({ ...p, stockLength: e.target.value }))} /></div>
            <div><Label className="text-xs">Required Cut Lengths (comma-separated mm)</Label><Input value={optForm.requiredCuts} onChange={e => setOptForm(p => ({ ...p, requiredCuts: e.target.value }))} placeholder="1200, 1200, 1500, 900, 800, 1800" /></div>
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
                            <div key={ci} className="bg-primary/80 flex items-center justify-center text-[9px] text-primary-foreground font-mono" style={{ width: `${(cut / Number(optForm.stockLength)) * 100}%` }}>{cut}</div>
                          ))}
                          {waste > 0 && (
                            <div className="bg-destructive/20 flex items-center justify-center text-[9px] text-destructive font-mono" style={{ width: `${(waste / Number(optForm.stockLength)) * 100}%` }}>{waste}</div>
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
