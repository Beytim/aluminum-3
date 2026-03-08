import { Button } from "@/components/ui/button";
import { Trash2, Download, X, Play, CheckCircle } from "lucide-react";

interface Props {
  count: number;
  onClear: () => void;
  onDelete: () => void;
  onExport: () => void;
  onStart: () => void;
  onComplete: () => void;
}

export function MaintenanceBulkActions({ count, onClear, onDelete, onExport, onStart, onComplete }: Props) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg">
      <span className="text-xs font-medium text-primary">{count} selected</span>
      <Button size="sm" variant="outline" className="text-xs h-7" onClick={onStart}><Play className="h-3 w-3 mr-1" />Start</Button>
      <Button size="sm" variant="outline" className="text-xs h-7" onClick={onComplete}><CheckCircle className="h-3 w-3 mr-1" />Complete</Button>
      <Button size="sm" variant="outline" className="text-xs h-7" onClick={onExport}><Download className="h-3 w-3 mr-1" />Export</Button>
      <Button size="sm" variant="outline" className="text-xs h-7 text-destructive" onClick={onDelete}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
      <Button size="sm" variant="ghost" className="text-xs h-7" onClick={onClear}><X className="h-3 w-3" /></Button>
    </div>
  );
}
