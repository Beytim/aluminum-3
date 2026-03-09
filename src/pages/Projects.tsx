import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Download, Grid3X3, List } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/lib/settingsContext";
import { generateReportPDF } from "@/lib/pdfExport";
import { useProjects } from "@/hooks/useProjects";
import { useProducts } from "@/hooks/useProducts";
import type { EnhancedProject, ProjectStatus } from "@/data/enhancedProjectData";
import { calculateProjectStats, formatETBShort, projectStatusColors } from "@/data/enhancedProjectData";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

import { ProjectStats } from "@/components/projects/ProjectStats";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectTable } from "@/components/projects/ProjectTable";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectBulkActions } from "@/components/projects/BulkActionsBar";
import { ProjectDetailsDialog } from "@/components/projects/ProjectDetailsDialog";
import { AddEnhancedProjectDialog } from "@/components/projects/AddEnhancedProjectDialog";
import { EditEnhancedProjectDialog } from "@/components/projects/EditEnhancedProjectDialog";

export default function Projects() {
  const { projects, isLoading, addProject, updateProject, deleteProject, bulkDelete, bulkStatusChange, getNextProjectNumber } = useProjects();
  const { products } = useProducts();

  // Fetch customers from DB
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('customers').select('*').order('name');
      if (error) throw error;
      return (data || []).map(c => ({
        id: c.id,
        name: c.name,
        nameAm: c.name_am,
        contact: c.contact,
        phone: c.phone,
        email: c.email || '',
        type: c.type,
        status: c.status,
        projects: c.projects_count || 0,
        totalValue: Number(c.total_value) || 0,
        outstanding: Number(c.outstanding) || 0,
        lastOrder: c.last_activity_date || '',
        joinDate: c.customer_since || '',
      }));
    },
  });

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState<EnhancedProject | null>(null);
  const [viewProject, setViewProject] = useState<EnhancedProject | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [managerFilter, setManagerFilter] = useState('all');

  const { t, language } = useI18n();
  const { toast } = useToast();
  const { formatCurrencyShort } = useSettings();

  const managers = useMemo(() => [...new Set(projects.map(p => p.projectManager))], [projects]);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.projectNumber.toLowerCase().includes(search.toLowerCase()) || p.customerName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchType = typeFilter === 'all' || p.type === typeFilter;
      const matchManager = managerFilter === 'all' || p.projectManager === managerFilter;
      let matchRisk = true;
      if (riskFilter === 'overdue') matchRisk = p.isOverdue;
      else if (riskFilter === 'at-risk') matchRisk = p.isAtRisk;
      else if (riskFilter === 'on-track') matchRisk = !p.isOverdue && !p.isAtRisk;
      return matchSearch && matchStatus && matchType && matchManager && matchRisk;
    });
  }, [search, statusFilter, typeFilter, riskFilter, managerFilter, projects]);

  const stats = useMemo(() => calculateProjectStats(projects), [projects]);

  const activeFilterCount = [statusFilter, typeFilter, riskFilter, managerFilter].filter(f => f !== 'all').length + (search ? 1 : 0);

  const clearFilters = () => { setSearch(''); setStatusFilter('all'); setTypeFilter('all'); setRiskFilter('all'); setManagerFilter('all'); };

  const handleDelete = (id: string) => {
    deleteProject.mutate(id);
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleBulkDelete = () => {
    bulkDelete.mutate(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleBulkStatusChange = (status: ProjectStatus) => {
    bulkStatusChange.mutate({ ids: Array.from(selectedIds), status });
    setSelectedIds(new Set());
  };

  const handleExportPDF = () => {
    const data = (selectedIds.size > 0 ? projects.filter(p => selectedIds.has(p.id)) : filtered);
    generateReportPDF("Project Status Report",
      ['#', 'Project', 'Customer', 'Type', 'Status', 'Value', 'Progress'],
      data.map(p => [p.projectNumber, p.name, p.customerName, p.type, p.status, formatCurrencyShort(p.value), `${p.progress}%`])
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const allSelected = filtered.length > 0 && filtered.every(p => selectedIds.has(p.id));
  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(p => p.id)));
  };

  // Status distribution bar
  const statusBar = Object.entries(stats.byStatus).map(([status, count]) => ({
    status, count, color: projectStatusColors[status]?.replace(/\/10\s.*$/, '').replace('bg-', 'bg-') || 'bg-muted',
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('nav.projects')}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{projects.length} projects · {stats.activeProjects} active · {formatCurrencyShort(stats.totalValue)} total value</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex border rounded-md">
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}><Grid3X3 className="h-3.5 w-3.5" /></Button>
            <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('table')}><List className="h-3.5 w-3.5" /></Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportPDF}><Download className="h-3.5 w-3.5 mr-1.5" />PDF</Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Project</Button>
        </div>
      </div>

      {/* Stats */}
      <ProjectStats stats={stats} />

      {/* Status Distribution */}
      <Card className="shadow-card">
        <CardContent className="p-3">
          <p className="text-xs font-semibold text-foreground mb-2">Status Distribution</p>
          <div className="flex h-3 rounded-full overflow-hidden bg-muted">
            {statusBar.map(sb => sb.count > 0 && (
              <div key={sb.status} className="bg-primary transition-all" style={{ width: `${(sb.count / projects.length) * 100}%`, opacity: 0.3 + (sb.count / projects.length) * 0.7 }} title={`${sb.status}: ${sb.count}`} />
            ))}
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            {statusBar.map(sb => (
              <div key={sb.status} className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary" style={{ opacity: 0.3 + (sb.count / projects.length) * 0.7 }} />
                <span className="text-[10px] text-muted-foreground">{sb.status} <span className="font-semibold text-foreground">{sb.count}</span></span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <ProjectFilters
        search={search} onSearchChange={setSearch}
        statusFilter={statusFilter} onStatusChange={setStatusFilter}
        typeFilter={typeFilter} onTypeChange={setTypeFilter}
        riskFilter={riskFilter} onRiskChange={setRiskFilter}
        managerFilter={managerFilter} onManagerChange={setManagerFilter}
        managers={managers} activeFilterCount={activeFilterCount} onClearAll={clearFilters}
      />

      {/* Bulk Actions */}
      <ProjectBulkActions count={selectedIds.size} onClear={() => setSelectedIds(new Set())} onDelete={handleBulkDelete} onExport={handleExportPDF} onStatusChange={handleBulkStatusChange} />

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <ProjectCard key={p.id} project={p} language={language} onView={setViewProject} onDelete={handleDelete} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-8 text-sm text-muted-foreground">No projects match your filters</div>
          )}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-0">
            <ProjectTable
              projects={filtered} language={language}
              selectedIds={selectedIds} onToggleSelect={toggleSelect} onToggleAll={toggleAll} allSelected={allSelected}
              onView={setViewProject} onEdit={setEditProject} onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <AddEnhancedProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={p => addProject.mutate(p)}
        customers={customers as any}
        products={products as any}
        existingCount={projects.length}
      />
      <EditEnhancedProjectDialog
        open={!!editProject}
        onOpenChange={open => { if (!open) setEditProject(null); }}
        project={editProject}
        customers={customers as any}
        products={products as any}
        onSave={updated => updateProject.mutate(updated)}
      />
      <ProjectDetailsDialog
        open={!!viewProject}
        onOpenChange={open => { if (!open) setViewProject(null); }}
        project={viewProject}
        onEdit={p => { setViewProject(null); setEditProject(p); }}
        language={language}
      />
    </div>
  );
}
