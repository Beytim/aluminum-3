import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, CreditCard, Truck, Trash2, AlertTriangle, Factory, Scissors } from "lucide-react";
import type { EnhancedOrder } from "@/data/enhancedOrderData";
import { getOrderStatusColor, getPaymentStatusColor, formatETBFull } from "@/data/enhancedOrderData";

interface Props {
  order: EnhancedOrder;
  onView: (o: EnhancedOrder) => void;
  onDelete: (id: string) => void;
}

export function OrderCard({ order, onView, onDelete }: Props) {
  const paymentPercent = order.total > 0 ? (order.totalPaid / order.total) * 100 : 0;
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Card className="shadow-card hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(order)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-foreground">{order.orderNumber}</span>
              {order.isOverdue && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
            </div>
            <p className="text-xs text-muted-foreground">{order.customerName}</p>
            {order.projectName && <p className="text-[10px] text-muted-foreground">📁 {order.projectName}</p>}
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getOrderStatusColor(order.status)}`}>{order.status}</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>{order.items.length} items · {totalQty} units</span>
          {order.workOrderIds.length > 0 && <span className="flex items-center gap-0.5"><Factory className="h-3 w-3" />{order.workOrderIds.length}</span>}
          {order.cuttingJobIds.length > 0 && <span className="flex items-center gap-0.5"><Scissors className="h-3 w-3" />{order.cuttingJobIds.length}</span>}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-semibold">{formatETBFull(order.total)}</span>
            <span className={`font-medium ${getPaymentStatusColor(order.paymentStatus)} px-1.5 py-0.5 rounded text-[10px]`}>{order.paymentStatus}</span>
          </div>
          <Progress value={paymentPercent} className="h-1.5" />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Paid: {formatETBFull(order.totalPaid)}</span>
            {order.balance > 0 && <span className="text-warning font-medium">Bal: {formatETBFull(order.balance)}</span>}
          </div>
        </div>

        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Ordered: {order.orderDate}</span>
          <span>Due: {order.dueDate}</span>
        </div>

        <div className="flex gap-1 justify-end pt-1 border-t border-border">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); onView(order); }}><Eye className="h-3 w-3" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); onDelete(order.id); }}><Trash2 className="h-3 w-3 text-destructive" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}
