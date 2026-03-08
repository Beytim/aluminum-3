import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import type { EnhancedCuttingJob } from "@/data/enhancedProductionData";

interface Filters {
  search: string;
  status: string;
  priority: string;
  machine: string;
  project: string;
  showHighWaste: boolean;
  showOptimized: boolean;
}

interface Props {
  quickFilter: string;
  onQuickFilterChange: (f: string) => void;
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  projectNames: string[];
  machineNames: string[];
  jobCounts: Record<string, number>;
}

export function CuttingFilters({ quickFilter, onQuickFilterChange, filters, onFiltersChange, projectNames, machineNames, jobCounts }: Props) {
  const quickFilters = [
    { key: 'all', label: 'All', count: jobCounts['all'] || 0 },
    { key: 'Pending', label: 'Pending', count: jobCounts['Pending'] || 0 },
    { key: 'In Progress', label: 'In Progress', count: jobCounts['In Progress'] || 0 },
    { key: 'Completed', label: 'Completed', count: jobCounts['Completed'] || 0 },
    { key: 'high-waste', label: '⚠️ High Waste', count: jobCounts['high-waste'] || 0 },
    { key: 'optimized', label: '✨ Optimized', count: jobCounts['optimized'] || 0 },
  ];

  const activeCount = [filters.status, filters.priority, filters.machine, filters.project, filters.showHighWaste, filters.showOptimized].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({ search: '', status: '', priority: '', machine: '', project: '', showHighWaste: false, showOptimized: false });
    onQuickFilterChange('all');
  };

  return (
    <div className="space-y-2">
      {/* Quick Filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {quickFilters.map(qf => (
          <Button
            key={qf.key}
            variant={quickFilter === qf.key ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7 gap-1"
            onClick={() => onQuickFilterChange(qf.key)}
          >
            {qf.label}
            {qf.count > 0 && <span className="text-[9px] opacity-70">({qf.count})</span>}
          </Button>
        ))}
      </div>

      {/* Search & Advanced Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search job #, material, work order, project..."
            value={filters.search}
            onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Select value={filters.status || 'all-statuses'} onValueChange={v => onFiltersChange({ ...filters, status: v === 'all-statuses' ? '' : v })}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all-statuses">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.priority || 'all-priorities'} onValueChange={v => onFiltersChange({ ...filters, priority: v === 'all-priorities' ? '' : v })}>
          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all-priorities">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
        {machineNames.length > 0 && (
          <Select value={filters.machine || 'all-machines'} onValueChange={v => onFiltersChange({ ...filters, machine: v === 'all-machines' ? '' : v })}>
            <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Machine" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all-machines">All Machines</SelectItem>
              {machineNames.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {projectNames.length > 0 && (
          <Select value={filters.project || 'all-projects'} onValueChange={v => onFiltersChange({ ...filters, project: v === 'all-projects' ? '' : v })}>
            <SelectTrigger className="w-44 h-8 text-xs"><SelectValue placeholder="Project" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all-projects">All Projects</SelectItem>
              {projectNames.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs h-8 gap-1 text-destructive" onClick={clearFilters}>
            <X className="h-3 w-3" />Clear ({activeCount})
          </Button>
        )}
      </div>
    </div>
  );
}
