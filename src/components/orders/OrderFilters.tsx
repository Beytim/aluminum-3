import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X } from "lucide-react";

const quickFilters = [
  { value: 'all', label: 'All' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'unpaid', label: 'Unpaid' },
];

interface Filters {
  search: string;
  status: string;
  customer: string;
  project: string;
  paymentStatus: string;
}

interface Props {
  quickFilter: string;
  onQuickFilterChange: (v: string) => void;
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  customerNames: string[];
  projectNames: string[];
}

export function OrderFilters({ quickFilter, onQuickFilterChange, filters, onFiltersChange, customerNames, projectNames }: Props) {
  const activeCount = [filters.status, filters.customer, filters.project, filters.paymentStatus].filter(Boolean).length;

  return (
    <Card className="shadow-card">
      <CardContent className="p-3 space-y-3">
        <div className="flex gap-1.5 flex-wrap">
          {quickFilters.map(f => (
            <Button key={f.value} variant={quickFilter === f.value ? 'default' : 'outline'} size="sm" className="h-7 text-xs" onClick={() => onQuickFilterChange(f.value)}>
              {f.label}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-8 h-9 text-xs" value={filters.search} onChange={e => onFiltersChange({ ...filters, search: e.target.value })} />
          </div>
          <Select value={filters.status || 'all_statuses'} onValueChange={v => onFiltersChange({ ...filters, status: v === 'all_statuses' ? '' : v })}>
            <SelectTrigger className="w-32 h-9 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all_statuses">All Statuses</SelectItem>
              {['Draft', 'Quote Accepted', 'Payment Received', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Completed', 'Cancelled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.customer || 'all_customers'} onValueChange={v => onFiltersChange({ ...filters, customer: v === 'all_customers' ? '' : v })}>
            <SelectTrigger className="w-36 h-9 text-xs"><SelectValue placeholder="Customer" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all_customers">All Customers</SelectItem>
              {customerNames.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.paymentStatus || 'all_payments'} onValueChange={v => onFiltersChange({ ...filters, paymentStatus: v === 'all_payments' ? '' : v })}>
            <SelectTrigger className="w-28 h-9 text-xs"><SelectValue placeholder="Payment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all_payments">All</SelectItem>
              {['Paid', 'Partial', 'Unpaid'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" className="h-9 text-xs" onClick={() => onFiltersChange({ search: '', status: '', customer: '', project: '', paymentStatus: '' })}>
              <X className="h-3 w-3 mr-1" />Clear ({activeCount})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
