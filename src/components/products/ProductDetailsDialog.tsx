import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Copy, AlertTriangle, ExternalLink, Plus, Trash2, Save, Loader2 } from "lucide-react";
import type { Product, ProductBOM } from "@/hooks/useProducts";
import { calcTotalCost, calcMargin, useProductBOM, useProductPriceHistory, useSaveBOM } from "@/hooks/useProducts";
import { useInventory } from "@/hooks/useInventory";
import { useToast } from "@/hooks/use-toast";

const componentTypes = ['Profile', 'Hardware', 'Glass', 'Accessory', 'Other'] as const;

interface BOMRow {
  component_type: string;
  name: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  total: number;
  inventory_item_id: string | null;
  sort_order: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onEdit: (p: Product) => void;
  onClone: (p: Product) => void;
  language: string;
}

export default function ProductDetailsDialog({ open, onOpenChange, product: p, onEdit, onClone, language }: Props) {
  const { data: bom = [] } = useProductBOM(p?.id ?? null);
  const { data: priceHistory = [] } = useProductPriceHistory(p?.id ?? null);
  const { inventory } = useInventory();
  const saveBOM = useSaveBOM();
  const { toast } = useToast();

  const [editingBOM, setEditingBOM] = useState(false);
  const [bomRows, setBomRows] = useState<BOMRow[]>([]);

  const startEditBOM = () => {
    setBomRows(bom.map(b => ({
      component_type: b.component_type,
      name: b.name,
      quantity: b.quantity,
      unit: b.unit,
      unit_cost: b.unit_cost,
      total: b.total,
      inventory_item_id: b.inventory_item_id,
      sort_order: b.sort_order,
    })));
    setEditingBOM(true);
  };

  const addBOMRow = () => {
    setBomRows(prev => [...prev, {
      component_type: 'Profile',
      name: '',
      quantity: 0,
      unit: 'm',
      unit_cost: 0,
      total: 0,
      inventory_item_id: null,
      sort_order: prev.length,
    }]);
  };

  const updateBOMRow = (idx: number, field: keyof BOMRow, value: any) => {
    setBomRows(prev => prev.map((row, i) => {
      if (i !== idx) return row;
      const updated = { ...row, [field]: value };
      if (field === 'quantity' || field === 'unit_cost') {
        updated.total = Number(updated.quantity) * Number(updated.unit_cost);
      }
      if (field === 'inventory_item_id' && value) {
        const inv = inventory.find(item => item.id === value);
        if (inv) {
          updated.name = inv.productName;
          updated.unit_cost = inv.unitCost;
          updated.total = Number(updated.quantity) * inv.unitCost;
        }
      }
      return updated;
    }));
  };

  const removeBOMRow = (idx: number) => {
    setBomRows(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveBOM = async () => {
    if (!p) return;
    const valid = bomRows.filter(r => r.name.trim());
    await saveBOM.mutateAsync({ productId: p.id, bom: valid });
    setEditingBOM(false);
    toast({ title: "BOM Saved", description: `${valid.length} components saved.` });
  };

  if (!p) return null;

  const cost = calcTotalCost(p);
  const profit = p.selling_price - cost;
  const mg = calcMargin(p);
  const isLowStock = p.current_stock <= p.min_stock;

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-right">{value}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setEditingBOM(false); onOpenChange(o); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <DialogTitle className="text-base">{language === 'am' ? p.name_am : p.name}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">{p.code}</p>
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { onOpenChange(false); onEdit(p); }}>
                <Pencil className="h-3 w-3 mr-1" />Edit
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { onOpenChange(false); onClone(p); }}>
                <Copy className="h-3 w-3 mr-1" />Clone
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
            <TabsTrigger value="specs" className="text-xs">Specs</TabsTrigger>
            <TabsTrigger value="bom" className="text-xs">BOM ({bom.length})</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-3 space-y-1">
            <Row label="Code" value={p.code} />
            <Row label="Type" value={<Badge variant="secondary" className="text-[10px]">{p.product_type}</Badge>} />
            <Row label="Category" value={p.category} />
            <Row label="Subcategory" value={p.subcategory || '—'} />
            <Row label="Name (EN)" value={p.name} />
            <Row label="ስም (AM)" value={p.name_am} />
            <Row label="Profile" value={p.profile || '—'} />
            <Row label="Glass" value={p.glass || '—'} />
            <Row label="Colors" value={p.colors.length > 0 ? p.colors.join(', ') : '—'} />
            <Row label="Version" value={p.version || '1.0'} />
            <Row label="Status" value={
              <Badge variant={p.status === 'Active' ? 'outline' : 'secondary'}
                className={`text-[10px] ${p.status === 'Active' ? 'text-success border-success/30' : ''}`}>
                {p.status}
              </Badge>
            } />
            {p.tags && p.tags.length > 0 && (
              <Row label="Tags" value={
                <div className="flex gap-1 flex-wrap justify-end">
                  {p.tags.map(t => <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>)}
                </div>
              } />
            )}
            {p.certifications && p.certifications.length > 0 && (
              <Row label="Certifications" value={p.certifications.join(', ')} />
            )}
            {p.installation_instructions && (
              <Row label="Installation" value={<a href={p.installation_instructions} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">View PDF <ExternalLink className="h-3 w-3" /></a>} />
            )}
            {p.images && p.images.length > 0 && (
              <Row label="Images" value={<a href={p.images[0]} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">View ({p.images.length}) <ExternalLink className="h-3 w-3" /></a>} />
            )}
            {p.alternative_products && p.alternative_products.length > 0 && (
              <Row label="Alternatives" value={p.alternative_products.join(', ')} />
            )}
          </TabsContent>

          <TabsContent value="specs" className="mt-3 space-y-1">
            <Row label="Alloy Type" value={p.alloy_type || '—'} />
            <Row label="Temper" value={p.temper || '—'} />
            <Row label="Form" value={p.form || '—'} />
            <Row label="Width (mm)" value={p.width?.toLocaleString() || '—'} />
            <Row label="Height/Length (mm)" value={p.length?.toLocaleString() || '—'} />
            <Row label="Thickness (mm)" value={p.thickness || '—'} />
            <Row label="Diameter (mm)" value={p.diameter || '—'} />
            <Row label="Wall Thickness (mm)" value={p.wall_thickness || '—'} />
            <Row label="Weight/m (kg)" value={p.weight_per_meter || '—'} />
            <Row label="Weight/pc (kg)" value={p.weight_per_piece || '—'} />
            <Row label="Labor Hours" value={p.labor_hrs || '—'} />
            <Row label="Inspection Required" value={p.inspection_required ? 'Yes' : 'No'} />
            {p.defect_rate !== null && <Row label="Defect Rate" value={`${p.defect_rate}%`} />}
          </TabsContent>

          <TabsContent value="bom" className="mt-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold">Bill of Materials</p>
              {!editingBOM ? (
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={startEditBOM}>
                  <Pencil className="h-3 w-3 mr-1" />Edit BOM
                </Button>
              ) : (
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEditingBOM(false)}>Cancel</Button>
                  <Button size="sm" className="h-7 text-xs" onClick={handleSaveBOM} disabled={saveBOM.isPending}>
                    {saveBOM.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                    Save BOM
                  </Button>
                </div>
              )}
            </div>

            {editingBOM ? (
              <div className="space-y-2">
                {bomRows.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-1.5 items-end border rounded-md p-2 bg-muted/30">
                    <div className="col-span-2">
                      <label className="text-[10px] text-muted-foreground">Type</label>
                      <Select value={row.component_type} onValueChange={v => updateBOMRow(idx, 'component_type', v)}>
                        <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{componentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] text-muted-foreground">Inventory Item</label>
                      <Select value={row.inventory_item_id || '__none__'} onValueChange={v => updateBOMRow(idx, 'inventory_item_id', v === '__none__' ? null : v)}>
                        <SelectTrigger className="h-7 text-[11px]"><SelectValue placeholder="Manual" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">— Manual entry —</SelectItem>
                          {inventory.filter(i => i.status === 'active').map(i => (
                            <SelectItem key={i.id} value={i.id}>{i.itemCode} - {i.productName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-muted-foreground">Name</label>
                      <Input className="h-7 text-[11px]" value={row.name} onChange={e => updateBOMRow(idx, 'name', e.target.value)} />
                    </div>
                    <div className="col-span-1">
                      <label className="text-[10px] text-muted-foreground">Qty</label>
                      <Input type="number" className="h-7 text-[11px]" value={row.quantity} onChange={e => updateBOMRow(idx, 'quantity', Number(e.target.value))} />
                    </div>
                    <div className="col-span-1">
                      <label className="text-[10px] text-muted-foreground">Unit</label>
                      <Input className="h-7 text-[11px]" value={row.unit} onChange={e => updateBOMRow(idx, 'unit', e.target.value)} />
                    </div>
                    <div className="col-span-1">
                      <label className="text-[10px] text-muted-foreground">Cost</label>
                      <Input type="number" className="h-7 text-[11px]" value={row.unit_cost} onChange={e => updateBOMRow(idx, 'unit_cost', Number(e.target.value))} />
                    </div>
                    <div className="col-span-1">
                      <label className="text-[10px] text-muted-foreground">Total</label>
                      <p className="h-7 flex items-center text-[11px] font-medium">{row.total.toLocaleString()}</p>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeBOMRow(idx)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full h-8 text-xs" onClick={addBOMRow}>
                  <Plus className="h-3 w-3 mr-1" />Add Component
                </Button>
                <div className="text-right text-xs font-semibold pt-1">
                  BOM Total: ETB {bomRows.reduce((s, r) => s + r.total, 0).toLocaleString()}
                </div>
              </div>
            ) : bom.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Component</TableHead>
                      <TableHead className="text-xs text-right">Qty</TableHead>
                      <TableHead className="text-xs">Unit</TableHead>
                      <TableHead className="text-xs text-right">Cost</TableHead>
                      <TableHead className="text-xs text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bom.map(b => (
                      <TableRow key={b.id}>
                        <TableCell className="text-xs"><Badge variant="secondary" className="text-[10px]">{b.component_type}</Badge></TableCell>
                        <TableCell className="text-xs">{b.name}</TableCell>
                        <TableCell className="text-xs text-right">{b.quantity}</TableCell>
                        <TableCell className="text-xs">{b.unit}</TableCell>
                        <TableCell className="text-xs text-right">{b.unit_cost.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-right font-medium">{b.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="text-right text-xs font-semibold pt-2">BOM Total: ETB {bom.reduce((s, b) => s + b.total, 0).toLocaleString()}</div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-muted-foreground mb-2">No BOM defined for this product.</p>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={startEditBOM}>
                  <Plus className="h-3 w-3 mr-1" />Create BOM
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pricing" className="mt-3 space-y-1">
            <Row label="Profile Cost" value={`ETB ${p.profile_cost.toLocaleString()}`} />
            <Row label="Glass Cost" value={`ETB ${p.glass_cost.toLocaleString()}`} />
            <Row label="Hardware Cost" value={`ETB ${p.hardware_cost.toLocaleString()}`} />
            <Row label="Accessories" value={`ETB ${p.accessories_cost.toLocaleString()}`} />
            <Row label="Fab Labor" value={`ETB ${p.fab_labor_cost.toLocaleString()}`} />
            <Row label="Install Labor" value={`ETB ${p.install_labor_cost.toLocaleString()}`} />
            <Row label="Overhead" value={`${p.overhead_percent}%`} />
            <div className="border-t pt-2 mt-2 space-y-1">
              <Row label="Total Cost" value={<span className="font-semibold">ETB {cost.toLocaleString()}</span>} />
              <Row label="Selling Price" value={<span className="font-semibold text-primary">ETB {p.selling_price.toLocaleString()}</span>} />
              <Row label="Profit" value={<span className={`font-semibold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>ETB {profit.toLocaleString()} ({mg.toFixed(1)}%)</span>} />
            </div>
            <div className="border-t pt-2 mt-2 space-y-1">
              <Row label="Current Stock" value={
                <span className="flex items-center gap-1.5">{p.current_stock}{isLowStock && <AlertTriangle className="h-3 w-3 text-destructive" />}</span>
              } />
              <Row label="Reserved" value={p.reserved_stock} />
              <Row label="Available" value={p.current_stock - p.reserved_stock} />
              <Row label="Min / Max" value={`${p.min_stock} / ${p.max_stock}`} />
              <Row label="Location" value={p.warehouse_location || '—'} />
              <Row label="Supplier" value={p.supplier_name || '—'} />
              <Row label="Lead Time" value={p.lead_time_days ? `${p.lead_time_days} days` : '—'} />
            </div>
            {priceHistory.length > 0 && (
              <div className="border-t pt-2 mt-2">
                <p className="text-xs font-semibold mb-2">Price History</p>
                {priceHistory.map((ph) => (
                  <div key={ph.id} className="text-[10px] py-1 border-b border-border/30 flex justify-between">
                    <span>{new Date(ph.created_at).toLocaleDateString()}</span>
                    <span>ETB {ph.selling_price.toLocaleString()} {ph.reason && `· ${ph.reason}`}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
