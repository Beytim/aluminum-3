import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, LayoutGrid, List } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { generateReportPDF } from "@/lib/pdfExport";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/lib/settingsContext";
import { enhancedCustomers } from "@/data/enhancedCustomerData";
import type { EnhancedCustomer } from "@/data/customerTypes";
import { sampleQuotes, sampleProducts } from "@/data/sampleData";
import type { Quote, Product, Invoice } from "@/data/sampleData";
import { enhancedSampleProjects } from "@/data/enhancedProjectData";
import type { EnhancedProject } from "@/data/enhancedProjectData";
import { sampleInvoices } from "@/data/sampleData";

import { CustomerStats } from "@/components/customers/CustomerStats";
import { CustomerFilters, defaultCustomerFilters, type CustomerFilterState } from "@/components/customers/CustomerFilters";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerCard } from "@/components/customers/CustomerCard";
import { CustomerDetailsDialog } from "@/components/customers/CustomerDetailsDialog";
import { AddEnhancedCustomerDialog } from "@/components/customers/AddEnhancedCustomerDialog";
import { EditEnhancedCustomerDialog } from "@/components/customers/EditEnhancedCustomerDialog";
import { BulkActionsBar } from "@/components/customers/BulkActionsBar";

export default function Customers() {
  const [customers, setCustomers] = useLocalStorage<EnhancedCustomer[]>('enhanced_customers', enhancedCustomers);
  const [filters, setFilters] = useState<CustomerFilterState>(defaultCustomerFilters);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<EnhancedCustomer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<EnhancedCustomer | null>(null);
  const { t, language } = useI18n();
  const { toast } = useToast();

  const cities = useMemo(() => {
    const set = new Set(customers.map(c => c.location?.subCity).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [customers]);

  const filtered = useMemo(() => {
    return customers.filter(c => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!(c.name.toLowerCase().includes(s) || c.nameAm.includes(s) || c.email.toLowerCase().includes(s) || c.phone.includes(s) || c.contact.toLowerCase().includes(s))) return false;
      }
      if (filters.type !== 'all' && c.type !== filters.type) return false;
      if (filters.status !== 'all' && c.status !== filters.status) return false;
      if (filters.healthStatus !== 'all' && c.healthStatus !== filters.healthStatus) return false;
      if (filters.tag !== 'all' && !c.tags.includes(filters.tag)) return false;
      if (filters.city !== 'all' && c.location?.subCity !== filters.city) return false;
      return true;
    });
  }, [customers, filters]);

  const handleDelete = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
    toast({ title: "Deleted", description: "Customer removed." });
  };

  const handleBulkDelete = () => {
    setCustomers(prev => prev.filter(c => !selectedIds.includes(c.id)));
    toast({ title: "Deleted", description: `${selectedIds.length} customers removed.` });
    setSelectedIds([]);
  };

  const handleExport = () => {
    const data = (selectedIds.length > 0 ? filtered.filter(c => selectedIds.includes(c.id)) : filtered);
    generateReportPDF("Customer List",
      ['Code', 'Name', 'Contact', 'Type', 'Phone', 'Projects', 'Total Value', 'Outstanding', 'Health'],
      data.map(c => [c.code, c.name, c.contact, c.type, c.phone, String(c.projects), `ETB ${c.totalValue.toLocaleString()}`, `ETB ${c.outstanding.toLocaleString()}`, `${c.healthScore} (${c.healthStatus})`])
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('nav.customers')}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{filtered.length} of {customers.length} customers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-3.5 w-3.5 mr-1.5" />PDF</Button>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />{t('common.add')}</Button>
        </div>
      </div>

      {/* Stats */}
      <CustomerStats customers={customers} />

      {/* Filters */}
      <CustomerFilters filters={filters} onChange={setFilters} cities={cities} />

      {/* Bulk Actions */}
      <BulkActionsBar count={selectedIds.length} onDelete={handleBulkDelete} onExport={handleExport} onClear={() => setSelectedIds([])} />

      {/* View Toggle + Results */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{filtered.length} results</p>
        <div className="flex gap-1 border rounded-md p-0.5">
          <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('table')}>
            <List className="h-3.5 w-3.5" />
          </Button>
          <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('grid')}>
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <Card className="shadow-card">
          <CardContent className="p-0 overflow-x-auto">
            <CustomerTable
              customers={filtered}
              language={language}
              selectedIds={selectedIds}
              onSelectIds={setSelectedIds}
              onView={c => setViewCustomer(c)}
              onEdit={c => setEditCustomer(c)}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(c => (
            <CustomerCard
              key={c.id}
              customer={c}
              language={language}
              onView={c => setViewCustomer(c)}
              onEdit={c => setEditCustomer(c)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground">{t('common.no_data')}</p>
            <Button size="sm" className="mt-2" onClick={() => setAddOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Customer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <AddEnhancedCustomerDialog open={addOpen} onOpenChange={setAddOpen} onAdd={c => setCustomers(prev => [...prev, c])} existingCustomers={customers} />
      <EditEnhancedCustomerDialog open={!!editCustomer} onOpenChange={open => { if (!open) setEditCustomer(null); }} customer={editCustomer} onSave={updated => setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c))} />
      <CustomerDetailsDialog open={!!viewCustomer} onOpenChange={open => { if (!open) setViewCustomer(null); }} customer={viewCustomer} onEdit={c => { setViewCustomer(null); setEditCustomer(c); }} language={language} projects={enhancedSampleProjects} quotes={sampleQuotes} invoices={sampleInvoices} />
    </div>
  );
}
