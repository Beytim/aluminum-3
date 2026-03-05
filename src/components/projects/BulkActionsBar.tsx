import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Download, X } from "lucide-react";
import type { ProjectStatus } from "@/data/enhancedProjectData";

const statuses: ProjectStatus[] = ['Quote', 'Deposit', 'Materials Ordered', 'Production', 'Ready', 'Installation', 'Completed', 'On Hold', 'Cancelled'];

interface Props {
  count: number;
  onClear: () => void;
  onDelete: () => void;
  onExport: () => void;
  onStatusChange: (status: ProjectStatus) => void;
}

export function ProjectBulkActions({ count, onClear, onDelete, onExport, onStatusChange }: Props) {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-md">
      <span className="text-xs font-medium text-primary">{count} selected</span>
      <Select onValueChange={v => onStatusChange(v as ProjectStatus)}>
        <SelectTrigger className="w-32 h-7 text-xs"><SelectValue placeholder="Change Status" /></SelectTrigger>
        <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onExport}><Download className="h-3 w-3 mr-1" />Export</Button>
      <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={onDelete}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClear}><X className="h-3 w-3" /></Button>
    </div>
  );
}
