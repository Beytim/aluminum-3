import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Eye, CreditCard, Trash2, AlertTriangle } from "lucide-react";
import { type EnhancedInvoice, getInvoiceStatusColor, formatCurrency, daysOverdue } from "@/data/enhancedFinanceData";

interface Props {
  invoices: EnhancedInvoice[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: () => void;
  onView: (inv: EnhancedInvoice) => void;
  onRecordPayment: (inv: EnhancedInvoice) => void;
  onDelete: (id: string) => void;
}

export default function InvoiceTable({ invoices, selectedIds, onSelectToggle, onSelectAll, onView, onRecordPayment, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"><Checkbox checked={selectedIds.length === invoices.length && invoices.length > 0} onCheckedChange={onSelectAll} /></TableHead>
          <TableHead className="text-xs">Invoice #</TableHead>
          <TableHead className="text-xs">Customer</TableHead>
          <TableHead className="text-xs">Project/Order</TableHead>
          <TableHead className="text-xs">Issue Date</TableHead>
          <TableHead className="text-xs">Due Date</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs text-right">Total</TableHead>
          <TableHead className="text-xs text-right">Paid</TableHead>
          <TableHead className="text-xs text-right">Balance</TableHead>
          <TableHead className="text-xs w-24"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(inv => {
          const overdueDays = inv.isOverdue ? daysOverdue(inv.dueDate) : 0;
          return (
            <TableRow key={inv.id} className={inv.isOverdue ? 'bg-destructive/5' : ''}>
              <TableCell><Checkbox checked={selectedIds.includes(inv.id)} onCheckedChange={() => onSelectToggle(inv.id)} /></TableCell>
              <TableCell className="text-xs font-mono">
                <span className="flex items-center gap-1">
                  {inv.invoiceNumber}
                  {inv.isOverdue && <AlertTriangle className="h-3 w-3 text-destructive" />}
                </span>
              </TableCell>
              <TableCell className="text-xs">{inv.customerName}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{inv.projectName || inv.orderNumber || '—'}</TableCell>
              <TableCell className="text-xs">{inv.issueDate}</TableCell>
              <TableCell className="text-xs">
                {inv.dueDate}
                {overdueDays > 0 && <span className="text-destructive text-[10px] ml-1">({overdueDays}d)</span>}
              </TableCell>
              <TableCell>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getInvoiceStatusColor(inv.status)}`}>{inv.status}</span>
              </TableCell>
              <TableCell className="text-xs text-right font-semibold">{formatCurrency(inv.total, inv.currency)}</TableCell>
              <TableCell className="text-xs text-right text-success">{formatCurrency(inv.totalPaid, inv.currency)}</TableCell>
              <TableCell className="text-xs text-right font-semibold">{inv.balance > 0 ? formatCurrency(inv.balance, inv.currency) : '—'}</TableCell>
              <TableCell>
                <div className="flex gap-0.5">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(inv)}><Eye className="h-3 w-3" /></Button>
                  {!inv.isFullyPaid && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRecordPayment(inv)}><CreditCard className="h-3 w-3 text-success" /></Button>}
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(inv.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
        {invoices.length === 0 && (
          <TableRow><TableCell colSpan={11} className="text-center text-muted-foreground py-8">No invoices found</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
