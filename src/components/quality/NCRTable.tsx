import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Trash2 } from "lucide-react";
import type { NCR } from "@/data/enhancedQualityData";
import { getNCRStatusColor, getDefectSeverityColor, formatETB } from "@/data/enhancedQualityData";

interface Props {
  ncrs: NCR[];
  selected: string[];
  onSelect: (ids: string[]) => void;
  onView: (n: NCR) => void;
  onDelete: (id: string) => void;
}

export default function NCRTable({ ncrs, selected, onSelect, onView, onDelete }: Props) {
  const allSelected = ncrs.length > 0 && selected.length === ncrs.length;
  const daysOpen = (d: string, closed?: string) => {
    const end = closed ? new Date(closed) : new Date();
    return Math.ceil((end.getTime() - new Date(d).getTime()) / 86400000);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={c => onSelect(c ? ncrs.map(n => n.id) : [])} /></TableHead>
          <TableHead className="text-xs">NCR #</TableHead>
          <TableHead className="text-xs">Title</TableHead>
          <TableHead className="text-xs">Source</TableHead>
          <TableHead className="text-xs">Reported</TableHead>
          <TableHead className="text-xs">Severity</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs">Product</TableHead>
          <TableHead className="text-xs">Qty</TableHead>
          <TableHead className="text-xs">Days Open</TableHead>
          <TableHead className="text-xs">Cost Impact</TableHead>
          <TableHead className="text-xs">CAPA</TableHead>
          <TableHead className="text-xs"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ncrs.map(n => (
          <TableRow key={n.id} className={n.severity === 'critical' ? 'bg-destructive/5' : ''}>
            <TableCell><Checkbox checked={selected.includes(n.id)} onCheckedChange={c => onSelect(c ? [...selected, n.id] : selected.filter(s => s !== n.id))} /></TableCell>
            <TableCell className="text-xs font-mono">{n.ncrNumber}</TableCell>
            <TableCell className="text-xs font-medium max-w-[200px] truncate">{n.title}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{n.inspectionNumber || n.customerName || '—'}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{n.reportedDate}</TableCell>
            <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${getDefectSeverityColor(n.severity)}`}>{n.severity}</span></TableCell>
            <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${getNCRStatusColor(n.status)}`}>{n.status.replace('_', ' ')}</span></TableCell>
            <TableCell className="text-xs">{n.productName || '—'}</TableCell>
            <TableCell className="text-xs">{n.quantityAffected} {n.quantityUnit}</TableCell>
            <TableCell className="text-xs font-medium">{daysOpen(n.reportedDate, n.closureDate)}</TableCell>
            <TableCell className="text-xs">{formatETB(n.costImpact)}</TableCell>
            <TableCell className="text-xs font-mono text-muted-foreground">{n.capaNumber || '—'}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(n)}><Eye className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(n.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {ncrs.length === 0 && (
          <TableRow><TableCell colSpan={13} className="text-center text-sm text-muted-foreground py-8">No NCRs found</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
