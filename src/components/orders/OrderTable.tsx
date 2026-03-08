import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Eye, Trash2, AlertTriangle } from "lucide-react";
import type { EnhancedOrder } from "@/data/enhancedOrderData";
import { getOrderStatusColor, getPaymentStatusColor, formatETBFull } from "@/data/enhancedOrderData";

interface Props {
  orders: EnhancedOrder[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onView: (o: EnhancedOrder) => void;
  onDelete: (id: string) => void;
}

export function OrderTable({ orders, selectedIds, onSelect, onSelectAll, onView, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"><Checkbox checked={selectedIds.length === orders.length && orders.length > 0} onCheckedChange={onSelectAll} /></TableHead>
            <TableHead className="text-xs">Order #</TableHead>
            <TableHead className="text-xs">Customer</TableHead>
            <TableHead className="text-xs hidden lg:table-cell">Project</TableHead>
            <TableHead className="text-xs hidden md:table-cell">Date</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs hidden sm:table-cell">Payment</TableHead>
            <TableHead className="text-xs text-right">Total</TableHead>
            <TableHead className="text-xs text-right hidden sm:table-cell">Balance</TableHead>
            <TableHead className="text-xs text-center hidden md:table-cell">Items</TableHead>
            <TableHead className="text-xs text-center hidden lg:table-cell">WO</TableHead>
            <TableHead className="text-xs text-right w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(o => {
            const payPct = o.total > 0 ? (o.totalPaid / o.total) * 100 : 0;
            return (
              <TableRow key={o.id} className={`cursor-pointer hover:bg-muted/50 ${o.isOverdue ? 'bg-destructive/5' : ''}`} onClick={() => onView(o)}>
                <TableCell onClick={e => e.stopPropagation()}><Checkbox checked={selectedIds.includes(o.id)} onCheckedChange={() => onSelect(o.id)} /></TableCell>
                <TableCell className="text-xs font-mono font-medium">
                  <div className="flex items-center gap-1">{o.orderNumber}{o.isOverdue && <AlertTriangle className="h-3 w-3 text-destructive" />}</div>
                </TableCell>
                <TableCell className="text-xs">{o.customerName}</TableCell>
                <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">{o.projectName || '—'}</TableCell>
                <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{o.orderDate}</TableCell>
                <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getOrderStatusColor(o.status)}`}>{o.status}</span></TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="space-y-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getPaymentStatusColor(o.paymentStatus)}`}>{o.paymentStatus}</span>
                    <Progress value={payPct} className="h-1 w-16" />
                  </div>
                </TableCell>
                <TableCell className="text-xs text-right font-semibold">{formatETBFull(o.total)}</TableCell>
                <TableCell className="text-xs text-right hidden sm:table-cell">
                  {o.balance > 0 ? <span className="text-warning font-medium">{formatETBFull(o.balance)}</span> : <span className="text-success">—</span>}
                </TableCell>
                <TableCell className="text-xs text-center hidden md:table-cell">{o.items.length}</TableCell>
                <TableCell className="text-xs text-center hidden lg:table-cell">{o.workOrderIds.length || '—'}</TableCell>
                <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(o)}><Eye className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(o.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
