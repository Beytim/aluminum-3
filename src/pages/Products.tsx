import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Grid3X3, List, Download } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/lib/settingsContext";
import { generateReportPDF } from "@/lib/pdfExport";
import {
  enhancedSampleProducts, calculateProductStats, calcTotalCost, calcMargin,
  type EnhancedProduct,
} from "@/data/enhancedProductData";
import ProductStats from "@/components/products/ProductStats";
import ProductFilters from "@/components/products/ProductFilters";
import ProductTable from "@/components/products/ProductTable";
import ProductCard from "@/components/products/ProductCard";
import ProductBulkActions from "@/components/products/ProductBulkActions";
import ProductTypeDistribution from "@/components/products/ProductTypeDistribution";
import AddEnhancedProductDialog from "@/components/products/AddEnhancedProductDialog";
import EditEnhancedProductDialog from "@/components/products/EditEnhancedProductDialog";
import ProductDetailsDialog from "@/components/products/ProductDetailsDialog";

export default function Products() {
  const [products, setProducts] = useLocalStorage<EnhancedProduct[]>(STORAGE_KEYS.PRODUCTS, enhancedSampleProducts);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [marginFilter, setMarginFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<EnhancedProduct | null>(null);
  const [viewProduct, setViewProduct] = useState<EnhancedProduct | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { t, language } = useI18n();
  const { toast } = useToast();
  const { formatCurrency } = useSettings();

  const stats = useMemo(() => calculateProductStats(products), [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !search || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.nameAm.includes(search);
      const matchCat = catFilter === "all" || p.category === catFilter;
      const matchType = typeFilter === "all" || p.productType === typeFilter;
      let matchStock = true;
      if (stockFilter === "low") matchStock = p.currentStock <= p.minStock && p.currentStock > 0;
      else if (stockFilter === "critical") matchStock = p.currentStock <= p.minStock * 0.5;
      else if (stockFilter === "over") matchStock = p.currentStock > p.maxStock;
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
  const allSelected = filtered.length > 0 && filtered.every(p => selectedIds.has(p.id));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(p => p.id)));
  };

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

  const handleClone = (p: EnhancedProduct) => {
    const now = new Date().toISOString().split('T')[0];
    const id = `PRD-${String(products.length + 1).padStart(3, '0')}`;
    const cloned: EnhancedProduct = { ...p, id, code: `${p.code}-COPY`, name: `${p.name} (Copy)`, nameAm: `${p.nameAm} (ቅጂ)`, createdAt: now, updatedAt: now };
    setProducts(prev => [...prev, cloned]);
    toast({ title: "Cloned", description: `${cloned.name} created.` });
  };

  const handleToggleStatus = (p: EnhancedProduct) => {
    const newStatus = p.status === 'Active' ? 'Inactive' : 'Active';
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, status: newStatus as any, updatedAt: new Date().toISOString().split('T')[0] } : x));
    toast({ title: "Updated", description: `${p.name} ${newStatus === 'Active' ? 'activated' : 'deactivated'}.` });
  };

  const handleExportPDF = () => {
    generateReportPDF("Product Catalog",
      ['Code', 'Name', 'Category', 'Type', 'Cost', 'Price', 'Margin', 'Stock'],
      filtered.map(p => [p.code, p.name, p.category, p.productType, formatCurrency(calcTotalCost(p)), formatCurrency(p.sellingPrice), `${calcMargin(p).toFixed(1)}%`, String(p.currentStock)])
    );
  };

  const handleBulkExport = () => {
    const sel = products.filter(p => selectedIds.has(p.id));
    generateReportPDF("Selected Products", ['Code', 'Name', 'Type', 'Cost', 'Price', 'Margin'],
      sel.map(p => [p.code, p.name, p.productType, `ETB ${calcTotalCost(p).toLocaleString()}`, `ETB ${p.sellingPrice.toLocaleString()}`, `${calcMargin(p).toFixed(1)}%`])
    );
  };

  const handleBulkToggleStatus = () => {
    const sel = products.filter(p => selectedIds.has(p.id));
    sel.forEach(p => handleToggleStatus(p));
    setSelectedIds(new Set());
  };

  const handleExportOne = (p: EnhancedProduct) => {
    generateReportPDF(p.name, ['Field', 'Value'], [
      ['Code', p.code], ['Name', p.name], ['Category', p.category], ['Type', p.productType], ['Price', `ETB ${p.sellingPrice}`]
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('products.title')}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {products.length} {t('nav.products').toLowerCase()}
            {stats.lowStockCount > 0 && <span className="text-destructive ml-2">⚠ {stats.lowStockCount} low stock</span>}
          </p>
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

      {/* Stats */}
      <ProductStats stats={stats} />

      {/* Type Distribution */}
      <ProductTypeDistribution stats={stats} total={products.length} />

      {/* Filters */}
      <ProductFilters
        search={search} onSearchChange={setSearch}
        catFilter={catFilter} onCatFilterChange={setCatFilter}
        typeFilter={typeFilter} onTypeFilterChange={setTypeFilter}
        stockFilter={stockFilter} onStockFilterChange={setStockFilter}
        marginFilter={marginFilter} onMarginFilterChange={setMarginFilter}
        categories={categories}
      />

      {/* Results count */}
      <p className="text-xs text-muted-foreground">{filtered.length} of {products.length} products</p>

      {/* Table or Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} language={language} onClick={() => setViewProduct(p)} />
          ))}
        </div>
      ) : (
        <ProductTable
          products={filtered} selectedIds={selectedIds} allSelected={allSelected}
          onToggleAll={toggleAll} onToggleSelect={toggleSelect}
          onView={setViewProduct} onEdit={setEditProduct} onClone={handleClone}
          onDelete={handleDelete} onToggleStatus={handleToggleStatus}
          onExportOne={handleExportOne} language={language}
        />
      )}

      {/* Bulk Actions */}
      <ProductBulkActions
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onToggleStatus={handleBulkToggleStatus}
        onExport={handleBulkExport}
        onDelete={handleBulkDelete}
      />

      {/* Dialogs */}
      <AddEnhancedProductDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={p => setProducts(prev => [...prev, p])} existingCount={products.length} />
      <EditEnhancedProductDialog open={!!editProduct} onOpenChange={open => { if (!open) setEditProduct(null); }} product={editProduct} onSave={updated => setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))} />
      <ProductDetailsDialog open={!!viewProduct} onOpenChange={open => { if (!open) setViewProduct(null); }} product={viewProduct} onEdit={p => { setViewProduct(null); setEditProduct(p); }} onClone={p => { setViewProduct(null); handleClone(p); }} language={language} />
    </div>
  );
}
