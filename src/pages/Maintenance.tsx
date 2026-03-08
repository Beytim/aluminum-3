import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LayoutGrid, List, Calendar as CalendarIcon, Wrench } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import {
  sampleEnhancedMaintenanceTasks, sampleEquipment, calculateMaintenanceStats, daysUntil,
  type EnhancedMaintenanceTask, type Equipment
} from "@/data/enhancedMaintenanceData";
import { MaintenanceStats } from "@/components/maintenance/MaintenanceStats";
import { MaintenanceFilters } from "@/components/maintenance/MaintenanceFilters";
import { MaintenanceCard } from "@/components/maintenance/MaintenanceCard";
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable";
import { MaintenanceCalendar } from "@/components/maintenance/MaintenanceCalendar";
import { MaintenanceBulkActions } from "@/components/maintenance/MaintenanceBulkActions";
import { EquipmentRegistry } from "@/components/maintenance/EquipmentRegistry";
import { AddMaintenanceTaskDialog } from "@/components/maintenance/AddMaintenanceTaskDialog";
import { MaintenanceDetailsDialog } from "@/components/maintenance/MaintenanceDetailsDialog";
import { EquipmentDetailsDialog } from "@/components/maintenance/EquipmentDetailsDialog";

type ViewMode = 'grid' | 'table' | 'calendar';
type MainTab = 'tasks' | 'equipment';

