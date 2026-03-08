import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Calendar, AlertTriangle, Eye, Play, CheckCircle, Clock, Trash2, Users } from "lucide-react";
import type { EnhancedMaintenanceTask } from "@/data/enhancedMaintenanceData";
import { getStatusColor, getStatusLabel, getPriorityColor, getTypeColor, daysUntil } from "@/data/enhancedMaintenanceData";

interface Props {
  task: EnhancedMaintenanceTask;
  onView: (t: EnhancedMaintenanceTask) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MaintenanceCard({ task, onView, onStart, onComplete, onDelete }: Props) {
  const completedChecks = task.checklist.filter(c => c.completed).length;
  const totalChecks = task.checklist.length;
  const progress = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;
  const days = daysUntil(task.scheduledDate);

  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow cursor-pointer ${task.isOverdue ? 'border-destructive/30' : task.isEmergency ? 'border-orange-500/30' : ''}`} onClick={() => onView(task)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Wrench className={`h-3.5 w-3.5 ${task.isEmergency ? 'text-destructive' : 'text-primary'}`} />
              <p className="text-xs font-mono text-muted-foreground">{task.taskNumber}</p>
              {task.isOverdue && <AlertTriangle className="h-3 w-3 text-destructive" />}
              {task.isEmergency && <AlertTriangle className="h-3 w-3 text-orange-500" />}
            </div>
            <h3 className="text-sm font-semibold mt-0.5 text-foreground">{task.title}</h3>
            <p className="text-[10px] text-muted-foreground">{task.equipmentName}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(task.status)}`}>{getStatusLabel(task.status)}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${getTypeColor(task.type)}`}>{task.type}</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{task.scheduledDate}</span>
            {task.status !== 'completed' && task.status !== 'cancelled' && (
              <span className={days < 0 ? 'text-destructive font-medium' : days <= 2 ? 'text-warning font-medium' : ''}>
                ({days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d`})
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />Est. {task.scheduledDuration}hrs
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Users className="h-3 w-3" />{task.assignedToNames.join(', ') || 'Unassigned'}
          </div>
        </div>

        {totalChecks > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">{completedChecks}/{totalChecks} checks</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {task.totalCost > 0 && <p className="text-[10px] text-muted-foreground">Cost: ETB {task.totalCost.toLocaleString()}</p>}
        {task.downtimeHours && <p className="text-[10px] text-warning">⏱ {task.downtimeHours}hrs downtime</p>}

        <div className="flex items-center justify-between pt-1 border-t border-border" onClick={e => e.stopPropagation()}>
          <Button size="sm" variant="ghost" className="text-[10px] h-6 px-2" onClick={() => onView(task)}>
            <Eye className="h-3 w-3 mr-1" />View
          </Button>
          <div className="flex gap-1">
            {(task.status === 'scheduled' || task.status === 'pending_parts') && (
              <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={() => onStart(task.id)}>
                <Play className="h-3 w-3 mr-1" />Start
              </Button>
            )}
            {(task.status === 'in_progress' || task.status === 'overdue') && (
              <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={() => onComplete(task.id)}>
                <CheckCircle className="h-3 w-3 mr-1" />Complete
              </Button>
            )}
            <Button size="sm" variant="ghost" className="text-[10px] h-6 px-1.5 text-destructive" onClick={() => onDelete(task.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
