import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, FileText, Trash2, Star, Globe } from "lucide-react";
import { type EnhancedSupplier, getSupplierStatusColor, procFormatETB } from "@/data/enhancedProcurementData";

interface Props {
  suppliers: EnhancedSupplier[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: () => void;
  onView: (s: EnhancedSupplier) => void;
  onCreatePO: (s: EnhancedSupplier) => void;
  onDelete: (id: string) => void;
}

export default function SupplierTable({ suppliers, selectedIds, onSelectToggle, onSelectAll, onView, onCreatePO, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"><Checkbox checked={selectedIds.length === suppliers.length && suppliers.length > 0} onCheckedChange={onSelectAll} /></TableHead>
          <TableHead className="text-xs">Code</TableHead>
          <TableHead className="text-xs">Company</TableHead>
          <TableHead className="text-xs">Country</TableHead>
          <TableHead className="text-xs">Contact</TableHead>
          <TableHead className="text-xs">Rating</TableHead>
          <TableHead className="text-xs">Lead Time</TableHead>
          <TableHead className="text-xs">On-Time %</TableHead>
          <TableHead className="text-xs text-right">Total Spent</TableHead>
          <TableHead className="text-xs">Categories</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs w-24"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map(s => (
          <TableRow key={s.id}>
            <TableCell><Checkbox checked={selectedIds.includes(s.id)} onCheckedChange={() => onSelectToggle(s.id)} /></TableCell>
            <TableCell className="text-xs font-mono">{s.supplierCode}</TableCell>
            <TableCell className="text-xs">
              <div>
                <span className="font-medium">{s.companyName}</span>
                {s.preferred && <Badge className="ml-1 text-[9px] bg-success/10 text-success border-0">Preferred</Badge>}
              </div>
            </TableCell>
            <TableCell><div className="flex items-center gap-1 text-xs"><Globe className="h-3 w-3 text-muted-foreground" />{s.country}</div></TableCell>
            <TableCell className="text-xs">{s.contactPerson}</TableCell>
            <TableCell>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < Math.round(s.rating) ? 'text-warning fill-warning' : 'text-muted'}`} />
                ))}
              </div>
            </TableCell>
            <TableCell className="text-xs">{s.averageLeadTime}d</TableCell>
            <TableCell className="text-xs">{s.performance.onTimeDeliveryRate}%</TableCell>
            <TableCell className="text-xs text-right font-medium">{procFormatETB(s.performance.totalSpent)}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-0.5 max-w-[120px]">
                {s.productCategories.slice(0, 2).map(c => <Badge key={c} variant="outline" className="text-[9px]">{c}</Badge>)}
                {s.productCategories.length > 2 && <span className="text-[9px] text-muted-foreground">+{s.productCategories.length - 2}</span>}
              </div>
            </TableCell>
            <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getSupplierStatusColor(s.status)}`}>{s.status}</span></TableCell>
            <TableCell>
              <div className="flex gap-0.5">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(s)}><Eye className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onCreatePO(s)}><FileText className="h-3 w-3 text-primary" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(s.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {suppliers.length === 0 && <TableRow><TableCell colSpan={12} className="text-center text-muted-foreground py-8">No suppliers found</TableCell></TableRow>}
      </TableBody>
    </Table>
  );
}