export default function Maintenance() {
  const [tasks, setTasks] = useLocalStorage<EnhancedMaintenanceTask[]>(STORAGE_KEYS.MAINTENANCE_TASKS, sampleEnhancedMaintenanceTasks);
  const [equipment] = useLocalStorage<Equipment[]>('equipment', sampleEquipment);
  const [mainTab, setMainTab] = useState<MainTab>('tasks');
  const [view, setView] = useState<ViewMode>('grid');
  const [addOpen, setAddOpen] = useState(false);
  const [detailsTask, setDetailsTask] = useState<EnhancedMaintenanceTask | null>(null);
  const [detailsEquipment, setDetailsEquipment] = useState<Equipment | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickFilter, setQuickFilter] = useState('all');
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', type: '', equipment: '', department: '' });
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const { t } = useI18n();
  const { toast } = useToast();

  const stats = useMemo(() => calculateMaintenanceStats(tasks, equipment), [tasks, equipment]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    const today = new Date().toISOString().split('T')[0];
    const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    if (quickFilter === 'open') result = result.filter(t => t.status === 'scheduled' || t.status === 'pending_parts');
    else if (quickFilter === 'in_progress') result = result.filter(t => t.status === 'in_progress');
    else if (quickFilter === 'completed') result = result.filter(t => t.status === 'completed');
    else if (quickFilter === 'overdue') result = result.filter(t => t.isOverdue || (daysUntil(t.scheduledDate) < 0 && t.status !== 'completed' && t.status !== 'cancelled'));
    else if (quickFilter === 'critical') result = result.filter(t => t.priority === 'critical');
    else if (quickFilter === 'today') result = result.filter(t => t.scheduledDate === today);
    else if (quickFilter === 'this_week') result = result.filter(t => t.scheduledDate >= today && t.scheduledDate <= weekFromNow);

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(t => t.taskNumber.toLowerCase().includes(s) || t.title.toLowerCase().includes(s) || t.equipmentName.toLowerCase().includes(s));
    }
    if (filters.status) result = result.filter(t => t.status === filters.status);
    if (filters.priority) result = result.filter(t => t.priority === filters.priority);
    if (filters.type) result = result.filter(t => t.type === filters.type);
    if (filters.department) {
      const eqIds = equipment.filter(e => e.department === filters.department).map(e => e.id);
      result = result.filter(t => eqIds.includes(t.equipmentId));
    }
    return result;
  }, [tasks, equipment, quickFilter, filters]);

  const departments = useMemo(() => [...new Set(equipment.map(e => e.department))], [equipment]);
  const equipmentNames = useMemo(() => equipment.map(e => e.name), [equipment]);

  const handleStart = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'in_progress' as const, startDate: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0], activityLog: [...t.activityLog, { date: new Date().toISOString().split('T')[0], user: 'EMP-001', userName: 'Current User', action: 'Maintenance started' }] } : t));
    toast({ title: "Maintenance Started" });
  };

  const handleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' as const, completionDate: new Date().toISOString().split('T')[0], outcome: 'successful' as const, checklist: t.checklist.map(c => ({ ...c, completed: true })), updatedAt: new Date().toISOString().split('T')[0], activityLog: [...t.activityLog, { date: new Date().toISOString().split('T')[0], user: 'EMP-001', userName: 'Current User', action: 'Maintenance completed' }] } : t));
    toast({ title: "Maintenance Completed" });
  };

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    toast({ title: "Task Deleted" });
  };

  const handleExport = () => {
    const data = selectedIds.length > 0 ? tasks.filter(t => selectedIds.includes(t.id)) : filteredTasks;
    const csv = ['#,Equipment,Type,Priority,Status,Date,Assigned,Parts,Cost',
      ...data.map(t => `${t.taskNumber},${t.equipmentName},${t.type},${t.priority},${t.status},${t.scheduledDate},${t.assignedToNames.join(';')},${t.partsUsed.length},${t.totalCost}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'maintenance_tasks.csv'; a.click();
    toast({ title: "Exported" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.maintenance')}</h1>
          <p className="text-sm text-muted-foreground">{filteredTasks.length} of {tasks.length} tasks · {equipment.length} equipment</p>
        </div>
        <div className="flex items-center gap-2">
          {mainTab === 'tasks' && (
            <div className="flex border rounded-md">
              <Button size="sm" variant={view === 'grid' ? 'default' : 'ghost'} className="rounded-r-none" onClick={() => setView('grid')}><LayoutGrid className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant={view === 'table' ? 'default' : 'ghost'} className="rounded-none" onClick={() => setView('table')}><List className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant={view === 'calendar' ? 'default' : 'ghost'} className="rounded-l-none" onClick={() => setView('calendar')}><CalendarIcon className="h-3.5 w-3.5" /></Button>
            </div>
          )}
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Task</Button>
        </div>
      </div>

      <MaintenanceStats stats={stats} />

      <Tabs value={mainTab} onValueChange={v => setMainTab(v as MainTab)}>
        <TabsList>
          <TabsTrigger value="tasks" className="text-xs"><Wrench className="h-3 w-3 mr-1" />Tasks</TabsTrigger>
          <TabsTrigger value="equipment" className="text-xs"><Wrench className="h-3 w-3 mr-1" />Equipment ({equipment.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4 mt-3">
          <MaintenanceFilters
            quickFilter={quickFilter} onQuickFilterChange={setQuickFilter}
            filters={filters} onFiltersChange={setFilters}
            equipmentNames={equipmentNames} departments={departments}
          />

          <MaintenanceBulkActions
            count={selectedIds.length}
            onClear={() => setSelectedIds([])}
            onDelete={() => { setTasks(prev => prev.filter(t => !selectedIds.includes(t.id))); setSelectedIds([]); toast({ title: `${selectedIds.length} deleted` }); }}
            onExport={handleExport}
            onStart={() => { selectedIds.forEach(handleStart); setSelectedIds([]); }}
            onComplete={() => { selectedIds.forEach(handleComplete); setSelectedIds([]); }}
          />

          {view === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map(task => (
                <MaintenanceCard key={task.id} task={task} onView={setDetailsTask} onStart={handleStart} onComplete={handleComplete} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {view === 'table' && (
            <MaintenanceTable
              tasks={filteredTasks} selectedIds={selectedIds}
              onToggleSelect={id => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
              onSelectAll={() => setSelectedIds(prev => prev.length === filteredTasks.length ? [] : filteredTasks.map(t => t.id))}
              onView={setDetailsTask} onStart={handleStart} onComplete={handleComplete} onDelete={handleDelete}
            />
          )}

          {view === 'calendar' && (
            <MaintenanceCalendar tasks={filteredTasks} currentMonth={calendarMonth} onMonthChange={setCalendarMonth} onView={setDetailsTask} />
          )}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground mb-3">No maintenance tasks found</p>
              <Button size="sm" onClick={() => setAddOpen(true)}>Create Task</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="equipment" className="mt-3">
          <EquipmentRegistry equipment={equipment} onView={setDetailsEquipment} />
        </TabsContent>
      </Tabs>

      <AddMaintenanceTaskDialog open={addOpen} onOpenChange={setAddOpen} onAdd={task => { setTasks(prev => [...prev, task]); toast({ title: "Task Created", description: task.taskNumber }); }} equipment={equipment} existingCount={tasks.length} />

      <MaintenanceDetailsDialog task={detailsTask} open={!!detailsTask} onOpenChange={o => { if (!o) setDetailsTask(null); }} onStart={handleStart} onComplete={handleComplete} />

      <EquipmentDetailsDialog equipment={detailsEquipment} open={!!detailsEquipment} onOpenChange={o => { if (!o) setDetailsEquipment(null); }} />
    </div>
  );
}
