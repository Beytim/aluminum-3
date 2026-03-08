import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, AlertTriangle, Eye, Play, CheckCircle, Clock, Trash2 } from "lucide-react";
import type { EnhancedInstallation } from "@/data/enhancedInstallationData";
import { getStatusColor, getStatusLabel, getPriorityColor, daysUntil } from "@/data/enhancedInstallationData";

interface Props {
  installation: EnhancedInstallation;
  onView: (inst: EnhancedInstallation) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function InstallationCard({ installation: inst, onView, onStart, onComplete, onDelete }: Props) {
  const totalItems = inst.items.reduce((s, i) => s + i.quantity, 0);
  const installedItems = inst.items.reduce((s, i) => s + i.installedQuantity, 0);
  const progress = totalItems > 0 ? Math.round((installedItems / totalItems) * 100) : 0;
  const days = daysUntil(inst.scheduledDate);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(inst)}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-mono text-muted-foreground">{inst.installationNumber}</p>
              {inst.isOverdue && <AlertTriangle className="h-3 w-3 text-destructive" />}
            </div>
            <h3 className="text-sm font-semibold mt-0.5 text-foreground">{inst.customerName}</h3>
            {inst.projectName && <p className="text-[10px] text-muted-foreground">{inst.projectName}</p>}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(inst.status)}`}>
              {getStatusLabel(inst.status)}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPriorityColor(inst.priority)}`}>
              {inst.priority.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Location & Date */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{inst.siteAddress}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{inst.scheduledDate} {inst.scheduledStartTime && `at ${inst.scheduledStartTime}`}</span>
            {inst.status !== 'completed' && inst.status !== 'cancelled' && (
              <span className={days < 0 ? 'text-destructive font-medium' : days <= 2 ? 'text-warning font-medium' : ''}>
                ({days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d away`})
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Users className="h-3 w-3 shrink-0" />
            <span>{inst.teamLead} · {inst.teamSize} members</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            <span>Est. {inst.estimatedDuration}hrs</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground">{installedItems}/{totalItems} items</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Issues */}
        {inst.hasIssues && (
          <div className="flex items-center gap-1 text-[10px] text-warning">
            <AlertTriangle className="h-3 w-3" />
            <span>{inst.issueCount} issue{inst.issueCount > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-border" onClick={e => e.stopPropagation()}>
          <Button size="sm" variant="ghost" className="text-[10px] h-6 px-2" onClick={() => onView(inst)}>
            <Eye className="h-3 w-3 mr-1" />View
          </Button>
          <div className="flex gap-1">
            {inst.status === 'scheduled' || inst.status === 'confirmed' ? (
              <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={() => onStart(inst.id)}>
                <Play className="h-3 w-3 mr-1" />Start
              </Button>
            ) : inst.status === 'in_progress' || inst.status === 'partial' ? (
              <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={() => onComplete(inst.id)}>
                <CheckCircle className="h-3 w-3 mr-1" />Complete
              </Button>
            ) : null}
            <Button size="sm" variant="ghost" className="text-[10px] h-6 px-1.5 text-destructive" onClick={() => onDelete(inst.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
