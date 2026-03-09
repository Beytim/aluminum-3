import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, Calculator, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/lib/settingsContext";
import { useCutting } from "@/hooks/useCutting";
import type { EnhancedCuttingJob } from "@/data/enhancedProductionData";
import { CuttingStats } from "@/components/cutting/CuttingStats";
import { CuttingCard } from "@/components/cutting/CuttingCard";
import { CuttingTable } from "@/components/cutting/CuttingTable";
import { CuttingFilters } from "@/components/cutting/CuttingFilters";
import { CuttingBulkActions } from "@/components/cutting/CuttingBulkActions";
import { CuttingDetailsDialog } from "@/components/cutting/CuttingDetailsDialog";
import { AddCuttingJobDialog } from "@/components/cutting/AddCuttingJobDialog";
import { EditCuttingJobDialog } from "@/components/cutting/EditCuttingJobDialog";
import { OptimizerDialog } from "@/components/cutting/OptimizerDialog";

type ViewMode = 'grid' | 'table';

export default function Cutting() {
  const { 
    cuttingJobs, isLoading, stats,
    addCuttingJob, updateCuttingJob, deleteCuttingJob, 
    updateStatus, applyOptimization 
  } = useCutting();
  
  const [view, setView] = useState<ViewMode>('table');
  const [addOpen, setAddOpen] = useState(false);
  const [detailsJob, setDetailsJob] = useState<EnhancedCuttingJob | null>(null);
  const [editJob, setEditJob] = useState<EnhancedCuttingJob | null>(null);
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

  // Job counts for quick filter badges
  const jobCounts = useMemo(() => ({
    'all': cuttingJobs.length,
    'Pending': cuttingJobs.filter(j => j.status === 'Pending').length,
    'In Progress': cuttingJobs.filter(j => j.status === 'In Progress').length,
    'Completed': cuttingJobs.filter(j => j.status === 'Completed').length,
    'high-waste': cuttingJobs.filter(j => j.wastePercent > 15).length,
    'optimized': cuttingJobs.filter(j => j.optimized).length,
  }), [cuttingJobs]);

  const filteredJobs = useMemo(() => {
    let result = [...cuttingJobs];
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
  }, [cuttingJobs, quickFilter, filters]);

  const projectNames = useMemo(() => [...new Set(cuttingJobs.map(j => j.projectName).filter(Boolean) as string[])], [cuttingJobs]);
  const machineNames = useMemo(() => [...new Set(cuttingJobs.map(j => j.machine).filter(Boolean))], [cuttingJobs]);

  const handleOptimize = (id: string) => {
    const job = cuttingJobs.find(j => j.id === id);
    if (job) { setOptimizerJob(job); setOptimizerOpen(true); }
  };

  const handleDelete = (id: string) => {
    deleteCuttingJob(id);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteCuttingJob(id));
    toast({ title: `${selectedIds.length} jobs deleted` });
    setSelectedIds([]);
  };

  const handleBulkStatus = (status: EnhancedCuttingJob['status']) => {
    selectedIds.forEach(id => updateStatus(id, status));
    toast({ title: `${selectedIds.length} jobs updated to ${status}` });
    setSelectedIds([]);
  };

  const handleExport = () => {
    const data = selectedIds.length > 0 ? cuttingJobs.filter(j => selectedIds.includes(j.id)) : filteredJobs;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.cutting')} Optimization</h1>
          <p className="text-sm text-muted-foreground">
            {filteredJobs.length} of {cuttingJobs.length} cutting jobs · Avg efficiency: {stats.averageEfficiency}% · Avg waste: {stats.averageWastePercent}%
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
              onEdit={setEditJob}
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
          onEdit={setEditJob}
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
        onAdd={addCuttingJob}
        existingCount={cuttingJobs.length}
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
        onApplyOptimization={applyOptimization}
      />

      <EditCuttingJobDialog
        open={!!editJob}
        onOpenChange={o => { if (!o) setEditJob(null); }}
        job={editJob}
        onSave={(id, updates) => {
          updateCuttingJob({ id, updates });
          toast({ title: "Job Updated" });
        }}
      />
    </div>
  );
}
