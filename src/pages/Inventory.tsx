import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, Download, Boxes } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/lib/settingsContext";
import {
  enhancedSampleInventory, sampleStockMovements, sampleReservations,
  calculateInventoryStats, type EnhancedInventoryItem, type StockMovement, type StockReservation,
} from "@/data/enhancedInventoryData";
import InventoryStats from "@/components/inventory/InventoryStats";
import InventoryCard from "@/components/inventory/InventoryCard";
import InventoryTable from "@/components/inventory/InventoryTable";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventoryBulkActions from "@/components/inventory/InventoryBulkActions";
import AddInventoryDialog from "@/components/inventory/AddInventoryDialog";
import InventoryDetailsDialog from "@/components/inventory/InventoryDetailsDialog";
import StockMovementDialog from "@/components/inventory/StockMovementDialog";

import { useInventory } from "@/hooks/useInventory";

export default function Inventory() {
  const { inventory, isLoading, addItem, deleteItem, addMovement } = useInventory();
  // We still use local storage for movements and reservations if not fully migrated yet
  const [movements, setMovements] = useLocalStorage<StockMovement[]>('stock_movements', sampleStockMovements);
  const [reservations] = useLocalStorage<StockReservation[]>('stock_reservations', sampleReservations);

  const [view, setView] = useState<'grid' | 'table'>('table');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [showRemnants, setShowRemnants] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);
  const [showQuarantine, setShowQuarantine] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [addOpen, setAddOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<EnhancedInventoryItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [movementItem, setMovementItem] = useState<EnhancedInventoryItem | null>(null);
  const [movementType, setMovementType] = useState<'receive' | 'issue'>('receive');
  const [movementOpen, setMovementOpen] = useState(false);

  const { t, language } = useI18n();
  const { toast } = useToast();
  const { formatCurrency } = useSettings();

  const stats = useMemo(() => calculateInventoryStats(inventory, movements), [inventory, movements]);

  const lowStockCount = inventory.filter(i => i.stock <= i.minimum && i.stock > 0 && i.status === 'active').length + inventory.filter(i => i.stock === 0 && i.status === 'active').length;
  const quarantineCount = inventory.filter(i => i.qualityStatus === 'quarantine').length;
  const remnantCount = inventory.filter(i => i.isRemnant).length;

  const filtered = useMemo(() => {
    return inventory.filter(item => {
      if (search) {
        const s = search.toLowerCase();
        if (!item.itemCode.toLowerCase().includes(s) && !item.productName.toLowerCase().includes(s) && !item.productNameAm.toLowerCase().includes(s) && !item.productCode.toLowerCase().includes(s)) return false;
      }
      if (category !== 'all' && item.category !== category) return false;
      if (stockFilter === 'low' && !(item.stock <= item.minimum && item.stock > 0)) return false;
      if (stockFilter === 'out' && item.stock !== 0) return false;
      if (stockFilter === 'overstock' && item.stock <= item.maximum) return false;
      if (stockFilter === 'normal' && (item.stock <= item.minimum || item.stock > item.maximum)) return false;
      if (qualityFilter !== 'all' && item.qualityStatus !== qualityFilter) return false;
      if (showRemnants && !item.isRemnant) return false;
      if (showLowStock && !(item.stock <= item.minimum)) return false;
      if (showQuarantine && item.qualityStatus !== 'quarantine') return false;
      return true;
    });
  }, [inventory, search, category, stockFilter, qualityFilter, showRemnants, showLowStock, showQuarantine]);

  const handleAdd = (item: EnhancedInventoryItem) => {
    addItem(item);
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteItem(id));
    setSelectedIds([]);
  };

  const handleView = (item: EnhancedInventoryItem) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  const handleReceive = (item: EnhancedInventoryItem) => {
    setMovementItem(item);
    setMovementType('receive');
    setMovementOpen(true);
  };

  const handleIssue = (item: EnhancedInventoryItem) => {
    setMovementItem(item);
    setMovementType('issue');
    setMovementOpen(true);
  };

  const handleMovementConfirm = (movement: StockMovement, updatedItem: EnhancedInventoryItem) => {
    setMovements(prev => [...prev, movement]);
    // With DB, the trigger handles stock updates, so we just add the movement
    // But since the frontend expects movement to trigger a refetch or optimistic update, we can just call our hook
    addMovement(movement);
    toast({
      title: movement.type === 'receipt' ? 'Stock Received' : 'Stock Issued',
      description: `${Math.abs(movement.quantity)} ${movement.unit} of ${movement.itemName}`,
    });
  };

  const handleExportPDF = () => {
    const data = (selectedIds.length > 0 ? filtered.filter(i => selectedIds.includes(i.id)) : filtered);
    generateReportPDF(
      "Inventory Report",
      ['Code', 'Product', 'Category', 'Stock', 'Available', 'Unit Cost', 'Total Value'],
      data.map(i => [
        i.itemCode,
        language === 'am' ? i.productNameAm : i.productName,
        i.category,
        `${i.stock} ${i.primaryUnit}`,
        `${i.available} ${i.primaryUnit}`,
        formatCurrency(i.unitCost),
        formatCurrency(i.totalValue)
      ])
    );
    toast({ title: 'Exported', description: `${data.length} items exported to PDF` });
  };

  const handleExportOne = (item: EnhancedInventoryItem) => {
    generateReportPDF(
      `Inventory Item: ${item.itemCode}`,
      ['Property', 'Value'],
      [
        ['Code', item.itemCode],
        ['Name', language === 'am' ? item.productNameAm : item.productName],
        ['Category', item.category],
        ['Stock', `${item.stock} ${item.primaryUnit}`],
        ['Available', `${item.available} ${item.primaryUnit}`],
        ['Location', `${item.warehouse}-${item.zone}-${item.rack}`],
        ['Unit Cost', formatCurrency(item.unitCost)],
        ['Total Value', formatCurrency(item.totalValue)],
        ['Status', item.status],
        ['Quality', item.qualityStatus],
      ]
    );
    toast({ title: 'Exported', description: `${item.itemCode} details exported to PDF` });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('inventory.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {inventory.length} items · {stats.totalValue > 0 ? `Value: ${formatCurrency(stats.totalValue)}` : ''}
            {lowStockCount > 0 && <span className="text-destructive font-medium ml-2">· {lowStockCount} need attention</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border border-border rounded-md">
            <Button variant={view === 'grid' ? 'default' : 'ghost'} size="icon" className="h-8 w-8 rounded-r-none" onClick={() => setView('grid')}><LayoutGrid className="h-3.5 w-3.5" /></Button>
            <Button variant={view === 'table' ? 'default' : 'ghost'} size="icon" className="h-8 w-8 rounded-l-none" onClick={() => setView('table')}><List className="h-3.5 w-3.5" /></Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportPDF}><Download className="h-3.5 w-3.5 mr-1" />Export PDF</Button>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="h-3.5 w-3.5 mr-1" />Add Item</Button>
        </div>
      </div>

      {/* Stats */}
      <InventoryStats stats={stats} />

      {/* Filters */}
      <InventoryFilters
        search={search} onSearchChange={setSearch}
        category={category} onCategoryChange={setCategory}
        stockFilter={stockFilter} onStockFilterChange={setStockFilter}
        qualityFilter={qualityFilter} onQualityFilterChange={setQualityFilter}
        showRemnants={showRemnants} onToggleRemnants={() => setShowRemnants(!showRemnants)}
        showLowStock={showLowStock} onToggleLowStock={() => setShowLowStock(!showLowStock)}
        showQuarantine={showQuarantine} onToggleQuarantine={() => setShowQuarantine(!showQuarantine)}
        lowStockCount={lowStockCount} quarantineCount={quarantineCount} remnantCount={remnantCount}
      />

      {/* Bulk Actions */}
      <InventoryBulkActions count={selectedIds.length} onDelete={handleBulkDelete} onExport={handleExportPDF} onClear={() => setSelectedIds([])} />

      {/* Results */}
      <p className="text-xs text-muted-foreground">{filtered.length} of {inventory.length} items</p>

      {/* Grid / Table View */}
      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="text-center py-12 text-muted-foreground">
            <Boxes className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('common.no_data')}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setAddOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" />Add First Item
            </Button>
          </CardContent>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(item => (
            <InventoryCard key={item.id} item={item} language={language} onView={handleView} onEdit={handleView} onDelete={handleDelete} onReceive={handleReceive} onIssue={handleIssue} onExportOne={handleExportOne} />
          ))}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-0 overflow-x-auto">
            <InventoryTable
              items={filtered} language={language}
              selectedIds={selectedIds}
              onToggleSelect={id => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
              onToggleAll={() => setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(i => i.id))}
              onView={handleView} onEdit={handleView} onDelete={handleDelete}
              onReceive={handleReceive} onIssue={handleIssue} onExportOne={handleExportOne}
            />
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <AddInventoryDialog open={addOpen} onOpenChange={setAddOpen} onAdd={handleAdd} existingCount={inventory.length} />
      <InventoryDetailsDialog item={detailItem} open={detailOpen} onOpenChange={setDetailOpen} movements={movements} reservations={reservations} language={language} onEdit={handleView} />
      <StockMovementDialog open={movementOpen} onOpenChange={setMovementOpen} item={movementItem} type={movementType} onConfirm={handleMovementConfirm} movementCount={movements.length} />
    </div>
  );
}
