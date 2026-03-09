import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Trash2, Play, CheckCircle, Calculator, Pencil, Pause, XCircle, FileDown } from "lucide-react";
import type { EnhancedCuttingJob } from "@/data/enhancedProductionData";
import { formatETBShort, priorityColors } from "@/data/enhancedProductionData";

const statusColor: Record<string, string> = {
  Pending: 'bg-muted text-muted-foreground',
  'In Progress': 'bg-warning/10 text-warning',
  Completed: 'bg-success/10 text-success',
  Cancelled: 'bg-destructive/10 text-destructive',
};

interface Props {
  job: EnhancedCuttingJob;
  onView: (job: EnhancedCuttingJob) => void;
  onEdit: (job: EnhancedCuttingJob) => void;
  onOptimize: (id: string) => void;
  onStatusChange: (id: string, status: EnhancedCuttingJob['status']) => void;
  onDelete: (id: string) => void;
}

export function CuttingCard({ job, onView, onOptimize, onStatusChange, onDelete }: Props) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group" onClick={() => onView(job)}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-mono font-bold text-primary">{job.jobNumber}</p>
              {job.optimized && <Badge variant="outline" className="text-[8px] h-4 bg-info/10 text-info border-info/20">Optimized</Badge>}
            </div>
            <p className="text-sm font-semibold truncate mt-0.5">{job.materialName}</p>
            {job.projectName && <p className="text-[10px] text-muted-foreground truncate">{job.projectName}</p>}
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className={`text-[9px] ${statusColor[job.status]}`}>{job.status}</Badge>
            <Badge className={`text-[9px] ${priorityColors[job.priority]}`}>{job.priority}</Badge>
          </div>
        </div>

        {/* Work Order Link */}
        {job.workOrderNumber && (
          <div className="text-[10px] text-muted-foreground">
            WO: <span className="font-mono font-medium text-foreground">{job.workOrderNumber}</span>
            {job.customerName && <span> · {job.customerName}</span>}
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
          <span className="text-muted-foreground">Cuts: <strong className="text-foreground">{job.totalCuts}</strong></span>
          <span className="text-muted-foreground">Stock: <strong className="text-foreground">{job.stockLength}mm × {job.stocksUsed}</strong></span>
          <span className="text-muted-foreground">Waste: <strong className={job.wastePercent > 15 ? 'text-destructive' : job.wastePercent <= 5 ? 'text-success' : 'text-warning'}>{job.waste}mm ({job.wastePercent}%)</strong></span>
          <span className="text-muted-foreground">Efficiency: <strong className={job.efficiency >= 95 ? 'text-success' : job.efficiency >= 85 ? 'text-foreground' : 'text-warning'}>{job.efficiency}%</strong></span>
        </div>

        {/* Cut Visualization */}
        <div className="space-y-1">
          <p className="text-[9px] text-muted-foreground font-medium">Cut Layout</p>
          <div className="flex gap-px h-5 rounded overflow-hidden border border-border">
            {job.cuts.map((cut, ci) => (
              <div
                key={ci}
                className="bg-primary/70 flex items-center justify-center text-[7px] text-primary-foreground font-mono transition-colors hover:bg-primary"
                style={{ width: `${(cut / (job.stockLength * job.stocksUsed)) * 100}%` }}
              >
                {cut >= 400 ? cut : ''}
              </div>
            ))}
            {job.waste > 0 && (
              <div
                className="bg-destructive/20 flex items-center justify-center text-[7px] text-destructive font-mono"
                style={{ width: `${(job.waste / (job.stockLength * job.stocksUsed)) * 100}%` }}
              >
                {job.waste >= 200 ? job.waste : ''}
              </div>
            )}
          </div>
        </div>

        {/* Remnants */}
        {job.remnants.length > 0 && (
          <div className="text-[10px] text-muted-foreground">
            Remnants: {job.remnants.map((r, i) => (
              <span key={i} className={r.reusable ? 'text-success font-medium' : 'text-destructive'}>
                {r.length}mm{r.reusable ? ' ✓' : ''}{i < job.remnants.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}

        {/* Cost & Assignment */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border">
          <span>Cost: <strong className="text-foreground">{formatETBShort(job.totalCost)}</strong></span>
          <span>{job.machine}</span>
          <span>{job.assignee}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-1 pt-1" onClick={e => e.stopPropagation()}>
          {job.status === 'Pending' && (
            <>
              <Button size="sm" variant="outline" className="text-[10px] h-6 flex-1 gap-1" onClick={() => onOptimize(job.id)}>
                <Calculator className="h-3 w-3" />Optimize
              </Button>
              <Button size="sm" variant="outline" className="text-[10px] h-6 flex-1 gap-1" onClick={() => onStatusChange(job.id, 'In Progress')}>
                <Play className="h-3 w-3" />Start
              </Button>
            </>
          )}
          {job.status === 'In Progress' && (
            <Button size="sm" variant="outline" className="text-[10px] h-6 flex-1 gap-1" onClick={() => onStatusChange(job.id, 'Completed')}>
              <CheckCircle className="h-3 w-3" />Complete
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onView(job)}>
            <Eye className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(job.id)}>
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
