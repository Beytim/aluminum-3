import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, Kanban } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { calculateProductionStats, getProductionStages } from "@/data/enhancedProductionData";
import type { EnhancedWorkOrder, ProductionStage, WorkOrderPriority } from "@/data/enhancedProductionData";
import { useProduction } from "@/hooks/useProduction";
import { ProductionStats } from "@/components/production/ProductionStats";
import { WorkOrderCard } from "@/components/production/WorkOrderCard";
import { WorkOrderTable } from "@/components/production/WorkOrderTable";
import { ProductionFilters } from "@/components/production/ProductionFilters";
import { StageBoard } from "@/components/production/StageBoard";
import { ProductionBulkActions } from "@/components/production/ProductionBulkActions";
import { WorkOrderDetailsDialog } from "@/components/production/WorkOrderDetailsDialog";
import { AddWorkOrderDialog } from "@/components/production/AddWorkOrderDialog";

type ViewMode = 'grid' | 'table' | 'kanban';

export default function Production() {
  const [workOrders, setWorkOrders] = useLocalStorage<EnhancedWorkOrder[]>(STORAGE_KEYS.WORK_ORDERS, enhancedSampleWorkOrders);
  const [view, setView] = useState<ViewMode>('grid');
  const [addOpen, setAddOpen] = useState(false);
  const [detailsWO, setDetailsWO] = useState<EnhancedWorkOrder | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickFilter, setQuickFilter] = useState('all');
  const [filters, setFilters] = useState({ search: '', stage: '', priority: '', status: '', team: '', project: '', showOverdue: false, showBlocked: false });
  const { t } = useI18n();
  const { toast } = useToast();

  const stages = getProductionStages();

  const filteredWOs = useMemo(() => {
    let result = [...workOrders];

    // Quick filters
    if (quickFilter === 'active') result = result.filter(w => w.status === 'In Progress' || w.status === 'Scheduled');
    else if (quickFilter === 'completed') result = result.filter(w => w.status === 'Completed');
    else if (quickFilter === 'overdue') result = result.filter(w => w.isOverdue);
    else if (quickFilter === 'blocked') result = result.filter(w => w.isBlocked);
    else if (quickFilter === 'high-priority') result = result.filter(w => w.priority === 'High' || w.priority === 'Urgent' || w.priority === 'Critical');

    // Advanced filters
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(w => w.workOrderNumber.toLowerCase().includes(s) || w.productName.toLowerCase().includes(s) || w.projectName.toLowerCase().includes(s) || (w.customerName || '').toLowerCase().includes(s));
    }
    if (filters.stage) result = result.filter(w => w.currentStage === filters.stage);
    if (filters.priority) result = result.filter(w => w.priority === filters.priority);
    if (filters.status) result = result.filter(w => w.status === filters.status);
    if (filters.team) result = result.filter(w => w.assignedTeam === filters.team);
    if (filters.project) result = result.filter(w => w.projectName === filters.project);

    return result;
  }, [workOrders, quickFilter, filters]);

  const stats = useMemo(() => calculateProductionStats(workOrders), [workOrders]);
  const projectNames = useMemo(() => [...new Set(workOrders.map(w => w.projectName))], [workOrders]);
  const teamNames = useMemo(() => [...new Set(workOrders.map(w => w.assignedTeam).filter(Boolean) as string[])], [workOrders]);

  const advanceStage = (id: string) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== id) return wo;
      const idx = stages.indexOf(wo.currentStage);
      if (idx >= 0 && idx < stages.length - 1) {
        const nextStage = stages[idx + 1];
        const now = new Date().toISOString().split('T')[0];
        const newHistory = [...wo.stageHistory];
        if (newHistory.length > 0 && !newHistory[newHistory.length - 1].exitedAt) {
          newHistory[newHistory.length - 1].exitedAt = now;
        }
        newHistory.push({ stage: nextStage, enteredAt: now });
        const newProgress = Math.min(100, wo.progress + Math.round(100 / stages.length));
        return {
          ...wo, currentStage: nextStage, stageHistory: newHistory,
          progress: nextStage === 'Completed' ? 100 : newProgress,
          status: nextStage === 'Completed' ? 'Completed' as const : 'In Progress' as const,
          actualEnd: nextStage === 'Completed' ? now : undefined,
          updatedAt: now,
        };
      }
      return wo;
    }));
    toast({ title: "Stage Advanced" });
  };

  const handleDelete = (id: string) => {
    setWorkOrders(prev => prev.filter(w => w.id !== id));
    toast({ title: "Work Order Deleted" });
  };

  const handleBulkDelete = () => {
    setWorkOrders(prev => prev.filter(w => !selectedIds.includes(w.id)));
    toast({ title: `${selectedIds.length} work orders deleted` });
    setSelectedIds([]);
  };

  const handleBulkStageChange = (stage: ProductionStage) => {
    setWorkOrders(prev => prev.map(w => selectedIds.includes(w.id) ? { ...w, currentStage: stage, updatedAt: new Date().toISOString().split('T')[0] } : w));
    toast({ title: `${selectedIds.length} work orders moved to ${stage}` });
    setSelectedIds([]);
  };

  const handleBulkPriorityChange = (priority: WorkOrderPriority) => {
    setWorkOrders(prev => prev.map(w => selectedIds.includes(w.id) ? { ...w, priority, updatedAt: new Date().toISOString().split('T')[0] } : w));
    toast({ title: `Priority updated for ${selectedIds.length} work orders` });
    setSelectedIds([]);
  };

  const handleExport = () => {
    const data = (selectedIds.length > 0 ? workOrders.filter(w => selectedIds.includes(w.id)) : filteredWOs);
    const csv = ['WO#,Product,Project,Customer,Stage,Progress,Qty,Completed,Priority,Team,Status,Due']
      .concat(data.map(w => `${w.workOrderNumber},${w.productName},${w.projectName},${w.customerName || ''},${w.currentStage},${w.progress}%,${w.quantity},${w.completed},${w.priority},${w.assignedTeam || ''},${w.status},${w.scheduledEnd}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'work_orders.csv'; a.click();
    toast({ title: "Exported" });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('production.title')}</h1>
          <p className="text-sm text-muted-foreground">{filteredWOs.length} of {workOrders.length} work orders</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md">
            <Button variant={view === 'grid' ? 'default' : 'ghost'} size="icon" className="h-8 w-8 rounded-r-none" onClick={() => setView('grid')}><LayoutGrid className="h-3.5 w-3.5" /></Button>
            <Button variant={view === 'table' ? 'default' : 'ghost'} size="icon" className="h-8 w-8 rounded-none border-x" onClick={() => setView('table')}><List className="h-3.5 w-3.5" /></Button>
            <Button variant={view === 'kanban' ? 'default' : 'ghost'} size="icon" className="h-8 w-8 rounded-l-none" onClick={() => setView('kanban')}><Kanban className="h-3.5 w-3.5" /></Button>
          </div>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Work Order</Button>
        </div>
      </div>

      {/* Stats */}
      <ProductionStats stats={stats} />

      {/* Filters */}
      <ProductionFilters
        filters={filters} onChange={setFilters}
        quickFilter={quickFilter} onQuickFilter={setQuickFilter}
        projectNames={projectNames} teamNames={teamNames}
      />

      {/* Bulk Actions */}
      <ProductionBulkActions
        count={selectedIds.length} onClear={() => setSelectedIds([])}
        onDelete={handleBulkDelete} onExport={handleExport}
        onStageChange={handleBulkStageChange} onPriorityChange={handleBulkPriorityChange}
      />

      {/* Views */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWOs.map(wo => (
            <WorkOrderCard key={wo.id} workOrder={wo} onView={setDetailsWO} onAdvance={advanceStage} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {view === 'table' && (
        <WorkOrderTable
          workOrders={filteredWOs} selectedIds={selectedIds}
          onToggleSelect={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
          onSelectAll={() => setSelectedIds(prev => prev.length === filteredWOs.length ? [] : filteredWOs.map(w => w.id))}
          onView={setDetailsWO} onAdvance={advanceStage} onDelete={handleDelete}
        />
      )}

      {view === 'kanban' && (
        <StageBoard workOrders={filteredWOs} onView={setDetailsWO} onAdvance={advanceStage} />
      )}

      {filteredWOs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No work orders found</p>
          <Button variant="outline" className="mt-3" onClick={() => setAddOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />Create Work Order</Button>
        </div>
      )}

      {/* Dialogs */}
      <AddWorkOrderDialog open={addOpen} onOpenChange={setAddOpen} onAdd={(wo) => { setWorkOrders(prev => [...prev, wo]); toast({ title: "Work Order Created", description: wo.workOrderNumber }); }} existingCount={workOrders.length} />
      <WorkOrderDetailsDialog workOrder={detailsWO} open={!!detailsWO} onOpenChange={(o) => { if (!o) setDetailsWO(null); }} onAdvance={advanceStage} />
    </div>
  );
}
