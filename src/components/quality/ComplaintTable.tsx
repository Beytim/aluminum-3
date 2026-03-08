import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Star } from "lucide-react";
import type { CustomerComplaint } from "@/data/enhancedQualityData";

interface Props {
  complaints: CustomerComplaint[];
  onDelete: (id: string) => void;
}

const statusColor: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  in_progress: 'bg-primary/10 text-primary',
  resolved: 'bg-success/10 text-success',
  closed: 'bg-muted text-muted-foreground',
  escalated: 'bg-destructive/10 text-destructive',
};

const sevColor: Record<string, string> = {
  low: 'bg-info/10 text-info',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-[hsl(25,90%,50%)]/10 text-[hsl(25,90%,50%)]',
  critical: 'bg-destructive/10 text-destructive',
};

export default function ComplaintTable({ complaints, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">#</TableHead>
          <TableHead className="text-xs">Customer</TableHead>
          <TableHead className="text-xs">Subject</TableHead>
          <TableHead className="text-xs">Category</TableHead>
          <TableHead className="text-xs">Severity</TableHead>
          <TableHead className="text-xs">Channel</TableHead>
          <TableHead className="text-xs">Date</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs">Rating</TableHead>
          <TableHead className="text-xs">NCR</TableHead>
          <TableHead className="text-xs"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {complaints.map(c => (
          <TableRow key={c.id}>
            <TableCell className="text-xs font-mono">{c.complaintNumber}</TableCell>
            <TableCell className="text-xs font-medium">{c.customerName}</TableCell>
            <TableCell className="text-xs max-w-[200px] truncate">{c.subject}</TableCell>
            <TableCell><Badge variant="outline" className="text-[10px] capitalize">{c.category.replace('_', ' ')}</Badge></TableCell>
            <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${sevColor[c.severity]}`}>{c.severity}</span></TableCell>
            <TableCell className="text-xs capitalize">{c.channel.replace('_', ' ')}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{c.date}</TableCell>
            <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[c.resolutionStatus]}`}>{c.resolutionStatus.replace('_', ' ')}</span></TableCell>
            <TableCell className="text-xs">
              {c.customerSatisfaction ? (
                <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3 w-3 ${i < c.customerSatisfaction! ? 'text-warning fill-warning' : 'text-muted'}`} />)}</div>
              ) : '—'}
            </TableCell>
            <TableCell className="text-xs font-mono text-muted-foreground">{c.ncrNumber || '—'}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(c.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
            </TableCell>
          </TableRow>
        ))}
        {complaints.length === 0 && (
          <TableRow><TableCell colSpan={11} className="text-center text-sm text-muted-foreground py-8">No complaints found</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
