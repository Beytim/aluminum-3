import { Button } from "@/components/ui/button";
import { Trash2, Download, ArrowRightLeft, ShieldAlert } from "lucide-react";

interface Props {
  count: number;
  onDelete: () => void;
  onExport: () => void;
  onClear: () => void;
}

export default function InventoryBulkActions({ count, onDelete, onExport, onClear }: Props) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg">
      <span className="text-xs font-medium text-primary">{count} selected</span>
      <div className="flex-1" />
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="h-3.5 w-3.5 mr-1" />Export
      </Button>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="h-3.5 w-3.5 mr-1" />Delete
      </Button>
      <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>
    </div>
  );
}
