import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n } from "@/lib/i18n";
import { Pencil, Copy, AlertTriangle } from "lucide-react";
import type { Product } from "@/data/sampleData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onEdit: (p: Product) => void;
  onClone: (p: Product) => void;
}

function calcTotalCost(p: Product) {
  const sub = (p.profileCost || 0) + (p.glassCost || 0) + (p.hardwareCost || 0) + (p.accessoriesCost || 0) + (p.fabLaborCost || 0) + (p.installLaborCost || 0);
  return sub + (sub * ((p.overheadPercent || 0) / 100));
}

function calcMargin(p: Product) {
  const tc = calcTotalCost(p);
  const cost = tc > 0 ? tc : p.materialCost;
  return p.sellingPrice > 0 ? (((p.sellingPrice - cost) / p.sellingPrice) * 100) : 0;
}

export function ProductDetailsDialog({ open, onOpenChange, product: p, onEdit, onClone }: Props) {
  const { language } = useI18n();
  if (!p) return null;

  const tc = calcTotalCost(p);
  const cost = tc > 0 ? tc : p.materialCost;
  const profit = p.sellingPrice - cost;
  const mg = calcMargin(p);
  const isLowStock = (p.currentStock ?? 0) <= (p.minStock ?? 0);
  const area = (p.width && p.length) ? ((p.width * p.length) / 1e6) : 0;

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
              <DialogTitle className="text-base">{language === 'am' ? p.nameAm : p.name}</DialogTitle>
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
          <TabsList className="grid w-full grid-cols-5 h-8">
            <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
            <TabsTrigger value="specs" className="text-xs">Specs</TabsTrigger>
            <TabsTrigger value="bom" className="text-xs">BOM</TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs">Pricing</TabsTrigger>
            <TabsTrigger value="stock" className="text-xs">Stock</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-3 space-y-1">
            <Row label="Code" value={p.code} />
            <Row label="Type" value={<Badge variant="secondary" className="text-[10px]">{p.productType}</Badge>} />
            <Row label="Category" value={p.category} />
            <Row label="Subcategory" value={p.subcategory || '—'} />
            <Row label="Name (EN)" value={p.name} />
            <Row label="ስም (AM)" value={p.nameAm} />
            <Row label="Profile" value={p.profile || '—'} />
            <Row label="Glass" value={p.glass || '—'} />
            <Row label="Colors" value={p.colors.length > 0 ? p.colors.join(', ') : '—'} />
            <Row label="Version" value={p.version || '1.0'} />
            <Row label="Effective Date" value={p.effectiveDate || '—'} />
            <Row label="Status" value={<Badge variant={p.status === 'Active' ? 'outline' : 'secondary'} className={`text-[10px] ${p.status === 'Active' ? 'text-success border-success/30' : ''}`}>{p.status}</Badge>} />
          </TabsContent>

          <TabsContent value="specs" className="mt-3 space-y-1">
            <Row label="Alloy Type" value={p.alloyType || '—'} />
            <Row label="Temper" value={p.temper || '—'} />
            <Row label="Form" value={p.form || '—'} />
            <Row label="Width (mm)" value={p.width?.toLocaleString() || '—'} />
            <Row label="Height/Length (mm)" value={p.length?.toLocaleString() || '—'} />
            <Row label="Thickness (mm)" value={p.thickness || '—'} />
            <Row label="Diameter (mm)" value={p.diameter || '—'} />
            <Row label="Wall Thickness (mm)" value={p.wallThickness || '—'} />
            {area > 0 && <Row label="Area (m²)" value={area.toFixed(2)} />}
            <Row label="Weight/m (kg)" value={p.weightPerMeter || '—'} />
            <Row label="Weight/pc (kg)" value={p.weightPerPiece || '—'} />
            <Row label="Labor Hours" value={p.laborHrs || '—'} />
          </TabsContent>

          <TabsContent value="bom" className="mt-3">
            {p.bom && p.bom.length > 0 ? (
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
                    {p.bom.map(b => (
                      <TableRow key={b.id}>
                        <TableCell className="text-xs"><Badge variant="secondary" className="text-[10px]">{b.type}</Badge></TableCell>
                        <TableCell className="text-xs">{b.name}</TableCell>
                        <TableCell className="text-xs text-right">{b.quantity}</TableCell>
                        <TableCell className="text-xs">{b.unit}</TableCell>
                        <TableCell className="text-xs text-right">{b.unitCost.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-right font-medium">{b.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="text-right text-xs font-semibold pt-2">BOM Total: ETB {p.bom.reduce((s, b) => s + b.total, 0).toLocaleString()}</div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">No BOM defined for this product.</p>
            )}
          </TabsContent>

          <TabsContent value="pricing" className="mt-3 space-y-1">
            <Row label="Profile Cost" value={`ETB ${(p.profileCost || 0).toLocaleString()}`} />
            <Row label="Glass Cost" value={`ETB ${(p.glassCost || 0).toLocaleString()}`} />
            <Row label="Hardware Cost" value={`ETB ${(p.hardwareCost || 0).toLocaleString()}`} />
            <Row label="Accessories" value={`ETB ${(p.accessoriesCost || 0).toLocaleString()}`} />
            <Row label="Fab Labor" value={`ETB ${(p.fabLaborCost || 0).toLocaleString()}`} />
            <Row label="Install Labor" value={`ETB ${(p.installLaborCost || 0).toLocaleString()}`} />
            <Row label="Overhead" value={`${p.overheadPercent || 0}%`} />
            <div className="border-t pt-2 mt-2 space-y-1">
              <Row label="Total Cost" value={<span className="font-semibold">ETB {cost.toLocaleString()}</span>} />
              <Row label="Selling Price" value={<span className="font-semibold text-primary">ETB {p.sellingPrice.toLocaleString()}</span>} />
              <Row label="Profit" value={<span className={`font-semibold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>ETB {profit.toLocaleString()} ({mg.toFixed(1)}%)</span>} />
            </div>
          </TabsContent>

          <TabsContent value="stock" className="mt-3 space-y-1">
            <Row label="Current Stock" value={
              <span className="flex items-center gap-1.5">
                {p.currentStock ?? 0}
                {isLowStock && <AlertTriangle className="h-3 w-3 text-destructive" />}
              </span>
            } />
            <Row label="Min Stock" value={p.minStock ?? 0} />
            <Row label="Max Stock" value={p.maxStock ?? 0} />
            <Row label="Location" value={p.warehouseLocation || '—'} />
            <Row label="Supplier" value={p.supplierId || '—'} />
            <Row label="Lead Time" value={p.leadTimeDays ? `${p.leadTimeDays} days` : '—'} />
            <Row label="MOQ" value={p.moq || '—'} />
            <Row label="Batch #" value={p.batchNumber || '—'} />
            <Row label="Mill Certificate" value={p.millCertificate ? 'Yes' : 'No'} />
            <Row label="Date Received" value={p.dateReceived || '—'} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}