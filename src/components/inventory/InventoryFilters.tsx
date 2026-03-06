import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, AlertTriangle, Scissors, ShieldAlert } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  stockFilter: string;
  onStockFilterChange: (v: string) => void;
  qualityFilter: string;
  onQualityFilterChange: (v: string) => void;
  showRemnants: boolean;
  onToggleRemnants: () => void;
  showLowStock: boolean;
  onToggleLowStock: () => void;
  showQuarantine: boolean;
  onToggleQuarantine: () => void;
  lowStockCount: number;
  quarantineCount: number;
  remnantCount: number;
}

export default function InventoryFilters({
  search, onSearchChange, category, onCategoryChange,
  stockFilter, onStockFilterChange, qualityFilter, onQualityFilterChange,
  showRemnants, onToggleRemnants, showLowStock, onToggleLowStock,
  showQuarantine, onToggleQuarantine,
  lowStockCount, quarantineCount, remnantCount,
}: Props) {
  const hasFilters = search || category !== 'all' || stockFilter !== 'all' || qualityFilter !== 'all' || showRemnants || showLowStock || showQuarantine;

  return (
    <Card className="shadow-card">
      <CardContent className="p-3 space-y-2">
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search code, name..." className="pl-9 h-9" value={search} onChange={e => onSearchChange(e.target.value)} />
          </div>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {['Finished Product', 'Profile', 'Glass', 'Hardware', 'Accessory', 'Steel'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={onStockFilterChange}>
            <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
              <SelectItem value="overstock">Overstock</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={qualityFilter} onValueChange={onQualityFilterChange}>
            <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quality</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="quarantine">Quarantine</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant={showLowStock ? "destructive" : "outline"} size="sm" onClick={onToggleLowStock}>
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />Low Stock ({lowStockCount})
          </Button>
          <Button variant={showQuarantine ? "default" : "outline"} size="sm" onClick={onToggleQuarantine} className={showQuarantine ? 'bg-warning text-warning-foreground hover:bg-warning/90' : ''}>
            <ShieldAlert className="h-3.5 w-3.5 mr-1" />Quarantine ({quarantineCount})
          </Button>
          <Button variant={showRemnants ? "default" : "outline"} size="sm" onClick={onToggleRemnants} className={showRemnants ? 'bg-chart-3 text-white hover:bg-chart-3/90' : ''}>
            <Scissors className="h-3.5 w-3.5 mr-1" />Remnants ({remnantCount})
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={() => {
              onSearchChange(''); onCategoryChange('all'); onStockFilterChange('all'); onQualityFilterChange('all');
              if (showRemnants) onToggleRemnants();
              if (showLowStock) onToggleLowStock();
              if (showQuarantine) onToggleQuarantine();
            }}>
              <X className="h-3.5 w-3.5 mr-1" />Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
