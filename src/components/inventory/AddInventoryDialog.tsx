import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { EnhancedInventoryItem } from "@/data/enhancedInventoryData";
import { useProducts } from "@/hooks/useProducts";
import { useSuppliers } from "@/hooks/useSuppliers";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: EnhancedInventoryItem) => void;
  existingCount: number;
}

export default function AddInventoryDialog({ open, onOpenChange, onAdd, existingCount }: Props) {
  const { data: products = [] } = useProducts();
  const { data: suppliers = [] } = useSuppliers();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [form, setForm] = useState({
    name: '', nameAm: '', category: 'Profile' as string, productType: 'RawMaterial' as string,
    primaryUnit: 'pcs', stock: '', minimum: '10', maximum: '100', reorderPoint: '15', reorderQuantity: '20',
    warehouse: 'Main', zone: 'A', rack: 'R01', shelf: 'S01', bin: 'B01',
    unitCost: '', sellingPrice: '', alloyType: '', temper: '', color: '',
    supplierId: '', supplierName: '', leadTimeDays: '45', batchNumber: '',
    isRemnant: false, notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      setForm(prev => ({
        ...prev,
        name: product.name, nameAm: product.name_am || '',
        category: product.category === 'Windows' || product.category === 'Doors' || product.category === 'Curtain Walls' || product.category === 'Handrails' || product.category === 'Louvers' || product.category === 'Partitions' ? 'Finished Product' : product.category === 'Sheet' || product.category === 'Tube/Pipe' || product.category === 'Profile' ? 'Profile' : product.category,
        productType: product.product_type === 'Raw Material' ? 'RawMaterial' : product.product_type,
        unitCost: String(product.material_cost || 0), sellingPrice: String(product.selling_price || 0),
        alloyType: product.alloy_type || '', temper: product.temper || '',
        stock: String(product.current_stock || 0),
      }));
    }
  };

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.stock || Number(form.stock) < 0) e.stock = 'Invalid';
    if (!form.unitCost || Number(form.unitCost) <= 0) e.unitCost = 'Required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const stock = Number(form.stock);
    const reserved = 0;
    const id = `INV-${String(existingCount + 1).padStart(3, '0')}`;
    const product = products.find(p => p.id === selectedProductId);

    const item: EnhancedInventoryItem = {
      id, itemCode: id,
      productId: selectedProductId || '', productCode: product?.code || id,
      productName: form.name.trim(), productNameAm: form.nameAm.trim() || form.name.trim(),
      category: form.category as any, productType: form.productType as any,
      alloyType: form.alloyType || undefined, temper: form.temper || undefined, color: form.color || undefined,
      primaryUnit: form.primaryUnit,
      stock, reserved, available: stock - reserved,
      minimum: Number(form.minimum) || 10, maximum: Number(form.maximum) || 100,
      reorderPoint: Number(form.reorderPoint) || 15, reorderQuantity: Number(form.reorderQuantity) || 20,
      warehouse: form.warehouse, zone: form.zone, rack: form.rack, shelf: form.shelf, bin: form.bin,
      isRemnant: form.isRemnant, receivedDate: new Date().toISOString().split('T')[0], age: 0,
      supplierId: form.supplierId || undefined, supplierName: form.supplierName || undefined,
      leadTimeDays: Number(form.leadTimeDays) || undefined,
      batchNumber: form.batchNumber || undefined,
      unitCost: Number(form.unitCost), averageCost: Number(form.unitCost),
      sellingPrice: Number(form.sellingPrice) || undefined,
      totalValue: stock * Number(form.unitCost),
      qualityStatus: 'approved', status: 'active',
      notes: form.notes || undefined,
      createdAt: new Date().toISOString(), createdBy: 'EMP-001',
      updatedAt: new Date().toISOString(), updatedBy: 'EMP-001',
    };
    onAdd(item);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedProductId('');
    setForm({ name: '', nameAm: '', category: 'Profile', productType: 'RawMaterial', primaryUnit: 'pcs', stock: '', minimum: '10', maximum: '100', reorderPoint: '15', reorderQuantity: '20', warehouse: 'Main', zone: 'A', rack: 'R01', shelf: 'S01', bin: 'B01', unitCost: '', sellingPrice: '', alloyType: '', temper: '', color: '', supplierId: '', supplierName: '', leadTimeDays: '45', batchNumber: '', isRemnant: false, notes: '' });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) resetForm(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="cost">Cost</TabsTrigger>
            <TabsTrigger value="supplier">Supplier</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3 mt-3">
            <div>
              <Label className="text-xs">Link to Product</Label>
              <Select value={selectedProductId} onValueChange={handleProductSelect}>
                <SelectTrigger><SelectValue placeholder="Select product (optional)" /></SelectTrigger>
                <SelectContent>
                  {products.map(p => <SelectItem key={p.id} value={p.id}>{p.code} - {p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={errors.name ? 'border-destructive' : ''} /></div>
              <div><Label className="text-xs">ስም (AM)</Label><Input value={form.nameAm} onChange={e => setForm(p => ({ ...p, nameAm: e.target.value }))} /></div>
              <div><Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Finished Product', 'Profile', 'Glass', 'Hardware', 'Accessory', 'Steel'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Product Type</Label>
                <Select value={form.productType} onValueChange={v => setForm(p => ({ ...p, productType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['RawMaterial', 'Fabricated', 'System', 'Custom'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Unit</Label>
                <Select value={form.primaryUnit} onValueChange={v => setForm(p => ({ ...p, primaryUnit: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['pcs', 'meter', 'sqm', 'kg', 'set', 'pair', 'box'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <Switch checked={form.isRemnant} onCheckedChange={v => setForm(p => ({ ...p, isRemnant: v }))} />
                <Label className="text-xs">Remnant Item</Label>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-xs">Alloy Type</Label><Input value={form.alloyType} onChange={e => setForm(p => ({ ...p, alloyType: e.target.value }))} placeholder="6063" /></div>
              <div><Label className="text-xs">Temper</Label><Input value={form.temper} onChange={e => setForm(p => ({ ...p, temper: e.target.value }))} placeholder="T5" /></div>
              <div><Label className="text-xs">Color</Label><Input value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} placeholder="White" /></div>
            </div>
          </TabsContent>

          <TabsContent value="stock" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Current Stock *</Label><Input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} className={errors.stock ? 'border-destructive' : ''} /></div>
              <div><Label className="text-xs">Min Stock</Label><Input type="number" value={form.minimum} onChange={e => setForm(p => ({ ...p, minimum: e.target.value }))} /></div>
              <div><Label className="text-xs">Max Stock</Label><Input type="number" value={form.maximum} onChange={e => setForm(p => ({ ...p, maximum: e.target.value }))} /></div>
              <div><Label className="text-xs">Reorder Point</Label><Input type="number" value={form.reorderPoint} onChange={e => setForm(p => ({ ...p, reorderPoint: e.target.value }))} /></div>
              <div><Label className="text-xs">Reorder Qty</Label><Input type="number" value={form.reorderQuantity} onChange={e => setForm(p => ({ ...p, reorderQuantity: e.target.value }))} /></div>
            </div>
            <h4 className="text-xs font-semibold mt-4">Location</h4>
            <div className="grid grid-cols-5 gap-2">
              <div><Label className="text-[10px]">Warehouse</Label><Input value={form.warehouse} onChange={e => setForm(p => ({ ...p, warehouse: e.target.value }))} /></div>
              <div><Label className="text-[10px]">Zone</Label><Input value={form.zone} onChange={e => setForm(p => ({ ...p, zone: e.target.value }))} /></div>
              <div><Label className="text-[10px]">Rack</Label><Input value={form.rack} onChange={e => setForm(p => ({ ...p, rack: e.target.value }))} /></div>
              <div><Label className="text-[10px]">Shelf</Label><Input value={form.shelf} onChange={e => setForm(p => ({ ...p, shelf: e.target.value }))} /></div>
              <div><Label className="text-[10px]">Bin</Label><Input value={form.bin} onChange={e => setForm(p => ({ ...p, bin: e.target.value }))} /></div>
            </div>
          </TabsContent>

          <TabsContent value="cost" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Unit Cost (ETB) *</Label><Input type="number" value={form.unitCost} onChange={e => setForm(p => ({ ...p, unitCost: e.target.value }))} className={errors.unitCost ? 'border-destructive' : ''} /></div>
              <div><Label className="text-xs">Selling Price (ETB)</Label><Input type="number" value={form.sellingPrice} onChange={e => setForm(p => ({ ...p, sellingPrice: e.target.value }))} /></div>
            </div>
            {form.stock && form.unitCost && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">Total Value: <span className="font-semibold text-foreground">ETB {(Number(form.stock) * Number(form.unitCost)).toLocaleString()}</span></p>
                {form.sellingPrice && <p className="text-xs text-muted-foreground mt-1">Potential Revenue: <span className="font-semibold text-success">ETB {(Number(form.stock) * Number(form.sellingPrice)).toLocaleString()}</span></p>}
              </div>
            )}
          </TabsContent>

          <TabsContent value="supplier" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Supplier Name</Label>
                <Select value={form.supplierId} onValueChange={v => {
                  const s = suppliers.find(sup => sup.id === v);
                  setForm(p => ({ ...p, supplierId: v, supplierName: s?.company_name || '' }));
                }}>
                  <SelectTrigger><SelectValue placeholder="Select supplier (optional)" /></SelectTrigger>
                  <SelectContent>
                    {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.company_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Lead Time (days)</Label><Input type="number" value={form.leadTimeDays} onChange={e => setForm(p => ({ ...p, leadTimeDays: e.target.value }))} /></div>
              <div><Label className="text-xs">Batch Number</Label><Input value={form.batchNumber} onChange={e => setForm(p => ({ ...p, batchNumber: e.target.value }))} /></div>
            </div>
            <div><Label className="text-xs">Notes</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} /></div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
