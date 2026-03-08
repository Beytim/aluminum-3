import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Copy, AlertTriangle, ExternalLink } from "lucide-react";
import type { EnhancedProduct } from "@/data/enhancedProductData";
import { calcTotalCost, calcMargin } from "@/data/enhancedProductData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: EnhancedProduct | null;
  onEdit: (p: EnhancedProduct) => void;
  onClone: (p: EnhancedProduct) => void;
  language: string;
}

export default function ProductDetailsDialog({ open, onOpenChange, product: p, onEdit, onClone, language }: Props) {
  if (!p) return null;

  const cost = calcTotalCost(p);
  const profit = p.sellingPrice - cost;
  const mg = calcMargin(p);
  const isLowStock = p.currentStock <= p.minStock;

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
            <TabsTrigger value="links" className="text-xs">Links</TabsTrigger>
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
            <Row label="Alloy Type" value={p.alloyType || '—'} />
            <Row label="Temper" value={p.temper || '—'} />
            <Row label="Form" value={p.form || '—'} />
            <Row label="Width (mm)" value={p.width?.toLocaleString() || '—'} />
            <Row label="Height/Length (mm)" value={p.length?.toLocaleString() || '—'} />
            <Row label="Thickness (mm)" value={p.thickness || '—'} />
            <Row label="Diameter (mm)" value={p.diameter || '—'} />
            <Row label="Wall Thickness (mm)" value={p.wallThickness || '—'} />
            <Row label="Weight/m (kg)" value={p.weightPerMeter || '—'} />
            <Row label="Weight/pc (kg)" value={p.weightPerPiece || '—'} />
            <Row label="Labor Hours" value={p.laborHrs || '—'} />
            <Row label="Inspection Required" value={p.inspectionRequired ? 'Yes' : 'No'} />
            {p.defectRate !== undefined && <Row label="Defect Rate" value={`${p.defectRate}%`} />}
            {p.qualityStandards && p.qualityStandards.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold mb-2">Quality Standards</p>
                {p.qualityStandards.map((qs, i) => (
                  <div key={i} className="text-[10px] py-1 border-b border-border/30">
                    <span className="font-medium">{qs.parameter}</span>: {qs.specification} (±{qs.tolerance})
                  </div>
                ))}
              </div>
            )}
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
            <Row label="Profile Cost" value={`ETB ${p.profileCost.toLocaleString()}`} />
            <Row label="Glass Cost" value={`ETB ${p.glassCost.toLocaleString()}`} />
            <Row label="Hardware Cost" value={`ETB ${p.hardwareCost.toLocaleString()}`} />
            <Row label="Accessories" value={`ETB ${p.accessoriesCost.toLocaleString()}`} />
            <Row label="Fab Labor" value={`ETB ${p.fabLaborCost.toLocaleString()}`} />
            <Row label="Install Labor" value={`ETB ${p.installLaborCost.toLocaleString()}`} />
            <Row label="Overhead" value={`${p.overheadPercent}%`} />
            <div className="border-t pt-2 mt-2 space-y-1">
              <Row label="Total Cost" value={<span className="font-semibold">ETB {cost.toLocaleString()}</span>} />
              <Row label="Selling Price" value={<span className="font-semibold text-primary">ETB {p.sellingPrice.toLocaleString()}</span>} />
              <Row label="Profit" value={<span className={`font-semibold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>ETB {profit.toLocaleString()} ({mg.toFixed(1)}%)</span>} />
            </div>
            <div className="border-t pt-2 mt-2 space-y-1">
              <Row label="Current Stock" value={
                <span className="flex items-center gap-1.5">{p.currentStock}{isLowStock && <AlertTriangle className="h-3 w-3 text-destructive" />}</span>
              } />
              <Row label="Reserved" value={p.reservedStock} />
              <Row label="Available" value={p.currentStock - p.reservedStock} />
              <Row label="Min / Max" value={`${p.minStock} / ${p.maxStock}`} />
              <Row label="Location" value={p.warehouseLocation || '—'} />
              <Row label="Supplier" value={p.supplierName || '—'} />
              <Row label="Lead Time" value={p.leadTimeDays ? `${p.leadTimeDays} days` : '—'} />
            </div>
            {p.priceHistory && p.priceHistory.length > 0 && (
              <div className="border-t pt-2 mt-2">
                <p className="text-xs font-semibold mb-2">Price History</p>
                {p.priceHistory.map((ph, i) => (
                  <div key={i} className="text-[10px] py-1 border-b border-border/30 flex justify-between">
                    <span>{ph.date}</span>
                    <span>ETB {ph.sellingPrice.toLocaleString()} {ph.reason && `· ${ph.reason}`}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="links" className="mt-3 space-y-3">
            {p.linkedProjectIds && p.linkedProjectIds.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-1">Linked Projects</p>
                <div className="flex gap-1 flex-wrap">
                  {p.linkedProjectIds.map(id => (
                    <Badge key={id} variant="outline" className="text-[10px]"><ExternalLink className="h-2.5 w-2.5 mr-1" />{id}</Badge>
                  ))}
                </div>
              </div>
            )}
            {p.linkedOrderIds && p.linkedOrderIds.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-1">Linked Orders</p>
                <div className="flex gap-1 flex-wrap">
                  {p.linkedOrderIds.map(id => (
                    <Badge key={id} variant="outline" className="text-[10px]"><ExternalLink className="h-2.5 w-2.5 mr-1" />{id}</Badge>
                  ))}
                </div>
              </div>
            )}
            {p.linkedWorkOrderIds && p.linkedWorkOrderIds.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-1">Linked Work Orders</p>
                <div className="flex gap-1 flex-wrap">
                  {p.linkedWorkOrderIds.map(id => (
                    <Badge key={id} variant="outline" className="text-[10px]"><ExternalLink className="h-2.5 w-2.5 mr-1" />{id}</Badge>
                  ))}
                </div>
              </div>
            )}
            {p.linkedQuoteIds && p.linkedQuoteIds.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-1">Linked Quotes</p>
                <div className="flex gap-1 flex-wrap">
                  {p.linkedQuoteIds.map(id => (
                    <Badge key={id} variant="outline" className="text-[10px]"><ExternalLink className="h-2.5 w-2.5 mr-1" />{id}</Badge>
                  ))}
                </div>
              </div>
            )}
            {!p.linkedProjectIds?.length && !p.linkedOrderIds?.length && !p.linkedWorkOrderIds?.length && !p.linkedQuoteIds?.length && (
              <p className="text-xs text-muted-foreground text-center py-6">No cross-module links found.</p>
            )}
            <div className="border-t pt-2 mt-2 space-y-1">
              <Row label="Created" value={`${p.createdAt} by ${p.createdBy}`} />
              <Row label="Updated" value={`${p.updatedAt} by ${p.updatedBy}`} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-right">{value}</span>
    </div>
  );
}
