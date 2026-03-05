import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";

export interface CustomerFilterState {
  search: string;
  type: string;
  status: string;
  healthStatus: string;
  tag: string;
  city: string;
}

const defaultFilters: CustomerFilterState = {
  search: '', type: 'all', status: 'all', healthStatus: 'all', tag: 'all', city: 'all',
};

const customerTypes = ['Individual', 'Company', 'Contractor', 'Developer', 'Retail', 'Wholesale', 'Fabricator', 'Distributor'];
const healthStatuses = ['healthy', 'attention', 'at-risk', 'critical'];
const commonTags = ['vip', 'new', 'repeat', 'high-value', 'at-risk', 'commercial', 'residential', 'government', 'prospect'];

interface Props {
  filters: CustomerFilterState;
  onChange: (filters: CustomerFilterState) => void;
  cities: string[];
}

export function CustomerFilters({ filters, onChange, cities }: Props) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = Object.entries(filters).filter(([k, v]) => k !== 'search' && v !== 'all' && v !== '').length;

  const update = (key: keyof CustomerFilterState, value: string) => onChange({ ...filters, [key]: value });
  const clearAll = () => onChange(defaultFilters);

  return (
    <Card className="shadow-card">
      <CardContent className="p-3 space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, phone, contact..."
              className="pl-9 h-9"
              value={filters.search}
              onChange={e => update('search', e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={() => setExpanded(!expanded)}>
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeCount > 0 && <Badge variant="default" className="h-4 w-4 p-0 text-[10px] flex items-center justify-center rounded-full">{activeCount}</Badge>}
          </Button>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" className="h-9 text-xs" onClick={clearAll}>
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}
        </div>

        {expanded && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
            <Select value={filters.type} onValueChange={v => update('type', v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {customerTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={v => update('status', v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.healthStatus} onValueChange={v => update('healthStatus', v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Health" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Health</SelectItem>
                {healthStatuses.map(h => <SelectItem key={h} value={h} className="capitalize">{h}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filters.tag} onValueChange={v => update('tag', v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Tag" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {commonTags.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filters.city} onValueChange={v => update('city', v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="City" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {activeCount > 0 && (
          <div className="flex flex-wrap gap-1">
            {filters.type !== 'all' && <Badge variant="secondary" className="text-[10px] gap-1">{filters.type}<X className="h-2.5 w-2.5 cursor-pointer" onClick={() => update('type', 'all')} /></Badge>}
            {filters.status !== 'all' && <Badge variant="secondary" className="text-[10px] gap-1">{filters.status}<X className="h-2.5 w-2.5 cursor-pointer" onClick={() => update('status', 'all')} /></Badge>}
            {filters.healthStatus !== 'all' && <Badge variant="secondary" className="text-[10px] gap-1">{filters.healthStatus}<X className="h-2.5 w-2.5 cursor-pointer" onClick={() => update('healthStatus', 'all')} /></Badge>}
            {filters.tag !== 'all' && <Badge variant="secondary" className="text-[10px] gap-1">{filters.tag}<X className="h-2.5 w-2.5 cursor-pointer" onClick={() => update('tag', 'all')} /></Badge>}
            {filters.city !== 'all' && <Badge variant="secondary" className="text-[10px] gap-1">{filters.city}<X className="h-2.5 w-2.5 cursor-pointer" onClick={() => update('city', 'all')} /></Badge>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { defaultFilters as defaultCustomerFilters };
