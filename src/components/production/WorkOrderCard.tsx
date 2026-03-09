import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Trash2, ArrowRight, AlertTriangle, MoreVertical, FileText, Play, Pause, Ban, Pencil } from "lucide-react";
import type { EnhancedWorkOrder } from "@/data/enhancedProductionData";
import { stageColors, priorityColors, getDaysUntilDue, getDueDateColor, getEfficiencyColor, formatETBShort } from "@/data/enhancedProductionData";

interface Props {
  workOrder: EnhancedWorkOrder;
  onView: (wo: EnhancedWorkOrder) => void;
  onAdvance: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (wo: EnhancedWorkOrder) => void;
  onExportPDF?: (wo: EnhancedWorkOrder) => void;
  onUpdateStatus?: (id: string, status: string) => void;
}

export function WorkOrderCard({ workOrder: wo, onView, onAdvance, onDelete, onEdit, onExportPDF, onUpdateStatus }: Props) {
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
            <p className="text-[10px] text-muted-foreground truncate">{wo.customerName || 'No customer'}</p>
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${priorityColors[wo.priority]}`}>
              {wo.priority}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => onView(wo)}>
                  <Eye className="h-3.5 w-3.5 mr-2" />View Details
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(wo)}>
                    <Pencil className="h-3.5 w-3.5 mr-2" />Edit
                  </DropdownMenuItem>
                )}
                {wo.progress < 100 && wo.status !== 'On Hold' && wo.status !== 'Cancelled' && (
                  <DropdownMenuItem onClick={() => onAdvance(wo.id)}>
                    <ArrowRight className="h-3.5 w-3.5 mr-2" />Advance Stage
                  </DropdownMenuItem>
                )}
                {onExportPDF && (
                  <DropdownMenuItem onClick={() => onExportPDF(wo)}>
                    <FileText className="h-3.5 w-3.5 mr-2" />Export PDF
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {onUpdateStatus && wo.status !== 'On Hold' && wo.status !== 'Completed' && wo.status !== 'Cancelled' && (
                  <DropdownMenuItem onClick={() => onUpdateStatus(wo.id, 'On Hold')}>
                    <Pause className="h-3.5 w-3.5 mr-2" />Put On Hold
                  </DropdownMenuItem>
                )}
                {onUpdateStatus && wo.status === 'On Hold' && (
                  <DropdownMenuItem onClick={() => onUpdateStatus(wo.id, 'In Progress')}>
                    <Play className="h-3.5 w-3.5 mr-2" />Resume
                  </DropdownMenuItem>
                )}
                {onUpdateStatus && wo.status !== 'Cancelled' && wo.status !== 'Completed' && (
                  <DropdownMenuItem onClick={() => onUpdateStatus(wo.id, 'Cancelled')} className="text-destructive">
                    <Ban className="h-3.5 w-3.5 mr-2" />Cancel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(wo.id)} className="text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-2" />Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

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
          <span className="text-muted-foreground">Est: <strong className="text-foreground">{formatETBShort(wo.estimated.totalCost)}</strong></span>
          {wo.variances.efficiency > 0 && (
            <span className={effColor}>Eff: <strong>{wo.variances.efficiency}%</strong></span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
