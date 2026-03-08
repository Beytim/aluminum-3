import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { NCR, DefectSeverity } from "@/data/enhancedQualityData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (ncr: NCR) => void;
  existingCount: number;
}

export default function AddNCRDialog({ open, onOpenChange, onAdd, existingCount }: Props) {
  const [form, setForm] = useState({
    title: '', description: '', productName: '', severity: '' as DefectSeverity | '',
    category: '', quantityAffected: '', quantityUnit: 'pcs',
    immediateAction: '', inspectionNumber: '', supplierName: '', customerName: '',
    reportedByName: '', notes: '',
  });

  const reset = () => setForm({ title: '', description: '', productName: '', severity: '', category: '', quantityAffected: '', quantityUnit: 'pcs', immediateAction: '', inspectionNumber: '', supplierName: '', customerName: '', reportedByName: '', notes: '' });

  const handleSubmit = () => {
    if (!form.title || !form.severity || !form.category || !form.immediateAction) return;
    const num = existingCount + 1;
    const ncr: NCR = {
      id: `NCR-${String(num).padStart(3, '0')}`,
      ncrNumber: `NCR-2025-${String(num).padStart(3, '0')}`,
      inspectionNumber: form.inspectionNumber || undefined,
      productName: form.productName || undefined,
      supplierName: form.supplierName || undefined,
      customerName: form.customerName || undefined,
      title: form.title,
      description: form.description,
      reportedDate: new Date().toISOString().split('T')[0],
      reportedBy: 'EMP-001',
      reportedByName: form.reportedByName || 'Admin',
      severity: form.severity as DefectSeverity,
      category: form.category as NCR['category'],
      quantityAffected: Number(form.quantityAffected) || 1,
      quantityUnit: form.quantityUnit,
      immediateAction: form.immediateAction as NCR['immediateAction'],
      investigationRequired: true,
      investigationStatus: 'not_started',
      capaRequired: form.severity === 'critical' || form.severity === 'major',
      verificationRequired: true,
      verificationStatus: 'pending',
      costImpact: 0,
      timeImpact: 0,
      status: 'open',
      notes: form.notes || undefined,
      activityLog: [{ date: new Date().toISOString().split('T')[0], user: 'EMP-001', userName: form.reportedByName || 'Admin', action: 'NCR Created' }],
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'EMP-001', createdByName: form.reportedByName || 'Admin',
      updatedAt: new Date().toISOString().split('T')[0],
      updatedBy: 'EMP-001', updatedByName: form.reportedByName || 'Admin',
    };
    onAdd(ncr);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New NCR</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><Label className="text-xs">Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
          <div className="sm:col-span-2"><Label className="text-xs">Description *</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
          <div><Label className="text-xs">Product</Label><Input value={form.productName} onChange={e => setForm(p => ({ ...p, productName: e.target.value }))} /></div>
          <div><Label className="text-xs">Inspection #</Label><Input value={form.inspectionNumber} onChange={e => setForm(p => ({ ...p, inspectionNumber: e.target.value }))} /></div>
          <div>
            <Label className="text-xs">Severity *</Label>
            <Select value={form.severity} onValueChange={v => setForm(p => ({ ...p, severity: v as DefectSeverity }))}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{['critical', 'major', 'minor', 'observation'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Category *</Label>
            <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{['product', 'process', 'material', 'documentation', 'service', 'other'].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs">Qty Affected</Label><Input type="number" value={form.quantityAffected} onChange={e => setForm(p => ({ ...p, quantityAffected: e.target.value }))} /></div>
          <div>
            <Label className="text-xs">Immediate Action *</Label>
            <Select value={form.immediateAction} onValueChange={v => setForm(p => ({ ...p, immediateAction: v }))}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{['quarantine', 'rework', 'scrap', 'use_as_is', 'return'].map(a => <SelectItem key={a} value={a} className="capitalize">{a.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs">Supplier</Label><Input value={form.supplierName} onChange={e => setForm(p => ({ ...p, supplierName: e.target.value }))} /></div>
          <div><Label className="text-xs">Reported By</Label><Input value={form.reportedByName} onChange={e => setForm(p => ({ ...p, reportedByName: e.target.value }))} /></div>
          <div className="sm:col-span-2"><Label className="text-xs">Notes</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} /></div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.title || !form.severity || !form.category || !form.immediateAction}>Create NCR</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
