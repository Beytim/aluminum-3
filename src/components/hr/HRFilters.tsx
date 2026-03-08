import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface Props {
  tab: string;
  search: string;
  onSearchChange: (s: string) => void;
  quickFilter: string;
  onQuickFilterChange: (f: string) => void;
}

const empFilters = ['all', 'active', 'probation', 'on_leave', 'terminated', 'resigned'];
const leaveFilters = ['all', 'pending', 'approved', 'rejected', 'taken', 'cancelled'];
const payrollFilters = ['all', 'draft', 'calculated', 'approved', 'paid'];

export default function HRFilters({ tab, search, onSearchChange, quickFilter, onQuickFilterChange }: Props) {
  const filters = tab === 'leave' ? leaveFilters : tab === 'payroll' ? payrollFilters : empFilters;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder={`Search ${tab}...`} value={search} onChange={e => onSearchChange(e.target.value)} className="pl-8 h-9 text-xs" />
          {search && <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7" onClick={() => onSearchChange('')}><X className="h-3 w-3" /></Button>}
        </div>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {filters.map(f => (
          <Button key={f} variant={quickFilter === f ? 'default' : 'outline'} size="sm" className="h-7 text-[10px] capitalize" onClick={() => onQuickFilterChange(f)}>
            {f.replace('_', ' ')}
          </Button>
        ))}
      </div>
    </div>
  );
}
