import { Button } from "@/components/ui/button";
import { X, Trash2, Download } from "lucide-react";

interface Props {
  count: number;
  onClear: () => void;
  onDelete: () => void;
  onExport: () => void;
}

export default function QualityBulkActions({ count, onClear, onDelete, onExport }: Props) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg">
      <span className="text-xs font-medium text-primary">{count} selected</span>
      <div className="flex gap-1 ml-auto">
        <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={onExport}><Download className="h-3 w-3 mr-1" />Export</Button>
        <Button variant="destructive" size="sm" className="h-7 text-[10px]" onClick={onDelete}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
        <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={onClear}><X className="h-3 w-3 mr-1" />Clear</Button>
      </div>
    </div>
  );
}
