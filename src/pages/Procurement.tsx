import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, FileText, AlertTriangle } from "lucide-react";
import { useLocalStorage } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import {
  type EnhancedPurchaseOrder, type ReorderSuggestion, type POStatus,
  sampleReorderSuggestions, calculateProcurementStats, sampleEnhancedSuppliers,
} from "@/data/enhancedProcurementData";
import { usePurchaseOrders, usePurchaseOrderMutations } from "@/hooks/useProcurement";
import { useSuppliers } from "@/hooks/useSuppliers";

import ProcurementStatsComponent from "@/components/procurement/ProcurementStats";
import ProcurementFilters from "@/components/procurement/ProcurementFilters";
import ProcurementBulkActions from "@/components/procurement/ProcurementBulkActions";
import PurchaseOrderTable from "@/components/procurement/PurchaseOrderTable";
import ReorderSuggestions from "@/components/procurement/ReorderSuggestions";
import AddPurchaseOrderDialog from "@/components/procurement/AddPurchaseOrderDialog";
import PODetailsDialog from "@/components/procurement/PODetailsDialog";
import { Link } from "react-router-dom";

export default function Procurement() {
  const { data: dbSuppliers = [] } = useSuppliers();
  const { data: purchaseOrders = [], isLoading } = usePurchaseOrders();
  const { addPO, updatePO, deletePO } = usePurchaseOrderMutations();
  const [localSuppliers] = useLocalStorage('proc_suppliers_legacy', sampleEnhancedSuppliers);
  const [reorders] = useLocalStorage<ReorderSuggestion[]>('reorder_suggestions', sampleReorderSuggestions);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({ search: '', status: '', supplierStatus: '', quickFilter: 'all' });
  const [activeTab, setActiveTab] = useState('purchase-orders');
  const [addPOOpen, setAddPOOpen] = useState(false);
  const [detailsPO, setDetailsPO] = useState<EnhancedPurchaseOrder | null>(null);
  const [preSelectedSupplier, setPreSelectedSupplier] = useState<string>('');

  const { toast } = useToast();
  const stats = useMemo(() => calculateProcurementStats(localSuppliers, purchaseOrders, reorders), [localSuppliers, purchaseOrders, reorders]);

  const filteredPOs = useMemo(() => {
    let result = [...purchaseOrders];
    if (filters.search) { const s = filters.search.toLowerCase(); result = result.filter(po => po.poNumber.toLowerCase().includes(s) || po.supplierName.toLowerCase().includes(s) || (po.projectName || '').toLowerCase().includes(s)); }
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
    const po = purchaseOrders.find(p => p.id === id);
    if (po) {
      const idx = flow.indexOf(po.status);
      if (idx >= 0 && idx < flow.length - 1) {
        updatePO.mutate({ ...po, status: flow[idx + 1], activityLog: [...po.activityLog, { date: new Date().toISOString().split('T')[0], user: 'USR-001', userName: 'Admin', action: `Status → ${flow[idx + 1]}` }] });
      }
    }
    toast({ title: "PO Status Updated" });
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Procurement</h1>
          <p className="text-sm text-muted-foreground">Purchase orders & receiving — <Link to="/suppliers" className="text-primary hover:underline">manage suppliers →</Link></p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setAddPOOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New PO</Button>
        </div>
      </div>

      <ProcurementStatsComponent stats={stats} />

      <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); setSelectedIds([]); setFilters({ search: '', status: '', supplierStatus: '', quickFilter: 'all' }); }}>
        <TabsList>
          <TabsTrigger value="purchase-orders" className="gap-1"><FileText className="h-3.5 w-3.5" />Purchase Orders ({purchaseOrders.length})</TabsTrigger>
          <TabsTrigger value="reorder" className="gap-1"><AlertTriangle className="h-3.5 w-3.5" />Reorder ({reorders.filter(r => r.status === 'Pending').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="purchase-orders" className="space-y-3">
          <ProcurementFilters filters={filters} onFiltersChange={setFilters} resultCount={filteredPOs.length} tab="purchase-orders" />
          <ProcurementBulkActions count={selectedIds.length} onExport={() => toast({ title: "Exported" })} onDelete={() => { selectedIds.forEach(id => deletePO.mutate(id)); setSelectedIds([]); toast({ title: "Deleted" }); }} onClear={() => setSelectedIds([])} />
          <Card className="shadow-card"><CardContent className="p-0 overflow-x-auto">
            <PurchaseOrderTable purchaseOrders={filteredPOs} selectedIds={selectedIds}
              onSelectToggle={id => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
              onSelectAll={() => setSelectedIds(prev => prev.length === filteredPOs.length ? [] : filteredPOs.map(p => p.id))}
              onView={setDetailsPO} onAdvance={advancePO}
              onDelete={id => { deletePO.mutate(id); toast({ title: "PO Deleted" }); }}
            />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="reorder">
          <ReorderSuggestions suggestions={reorders} onCreatePO={s => { setPreSelectedSupplier(s.preferredSupplierId || ''); setAddPOOpen(true); }} onDismiss={() => {}} />
        </TabsContent>
      </Tabs>

      <AddPurchaseOrderDialog open={addPOOpen} onOpenChange={o => { setAddPOOpen(o); if (!o) setPreSelectedSupplier(''); }} onAdd={po => { addPO.mutate(po); toast({ title: "PO Created", description: po.poNumber }); }} suppliers={localSuppliers} poCount={purchaseOrders.length} preSelectedSupplierId={preSelectedSupplier} />
      <PODetailsDialog po={detailsPO} open={!!detailsPO} onOpenChange={() => setDetailsPO(null)} />
    </div>
  );
}
