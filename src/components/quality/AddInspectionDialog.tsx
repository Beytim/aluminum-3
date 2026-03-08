import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { EnhancedInspection, InspectionType, InspectionResult, DefectSeverity } from "@/data/enhancedQualityData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (inspection: EnhancedInspection) => void;
  existingCount: number;
}

const defaultChecklist = [
  { id: 'CL-01', description: 'Dimensional accuracy' },
  { id: 'CL-02', description: 'Surface finish quality' },
  { id: 'CL-03', description: 'Functional operation' },
  { id: 'CL-04', description: 'Safety compliance' },
  { id: 'CL-05', description: 'Visual appearance' },
];

export default function AddInspectionDialog({ open, onOpenChange, onAdd, existingCount }: Props) {
  const [tab, setTab] = useState('source');
  const [form, setForm] = useState({
    type: '' as InspectionType | '',
    productName: '',
    productCode: '',
    workOrderNumber: '',
    purchaseOrderNumber: '',
    projectName: '',
    supplierName: '',
    inspectorName: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    result: '' as InspectionResult | '',
    score: '',
    notes: '',
  });
  const [checkResults, setCheckResults] = useState(defaultChecklist.map(c => ({ ...c, passed: true, notes: '' })));
  const [defects, setDefects] = useState<{ description: string; severity: DefectSeverity; category: string; disposition: string }[]>([]);

  const reset = () => {
    setForm({ type: '', productName: '', productCode: '', workOrderNumber: '', purchaseOrderNumber: '', projectName: '', supplierName: '', inspectorName: '', scheduledDate: new Date().toISOString().split('T')[0], result: '', score: '', notes: '' });
    setCheckResults(defaultChecklist.map(c => ({ ...c, passed: true, notes: '' })));
    setDefects([]);
    setTab('source');
  };

  const handleSubmit = () => {
    if (!form.type || !form.productName || !form.result) return;
    const num = existingCount + 1;
    const insp: EnhancedInspection = {
      id: `INSP-${String(num).padStart(3, '0')}`,
      inspectionNumber: `INSP-2025-${String(num).padStart(3, '0')}`,
      type: form.type as InspectionType,
      productName: form.productName,
      productCode: form.productCode || undefined,
      workOrderNumber: form.workOrderNumber || undefined,
      purchaseOrderNumber: form.purchaseOrderNumber || undefined,
      projectName: form.projectName || undefined,
      supplierName: form.supplierName || undefined,
      inspectorId: 'EMP-003',
      inspectorName: form.inspectorName || 'Inspector',
      scheduledDate: form.scheduledDate,
      inspectionDate: form.scheduledDate,
      completedDate: form.scheduledDate,
      result: form.result as InspectionResult,
      score: form.score ? Number(form.score) : undefined,
      checklistResults: checkResults.map(cr => ({ itemId: cr.id, description: cr.description, passed: cr.passed, notes: cr.notes || undefined })),
      defects: defects.map((d, idx) => ({
        id: `DEF-NEW-${idx}`,
        defectNumber: `DEF-2025-${String(existingCount + idx + 100).padStart(3, '0')}`,
        inspectionId: `INSP-${String(num).padStart(3, '0')}`,
        inspectionNumber: `INSP-2025-${String(num).padStart(3, '0')}`,
        productName: form.productName,
        category: d.category as any,
        description: d.description,
        severity: d.severity,
        disposition: d.disposition as any,
        reworkRequired: d.disposition === 'rework',
        resolved: false,
        createdAt: form.scheduledDate,
        createdBy: 'EMP-003',
      })),
      defectCount: defects.length,
      status: 'completed',
      notes: form.notes || undefined,
      createdBy: 'EMP-003', createdByName: form.inspectorName || 'Inspector', createdAt: form.scheduledDate,
      updatedBy: 'EMP-003', updatedByName: form.inspectorName || 'Inspector', updatedAt: form.scheduledDate,
    };
    onAdd(insp);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Inspection</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="source" className="text-xs">Source</TabsTrigger>
            <TabsTrigger value="checklist" className="text-xs">Checklist</TabsTrigger>
            <TabsTrigger value="defects" className="text-xs">Defects</TabsTrigger>
            <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="source" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Type *</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as InspectionType }))}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {['incoming', 'in_process', 'final', 'installation', 'maintenance', 'audit'].map(t => (
                      <SelectItem key={t} value={t} className="capitalize">{t.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Product / Item *</Label><Input value={form.productName} onChange={e => setForm(p => ({ ...p, productName: e.target.value }))} /></div>
              <div><Label className="text-xs">Product Code</Label><Input value={form.productCode} onChange={e => setForm(p => ({ ...p, productCode: e.target.value }))} /></div>
              <div><Label className="text-xs">Work Order #</Label><Input value={form.workOrderNumber} onChange={e => setForm(p => ({ ...p, workOrderNumber: e.target.value }))} /></div>
              <div><Label className="text-xs">PO #</Label><Input value={form.purchaseOrderNumber} onChange={e => setForm(p => ({ ...p, purchaseOrderNumber: e.target.value }))} /></div>
              <div><Label className="text-xs">Project</Label><Input value={form.projectName} onChange={e => setForm(p => ({ ...p, projectName: e.target.value }))} /></div>
              <div><Label className="text-xs">Supplier</Label><Input value={form.supplierName} onChange={e => setForm(p => ({ ...p, supplierName: e.target.value }))} /></div>
              <div><Label className="text-xs">Inspector *</Label><Input value={form.inspectorName} onChange={e => setForm(p => ({ ...p, inspectorName: e.target.value }))} /></div>
              <div><Label className="text-xs">Date</Label><Input type="date" value={form.scheduledDate} onChange={e => setForm(p => ({ ...p, scheduledDate: e.target.value }))} /></div>
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-2 mt-3">
            {checkResults.map((cr, idx) => (
              <div key={cr.id} className="flex items-center gap-3 p-2 border rounded-lg">
                <Checkbox checked={cr.passed} onCheckedChange={c => {
                  const updated = [...checkResults];
                  updated[idx] = { ...updated[idx], passed: !!c };
                  setCheckResults(updated);
                }} />
                <span className="text-xs flex-1">{cr.description}</span>
                <Input placeholder="Notes" className="w-40 h-7 text-xs" value={cr.notes} onChange={e => {
                  const updated = [...checkResults];
                  updated[idx] = { ...updated[idx], notes: e.target.value };
                  setCheckResults(updated);
                }} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="defects" className="space-y-3 mt-3">
            {defects.map((d, idx) => (
              <div key={idx} className="p-3 border rounded-lg space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="Description" className="text-xs col-span-3" value={d.description} onChange={e => { const u = [...defects]; u[idx] = { ...u[idx], description: e.target.value }; setDefects(u); }} />
                  <Select value={d.severity} onValueChange={v => { const u = [...defects]; u[idx] = { ...u[idx], severity: v as DefectSeverity }; setDefects(u); }}>
                    <SelectTrigger className="text-xs"><SelectValue placeholder="Severity" /></SelectTrigger>
                    <SelectContent>{['critical', 'major', 'minor', 'observation'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={d.category} onValueChange={v => { const u = [...defects]; u[idx] = { ...u[idx], category: v }; setDefects(u); }}>
                    <SelectTrigger className="text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>{['dimensional', 'visual', 'functional', 'material', 'finish', 'assembly', 'other'].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={d.disposition} onValueChange={v => { const u = [...defects]; u[idx] = { ...u[idx], disposition: v }; setDefects(u); }}>
                    <SelectTrigger className="text-xs"><SelectValue placeholder="Disposition" /></SelectTrigger>
                    <SelectContent>{['use_as_is', 'rework', 'scrap', 'return_to_supplier'].map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Button variant="destructive" size="sm" className="h-6 text-[10px]" onClick={() => setDefects(defects.filter((_, i) => i !== idx))}>Remove</Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setDefects([...defects, { description: '', severity: 'minor', category: 'visual', disposition: 'rework' }])}>+ Add Defect</Button>
          </TabsContent>

          <TabsContent value="summary" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Overall Result *</Label>
                <Select value={form.result} onValueChange={v => setForm(p => ({ ...p, result: v as InspectionResult }))}>
                  <SelectTrigger><SelectValue placeholder="Select result" /></SelectTrigger>
                  <SelectContent>{['pass', 'fail', 'conditional', 'rework', 'scrap'].map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Score (%)</Label><Input type="number" value={form.score} onChange={e => setForm(p => ({ ...p, score: e.target.value }))} /></div>
            </div>
            <div><Label className="text-xs">Notes</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} /></div>
            <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
              <p><strong>Type:</strong> {form.type || '—'} | <strong>Product:</strong> {form.productName || '—'}</p>
              <p><strong>Checklist:</strong> {checkResults.filter(c => c.passed).length}/{checkResults.length} passed</p>
              <p><strong>Defects:</strong> {defects.length}</p>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.type || !form.productName || !form.result}>Create Inspection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
