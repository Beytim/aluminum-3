import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Copy, AlertTriangle, ExternalLink } from "lucide-react";
import type { Product, ProductBOM, ProductPriceHistory } from "@/hooks/useProducts";
import { calcTotalCost, calcMargin, useProductBOM, useProductPriceHistory } from "@/hooks/useProducts";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <TabsTrigger value="bom" className="text-xs">BOM</TabsTrigger>
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
          </TabsContent>

          <TabsContent value="specs" className="mt-3 space-y-1">
            <Row label="Alloy Type" value={p.alloy_type || '—'} />
            <Row label="Temper" value={p.temper || '—'} />
            <Row label="Form" value={p.form || '—'} />
            <Row label="Surface Finish" value={p.surface_finish || '—'} />
            <Row label="Thermal Break" value={p.has_thermal_break ? 'Yes' : 'No'} />
            <Row label="U-Value" value={p.u_value || '—'} />
            <Row label="Wind Load Rating" value={p.wind_load_rating || '—'} />
            <Row label="STC Rating" value={p.stc_rating || '—'} />
            <Row label="Fire Rating" value={p.fire_rating || '—'} />
            <Row label="Warranty (Months)" value={p.warranty_months || '—'} />
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
            {bom.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Component</TableHead>
                      <TableHead className="text-xs text-right">Qty</TableHead>
                      <TableHead className="text-xs text-right">Waste</TableHead>
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
                        <TableCell className="text-xs text-right">{b.wastage_percent ? `${b.wastage_percent}%` : '—'}</TableCell>
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
              <p className="text-xs text-muted-foreground text-center py-6">No BOM defined for this product.</p>
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
