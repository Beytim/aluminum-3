import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Grid3X3, List, Download, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/lib/settingsContext";
import { generateReportPDF } from "@/lib/pdfExport";
import {
  useProducts, useUpdateProduct, useDeleteProduct, useDeleteProducts, useAddProduct,
  calculateProductStats, calcTotalCost, calcMargin,
  type Product,
} from "@/hooks/useProducts";
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
  const { data: products = [], isLoading } = useProducts();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const deleteProducts = useDeleteProducts();
  const addProduct = useAddProduct();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("finished");
  const [stockFilter, setStockFilter] = useState("all");
  const [marginFilter, setMarginFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { t, language } = useI18n();
  const { toast } = useToast();
  const { formatCurrency } = useSettings();

  const filtered = useMemo(() => {
    return products.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !search || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.name_am.includes(search);
      const matchCat = catFilter === "all" || p.category === catFilter;
      const matchType = typeFilter === "all" || p.product_type === typeFilter || (typeFilter === "finished" && p.product_type !== "Raw Material");
      let matchStock = true;
      if (stockFilter === "low") matchStock = p.current_stock <= p.min_stock && p.current_stock > 0;
      else if (stockFilter === "critical") matchStock = p.current_stock <= p.min_stock * 0.5;
      else if (stockFilter === "over") matchStock = p.current_stock > p.max_stock;
      let matchMargin = true;
      const mg = calcMargin(p);
      if (marginFilter === "high") matchMargin = mg > 40;
      else if (marginFilter === "medium") matchMargin = mg >= 25 && mg <= 40;
      else if (marginFilter === "low") matchMargin = mg >= 0 && mg < 25;
      else if (marginFilter === "negative") matchMargin = mg < 0;
      return matchSearch && matchCat && matchType && matchStock && matchMargin;
    });
  }, [search, catFilter, typeFilter, stockFilter, marginFilter, products]);

  const stats = useMemo(() => calculateProductStats(filtered), [filtered]);

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
    deleteProduct.mutate(id);
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleBulkDelete = () => {
    deleteProducts.mutate([...selectedIds]);
    setSelectedIds(new Set());
  };

  const handleClone = async (p: Product) => {
    const { id, created_at, updated_at, ...rest } = p;
    const code = `${p.code}-COPY`;
    await addProduct.mutateAsync({
      ...rest,
      code,
      name: `${p.name} (Copy)`,
      name_am: `${p.name_am} (ቅጂ)`,
      created_by: null,
      updated_by: null,
    } as any);
  };

  const handleToggleStatus = (p: Product) => {
    const newStatus = p.status === 'Active' ? 'Inactive' : 'Active';
    updateProduct.mutate({ id: p.id, status: newStatus as any });
  };

  const handleExportPDF = () => {
    generateReportPDF("Product Catalog",
      ['Code', 'Name', 'Category', 'Type', 'Cost', 'Price', 'Margin', 'Stock'],
      filtered.map(p => [p.code, p.name, p.category, p.product_type, formatCurrency(calcTotalCost(p)), formatCurrency(p.selling_price), `${calcMargin(p).toFixed(1)}%`, String(p.current_stock)])
    );
  };

  const handleBulkExport = () => {
    const sel = products.filter(p => selectedIds.has(p.id));
    generateReportPDF("Selected Products", ['Code', 'Name', 'Type', 'Cost', 'Price', 'Margin'],
      sel.map(p => [p.code, p.name, p.product_type, formatCurrency(calcTotalCost(p)), formatCurrency(p.selling_price), `${calcMargin(p).toFixed(1)}%`])
    );
  };

  const handleBulkToggleStatus = () => {
    const sel = products.filter(p => selectedIds.has(p.id));
    sel.forEach(p => handleToggleStatus(p));
    setSelectedIds(new Set());
  };

  const handleExportOne = (p: Product) => {
    generateReportPDF(p.name, ['Field', 'Value'], [
      ['Code', p.code], ['Name', p.name], ['Category', p.category], ['Type', p.product_type], ['Price', formatCurrency(p.selling_price)]
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
      <AddEnhancedProductDialog open={dialogOpen} onOpenChange={setDialogOpen} existingCount={products.length} />
      <EditEnhancedProductDialog open={!!editProduct} onOpenChange={open => { if (!open) setEditProduct(null); }} product={editProduct} />
      <ProductDetailsDialog open={!!viewProduct} onOpenChange={open => { if (!open) setViewProduct(null); }} product={viewProduct} onEdit={p => { setViewProduct(null); setEditProduct(p); }} onClone={p => { setViewProduct(null); handleClone(p); }} language={language} />
    </div>
  );
}
