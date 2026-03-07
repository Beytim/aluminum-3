import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Download, X, ArrowRight } from "lucide-react";
import type { ProductionStage, WorkOrderPriority } from "@/data/enhancedProductionData";

const stages: ProductionStage[] = ['Pending', 'Cutting', 'Machining', 'Assembly', 'Welding', 'Glazing', 'Quality Check', 'Packaging', 'Completed'];
const priorities: WorkOrderPriority[] = ['Low', 'Medium', 'High', 'Urgent', 'Critical'];

interface Props {
  count: number;
  onClear: () => void;
  onDelete: () => void;
  onExport: () => void;
  onStageChange: (stage: ProductionStage) => void;
  onPriorityChange: (priority: WorkOrderPriority) => void;
}

export function ProductionBulkActions({ count, onClear, onDelete, onExport, onStageChange, onPriorityChange }: Props) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-md flex-wrap">
      <span className="text-xs font-medium text-primary">{count} selected</span>
      <Select onValueChange={v => onStageChange(v as ProductionStage)}>
        <SelectTrigger className="w-32 h-7 text-xs"><SelectValue placeholder="Move Stage" /></SelectTrigger>
        <SelectContent>{stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
      </Select>
      <Select onValueChange={v => onPriorityChange(v as WorkOrderPriority)}>
        <SelectTrigger className="w-28 h-7 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
        <SelectContent>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onExport}><Download className="h-3 w-3 mr-1" />Export</Button>
      <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={onDelete}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClear}><X className="h-3 w-3" /></Button>
    </div>
  );
}
