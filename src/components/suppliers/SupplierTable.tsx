import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Star, Eye, Pencil, Trash2, Globe, MoreVertical, Power, PowerOff, Download, Building2 } from "lucide-react";
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
  onToggleStatus: (s: Supplier) => void;
  onExportOne: (s: Supplier) => void;
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

export default function SupplierTable({ suppliers, selectedIds, allSelected, onToggleAll, onToggleSelect, onView, onEdit, onDelete, onToggleStatus, onExportOne }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8 px-2"><Checkbox checked={allSelected} onCheckedChange={onToggleAll} /></TableHead>
          <TableHead className="text-xs">Code</TableHead>
          <TableHead className="text-xs">Company</TableHead>
          <TableHead className="text-xs hidden sm:table-cell">Country</TableHead>
          <TableHead className="text-xs hidden md:table-cell">Contact</TableHead>
          <TableHead className="text-xs hidden sm:table-cell">Type</TableHead>
          <TableHead className="text-xs hidden md:table-cell">Rating</TableHead>
          <TableHead className="text-xs hidden lg:table-cell text-right">Lead Time</TableHead>
          <TableHead className="text-xs hidden lg:table-cell text-right">Total Spent</TableHead>
          <TableHead className="text-xs hidden md:table-cell">Categories</TableHead>
          <TableHead className="text-xs hidden sm:table-cell">Status</TableHead>
          <TableHead className="text-xs w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map(s => (
          <TableRow key={s.id} className={`cursor-pointer hover:bg-muted/50 ${selectedIds.has(s.id) ? 'bg-primary/5' : ''}`} onClick={() => onView(s)}>
            <TableCell className="px-2" onClick={e => e.stopPropagation()}>
              <Checkbox checked={selectedIds.has(s.id)} onCheckedChange={() => onToggleSelect(s.id)} />
            </TableCell>
            <TableCell className="text-xs font-mono">{s.supplier_code}</TableCell>
            <TableCell className="text-xs">
              <div>
                <span className="font-medium">{s.company_name}</span>
                {s.preferred && <Badge className="ml-1 text-[9px] bg-success/10 text-success border-0">Preferred</Badge>}
                {s.company_name_am && <p className="text-[10px] text-muted-foreground">{s.company_name_am}</p>}
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <div className="flex items-center gap-1 text-xs"><Globe className="h-3 w-3 text-muted-foreground" />{s.country}{s.city && <span className="text-muted-foreground">/ {s.city}</span>}</div>
            </TableCell>
            <TableCell className="text-xs hidden md:table-cell">
              <div>
                <span>{s.contact_person}</span>
                {s.position && <p className="text-[10px] text-muted-foreground">{s.position}</p>}
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge variant="outline" className="text-[10px]">{s.business_type}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < Math.round(s.rating) ? 'text-warning fill-warning' : 'text-muted'}`} />
                ))}
              </div>
            </TableCell>
            <TableCell className="text-xs text-right hidden lg:table-cell">{s.average_lead_time}d</TableCell>
            <TableCell className="text-xs text-right font-medium hidden lg:table-cell">{s.total_spent > 0 ? `ETB ${s.total_spent.toLocaleString()}` : '—'}</TableCell>
            <TableCell className="hidden md:table-cell">
              <div className="flex flex-wrap gap-0.5 max-w-[120px]">
                {(s.product_categories || []).slice(0, 2).map(c => <Badge key={c} variant="outline" className="text-[9px]">{c}</Badge>)}
                {(s.product_categories || []).length > 2 && <span className="text-[9px] text-muted-foreground">+{s.product_categories.length - 2}</span>}
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(s.status)}`}>{s.status}</span>
            </TableCell>
            <TableCell onClick={e => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-3.5 w-3.5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => onView(s)}><Eye className="h-3.5 w-3.5 mr-2" />View Details</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(s)}><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onToggleStatus(s)}>
                    {s.status === 'Active' ? <><PowerOff className="h-3.5 w-3.5 mr-2" />Deactivate</> : <><Power className="h-3.5 w-3.5 mr-2" />Activate</>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExportOne(s)}><Download className="h-3.5 w-3.5 mr-2" />Export</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => onDelete(s.id)}><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {suppliers.length === 0 && (
        <caption className="caption-bottom">
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No suppliers found</p>
          </div>
        </caption>
      )}
    </Table>
  );
}
