import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { POStatus, SupplierStatus } from "@/data/enhancedProcurementData";

interface Filters { search: string; status: string; supplierStatus: string; quickFilter: string }

interface Props {
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  resultCount: number;
  tab: string;
}

const poQuickFilters = [
  { key: 'all', label: 'All' }, { key: 'draft', label: 'Draft' }, { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' }, { key: 'received', label: 'Received' }, { key: 'overdue', label: 'Overdue' },
];

const supQuickFilters = [
  { key: 'all', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'preferred', label: 'Preferred' },
  { key: 'highRated', label: '4+ Stars' },
];

export default function ProcurementFilters({ filters, onFiltersChange, resultCount, tab }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const quickFilters = tab === 'suppliers' ? supQuickFilters : poQuickFilters;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder={tab === 'suppliers' ? 'Search suppliers...' : 'Search POs...'} className="pl-8 h-9 text-xs" value={filters.search} onChange={e => onFiltersChange({ ...filters, search: e.target.value })} />
        </div>
        <div className="flex gap-1 flex-wrap">
          {quickFilters.map(qf => (
            <Button key={qf.key} variant={filters.quickFilter === qf.key ? 'default' : 'outline'} size="sm" className="h-7 text-[11px] px-2.5"
              onClick={() => onFiltersChange({ ...filters, quickFilter: qf.key })}>
              {qf.label}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1" onClick={() => setShowAdvanced(!showAdvanced)}>
          <SlidersHorizontal className="h-3 w-3" />Filters
        </Button>
        <span className="text-[11px] text-muted-foreground ml-auto">{resultCount} results</span>
      </div>
      {showAdvanced && (
        <div className="flex items-center gap-2 flex-wrap p-2 bg-muted/30 rounded-md">
          {tab === 'purchase-orders' && (
            <Select value={filters.status || 'all'} onValueChange={v => onFiltersChange({ ...filters, status: v === 'all' ? '' : v })}>
              <SelectTrigger className="h-8 text-xs w-[140px]"><SelectValue placeholder="PO Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {(['Draft', 'Sent', 'Confirmed', 'Shipped', 'Received', 'Cancelled'] as POStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {tab === 'suppliers' && (
            <Select value={filters.supplierStatus || 'all'} onValueChange={v => onFiltersChange({ ...filters, supplierStatus: v === 'all' ? '' : v })}>
              <SelectTrigger className="h-8 text-xs w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {(['Active', 'Inactive', 'Pending', 'Prospect'] as SupplierStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          <Button variant="ghost" size="sm" className="h-7 text-[11px] text-destructive" onClick={() => onFiltersChange({ search: '', status: '', supplierStatus: '', quickFilter: 'all' })}>
            <X className="h-3 w-3 mr-1" />Clear
          </Button>
        </div>
      )}
    </div>
  );
}
