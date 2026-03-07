import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import type { EnhancedWorkOrder, ProductionStage } from "@/data/enhancedProductionData";
import { stageColors, priorityColors } from "@/data/enhancedProductionData";

const kanbanStages: ProductionStage[] = ['Pending', 'Cutting', 'Machining', 'Assembly', 'Welding', 'Glazing', 'Quality Check', 'Packaging'];

interface Props {
  workOrders: EnhancedWorkOrder[];
  onView: (wo: EnhancedWorkOrder) => void;
  onAdvance: (id: string) => void;
}

export function StageBoard({ workOrders, onView, onAdvance }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 overflow-x-auto">
      {kanbanStages.map(stage => {
        const stageWOs = workOrders.filter(w => w.currentStage === stage && w.status !== 'Completed' && w.status !== 'Cancelled');
        return (
          <div key={stage} className="min-w-[140px]">
            <div className="flex items-center gap-1 mb-2 px-1">
              <Badge className={`text-[9px] ${stageColors[stage]}`}>{stage}</Badge>
              <span className="text-[10px] text-muted-foreground font-medium">({stageWOs.length})</span>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {stageWOs.map(wo => (
                <Card
                  key={wo.id}
                  className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
                  onClick={() => onView(wo)}
                >
                  <CardContent className="p-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-medium">{wo.workOrderNumber.replace('WO-2025-', 'WO-')}</span>
                      <div className="flex items-center gap-0.5">
                        {wo.isOverdue && <AlertTriangle className="h-2.5 w-2.5 text-destructive" />}
                        {wo.isBlocked && <span className="text-[7px] px-1 rounded bg-destructive/10 text-destructive">BLK</span>}
                      </div>
                    </div>
                    <p className="text-[10px] font-medium truncate">{wo.productName}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{wo.projectName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-muted-foreground">Q: {wo.completed}/{wo.quantity}</span>
                      <span className={`text-[8px] px-1 py-0.5 rounded ${priorityColors[wo.priority]}`}>{wo.priority[0]}</span>
                    </div>
                    <Progress value={wo.progress} className="h-1" />
                  </CardContent>
                </Card>
              ))}
              {stageWOs.length === 0 && (
                <div className="text-[10px] text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                  Empty
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
