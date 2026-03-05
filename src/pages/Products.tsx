import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, Grid3X3, List, Package, Download, MoreVertical, Eye, Pencil, Copy, Trash2, PackageCheck, BarChart3, TrendingUp, Power, PowerOff, Printer, AlertTriangle, TrendingDown, DollarSign, Layers, Box, Wrench, ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import { sampleProducts } from "@/data/sampleData";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { AddProductDialog } from "@/components/dialogs/AddProductDialog";
import { EditProductDialog } from "@/components/dialogs/EditProductDialog";
import { ProductDetailsDialog } from "@/components/dialogs/ProductDetailsDialog";
import { generateReportPDF } from "@/lib/pdfExport";
import type { Product } from "@/data/sampleData";
import { useToast } from "@/hooks/use-toast";

function calcTotalCost(p: Product) {
  const sub = (p.profileCost || 0) + (p.glassCost || 0) + (p.hardwareCost || 0) + (p.accessoriesCost || 0) + (p.fabLaborCost || 0) + (p.installLaborCost || 0);
  const tc = sub + (sub * ((p.overheadPercent || 0) / 100));
  return tc > 0 ? tc : p.materialCost;
}

function calcMargin(p: Product) {
  const cost = calcTotalCost(p);
  return p.sellingPrice > 0 ? (((p.sellingPrice - cost) / p.sellingPrice) * 100) : 0;
}

