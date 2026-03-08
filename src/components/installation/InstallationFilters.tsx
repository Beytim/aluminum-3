import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { InstallationStatus, InstallationPriority } from "@/data/enhancedInstallationData";

interface Filters {
  search: string;
  status: string;
  priority: string;
  project: string;
  customer: string;
  overdueOnly: boolean;
  withIssues: boolean;
}

interface Props {
  quickFilter: string;
  onQuickFilterChange: (f: string) => void;
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  projectNames: string[];
  customerNames: string[];
}

const quickFilters = [
  { key: 'all', label: 'All' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'today', label: 'Today' },
  { key: 'this_week', label: 'This Week' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'with_issues', label: 'With Issues' },
];

export function InstallationFilters({ quickFilter, onQuickFilterChange, filters, onFiltersChange, projectNames, customerNames }: Props) {
  const hasActive = filters.search || filters.status || filters.priority || filters.project || filters.customer;

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
          <Input placeholder="Search installations..." className="pl-8 h-8 text-xs" value={filters.search} onChange={e => onFiltersChange({ ...filters, search: e.target.value })} />
        </div>

        <Select value={filters.status} onValueChange={v => onFiltersChange({ ...filters, status: v === 'all' ? '' : v })}>
          <SelectTrigger className="h-8 text-xs w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {(['scheduled', 'confirmed', 'in_progress', 'completed', 'delayed', 'cancelled', 'partial'] as InstallationStatus[]).map(s => (
              <SelectItem key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.priority} onValueChange={v => onFiltersChange({ ...filters, priority: v === 'all' ? '' : v })}>
          <SelectTrigger className="h-8 text-xs w-[120px]"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {(['low', 'medium', 'high', 'urgent'] as InstallationPriority[]).map(p => (
              <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.project} onValueChange={v => onFiltersChange({ ...filters, project: v === 'all' ? '' : v })}>
          <SelectTrigger className="h-8 text-xs w-[150px]"><SelectValue placeholder="Project" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projectNames.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.customer} onValueChange={v => onFiltersChange({ ...filters, customer: v === 'all' ? '' : v })}>
          <SelectTrigger className="h-8 text-xs w-[150px]"><SelectValue placeholder="Customer" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            {customerNames.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        {hasActive && (
          <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => onFiltersChange({ search: '', status: '', priority: '', project: '', customer: '', overdueOnly: false, withIssues: false })}>
            <X className="h-3 w-3 mr-1" />Clear
          </Button>
        )}
      </div>
    </div>
  );
}
