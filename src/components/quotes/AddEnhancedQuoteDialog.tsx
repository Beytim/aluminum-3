import { useState, useMemo } from "react";
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
import type { EnhancedQuote, QuoteItem } from "@/data/enhancedQuoteData";
import { generateQuoteNumber, formatETB, formatETBCompact } from "@/data/enhancedQuoteData";
import type { Customer, Product } from "@/data/sampleData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (q: EnhancedQuote) => void;
  customers: Customer[];
  products: Product[];
  existingCount: number;
}

export function AddEnhancedQuoteDialog({ open, onOpenChange, onAdd, customers, products, existingCount }: Props) {
  const [tab, setTab] = useState('basic');
  const [customerId, setCustomerId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [title, setTitle] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('50% deposit, 50% on delivery');
  const [finishType, setFinishType] = useState('');
  const [notes, setNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [warranty, setWarranty] = useState('5 years on frame, 2 years on hardware');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [installationCost, setInstallationCost] = useState(0);
  const [transportCost, setTransportCost] = useState(0);
  const [cuttingFee, setCuttingFee] = useState(0);
  const [finishUpcharge, setFinishUpcharge] = useState(0);
  const [rushFee, setRushFee] = useState(0);

  const customer = customers.find(c => c.id === customerId);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products.filter(p => p.status === 'Active');
    const s = productSearch.toLowerCase();
    return products.filter(p => p.status === 'Active' && (p.name.toLowerCase().includes(s) || p.code.toLowerCase().includes(s) || p.category.toLowerCase().includes(s)));
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
    const lineTotal = unitPrice;
    const lineCost = totalCostPerUnit;
    setItems(prev => [...prev, {
      id: `qi-new-${Date.now()}`, productId: p.id, productCode: p.code, productName: p.name, productNameAm: p.nameAm,
      category: p.category, quantity: 1, unit: 'pcs', profile: p.profile, glass: p.glass,
      materialCost: matCost, glassCost, hardwareCost: hwCost, accessoriesCost: accCost,
      fabricationLabor: fabLabor, installationLabor: instLabor, totalCostPerUnit,
      unitPrice, discountPercent: 0, discountAmount: 0, netPrice: unitPrice,
      lineTotal, lineCost, lineProfit: lineTotal - lineCost, lineMargin: lineTotal > 0 ? Math.round(((lineTotal - lineCost) / lineTotal) * 100) : 0,
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

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const fees = installationCost + transportCost + cuttingFee + finishUpcharge + rushFee;
  const taxAmount = Math.round((subtotal + fees) * 0.15);
  const total = subtotal + fees + taxAmount;
  const totalCost = items.reduce((s, i) => s + i.lineCost, 0);
  const totalProfit = total - totalCost;
  const profitMargin = total > 0 ? Math.round((totalProfit / total) * 100) : 0;
  const marginColor = profitMargin >= 40 ? 'text-success' : profitMargin >= 25 ? 'text-warning' : 'text-destructive';

  const handleSave = () => {
    if (!customerId || !title || items.length === 0) return;
    const now = new Date().toISOString().split('T')[0];
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const qn = generateQuoteNumber(existingCount);
    const quote: EnhancedQuote = {
      id: qn, quoteNumber: qn, version: 'v1',
      versionHistory: [{ version: 'v1', createdAt: now, createdBy: 'EMP-001', createdByName: 'Admin', changes: 'Initial quote', total, status: 'Draft' }],
      customerId, customerName: customer?.name || '', customerCode: customer?.id || '',
      customerContact: customer?.contact, customerEmail: customer?.email, customerPhone: customer?.phone,
      customerSnapshot: { healthScore: 50, outstandingBalance: customer?.outstanding || 0, creditLimit: customer?.creditLimit || 0, paymentTerms: customer?.paymentTerms || 'COD' },
      projectName: projectName || title, title, items, subtotal, discountAmount: 0, taxableAmount: subtotal,
      installationCost, transportCost, cuttingFee, finishUpcharge, rushFee, otherFees: 0,
      taxRate: 15, taxAmount, total, totalCost, totalProfit, profitMargin,
      quoteDate: now, expiryDate: expiry, validityDays: 30,
      status: 'Draft', paymentTerms, warranty,
      finishType: finishType as any || undefined,
      notes, internalNotes,
      activityLog: [{ date: now, user: 'EMP-001', userName: 'Admin', action: 'created' }],
      isExpired: false, isConverted: false, currency: 'ETB',
      createdBy: 'EMP-001', createdByName: 'Admin', createdAt: now,
      updatedBy: 'EMP-001', updatedByName: 'Admin', updatedAt: now,
    };
    onAdd(quote);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setCustomerId(''); setProjectName(''); setTitle(''); setItems([]); setNotes(''); setInternalNotes('');
    setInstallationCost(0); setTransportCost(0); setCuttingFee(0); setFinishUpcharge(0); setRushFee(0);
    setTab('basic');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Quote</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="basic" className="text-xs">Basic Info</TabsTrigger>
            <TabsTrigger value="products" className="text-xs">Products ({items.length})</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs">Pricing</TabsTrigger>
            <TabsTrigger value="terms" className="text-xs">Terms</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-xs">Customer *</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger className="text-xs"><SelectValue placeholder="Select customer..." /></SelectTrigger>
                  <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name} ({c.id})</SelectItem>)}</SelectContent>
                </Select>
                {customer && (
                  <div className="mt-1 text-[10px] text-muted-foreground flex gap-3">
                    <span>📞 {customer.phone}</span>
                    <span>📧 {customer.email}</span>
                    <span>💰 Outstanding: {formatETBCompact(customer.outstanding)}</span>
                  </div>
                )}
              </div>
              <div className="col-span-2"><Label className="text-xs">Quote Title *</Label><Input value={title} onChange={e => setTitle(e.target.value)} className="text-xs" placeholder="e.g. Bole Tower - Windows Package" /></div>
              <div><Label className="text-xs">Project Name</Label><Input value={projectName} onChange={e => setProjectName(e.target.value)} className="text-xs" /></div>
              <div>
                <Label className="text-xs">Finish Type</Label>
                <Select value={finishType} onValueChange={setFinishType}>
                  <SelectTrigger className="text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mill Finish">Mill Finish</SelectItem>
                    <SelectItem value="Anodized">Anodized</SelectItem>
                    <SelectItem value="Powder Coated">Powder Coated</SelectItem>
                    <SelectItem value="Polished">Polished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-3 mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search products by name, code, or category..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="pl-8 text-xs" />
            </div>
            <div className="max-h-[180px] overflow-y-auto border rounded-lg">
              {filteredProducts.slice(0, 20).map(p => {
                const added = items.some(i => i.productId === p.id);
                return (
                  <div key={p.id} className={`flex items-center justify-between px-3 py-2 border-b last:border-0 text-xs ${added ? 'bg-primary/5' : 'hover:bg-muted/50'}`}>
                    <div>
                      <span className="font-medium">{p.name}</span>
                      <span className="text-muted-foreground ml-2">{p.code} · {p.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{formatETBCompact(p.sellingPrice)}</span>
                      <Button variant={added ? "secondary" : "outline"} size="sm" className="h-6 text-[10px]" onClick={() => addProduct(p)} disabled={added}>
                        {added ? 'Added' : <><Plus className="h-3 w-3 mr-0.5" />Add</>}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            {items.length > 0 && (
              <Card><CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead className="text-xs">Product</TableHead>
                    <TableHead className="text-xs text-center w-28">Qty</TableHead>
                    <TableHead className="text-xs text-right">Unit Price</TableHead>
                    <TableHead className="text-xs text-right">Total</TableHead>
                    <TableHead className="text-xs w-8" />
                  </TableRow></TableHeader>
                  <TableBody>
                    {items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="text-xs">{item.productName}<br /><span className="text-[10px] text-muted-foreground">{item.productCode}</span></TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateItemQty(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                            <Input className="w-12 h-6 text-xs text-center p-0" value={item.quantity} onChange={e => updateItemQty(item.id, parseInt(e.target.value) || 1)} />
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateItemQty(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-right">{formatETBCompact(item.unitPrice)}</TableCell>
                        <TableCell className="text-xs text-right font-medium">{formatETBCompact(item.lineTotal)}</TableCell>
                        <TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent></Card>
            )}
          </TabsContent>

          <TabsContent value="pricing" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div><Label className="text-xs">Installation (ETB)</Label><Input type="number" value={installationCost} onChange={e => setInstallationCost(Number(e.target.value))} className="text-xs" /></div>
              <div><Label className="text-xs">Transport (ETB)</Label><Input type="number" value={transportCost} onChange={e => setTransportCost(Number(e.target.value))} className="text-xs" /></div>
              <div><Label className="text-xs">Cutting Fee (ETB)</Label><Input type="number" value={cuttingFee} onChange={e => setCuttingFee(Number(e.target.value))} className="text-xs" /></div>
              <div><Label className="text-xs">Finish Upcharge (ETB)</Label><Input type="number" value={finishUpcharge} onChange={e => setFinishUpcharge(Number(e.target.value))} className="text-xs" /></div>
              <div><Label className="text-xs">Rush Fee (ETB)</Label><Input type="number" value={rushFee} onChange={e => setRushFee(Number(e.target.value))} className="text-xs" /></div>
            </div>
            <Card className="shadow-card"><CardContent className="p-4 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatETB(subtotal)}</span></div>
              {fees > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Additional Fees</span><span>{formatETB(fees)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">VAT (15%)</span><span>{formatETB(taxAmount)}</span></div>
              <div className="flex justify-between font-semibold text-sm pt-2 border-t"><span>Grand Total</span><span className="text-primary">{formatETB(total)}</span></div>
              <div className="mt-3">
                <div className="flex justify-between mb-1"><span className="text-muted-foreground">Profit Margin</span><span className={`font-bold ${marginColor}`}>{profitMargin}%</span></div>
                <Progress value={Math.max(0, Math.min(100, profitMargin))} className="h-2" />
                <div className="flex justify-between mt-1 text-[10px]"><span className="text-muted-foreground">Cost: {formatETBCompact(totalCost)}</span><span className={marginColor}>Profit: {formatETBCompact(totalProfit)}</span></div>
              </div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="terms" className="space-y-3 mt-4">
            <div><Label className="text-xs">Payment Terms</Label><Input value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="text-xs" /></div>
            <div><Label className="text-xs">Warranty</Label><Input value={warranty} onChange={e => setWarranty(e.target.value)} className="text-xs" /></div>
            <div><Label className="text-xs">Notes (visible to customer)</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-xs" rows={2} /></div>
            <div><Label className="text-xs">Internal Notes</Label><Textarea value={internalNotes} onChange={e => setInternalNotes(e.target.value)} className="text-xs" rows={2} /></div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!customerId || !title || items.length === 0}>Create Quote</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
