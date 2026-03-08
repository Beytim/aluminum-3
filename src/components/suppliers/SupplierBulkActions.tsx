import { Button } from "@/components/ui/button";
import { Download, Trash2, X, RefreshCw } from "lucide-react";

interface Props {
  count: number;
  onClear: () => void;
  onToggleStatus: () => void;
  onExport: () => void;
  onDelete: () => void;
}

export default function SupplierBulkActions({ count, onClear, onToggleStatus, onExport, onDelete }: Props) {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-lg shadow-lg px-4 py-2 flex items-center gap-3 animate-in slide-in-from-bottom-4">
      <span className="text-xs font-medium">{count} selected</span>
      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onToggleStatus}>
        <RefreshCw className="h-3 w-3 mr-1" />Change Status
      </Button>
      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onExport}>
        <Download className="h-3 w-3 mr-1" />Export
      </Button>
      <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={onDelete}>
        <Trash2 className="h-3 w-3 mr-1" />Delete
      </Button>
      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onClear}>
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
