import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface QuoteFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  customerFilter: string;
  onCustomerChange: (v: string) => void;
  customers: string[];
  activeFilterCount: number;
  onClearAll: () => void;
}

export function QuoteFilters({ search, onSearchChange, statusFilter, onStatusChange, customerFilter, onCustomerChange, customers, activeFilterCount, onClearAll }: QuoteFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Search quotes..." value={search} onChange={e => onSearchChange(e.target.value)} className="pl-8 h-9 text-xs" />
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Draft">Draft</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Accepted">Accepted</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
          <SelectItem value="Expired">Expired</SelectItem>
          <SelectItem value="Converted">Converted</SelectItem>
        </SelectContent>
      </Select>
      <Select value={customerFilter} onValueChange={onCustomerChange}>
        <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue placeholder="Customer" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Customers</SelectItem>
          {customers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={onClearAll} className="h-9 text-xs gap-1">
          <X className="h-3 w-3" /> Clear ({activeFilterCount})
        </Button>
      )}
    </div>
  );
}
