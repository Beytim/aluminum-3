import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Pencil, Copy, FileText, ArrowRightLeft, User, Package, Clock, CreditCard } from "lucide-react";
import type { EnhancedQuote } from "@/data/enhancedQuoteData";
import { formatETB, formatETBCompact, daysUntilExpiry, getQuoteStatusColor } from "@/data/enhancedQuoteData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: EnhancedQuote | null;
  onEdit?: (q: EnhancedQuote) => void;
}

export function QuoteDetailsDialog({ open, onOpenChange, quote, onEdit }: Props) {
  if (!quote) return null;
  const days = daysUntilExpiry(quote.expiryDate);
  const totalItems = quote.items.reduce((s, i) => s + i.quantity, 0);
  const marginColor = quote.profitMargin >= 40 ? 'text-success' : quote.profitMargin >= 25 ? 'text-warning' : 'text-destructive';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <DialogTitle className="text-lg">{quote.quoteNumber} · {quote.title}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">{quote.customerName} · {quote.projectName}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getQuoteStatusColor(quote.status)}`}>{quote.status}</span>
              <Badge variant="outline" className="text-[10px]">{quote.version}</Badge>
              {onEdit && <Button variant="outline" size="sm" onClick={() => onEdit(quote)}><Pencil className="h-3 w-3 mr-1" />Edit</Button>}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="items" className="text-xs">Items</TabsTrigger>
            <TabsTrigger value="financial" className="text-xs">Financial</TabsTrigger>
            <TabsTrigger value="customer" className="text-xs">Customer</TabsTrigger>
            <TabsTrigger value="versions" className="text-xs">Versions</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total', value: formatETB(quote.total), color: 'text-primary' },
                { label: 'Profit', value: formatETB(quote.totalProfit), color: marginColor },
                { label: 'Margin', value: `${quote.profitMargin}%`, color: marginColor },
                { label: 'Items', value: `${totalItems} units`, color: '' },
              ].map(c => (
                <Card key={c.label} className="shadow-card"><CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground">{c.label}</p>
                  <p className={`text-lg font-bold ${c.color || 'text-foreground'}`}>{c.value}</p>
                </CardContent></Card>
              ))}
            </div>
            <Card className="shadow-card"><CardContent className="p-4 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Quote Date:</span> <span className="font-medium">{quote.quoteDate}</span></div>
                <div><span className="text-muted-foreground">Expiry:</span> <span className="font-medium">{quote.expiryDate}</span> {quote.status === 'Pending' && <span className={days > 7 ? 'text-success' : 'text-destructive'}>({days > 0 ? `${days}d left` : 'Expired'})</span>}</div>
                <div><span className="text-muted-foreground">Payment Terms:</span> <span className="font-medium">{quote.paymentTerms}</span></div>
                {quote.finishType && <div><span className="text-muted-foreground">Finish:</span> <span className="font-medium">{quote.finishType}</span></div>}
                <div><span className="text-muted-foreground">Created By:</span> <span className="font-medium">{quote.createdByName}</span></div>
                {quote.projectId && <div><span className="text-muted-foreground">Project:</span> <span className="font-medium text-primary">{quote.projectId}</span></div>}
              </div>
              {quote.notes && <div className="pt-2 border-t"><span className="text-muted-foreground">Notes:</span> <span>{quote.notes}</span></div>}
              {quote.warranty && <div><span className="text-muted-foreground">Warranty:</span> <span>{quote.warranty}</span></div>}
            </CardContent></Card>
          </TabsContent>

          {/* ITEMS */}
          <TabsContent value="items">
            <Card className="shadow-card"><CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Product</TableHead>
                  <TableHead className="text-xs text-center">Qty</TableHead>
                  <TableHead className="text-xs text-right">Unit Price</TableHead>
                  <TableHead className="text-xs text-right hidden md:table-cell">Discount</TableHead>
                  <TableHead className="text-xs text-right">Line Total</TableHead>
                  <TableHead className="text-xs text-right hidden lg:table-cell">Cost</TableHead>
                  <TableHead className="text-xs text-right hidden lg:table-cell">Profit</TableHead>
                  <TableHead className="text-xs text-center hidden md:table-cell">Margin</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {quote.items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-[10px] text-muted-foreground">{item.productCode} · {item.category}</div>
                      </TableCell>
                      <TableCell className="text-xs text-center">{item.quantity} {item.unit}</TableCell>
                      <TableCell className="text-xs text-right">{formatETBCompact(item.unitPrice)}</TableCell>
                      <TableCell className="text-xs text-right hidden md:table-cell">{item.discountPercent > 0 ? `${item.discountPercent}%` : '-'}</TableCell>
                      <TableCell className="text-xs text-right font-medium">{formatETBCompact(item.lineTotal)}</TableCell>
                      <TableCell className="text-xs text-right text-muted-foreground hidden lg:table-cell">{formatETBCompact(item.lineCost)}</TableCell>
                      <TableCell className="text-xs text-right hidden lg:table-cell">{formatETBCompact(item.lineProfit)}</TableCell>
                      <TableCell className={`text-xs text-center hidden md:table-cell font-medium ${item.lineMargin >= 35 ? 'text-success' : item.lineMargin >= 20 ? 'text-warning' : 'text-destructive'}`}>{item.lineMargin}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/30">
                    <TableCell className="text-xs font-semibold">Totals</TableCell>
                    <TableCell className="text-xs text-center font-semibold">{totalItems}</TableCell>
                    <TableCell colSpan={2} className="hidden md:table-cell" />
                    <TableCell className="text-xs text-right font-semibold">{formatETB(quote.subtotal)}</TableCell>
                    <TableCell className="text-xs text-right font-semibold text-muted-foreground hidden lg:table-cell">{formatETB(quote.totalCost)}</TableCell>
                    <TableCell className="text-xs text-right font-semibold hidden lg:table-cell">{formatETB(quote.totalProfit)}</TableCell>
                    <TableCell className={`text-xs text-center font-semibold hidden md:table-cell ${marginColor}`}>{quote.profitMargin}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>

          {/* FINANCIAL */}
          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-card"><CardContent className="p-4 space-y-2 text-xs">
                <p className="font-semibold text-sm mb-3">Pricing Summary</p>
                {[
                  ['Subtotal', quote.subtotal],
                  ...(quote.discountAmount > 0 ? [['Discount', -quote.discountAmount]] : []),
                  ...(quote.installationCost > 0 ? [['Installation', quote.installationCost]] : []),
                  ...(quote.transportCost > 0 ? [['Transport', quote.transportCost]] : []),
                  ...(quote.cuttingFee > 0 ? [['Cutting Fee', quote.cuttingFee]] : []),
                  ...(quote.finishUpcharge > 0 ? [['Finish Upcharge', quote.finishUpcharge]] : []),
                  ...(quote.rushFee > 0 ? [['Rush Fee', quote.rushFee]] : []),
                  ['VAT (15%)', quote.taxAmount],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className={`font-medium ${(val as number) < 0 ? 'text-destructive' : ''}`}>{formatETB(Math.abs(val as number))}</span></div>
                ))}
                <div className="flex justify-between font-semibold text-sm pt-2 border-t"><span>Grand Total</span><span className="text-primary">{formatETB(quote.total)}</span></div>
              </CardContent></Card>
              <Card className="shadow-card"><CardContent className="p-4 space-y-3 text-xs">
                <p className="font-semibold text-sm mb-3">Profitability</p>
                <div className="flex justify-between"><span className="text-muted-foreground">Total Revenue</span><span className="font-medium">{formatETB(quote.total)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total Cost</span><span className="font-medium">{formatETB(quote.totalCost)}</span></div>
                <div className="flex justify-between font-semibold pt-2 border-t"><span>Profit</span><span className={marginColor}>{formatETB(quote.totalProfit)}</span></div>
                <div className="mt-2">
                  <div className="flex justify-between mb-1"><span className="text-muted-foreground">Profit Margin</span><span className={`font-bold ${marginColor}`}>{quote.profitMargin}%</span></div>
                  <Progress value={quote.profitMargin} className="h-2" />
                </div>
              </CardContent></Card>
            </div>
          </TabsContent>

          {/* CUSTOMER */}
          <TabsContent value="customer">
            <Card className="shadow-card"><CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="font-semibold text-sm">{quote.customerName}</p>
                  <p className="text-muted-foreground">{quote.customerCode}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Contact:</span> <span className="font-medium">{quote.customerContact || '-'}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{quote.customerEmail || '-'}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{quote.customerPhone || '-'}</span></div>
                <div><span className="text-muted-foreground">Payment Terms:</span> <span className="font-medium">{quote.customerSnapshot.paymentTerms}</span></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t">
                <div><p className="text-muted-foreground">Health Score</p><p className="text-lg font-bold">{quote.customerSnapshot.healthScore}</p></div>
                <div><p className="text-muted-foreground">Outstanding</p><p className="text-lg font-bold">{formatETBCompact(quote.customerSnapshot.outstandingBalance)}</p></div>
                <div><p className="text-muted-foreground">Credit Limit</p><p className="text-lg font-bold">{formatETBCompact(quote.customerSnapshot.creditLimit)}</p></div>
                <div><p className="text-muted-foreground">Utilization</p><p className="text-lg font-bold">{Math.round((quote.customerSnapshot.outstandingBalance / quote.customerSnapshot.creditLimit) * 100)}%</p></div>
              </div>
            </CardContent></Card>
          </TabsContent>

          {/* VERSIONS */}
          <TabsContent value="versions">
            <Card className="shadow-card"><CardContent className="p-4 space-y-3">
              {quote.versionHistory.map((v, i) => (
                <div key={v.version} className={`flex items-start gap-3 p-3 rounded-lg ${i === 0 ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30'}`}>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{v.version}</div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{v.version}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] ${getQuoteStatusColor(v.status)}`}>{v.status}</span>
                      {i === 0 && <Badge className="text-[9px] h-4">Current</Badge>}
                    </div>
                    <p className="text-muted-foreground mt-0.5">{v.changes}</p>
                    <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground">
                      <span>{v.createdByName}</span>
                      <span>{v.createdAt}</span>
                      <span className="font-medium">{formatETBCompact(v.total)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>

          {/* ACTIVITY */}
          <TabsContent value="activity">
            <Card className="shadow-card"><CardContent className="p-4 space-y-2">
              {quote.activityLog.map((a, i) => {
                const icons: Record<string, string> = { created: '📝', updated: '✏️', sent: '📧', viewed: '👁️', accepted: '✅', rejected: '❌', expired: '⏰', converted: '🔄' };
                return (
                  <div key={i} className="flex gap-3 py-2 border-b last:border-0 text-xs">
                    <span className="text-lg">{icons[a.action] || '📋'}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{a.action}</span>
                        <span className="text-muted-foreground text-[10px]">{a.date}</span>
                      </div>
                      <p className="text-muted-foreground">{a.userName}{a.notes ? ` · ${a.notes}` : ''}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
