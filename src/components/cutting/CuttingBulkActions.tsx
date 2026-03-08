import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Download, X, Calculator, Play, CheckCircle } from "lucide-react";

interface Props {
  count: number;
  onClear: () => void;
  onDelete: () => void;
  onExport: () => void;
  onOptimize: () => void;
  onBulkStart: () => void;
  onBulkComplete: () => void;
}

export function CuttingBulkActions({ count, onClear, onDelete, onExport, onOptimize, onBulkStart, onBulkComplete }: Props) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg flex-wrap">
      <Badge variant="default" className="text-xs">{count} selected</Badge>
      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={onOptimize}>
        <Calculator className="h-3 w-3" />Optimize
      </Button>
      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={onBulkStart}>
        <Play className="h-3 w-3" />Start
      </Button>
      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={onBulkComplete}>
        <CheckCircle className="h-3 w-3" />Complete
      </Button>
      <div className="flex-1" />
      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={onExport}>
        <Download className="h-3 w-3" />Export
      </Button>
      <Button variant="destructive" size="sm" className="h-7 text-xs gap-1" onClick={onDelete}>
        <Trash2 className="h-3 w-3" />Delete
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClear}>
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
