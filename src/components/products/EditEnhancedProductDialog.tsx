import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { EnhancedProduct, ProductCategory, ProductType } from "@/data/enhancedProductData";

const categories: ProductCategory[] = ['Windows', 'Doors', 'Curtain Walls', 'Handrails', 'Louvers', 'Partitions', 'Sheet', 'Plate', 'Bar/Rod', 'Tube/Pipe', 'Angle', 'Channel', 'Beam', 'Profile', 'Coil', 'Custom'];
const productTypes: ProductType[] = ['Raw Material', 'Fabricated', 'System', 'Custom'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: EnhancedProduct | null;
  onSave: (product: EnhancedProduct) => void;
}

export default function EditEnhancedProductDialog({ open, onOpenChange, product, onSave }: Props) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', nameAm: '', category: '', subcategory: '', productType: 'Fabricated',
    profile: '', glass: '', colors: '', laborHrs: '', sellingPrice: '',
    alloyType: '', temper: '', currentStock: '', minStock: '', maxStock: '',
    warehouseLocation: '', notes: '', tags: '',
    profileCost: '', glassCost: '', hardwareCost: '', accessoriesCost: '',
    fabLaborCost: '', installLaborCost: '', overheadPercent: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name, nameAm: product.nameAm, category: product.category,
        subcategory: product.subcategory || '', productType: product.productType,
        profile: product.profile, glass: product.glass,
        colors: product.colors.join(', '), laborHrs: String(product.laborHrs || ''),
        sellingPrice: String(product.sellingPrice),
        alloyType: product.alloyType || '', temper: product.temper || '',
        currentStock: String(product.currentStock), minStock: String(product.minStock),
        maxStock: String(product.maxStock), warehouseLocation: product.warehouseLocation || '',
        notes: product.notes || '', tags: (product.tags || []).join(', '),
        profileCost: String(product.profileCost || ''), glassCost: String(product.glassCost || ''),
        hardwareCost: String(product.hardwareCost || ''), accessoriesCost: String(product.accessoriesCost || ''),
        fabLaborCost: String(product.fabLaborCost || ''), installLaborCost: String(product.installLaborCost || ''),
        overheadPercent: String(product.overheadPercent || ''),
      });
      setErrors({});
    }
  }, [product]);

  const totalCost = () => {
    const sub = [form.profileCost, form.glassCost, form.hardwareCost, form.accessoriesCost, form.fabLaborCost, form.installLaborCost].reduce((s, v) => s + (Number(v) || 0), 0);
    return sub + (sub * ((Number(form.overheadPercent) || 0) / 100));
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
    if (!validate() || !product) return;
    const now = new Date().toISOString().split('T')[0];
    const tc = totalCost();
    const updated: EnhancedProduct = {
      ...product,
      name: form.name.trim(), nameAm: form.nameAm.trim(),
      category: form.category as ProductCategory, subcategory: form.subcategory.trim(),
      productType: form.productType as ProductType,
      profile: form.profile.trim(), glass: form.glass.trim(),
      colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
      laborHrs: Number(form.laborHrs) || 0,
      profileCost: Number(form.profileCost) || 0, glassCost: Number(form.glassCost) || 0,
      hardwareCost: Number(form.hardwareCost) || 0, accessoriesCost: Number(form.accessoriesCost) || 0,
      fabLaborCost: Number(form.fabLaborCost) || 0, installLaborCost: Number(form.installLaborCost) || 0,
      overheadPercent: Number(form.overheadPercent) || 0,
      materialCost: tc > 0 ? tc : product.materialCost,
      sellingPrice: Number(form.sellingPrice),
      alloyType: form.alloyType || undefined, temper: form.temper || undefined,
      currentStock: Number(form.currentStock) || 0, minStock: Number(form.minStock) || 0,
      maxStock: Number(form.maxStock) || 0, warehouseLocation: form.warehouseLocation || undefined,
      notes: form.notes || undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      updatedAt: now, updatedBy: 'Admin',
    };
    onSave(updated);
    toast({ title: "Updated", description: `${updated.name} saved.` });
    onOpenChange(false);
  };

  const profit = Number(form.sellingPrice) - (totalCost() || product?.materialCost || 0);
  const mg = Number(form.sellingPrice) > 0 ? (profit / Number(form.sellingPrice)) * 100 : 0;

  const F = (field: string, label: string, opts?: { type?: string; span?: boolean }) => (
    <div className={opts?.span ? 'sm:col-span-2' : ''}>
      <Label className="text-xs">{label}</Label>
      <Input type={opts?.type || 'text'} value={(form as any)[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} className={`h-8 text-xs ${errors[field] ? 'border-destructive' : ''}`} />
      {errors[field] && <p className="text-[10px] text-destructive mt-0.5">{errors[field]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs">Pricing</TabsTrigger>
            <TabsTrigger value="stock" className="text-xs">Stock</TabsTrigger>
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
              {F('sellingPrice', 'Selling Price (ETB) *', { type: 'number' })}
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
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
