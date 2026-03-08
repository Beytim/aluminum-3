import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { InvoiceStatus, Currency } from "@/data/enhancedFinanceData";

interface Filters {
  search: string;
  status: string;
  currency: string;
  quickFilter: string;
}

interface Props {
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  resultCount: number;
}

const quickFilters = [
  { key: 'all', label: 'All' },
  { key: 'unpaid', label: 'Unpaid' },
  { key: 'partial', label: 'Partial' },
  { key: 'paid', label: 'Paid' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'thisMonth', label: 'This Month' },
];

export default function FinanceFilters({ filters, onFiltersChange, resultCount }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const activeCount = [filters.status, filters.currency].filter(Boolean).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search invoices..." className="pl-8 h-9 text-xs" value={filters.search} onChange={e => onFiltersChange({ ...filters, search: e.target.value })} />
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
          {activeCount > 0 && <Badge variant="secondary" className="h-4 w-4 p-0 text-[9px] flex items-center justify-center">{activeCount}</Badge>}
        </Button>
        <span className="text-[11px] text-muted-foreground ml-auto">{resultCount} results</span>
      </div>

      {showAdvanced && (
        <div className="flex items-center gap-2 flex-wrap p-2 bg-muted/30 rounded-md">
          <Select value={filters.status} onValueChange={v => onFiltersChange({ ...filters, status: v === 'all' ? '' : v })}>
            <SelectTrigger className="h-8 text-xs w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {(['Draft', 'Sent', 'Partial', 'Paid', 'Overdue', 'Cancelled'] as InvoiceStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.currency} onValueChange={v => onFiltersChange({ ...filters, currency: v === 'all' ? '' : v })}>
            <SelectTrigger className="h-8 text-xs w-[100px]"><SelectValue placeholder="Currency" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {(['ETB', 'USD', 'EUR', 'CNY'] as Currency[]).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-[11px] text-destructive" onClick={() => onFiltersChange({ search: filters.search, status: '', currency: '', quickFilter: 'all' })}>
              <X className="h-3 w-3 mr-1" />Clear
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
