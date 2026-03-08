import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, Clock } from "lucide-react";
import { type EnhancedPayment, getPaymentMethodColor, formatCurrency } from "@/data/enhancedFinanceData";

interface Props {
  payments: EnhancedPayment[];
  onDelete: (id: string) => void;
}

export default function PaymentTable({ payments, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">Payment #</TableHead>
          <TableHead className="text-xs">Date</TableHead>
          <TableHead className="text-xs">Customer</TableHead>
          <TableHead className="text-xs">Invoice</TableHead>
          <TableHead className="text-xs">Method</TableHead>
          <TableHead className="text-xs text-right">Amount</TableHead>
          <TableHead className="text-xs">Reference</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs w-8">
            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /></span>
          </TableHead>
          <TableHead className="text-xs w-8"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map(pay => (
          <TableRow key={pay.id}>
            <TableCell className="text-xs font-mono">{pay.paymentNumber}</TableCell>
            <TableCell className="text-xs">{pay.date}</TableCell>
            <TableCell className="text-xs">{pay.customerName}</TableCell>
            <TableCell className="text-xs font-mono text-muted-foreground">{pay.invoiceNumber}</TableCell>
            <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPaymentMethodColor(pay.method)}`}>{pay.method}</span></TableCell>
            <TableCell className="text-xs text-right font-semibold text-success">{formatCurrency(pay.amount, pay.currency)}</TableCell>
            <TableCell className="text-xs font-mono text-muted-foreground truncate max-w-[120px]">{pay.reference}</TableCell>
            <TableCell>
              <Badge variant={pay.status === 'Completed' ? 'default' : 'secondary'} className="text-[10px]">
                {pay.status}
              </Badge>
            </TableCell>
            <TableCell>
              {pay.reconciled ? <CheckCircle className="h-3.5 w-3.5 text-success" /> : <Clock className="h-3.5 w-3.5 text-muted-foreground" />}
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(pay.id)}>
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {payments.length === 0 && (
          <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">No payments found</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
