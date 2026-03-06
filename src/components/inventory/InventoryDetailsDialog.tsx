import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, MapPin, DollarSign, ArrowDownToLine, ArrowUpFromLine, Edit, Truck, ShieldCheck, Scissors } from "lucide-react";
import { formatETBFull, formatETBShort, formatLocation, getStockStatusColor, getStockStatusLabel, getQualityStatusColor, type EnhancedInventoryItem, type StockMovement, type StockReservation } from "@/data/enhancedInventoryData";

interface Props {
  item: EnhancedInventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movements: StockMovement[];
  reservations: StockReservation[];
  language: 'en' | 'am';
  onEdit: (item: EnhancedInventoryItem) => void;
}

export default function InventoryDetailsDialog({ item, open, onOpenChange, movements, reservations, language, onEdit }: Props) {
  if (!item) return null;

  const itemMovements = movements.filter(m => m.inventoryItemId === item.id);
  const itemReservations = reservations.filter(r => r.inventoryItemId === item.id && r.status === 'active');
  const stockPct = item.maximum > 0 ? Math.min((item.stock / item.maximum) * 100, 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                {language === 'am' ? item.productNameAm : item.productName}
                {item.isRemnant && <Badge variant="outline" className="text-[10px] border-chart-3/30 text-chart-3">Remnant</Badge>}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {item.itemCode} · {item.productCode} · {item.category}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStockStatusColor(item)}>{getStockStatusLabel(item)}</Badge>
              <Badge className={getQualityStatusColor(item.qualityStatus)}>{item.qualityStatus}</Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="movements">Movements</TabsTrigger>
            <TabsTrigger value="reservations">Reserved</TabsTrigger>
            <TabsTrigger value="specs">Specs</TabsTrigger>
            <TabsTrigger value="supplier">Supplier</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-3">
            {/* Stock Summary */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold">Stock Levels</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Current Stock</span>
                      <span className="font-bold">{item.stock} {item.primaryUnit}</span>
                    </div>
                    <Progress value={stockPct} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div><span className="text-muted-foreground">Reserved:</span> <span className="font-medium">{item.reserved}</span></div>
                      <div><span className="text-muted-foreground">Available:</span> <span className="font-bold text-success">{item.available}</span></div>
                      <div><span className="text-muted-foreground">Min:</span> <span>{item.minimum}</span></div>
                      <div><span className="text-muted-foreground">Max:</span> <span>{item.maximum}</span></div>
                      <div><span className="text-muted-foreground">Reorder At:</span> <span>{item.reorderPoint}</span></div>
                      <div><span className="text-muted-foreground">Reorder Qty:</span> <span>{item.reorderQuantity}</span></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-success" />
                    <span className="text-xs font-semibold">Valuation</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Unit Cost</span><span className="font-medium">{formatETBFull(item.unitCost)}/{item.primaryUnit}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Avg Cost</span><span>{formatETBFull(item.averageCost)}</span></div>
                    {item.lastPurchasePrice && <div className="flex justify-between"><span className="text-muted-foreground">Last Purchase</span><span>{formatETBFull(item.lastPurchasePrice)}</span></div>}
                    {item.sellingPrice && <div className="flex justify-between"><span className="text-muted-foreground">Selling Price</span><span>{formatETBFull(item.sellingPrice)}</span></div>}
                    <div className="border-t border-border pt-2 flex justify-between"><span className="font-semibold">Total Value</span><span className="font-bold text-primary">{formatETBFull(item.totalValue)}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Location */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-chart-4" />
                  <span className="text-xs font-semibold">Location</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div><span className="text-[10px] text-muted-foreground block">Warehouse</span><span className="font-medium">{item.warehouse}</span></div>
                  <div><span className="text-[10px] text-muted-foreground block">Zone</span><span className="font-medium">{item.zone}</span></div>
                  <div><span className="text-[10px] text-muted-foreground block">Rack</span><span className="font-medium">{item.rack}</span></div>
                  <div><span className="text-[10px] text-muted-foreground block">Shelf</span><span className="font-medium">{item.shelf}</span></div>
                  <div><span className="text-[10px] text-muted-foreground block">Bin</span><span className="font-medium">{item.bin}</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-success border-success/30"><ArrowDownToLine className="h-3.5 w-3.5 mr-1" />Receive</Button>
              <Button size="sm" variant="outline" className="text-warning border-warning/30"><ArrowUpFromLine className="h-3.5 w-3.5 mr-1" />Issue</Button>
              <Button size="sm" variant="outline" onClick={() => { onOpenChange(false); onEdit(item); }}><Edit className="h-3.5 w-3.5 mr-1" />Edit</Button>
            </div>

            {item.notes && <div className="p-2 bg-muted rounded text-xs text-muted-foreground">{item.notes}</div>}
          </TabsContent>

          <TabsContent value="movements" className="mt-3">
            {itemMovements.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No movements recorded</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs text-right">Qty</TableHead>
                    <TableHead className="text-xs">Reference</TableHead>
                    <TableHead className="text-xs">User</TableHead>
                    <TableHead className="text-xs text-right">Balance</TableHead>
                    <TableHead className="text-xs">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemMovements.sort((a, b) => b.date.localeCompare(a.date)).map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="text-xs">{new Date(m.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={m.type === 'receipt' ? 'default' : m.type === 'issue' ? 'secondary' : 'outline'} className="text-[10px]">
                          {m.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-xs text-right font-semibold ${m.quantity > 0 ? 'text-success' : 'text-destructive'}`}>
                        {m.quantity > 0 ? '+' : ''}{m.quantity} {m.unit}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {m.sourceNumber || m.sourceType}
                        {m.projectName && <span className="block text-[10px]">{m.projectName}</span>}
                      </TableCell>
                      <TableCell className="text-xs">{m.userName}</TableCell>
                      <TableCell className="text-xs text-right">{m.newStock}</TableCell>
                      <TableCell className="text-[10px] text-muted-foreground max-w-[120px] truncate">{m.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="reservations" className="mt-3">
            {itemReservations.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No active reservations</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Reservation</TableHead>
                    <TableHead className="text-xs">For</TableHead>
                    <TableHead className="text-xs">Customer</TableHead>
                    <TableHead className="text-xs text-right">Qty</TableHead>
                    <TableHead className="text-xs">Reserved</TableHead>
                    <TableHead className="text-xs">Expires</TableHead>
                    <TableHead className="text-xs">By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemReservations.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs font-mono">{r.reservationNumber}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className="text-[10px]">{r.reservedForType}</Badge>
                        <span className="ml-1 text-muted-foreground">{r.reservedForNumber}</span>
                      </TableCell>
                      <TableCell className="text-xs">{r.customerName || '-'}</TableCell>
                      <TableCell className="text-xs text-right font-semibold">{r.quantity} {r.unit}</TableCell>
                      <TableCell className="text-xs">{new Date(r.reservedDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs">{r.expiresDate ? new Date(r.expiresDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell className="text-xs">{r.reservedByName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="specs" className="mt-3">
            <div className="grid grid-cols-2 gap-3">
              {item.alloyType && <div className="p-2 bg-muted rounded"><span className="text-[10px] text-muted-foreground block">Alloy</span><span className="text-xs font-medium">{item.alloyType}</span></div>}
              {item.temper && <div className="p-2 bg-muted rounded"><span className="text-[10px] text-muted-foreground block">Temper</span><span className="text-xs font-medium">{item.temper}</span></div>}
              {item.profile && <div className="p-2 bg-muted rounded"><span className="text-[10px] text-muted-foreground block">Profile</span><span className="text-xs font-medium">{item.profile}</span></div>}
              {item.glass && <div className="p-2 bg-muted rounded"><span className="text-[10px] text-muted-foreground block">Glass</span><span className="text-xs font-medium">{item.glass}</span></div>}
              {item.color && <div className="p-2 bg-muted rounded"><span className="text-[10px] text-muted-foreground block">Color</span><span className="text-xs font-medium">{item.color}</span></div>}
              {item.length && <div className="p-2 bg-muted rounded"><span className="text-[10px] text-muted-foreground block">Length</span><span className="text-xs font-medium">{item.length}mm</span></div>}
              {item.width && <div className="p-2 bg-muted rounded"><span className="text-[10px] text-muted-foreground block">Width</span><span className="text-xs font-medium">{item.width}mm</span></div>}
              {item.thickness && <div className="p-2 bg-muted rounded"><span className="text-[10px] text-muted-foreground block">Thickness</span><span className="text-xs font-medium">{item.thickness}mm</span></div>}
              {item.diameter && <div className="p-2 bg-muted rounded"><span className="text-[10px] text-muted-foreground block">Diameter</span><span className="text-xs font-medium">{item.diameter}mm</span></div>}
            </div>
            {item.isRemnant && (
              <Card className="mt-3 border-chart-3/30">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Scissors className="h-4 w-4 text-chart-3" />
                    <span className="text-xs font-semibold">Remnant Details</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {item.parentItemId && <div><span className="text-muted-foreground">Parent:</span> {item.parentItemId}</div>}
                    {item.originalLength && <div><span className="text-muted-foreground">Original:</span> {item.originalLength}mm</div>}
                    {item.remainingLength && <div><span className="text-muted-foreground">Remaining:</span> {item.remainingLength}mm</div>}
                    <div><span className="text-muted-foreground">Reusable:</span> {item.isReusable ? 'Yes' : 'No'}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="supplier" className="mt-3">
            <div className="space-y-3">
              {item.supplierName ? (
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold">Supplier Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{item.supplierName}</span></div>
                      {item.leadTimeDays && <div><span className="text-muted-foreground">Lead Time:</span> <span>{item.leadTimeDays} days</span></div>}
                      {item.moq && <div><span className="text-muted-foreground">MOQ:</span> <span>{item.moq}</span></div>}
                      {item.supplierSku && <div><span className="text-muted-foreground">SKU:</span> <span>{item.supplierSku}</span></div>}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">No supplier linked</p>
              )}
              {item.batchNumber && (
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-4 w-4 text-success" />
                      <span className="text-xs font-semibold">Batch & Quality</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Batch:</span> <span className="font-mono">{item.batchNumber}</span></div>
                      <div><span className="text-muted-foreground">Received:</span> <span>{item.receivedDate}</span></div>
                      <div><span className="text-muted-foreground">Age:</span> <span>{item.age} days</span></div>
                      <div><span className="text-muted-foreground">Quality:</span> <Badge className={`text-[9px] ${getQualityStatusColor(item.qualityStatus)}`}>{item.qualityStatus}</Badge></div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
