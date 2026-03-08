import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, ChevronRight, Trash2, AlertTriangle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { type EnhancedPurchaseOrder, getPOStatusColor, procFormatCurrency } from "@/data/enhancedProcurementData";

interface Props {
  purchaseOrders: EnhancedPurchaseOrder[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: () => void;
  onView: (po: EnhancedPurchaseOrder) => void;
  onAdvance: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function PurchaseOrderTable({ purchaseOrders, selectedIds, onSelectToggle, onSelectAll, onView, onAdvance, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"><Checkbox checked={selectedIds.length === purchaseOrders.length && purchaseOrders.length > 0} onCheckedChange={onSelectAll} /></TableHead>
          <TableHead className="text-xs">PO #</TableHead>
          <TableHead className="text-xs">Supplier</TableHead>
          <TableHead className="text-xs">Project</TableHead>
          <TableHead className="text-xs">Order Date</TableHead>
          <TableHead className="text-xs">Expected</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs text-right">Total</TableHead>
          <TableHead className="text-xs text-right">Paid</TableHead>
          <TableHead className="text-xs">Received</TableHead>
          <TableHead className="text-xs">Ship</TableHead>
          <TableHead className="text-xs w-24"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchaseOrders.map(po => {
          const totalQty = po.items.reduce((s, i) => s + i.quantity, 0);
          const recQty = po.items.reduce((s, i) => s + i.received, 0);
          const recPct = totalQty > 0 ? (recQty / totalQty) * 100 : 0;
          return (
            <TableRow key={po.id} className={po.isOverdue ? 'bg-destructive/5' : ''}>
              <TableCell><Checkbox checked={selectedIds.includes(po.id)} onCheckedChange={() => onSelectToggle(po.id)} /></TableCell>
              <TableCell className="text-xs font-mono">
                <span className="flex items-center gap-1">
                  {po.poNumber}
                  {po.isOverdue && <AlertTriangle className="h-3 w-3 text-destructive" />}
                  {po.isUrgent && <Clock className="h-3 w-3 text-warning" />}
                </span>
              </TableCell>
              <TableCell className="text-xs font-medium">{po.supplierName}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{po.projectName || '—'}</TableCell>
              <TableCell className="text-xs">{po.orderDate}</TableCell>
              <TableCell className="text-xs">{po.expectedDelivery}</TableCell>
              <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPOStatusColor(po.status)}`}>{po.status}</span></TableCell>
              <TableCell className="text-xs text-right font-semibold">{procFormatCurrency(po.total, po.currency)}</TableCell>
              <TableCell className="text-xs text-right text-success">{procFormatCurrency(po.paid, po.currency)}</TableCell>
              <TableCell className="w-20">
                <div className="space-y-0.5">
                  <Progress value={recPct} className="h-1.5" />
                  <p className="text-[9px] text-muted-foreground text-center">{recPct.toFixed(0)}%</p>
                </div>
              </TableCell>
              <TableCell>
                {po.shippingMethod && <Badge variant="outline" className="text-[9px]">{po.shippingMethod}</Badge>}
              </TableCell>
              <TableCell>
                <div className="flex gap-0.5">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(po)}><Eye className="h-3 w-3" /></Button>
                  {!['Received', 'Cancelled'].includes(po.status) && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAdvance(po.id)}><ChevronRight className="h-3 w-3" /></Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(po.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
        {purchaseOrders.length === 0 && <TableRow><TableCell colSpan={12} className="text-center text-muted-foreground py-8">No purchase orders found</TableCell></TableRow>}
      </TableBody>
    </Table>
  );
}
