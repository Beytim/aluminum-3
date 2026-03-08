import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export interface SupplierFilterState {
  search: string;
  status: string;
  country: string;
  businessType: string;
  ratingFilter: string;
}

export const defaultSupplierFilters: SupplierFilterState = {
  search: '', status: 'all', country: 'all', businessType: 'all', ratingFilter: 'all',
};

interface Props {
  filters: SupplierFilterState;
  onFiltersChange: (f: SupplierFilterState) => void;
  countries: string[];
}

const statuses = ['Active', 'Inactive', 'Pending', 'Blacklisted', 'Prospect'];
const businessTypes = ['Manufacturer', 'Distributor', 'Agent', 'Trader', 'Importer'];

export default function SupplierFilters({ filters, onFiltersChange, countries }: Props) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-3 flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search suppliers..." className="pl-9 h-8 text-xs" value={filters.search} onChange={e => onFiltersChange({ ...filters, search: e.target.value })} />
        </div>
        <Select value={filters.status} onValueChange={v => onFiltersChange({ ...filters, status: v })}>
          <SelectTrigger className="w-28 sm:w-32 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.country} onValueChange={v => onFiltersChange({ ...filters, country: v })}>
          <SelectTrigger className="w-28 sm:w-32 h-8 text-xs"><SelectValue placeholder="Country" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.businessType} onValueChange={v => onFiltersChange({ ...filters, businessType: v })}>
          <SelectTrigger className="w-28 sm:w-32 h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {businessTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.ratingFilter} onValueChange={v => onFiltersChange({ ...filters, ratingFilter: v })}>
          <SelectTrigger className="w-24 sm:w-28 h-8 text-xs"><SelectValue placeholder="Rating" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="high">4+ Stars</SelectItem>
            <SelectItem value="medium">3-4 Stars</SelectItem>
            <SelectItem value="low">&lt;3 Stars</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
