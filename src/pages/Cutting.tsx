import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, Calculator } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/lib/settingsContext";
import { enhancedSampleCuttingJobs, calculateCuttingStats } from "@/data/enhancedProductionData";
import type { EnhancedCuttingJob } from "@/data/enhancedProductionData";
import { CuttingStats } from "@/components/cutting/CuttingStats";
import { CuttingCard } from "@/components/cutting/CuttingCard";
import { CuttingTable } from "@/components/cutting/CuttingTable";
import { CuttingFilters } from "@/components/cutting/CuttingFilters";
import { CuttingBulkActions } from "@/components/cutting/CuttingBulkActions";
import { CuttingDetailsDialog } from "@/components/cutting/CuttingDetailsDialog";
import { AddCuttingJobDialog } from "@/components/cutting/AddCuttingJobDialog";
import { OptimizerDialog } from "@/components/cutting/OptimizerDialog";

type ViewMode = 'grid' | 'table';

export default function Cutting() {
  const [jobs, setJobs] = useLocalStorage<EnhancedCuttingJob[]>(STORAGE_KEYS.CUTTING_JOBS, enhancedSampleCuttingJobs);
  const [view, setView] = useState<ViewMode>('table');
  const [addOpen, setAddOpen] = useState(false);
  const [detailsJob, setDetailsJob] = useState<EnhancedCuttingJob | null>(null);
  const [optimizerOpen, setOptimizerOpen] = useState(false);
  const [optimizerJob, setOptimizerJob] = useState<EnhancedCuttingJob | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickFilter, setQuickFilter] = useState('all');
  const [filters, setFilters] = useState({
    search: '', status: '', priority: '', machine: '', project: '', showHighWaste: false, showOptimized: false,
  });
  const { t } = useI18n();
  const { toast } = useToast();
  const { formatCurrency } = useSettings();

  const stats = useMemo(() => calculateCuttingStats(jobs), [jobs]);

  // Job counts for quick filter badges
  const jobCounts = useMemo(() => ({
    'all': jobs.length,
    'Pending': jobs.filter(j => j.status === 'Pending').length,
    'In Progress': jobs.filter(j => j.status === 'In Progress').length,
    'Completed': jobs.filter(j => j.status === 'Completed').length,
    'high-waste': jobs.filter(j => j.wastePercent > 15).length,
    'optimized': jobs.filter(j => j.optimized).length,
  }), [jobs]);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];
    if (quickFilter === 'Pending') result = result.filter(j => j.status === 'Pending');
    else if (quickFilter === 'In Progress') result = result.filter(j => j.status === 'In Progress');
    else if (quickFilter === 'Completed') result = result.filter(j => j.status === 'Completed');
    else if (quickFilter === 'high-waste') result = result.filter(j => j.wastePercent > 15);
    else if (quickFilter === 'optimized') result = result.filter(j => j.optimized);

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(j =>
        j.jobNumber.toLowerCase().includes(s) ||
        j.materialName.toLowerCase().includes(s) ||
        (j.workOrderNumber || '').toLowerCase().includes(s) ||
        (j.projectName || '').toLowerCase().includes(s) ||
        (j.customerName || '').toLowerCase().includes(s)
      );
    }
    if (filters.status) result = result.filter(j => j.status === filters.status);
    if (filters.priority) result = result.filter(j => j.priority === filters.priority);
    if (filters.machine) result = result.filter(j => j.machine === filters.machine);
    if (filters.project) result = result.filter(j => j.projectName === filters.project);

    return result;
  }, [jobs, quickFilter, filters]);

  const projectNames = useMemo(() => [...new Set(jobs.map(j => j.projectName).filter(Boolean) as string[])], [jobs]);
  const machineNames = useMemo(() => [...new Set(jobs.map(j => j.machine).filter(Boolean))], [jobs]);

  const updateStatus = (id: string, status: EnhancedCuttingJob['status']) => {
    setJobs(prev => prev.map(j => j.id === id ? {
      ...j, status,
      startTime: status === 'In Progress' && !j.startTime ? new Date().toISOString() : j.startTime,
      endTime: status === 'Completed' ? new Date().toISOString() : j.endTime,
      updatedAt: new Date().toISOString().split('T')[0],
    } : j));
    toast({ title: "Status Updated", description: `Job updated to ${status}` });
  };

  const handleOptimize = (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (job) { setOptimizerJob(job); setOptimizerOpen(true); }
  };

  const handleApplyOptimization = (jobId: string, layout: number[][], stockNeeded: number, totalWaste: number) => {
    setJobs(prev => prev.map(j => j.id === jobId ? {
      ...j,
      optimized: true,
      optimizationLayout: layout,
      stocksUsed: stockNeeded,
      waste: totalWaste,
      wastePercent: Number(((totalWaste / (j.stockLength * stockNeeded)) * 100).toFixed(1)),
      efficiency: Number((((j.totalCutLength) / (j.stockLength * stockNeeded)) * 100).toFixed(1)),
      updatedAt: new Date().toISOString().split('T')[0],
    } : j));
    toast({ title: "Optimization Applied", description: `${stockNeeded} stocks, ${totalWaste}mm waste` });
  };

  const handleDelete = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    toast({ title: "Cutting Job Deleted" });
  };

  const handleBulkDelete = () => {
    setJobs(prev => prev.filter(j => !selectedIds.includes(j.id)));
    toast({ title: `${selectedIds.length} jobs deleted` });
    setSelectedIds([]);
  };

  const handleBulkStatus = (status: EnhancedCuttingJob['status']) => {
    setJobs(prev => prev.map(j => selectedIds.includes(j.id) ? {
      ...j, status,
      startTime: status === 'In Progress' && !j.startTime ? new Date().toISOString() : j.startTime,
      endTime: status === 'Completed' ? new Date().toISOString() : j.endTime,
      updatedAt: new Date().toISOString().split('T')[0],
    } : j));
    toast({ title: `${selectedIds.length} jobs updated to ${status}` });
    setSelectedIds([]);
  };

  const handleExport = () => {
    const data = selectedIds.length > 0 ? jobs.filter(j => selectedIds.includes(j.id)) : filteredJobs;
    const csv = [
      'Job #,Material,Work Order,Project,Customer,Status,Priority,Cuts,Stock,Waste,Waste%,Efficiency,Machine,Assignee,Cost',
      ...data.map(j =>
        `${j.jobNumber},${j.materialName},${j.workOrderNumber || ''},${j.projectName || ''},${j.customerName || ''},${j.status},${j.priority},${j.totalCuts},${j.stockLength}x${j.stocksUsed},${j.waste}mm,${j.wastePercent}%,${j.efficiency}%,${j.machine},${j.assignee},${formatCurrency(j.totalCost)}`
      )
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'cutting_jobs.csv'; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `${data.length} jobs exported to CSV` });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.cutting')} Optimization</h1>
          <p className="text-sm text-muted-foreground">
            {filteredJobs.length} of {jobs.length} cutting jobs · Avg efficiency: {stats.averageEfficiency}% · Avg waste: {stats.averageWastePercent}%
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-md">
            <Button variant={view === 'table' ? 'default' : 'ghost'} size="icon" className="h-8 w-8 rounded-r-none" onClick={() => setView('table')}>
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button variant={view === 'grid' ? 'default' : 'ghost'} size="icon" className="h-8 w-8 rounded-l-none" onClick={() => setView('grid')}>
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => { setOptimizerJob(null); setOptimizerOpen(true); }}>
            <Calculator className="h-3.5 w-3.5 mr-1.5" />Cut Optimizer
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />New Cut Job
          </Button>
        </div>
      </div>

      {/* Stats */}
      <CuttingStats stats={stats} />

      {/* Filters */}
      <CuttingFilters
        quickFilter={quickFilter}
        onQuickFilterChange={setQuickFilter}
        filters={filters}
        onFiltersChange={setFilters}
        projectNames={projectNames}
        machineNames={machineNames}
        jobCounts={jobCounts}
      />

      {/* Bulk Actions */}
      <CuttingBulkActions
        count={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onDelete={handleBulkDelete}
        onExport={handleExport}
        onOptimize={() => toast({ title: `Optimizing ${selectedIds.length} jobs...` })}
        onBulkStart={() => handleBulkStatus('In Progress')}
        onBulkComplete={() => handleBulkStatus('Completed')}
      />

      {/* Views */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map(job => (
            <CuttingCard
              key={job.id}
              job={job}
              onView={setDetailsJob}
              onOptimize={handleOptimize}
              onStatusChange={updateStatus}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <CuttingTable
          jobs={filteredJobs}
          selectedIds={selectedIds}
          onSelect={id => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
          onSelectAll={() => setSelectedIds(prev => prev.length === filteredJobs.length ? [] : filteredJobs.map(j => j.id))}
          onView={setDetailsJob}
          onOptimize={handleOptimize}
          onStatusChange={updateStatus}
          onDelete={handleDelete}
        />
      )}

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-3">No cutting jobs found</p>
          <Button onClick={() => setAddOpen(true)}>Create Cutting Job</Button>
        </div>
      )}

      {/* Dialogs */}
      <AddCuttingJobDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={job => {
          setJobs(prev => [...prev, job]);
          toast({ title: "Cutting Job Created", description: `${job.jobNumber} — ${job.totalCuts} cuts` });
        }}
        existingCount={jobs.length}
      />

      <CuttingDetailsDialog
        job={detailsJob}
        open={!!detailsJob}
        onOpenChange={o => { if (!o) setDetailsJob(null); }}
        onStatusChange={updateStatus}
        onOptimize={handleOptimize}
      />

      <OptimizerDialog
        open={optimizerOpen}
        onOpenChange={setOptimizerOpen}
        job={optimizerJob}
        onApplyOptimization={handleApplyOptimization}
      />
    </div>
  );
}
