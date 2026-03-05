import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Pencil, Trash2, Copy } from "lucide-react";
import type { EnhancedQuote } from "@/data/enhancedQuoteData";
import { formatETBCompact, daysUntilExpiry, getQuoteStatusColor } from "@/data/enhancedQuoteData";

interface QuoteTableProps {
  quotes: EnhancedQuote[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  allSelected: boolean;
  onView: (q: EnhancedQuote) => void;
  onEdit: (q: EnhancedQuote) => void;
  onDelete: (id: string) => void;
  onClone: (q: EnhancedQuote) => void;
}

export function QuoteTable({ quotes, selectedIds, onToggleSelect, onToggleAll, allSelected, onView, onEdit, onDelete, onClone }: QuoteTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"><Checkbox checked={allSelected} onCheckedChange={onToggleAll} /></TableHead>
            <TableHead className="text-xs">#</TableHead>
            <TableHead className="text-xs">Quote</TableHead>
            <TableHead className="text-xs">Customer</TableHead>
            <TableHead className="text-xs hidden md:table-cell">Project</TableHead>
            <TableHead className="text-xs text-center hidden sm:table-cell">Items</TableHead>
            <TableHead className="text-xs text-right hidden lg:table-cell">Subtotal</TableHead>
            <TableHead className="text-xs text-right">Total</TableHead>
            <TableHead className="text-xs text-center hidden md:table-cell">Margin</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs hidden lg:table-cell">Expiry</TableHead>
            <TableHead className="text-xs text-right w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.length === 0 && (
            <TableRow><TableCell colSpan={12} className="text-center py-8 text-sm text-muted-foreground">No quotes match your filters</TableCell></TableRow>
          )}
          {quotes.map(q => {
            const days = daysUntilExpiry(q.expiryDate);
            const marginColor = q.profitMargin >= 40 ? 'text-success' : q.profitMargin >= 25 ? 'text-warning' : 'text-destructive';
            const expiryColor = q.status !== 'Pending' ? '' : days > 14 ? 'text-success' : days > 7 ? 'text-warning' : 'text-destructive';
            const totalItems = q.items.reduce((s, i) => s + i.quantity, 0);
            return (
              <TableRow key={q.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onView(q)}>
                <TableCell onClick={e => e.stopPropagation()}><Checkbox checked={selectedIds.has(q.id)} onCheckedChange={() => onToggleSelect(q.id)} /></TableCell>
                <TableCell className="text-xs font-mono">{q.quoteNumber}</TableCell>
                <TableCell className="text-xs">
                  <div className="font-medium line-clamp-1">{q.title}</div>
                  <span className="text-[10px] text-muted-foreground">{q.version}</span>
                </TableCell>
                <TableCell className="text-xs">{q.customerName}</TableCell>
                <TableCell className="text-xs text-muted-foreground hidden md:table-cell line-clamp-1">{q.projectName}</TableCell>
                <TableCell className="text-xs text-center hidden sm:table-cell">{totalItems}</TableCell>
                <TableCell className="text-xs text-right hidden lg:table-cell">{formatETBCompact(q.subtotal)}</TableCell>
                <TableCell className="text-xs text-right font-semibold">{formatETBCompact(q.total)}</TableCell>
                <TableCell className="text-xs text-center hidden md:table-cell"><span className={`font-semibold ${marginColor}`}>{q.profitMargin}%</span></TableCell>
                <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getQuoteStatusColor(q.status)}`}>{q.status}</span></TableCell>
                <TableCell className={`text-xs hidden lg:table-cell ${expiryColor}`}>{q.status === 'Pending' ? (days > 0 ? `${days}d` : 'Expired') : q.expiryDate}</TableCell>
                <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-0.5 justify-end">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(q)}><Eye className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(q)}><Pencil className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onClone(q)}><Copy className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(q.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
