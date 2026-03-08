import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import type { EnhancedProduct, BOMComponent, ProductCategory, ProductType } from "@/data/enhancedProductData";

const categories: ProductCategory[] = ['Windows', 'Doors', 'Curtain Walls', 'Handrails', 'Louvers', 'Partitions', 'Sheet', 'Plate', 'Bar/Rod', 'Tube/Pipe', 'Angle', 'Channel', 'Beam', 'Profile', 'Coil', 'Custom'];
const productTypes: ProductType[] = ['Raw Material', 'Fabricated', 'System', 'Custom'];
const units = ['pcs', 'm', 'm²', 'kg', 'set', 'roll', 'box', 'sqm', 'lm'] as const;
const bomTypes = ['Profile', 'Hardware', 'Glass', 'Accessory', 'Other'] as const;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: EnhancedProduct) => void;
  existingCount: number;
}

export default function AddEnhancedProductDialog({ open, onOpenChange, onAdd, existingCount }: Props) {
  const { toast } = useToast();
  const [tab, setTab] = useState("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '', nameAm: '', category: '', subcategory: '', productType: 'Fabricated',
    profile: '', glass: '', colors: '', unit: 'pcs', version: '1.0', effectiveDate: '',
    width: '', height: '', thickness: '', length: '', diameter: '', wallThickness: '',
    weightPerMeter: '', weightPerPiece: '', laborHrs: '',
    profileCost: '', glassCost: '', hardwareCost: '', accessoriesCost: '',
    fabLaborCost: '', installLaborCost: '', overheadPercent: '20', sellingPrice: '',
    currentStock: '', minStock: '', maxStock: '', warehouseLocation: '', supplierId: '',
    supplierName: '', leadTimeDays: '', moq: '', tags: '',
  });

  const [bom, setBom] = useState<BOMComponent[]>([]);

  const totalCost = () => {
    const sub = [form.profileCost, form.glassCost, form.hardwareCost, form.accessoriesCost, form.fabLaborCost, form.installLaborCost].reduce((s, v) => s + (Number(v) || 0), 0);
    return sub + (sub * ((Number(form.overheadPercent) || 0) / 100));
  };

  const profit = () => (Number(form.sellingPrice) || 0) - totalCost();
  const margin = () => {
    const sp = Number(form.sellingPrice) || 0;
    return sp > 0 ? ((profit() / sp) * 100) : 0;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.nameAm.trim()) e.nameAm = 'Required';
    if (!form.category) e.category = 'Required';
    if (!form.sellingPrice || Number(form.sellingPrice) <= 0) e.sellingPrice = 'Must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { setTab("basic"); return; }
    const id = `PRD-${String(existingCount + 1).padStart(3, '0')}`;
    const code = `${form.category.substring(0, 2).toUpperCase()}-${id}`;
    const now = new Date().toISOString().split('T')[0];
    const tc = totalCost();
    const product: EnhancedProduct = {
      id, code, name: form.name.trim(), nameAm: form.nameAm.trim(),
      category: form.category as ProductCategory, subcategory: form.subcategory.trim(),
      productType: form.productType as ProductType, status: 'Active',
      profile: form.profile.trim(), glass: form.glass.trim(),
      colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
      laborHrs: Number(form.laborHrs) || 0, unit: form.unit,
      profileCost: Number(form.profileCost) || 0, glassCost: Number(form.glassCost) || 0,
      hardwareCost: Number(form.hardwareCost) || 0, accessoriesCost: Number(form.accessoriesCost) || 0,
      fabLaborCost: Number(form.fabLaborCost) || 0, installLaborCost: Number(form.installLaborCost) || 0,
      overheadPercent: Number(form.overheadPercent) || 0,
      materialCost: tc > 0 ? tc : Number(form.sellingPrice) * 0.6,
      sellingPrice: Number(form.sellingPrice),
      currentStock: Number(form.currentStock) || 0, minStock: Number(form.minStock) || 0,
      maxStock: Number(form.maxStock) || 0, reservedStock: 0,
      warehouseLocation: form.warehouseLocation || undefined,
      supplierId: form.supplierId || undefined, supplierName: form.supplierName || undefined,
      leadTimeDays: Number(form.leadTimeDays) || undefined, moq: Number(form.moq) || undefined,
      width: Number(form.width) || undefined, length: Number(form.height || form.length) || undefined,
      thickness: Number(form.thickness) || undefined, diameter: Number(form.diameter) || undefined,
      wallThickness: Number(form.wallThickness) || undefined,
      weightPerMeter: Number(form.weightPerMeter) || undefined, weightPerPiece: Number(form.weightPerPiece) || undefined,
      inspectionRequired: form.productType !== 'Raw Material',
      bom: bom.length > 0 ? bom : undefined,
      version: form.version || '1.0', effectiveDate: form.effectiveDate || undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      createdAt: now, createdBy: 'Admin', updatedAt: now, updatedBy: 'Admin',
    };
    onAdd(product);
    toast({ title: "Product Added", description: product.name });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setForm({ name: '', nameAm: '', category: '', subcategory: '', productType: 'Fabricated', profile: '', glass: '', colors: '', unit: 'pcs', version: '1.0', effectiveDate: '', width: '', height: '', thickness: '', length: '', diameter: '', wallThickness: '', weightPerMeter: '', weightPerPiece: '', laborHrs: '', profileCost: '', glassCost: '', hardwareCost: '', accessoriesCost: '', fabLaborCost: '', installLaborCost: '', overheadPercent: '20', sellingPrice: '', currentStock: '', minStock: '', maxStock: '', warehouseLocation: '', supplierId: '', supplierName: '', leadTimeDays: '', moq: '', tags: '' });
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
        <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
            <TabsTrigger value="dimensions" className="text-xs">Dimensions</TabsTrigger>
            <TabsTrigger value="bom" className="text-xs">BOM</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs">Pricing & Stock</TabsTrigger>
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
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
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
              {F('tags', 'Tags (comma-separated)', { placeholder: 'bestseller, residential', span: true })}
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
              {F('weightPerMeter', 'Weight/m (kg)', { type: 'number' })}
              {F('weightPerPiece', 'Weight/pc (kg)', { type: 'number' })}
              {F('laborHrs', 'Labor Hours', { type: 'number' })}
            </div>
          </TabsContent>

          <TabsContent value="bom" className="space-y-3 mt-3">
            <Button size="sm" variant="outline" onClick={() => setBom(prev => [...prev, { id: `BOM-${Date.now()}`, type: 'Profile', name: '', quantity: 0, unit: 'm', unitCost: 0, total: 0 }])} className="h-7 text-xs">
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
                          <Select value={row.type} onValueChange={v => setBom(prev => prev.map((r, i) => i === idx ? { ...r, type: v as any } : r))}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>{bomTypes.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}</SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="p-1"><Input className="h-7 text-xs" value={row.name} onChange={e => setBom(prev => prev.map((r, i) => i === idx ? { ...r, name: e.target.value } : r))} /></TableCell>
                        <TableCell className="p-1"><Input className="h-7 text-xs" type="number" value={row.quantity || ''} onChange={e => { const q = Number(e.target.value); setBom(prev => prev.map((r, i) => i === idx ? { ...r, quantity: q, total: q * r.unitCost } : r)); }} /></TableCell>
                        <TableCell className="p-1"><Input className="h-7 text-xs" value={row.unit} onChange={e => setBom(prev => prev.map((r, i) => i === idx ? { ...r, unit: e.target.value } : r))} /></TableCell>
                        <TableCell className="p-1"><Input className="h-7 text-xs" type="number" value={row.unitCost || ''} onChange={e => { const c = Number(e.target.value); setBom(prev => prev.map((r, i) => i === idx ? { ...r, unitCost: c, total: r.quantity * c } : r)); }} /></TableCell>
                        <TableCell className="p-1 text-xs font-medium">{row.total.toLocaleString()}</TableCell>
                        <TableCell className="p-1"><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setBom(prev => prev.filter((_, i) => i !== idx))}><Trash2 className="h-3 w-3 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="text-right text-xs font-semibold pt-2 pr-2">BOM Total: ETB {bom.reduce((s, b) => s + b.total, 0).toLocaleString()}</div>
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
                {F('supplierName', 'Supplier')}
                {F('leadTimeDays', 'Lead Time (days)', { type: 'number' })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-2">
          <Button variant="outline" size="sm" onClick={() => { resetForm(); onOpenChange(false); }}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit}>Add Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
