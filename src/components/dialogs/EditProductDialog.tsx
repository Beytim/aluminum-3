import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/data/sampleData";

const categories = ['Windows', 'Doors', 'Curtain Walls', 'Handrails', 'Louvers', 'Partitions', 'Sheet', 'Plate', 'Bar/Rod', 'Tube/Pipe', 'Angle', 'Channel', 'Beam', 'Profile', 'Coil', 'Custom'] as const;
const productTypes = ['Raw Material', 'Fabricated', 'System', 'Custom'] as const;
const alloys = ['6061', '6063', '7075', '2024', '5052', '5083', '6060', '6082', 'Other'];
const tempers = ['T6', 'T5', 'T4', 'T651', 'O', 'H14', 'H32', 'Other'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (product: Product) => void;
}

export function EditProductDialog({ open, onOpenChange, product, onSave }: Props) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', nameAm: '', category: '', subcategory: '', productType: 'Fabricated',
    profile: '', glass: '', colors: '', laborHrs: '', materialCost: '', sellingPrice: '',
    alloyType: '', temper: '', currentStock: '', minStock: '', maxStock: '',
    warehouseLocation: '', notes: '',
    profileCost: '', glassCost: '', hardwareCost: '', accessoriesCost: '',
    fabLaborCost: '', installLaborCost: '', overheadPercent: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name, nameAm: product.nameAm, category: product.category,
        subcategory: product.subcategory || '', productType: product.productType || 'Fabricated',
        profile: product.profile, glass: product.glass,
        colors: product.colors.join(', '), laborHrs: String(product.laborHrs || ''),
        materialCost: String(product.materialCost), sellingPrice: String(product.sellingPrice),
        alloyType: product.alloyType || '', temper: product.temper || '',
        currentStock: String(product.currentStock || ''), minStock: String(product.minStock || ''),
        maxStock: String(product.maxStock || ''), warehouseLocation: product.warehouseLocation || '',
        notes: product.notes || '',
        profileCost: String(product.profileCost || ''), glassCost: String(product.glassCost || ''),
        hardwareCost: String(product.hardwareCost || ''), accessoriesCost: String(product.accessoriesCost || ''),
        fabLaborCost: String(product.fabLaborCost || ''), installLaborCost: String(product.installLaborCost || ''),
        overheadPercent: String(product.overheadPercent || ''),
      });
      setErrors({});
    }
  }, [product]);

  const totalCost = () => {
    const sub = (Number(form.profileCost) || 0) + (Number(form.glassCost) || 0) + (Number(form.hardwareCost) || 0) + (Number(form.accessoriesCost) || 0) + (Number(form.fabLaborCost) || 0) + (Number(form.installLaborCost) || 0);
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
    const tc = totalCost();
    const updated: Product = {
      ...product,
      name: form.name.trim(), nameAm: form.nameAm.trim(),
      category: form.category as Product['category'], subcategory: form.subcategory.trim(),
      productType: form.productType as Product['productType'],
      profile: form.profile.trim(), glass: form.glass.trim(),
      colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
      laborHrs: Number(form.laborHrs) || 0,
      materialCost: tc > 0 ? tc : Number(form.materialCost),
      sellingPrice: Number(form.sellingPrice),
      alloyType: form.alloyType || undefined, temper: form.temper || undefined,
      currentStock: Number(form.currentStock) || 0, minStock: Number(form.minStock) || 0,
      maxStock: Number(form.maxStock) || 0, warehouseLocation: form.warehouseLocation || undefined,
      notes: form.notes || undefined,
      profileCost: Number(form.profileCost) || undefined, glassCost: Number(form.glassCost) || undefined,
      hardwareCost: Number(form.hardwareCost) || undefined, accessoriesCost: Number(form.accessoriesCost) || undefined,
      fabLaborCost: Number(form.fabLaborCost) || undefined, installLaborCost: Number(form.installLaborCost) || undefined,
      overheadPercent: Number(form.overheadPercent) || undefined,
    };
    onSave(updated);
    toast({ title: "Updated", description: `${updated.name} saved.` });
    onOpenChange(false);
  };

  const F = (field: string, label: string, opts?: { type?: string; span?: boolean }) => (
    <div className={opts?.span ? 'sm:col-span-2' : ''}>
      <Label className="text-xs">{label}</Label>
      <Input type={opts?.type || 'text'} value={(form as any)[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} className={`h-8 text-xs ${errors[field] ? 'border-destructive' : ''}`} />
      {errors[field] && <p className="text-[10px] text-destructive mt-0.5">{errors[field]}</p>}
    </div>
  );

  const profit = Number(form.sellingPrice) - (totalCost() || Number(form.materialCost));
  const mg = Number(form.sellingPrice) > 0 ? (profit / Number(form.sellingPrice)) * 100 : 0;

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
              <div>
                <Label className="text-xs">Alloy Type</Label>
                <Select value={form.alloyType} onValueChange={v => setForm(p => ({ ...p, alloyType: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{alloys.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Temper</Label>
                <Select value={form.temper} onValueChange={v => setForm(p => ({ ...p, temper: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{tempers.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {F('profile', 'Profile')}
              {F('glass', 'Glass')}
              {F('colors', 'Colors (comma-separated)', { span: true })}
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
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Total Cost:</span><span className="font-semibold">ETB {(totalCost() || Number(form.materialCost)).toLocaleString()}</span></div>
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