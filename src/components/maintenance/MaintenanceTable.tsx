import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Play, CheckCircle, Trash2, AlertTriangle } from "lucide-react";
import type { EnhancedMaintenanceTask } from "@/data/enhancedMaintenanceData";
import { getStatusColor, getStatusLabel, getPriorityColor, getTypeColor, daysUntil, formatETB } from "@/data/enhancedMaintenanceData";

interface Props {
  tasks: EnhancedMaintenanceTask[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onView: (t: EnhancedMaintenanceTask) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MaintenanceTable({ tasks, selectedIds, onToggleSelect, onSelectAll, onView, onStart, onComplete, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"><Checkbox checked={tasks.length > 0 && selectedIds.length === tasks.length} onCheckedChange={onSelectAll} /></TableHead>
          <TableHead className="text-xs">Task #</TableHead>
          <TableHead className="text-xs">Equipment</TableHead>
          <TableHead className="text-xs">Type</TableHead>
          <TableHead className="text-xs">Priority</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs">Date</TableHead>
          <TableHead className="text-xs">Assigned</TableHead>
          <TableHead className="text-xs">Parts</TableHead>
          <TableHead className="text-xs">Cost</TableHead>
          <TableHead className="text-xs">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map(t => {
          const days = daysUntil(t.scheduledDate);
          return (
            <TableRow key={t.id} className={t.isOverdue ? 'bg-destructive/5' : t.isEmergency ? 'bg-orange-500/5' : ''}>
              <TableCell><Checkbox checked={selectedIds.includes(t.id)} onCheckedChange={() => onToggleSelect(t.id)} /></TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono font-medium">{t.taskNumber}</span>
                  {t.isOverdue && <AlertTriangle className="h-3 w-3 text-destructive" />}
                  {t.isEmergency && <AlertTriangle className="h-3 w-3 text-orange-500" />}
                </div>
              </TableCell>
              <TableCell>
                <p className="text-xs font-medium">{t.equipmentName}</p>
                <p className="text-[10px] text-muted-foreground">{t.equipmentNumber}</p>
              </TableCell>
              <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full ${getTypeColor(t.type)}`}>{t.type}</span></TableCell>
              <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full ${getPriorityColor(t.priority)}`}>{t.priority}</span></TableCell>
              <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(t.status)}`}>{getStatusLabel(t.status)}</span></TableCell>
              <TableCell>
                <span className="text-xs">{t.scheduledDate}</span>
                {t.status !== 'completed' && t.status !== 'cancelled' && (
                  <span className={`block text-[10px] ${days < 0 ? 'text-destructive' : days <= 2 ? 'text-warning' : 'text-muted-foreground'}`}>
                    {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `in ${days}d`}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-xs">{t.assignedToNames[0] || 'Unassigned'}</TableCell>
              <TableCell className="text-xs">{t.partsUsed.length}</TableCell>
              <TableCell className="text-xs">{t.totalCost > 0 ? formatETB(t.totalCost) : '-'}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onView(t)}><Eye className="h-3 w-3" /></Button>
                  {(t.status === 'scheduled' || t.status === 'pending_parts') && <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onStart(t.id)}><Play className="h-3 w-3" /></Button>}
                  {(t.status === 'in_progress' || t.status === 'overdue') && <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onComplete(t.id)}><CheckCircle className="h-3 w-3" /></Button>}
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => onDelete(t.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
