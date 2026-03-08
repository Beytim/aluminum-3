import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Eye, Pencil, Trash2, Globe, Copy } from "lucide-react";
import type { Supplier } from "@/hooks/useSuppliers";

interface Props {
  suppliers: Supplier[];
  selectedIds: Set<string>;
  allSelected: boolean;
  onToggleAll: () => void;
  onToggleSelect: (id: string) => void;
  onView: (s: Supplier) => void;
  onEdit: (s: Supplier) => void;
  onDelete: (id: string) => void;
}

const statusColor = (s: string) => {
  switch (s) {
    case 'Active': return 'bg-success/10 text-success';
    case 'Inactive': return 'bg-muted text-muted-foreground';
    case 'Blacklisted': return 'bg-destructive/10 text-destructive';
    case 'Pending': return 'bg-warning/10 text-warning';
    case 'Prospect': return 'bg-info/10 text-info';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default function SupplierTable({ suppliers, selectedIds, allSelected, onToggleAll, onToggleSelect, onView, onEdit, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={onToggleAll} /></TableHead>
          <TableHead className="text-xs">Code</TableHead>
          <TableHead className="text-xs">Company</TableHead>
          <TableHead className="text-xs">Country</TableHead>
          <TableHead className="text-xs">Contact</TableHead>
          <TableHead className="text-xs">Type</TableHead>
          <TableHead className="text-xs">Rating</TableHead>
          <TableHead className="text-xs">Lead Time</TableHead>
          <TableHead className="text-xs">Total Spent</TableHead>
          <TableHead className="text-xs">Categories</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs w-28"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map(s => (
          <TableRow key={s.id} className={selectedIds.has(s.id) ? 'bg-primary/5' : ''}>
            <TableCell><Checkbox checked={selectedIds.has(s.id)} onCheckedChange={() => onToggleSelect(s.id)} /></TableCell>
            <TableCell className="text-xs font-mono">{s.supplier_code}</TableCell>
            <TableCell className="text-xs">
              <div>
                <span className="font-medium cursor-pointer hover:text-primary" onClick={() => onView(s)}>{s.company_name}</span>
                {s.preferred && <Badge className="ml-1 text-[9px] bg-success/10 text-success border-0">Preferred</Badge>}
                {s.company_name_am && <p className="text-[10px] text-muted-foreground">{s.company_name_am}</p>}
              </div>
            </TableCell>
            <TableCell><div className="flex items-center gap-1 text-xs"><Globe className="h-3 w-3 text-muted-foreground" />{s.country}{s.city && <span className="text-muted-foreground">/ {s.city}</span>}</div></TableCell>
            <TableCell className="text-xs">
              <div>
                <span>{s.contact_person}</span>
                {s.position && <p className="text-[10px] text-muted-foreground">{s.position}</p>}
              </div>
            </TableCell>
            <TableCell className="text-xs">{s.business_type}</TableCell>
            <TableCell>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < Math.round(s.rating) ? 'text-warning fill-warning' : 'text-muted'}`} />
                ))}
              </div>
            </TableCell>
            <TableCell className="text-xs">{s.average_lead_time}d</TableCell>
            <TableCell className="text-xs font-medium">{s.total_spent > 0 ? `ETB ${s.total_spent.toLocaleString()}` : '—'}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-0.5 max-w-[120px]">
                {(s.product_categories || []).slice(0, 2).map(c => <Badge key={c} variant="outline" className="text-[9px]">{c}</Badge>)}
                {(s.product_categories || []).length > 2 && <span className="text-[9px] text-muted-foreground">+{s.product_categories.length - 2}</span>}
              </div>
            </TableCell>
            <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(s.status)}`}>{s.status}</span></TableCell>
            <TableCell>
              <div className="flex gap-0.5">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(s)} title="View"><Eye className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(s)} title="Edit"><Pencil className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(s.id)} title="Delete"><Trash2 className="h-3 w-3 text-destructive" /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {suppliers.length === 0 && (
          <TableRow><TableCell colSpan={12} className="text-center text-muted-foreground py-8">No suppliers found</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
