import { Button } from "@/components/ui/button";
import { Trash2, Download, X } from "lucide-react";

interface QuoteBulkActionsProps {
  count: number;
  onClear: () => void;
  onDelete: () => void;
  onExport: () => void;
}

export function QuoteBulkActions({ count, onClear, onDelete, onExport }: QuoteBulkActionsProps) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg">
      <span className="text-xs font-medium text-primary">{count} selected</span>
      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onExport}><Download className="h-3 w-3 mr-1" />Export</Button>
      <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={onDelete}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
      <Button variant="ghost" size="sm" className="h-7 text-xs ml-auto" onClick={onClear}><X className="h-3 w-3 mr-1" />Clear</Button>
    </div>
  );
}
