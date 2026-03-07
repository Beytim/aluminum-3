import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Trash2, ArrowRight, AlertTriangle } from "lucide-react";
import type { EnhancedWorkOrder } from "@/data/enhancedProductionData";
import { stageColors, priorityColors, statusColors, getDaysUntilDue, getDueDateColor, getEfficiencyColor, formatETBShort } from "@/data/enhancedProductionData";

interface Props {
  workOrders: EnhancedWorkOrder[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onView: (wo: EnhancedWorkOrder) => void;
  onAdvance: (id: string) => void;
  onDelete: (id: string) => void;
}

export function WorkOrderTable({ workOrders, selectedIds, onToggleSelect, onSelectAll, onView, onAdvance, onDelete }: Props) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"><Checkbox checked={selectedIds.length === workOrders.length && workOrders.length > 0} onCheckedChange={onSelectAll} /></TableHead>
              <TableHead className="text-xs">WO #</TableHead>
              <TableHead className="text-xs">Product</TableHead>
              <TableHead className="text-xs">Project</TableHead>
              <TableHead className="text-xs">Customer</TableHead>
              <TableHead className="text-xs">Stage</TableHead>
              <TableHead className="text-xs">Progress</TableHead>
              <TableHead className="text-xs text-center">Qty</TableHead>
              <TableHead className="text-xs">Due</TableHead>
              <TableHead className="text-xs">Priority</TableHead>
              <TableHead className="text-xs">Team</TableHead>
              <TableHead className="text-xs text-right">Cost</TableHead>
              <TableHead className="text-xs">Eff.</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders.map(wo => {
              const daysLeft = getDaysUntilDue(wo.scheduledEnd);
              return (
                <TableRow key={wo.id} className={`cursor-pointer hover:bg-muted/50 ${wo.isBlocked ? 'bg-destructive/5' : wo.isOverdue ? 'bg-warning/5' : ''}`} onClick={() => onView(wo)}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selectedIds.includes(wo.id)} onCheckedChange={() => onToggleSelect(wo.id)} />
                  </TableCell>
                  <TableCell className="text-xs font-mono font-medium whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {wo.workOrderNumber}
                      {wo.isOverdue && <AlertTriangle className="h-3 w-3 text-destructive" />}
                      {wo.isBlocked && <span className="text-[8px] px-1 py-0.5 rounded bg-destructive/10 text-destructive">BLK</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs max-w-[120px] truncate">{wo.productName}</TableCell>
                  <TableCell className="text-xs max-w-[120px] truncate text-muted-foreground">{wo.projectName}</TableCell>
                  <TableCell className="text-xs max-w-[100px] truncate text-muted-foreground">{wo.customerName}</TableCell>
                  <TableCell><Badge className={`text-[10px] ${stageColors[wo.currentStage]}`}>{wo.currentStage}</Badge></TableCell>
                  <TableCell className="min-w-[80px]">
                    <div className="flex items-center gap-1.5">
                      <Progress value={wo.progress} className="h-1.5 w-12" />
                      <span className="text-[10px] font-medium">{wo.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-center">{wo.completed}/{wo.quantity}</TableCell>
                  <TableCell className={`text-xs whitespace-nowrap ${getDueDateColor(wo.scheduledEnd)}`}>
                    {daysLeft < 0 ? `${Math.abs(daysLeft)}d late` : `${daysLeft}d`}
                  </TableCell>
                  <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColors[wo.priority]}`}>{wo.priority}</span></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{wo.assignedTeam || '—'}</TableCell>
                  <TableCell className="text-xs text-right font-mono">{formatETBShort(wo.actual.totalCost)}</TableCell>
                  <TableCell>
                    {wo.variances.efficiency > 0 ? (
                      <span className={`text-[10px] font-medium ${getEfficiencyColor(wo.variances.efficiency)}`}>{wo.variances.efficiency}%</span>
                    ) : <span className="text-[10px] text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(wo)}><Eye className="h-3 w-3" /></Button>
                      {wo.progress < 100 && wo.status !== 'On Hold' && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAdvance(wo.id)}><ArrowRight className="h-3 w-3" /></Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(wo.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
