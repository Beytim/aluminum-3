import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Trash2 } from "lucide-react";
import type { EnhancedInspection } from "@/data/enhancedQualityData";
import { getInspectionResultColor, getInspectionTypeLabel } from "@/data/enhancedQualityData";

interface Props {
  inspections: EnhancedInspection[];
  selected: string[];
  onSelect: (ids: string[]) => void;
  onView: (i: EnhancedInspection) => void;
  onDelete: (id: string) => void;
}

export default function InspectionTable({ inspections, selected, onSelect, onView, onDelete }: Props) {
  const allSelected = inspections.length > 0 && selected.length === inspections.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={c => onSelect(c ? inspections.map(i => i.id) : [])} /></TableHead>
          <TableHead className="text-xs">ID</TableHead>
          <TableHead className="text-xs">Type</TableHead>
          <TableHead className="text-xs">Product / Item</TableHead>
          <TableHead className="text-xs">Source</TableHead>
          <TableHead className="text-xs">Inspector</TableHead>
          <TableHead className="text-xs">Date</TableHead>
          <TableHead className="text-xs">Result</TableHead>
          <TableHead className="text-xs">Score</TableHead>
          <TableHead className="text-xs">Defects</TableHead>
          <TableHead className="text-xs">NCR</TableHead>
          <TableHead className="text-xs"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inspections.map(i => (
          <TableRow key={i.id} className={i.result === 'fail' ? 'bg-destructive/5' : ''}>
            <TableCell><Checkbox checked={selected.includes(i.id)} onCheckedChange={c => onSelect(c ? [...selected, i.id] : selected.filter(s => s !== i.id))} /></TableCell>
            <TableCell className="text-xs font-mono">{i.inspectionNumber}</TableCell>
            <TableCell><Badge variant="outline" className="text-[10px]">{getInspectionTypeLabel(i.type)}</Badge></TableCell>
            <TableCell className="text-xs font-medium max-w-[150px] truncate">{i.productName || '—'}</TableCell>
            <TableCell className="text-xs text-muted-foreground font-mono">{i.workOrderNumber || i.purchaseOrderNumber || i.projectName || '—'}</TableCell>
            <TableCell className="text-xs">{i.inspectorName}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{i.inspectionDate}</TableCell>
            <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${getInspectionResultColor(i.result)}`}>{i.result}</span></TableCell>
            <TableCell className="text-xs font-medium">{i.score != null ? `${i.score}%` : '—'}</TableCell>
            <TableCell className="text-xs">{i.defectCount > 0 ? <Badge variant="destructive" className="text-[10px]">{i.defectCount}</Badge> : <span className="text-muted-foreground">0</span>}</TableCell>
            <TableCell className="text-xs font-mono text-muted-foreground">{i.ncrNumber || '—'}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(i)}><Eye className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(i.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {inspections.length === 0 && (
          <TableRow><TableCell colSpan={12} className="text-center text-sm text-muted-foreground py-8">No inspections found</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