export default function Products() {
  const [products, setProducts] = useLocalStorage<Product[]>(STORAGE_KEYS.PRODUCTS, sampleProducts);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [marginFilter, setMarginFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { t, language } = useI18n();
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "all" || p.category === catFilter;
      const matchType = typeFilter === "all" || p.productType === typeFilter;
      let matchStock = true;
      if (stockFilter === "low") matchStock = (p.currentStock ?? 0) <= (p.minStock ?? 0) && (p.currentStock ?? 0) > 0;
      else if (stockFilter === "critical") matchStock = (p.currentStock ?? 0) <= ((p.minStock ?? 0) * 0.5);
      else if (stockFilter === "over") matchStock = (p.currentStock ?? 0) > (p.maxStock ?? Infinity);
      let matchMargin = true;
      const mg = calcMargin(p);
      if (marginFilter === "high") matchMargin = mg > 40;
      else if (marginFilter === "medium") matchMargin = mg >= 25 && mg <= 40;
      else if (marginFilter === "low") matchMargin = mg >= 0 && mg < 25;
      else if (marginFilter === "negative") matchMargin = mg < 0;
      return matchSearch && matchCat && matchType && matchStock && matchMargin;
    });
  }, [search, catFilter, typeFilter, stockFilter, marginFilter, products]);

  const categories = [...new Set(products.map(p => p.category))];

  // Stats
  const totalRevenue = products.reduce((s, p) => s + p.sellingPrice * (p.currentStock ?? 0), 0);
  const totalCostVal = products.reduce((s, p) => s + calcTotalCost(p) * (p.currentStock ?? 0), 0);
  const avgMargin = products.length > 0 ? products.reduce((s, p) => s + calcMargin(p), 0) / products.length : 0;
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const inventoryValue = products.reduce((s, p) => s + calcTotalCost(p) * (p.currentStock ?? 0), 0);
  const lowStockCount = products.filter(p => (p.currentStock ?? 0) <= (p.minStock ?? 0)).length;

  const byType = (type: Product['productType']) => {
    const items = products.filter(p => p.productType === type);
    const avgM = items.length > 0 ? items.reduce((s, p) => s + calcMargin(p), 0) / items.length : 0;
    return { count: items.length, margin: avgM };
  };
  const rawMat = byType('Raw Material');
  const fabricated = byType('Fabricated');
  const system = byType('System');
  const custom = byType('Custom');

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    toast({ title: "Deleted", description: "Product removed." });
  };

  const handleBulkDelete = () => {
    setProducts(prev => prev.filter(p => !selectedIds.has(p.id)));
    toast({ title: "Deleted", description: `${selectedIds.size} products removed.` });
    setSelectedIds(new Set());
  };

  const handleClone = (p: Product) => {
    const id = `PRD-${String(products.length + 1).padStart(3, '0')}`;
    const cloned: Product = { ...p, id, code: `${p.code}-COPY`, name: `${p.name} (Copy)`, nameAm: `${p.nameAm} (ቅጂ)` };
    setProducts(prev => [...prev, cloned]);
    toast({ title: "Cloned", description: `${cloned.name} created.` });
  };

  const handleToggleStatus = (p: Product) => {
    const newStatus = p.status === 'Active' ? 'Inactive' : 'Active';
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, status: newStatus } : x));
    toast({ title: "Updated", description: `${p.name} ${newStatus === 'Active' ? 'activated' : 'deactivated'}.` });
  };

  const handleBulkExport = () => {
    const sel = products.filter(p => selectedIds.has(p.id));
    generateReportPDF("Selected Products", ['Code', 'Name', 'Type', 'Cost', 'Price', 'Margin'], sel.map(p => [p.code, p.name, p.productType, `ETB ${calcTotalCost(p).toLocaleString()}`, `ETB ${p.sellingPrice.toLocaleString()}`, `${calcMargin(p).toFixed(1)}%`]));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const allSelected = filtered.length > 0 && filtered.every(p => selectedIds.has(p.id));
  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(p => p.id)));
  };

  const handleExportPDF = () => {
    generateReportPDF("Product Catalog",
      ['Code', 'Name', 'Category', 'Type', 'Cost', 'Price', 'Margin', 'Stock'],
      filtered.map(p => [p.code, p.name, p.category, p.productType, `ETB ${calcTotalCost(p).toLocaleString()}`, `ETB ${p.sellingPrice.toLocaleString()}`, `${calcMargin(p).toFixed(1)}%`, String(p.currentStock ?? 0)])
    );
  };

  const StatCard = ({ icon: Icon, label, value, sub, trend, color }: { icon: any; label: string; value: string; sub?: string; trend?: string; color: string }) => (
    <Card className="shadow-card">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <div className={`h-7 w-7 rounded flex items-center justify-center ${color}`}><Icon className="h-3.5 w-3.5 text-primary-foreground" /></div>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
        </div>
        <p className="text-lg font-bold text-foreground">{value}</p>
        {(sub || trend) && <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">{trend && (trend.startsWith('+') || trend.startsWith('▲') ? <ArrowUpRight className="h-2.5 w-2.5 text-success" /> : <ArrowDownRight className="h-2.5 w-2.5 text-destructive" />)}{sub || trend}</p>}
      </CardContent>
    </Card>
  );

  const TypeCard = ({ label, count, margin }: { label: string; count: number; margin: number }) => (
    <Card className="shadow-card">
      <CardContent className="p-3">
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-foreground">{count} <span className="text-xs font-normal text-muted-foreground">products</span></p>
        <p className="text-[10px] text-muted-foreground">Margin {margin.toFixed(0)}%</p>
      </CardContent>
    </Card>
  );

  // Type distribution bar
  const total = products.length || 1;
  const typeBar = [
    { label: 'Raw Material', count: rawMat.count, color: 'bg-chart-1' },
    { label: 'Fabricated', count: fabricated.count, color: 'bg-chart-3' },
    { label: 'Systems', count: system.count, color: 'bg-chart-2' },
    { label: 'Custom', count: custom.count, color: 'bg-chart-4' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('products.title')}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{products.length} {t('nav.products').toLowerCase()}{lowStockCount > 0 && <span className="text-destructive ml-2">⚠ {lowStockCount} low stock</span>}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex border rounded-md">
            <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('table')}><List className="h-3.5 w-3.5" /></Button>
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}><Grid3X3 className="h-3.5 w-3.5" /></Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportPDF}><Download className="h-3.5 w-3.5 mr-1.5" />PDF</Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />{t('products.add')}</Button>
        </div>
      </div>

      {/* Stats Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={DollarSign} label="Revenue Potential" value={`ETB ${(totalRevenue / 1000).toFixed(0)}K`} trend="+12%" color="bg-primary" />
        <StatCard icon={TrendingUp} label="Avg Margin" value={`${avgMargin.toFixed(0)}%`} trend="-2%" color="bg-chart-3" />
        <StatCard icon={Package} label="Active Products" value={String(activeProducts)} trend={`+${products.length - activeProducts === 0 ? '0' : '2'}`} color="bg-chart-2" />
        <StatCard icon={Layers} label="Inventory Value" value={`ETB ${(inventoryValue / 1000).toFixed(0)}K`} trend="-5%" color="bg-chart-4" />
      </div>

      {/* Stats Row 2 - Type cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <TypeCard label="Raw Material" count={rawMat.count} margin={rawMat.margin} />
        <TypeCard label="Fabricated" count={fabricated.count} margin={fabricated.margin} />
        <TypeCard label="Systems" count={system.count} margin={system.margin} />
        <TypeCard label="Custom" count={custom.count} margin={custom.margin} />
      </div>

      {/* Type Distribution Bar */}
      <Card className="shadow-card">
        <CardContent className="p-3">
          <p className="text-xs font-semibold text-foreground mb-2">Product Type Distribution</p>
          <div className="flex h-3 rounded-full overflow-hidden bg-muted">
            {typeBar.map(tb => tb.count > 0 && (
              <div key={tb.label} className={`${tb.color} transition-all`} style={{ width: `${(tb.count / total) * 100}%` }} title={`${tb.label}: ${tb.count}`} />
            ))}
          </div>
          <div className="flex gap-4 mt-2 flex-wrap">
            {typeBar.map(tb => (
              <div key={tb.label} className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${tb.color}`} />
                <span className="text-[10px] text-muted-foreground">{tb.label} <span className="font-semibold text-foreground">{tb.count}</span></span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-3 flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('common.search')} className="pl-9 h-8 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-28 sm:w-36 h-8 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-28 sm:w-32 h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Raw Material">Raw Material</SelectItem>
              <SelectItem value="Fabricated">Fabricated</SelectItem>
              <SelectItem value="System">System</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-24 sm:w-28 h-8 text-xs"><SelectValue placeholder="Stock" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="over">Overstock</SelectItem>
            </SelectContent>
          </Select>
          <Select value={marginFilter} onValueChange={setMarginFilter}>
            <SelectTrigger className="w-24 sm:w-28 h-8 text-xs"><SelectValue placeholder="Margin" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Margin</SelectItem>
              <SelectItem value="high">High (&gt;40%)</SelectItem>
              <SelectItem value="medium">Medium (25-40%)</SelectItem>
              <SelectItem value="low">Low (&lt;25%)</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => {
            const mg = calcMargin(p);
            const isLow = (p.currentStock ?? 0) <= (p.minStock ?? 0);
            return (
              <Card key={p.id} className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => setViewProduct(p)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-[10px]">{p.productType}</Badge>
                    <div className="flex items-center gap-1">
                      {isLow && <AlertTriangle className="h-3 w-3 text-destructive" />}
                      <Badge variant={p.status === 'Active' ? 'outline' : 'secondary'} className={`text-[10px] ${p.status === 'Active' ? 'text-success border-success/30' : ''}`}>{p.status}</Badge>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold mt-2">{language === 'am' ? p.nameAm : p.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">{p.profile} · {p.glass || p.form}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t">
                    <span className="text-xs text-muted-foreground">Stock: {p.currentStock ?? 0}</span>
                    <span className={`text-xs font-semibold ${mg >= 25 ? 'text-success' : mg >= 0 ? 'text-warning' : 'text-destructive'}`}>{mg.toFixed(0)}% margin</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Cost: ETB {calcTotalCost(p).toLocaleString()}</span>
                    <span className="text-sm font-bold text-primary">ETB {p.sellingPrice.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8 px-2"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>
                  <TableHead className="text-xs">Code</TableHead>
                  <TableHead className="text-xs">{t('common.name')}</TableHead>
                  <TableHead className="text-xs hidden sm:table-cell">{t('products.category')}</TableHead>
                  <TableHead className="text-xs hidden md:table-cell">Profile</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell">Glass</TableHead>
                  <TableHead className="text-xs hidden sm:table-cell">Type</TableHead>
                  <TableHead className="text-xs hidden md:table-cell text-right">Stock</TableHead>
                  <TableHead className="text-xs hidden lg:table-cell text-right">Margin</TableHead>
                  <TableHead className="text-xs text-right">{t('products.material_cost')}</TableHead>
                  <TableHead className="text-xs text-right">{t('products.selling_price')}</TableHead>
                  <TableHead className="text-xs hidden sm:table-cell">{t('common.status')}</TableHead>
                  <TableHead className="text-xs w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => {
                  const mg = calcMargin(p);
                  const isLow = (p.currentStock ?? 0) <= (p.minStock ?? 0);
                  return (
                    <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewProduct(p)}>
                      <TableCell className="px-2" onClick={e => e.stopPropagation()}><Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} /></TableCell>
                      <TableCell className="text-xs font-mono">{p.code}</TableCell>
                      <TableCell className="text-xs font-medium max-w-[140px] truncate">{language === 'am' ? p.nameAm : p.name}</TableCell>
                      <TableCell className="hidden sm:table-cell"><Badge variant="secondary" className="text-[10px]">{p.category}</Badge></TableCell>
                      <TableCell className="text-xs hidden md:table-cell">{p.profile}</TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">{p.glass || '—'}</TableCell>
                      <TableCell className="hidden sm:table-cell"><Badge variant="outline" className="text-[10px]">{p.productType === 'Raw Material' ? 'Raw' : p.productType === 'Fabricated' ? 'Fab' : p.productType}</Badge></TableCell>
                      <TableCell className="text-xs text-right hidden md:table-cell">
                        <span className="flex items-center justify-end gap-1">
                          {p.currentStock ?? 0}
                          {isLow && <AlertTriangle className="h-3 w-3 text-destructive" />}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-right hidden lg:table-cell">
                        <span className={`font-medium ${mg >= 40 ? 'text-success' : mg >= 25 ? 'text-chart-2' : mg >= 0 ? 'text-warning' : 'text-destructive'}`}>{mg.toFixed(0)}%</span>
                      </TableCell>
                      <TableCell className="text-xs text-right">ETB {calcTotalCost(p).toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right font-semibold">ETB {p.sellingPrice.toLocaleString()}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={p.status === 'Active' ? 'outline' : 'secondary'} className={`text-[10px] ${p.status === 'Active' ? 'text-success border-success/30' : ''}`}>{p.status}</Badge>
                      </TableCell>
                      <TableCell onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => setViewProduct(p)}><Eye className="h-3.5 w-3.5 mr-2" />View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditProduct(p)}><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleClone(p)}><Copy className="h-3.5 w-3.5 mr-2" />Clone</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setViewProduct(p)}><PackageCheck className="h-3.5 w-3.5 mr-2" />View Stock</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setViewProduct(p)}><BarChart3 className="h-3.5 w-3.5 mr-2" />View BOM</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setViewProduct(p)}><TrendingUp className="h-3.5 w-3.5 mr-2" />Price History</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleStatus(p)}>
                              {p.status === 'Active' ? <><PowerOff className="h-3.5 w-3.5 mr-2" />Deactivate</> : <><Power className="h-3.5 w-3.5 mr-2" />Activate</>}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => generateReportPDF(p.name, ['Field', 'Value'], [['Code', p.code], ['Name', p.name], ['Category', p.category], ['Type', p.productType], ['Price', `ETB ${p.sellingPrice}`]])}>
                              <Download className="h-3.5 w-3.5 mr-2" />Export
                            </DropdownMenuItem>
                            <DropdownMenuItem><Printer className="h-3.5 w-3.5 mr-2" />Print Label</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('common.no_data')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-lg shadow-lg px-4 py-2 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <span className="text-xs font-medium">{selectedIds.size} selected</span>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => {
            const sel = products.filter(p => selectedIds.has(p.id));
            sel.forEach(p => handleToggleStatus(p));
            setSelectedIds(new Set());
          }}>Change Status</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleBulkExport}><Download className="h-3 w-3 mr-1" />Export</Button>
          <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={handleBulkDelete}><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setSelectedIds(new Set())}><X className="h-3.5 w-3.5" /></Button>
        </div>
      )}

      <AddProductDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={p => setProducts(prev => [...prev, p])} existingCount={products.length} />
      <EditProductDialog open={!!editProduct} onOpenChange={open => { if (!open) setEditProduct(null); }} product={editProduct} onSave={updated => setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))} />
      <ProductDetailsDialog open={!!viewProduct} onOpenChange={open => { if (!open) setViewProduct(null); }} product={viewProduct} onEdit={p => { setViewProduct(null); setEditProduct(p); }} onClone={p => { setViewProduct(null); handleClone(p); }} />
    </div>
  );
}