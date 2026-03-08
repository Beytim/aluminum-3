import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { useUpdateProduct, type Product } from "@/hooks/useProducts";
import { useSuppliers } from "@/hooks/useSuppliers";

const categories = ['Windows', 'Doors', 'Curtain Walls', 'Handrails', 'Louvers', 'Partitions', 'Sheet', 'Plate', 'Bar/Rod', 'Tube/Pipe', 'Angle', 'Channel', 'Beam', 'Profile', 'Coil', 'Custom'];
const productTypes = ['Raw Material', 'Fabricated', 'System', 'Custom'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export default function EditEnhancedProductDialog({ open, onOpenChange, product }: Props) {
  const updateProduct = useUpdateProduct();
  const { data: dbSuppliers = [] } = useSuppliers();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', nameAm: '', category: '', subcategory: '', productType: 'Fabricated',
    profile: '', glass: '', colors: '', laborHrs: '', sellingPrice: '',
    alloyType: '', temper: '', currentStock: '', minStock: '', maxStock: '',
    warehouseLocation: '', notes: '', tags: '', supplierId: '', supplierName: '',
    leadTimeDays: '', moq: '',
    profileCost: '', glassCost: '', hardwareCost: '', accessoriesCost: '',
    fabLaborCost: '', installLaborCost: '', overheadPercent: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name, nameAm: product.name_am, category: product.category,
        subcategory: product.subcategory || '', productType: product.product_type,
        profile: product.profile || '', glass: product.glass || '',
        colors: (product.colors || []).join(', '), laborHrs: String(product.labor_hrs || ''),
        sellingPrice: String(product.selling_price),
        alloyType: product.alloy_type || '', temper: product.temper || '',
        currentStock: String(product.current_stock), minStock: String(product.min_stock),
        maxStock: String(product.max_stock), warehouseLocation: product.warehouse_location || '',
        notes: product.notes || '', tags: (product.tags || []).join(', '),
        supplierId: product.supplier_id || '', supplierName: product.supplier_name || '',
        leadTimeDays: String(product.lead_time_days || ''), moq: String(product.moq || ''),
        profileCost: String(product.profile_cost || ''), glassCost: String(product.glass_cost || ''),
        hardwareCost: String(product.hardware_cost || ''), accessoriesCost: String(product.accessories_cost || ''),
        fabLaborCost: String(product.fab_labor_cost || ''), installLaborCost: String(product.install_labor_cost || ''),
        overheadPercent: String(product.overhead_percent || ''),
      });
      setErrors({});
    }
  }, [product]);

  const totalCost = () => {
    const sub = [form.profileCost, form.glassCost, form.hardwareCost, form.accessoriesCost, form.fabLaborCost, form.installLaborCost].reduce((s, v) => s + (Number(v) || 0), 0);
    return sub + (sub * ((Number(form.overheadPercent) || 0) / 100));
  };

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
    if (!validate() || !product) return;
    const tc = totalCost();

    await updateProduct.mutateAsync({
      id: product.id,
      name: form.name.trim(),
      name_am: form.nameAm.trim(),
      category: form.category as any,
      subcategory: form.subcategory.trim(),
      product_type: form.productType as any,
      profile: form.profile.trim(),
      glass: form.glass.trim(),
      colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
      labor_hrs: Number(form.laborHrs) || 0,
      profile_cost: Number(form.profileCost) || 0,
      glass_cost: Number(form.glassCost) || 0,
      hardware_cost: Number(form.hardwareCost) || 0,
      accessories_cost: Number(form.accessoriesCost) || 0,
      fab_labor_cost: Number(form.fabLaborCost) || 0,
      install_labor_cost: Number(form.installLaborCost) || 0,
      overhead_percent: Number(form.overheadPercent) || 0,
      material_cost: tc > 0 ? tc : product.material_cost,
      selling_price: Number(form.sellingPrice),
      alloy_type: form.alloyType || null,
      temper: form.temper || null,
      current_stock: Number(form.currentStock) || 0,
      min_stock: Number(form.minStock) || 0,
      max_stock: Number(form.maxStock) || 0,
      warehouse_location: form.warehouseLocation || null,
      supplier_id: form.supplierId || null,
      supplier_name: form.supplierName || null,
      lead_time_days: Number(form.leadTimeDays) || null,
      moq: Number(form.moq) || null,
      notes: form.notes || null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    });
    onOpenChange(false);
  };

  const profit = Number(form.sellingPrice) - (totalCost() || product?.material_cost || 0);
  const mg = Number(form.sellingPrice) > 0 ? (profit / Number(form.sellingPrice)) * 100 : 0;

  const F = (field: string, label: string, opts?: { type?: string; span?: boolean; disabled?: boolean }) => (
    <div className={opts?.span ? 'sm:col-span-2' : ''}>
      <Label className="text-xs">{label}</Label>
      <Input type={opts?.type || 'text'} value={(form as any)[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} disabled={opts?.disabled} className={`h-8 text-xs ${errors[field] ? 'border-destructive' : ''} ${opts?.disabled ? 'bg-muted' : ''}`} />
      {errors[field] && <p className="text-[10px] text-destructive mt-0.5">{errors[field]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs">Pricing</TabsTrigger>
            <TabsTrigger value="stock" className="text-xs">Stock</TabsTrigger>
            <TabsTrigger value="supplier" className="text-xs">Supplier</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {F('name', 'Name (EN) *')}
              {F('nameAm', 'ስም (AM) *')}
              <div>
                <Label className="text-xs">Category *</Label>
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger className={`h-8 text-xs ${errors.category ? 'border-destructive' : ''}`}><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Product Type</Label>
                <Select value={form.productType} onValueChange={v => setForm(p => ({ ...p, productType: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{productTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {F('profile', 'Profile')}
              {F('glass', 'Glass')}
              {F('colors', 'Colors (comma-separated)', { span: true })}
              {F('tags', 'Tags (comma-separated)', { span: true })}
              {F('notes', 'Notes', { span: true })}
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="mt-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {F('profileCost', 'Profile Cost (ETB)', { type: 'number' })}
              {F('glassCost', 'Glass Cost (ETB)', { type: 'number' })}
              {F('hardwareCost', 'Hardware Cost (ETB)', { type: 'number' })}
              {F('accessoriesCost', 'Accessories (ETB)', { type: 'number' })}
              {F('fabLaborCost', 'Fab Labor (ETB)', { type: 'number' })}
              {F('installLaborCost', 'Install Labor (ETB)', { type: 'number' })}
              {F('overheadPercent', 'Overhead %', { type: 'number' })}
              {F('laborHrs', 'Labor Hours', { type: 'number' })}
            </div>
            <div className="border-t pt-3 mt-3 space-y-2">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Total Cost:</span><span className="font-semibold">ETB {totalCost().toLocaleString()}</span></div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  {F('sellingPrice', 'Selling Price (ETB) *', { type: 'number' })}
                </div>
                {totalCost() > 0 && (
                  <Button type="button" size="sm" variant="outline" className="h-8 text-xs mb-0.5" onClick={suggestSellingPrice} title="Auto-suggest price (cost + 30%)">
                    <Calculator className="h-3 w-3 mr-1" />+30%
                  </Button>
                )}
              </div>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Profit:</span><span className={`font-semibold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>ETB {profit.toLocaleString()} ({mg.toFixed(1)}%)</span></div>
            </div>
          </TabsContent>

          <TabsContent value="stock" className="mt-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {F('currentStock', 'Current Stock', { type: 'number' })}
              {F('minStock', 'Min Stock', { type: 'number' })}
              {F('maxStock', 'Max Stock', { type: 'number' })}
              {F('warehouseLocation', 'Location')}
            </div>
          </TabsContent>

          <TabsContent value="supplier" className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Label className="text-xs">Supplier</Label>
                <Select value={form.supplierId || '__none__'} onValueChange={handleSupplierChange}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— No supplier —</SelectItem>
                    {dbSuppliers.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.company_name} ({s.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {F('leadTimeDays', 'Lead Time (days)', { type: 'number', disabled: !!form.supplierId })}
              {F('moq', 'MOQ', { type: 'number', disabled: !!form.supplierId })}
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={updateProduct.isPending}>
            {updateProduct.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
