import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Globe, CheckCircle } from "lucide-react";
import { type EnhancedSupplier, type EnhancedPurchaseOrder, getSupplierStatusColor, getPOStatusColor, procFormatETB, procFormatCurrency } from "@/data/enhancedProcurementData";

interface Props {
  supplier: EnhancedSupplier | null;
  purchaseOrders: EnhancedPurchaseOrder[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SupplierDetailsDialog({ supplier, purchaseOrders, open, onOpenChange }: Props) {
  if (!supplier) return null;
  const supPOs = purchaseOrders.filter(po => po.supplierId === supplier.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {supplier.companyName}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getSupplierStatusColor(supplier.status)}`}>{supplier.status}</span>
            {supplier.preferred && <Badge className="text-[9px] bg-success/10 text-success border-0">Preferred</Badge>}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs">POs ({supPOs.length})</TabsTrigger>
            <TabsTrigger value="products" className="text-xs">Products</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <Card><CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Contact</p>
                <p className="text-sm font-medium">{supplier.contactPerson}</p>
                {supplier.position && <p className="text-[10px] text-muted-foreground">{supplier.position}</p>}
                <p className="text-xs mt-1">{supplier.phone}</p>
                <p className="text-xs text-primary">{supplier.email}</p>
              </CardContent></Card>
              <Card><CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground mb-1">Location</p>
                <div className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-sm font-medium">{supplier.country}</span></div>
                {supplier.city && <p className="text-xs text-muted-foreground">{supplier.city}</p>}
                {supplier.address && <p className="text-xs text-muted-foreground">{supplier.address}</p>}
              </CardContent></Card>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <Card><CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Rating</p>
                <div className="flex gap-0.5 justify-center mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(supplier.rating) ? 'text-warning fill-warning' : 'text-muted'}`} />)}</div>
              </CardContent></Card>
              <Card><CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Total Orders</p>
                <p className="text-lg font-bold">{supplier.performance.totalOrders}</p>
              </CardContent></Card>
              <Card><CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Total Spent</p>
                <p className="text-sm font-bold">{procFormatETB(supplier.performance.totalSpent)}</p>
              </CardContent></Card>
              <Card><CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Lead Time</p>
                <p className="text-lg font-bold">{supplier.averageLeadTime}d</p>
              </CardContent></Card>
            </div>
            <div className="flex flex-wrap gap-1">
              {supplier.certifications.map(c => <Badge key={c} variant="outline" className="text-[10px]"><CheckCircle className="h-3 w-3 mr-0.5" />{c}</Badge>)}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-3">
            {supPOs.length > 0 ? (
              <div className="space-y-2">
                {supPOs.map(po => (
                  <div key={po.id} className="flex items-center justify-between p-2 bg-muted/20 rounded text-xs">
                    <div>
                      <span className="font-mono font-medium">{po.poNumber}</span>
                      {po.projectName && <span className="text-muted-foreground ml-2">{po.projectName}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{po.orderDate}</span>
                      <span className="font-medium">{procFormatCurrency(po.total, po.currency)}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${getPOStatusColor(po.status)}`}>{po.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-8">No purchase orders with this supplier</p>}
          </TabsContent>

          <TabsContent value="products" className="mt-3">
            <div className="flex flex-wrap gap-2">
              {supplier.productCategories.map(c => <Badge key={c} className="text-xs">{c}</Badge>)}
            </div>
            <div className="mt-3 text-xs space-y-1">
              <p><span className="text-muted-foreground">Business Type:</span> {supplier.businessType}</p>
              <p><span className="text-muted-foreground">Currency:</span> {supplier.currency}</p>
              <p><span className="text-muted-foreground">Payment Terms:</span> {supplier.paymentTerms}</p>
              <p><span className="text-muted-foreground">Shipping:</span> {supplier.shippingTerms.join(', ')}</p>
              {supplier.minOrderQty && <p><span className="text-muted-foreground">Min Order:</span> {supplier.minOrderQty}</p>}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'On-Time Delivery', value: `${supplier.performance.onTimeDeliveryRate}%` },
                { label: 'Quality Rating', value: `${supplier.performance.qualityRating}/5` },
                { label: 'Response Time', value: `${supplier.performance.responseTime}h` },
                { label: 'Avg Order Value', value: procFormatETB(supplier.performance.averageOrderValue) },
              ].map(m => (
                <Card key={m.label}><CardContent className="p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                  <p className="text-lg font-bold">{m.value}</p>
                </CardContent></Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-3">
            <div className="space-y-2">
              {supplier.activityLog.map((log, i) => (
                <div key={i} className="flex gap-3 text-xs p-2 bg-muted/20 rounded">
                  <span className="text-muted-foreground shrink-0 w-20">{log.date}</span>
                  <span className="font-medium shrink-0">{log.userName}</span>
                  <span>{log.action}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
