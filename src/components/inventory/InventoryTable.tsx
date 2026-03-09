import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash2, ArrowUpDown, ArrowDownToLine, ArrowUpFromLine, MoreVertical, Download } from "lucide-react";
import { formatETBShort, formatLocation, getStockStatusColor, getStockStatusLabel, getQualityStatusColor, type EnhancedInventoryItem } from "@/data/enhancedInventoryData";

interface Props {
  items: EnhancedInventoryItem[];
  language: 'en' | 'am';
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onView: (item: EnhancedInventoryItem) => void;
  onEdit: (item: EnhancedInventoryItem) => void;
  onDelete: (id: string) => void;
  onReceive: (item: EnhancedInventoryItem) => void;
  onIssue: (item: EnhancedInventoryItem) => void;
  onExportOne: (item: EnhancedInventoryItem) => void;
}

type SortKey = 'itemCode' | 'productName' | 'category' | 'stock' | 'available' | 'unitCost' | 'totalValue';

export default function InventoryTable({ items, language, selectedIds, onToggleSelect, onToggleAll, onView, onEdit, onDelete, onReceive, onIssue }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('itemCode');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sorted = [...items].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'productName') cmp = a.productName.localeCompare(b.productName);
    else if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
    else cmp = (a[sortKey] as number) - (b[sortKey] as number);
    return sortAsc ? cmp : -cmp;
  });

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <TableHead className="text-xs cursor-pointer select-none" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
      </div>
    </TableHead>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">
            <Checkbox checked={selectedIds.length === items.length && items.length > 0} onCheckedChange={onToggleAll} />
          </TableHead>
          <SortHeader label="Code" field="itemCode" />
          <SortHeader label="Product" field="productName" />
          <SortHeader label="Category" field="category" />
          <TableHead className="text-xs">Batch No.</TableHead>
          <SortHeader label="Stock" field="stock" />
          <TableHead className="text-xs text-right">Reserved</TableHead>
          <SortHeader label="Available" field="available" />
          <TableHead className="text-xs">Location</TableHead>
          <SortHeader label="Cost" field="unitCost" />
          <SortHeader label="Value" field="totalValue" />
          <TableHead className="text-xs">Quality</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map(item => {
          const isLow = item.stock <= item.minimum && item.stock > 0;
          const isOut = item.stock === 0;
          const stockPct = item.maximum > 0 ? Math.min((item.stock / item.maximum) * 100, 100) : 0;
          return (
            <TableRow key={item.id} className={`${isOut ? 'bg-destructive/5' : isLow ? 'bg-warning/5' : ''} cursor-pointer`} onClick={() => onView(item)}>
              <TableCell onClick={e => e.stopPropagation()}>
                <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={() => onToggleSelect(item.id)} />
              </TableCell>
              <TableCell className="text-xs font-mono">{item.itemCode}</TableCell>
              <TableCell className="text-xs">
                <div>
                  <span className="font-medium">{language === 'am' ? item.productNameAm : item.productName}</span>
                  {item.isRemnant && <Badge variant="outline" className="text-[8px] ml-1 h-3.5 px-1 border-chart-3/30 text-chart-3">REM</Badge>}
                </div>
              </TableCell>
              <TableCell><Badge variant="secondary" className="text-[10px]">{item.category}</Badge></TableCell>
              <TableCell className="text-[10px] text-muted-foreground">{item.batchNumber || '-'}</TableCell>
              <TableCell className="text-xs">
                <div className="w-20">
                  <div className="font-semibold">{item.stock} {item.primaryUnit}</div>
                  <Progress value={stockPct} className="h-1 mt-0.5" />
                </div>
              </TableCell>
              <TableCell className="text-xs text-right text-muted-foreground">{item.reserved}</TableCell>
              <TableCell className="text-xs text-right font-medium">{item.available}</TableCell>
              <TableCell className="text-[10px] font-mono text-muted-foreground">{formatLocation(item)}</TableCell>
              <TableCell className="text-xs text-right">{formatETBShort(item.unitCost)}</TableCell>
              <TableCell className="text-xs text-right font-semibold">{formatETBShort(item.totalValue)}</TableCell>
              <TableCell><Badge className={`text-[9px] ${getQualityStatusColor(item.qualityStatus)}`}>{item.qualityStatus}</Badge></TableCell>
              <TableCell><Badge className={`text-[9px] ${getStockStatusColor(item)}`}>{getStockStatusLabel(item)}</Badge></TableCell>
              <TableCell onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onReceive(item)}><ArrowDownToLine className="h-3 w-3 text-success" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onIssue(item)}><ArrowUpFromLine className="h-3 w-3 text-warning" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onView(item)}><Eye className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(item)}><Edit className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(item.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
