import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { type Expense, formatCurrency, getPaymentMethodColor } from "@/data/enhancedFinanceData";

interface Props { expenses: Expense[]; onDelete: (id: string) => void }

export default function ExpenseTable({ expenses, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">Expense #</TableHead>
          <TableHead className="text-xs">Date</TableHead>
          <TableHead className="text-xs">Category</TableHead>
          <TableHead className="text-xs">Description</TableHead>
          <TableHead className="text-xs">Method</TableHead>
          <TableHead className="text-xs text-right">Amount</TableHead>
          <TableHead className="text-xs">Paid</TableHead>
          <TableHead className="text-xs w-8"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map(exp => (
          <TableRow key={exp.id}>
            <TableCell className="text-xs font-mono">{exp.expenseNumber}</TableCell>
            <TableCell className="text-xs">{exp.date}</TableCell>
            <TableCell><Badge variant="secondary" className="text-[10px]">{exp.category}</Badge></TableCell>
            <TableCell className="text-xs max-w-[200px] truncate">{exp.description}</TableCell>
            <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full ${getPaymentMethodColor(exp.paymentMethod)}`}>{exp.paymentMethod}</span></TableCell>
            <TableCell className="text-xs text-right font-semibold">{formatCurrency(exp.amount, exp.currency)}</TableCell>
            <TableCell><Badge variant={exp.paid ? 'default' : 'secondary'} className="text-[10px]">{exp.paid ? 'Paid' : 'Unpaid'}</Badge></TableCell>
            <TableCell><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(exp.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button></TableCell>
          </TableRow>
        ))}
        {expenses.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No expenses found</TableCell></TableRow>}
      </TableBody>
    </Table>
  );
}
