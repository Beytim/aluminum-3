import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pencil, Package, DollarSign, Clock, FileText, CheckCircle2, Circle, User, Calendar, Building2, AlertTriangle, TrendingUp } from "lucide-react";
import type { EnhancedProject } from "@/data/enhancedProjectData";
import { projectStatusColors, projectTypeColors, formatETBFull, formatETBShort, getDaysRemaining } from "@/data/enhancedProjectData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: EnhancedProject | null;
  onEdit: (p: EnhancedProject) => void;
  language: 'en' | 'am';
}

export function ProjectDetailsDialog({ open, onOpenChange, project, onEdit, language }: Props) {
  if (!project) return null;
  const p = project;
  const daysLeft = getDaysRemaining(p.dueDate);

  const milestoneList = [
    { key: 'depositPaid', label: 'Deposit Paid', done: p.milestones.depositPaid },
    { key: 'materialsOrdered', label: 'Materials Ordered', done: p.milestones.materialsOrdered },
    { key: 'materialsReceived', label: 'Materials Received', done: p.milestones.materialsReceived },
    { key: 'productionStarted', label: 'Production Started', done: p.milestones.productionStarted },
    { key: 'productionCompleted', label: 'Production Completed', done: p.milestones.productionCompleted },
    { key: 'installationStarted', label: 'Installation Started', done: p.milestones.installationStarted },
    { key: 'installationCompleted', label: 'Installation Completed', done: p.milestones.installationCompleted },
    { key: 'finalPayment', label: 'Final Payment', done: p.milestones.finalPayment },
  ];

  const productStatusColors: Record<string, string> = {
    pending: 'bg-muted text-muted-foreground',
    ordered: 'bg-info/10 text-info',
    received: 'bg-warning/10 text-warning',
    installed: 'bg-success/10 text-success',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="p-4 pb-2 border-b">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-muted-foreground">{p.projectNumber}</span>
                <Badge className={`text-[9px] ${projectTypeColors[p.type]}`}>{p.type}</Badge>
                <Badge className={`text-[10px] ${projectStatusColors[p.status]}`}>{p.status}</Badge>
                {p.isOverdue && <Badge variant="destructive" className="text-[9px]"><AlertTriangle className="h-2.5 w-2.5 mr-0.5" />Overdue</Badge>}
                {p.isAtRisk && !p.isOverdue && <Badge className="text-[9px] bg-warning/10 text-warning">At Risk</Badge>}
              </div>
              <h2 className="text-lg font-bold mt-1">{language === 'am' ? p.nameAm : p.name}</h2>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{p.customerName}</span>
                <span className="flex items-center gap-1"><User className="h-3 w-3" />PM: {p.projectManager}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due: {p.dueDate}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit(p)}>
              <Pencil className="h-3 w-3 mr-1" /> Edit
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="p-4 pt-2">
          <TabsList className="w-full flex-wrap h-auto gap-0.5 bg-transparent justify-start">
            <TabsTrigger value="overview" className="text-xs h-7">Overview</TabsTrigger>
            <TabsTrigger value="financial" className="text-xs h-7">Financial</TabsTrigger>
            <TabsTrigger value="products" className="text-xs h-7">Products</TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs h-7">Timeline</TabsTrigger>
            <TabsTrigger value="customer" className="text-xs h-7">Customer</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Value', value: formatETBShort(p.value), icon: DollarSign },
                { label: 'Deposit', value: `${formatETBShort(p.deposit)} (${p.depositPercentage}%)`, icon: TrendingUp },
                { label: 'Balance', value: formatETBShort(p.balance), icon: DollarSign },
                { label: 'Progress', value: `${p.progress}%`, icon: TrendingUp },
              ].map(s => (
                <Card key={s.label}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <s.icon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{s.label}</span>
                    </div>
                    <p className="text-sm font-bold">{s.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-3">
                <h3 className="text-xs font-semibold mb-2">Progress</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Progress value={p.progress} className="h-2 flex-1" />
                  <span className="text-sm font-bold">{p.progress}%</span>
                </div>
                <h4 className="text-xs font-semibold mb-2">Milestones</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {milestoneList.map(m => (
                    <div key={m.key} className={`flex items-center gap-1.5 p-2 rounded-md text-xs ${m.done ? 'bg-success/10 text-success' : 'bg-muted/50 text-muted-foreground'}`}>
                      {m.done ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <Circle className="h-3 w-3 shrink-0" />}
                      <span className="truncate">{m.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Dates */}
            <Card>
              <CardContent className="p-3">
                <h3 className="text-xs font-semibold mb-2">Key Dates</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Order:</span> {p.orderDate}</div>
                  {p.startDate && <div><span className="text-muted-foreground">Start:</span> {p.startDate}</div>}
                  <div><span className="text-muted-foreground">Due:</span> <span className={daysLeft < 0 ? 'text-destructive font-medium' : ''}>{p.dueDate}</span></div>
                  {p.completedDate && <div><span className="text-muted-foreground">Completed:</span> {p.completedDate}</div>}
                </div>
              </CardContent>
            </Card>

            {p.notes && (
              <Card>
                <CardContent className="p-3">
                  <h3 className="text-xs font-semibold mb-1">Notes</h3>
                  <p className="text-xs text-muted-foreground">{p.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* FINANCIAL */}
          <TabsContent value="financial" className="space-y-3 mt-3">
            <Card>
              <CardContent className="p-3 space-y-3">
                <h3 className="text-xs font-semibold">Payment Summary</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-md bg-muted/50 text-center">
                    <p className="text-[10px] text-muted-foreground">Value</p>
                    <p className="text-sm font-bold">{formatETBFull(p.value)}</p>
                  </div>
                  <div className="p-2 rounded-md bg-success/10 text-center">
                    <p className="text-[10px] text-muted-foreground">Deposit</p>
                    <p className="text-sm font-bold text-success">{formatETBFull(p.deposit)}</p>
                  </div>
                  <div className="p-2 rounded-md bg-warning/10 text-center">
                    <p className="text-[10px] text-muted-foreground">Balance</p>
                    <p className="text-sm font-bold text-warning">{formatETBFull(p.balance)}</p>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-muted-foreground">Deposit Progress</span>
                  <span className="font-medium">{p.depositPercentage}%</span>
                </div>
                <Progress value={p.depositPercentage} className="h-2" />
              </CardContent>
            </Card>

            {p.totalCost > 0 && (
              <Card>
                <CardContent className="p-3 space-y-3">
                  <h3 className="text-xs font-semibold">Cost Breakdown</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Material Cost', value: p.materialCost, pct: (p.materialCost / p.totalCost * 100) },
                      { label: 'Labor Cost', value: p.laborCost, pct: (p.laborCost / p.totalCost * 100) },
                      { label: 'Overhead', value: p.overheadCost, pct: (p.overheadCost / p.totalCost * 100) },
                    ].map(c => (
                      <div key={c.label}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-muted-foreground">{c.label}</span>
                          <span className="font-medium">{formatETBFull(c.value)} ({c.pct.toFixed(0)}%)</span>
                        </div>
                        <Progress value={c.pct} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Total Cost</span>
                      <p className="font-bold">{formatETBFull(p.totalCost)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Profit</span>
                      <p className="font-bold text-success">{formatETBFull(p.profit)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Margin</span>
                      <p className="font-bold text-primary">{p.profitMargin.toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* PRODUCTS */}
          <TabsContent value="products" className="space-y-3 mt-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold flex items-center gap-1.5"><Package className="h-3.5 w-3.5" />Project Products</h3>
                  <span className="text-[10px] text-muted-foreground">{p.products.length} items · {formatETBFull(p.products.reduce((s, pr) => s + pr.totalPrice, 0))}</span>
                </div>
                {p.products.length > 0 ? (
                  <div className="space-y-2">
                    {p.products.map(pr => (
                      <div key={pr.productId} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{pr.productName}</p>
                          <p className="text-[10px] text-muted-foreground">{pr.productId} · Qty: {pr.quantity} × {formatETBFull(pr.unitPrice)}</p>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="text-xs font-semibold">{formatETBFull(pr.totalPrice)}</p>
                          <Badge className={`text-[9px] ${productStatusColors[pr.status]}`}>{pr.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No products added yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TIMELINE */}
          <TabsContent value="timeline" className="space-y-3 mt-3">
            <Card>
              <CardContent className="p-3">
                <h3 className="text-xs font-semibold mb-3 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Project Timeline</h3>
                {p.timeline && p.timeline.length > 0 ? (
                  <div className="space-y-0">
                    {[...p.timeline].reverse().map((ev, i) => {
                      const typeIcon: Record<string, typeof Clock> = { status_change: FileText, payment: DollarSign, milestone: CheckCircle2, note: FileText };
                      const Icon = typeIcon[ev.type] || Clock;
                      return (
                        <div key={i} className="flex gap-3 pb-3 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Icon className="h-3 w-3 text-primary" />
                            </div>
                            {i < p.timeline!.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                          </div>
                          <div className="flex-1 pb-2">
                            <p className="text-xs font-medium">{ev.event}</p>
                            <p className="text-[10px] text-muted-foreground">{ev.date} · {ev.user}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No timeline events</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CUSTOMER */}
          <TabsContent value="customer" className="space-y-3 mt-3">
            <Card>
              <CardContent className="p-3">
                <h3 className="text-xs font-semibold mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Name:</span> {p.customerName}</div>
                  {p.customerContact && <div><span className="text-muted-foreground">Contact:</span> {p.customerContact}</div>}
                  {p.customerPhone && <div><span className="text-muted-foreground">Phone:</span> {p.customerPhone}</div>}
                  {p.quoteId && <div><span className="text-muted-foreground">Quote:</span> {p.quoteId}</div>}
                </div>
              </CardContent>
            </Card>

            {/* Related Module Links */}
            <Card>
              <CardContent className="p-3">
                <h3 className="text-xs font-semibold mb-2">Related Items</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {p.workOrderIds.length > 0 && <div><span className="text-muted-foreground">Work Orders:</span> {p.workOrderIds.join(', ')}</div>}
                  {p.purchaseOrderIds.length > 0 && <div><span className="text-muted-foreground">Purchase Orders:</span> {p.purchaseOrderIds.join(', ')}</div>}
                  {p.invoiceIds.length > 0 && <div><span className="text-muted-foreground">Invoices:</span> {p.invoiceIds.join(', ')}</div>}
                  {p.installationIds.length > 0 && <div><span className="text-muted-foreground">Installations:</span> {p.installationIds.join(', ')}</div>}
                  {!p.workOrderIds.length && !p.purchaseOrderIds.length && !p.invoiceIds.length && !p.installationIds.length && (
                    <p className="col-span-2 text-muted-foreground">No related items</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
