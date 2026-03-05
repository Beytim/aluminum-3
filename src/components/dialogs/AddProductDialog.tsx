import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { Plus, Trash2 } from "lucide-react";
import type { Product, BOMComponent } from "@/data/sampleData";

const categories = ['Windows', 'Doors', 'Curtain Walls', 'Handrails', 'Louvers', 'Partitions', 'Sheet', 'Plate', 'Bar/Rod', 'Tube/Pipe', 'Angle', 'Channel', 'Beam', 'Profile', 'Coil', 'Custom'] as const;
const productTypes = ['Raw Material', 'Fabricated', 'System', 'Custom'] as const;
const units = ['pcs', 'm', 'm²', 'kg', 'set', 'roll', 'box'] as const;
const bomTypes = ['Profile', 'Hardware', 'Glass', 'Accessory', 'Other'] as const;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: Product) => void;
  existingCount: number;
}

export function AddProductDialog({ open, onOpenChange, onAdd, existingCount }: Props) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [tab, setTab] = useState("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '', nameAm: '', category: '' as string, subcategory: '', productType: 'Fabricated' as string,
    profile: '', glass: '', colors: '', unit: 'pcs', version: '1.0', effectiveDate: '',
    // Dimensions
    width: '', height: '', thickness: '', length: '', diameter: '', wallThickness: '',
    weightPerMeter: '', weightPerPiece: '', laborHrs: '',
    // Pricing
    profileCost: '', glassCost: '', hardwareCost: '', accessoriesCost: '',
    fabLaborCost: '', installLaborCost: '', overheadPercent: '20', sellingPrice: '',
    // Stock
    currentStock: '', minStock: '', maxStock: '', warehouseLocation: '', supplierId: '',
    leadTimeDays: '', moq: '',
  });

  const [bom, setBom] = useState<BOMComponent[]>([]);

  const totalCost = () => {
    const p = Number(form.profileCost) || 0;
    const g = Number(form.glassCost) || 0;
    const h = Number(form.hardwareCost) || 0;
    const a = Number(form.accessoriesCost) || 0;
    const fl = Number(form.fabLaborCost) || 0;
    const il = Number(form.installLaborCost) || 0;
    const sub = p + g + h + a + fl + il;
    const oh = (Number(form.overheadPercent) || 0) / 100 * sub;
    return sub + oh;
  };

  const profit = () => (Number(form.sellingPrice) || 0) - totalCost();
  const margin = () => {
    const sp = Number(form.sellingPrice) || 0;
    return sp > 0 ? ((profit() / sp) * 100) : 0;
  };

  const area = () => {
    const w = Number(form.width) || 0;
    const h = Number(form.height) || 0;
    return w > 0 && h > 0 ? ((w * h) / 1e6) : 0;
  };
  const perimeter = () => {
    const w = Number(form.width) || 0;
    const h = Number(form.height) || 0;
    return w > 0 && h > 0 ? (2 * (w + h)) : 0;
  };

  const bomTotal = bom.reduce((s, b) => s + b.total, 0);

  const addBomRow = () => {
    setBom(prev => [...prev, { id: `BOM-NEW-${Date.now()}`, type: 'Profile', name: '', quantity: 0, unit: 'm', unitCost: 0, total: 0 }]);
  };

  const updateBomRow = (idx: number, field: string, value: string | number) => {
    setBom(prev => prev.map((row, i) => {
      if (i !== idx) return row;
      const updated = { ...row, [field]: value };
      if (field === 'quantity' || field === 'unitCost') {
        updated.total = (Number(updated.quantity) || 0) * (Number(updated.unitCost) || 0);
      }
      return updated;
    }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.nameAm.trim()) e.nameAm = 'Required';
    if (!form.category) e.category = 'Required';
    if (!form.productType) e.productType = 'Required';
    if (!form.sellingPrice || Number(form.sellingPrice) <= 0) e.sellingPrice = 'Must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { setTab("basic"); return; }
    const id = `PRD-${String(existingCount + 1).padStart(3, '0')}`;
    const code = `${form.category.substring(0, 2).toUpperCase()}-${id}`;
    const tc = totalCost();
    const product: Product = {
      id, code, name: form.name.trim(), nameAm: form.nameAm.trim(),
      category: form.category as Product['category'], subcategory: form.subcategory.trim(),
      productType: form.productType as Product['productType'],
      profile: form.profile.trim(), glass: form.glass.trim(),
      colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
      laborHrs: Number(form.laborHrs) || 0,
      materialCost: tc > 0 ? tc : Number(form.sellingPrice) * 0.6,
      sellingPrice: Number(form.sellingPrice),
      status: 'Active',
      unit: form.unit, version: form.version, effectiveDate: form.effectiveDate || undefined,
      width: Number(form.width) || undefined, length: Number(form.height || form.length) || undefined,
      thickness: Number(form.thickness) || undefined, diameter: Number(form.diameter) || undefined,
      wallThickness: Number(form.wallThickness) || undefined,
      weightPerMeter: Number(form.weightPerMeter) || undefined, weightPerPiece: Number(form.weightPerPiece) || undefined,
      profileCost: Number(form.profileCost) || undefined, glassCost: Number(form.glassCost) || undefined,
      hardwareCost: Number(form.hardwareCost) || undefined, accessoriesCost: Number(form.accessoriesCost) || undefined,
      fabLaborCost: Number(form.fabLaborCost) || undefined, installLaborCost: Number(form.installLaborCost) || undefined,
      overheadPercent: Number(form.overheadPercent) || undefined,
      currentStock: Number(form.currentStock) || 0, minStock: Number(form.minStock) || 0, maxStock: Number(form.maxStock) || 0,
      warehouseLocation: form.warehouseLocation || undefined, supplierId: form.supplierId || undefined,
      leadTimeDays: Number(form.leadTimeDays) || undefined, moq: Number(form.moq) || undefined,
      bom: bom.length > 0 ? bom : undefined,
    };
    onAdd(product);
    toast({ title: t('common.add'), description: `${product.name} added.` });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setForm({ name: '', nameAm: '', category: '', subcategory: '', productType: 'Fabricated', profile: '', glass: '', colors: '', unit: 'pcs', version: '1.0', effectiveDate: '', width: '', height: '', thickness: '', length: '', diameter: '', wallThickness: '', weightPerMeter: '', weightPerPiece: '', laborHrs: '', profileCost: '', glassCost: '', hardwareCost: '', accessoriesCost: '', fabLaborCost: '', installLaborCost: '', overheadPercent: '20', sellingPrice: '', currentStock: '', minStock: '', maxStock: '', warehouseLocation: '', supplierId: '', leadTimeDays: '', moq: '' });
    setBom([]);
    setErrors({});
    setTab("basic");
  };

  const F = (field: string, label: string, opts?: { type?: string; placeholder?: string; required?: boolean; span?: boolean }) => (
    <div className={opts?.span ? 'sm:col-span-2' : ''}>
      <Label className="text-xs">{label}{opts?.required ? ' *' : ''}</Label>
      <Input type={opts?.type || 'text'} value={(form as any)[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} placeholder={opts?.placeholder} className={`h-8 text-xs ${errors[field] ? 'border-destructive' : ''}`} />
      {errors[field] && <p className="text-[10px] text-destructive mt-0.5">{errors[field]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{t('products.add')}</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
            <TabsTrigger value="dimensions" className="text-xs">Dimensions</TabsTrigger>
            <TabsTrigger value="bom" className="text-xs">BOM</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {F('name', 'Name (EN)', { required: true })}
              {F('nameAm', 'ስም (AM)', { required: true })}
              <div>
                <Label className="text-xs">Category *</Label>
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger className={`h-8 text-xs ${errors.category ? 'border-destructive' : ''}`}><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {F('subcategory', 'Subcategory')}
              <div>
                <Label className="text-xs">Product Type *</Label>
                <Select value={form.productType} onValueChange={v => setForm(p => ({ ...p, productType: v }))}>
                  <SelectTrigger className={`h-8 text-xs ${errors.productType ? 'border-destructive' : ''}`}><SelectValue /></SelectTrigger>
                  <SelectContent>{productTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Unit</Label>
                <Select value={form.unit} onValueChange={v => setForm(p => ({ ...p, unit: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {F('profile', 'Profile', { placeholder: 'e.g. 6063-T5' })}
              {F('glass', 'Glass', { placeholder: 'e.g. 6mm Clear Tempered' })}
              {F('colors', 'Colors (comma-separated)', { placeholder: 'White, Black, Bronze', span: true })}
              {F('version', 'Version')}
              {F('effectiveDate', 'Effective Date', { type: 'date' })}
            </div>
          </TabsContent>

          <TabsContent value="dimensions" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {F('width', 'Width (mm)', { type: 'number' })}
              {F('height', 'Height (mm)', { type: 'number' })}
              {F('thickness', 'Thickness (mm)', { type: 'number' })}
              {F('length', 'Length (mm)', { type: 'number' })}
              {F('diameter', 'Diameter (mm)', { type: 'number' })}
              {F('wallThickness', 'Wall Thickness (mm)', { type: 'number' })}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t">
              <div>
                <Label className="text-xs text-muted-foreground">Area (m²)</Label>
                <div className="h-8 flex items-center text-xs font-medium">{area().toFixed(2)}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Perimeter (mm)</Label>
                <div className="h-8 flex items-center text-xs font-medium">{perimeter().toLocaleString()}</div>
              </div>
              {F('weightPerMeter', 'Weight/m (kg)', { type: 'number' })}
              {F('weightPerPiece', 'Weight/pc (kg)', { type: 'number' })}
            </div>
            <div className="pt-2 border-t">
              {F('laborHrs', 'Labor Hours', { type: 'number' })}
            </div>
          </TabsContent>

          <TabsContent value="bom" className="space-y-3 mt-3">
            <Button size="sm" variant="outline" onClick={addBomRow} className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />Add Component
            </Button>
            {bom.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs w-24">Type</TableHead>
                      <TableHead className="text-xs">Component</TableHead>
                      <TableHead className="text-xs w-16">Qty</TableHead>
                      <TableHead className="text-xs w-16">Unit</TableHead>
                      <TableHead className="text-xs w-20">Cost</TableHead>
                      <TableHead className="text-xs w-20">Total</TableHead>
                      <TableHead className="text-xs w-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bom.map((row, idx) => (
                      <TableRow key={row.id}>
                        <TableCell className="p-1">
                          <Select value={row.type} onValueChange={v => updateBomRow(idx, 'type', v)}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>{bomTypes.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}</SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="p-1"><Input className="h-7 text-xs" value={row.name} onChange={e => updateBomRow(idx, 'name', e.target.value)} /></TableCell>
                        <TableCell className="p-1"><Input className="h-7 text-xs" type="number" value={row.quantity || ''} onChange={e => updateBomRow(idx, 'quantity', Number(e.target.value))} /></TableCell>
                        <TableCell className="p-1"><Input className="h-7 text-xs" value={row.unit} onChange={e => updateBomRow(idx, 'unit', e.target.value)} /></TableCell>
                        <TableCell className="p-1"><Input className="h-7 text-xs" type="number" value={row.unitCost || ''} onChange={e => updateBomRow(idx, 'unitCost', Number(e.target.value))} /></TableCell>
                        <TableCell className="p-1 text-xs font-medium">{row.total.toLocaleString()}</TableCell>
                        <TableCell className="p-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setBom(prev => prev.filter((_, i) => i !== idx))}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="text-right text-xs font-semibold pt-2 pr-2">BOM Total: ETB {bomTotal.toLocaleString()}</div>
              </div>
            )}
            {bom.length === 0 && <p className="text-xs text-muted-foreground py-4 text-center">No BOM components added yet.</p>}
          </TabsContent>

          <TabsContent value="pricing" className="space-y-3 mt-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Cost Breakdown</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {F('profileCost', 'Profile Cost (ETB)', { type: 'number' })}
              {F('glassCost', 'Glass Cost (ETB)', { type: 'number' })}
              {F('hardwareCost', 'Hardware Cost (ETB)', { type: 'number' })}
              {F('accessoriesCost', 'Accessories (ETB)', { type: 'number' })}
              {F('fabLaborCost', 'Fab Labor (ETB)', { type: 'number' })}
              {F('installLaborCost', 'Install Labor (ETB)', { type: 'number' })}
              {F('overheadPercent', 'Overhead %', { type: 'number' })}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Total Cost:</span><span className="font-semibold">ETB {totalCost().toLocaleString()}</span></div>
              {F('sellingPrice', 'Selling Price (ETB)', { type: 'number', required: true })}
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Profit:</span><span className={`font-semibold ${profit() >= 0 ? 'text-success' : 'text-destructive'}`}>ETB {profit().toLocaleString()} ({margin().toFixed(1)}%)</span></div>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Stock & Supplier</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {F('currentStock', 'Current Stock', { type: 'number' })}
                {F('minStock', 'Min Stock', { type: 'number' })}
                {F('maxStock', 'Max Stock', { type: 'number' })}
                {F('warehouseLocation', 'Location', { placeholder: 'A-1-1' })}
                {F('supplierId', 'Supplier')}
                {F('leadTimeDays', 'Lead Time (days)', { type: 'number' })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-2">
          <Button variant="outline" size="sm" onClick={() => { resetForm(); onOpenChange(false); }}>{t('common.cancel')}</Button>
          <Button size="sm" onClick={handleSubmit}>{t('common.add')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}