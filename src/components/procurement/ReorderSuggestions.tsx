import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { type ReorderSuggestion, getReorderPriorityColor, procFormatETB } from "@/data/enhancedProcurementData";

interface Props {
  suggestions: ReorderSuggestion[];
  onCreatePO: (s: ReorderSuggestion) => void;
  onDismiss: (id: string) => void;
}

export default function ReorderSuggestions({ suggestions, onCreatePO, onDismiss }: Props) {
  const pending = suggestions.filter(s => s.status === 'Pending');
  if (pending.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">All stock levels are healthy</p>;

  return (
    <Card className="shadow-card">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          Reorder Suggestions ({pending.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Item</TableHead>
              <TableHead className="text-xs">Category</TableHead>
              <TableHead className="text-xs text-right">Stock</TableHead>
              <TableHead className="text-xs text-right">Min</TableHead>
              <TableHead className="text-xs text-right">Days Left</TableHead>
              <TableHead className="text-xs">Priority</TableHead>
              <TableHead className="text-xs text-right">Suggested Qty</TableHead>
              <TableHead className="text-xs">Supplier</TableHead>
              <TableHead className="text-xs text-right">Est. Cost</TableHead>
              <TableHead className="text-xs text-right">Lead Time</TableHead>
              <TableHead className="text-xs w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pending.map(s => (
              <TableRow key={s.id} className={s.priority === 'Critical' ? 'bg-destructive/5' : ''}>
                <TableCell className="text-xs">
                  <div><span className="font-medium">{s.itemName}</span><p className="text-[10px] text-muted-foreground font-mono">{s.itemCode}</p></div>
                </TableCell>
                <TableCell><Badge variant="outline" className="text-[9px]">{s.category}</Badge></TableCell>
                <TableCell className="text-xs text-right font-medium">{s.currentStock}</TableCell>
                <TableCell className="text-xs text-right text-muted-foreground">{s.minStock}</TableCell>
                <TableCell className={`text-xs text-right font-medium ${s.daysUntilStockout <= 5 ? 'text-destructive' : s.daysUntilStockout <= 10 ? 'text-warning' : ''}`}>{s.daysUntilStockout}d</TableCell>
                <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getReorderPriorityColor(s.priority)}`}>{s.priority}</span></TableCell>
                <TableCell className="text-xs text-right font-medium">{s.suggestedQuantity} {s.suggestedUnit}</TableCell>
                <TableCell className="text-xs">{s.preferredSupplierName || '—'}</TableCell>
                <TableCell className="text-xs text-right font-medium">{procFormatETB(s.estimatedTotalCost)}</TableCell>
                <TableCell className="text-xs text-right">{s.supplierLeadTime}d</TableCell>
                <TableCell>
                  <Button size="sm" className="h-6 text-[10px] gap-1" onClick={() => onCreatePO(s)}>
                    <ShoppingCart className="h-3 w-3" />Order
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
