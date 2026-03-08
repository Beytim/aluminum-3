import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { MaintenanceStatus, MaintenancePriority, MaintenanceType } from "@/data/enhancedMaintenanceData";

interface Filters {
  search: string;
  status: string;
  priority: string;
  type: string;
  equipment: string;
  department: string;
}

interface Props {
  quickFilter: string;
  onQuickFilterChange: (f: string) => void;
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  equipmentNames: string[];
  departments: string[];
}

const quickFilters = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'critical', label: 'Critical' },
  { key: 'today', label: 'Today' },
  { key: 'this_week', label: 'This Week' },
];

export function MaintenanceFilters({ quickFilter, onQuickFilterChange, filters, onFiltersChange, equipmentNames, departments }: Props) {
  const hasActive = filters.search || filters.status || filters.priority || filters.type || filters.equipment || filters.department;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {quickFilters.map(f => (
          <Button key={f.key} size="sm" variant={quickFilter === f.key ? 'default' : 'outline'} className="text-xs h-7" onClick={() => onQuickFilterChange(f.key)}>
            {f.label}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search tasks, equipment..." className="pl-8 h-8 text-xs" value={filters.search} onChange={e => onFiltersChange({ ...filters, search: e.target.value })} />
        </div>
        <Select value={filters.status} onValueChange={v => onFiltersChange({ ...filters, status: v === 'all' ? '' : v })}>
          <SelectTrigger className="h-8 text-xs w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {(['scheduled', 'pending_parts', 'in_progress', 'completed', 'overdue', 'cancelled', 'deferred'] as MaintenanceStatus[]).map(s => (
              <SelectItem key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.priority} onValueChange={v => onFiltersChange({ ...filters, priority: v === 'all' ? '' : v })}>
          <SelectTrigger className="h-8 text-xs w-[120px]"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {(['critical', 'high', 'medium', 'low', 'planned'] as MaintenancePriority[]).map(p => (
              <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.type} onValueChange={v => onFiltersChange({ ...filters, type: v === 'all' ? '' : v })}>
          <SelectTrigger className="h-8 text-xs w-[130px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {(['preventive', 'corrective', 'emergency', 'predictive', 'calibration', 'inspection', 'overhaul'] as MaintenanceType[]).map(t => (
              <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.department} onValueChange={v => onFiltersChange({ ...filters, department: v === 'all' ? '' : v })}>
          <SelectTrigger className="h-8 text-xs w-[130px]"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Depts</SelectItem>
            {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        {hasActive && (
          <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => onFiltersChange({ search: '', status: '', priority: '', type: '', equipment: '', department: '' })}>
            <X className="h-3 w-3 mr-1" />Clear
          </Button>
        )}
      </div>
    </div>
  );
}
