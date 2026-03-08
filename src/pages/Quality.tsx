import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import {
  sampleEnhancedInspections, sampleNCRs, sampleComplaints,
  calculateQualityStats,
  type EnhancedInspection, type NCR, type CustomerComplaint,
} from "@/data/enhancedQualityData";
import QualityStats from "@/components/quality/QualityStats";
import QualityFilters from "@/components/quality/QualityFilters";
import QualityBulkActions from "@/components/quality/QualityBulkActions";
import InspectionTable from "@/components/quality/InspectionTable";
import NCRTable from "@/components/quality/NCRTable";
import ComplaintTable from "@/components/quality/ComplaintTable";
import DefectAnalysis from "@/components/quality/DefectAnalysis";
import AddInspectionDialog from "@/components/quality/AddInspectionDialog";
import InspectionDetailsDialog from "@/components/quality/InspectionDetailsDialog";
import AddNCRDialog from "@/components/quality/AddNCRDialog";
import NCRDetailsDialog from "@/components/quality/NCRDetailsDialog";

export default function Quality() {
  const { t } = useI18n();
  const { toast } = useToast();

  const [inspections, setInspections] = useLocalStorage<EnhancedInspection[]>(STORAGE_KEYS.INSPECTIONS, sampleEnhancedInspections);
  const [ncrs, setNCRs] = useLocalStorage<NCR[]>(STORAGE_KEYS.NCRS, sampleNCRs);
  const [complaints, setComplaints] = useLocalStorage<CustomerComplaint[]>(STORAGE_KEYS.CUSTOMER_COMPLAINTS, sampleComplaints);

  const [tab, setTab] = useState('inspections');
  const [search, setSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState('all');
  const [selectedInsp, setSelectedInsp] = useState<string[]>([]);
  const [selectedNCR, setSelectedNCR] = useState<string[]>([]);

  const [addInspOpen, setAddInspOpen] = useState(false);
  const [addNCROpen, setAddNCROpen] = useState(false);
  const [viewInsp, setViewInsp] = useState<EnhancedInspection | null>(null);
  const [viewNCR, setViewNCR] = useState<NCR | null>(null);

  const stats = useMemo(() => calculateQualityStats(inspections, ncrs, complaints), [inspections, ncrs, complaints]);

  // Filter inspections
  const filteredInsp = useMemo(() => {
    let list = inspections;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i => i.inspectionNumber.toLowerCase().includes(q) || i.productName?.toLowerCase().includes(q) || i.inspectorName.toLowerCase().includes(q));
    }
    if (quickFilter !== 'all') {
      if (['pass', 'fail', 'conditional', 'rework', 'scrap'].includes(quickFilter)) {
        list = list.filter(i => i.result === quickFilter);
      } else if (['incoming', 'in_process', 'final'].includes(quickFilter)) {
        list = list.filter(i => i.type === quickFilter);
      }
    }
    return list;
  }, [inspections, search, quickFilter]);

  // Filter NCRs
  const filteredNCR = useMemo(() => {
    let list = ncrs;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(n => n.ncrNumber.toLowerCase().includes(q) || n.title.toLowerCase().includes(q) || n.productName?.toLowerCase().includes(q));
    }
    if (quickFilter !== 'all') {
      list = list.filter(n => n.status === quickFilter);
    }
    return list;
  }, [ncrs, search, quickFilter]);

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    let list = complaints;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.complaintNumber.toLowerCase().includes(q) || c.customerName.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q));
    }
    if (quickFilter !== 'all') {
      list = list.filter(c => c.resolutionStatus === quickFilter);
    }
    return list;
  }, [complaints, search, quickFilter]);

  const handleTabChange = (t: string) => {
    setTab(t);
    setSearch('');
    setQuickFilter('all');
    setSelectedInsp([]);
    setSelectedNCR([]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.quality')}</h1>
          <p className="text-sm text-muted-foreground">
            {inspections.length} inspections · {stats.passRate}% pass rate · {stats.openNCRs} open NCRs
          </p>
        </div>
        <div className="flex gap-2">
          {tab === 'inspections' && <Button size="sm" onClick={() => setAddInspOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Inspection</Button>}
          {tab === 'ncrs' && <Button size="sm" onClick={() => setAddNCROpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New NCR</Button>}
        </div>
      </div>

      {/* Stats */}
      <QualityStats stats={stats} />

      {/* Tabs */}
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="inspections" className="text-xs">Inspections ({inspections.length})</TabsTrigger>
          <TabsTrigger value="ncrs" className="text-xs">NCRs ({ncrs.length})</TabsTrigger>
          <TabsTrigger value="complaints" className="text-xs">Complaints ({complaints.length})</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs">Reports</TabsTrigger>
        </TabsList>

        {/* Filters */}
        {tab !== 'reports' && (
          <div className="mt-3">
            <QualityFilters
              tab={tab as any}
              search={search}
              onSearchChange={setSearch}
              quickFilter={quickFilter}
              onQuickFilterChange={setQuickFilter}
            />
          </div>
        )}

        {/* Bulk actions */}
        {tab === 'inspections' && selectedInsp.length > 0 && (
          <div className="mt-2">
            <QualityBulkActions
              count={selectedInsp.length}
              onClear={() => setSelectedInsp([])}
              onDelete={() => {
                setInspections(prev => prev.filter(i => !selectedInsp.includes(i.id)));
                setSelectedInsp([]);
                toast({ title: `Deleted ${selectedInsp.length} inspections` });
              }}
              onExport={() => toast({ title: "Exported", description: `${selectedInsp.length} inspections` })}
            />
          </div>
        )}
        {tab === 'ncrs' && selectedNCR.length > 0 && (
          <div className="mt-2">
            <QualityBulkActions
              count={selectedNCR.length}
              onClear={() => setSelectedNCR([])}
              onDelete={() => {
                setNCRs(prev => prev.filter(n => !selectedNCR.includes(n.id)));
                setSelectedNCR([]);
                toast({ title: `Deleted ${selectedNCR.length} NCRs` });
              }}
              onExport={() => toast({ title: "Exported", description: `${selectedNCR.length} NCRs` })}
            />
          </div>
        )}

        <TabsContent value="inspections" className="mt-3">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <InspectionTable
                inspections={filteredInsp}
                selected={selectedInsp}
                onSelect={setSelectedInsp}
                onView={setViewInsp}
                onDelete={id => { setInspections(prev => prev.filter(i => i.id !== id)); toast({ title: "Deleted" }); }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ncrs" className="mt-3">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <NCRTable
                ncrs={filteredNCR}
                selected={selectedNCR}
                onSelect={setSelectedNCR}
                onView={setViewNCR}
                onDelete={id => { setNCRs(prev => prev.filter(n => n.id !== id)); toast({ title: "Deleted" }); }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="mt-3">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <ComplaintTable
                complaints={filteredComplaints}
                onDelete={id => { setComplaints(prev => prev.filter(c => c.id !== id)); toast({ title: "Deleted" }); }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-3">
          <DefectAnalysis stats={stats} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddInspectionDialog open={addInspOpen} onOpenChange={setAddInspOpen} existingCount={inspections.length}
        onAdd={insp => { setInspections(prev => [...prev, insp]); toast({ title: "Inspection Added", description: insp.inspectionNumber }); }} />
      <InspectionDetailsDialog inspection={viewInsp} open={!!viewInsp} onOpenChange={() => setViewInsp(null)} />
      <AddNCRDialog open={addNCROpen} onOpenChange={setAddNCROpen} existingCount={ncrs.length}
        onAdd={ncr => { setNCRs(prev => [...prev, ncr]); toast({ title: "NCR Created", description: ncr.ncrNumber }); }} />
      <NCRDetailsDialog ncr={viewNCR} open={!!viewNCR} onOpenChange={() => setViewNCR(null)} />
    </div>
  );
}
