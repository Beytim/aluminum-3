import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, Download, ShoppingCart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { calculateOrderStats } from "@/data/enhancedOrderData";
import type { EnhancedOrder } from "@/data/enhancedOrderData";
import { useOrders, useOrderMutations } from "@/hooks/useOrders";
import { OrderStats } from "@/components/orders/OrderStats";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderBulkActions } from "@/components/orders/OrderBulkActions";
import { AddOrderDialog } from "@/components/orders/AddOrderDialog";
import { OrderDetailsDialog } from "@/components/orders/OrderDetailsDialog";

type ViewMode = 'grid' | 'table';

export default function Orders() {
  const { data: orders = [], isLoading } = useOrders();
  const { addOrder, updateOrder, deleteOrder } = useOrderMutations();
  const [view, setView] = useState<ViewMode>('table');
  const [addOpen, setAddOpen] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState<EnhancedOrder | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickFilter, setQuickFilter] = useState('all');
  const [filters, setFilters] = useState({ search: '', status: '', customer: '', project: '', paymentStatus: '' });
  const { toast } = useToast();

  const stats = useMemo(() => calculateOrderStats(orders), [orders]);

  const filtered = useMemo(() => {
    let result = [...orders];
    if (quickFilter === 'processing') result = result.filter(o => o.status === 'Processing');
    else if (quickFilter === 'shipped') result = result.filter(o => o.status === 'Shipped');
    else if (quickFilter === 'delivered') result = result.filter(o => o.status === 'Delivered');
    else if (quickFilter === 'overdue') result = result.filter(o => o.isOverdue);
    else if (quickFilter === 'unpaid') result = result.filter(o => o.paymentStatus === 'Unpaid');
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(o => o.orderNumber.toLowerCase().includes(s) || o.customerName.toLowerCase().includes(s) || (o.projectName || '').toLowerCase().includes(s));
    }
    if (filters.status) result = result.filter(o => o.status === filters.status);
    if (filters.customer) result = result.filter(o => o.customerName === filters.customer);
    if (filters.paymentStatus) result = result.filter(o => o.paymentStatus === filters.paymentStatus);
    return result;
  }, [orders, quickFilter, filters]);

  const customerNames = useMemo(() => [...new Set(orders.map(o => o.customerName))], [orders]);
  const projectNames = useMemo(() => [...new Set(orders.map(o => o.projectName).filter(Boolean) as string[])], [orders]);

  const handleDelete = (id: string) => {
    deleteOrder.mutate(id);
    toast({ title: "Order deleted" });
  };

  const handleExport = () => {
    const data = selectedIds.length > 0 ? orders.filter(o => selectedIds.includes(o.id)) : filtered;
    const csv = ['Order #,Customer,Project,Status,Payment,Total,Paid,Balance,Date',
      ...data.map(o => `${o.orderNumber},${o.customerName},${o.projectName || ''},${o.status},${o.paymentStatus},${o.total},${o.totalPaid},${o.balance},${o.orderDate}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'orders.csv'; a.click();
    toast({ title: "Exported" });
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Order Management</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{filtered.length} of {orders.length} orders</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-md">
            <Button variant={view === 'grid' ? 'default' : 'ghost'} size="icon" className="h-9 w-9 rounded-r-none" onClick={() => setView('grid')}><LayoutGrid className="h-4 w-4" /></Button>
            <Button variant={view === 'table' ? 'default' : 'ghost'} size="icon" className="h-9 w-9 rounded-l-none" onClick={() => setView('table')}><List className="h-4 w-4" /></Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Order</Button>
        </div>
      </div>

      <OrderStats stats={stats} />

      <OrderFilters
        quickFilter={quickFilter} onQuickFilterChange={setQuickFilter}
        filters={filters} onFiltersChange={setFilters}
        customerNames={customerNames} projectNames={projectNames}
      />

      <OrderBulkActions
        count={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onDelete={() => { selectedIds.forEach(id => deleteOrder.mutate(id)); setSelectedIds([]); toast({ title: `${selectedIds.length} orders deleted` }); }}
        onExport={handleExport}
      />

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(o => <OrderCard key={o.id} order={o} onView={setDetailsOrder} onDelete={handleDelete} />)}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-0">
            <OrderTable
              orders={filtered} selectedIds={selectedIds}
              onSelect={id => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
              onSelectAll={() => setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(o => o.id))}
              onView={setDetailsOrder} onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No orders found</p>
          <Button size="sm" className="mt-2" onClick={() => setAddOpen(true)}>Create Order</Button>
        </div>
      )}

      <AddOrderDialog open={addOpen} onOpenChange={setAddOpen} onSave={o => { addOrder.mutate(o); toast({ title: "Order Created", description: o.orderNumber }); }} existingCount={orders.length} />
      <OrderDetailsDialog
        order={detailsOrder} open={!!detailsOrder}
        onOpenChange={o => { if (!o) setDetailsOrder(null); }}
        onUpdate={updated => { updateOrder.mutate(updated); setDetailsOrder(updated); toast({ title: "Order updated" }); }}
      />
    </div>
  );
}
