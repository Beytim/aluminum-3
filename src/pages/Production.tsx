import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, Kanban, FileText } from "lucide-react";
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
import { RecordOutputDialog } from "@/components/production/RecordOutputDialog";
import { generateWorkOrderPDF, generateProductionReportPDF } from "@/lib/productionPdfExport";

type ViewMode = 'grid' | 'table' | 'kanban';

export default function Production() {
  const { workOrders, isLoading, addWorkOrder, updateWorkOrder, deleteWorkOrder, advanceStage } = useProduction();
  const [view, setView] = useState<ViewMode>('grid');
  const [addOpen, setAddOpen] = useState(false);
  const [detailsWO, setDetailsWO] = useState<EnhancedWorkOrder | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [outputWO, setOutputWO] = useState<EnhancedWorkOrder | null>(null);
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

  const handleDelete = (id: string) => {
    deleteWorkOrder(id);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteWorkOrder(id));
    setSelectedIds([]);
  };

  const handleBulkStageChange = (stage: ProductionStage) => {
    selectedIds.forEach(id => updateWorkOrder({ id, updates: { current_stage: stage } }));
    setSelectedIds([]);
  };

  const handleBulkPriorityChange = (priority: WorkOrderPriority) => {
    selectedIds.forEach(id => updateWorkOrder({ id, updates: { priority } }));
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

  const handleExportPDF = (wo: EnhancedWorkOrder) => {
    generateWorkOrderPDF(wo);
  };

  const handleExportAllPDF = () => {
    const data = selectedIds.length > 0 ? workOrders.filter(w => selectedIds.includes(w.id)) : filteredWOs;
    generateProductionReportPDF(data);
  };

  const handleUpdateStatus = (id: string, status: string) => {
    updateWorkOrder({ id, updates: { status } });
    toast({ title: `Status updated to ${status}` });
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
          <Button size="sm" variant="outline" onClick={handleExportAllPDF}><FileText className="h-3.5 w-3.5 mr-1.5" />PDF Report</Button>
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
            <WorkOrderCard key={wo.id} workOrder={wo} onView={setDetailsWO} onAdvance={advanceStage} onDelete={handleDelete} onExportPDF={handleExportPDF} onUpdateStatus={handleUpdateStatus} />
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
      <AddWorkOrderDialog open={addOpen} onOpenChange={setAddOpen} onAdd={addWorkOrder} existingCount={workOrders.length} />
      <WorkOrderDetailsDialog workOrder={detailsWO} open={!!detailsWO} onOpenChange={(o) => { if (!o) setDetailsWO(null); }} onAdvance={advanceStage} onUpdateOutput={(id, good, scrap, rework) => {
        updateWorkOrder({ id, updates: { good_units: good, scrap, rework, remaining: (detailsWO?.quantity || 0) - good - scrap } });
      }} />
    </div>
  );
}
