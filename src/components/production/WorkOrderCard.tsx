import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, Trash2, ArrowRight, AlertTriangle } from "lucide-react";
import type { EnhancedWorkOrder } from "@/data/enhancedProductionData";
import { stageColors, priorityColors, getDaysUntilDue, getDueDateColor, getEfficiencyColor, formatETBShort } from "@/data/enhancedProductionData";

interface Props {
  workOrder: EnhancedWorkOrder;
  onView: (wo: EnhancedWorkOrder) => void;
  onAdvance: (id: string) => void;
  onDelete: (id: string) => void;
}

export function WorkOrderCard({ workOrder: wo, onView, onAdvance, onDelete }: Props) {
  const daysLeft = getDaysUntilDue(wo.scheduledEnd);
  const dueDateColor = getDueDateColor(wo.scheduledEnd);
  const effColor = wo.variances.efficiency > 0 ? getEfficiencyColor(wo.variances.efficiency) : 'text-muted-foreground';

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => onView(wo)}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-mono font-medium">{wo.workOrderNumber}</p>
              {wo.isOverdue && <AlertTriangle className="h-3 w-3 text-destructive" />}
              {wo.isBlocked && <span className="text-[9px] px-1 py-0.5 rounded bg-destructive/10 text-destructive">BLOCKED</span>}
            </div>
            <p className="text-sm font-semibold mt-0.5 truncate">{wo.productName}</p>
            <p className="text-[10px] text-muted-foreground truncate">{wo.projectName}</p>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${priorityColors[wo.priority]}`}>
            {wo.priority}
          </span>
        </div>

        {/* Customer */}
        {wo.customerName && (
          <p className="text-[10px] text-muted-foreground">Customer: <strong className="text-foreground">{wo.customerName}</strong></p>
        )}

        {/* Stage & Progress */}
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <Badge className={`text-[10px] ${stageColors[wo.currentStage]}`}>{wo.currentStage}</Badge>
            <span className="font-medium">{wo.progress}%</span>
          </div>
          <Progress value={wo.progress} className="h-1.5" />
        </div>

        {/* Quantities */}
        <div className="grid grid-cols-3 gap-1 text-[10px]">
          <span className="text-muted-foreground">Qty: <strong className="text-foreground">{wo.completed}/{wo.quantity}</strong></span>
          <span className="text-muted-foreground">Scrap: <strong className="text-foreground">{wo.scrap}</strong></span>
          <span className="text-muted-foreground">Good: <strong className="text-foreground">{wo.goodUnits}</strong></span>
        </div>

        {/* Team & Dates */}
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <span className="text-muted-foreground">Team: <strong className="text-foreground">{wo.assignedTeam || 'Unassigned'}</strong></span>
          <span className={`${dueDateColor}`}>
            Due: <strong>{daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}</strong>
          </span>
        </div>

        {/* Costs & Efficiency */}
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <span className="text-muted-foreground">Cost: <strong className="text-foreground">{formatETBShort(wo.actual.totalCost)}</strong></span>
          {wo.variances.efficiency > 0 && (
            <span className={effColor}>Eff: <strong>{wo.variances.efficiency}%</strong></span>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-1 border-t border-border">
          <Button size="sm" variant="ghost" className="text-[10px] h-6 px-2" onClick={(e) => { e.stopPropagation(); onView(wo); }}>
            <Eye className="h-3 w-3 mr-1" />View
          </Button>
          <div className="flex gap-1">
            {wo.progress < 100 && wo.status !== 'On Hold' && wo.status !== 'Cancelled' && (
              <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={(e) => { e.stopPropagation(); onAdvance(wo.id); }}>
                <ArrowRight className="h-3 w-3 mr-1" />Advance
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onDelete(wo.id); }}>
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
