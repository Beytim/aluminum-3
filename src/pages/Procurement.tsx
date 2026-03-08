import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Users, FileText, Package, AlertTriangle } from "lucide-react";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import {
  type EnhancedSupplier, type EnhancedPurchaseOrder, type ReorderSuggestion, type POStatus,
  sampleEnhancedSuppliers, sampleEnhancedPOs, sampleReorderSuggestions,
  calculateProcurementStats,
} from "@/data/enhancedProcurementData";

import ProcurementStatsComponent from "@/components/procurement/ProcurementStats";
import ProcurementFilters from "@/components/procurement/ProcurementFilters";
import ProcurementBulkActions from "@/components/procurement/ProcurementBulkActions";
import SupplierTable from "@/components/procurement/SupplierTable";
import PurchaseOrderTable from "@/components/procurement/PurchaseOrderTable";
import ReorderSuggestions from "@/components/procurement/ReorderSuggestions";
import AddSupplierDialog from "@/components/procurement/AddSupplierDialog";
import SupplierDetailsDialog from "@/components/procurement/SupplierDetailsDialog";
import AddPurchaseOrderDialog from "@/components/procurement/AddPurchaseOrderDialog";
import PODetailsDialog from "@/components/procurement/PODetailsDialog";

export default function Procurement() {
  const [suppliers, setSuppliers] = useLocalStorage<EnhancedSupplier[]>(STORAGE_KEYS.SUPPLIERS, sampleEnhancedSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useLocalStorage<EnhancedPurchaseOrder[]>(STORAGE_KEYS.PURCHASE_ORDERS, sampleEnhancedPOs);
  const [reorders] = useLocalStorage<ReorderSuggestion[]>('reorder_suggestions', sampleReorderSuggestions);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({ search: '', status: '', supplierStatus: '', quickFilter: 'all' });
  const [activeTab, setActiveTab] = useState('suppliers');

  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [addPOOpen, setAddPOOpen] = useState(false);
  const [detailsSupplier, setDetailsSupplier] = useState<EnhancedSupplier | null>(null);
  const [detailsPO, setDetailsPO] = useState<EnhancedPurchaseOrder | null>(null);
  const [preSelectedSupplier, setPreSelectedSupplier] = useState<string>('');

  const { toast } = useToast();
  const stats = useMemo(() => calculateProcurementStats(suppliers, purchaseOrders, reorders), [suppliers, purchaseOrders, reorders]);

  const filteredSuppliers = useMemo(() => {
    let result = [...suppliers];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(sup => sup.companyName.toLowerCase().includes(s) || sup.supplierCode.toLowerCase().includes(s) || sup.contactPerson.toLowerCase().includes(s));
    }
    if (filters.supplierStatus) result = result.filter(sup => sup.status === filters.supplierStatus);
    switch (filters.quickFilter) {
      case 'active': result = result.filter(s => s.status === 'Active'); break;
      case 'preferred': result = result.filter(s => s.preferred); break;
      case 'highRated': result = result.filter(s => s.rating >= 4); break;
    }
    return result;
  }, [suppliers, filters]);

  const filteredPOs = useMemo(() => {
    let result = [...purchaseOrders];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(po => po.poNumber.toLowerCase().includes(s) || po.supplierName.toLowerCase().includes(s) || (po.projectName || '').toLowerCase().includes(s));
    }
    if (filters.status) result = result.filter(po => po.status === filters.status);
    switch (filters.quickFilter) {
      case 'draft': result = result.filter(po => po.status === 'Draft'); break;
      case 'confirmed': result = result.filter(po => po.status === 'Confirmed'); break;
      case 'shipped': result = result.filter(po => po.status === 'Shipped'); break;
      case 'received': result = result.filter(po => po.status === 'Received'); break;
      case 'overdue': result = result.filter(po => po.isOverdue); break;
    }
    return result;
  }, [purchaseOrders, filters]);

  const advancePO = (id: string) => {
    const flow: POStatus[] = ['Draft', 'Sent', 'Confirmed', 'Shipped', 'Received'];
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id !== id) return po;
      const idx = flow.indexOf(po.status);
      if (idx >= 0 && idx < flow.length - 1) {
        const newStatus = flow[idx + 1];
        return { ...po, status: newStatus, activityLog: [...po.activityLog, { date: new Date().toISOString().split('T')[0], user: 'USR-001', userName: 'Admin', action: `Status → ${newStatus}` }] };
      }
      return po;
    }));
    toast({ title: "PO Status Updated" });
  };

  const handleCreatePOFromSupplier = (s: EnhancedSupplier) => {
    setPreSelectedSupplier(s.id);
    setAddPOOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Procurement</h1>
          <p className="text-sm text-muted-foreground">Supplier management, purchase orders & receiving</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setAddPOOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New PO</Button>
          <Button size="sm" onClick={() => setAddSupplierOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />Add Supplier</Button>
        </div>
      </div>

      <ProcurementStatsComponent stats={stats} />

      <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); setSelectedIds([]); setFilters({ search: '', status: '', supplierStatus: '', quickFilter: 'all' }); }}>
        <TabsList>
          <TabsTrigger value="suppliers" className="gap-1"><Users className="h-3.5 w-3.5" />Suppliers ({suppliers.length})</TabsTrigger>
          <TabsTrigger value="purchase-orders" className="gap-1"><FileText className="h-3.5 w-3.5" />Purchase Orders ({purchaseOrders.length})</TabsTrigger>
          <TabsTrigger value="reorder" className="gap-1"><AlertTriangle className="h-3.5 w-3.5" />Reorder ({reorders.filter(r => r.status === 'Pending').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-3">
          <ProcurementFilters filters={filters} onFiltersChange={setFilters} resultCount={filteredSuppliers.length} tab="suppliers" />
          <ProcurementBulkActions count={selectedIds.length} onExport={() => toast({ title: "Exported" })} onDelete={() => { setSuppliers(prev => prev.filter(s => !selectedIds.includes(s.id))); setSelectedIds([]); toast({ title: "Deleted" }); }} onClear={() => setSelectedIds([])} />
          <Card className="shadow-card">
            <CardContent className="p-0 overflow-x-auto">
              <SupplierTable
                suppliers={filteredSuppliers}
                selectedIds={selectedIds}
                onSelectToggle={id => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
                onSelectAll={() => setSelectedIds(prev => prev.length === filteredSuppliers.length ? [] : filteredSuppliers.map(s => s.id))}
                onView={setDetailsSupplier}
                onCreatePO={handleCreatePOFromSupplier}
                onDelete={id => { setSuppliers(prev => prev.filter(s => s.id !== id)); toast({ title: "Supplier Deleted" }); }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-3">
          <ProcurementFilters filters={filters} onFiltersChange={setFilters} resultCount={filteredPOs.length} tab="purchase-orders" />
          <ProcurementBulkActions count={selectedIds.length} onExport={() => toast({ title: "Exported" })} onDelete={() => { setPurchaseOrders(prev => prev.filter(p => !selectedIds.includes(p.id))); setSelectedIds([]); toast({ title: "Deleted" }); }} onClear={() => setSelectedIds([])} />
          <Card className="shadow-card">
            <CardContent className="p-0 overflow-x-auto">
              <PurchaseOrderTable
                purchaseOrders={filteredPOs}
                selectedIds={selectedIds}
                onSelectToggle={id => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
                onSelectAll={() => setSelectedIds(prev => prev.length === filteredPOs.length ? [] : filteredPOs.map(p => p.id))}
                onView={setDetailsPO}
                onAdvance={advancePO}
                onDelete={id => { setPurchaseOrders(prev => prev.filter(p => p.id !== id)); toast({ title: "PO Deleted" }); }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reorder">
          <ReorderSuggestions
            suggestions={reorders}
            onCreatePO={s => { setPreSelectedSupplier(s.preferredSupplierId || ''); setAddPOOpen(true); }}
            onDismiss={() => {}}
          />
        </TabsContent>
      </Tabs>

      <AddSupplierDialog open={addSupplierOpen} onOpenChange={setAddSupplierOpen} onAdd={sup => { setSuppliers(prev => [...prev, sup]); toast({ title: "Supplier Added", description: sup.companyName }); }} supplierCount={suppliers.length} />
      <SupplierDetailsDialog supplier={detailsSupplier} purchaseOrders={purchaseOrders} open={!!detailsSupplier} onOpenChange={() => setDetailsSupplier(null)} />
      <AddPurchaseOrderDialog open={addPOOpen} onOpenChange={o => { setAddPOOpen(o); if (!o) setPreSelectedSupplier(''); }} onAdd={po => { setPurchaseOrders(prev => [...prev, po]); toast({ title: "PO Created", description: po.poNumber }); }} suppliers={suppliers} poCount={purchaseOrders.length} preSelectedSupplierId={preSelectedSupplier} />
      <PODetailsDialog po={detailsPO} open={!!detailsPO} onOpenChange={() => setDetailsPO(null)} />
    </div>
  );
}
