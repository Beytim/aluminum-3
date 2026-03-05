import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck, CheckCircle, XCircle, AlertCircle, Plus, Trash2 } from "lucide-react";
import { sampleQualityChecks } from "@/data/sampleData";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import type { QualityCheck } from "@/data/sampleData";

const resultIcon = {
  Pass: <CheckCircle className="h-4 w-4 text-success" />,
  Fail: <XCircle className="h-4 w-4 text-destructive" />,
  Conditional: <AlertCircle className="h-4 w-4 text-warning" />,
};

const resultColor: Record<string, string> = {
  Pass: 'bg-success/10 text-success',
  Fail: 'bg-destructive/10 text-destructive',
  Conditional: 'bg-warning/10 text-warning',
};

export default function Quality() {
  const [checks, setChecks] = useLocalStorage<QualityCheck[]>(STORAGE_KEYS.QUALITY_CHECKS, sampleQualityChecks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useI18n();
  const { toast } = useToast();
  const [form, setForm] = useState({ workOrderId: '', productName: '', inspector: '', result: '', defects: '', notes: '' });

  const passRate = checks.length > 0 ? ((checks.filter(q => q.result === 'Pass').length / checks.length) * 100).toFixed(0) : '0';

  const handleAdd = () => {
    if (!form.productName.trim() || !form.result) return;
    const qc: QualityCheck = {
      id: `QC-${String(checks.length + 1).padStart(3, '0')}`,
      workOrderId: form.workOrderId || 'N/A',
      productName: form.productName.trim(),
      inspector: form.inspector || 'Inspector',
      date: new Date().toISOString().split('T')[0],
      result: form.result as QualityCheck['result'],
      defects: form.defects ? form.defects.split(',').map(d => d.trim()).filter(Boolean) : [],
      notes: form.notes,
    };
    setChecks(prev => [...prev, qc]);
    toast({ title: "Quality Check Added", description: qc.id });
    setForm({ workOrderId: '', productName: '', inspector: '', result: '', defects: '', notes: '' });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.quality')}</h1>
          <p className="text-sm text-muted-foreground">{checks.length} inspections · Pass rate: {passRate}%</p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />New Check</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(['Pass', 'Conditional', 'Fail'] as const).map(result => {
          const count = checks.filter(q => q.result === result).length;
          return (
            <Card key={result} className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                {resultIcon[result]}
                <div><p className="text-xs text-muted-foreground">{result}</p><p className="text-xl font-bold">{count}</p></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">ID</TableHead>
                <TableHead className="text-xs">Work Order</TableHead>
                <TableHead className="text-xs">Product</TableHead>
                <TableHead className="text-xs">Inspector</TableHead>
                <TableHead className="text-xs">{t('common.date')}</TableHead>
                <TableHead className="text-xs">Result</TableHead>
                <TableHead className="text-xs">Defects</TableHead>
                <TableHead className="text-xs">Notes</TableHead>
                <TableHead className="text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checks.map(qc => (
                <TableRow key={qc.id}>
                  <TableCell className="text-xs font-mono">{qc.id}</TableCell>
                  <TableCell className="text-xs font-mono">{qc.workOrderId}</TableCell>
                  <TableCell className="text-xs font-medium">{qc.productName}</TableCell>
                  <TableCell className="text-xs">{qc.inspector}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{qc.date}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${resultColor[qc.result]}`}>{qc.result}</span>
                  </TableCell>
                  <TableCell className="text-xs">
                    {qc.defects.length > 0 ? qc.defects.map(d => (
                      <Badge key={d} variant="destructive" className="text-[10px] mr-1 mb-0.5">{d}</Badge>
                    )) : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{qc.notes}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setChecks(prev => prev.filter(c => c.id !== qc.id)); toast({ title: "Deleted" }); }}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Quality Check</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><Label className="text-xs">Work Order ID</Label><Input value={form.workOrderId} onChange={e => setForm(p => ({ ...p, workOrderId: e.target.value }))} /></div>
            <div><Label className="text-xs">Product *</Label><Input value={form.productName} onChange={e => setForm(p => ({ ...p, productName: e.target.value }))} /></div>
            <div><Label className="text-xs">Inspector</Label><Input value={form.inspector} onChange={e => setForm(p => ({ ...p, inspector: e.target.value }))} /></div>
            <div><Label className="text-xs">Result *</Label>
              <Select value={form.result} onValueChange={v => setForm(p => ({ ...p, result: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Pass">Pass</SelectItem><SelectItem value="Conditional">Conditional</SelectItem><SelectItem value="Fail">Fail</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2"><Label className="text-xs">Defects (comma-separated)</Label><Input value={form.defects} onChange={e => setForm(p => ({ ...p, defects: e.target.value }))} /></div>
            <div className="sm:col-span-2"><Label className="text-xs">Notes</Label><Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleAdd}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
