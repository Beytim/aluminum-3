import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, Calendar as CalendarIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import { sampleEnhancedInstallations, calculateInstallationStats, daysUntil } from "@/data/enhancedInstallationData";
import type { EnhancedInstallation } from "@/data/enhancedInstallationData";
import { InstallationStats } from "@/components/installation/InstallationStats";
import { InstallationFilters } from "@/components/installation/InstallationFilters";
import { InstallationCard } from "@/components/installation/InstallationCard";
import { InstallationTable } from "@/components/installation/InstallationTable";
import { InstallationCalendar } from "@/components/installation/InstallationCalendar";
import { InstallationBulkActions } from "@/components/installation/InstallationBulkActions";
import { AddInstallationDialog } from "@/components/installation/AddInstallationDialog";
import { InstallationDetailsDialog } from "@/components/installation/InstallationDetailsDialog";

type ViewMode = 'grid' | 'table' | 'calendar';

export default function InstallationPage() {
  const [installations, setInstallations] = useLocalStorage<EnhancedInstallation[]>(STORAGE_KEYS.INSTALLATIONS, sampleEnhancedInstallations);
  const [view, setView] = useState<ViewMode>('grid');
  const [addOpen, setAddOpen] = useState(false);
  const [detailsInst, setDetailsInst] = useState<EnhancedInstallation | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickFilter, setQuickFilter] = useState('all');
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', project: '', customer: '', overdueOnly: false, withIssues: false });
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const { t, language } = useI18n();
  const { toast } = useToast();

  const stats = useMemo(() => calculateInstallationStats(installations), [installations]);

  const filteredInstallations = useMemo(() => {
    let result = [...installations];
    const today = new Date().toISOString().split('T')[0];
    const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    if (quickFilter === 'scheduled') result = result.filter(i => i.status === 'scheduled' || i.status === 'confirmed');
    else if (quickFilter === 'in_progress') result = result.filter(i => i.status === 'in_progress');
    else if (quickFilter === 'completed') result = result.filter(i => i.status === 'completed');
    else if (quickFilter === 'today') result = result.filter(i => i.scheduledDate === today);
    else if (quickFilter === 'this_week') result = result.filter(i => i.scheduledDate >= today && i.scheduledDate <= weekFromNow);
    else if (quickFilter === 'overdue') result = result.filter(i => i.isOverdue || (daysUntil(i.scheduledDate) < 0 && i.status !== 'completed' && i.status !== 'cancelled'));
    else if (quickFilter === 'with_issues') result = result.filter(i => i.hasIssues);

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(i => i.installationNumber.toLowerCase().includes(s) || i.customerName.toLowerCase().includes(s) || (i.projectName || '').toLowerCase().includes(s) || i.siteAddress.toLowerCase().includes(s));
    }
    if (filters.status) result = result.filter(i => i.status === filters.status);
    if (filters.priority) result = result.filter(i => i.priority === filters.priority);
    if (filters.project) result = result.filter(i => i.projectName === filters.project);
    if (filters.customer) result = result.filter(i => i.customerName === filters.customer);

    return result;
  }, [installations, quickFilter, filters]);

  const projectNames = useMemo(() => [...new Set(installations.map(i => i.projectName).filter(Boolean) as string[])], [installations]);
  const customerNames = useMemo(() => [...new Set(installations.map(i => i.customerName))], [installations]);

  const handleStart = (id: string) => {
    setInstallations(prev => prev.map(i => i.id === id ? { ...i, status: 'in_progress' as const, actualStartDate: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0], activityLog: [...i.activityLog, { date: new Date().toISOString().split('T')[0], user: 'EMP-001', userName: 'Current User', action: 'Installation started' }] } : i));
    toast({ title: "Installation Started" });
  };

  const handleComplete = (id: string) => {
    setInstallations(prev => prev.map(i => i.id === id ? { ...i, status: 'completed' as const, actualEndDate: new Date().toISOString().split('T')[0], completedAt: new Date().toISOString().split('T')[0], completedBy: 'Current User', items: i.items.map(it => ({ ...it, isInstalled: true, installedQuantity: it.quantity, remainingQuantity: 0 })), updatedAt: new Date().toISOString().split('T')[0], activityLog: [...i.activityLog, { date: new Date().toISOString().split('T')[0], user: 'EMP-001', userName: 'Current User', action: 'Installation completed' }] } : i));
    toast({ title: "Installation Completed" });
  };

  const handleDelete = (id: string) => {
    setInstallations(prev => prev.filter(i => i.id !== id));
    toast({ title: "Installation Deleted" });
  };

  const handleExport = () => {
    const data = selectedIds.length > 0 ? installations.filter(i => selectedIds.includes(i.id)) : filteredInstallations;
    const csv = ['#,Customer,Project,Site,Date,Status,Priority,Team,Items,Issues',
      ...data.map(i => `${i.installationNumber},${i.customerName},${i.projectName || ''},${i.siteAddress},${i.scheduledDate},${i.status},${i.priority},${i.teamLead},${i.items.length},${i.issueCount}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'installations.csv'; a.click();
    toast({ title: "Exported" });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.installation')}</h1>
          <p className="text-sm text-muted-foreground">{filteredInstallations.length} of {installations.length} installations</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md">
            <Button size="sm" variant={view === 'grid' ? 'default' : 'ghost'} className="rounded-r-none" onClick={() => setView('grid')}><LayoutGrid className="h-3.5 w-3.5" /></Button>
            <Button size="sm" variant={view === 'table' ? 'default' : 'ghost'} className="rounded-none" onClick={() => setView('table')}><List className="h-3.5 w-3.5" /></Button>
            <Button size="sm" variant={view === 'calendar' ? 'default' : 'ghost'} className="rounded-l-none" onClick={() => setView('calendar')}><CalendarIcon className="h-3.5 w-3.5" /></Button>
          </div>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />Schedule Installation</Button>
        </div>
      </div>

      <InstallationStats stats={stats} />

      <InstallationFilters
        quickFilter={quickFilter} onQuickFilterChange={setQuickFilter}
        filters={filters} onFiltersChange={setFilters}
        projectNames={projectNames} customerNames={customerNames}
      />

      <InstallationBulkActions
        count={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onDelete={() => { setInstallations(prev => prev.filter(i => !selectedIds.includes(i.id))); setSelectedIds([]); toast({ title: `${selectedIds.length} deleted` }); }}
        onExport={handleExport}
        onStart={() => { selectedIds.forEach(handleStart); setSelectedIds([]); }}
        onComplete={() => { selectedIds.forEach(handleComplete); setSelectedIds([]); }}
      />

      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInstallations.map(inst => (
            <InstallationCard key={inst.id} installation={inst} onView={setDetailsInst} onStart={handleStart} onComplete={handleComplete} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {view === 'table' && (
        <InstallationTable
          installations={filteredInstallations}
          selectedIds={selectedIds}
          onToggleSelect={id => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
          onSelectAll={() => setSelectedIds(prev => prev.length === filteredInstallations.length ? [] : filteredInstallations.map(i => i.id))}
          onView={setDetailsInst} onStart={handleStart} onComplete={handleComplete} onDelete={handleDelete}
        />
      )}

      {view === 'calendar' && (
        <InstallationCalendar
          installations={filteredInstallations}
          currentMonth={calendarMonth}
          onMonthChange={setCalendarMonth}
          onView={setDetailsInst}
        />
      )}

      {filteredInstallations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground mb-3">No installations found</p>
          <Button size="sm" onClick={() => setAddOpen(true)}>Schedule Installation</Button>
        </div>
      )}

      <AddInstallationDialog open={addOpen} onOpenChange={setAddOpen} onAdd={inst => { setInstallations(prev => [...prev, inst]); toast({ title: "Installation Scheduled", description: inst.installationNumber }); }} existingCount={installations.length} />

      <InstallationDetailsDialog
        installation={detailsInst}
        open={!!detailsInst}
        onOpenChange={o => { if (!o) setDetailsInst(null); }}
        onStart={handleStart}
        onComplete={handleComplete}
      />
    </div>
  );
}
