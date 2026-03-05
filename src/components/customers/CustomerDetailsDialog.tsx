import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, Phone, Mail, MapPin, Globe, CreditCard, Pencil, Package, FileText, ShoppingCart, DollarSign, Activity } from "lucide-react";
import { CustomerHealth } from "./CustomerHealth";
import { CustomerTimeline } from "./CustomerTimeline";
import type { EnhancedCustomer } from "@/data/customerTypes";
import { formatETB, calculateCreditMetrics, getRelativeTime, getHealthColor, getHealthBgColor } from "@/lib/customerHelpers";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: EnhancedCustomer | null;
  onEdit: (c: EnhancedCustomer) => void;
  language: 'en' | 'am';
}

export function CustomerDetailsDialog({ open, onOpenChange, customer, onEdit, language }: Props) {
  if (!customer) return null;

  const credit = calculateCreditMetrics(customer);
  const c = customer;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="p-4 pb-2 border-b">
          <div className="flex items-start gap-3">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${getHealthBgColor(c.healthStatus)} ${getHealthColor(c.healthStatus)}`}>
              {c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold">{language === 'am' ? c.nameAm : c.name}</h2>
                <Badge variant="secondary" className="text-[10px]">{c.code}</Badge>
                <Badge variant={c.status === 'Active' ? 'default' : 'outline'} className="text-[10px]">{c.status}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</span>
                {c.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</span>}
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.address}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit(c)}>
              <Pencil className="h-3 w-3 mr-1" /> Edit
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {c.tags.map(tag => <Badge key={tag} variant="outline" className="text-[9px] h-4">{tag}</Badge>)}
          </div>
        </div>

        <Tabs defaultValue="overview" className="p-4 pt-2">
          <TabsList className="w-full flex-wrap h-auto gap-0.5 bg-transparent justify-start">
            <TabsTrigger value="overview" className="text-xs h-7">Overview</TabsTrigger>
            <TabsTrigger value="products" className="text-xs h-7">Products</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs h-7">Activity</TabsTrigger>
            <TabsTrigger value="credit" className="text-xs h-7">Credit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Quick Stats */}
              <Card>
                <CardContent className="p-3 space-y-2">
                  <h3 className="text-xs font-semibold">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Projects', value: c.projects, icon: Building2 },
                      { label: 'Total Value', value: formatETB(c.totalValue), icon: DollarSign },
                      { label: 'Outstanding', value: formatETB(c.outstanding), icon: CreditCard },
                      { label: 'Since', value: c.customerSince, icon: Activity },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                        <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] text-muted-foreground">{s.label}</p>
                          <p className="text-xs font-medium">{s.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Health */}
              <Card>
                <CardContent className="p-3">
                  <h3 className="text-xs font-semibold mb-2">Customer Health</h3>
                  <CustomerHealth customer={c} />
                </CardContent>
              </Card>
            </div>

            {/* Business Info */}
            <Card>
              <CardContent className="p-3">
                <h3 className="text-xs font-semibold mb-2">Business Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Type:</span> {c.type}</div>
                  <div><span className="text-muted-foreground">Contact:</span> {c.contact}</div>
                  <div><span className="text-muted-foreground">Payment:</span> {c.paymentTerms || 'N/A'}</div>
                  {c.taxId && <div><span className="text-muted-foreground">Tax ID:</span> {c.taxId}</div>}
                  <div><span className="text-muted-foreground">Preferred:</span> {c.preferredContact}</div>
                  <div><span className="text-muted-foreground">Language:</span> {c.language}</div>
                  {c.website && <div><span className="text-muted-foreground">Website:</span> {c.website}</div>}
                  {c.source && <div><span className="text-muted-foreground">Source:</span> {c.source}</div>}
                  {c.location && <div><span className="text-muted-foreground">Sub-city:</span> {c.location.subCity}</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-3 mt-3">
            <Card>
              <CardContent className="p-3">
                <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" /> Frequently Ordered Products
                </h3>
                {c.frequentProducts && c.frequentProducts.length > 0 ? (
                  <div className="space-y-2">
                    {c.frequentProducts.map(p => (
                      <div key={p.productId} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <div>
                          <p className="text-xs font-medium">{p.productName}</p>
                          <p className="text-[10px] text-muted-foreground">{p.category} · {p.count} orders · Avg qty: {p.averageQuantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">{formatETB(p.totalValue)}</p>
                          <p className="text-[10px] text-muted-foreground">Last: {getRelativeTime(p.lastOrdered)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No product history yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-3 mt-3">
            <Card>
              <CardContent className="p-3">
                <h3 className="text-xs font-semibold mb-3">Activity Timeline</h3>
                <CustomerTimeline activities={c.activityLog || []} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credit" className="space-y-3 mt-3">
            <Card>
              <CardContent className="p-3 space-y-3">
                <h3 className="text-xs font-semibold">Credit Overview</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-md bg-muted/50 text-center">
                    <p className="text-[10px] text-muted-foreground">Limit</p>
                    <p className="text-xs font-bold">{formatETB(c.creditLimit || 0)}</p>
                  </div>
                  <div className="p-2 rounded-md bg-muted/50 text-center">
                    <p className="text-[10px] text-muted-foreground">Used</p>
                    <p className="text-xs font-bold text-warning">{formatETB(credit.used)}</p>
                  </div>
                  <div className="p-2 rounded-md bg-muted/50 text-center">
                    <p className="text-[10px] text-muted-foreground">Available</p>
                    <p className="text-xs font-bold text-success">{formatETB(credit.available)}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-muted-foreground">Credit Utilization</span>
                    <span className="font-medium">{credit.utilization}%</span>
                  </div>
                  <Progress value={credit.utilization} className="h-2" />
                </div>

                {c.paymentHistory && (
                  <div>
                    <h4 className="text-xs font-semibold mt-2 mb-1">Payment History</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-success/10 rounded-md">
                        <p className="text-[10px] text-muted-foreground">On-time</p>
                        <p className="font-bold text-success">{c.paymentHistory.onTime}</p>
                      </div>
                      <div className="p-2 bg-warning/10 rounded-md">
                        <p className="text-[10px] text-muted-foreground">Late</p>
                        <p className="font-bold text-warning">{c.paymentHistory.late}</p>
                      </div>
                      {c.paymentHistory.lastPaymentDate && (
                        <div className="col-span-2 text-[10px] text-muted-foreground">
                          Last payment: {formatETB(c.paymentHistory.lastPaymentAmount || 0)} on {c.paymentHistory.lastPaymentDate}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
