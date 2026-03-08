import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Download, Grid3X3, List } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/lib/settingsContext";
import { generateReportPDF } from "@/lib/pdfExport";
import { sampleCustomers, sampleProducts } from "@/data/sampleData";
import type { Customer, Product } from "@/data/sampleData";
import type { EnhancedQuote } from "@/data/enhancedQuoteData";
import { enhancedSampleQuotes, calculateQuoteStats, formatETBCompact, getQuoteStatusColor } from "@/data/enhancedQuoteData";

import { QuoteStats } from "@/components/quotes/QuoteStats";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { QuoteTable } from "@/components/quotes/QuoteTable";
import { QuoteFilters } from "@/components/quotes/QuoteFilters";
import { QuoteBulkActions } from "@/components/quotes/QuoteBulkActions";
import { QuoteDetailsDialog } from "@/components/quotes/QuoteDetailsDialog";
import { AddEnhancedQuoteDialog } from "@/components/quotes/AddEnhancedQuoteDialog";
import { EditEnhancedQuoteDialog } from "@/components/quotes/EditEnhancedQuoteDialog";

export default function Quotes() {
  const [quotes, setQuotes] = useLocalStorage<EnhancedQuote[]>(STORAGE_KEYS.QUOTES, enhancedSampleQuotes as any);
  const [customers] = useLocalStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, sampleCustomers);
  const [products] = useLocalStorage<Product[]>(STORAGE_KEYS.PRODUCTS, sampleProducts);

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editQuote, setEditQuote] = useState<EnhancedQuote | null>(null);
  const [viewQuote, setViewQuote] = useState<EnhancedQuote | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');

  const { t } = useI18n();
  const { toast } = useToast();

  const customerNames = useMemo(() => [...new Set(quotes.map(q => q.customerName))], [quotes]);

  const filtered = useMemo(() => {
    return quotes.filter(q => {
      const matchSearch = !search || q.quoteNumber.toLowerCase().includes(search.toLowerCase()) || q.title.toLowerCase().includes(search.toLowerCase()) || q.customerName.toLowerCase().includes(search.toLowerCase()) || q.projectName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || q.status === statusFilter;
      const matchCustomer = customerFilter === 'all' || q.customerName === customerFilter;
      return matchSearch && matchStatus && matchCustomer;
    });
  }, [search, statusFilter, customerFilter, quotes]);

  const stats = useMemo(() => calculateQuoteStats(quotes), [quotes]);
  const activeFilterCount = [statusFilter, customerFilter].filter(f => f !== 'all').length + (search ? 1 : 0);
  const clearFilters = () => { setSearch(''); setStatusFilter('all'); setCustomerFilter('all'); };

  const handleDelete = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    toast({ title: "Deleted", description: "Quote removed." });
  };

  const handleClone = (q: EnhancedQuote) => {
    const now = new Date().toISOString().split('T')[0];
    const cloned: EnhancedQuote = {
      ...q,
      id: `QT-${String(quotes.length + 1).padStart(3, '0')}`,
      quoteNumber: `QT-${String(quotes.length + 1).padStart(3, '0')}`,
      status: 'Draft',
      version: 'v1',
      quoteDate: now,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: now,
      updatedAt: now,
      isConverted: false,
      isExpired: false,
      projectId: undefined,
      convertedDate: undefined,
      versionHistory: [{ version: 'v1', createdAt: now, createdBy: 'EMP-001', createdByName: 'Admin', changes: `Cloned from ${q.quoteNumber}`, total: q.total, status: 'Draft' }],
      activityLog: [{ date: now, user: 'EMP-001', userName: 'Admin', action: 'created', notes: `Cloned from ${q.quoteNumber}` }],
    };
    setQuotes(prev => [...prev, cloned]);
    toast({ title: "Cloned", description: `${q.quoteNumber} cloned as ${cloned.quoteNumber}.` });
  };

  const handleBulkDelete = () => {
    setQuotes(prev => prev.filter(q => !selectedIds.has(q.id)));
    toast({ title: "Deleted", description: `${selectedIds.size} quotes removed.` });
    setSelectedIds(new Set());
  };

  const handleExportPDF = () => {
    const data = selectedIds.size > 0 ? quotes.filter(q => selectedIds.has(q.id)) : filtered;
    generateReportPDF("Quote Report",
      ['#', 'Title', 'Customer', 'Project', 'Items', 'Total', 'Margin', 'Status', 'Expiry'],
      data.map(q => [q.quoteNumber, q.title, q.customerName, q.projectName, String(q.items.reduce((s, i) => s + i.quantity, 0)), formatETBCompact(q.total), `${q.profitMargin}%`, q.status, q.expiryDate])
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const allSelected = filtered.length > 0 && filtered.every(q => selectedIds.has(q.id));
  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(q => q.id)));
  };

  // Status distribution
  const statusBar = Object.entries(stats.byStatus).map(([status, count]) => ({ status, count }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('nav.quotes')}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{quotes.length} quotes · {stats.pendingQuotes} pending · {formatETBCompact(stats.totalValue)} total value</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex border rounded-md">
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}><Grid3X3 className="h-3.5 w-3.5" /></Button>
            <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('table')}><List className="h-3.5 w-3.5" /></Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportPDF}><Download className="h-3.5 w-3.5 mr-1.5" />PDF</Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Quote</Button>
        </div>
      </div>

      {/* Stats */}
      <QuoteStats stats={stats} />

      {/* Status Distribution */}
      <Card className="shadow-card">
        <CardContent className="p-3">
          <p className="text-xs font-semibold text-foreground mb-2">Status Distribution</p>
          <div className="flex h-3 rounded-full overflow-hidden bg-muted">
            {statusBar.map(sb => sb.count > 0 && (
              <div key={sb.status} className="bg-primary transition-all" style={{ width: `${(sb.count / quotes.length) * 100}%`, opacity: 0.3 + (sb.count / quotes.length) * 0.7 }} title={`${sb.status}: ${sb.count}`} />
            ))}
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            {statusBar.map(sb => (
              <div key={sb.status} className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary" style={{ opacity: 0.3 + (sb.count / quotes.length) * 0.7 }} />
                <span className="text-[10px] text-muted-foreground">{sb.status} <span className="font-semibold text-foreground">{sb.count}</span></span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <QuoteFilters
        search={search} onSearchChange={setSearch}
        statusFilter={statusFilter} onStatusChange={setStatusFilter}
        customerFilter={customerFilter} onCustomerChange={setCustomerFilter}
        customers={customerNames} activeFilterCount={activeFilterCount} onClearAll={clearFilters}
      />

      {/* Bulk Actions */}
      <QuoteBulkActions count={selectedIds.size} onClear={() => setSelectedIds(new Set())} onDelete={handleBulkDelete} onExport={handleExportPDF} />

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(q => (
            <QuoteCard key={q.id} quote={q} onView={setViewQuote} onEdit={setEditQuote} onDelete={handleDelete} onClone={handleClone} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-8 text-sm text-muted-foreground">No quotes match your filters</div>
          )}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-0">
            <QuoteTable
              quotes={filtered}
              selectedIds={selectedIds} onToggleSelect={toggleSelect} onToggleAll={toggleAll} allSelected={allSelected}
              onView={setViewQuote} onEdit={setEditQuote} onDelete={handleDelete} onClone={handleClone}
            />
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <AddEnhancedQuoteDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={q => setQuotes(prev => [...prev, q])} customers={customers} products={products} existingCount={quotes.length} />
      <EditEnhancedQuoteDialog open={!!editQuote} onOpenChange={open => { if (!open) setEditQuote(null); }} quote={editQuote} customers={customers} products={products} onSave={updated => setQuotes(prev => prev.map(q => q.id === updated.id ? updated : q))} />
      <QuoteDetailsDialog open={!!viewQuote} onOpenChange={open => { if (!open) setViewQuote(null); }} quote={viewQuote} onEdit={q => { setViewQuote(null); setEditQuote(q); }} />
    </div>
  );
}
