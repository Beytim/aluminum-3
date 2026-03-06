import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, Edit, Trash2, ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft } from "lucide-react";
import { formatETBShort, formatLocation, getStockStatusColor, getStockStatusLabel, getQualityStatusColor, type EnhancedInventoryItem } from "@/data/enhancedInventoryData";

interface Props {
  item: EnhancedInventoryItem;
  language: 'en' | 'am';
  onView: (item: EnhancedInventoryItem) => void;
  onEdit: (item: EnhancedInventoryItem) => void;
  onDelete: (id: string) => void;
  onReceive: (item: EnhancedInventoryItem) => void;
  onIssue: (item: EnhancedInventoryItem) => void;
}

export default function InventoryCard({ item, language, onView, onEdit, onDelete, onReceive, onIssue }: Props) {
  const stockPercent = item.maximum > 0 ? Math.min((item.stock / item.maximum) * 100, 100) : 0;
  const isLow = item.stock <= item.minimum && item.stock > 0;
  const isOut = item.stock === 0;

  return (
    <Card className={`shadow-card hover:shadow-md transition-all cursor-pointer ${isOut ? 'border-destructive/30' : isLow ? 'border-warning/30' : ''}`} onClick={() => onView(item)}>
      <CardContent className="p-3 space-y-2.5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-mono text-muted-foreground">{item.itemCode}</span>
              {item.isRemnant && <Badge variant="outline" className="text-[9px] h-4 px-1 border-chart-3/30 text-chart-3">REM</Badge>}
            </div>
            <h3 className="text-sm font-semibold text-foreground truncate">
              {language === 'am' ? item.productNameAm : item.productName}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{item.category}</Badge>
              <Badge variant="outline" className="text-[9px] h-4 px-1.5">{item.productType}</Badge>
            </div>
          </div>
          <Badge className={`text-[9px] h-5 ${getStockStatusColor(item)}`}>{getStockStatusLabel(item)}</Badge>
        </div>

        {/* Stock Bar */}
        <div>
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-muted-foreground">Stock: <strong className="text-foreground">{item.stock}</strong> {item.primaryUnit}</span>
            <span className="text-muted-foreground">Max: {item.maximum}</span>
          </div>
          <Progress value={stockPercent} className="h-1.5" />
          <div className="flex justify-between text-[10px] mt-1 text-muted-foreground">
            <span>Reserved: {item.reserved}</span>
            <span className="font-medium text-foreground">Available: {item.available}</span>
          </div>
        </div>

        {/* Location */}
        <div className="text-[10px] text-muted-foreground">
          📍 {formatLocation(item)} · {item.bin}
        </div>

        {/* Cost & Value */}
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Cost: {formatETBShort(item.unitCost)}/{item.primaryUnit}</span>
          <span className="font-semibold text-foreground">{formatETBShort(item.totalValue)}</span>
        </div>

        {/* Quality + Supplier */}
        <div className="flex items-center justify-between text-[10px]">
          <Badge className={`text-[9px] h-4 ${getQualityStatusColor(item.qualityStatus)}`}>{item.qualityStatus}</Badge>
          {item.supplierName && <span className="text-muted-foreground truncate ml-2">{item.supplierName}</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pt-1 border-t border-border">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); onReceive(item); }}>
            <ArrowDownToLine className="h-3 w-3 text-success" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); onIssue(item); }}>
            <ArrowUpFromLine className="h-3 w-3 text-warning" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); onView(item); }}>
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); onEdit(item); }}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); onDelete(item.id); }}>
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
