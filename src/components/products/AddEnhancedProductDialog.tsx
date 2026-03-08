import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Calculator } from "lucide-react";
import { useAddProduct, useSaveBOM } from "@/hooks/useProducts";
import { useSuppliers } from "@/hooks/useSuppliers";

const categories = ['Windows', 'Doors', 'Curtain Walls', 'Handrails', 'Louvers', 'Partitions', 'Sheet', 'Plate', 'Bar/Rod', 'Tube/Pipe', 'Angle', 'Channel', 'Beam', 'Profile', 'Coil', 'Custom'];
const productTypes = ['Raw Material', 'Fabricated', 'System', 'Custom'];
const units = ['pcs', 'm', 'm²', 'kg', 'set', 'roll', 'box', 'sqm', 'lm'];
const bomTypes = ['Profile', 'Hardware', 'Glass', 'Accessory', 'Other'];

interface BOMRow { id: string; type: string; name: string; quantity: number; unit: string; unitCost: number; total: number; }

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingCount: number;
}

export default function AddEnhancedProductDialog({ open, onOpenChange, existingCount }: Props) {
  const addProduct = useAddProduct();
  const saveBOM = useSaveBOM();
  const { data: dbSuppliers = [] } = useSuppliers();
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

  const [bom, setBom] = useState<BOMRow[]>([]);

  // Auto-calculate cost fields from BOM
  useEffect(() => {
    if (bom.length === 0) return;
    const costByType: Record<string, number> = {};
    for (const row of bom) {
      costByType[row.type] = (costByType[row.type] || 0) + row.total;
    }
    setForm(prev => ({
      ...prev,
      profileCost: String(costByType['Profile'] || Number(prev.profileCost) || 0),
      glassCost: String(costByType['Glass'] || Number(prev.glassCost) || 0),
      hardwareCost: String(costByType['Hardware'] || Number(prev.hardwareCost) || 0),
      accessoriesCost: String(costByType['Accessory'] || Number(prev.accessoriesCost) || 0),
    }));
  }, [bom]);

  const totalCost = () => {
    const sub = [form.profileCost, form.glassCost, form.hardwareCost, form.accessoriesCost, form.fabLaborCost, form.installLaborCost].reduce((s, v) => s + (Number(v) || 0), 0);
    return sub + (sub * ((Number(form.overheadPercent) || 0) / 100));
  };

  const profit = () => (Number(form.sellingPrice) || 0) - totalCost();
  const margin = () => {
    const sp = Number(form.sellingPrice) || 0;
    return sp > 0 ? ((profit() / sp) * 100) : 0;
  };

  // Auto-suggest selling price (cost + 30% markup)
  const suggestSellingPrice = () => {
    const tc = totalCost();
    if (tc > 0) {
      setForm(prev => ({ ...prev, sellingPrice: String(Math.round(tc * 1.3)) }));
    }
  };

  const handleSupplierChange = (supplierId: string) => {
    if (supplierId === '__none__') {
      setForm(prev => ({ ...prev, supplierId: '', supplierName: '', leadTimeDays: '', moq: '' }));
      return;
    }
    const supplier = dbSuppliers.find(s => s.id === supplierId);
    if (supplier) {
      setForm(prev => ({
        ...prev,
        supplierId: supplier.id,
        supplierName: supplier.company_name,
        leadTimeDays: String(supplier.average_lead_time || ''),
        moq: String(supplier.min_order_qty || ''),
      }));
    }
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

  const handleSubmit = async () => {
    if (!validate()) { setTab("basic"); return; }
    const code = `${form.category.substring(0, 2).toUpperCase()}-${String(existingCount + 1).padStart(3, '0')}`;
    const tc = totalCost();

    const result = await addProduct.mutateAsync({
      code,
      name: form.name.trim(),
      name_am: form.nameAm.trim(),
      category: form.category as any,
      subcategory: form.subcategory.trim(),
      product_type: form.productType as any,
      status: 'Active' as any,
      profile: form.profile.trim(),
      glass: form.glass.trim(),
      colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
      alloy_type: null,
      temper: null,
      form: null,
      width: Number(form.width) || null,
      length: Number(form.length) || null,
      height: Number(form.height) || null,
      thickness: Number(form.thickness) || null,
      diameter: Number(form.diameter) || null,
      wall_thickness: Number(form.wallThickness) || null,
      weight_per_meter: Number(form.weightPerMeter) || null,
      weight_per_piece: Number(form.weightPerPiece) || null,
      labor_hrs: Number(form.laborHrs) || 0,
      unit: form.unit,
      profile_cost: Number(form.profileCost) || 0,
      glass_cost: Number(form.glassCost) || 0,
      hardware_cost: Number(form.hardwareCost) || 0,
      accessories_cost: Number(form.accessoriesCost) || 0,
      fab_labor_cost: Number(form.fabLaborCost) || 0,
      install_labor_cost: Number(form.installLaborCost) || 0,
      overhead_percent: Number(form.overheadPercent) || 0,
      material_cost: tc > 0 ? tc : Number(form.sellingPrice) * 0.6,
      selling_price: Number(form.sellingPrice),
      purchase_price: null,
      markup_percent: margin() > 0 ? Number(margin().toFixed(1)) : null,
      current_stock: Number(form.currentStock) || 0,
      min_stock: Number(form.minStock) || 0,
      max_stock: Number(form.maxStock) || 0,
      reserved_stock: 0,
      warehouse_location: form.warehouseLocation || null,
      supplier_id: form.supplierId || null,
      supplier_name: form.supplierName || null,
      lead_time_days: Number(form.leadTimeDays) || null,
      moq: Number(form.moq) || null,
      inspection_required: form.productType !== 'Raw Material',
      defect_rate: null,
      version: form.version || '1.0',
      effective_date: form.effectiveDate || null,
      batch_number: null,
      mill_certificate: false,
      date_received: null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      notes: null,
      created_by: null,
      updated_by: null,
    });

    if (bom.length > 0 && result) {
      await saveBOM.mutateAsync({
        productId: result.id,
        bom: bom.map(b => ({
          component_type: b.type,
          name: b.name,
          quantity: b.quantity,
          unit: b.unit,
          unit_cost: b.unitCost,
          total: b.total,
          inventory_item_id: null,
          sort_order: 0,
          created_at: new Date().toISOString(),
        })),
      });
    }

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setForm({ name: '', nameAm: '', category: '', subcategory: '', productType: 'Fabricated', profile: '', glass: '', colors: '', unit: 'pcs', version: '1.0', effectiveDate: '', width: '', height: '', thickness: '', length: '', diameter: '', wallThickness: '', weightPerMeter: '', weightPerPiece: '', laborHrs: '', profileCost: '', glassCost: '', hardwareCost: '', accessoriesCost: '', fabLaborCost: '', installLaborCost: '', overheadPercent: '20', sellingPrice: '', currentStock: '', minStock: '', maxStock: '', warehouseLocation: '', supplierId: '', supplierName: '', leadTimeDays: '', moq: '', tags: '' });
    setBom([]);
    setErrors({});
    setTab("basic");
  };

  const F = (field: string, label: string, opts?: { type?: string; placeholder?: string; required?: boolean; span?: boolean; disabled?: boolean }) => (
    <div className={opts?.span ? 'sm:col-span-2' : ''}>
      <Label className="text-xs">{label}{opts?.required ? ' *' : ''}</Label>
      <Input type={opts?.type || 'text'} value={(form as any)[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} placeholder={opts?.placeholder} disabled={opts?.disabled} className={`h-8 text-xs ${errors[field] ? 'border-destructive' : ''} ${opts?.disabled ? 'bg-muted' : ''}`} />
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
            <div className="flex items-center justify-between">
              <Button size="sm" variant="outline" onClick={() => setBom(prev => [...prev, { id: `BOM-${Date.now()}`, type: 'Profile', name: '', quantity: 0, unit: 'm', unitCost: 0, total: 0 }])} className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" />Add Component
              </Button>
              {bom.length > 0 && (
                <p className="text-[10px] text-muted-foreground">💡 BOM totals auto-fill cost breakdown in Pricing tab</p>
              )}
            </div>
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
                          <Select value={row.type} onValueChange={v => setBom(prev => prev.map((r, i) => i === idx ? { ...r, type: v } : r))}>
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
            <p className="text-xs font-semibold text-muted-foreground uppercase">Cost Breakdown {bom.length > 0 && <span className="text-primary font-normal">(auto-filled from BOM)</span>}</p>
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
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  {F('sellingPrice', 'Selling Price (ETB)', { type: 'number', required: true })}
                </div>
                {totalCost() > 0 && (
                  <Button type="button" size="sm" variant="outline" className="h-8 text-xs mb-0.5" onClick={suggestSellingPrice} title="Auto-suggest price (cost + 30%)">
                    <Calculator className="h-3 w-3 mr-1" />+30%
                  </Button>
                )}
              </div>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Profit:</span><span className={`font-semibold ${profit() >= 0 ? 'text-success' : 'text-destructive'}`}>ETB {profit().toLocaleString()} ({margin().toFixed(1)}%)</span></div>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Stock & Supplier</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {F('currentStock', 'Current Stock', { type: 'number' })}
                {F('minStock', 'Min Stock', { type: 'number' })}
                {F('maxStock', 'Max Stock', { type: 'number' })}
                {F('warehouseLocation', 'Location', { placeholder: 'A-1-1' })}
                <div className="sm:col-span-2">
                  <Label className="text-xs">Supplier</Label>
                  <Select value={form.supplierId || '__none__'} onValueChange={handleSupplierChange}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">— No supplier —</SelectItem>
                      {sampleSuppliers.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.company} ({s.country})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {F('leadTimeDays', 'Lead Time (days)', { type: 'number', disabled: !!form.supplierId })}
                {F('moq', 'MOQ', { type: 'number', disabled: !!form.supplierId })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-2">
          <Button variant="outline" size="sm" onClick={() => { resetForm(); onOpenChange(false); }}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={addProduct.isPending}>
            {addProduct.isPending ? "Adding..." : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
