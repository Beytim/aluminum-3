import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2, Copy, FileText, ArrowRightLeft } from "lucide-react";
import type { EnhancedQuote } from "@/data/enhancedQuoteData";
import { formatETBCompact, formatETB, daysUntilExpiry, getQuoteStatusColor } from "@/data/enhancedQuoteData";

interface QuoteCardProps {
  quote: EnhancedQuote;
  onView: (q: EnhancedQuote) => void;
  onEdit?: (q: EnhancedQuote) => void;
  onDelete: (id: string) => void;
  onClone?: (q: EnhancedQuote) => void;
}

export function QuoteCard({ quote, onView, onEdit, onDelete, onClone }: QuoteCardProps) {
  const days = daysUntilExpiry(quote.expiryDate);
  const expiryColor = quote.status !== 'Pending' ? 'text-muted-foreground' : days > 14 ? 'text-success' : days > 7 ? 'text-warning' : 'text-destructive';
  const marginColor = quote.profitMargin >= 40 ? 'text-success' : quote.profitMargin >= 25 ? 'text-warning' : 'text-destructive';
  const totalItems = quote.items.reduce((s, i) => s + i.quantity, 0);
  const categories = [...new Set(quote.items.map(i => i.category))];

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all group cursor-pointer" onClick={() => onView(quote)}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-foreground">{quote.quoteNumber}</span>
              <Badge variant="outline" className="text-[9px] px-1 h-4">{quote.version}</Badge>
            </div>
            <p className="text-sm font-semibold text-foreground mt-1 line-clamp-1">{quote.title}</p>
            <p className="text-xs text-muted-foreground">{quote.customerName}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getQuoteStatusColor(quote.status)}`}>
              {quote.status}
            </span>
            {quote.status === 'Pending' && (
              <span className={`text-[10px] font-medium ${expiryColor}`}>
                {days > 0 ? `${days}d left` : 'Expired'}
              </span>
            )}
          </div>
        </div>

        {/* Items summary */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{totalItems} units</span>
          <span className="mx-1">·</span>
          {categories.join(', ')}
        </div>

        {/* Financials */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatETBCompact(quote.subtotal)}</span></div>
          {quote.discountAmount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-destructive">-{formatETBCompact(quote.discountAmount)}</span></div>}
          <div className="flex justify-between"><span className="text-muted-foreground">VAT (15%)</span><span>{formatETBCompact(quote.taxAmount)}</span></div>
          <div className="flex justify-between font-semibold border-t pt-1 border-border"><span>Total</span><span className="text-primary">{formatETB(quote.total)}</span></div>
        </div>

        {/* Margin */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Margin</span>
          <span className={`font-semibold ${marginColor}`}>{quote.profitMargin}%</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border">
          <div>
            <div>📅 {quote.quoteDate}</div>
            <div>👤 {quote.createdByName}</div>
          </div>
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(quote)}><Eye className="h-3 w-3" /></Button>
            {onEdit && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(quote)}><Pencil className="h-3 w-3" /></Button>}
            {onClone && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onClone(quote)}><Copy className="h-3 w-3" /></Button>}
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(quote.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
