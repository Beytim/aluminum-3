import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Tag, Download, X } from "lucide-react";

interface Props {
  count: number;
  onDelete: () => void;
  onExport: () => void;
  onClear: () => void;
}

export function BulkActionsBar({ count, onDelete, onExport, onClear }: Props) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg">
      <Badge variant="default" className="text-xs">{count} selected</Badge>
      <div className="flex-1" />
      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={onExport}>
        <Download className="h-3 w-3" /> Export
      </Button>
      <Button variant="destructive" size="sm" className="h-7 text-xs gap-1" onClick={onDelete}>
        <Trash2 className="h-3 w-3" /> Delete
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClear}>
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
