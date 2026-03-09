import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  catFilter: string;
  onCatFilterChange: (v: string) => void;
  typeFilter: string;
  onTypeFilterChange: (v: string) => void;
  stockFilter: string;
  onStockFilterChange: (v: string) => void;
  marginFilter: string;
  onMarginFilterChange: (v: string) => void;
  categories: string[];
}

export default function ProductFilters({
  search, onSearchChange, catFilter, onCatFilterChange,
  typeFilter, onTypeFilterChange, stockFilter, onStockFilterChange,
  marginFilter, onMarginFilterChange, categories,
}: Props) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-3 flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9 h-8 text-xs" value={search} onChange={e => onSearchChange(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={onCatFilterChange}>
          <SelectTrigger className="w-28 sm:w-36 h-8 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-28 sm:w-32 h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="finished">Finished Goods</SelectItem>
            <SelectItem value="Raw Material">Raw Material</SelectItem>
            <SelectItem value="Fabricated">Fabricated</SelectItem>
            <SelectItem value="System">System</SelectItem>
            <SelectItem value="Custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={onStockFilterChange}>
          <SelectTrigger className="w-24 sm:w-28 h-8 text-xs"><SelectValue placeholder="Stock" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="over">Overstock</SelectItem>
          </SelectContent>
        </Select>
        <Select value={marginFilter} onValueChange={onMarginFilterChange}>
          <SelectTrigger className="w-24 sm:w-28 h-8 text-xs"><SelectValue placeholder="Margin" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Margin</SelectItem>
            <SelectItem value="high">High (&gt;40%)</SelectItem>
            <SelectItem value="medium">Medium (25-40%)</SelectItem>
            <SelectItem value="low">Low (&lt;25%)</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
