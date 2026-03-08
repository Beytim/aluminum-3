import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Grid3X3, List, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateReportPDF } from "@/lib/pdfExport";
import {
  useSuppliers, useUpdateSupplier, useDeleteSupplier, useDeleteSuppliers,
  calculateSupplierStats, type Supplier,
} from "@/hooks/useSuppliers";
import SupplierStats from "@/components/suppliers/SupplierStats";
import SupplierFilters, { defaultSupplierFilters, type SupplierFilterState } from "@/components/suppliers/SupplierFilters";
import SupplierTable from "@/components/suppliers/SupplierTable";
import SupplierCard from "@/components/suppliers/SupplierCard";
import SupplierBulkActions from "@/components/suppliers/SupplierBulkActions";
import SupplierDetailsDialog from "@/components/suppliers/SupplierDetailsDialog";
import AddSupplierDialog from "@/components/suppliers/AddSupplierDialog";
import EditSupplierDialog from "@/components/suppliers/EditSupplierDialog";

export default function Suppliers() {
  const { data: suppliers = [], isLoading } = useSuppliers();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();
  const deleteSuppliers = useDeleteSuppliers();
  const { toast } = useToast();

  const [filters, setFilters] = useState<SupplierFilterState>(defaultSupplierFilters);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);

  const stats = useMemo(() => calculateSupplierStats(suppliers), [suppliers]);

  const countries = useMemo(() => [...new Set(suppliers.map(s => s.country))].sort(), [suppliers]);

  const filtered = useMemo(() => {
    return suppliers.filter(s => {
      const q = filters.search.toLowerCase();
      const matchSearch = !filters.search || s.company_name.toLowerCase().includes(q) || s.company_name_am.includes(filters.search) || s.contact_person.toLowerCase().includes(q) || s.supplier_code.toLowerCase().includes(q) || s.country.toLowerCase().includes(q);
      const matchStatus = filters.status === 'all' || s.status === filters.status;
      const matchCountry = filters.country === 'all' || s.country === filters.country;
      const matchType = filters.businessType === 'all' || s.business_type === filters.businessType;
      let matchRating = true;
      if (filters.ratingFilter === 'high') matchRating = s.rating >= 4;
      else if (filters.ratingFilter === 'medium') matchRating = s.rating >= 3 && s.rating < 4;
      else if (filters.ratingFilter === 'low') matchRating = s.rating < 3;
      return matchSearch && matchStatus && matchCountry && matchType && matchRating;
    });
  }, [suppliers, filters]);

  const allSelected = filtered.length > 0 && filtered.every(s => selectedIds.has(s.id));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(s => s.id)));
  };

  const handleDelete = (id: string) => {
    deleteSupplier.mutate(id);
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleBulkDelete = () => {
    deleteSuppliers.mutate([...selectedIds]);
    setSelectedIds(new Set());
  };

  const handleBulkToggleStatus = () => {
    const sel = suppliers.filter(s => selectedIds.has(s.id));
    sel.forEach(s => {
      const newStatus = s.status === 'Active' ? 'Inactive' : 'Active';
      updateSupplier.mutate({ id: s.id, status: newStatus as any });
    });
    setSelectedIds(new Set());
  };

  const handleExportPDF = () => {
    const data = selectedIds.size > 0 ? filtered.filter(s => selectedIds.has(s.id)) : filtered;
    generateReportPDF("Supplier List",
      ['Code', 'Company', 'Country', 'Contact', 'Type', 'Rating', 'Lead Time', 'Status'],
      data.map(s => [s.supplier_code, s.company_name, s.country, s.contact_person, s.business_type, s.rating.toFixed(1), `${s.average_lead_time}d`, s.status])
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Suppliers</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {suppliers.length} suppliers · {stats.active} active · {stats.preferred} preferred
            {stats.total > 0 && <span className="ml-2">· Avg {stats.avgRating.toFixed(1)}★</span>}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex border rounded-md">
            <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('table')}><List className="h-3.5 w-3.5" /></Button>
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}><Grid3X3 className="h-3.5 w-3.5" /></Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportPDF}><Download className="h-3.5 w-3.5 mr-1.5" />PDF</Button>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />Add Supplier</Button>
        </div>
      </div>

      {/* Stats */}
      <SupplierStats stats={stats} />

      {/* Filters */}
      <SupplierFilters filters={filters} onFiltersChange={setFilters} countries={countries} />

      {/* Results count */}
      <p className="text-xs text-muted-foreground">{filtered.length} of {suppliers.length} suppliers</p>

      {/* Table or Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(s => (
            <SupplierCard key={s.id} supplier={s} onClick={() => setViewSupplier(s)} />
          ))}
          {filtered.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No suppliers found</p>}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-0 overflow-x-auto">
            <SupplierTable
              suppliers={filtered}
              selectedIds={selectedIds}
              allSelected={allSelected}
              onToggleAll={toggleAll}
              onToggleSelect={toggleSelect}
              onView={setViewSupplier}
              onEdit={setEditSupplier}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      <SupplierBulkActions
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onToggleStatus={handleBulkToggleStatus}
        onExport={handleExportPDF}
        onDelete={handleBulkDelete}
      />

      {/* Dialogs */}
      <AddSupplierDialog open={addOpen} onOpenChange={setAddOpen} supplierCount={suppliers.length} />
      <EditSupplierDialog open={!!editSupplier} onOpenChange={open => { if (!open) setEditSupplier(null); }} supplier={editSupplier} />
      <SupplierDetailsDialog supplier={viewSupplier} open={!!viewSupplier} onOpenChange={open => { if (!open) setViewSupplier(null); }} onEdit={s => { setViewSupplier(null); setEditSupplier(s); }} />
    </div>
  );
}
