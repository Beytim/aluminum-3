import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Globe, Phone, Mail, Building2, CheckCircle, Clock, Pencil, ExternalLink } from "lucide-react";
import type { Supplier } from "@/hooks/useSuppliers";

interface Props {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (s: Supplier) => void;
}

const statusColor = (s: string) => {
  switch (s) {
    case 'Active': return 'bg-success/10 text-success';
    case 'Inactive': return 'bg-muted text-muted-foreground';
    case 'Blacklisted': return 'bg-destructive/10 text-destructive';
    case 'Pending': return 'bg-warning/10 text-warning';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default function SupplierDetailsDialog({ supplier: s, open, onOpenChange, onEdit }: Props) {
  if (!s) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                {s.company_name}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(s.status)}`}>{s.status}</span>
                {s.preferred && <Badge className="text-[9px] bg-success/10 text-success border-0">Preferred</Badge>}
              </DialogTitle>
              {s.company_name_am && <p className="text-xs text-muted-foreground mt-0.5">{s.company_name_am}</p>}
              <p className="text-[10px] font-mono text-muted-foreground">{s.supplier_code} · {s.business_type}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => { onOpenChange(false); onEdit(s); }}>
              <Pencil className="h-3 w-3 mr-1" />Edit
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="products" className="text-xs">Products</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
            <TabsTrigger value="financial" className="text-xs">Financial</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <Card><CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase">Contact</p>
                <p className="text-sm font-medium">{s.contact_person}</p>
                {s.position && <p className="text-[10px] text-muted-foreground">{s.position}</p>}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs"><Phone className="h-3 w-3 text-muted-foreground" />{s.phone}</div>
                  {s.phone_secondary && <div className="flex items-center gap-1.5 text-xs"><Phone className="h-3 w-3 text-muted-foreground" />{s.phone_secondary}</div>}
                  <div className="flex items-center gap-1.5 text-xs"><Mail className="h-3 w-3 text-muted-foreground" /><span className="text-primary">{s.email}</span></div>
                  {s.website && <div className="flex items-center gap-1.5 text-xs"><ExternalLink className="h-3 w-3 text-muted-foreground" /><a href={s.website} target="_blank" rel="noopener" className="text-primary hover:underline">{s.website}</a></div>}
                </div>
              </CardContent></Card>
              <Card><CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase">Location</p>
                <div className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">{s.country}</span></div>
                {s.city && <p className="text-xs text-muted-foreground mt-1">{s.city}</p>}
                {s.address && <p className="text-xs text-muted-foreground">{s.address}</p>}
                {s.tax_id && <p className="text-xs mt-2"><span className="text-muted-foreground">Tax ID:</span> {s.tax_id}</p>}
              </CardContent></Card>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Rating', content: <div className="flex gap-0.5 justify-center mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(s.rating) ? 'text-warning fill-warning' : 'text-muted'}`} />)}</div> },
                { label: 'Total Orders', content: <p className="text-lg font-bold">{s.total_orders}</p> },
                { label: 'Total Spent', content: <p className="text-sm font-bold">ETB {s.total_spent.toLocaleString()}</p> },
                { label: 'Lead Time', content: <p className="text-lg font-bold">{s.average_lead_time}d</p> },
              ].map(m => (
                <Card key={m.label}><CardContent className="p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                  {m.content}
                </CardContent></Card>
              ))}
            </div>
            {(s.certifications || []).length > 0 && (
              <div>
                <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase">Certifications</p>
                <div className="flex flex-wrap gap-1">
                  {s.certifications.map(c => <Badge key={c} variant="outline" className="text-[10px]"><CheckCircle className="h-3 w-3 mr-0.5" />{c}</Badge>)}
                </div>
              </div>
            )}
            {s.notes && (
              <div>
                <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase">Notes</p>
                <p className="text-xs bg-muted/30 rounded p-2">{s.notes}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="products" className="mt-3 space-y-3">
            <div>
              <p className="text-[10px] text-muted-foreground mb-2 font-medium uppercase">Product Categories</p>
              <div className="flex flex-wrap gap-2">
                {(s.product_categories || []).length > 0
                  ? s.product_categories.map(c => <Badge key={c} className="text-xs">{c}</Badge>)
                  : <p className="text-xs text-muted-foreground">No categories assigned</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-muted-foreground">Business Type:</span> {s.business_type}</div>
              <div><span className="text-muted-foreground">Currency:</span> {s.currency}</div>
              <div><span className="text-muted-foreground">Payment Terms:</span> {s.payment_terms}</div>
              {s.min_order_qty && <div><span className="text-muted-foreground">Min Order Qty:</span> {s.min_order_qty}</div>}
              <div><span className="text-muted-foreground">Shipping Terms:</span> {(s.shipping_terms || []).join(', ') || '—'}</div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'On-Time Delivery', value: `${s.on_time_delivery_rate}%`, color: s.on_time_delivery_rate >= 90 ? 'text-success' : s.on_time_delivery_rate >= 70 ? 'text-warning' : 'text-destructive' },
                { label: 'Quality Rating', value: `${s.quality_rating}/5`, color: s.quality_rating >= 4 ? 'text-success' : 'text-warning' },
                { label: 'Response Time', value: `${s.response_time_hrs}h`, color: s.response_time_hrs <= 24 ? 'text-success' : 'text-warning' },
                { label: 'Avg Order Value', value: `ETB ${s.average_order_value.toLocaleString()}` },
                { label: 'Average Lead Time', value: `${s.average_lead_time} days` },
                { label: 'Last Order', value: s.last_order_date || 'No orders yet' },
              ].map(m => (
                <Card key={m.label}><CardContent className="p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                  <p className={`text-lg font-bold ${'color' in m ? m.color : ''}`}>{m.value}</p>
                </CardContent></Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="financial" className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Card><CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase">Credit</p>
                <p className="text-sm"><span className="text-muted-foreground">Limit:</span> ETB {s.credit_limit.toLocaleString()}</p>
                <p className="text-sm"><span className="text-muted-foreground">Used:</span> ETB {s.credit_used.toLocaleString()}</p>
                <p className="text-sm font-medium mt-1"><span className="text-muted-foreground">Available:</span> <span className={s.credit_limit - s.credit_used > 0 ? 'text-success' : 'text-destructive'}>ETB {(s.credit_limit - s.credit_used).toLocaleString()}</span></p>
              </CardContent></Card>
              <Card><CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase">Banking</p>
                <p className="text-sm"><span className="text-muted-foreground">Bank:</span> {s.bank_name || '—'}</p>
                <p className="text-sm"><span className="text-muted-foreground">Account:</span> {s.bank_account || '—'}</p>
                <p className="text-sm"><span className="text-muted-foreground">SWIFT:</span> {s.swift_code || '—'}</p>
              </CardContent></Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
