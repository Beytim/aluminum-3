import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Minus, Search, Trash2 } from "lucide-react";
import type { EnhancedQuote, QuoteItem, QuoteStatus } from "@/data/enhancedQuoteData";
import { formatETB, formatETBCompact } from "@/data/enhancedQuoteData";
import type { Customer, Product } from "@/data/sampleData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: EnhancedQuote | null;
  customers: Customer[];
  products: Product[];
  onSave: (q: EnhancedQuote) => void;
}

export function EditEnhancedQuoteDialog({ open, onOpenChange, quote, customers, products, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [projectName, setProjectName] = useState('');
  const [status, setStatus] = useState<QuoteStatus>('Draft');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [notes, setNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [installationCost, setInstallationCost] = useState(0);
  const [transportCost, setTransportCost] = useState(0);
  const [cuttingFee, setCuttingFee] = useState(0);
  const [finishUpcharge, setFinishUpcharge] = useState(0);
  const [rushFee, setRushFee] = useState(0);

  useEffect(() => {
    if (quote) {
      setTitle(quote.title); setProjectName(quote.projectName); setStatus(quote.status);
      setPaymentTerms(quote.paymentTerms); setNotes(quote.notes || ''); setInternalNotes(quote.internalNotes || '');
      setItems([...quote.items]); setInstallationCost(quote.installationCost); setTransportCost(quote.transportCost);
      setCuttingFee(quote.cuttingFee); setFinishUpcharge(quote.finishUpcharge); setRushFee(quote.rushFee);
    }
  }, [quote]);

  const filteredProducts = useMemo(() => {
    const active = products.filter(p => p.status === 'Active');
    if (!productSearch) return active;
    const s = productSearch.toLowerCase();
    return active.filter(p => p.name.toLowerCase().includes(s) || p.code.toLowerCase().includes(s));
  }, [products, productSearch]);

  const addProduct = (p: Product) => {
    if (items.find(i => i.productId === p.id)) return;
    const matCost = p.profileCost || p.materialCost || 0;
    const glassCost = p.glassCost || 0;
    const hwCost = p.hardwareCost || 0;
    const accCost = p.accessoriesCost || 0;
    const fabLabor = p.fabLaborCost || 0;
    const instLabor = p.installLaborCost || 0;
    const totalCostPerUnit = matCost + glassCost + hwCost + accCost + fabLabor + instLabor;
    const unitPrice = p.sellingPrice;
    setItems(prev => [...prev, {
      id: `qi-edit-${Date.now()}`, productId: p.id, productCode: p.code, productName: p.name, productNameAm: p.nameAm,
      category: p.category, quantity: 1, unit: 'pcs' as const, profile: p.profile, glass: p.glass,
      materialCost: matCost, glassCost, hardwareCost: hwCost, accessoriesCost: accCost,
      fabricationLabor: fabLabor, installationLabor: instLabor, totalCostPerUnit,
      unitPrice, discountPercent: 0, discountAmount: 0, netPrice: unitPrice,
      lineTotal: unitPrice, lineCost: totalCostPerUnit, lineProfit: unitPrice - totalCostPerUnit,
      lineMargin: unitPrice > 0 ? Math.round(((unitPrice - totalCostPerUnit) / unitPrice) * 100) : 0,
    }]);
  };

  const updateItemQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const lineTotal = i.netPrice * qty;
      const lineCost = i.totalCostPerUnit * qty;
      return { ...i, quantity: qty, lineTotal, lineCost, lineProfit: lineTotal - lineCost, lineMargin: lineTotal > 0 ? Math.round(((lineTotal - lineCost) / lineTotal) * 100) : 0 };
    }));
  };

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const fees = installationCost + transportCost + cuttingFee + finishUpcharge + rushFee;
  const taxAmount = Math.round((subtotal + fees) * 0.15);
  const total = subtotal + fees + taxAmount;
  const totalCost = items.reduce((s, i) => s + i.lineCost, 0);
  const profitMargin = total > 0 ? Math.round(((total - totalCost) / total) * 100) : 0;

  const handleSave = () => {
    if (!quote) return;
    const now = new Date().toISOString().split('T')[0];
    const updated: EnhancedQuote = {
      ...quote, title, projectName, status, paymentTerms, notes, internalNotes,
      items, subtotal, taxableAmount: subtotal, installationCost, transportCost, cuttingFee, finishUpcharge, rushFee,
      taxAmount, total, totalCost, totalProfit: total - totalCost, profitMargin,
      updatedAt: now, updatedBy: 'EMP-001', updatedByName: 'Admin',
      isExpired: status === 'Expired', isConverted: status === 'Converted',
      activityLog: [...quote.activityLog, { date: now, user: 'EMP-001', userName: 'Admin', action: 'updated' as const, notes: 'Quote updated' }],
    };
    onSave(updated);
    onOpenChange(false);
  };

  if (!quote) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit {quote.quoteNumber}</DialogTitle></DialogHeader>
        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
            <TabsTrigger value="products" className="text-xs">Products ({items.length})</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs">Pricing</TabsTrigger>
            <TabsTrigger value="terms" className="text-xs">Terms</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Label className="text-xs">Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} className="text-xs" /></div>
              <div><Label className="text-xs">Project Name</Label><Input value={projectName} onChange={e => setProjectName(e.target.value)} className="text-xs" /></div>
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={status} onValueChange={v => setStatus(v as QuoteStatus)}>
                  <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Draft','Pending','Accepted','Rejected','Expired','Converted'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-3 mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search products..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="pl-8 text-xs" />
            </div>
            <div className="max-h-[150px] overflow-y-auto border rounded-lg">
              {filteredProducts.slice(0, 15).map(p => {
                const added = items.some(i => i.productId === p.id);
                return (
                  <div key={p.id} className={`flex items-center justify-between px-3 py-2 border-b last:border-0 text-xs ${added ? 'bg-primary/5' : 'hover:bg-muted/50'}`}>
                    <span>{p.name} <span className="text-muted-foreground">{p.code}</span></span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{formatETBCompact(p.sellingPrice)}</span>
                      <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => addProduct(p)} disabled={added}>{added ? 'Added' : 'Add'}</Button>
                    </div>
                  </div>
                );
              })}
            </div>
            {items.length > 0 && (
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Product</TableHead>
                  <TableHead className="text-xs text-center w-28">Qty</TableHead>
                  <TableHead className="text-xs text-right">Total</TableHead>
                  <TableHead className="text-xs w-8" />
                </TableRow></TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs">{item.productName}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateItemQty(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                          <Input className="w-12 h-6 text-xs text-center p-0" value={item.quantity} onChange={e => updateItemQty(item.id, parseInt(e.target.value) || 1)} />
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateItemQty(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-right font-medium">{formatETBCompact(item.lineTotal)}</TableCell>
                      <TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}><Trash2 className="h-3 w-3 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="pricing" className="space-y-3 mt-4">
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-xs">Installation</Label><Input type="number" value={installationCost} onChange={e => setInstallationCost(Number(e.target.value))} className="text-xs" /></div>
              <div><Label className="text-xs">Transport</Label><Input type="number" value={transportCost} onChange={e => setTransportCost(Number(e.target.value))} className="text-xs" /></div>
              <div><Label className="text-xs">Cutting Fee</Label><Input type="number" value={cuttingFee} onChange={e => setCuttingFee(Number(e.target.value))} className="text-xs" /></div>
              <div><Label className="text-xs">Finish Upcharge</Label><Input type="number" value={finishUpcharge} onChange={e => setFinishUpcharge(Number(e.target.value))} className="text-xs" /></div>
              <div><Label className="text-xs">Rush Fee</Label><Input type="number" value={rushFee} onChange={e => setRushFee(Number(e.target.value))} className="text-xs" /></div>
            </div>
            <Card><CardContent className="p-3 text-xs space-y-1">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatETB(subtotal)}</span></div>
              <div className="flex justify-between"><span>Fees</span><span>{formatETB(fees)}</span></div>
              <div className="flex justify-between"><span>VAT (15%)</span><span>{formatETB(taxAmount)}</span></div>
              <div className="flex justify-between font-semibold pt-1 border-t"><span>Total</span><span className="text-primary">{formatETB(total)}</span></div>
              <div className="flex justify-between mt-2"><span>Margin</span><span className={profitMargin >= 35 ? 'text-success' : 'text-warning'}>{profitMargin}%</span></div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="terms" className="space-y-3 mt-4">
            <div><Label className="text-xs">Payment Terms</Label><Input value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="text-xs" /></div>
            <div><Label className="text-xs">Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-xs" rows={2} /></div>
            <div><Label className="text-xs">Internal Notes</Label><Textarea value={internalNotes} onChange={e => setInternalNotes(e.target.value)} className="text-xs" rows={2} /></div>
          </TabsContent>
        </Tabs>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={handleSave}>Save Changes</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
