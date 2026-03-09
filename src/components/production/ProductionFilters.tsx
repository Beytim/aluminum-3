import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import type { ProductionStage, WorkOrderPriority, WorkOrderStatus } from "@/data/enhancedProductionData";

interface Filters {
  search: string;
  stage: string;
  priority: string;
  status: string;
  team: string;
  project: string;
  showOverdue: boolean;
  showBlocked: boolean;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  quickFilter: string;
  onQuickFilter: (f: string) => void;
  projectNames: string[];
  teamNames: string[];
}

const stages: ProductionStage[] = ['Pending', 'Cutting', 'Machining', 'Assembly', 'Welding', 'Glazing', 'Quality Check', 'Packaging', 'Completed'];
const priorities: WorkOrderPriority[] = ['Critical', 'Urgent', 'High', 'Medium', 'Low'];
const statuses: WorkOrderStatus[] = ['Draft', 'Scheduled', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

const quickFilters = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'high-priority', label: 'High Priority' },
];

export function ProductionFilters({ filters, onChange, quickFilter, onQuickFilter, projectNames, teamNames }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeCount = [filters.stage, filters.priority, filters.status, filters.team, filters.project].filter(f => f && f !== 'all').length
    + (filters.showOverdue ? 1 : 0) + (filters.showBlocked ? 1 : 0);

  const clearAll = () => {
    onChange({ search: '', stage: '', priority: '', status: '', team: '', project: '', showOverdue: false, showBlocked: false });
    onQuickFilter('all');
  };

  return (
    <div className="space-y-2">
      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {quickFilters.map(qf => (
          <Button
            key={qf.key}
            variant={quickFilter === qf.key ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7"
            onClick={() => onQuickFilter(qf.key)}
          >
            {qf.label}
          </Button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search WO#, product, project..."
            value={filters.search}
            onChange={e => onChange({ ...filters, search: e.target.value })}
            className="pl-8 h-8 w-48 text-xs"
          />
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setShowAdvanced(!showAdvanced)}>
          <Filter className="h-3 w-3 mr-1" />
          Filters {activeCount > 0 && <Badge className="ml-1 h-4 w-4 p-0 text-[9px] justify-center">{activeCount}</Badge>}
        </Button>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAll}>
            <X className="h-3 w-3 mr-1" />Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-3 bg-muted/30 rounded-lg border">
          <Select value={filters.stage || 'all'} onValueChange={v => onChange({ ...filters, stage: v === 'all' ? '' : v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Stage" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.priority || 'all'} onValueChange={v => onChange({ ...filters, priority: v === 'all' ? '' : v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.status || 'all'} onValueChange={v => onChange({ ...filters, status: v === 'all' ? '' : v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.team || 'all'} onValueChange={v => onChange({ ...filters, team: v === 'all' ? '' : v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Team" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {teamNames.filter(t => t && t.trim() !== '').map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.project || 'all'} onValueChange={v => onChange({ ...filters, project: v === 'all' ? '' : v })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Project" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projectNames.filter(p => p && p.trim() !== '').map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
