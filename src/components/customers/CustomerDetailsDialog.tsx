import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Building2, Phone, Mail, MapPin, CreditCard, Pencil, Package, FileText,
  DollarSign, Activity, Clock, Plus, Search, Star, CheckCircle2, Circle,
  Calendar, AlertTriangle, FolderOpen, Receipt, Briefcase, MessageSquare,
  PhoneCall, Video, FileUp, Download, ChevronDown
} from "lucide-react";
import { CustomerHealth } from "./CustomerHealth";
import { CustomerTimeline } from "./CustomerTimeline";
import type { EnhancedCustomer, CustomerActivityLog } from "@/data/customerTypes";
import { formatETB, calculateCreditMetrics, getRelativeTime, getHealthColor, getHealthBgColor } from "@/lib/customerHelpers";
import type { EnhancedProject } from "@/data/enhancedProjectData";
import { formatETBShort, formatETBFull, projectStatusColors } from "@/data/enhancedProjectData";
import type { Quote, Invoice } from "@/data/sampleData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: EnhancedCustomer | null;
  onEdit: (c: EnhancedCustomer) => void;
  language: 'en' | 'am';
  projects?: EnhancedProject[];
  quotes?: Quote[];
  invoices?: Invoice[];
}

export function CustomerDetailsDialog({ open, onOpenChange, customer, onEdit, language, projects = [], quotes = [], invoices = [] }: Props) {
  const [activityFilter, setActivityFilter] = useState('all');
  const [activitySearch, setActivitySearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: 'call' as CustomerActivityLog['type'], description: '', followUpDate: '' });

  if (!customer) return null;

  const credit = calculateCreditMetrics(customer);
  const c = customer;

  // Filter data for this customer
  const customerProjects = projects.filter(p => p.customerId === c.id);
  const customerQuotes = quotes.filter(q => q.customerId === c.id);
  const customerInvoices = invoices.filter(inv => customerProjects.some(p => p.id === inv.projectId));

  // Filter activities
  const filteredActivities = (c.activityLog || []).filter(a => {
    const matchType = activityFilter === 'all' || a.type === activityFilter;
    const matchSearch = !activitySearch || a.description.toLowerCase().includes(activitySearch.toLowerCase());
    return matchType && matchSearch;
  });

  // Filter products
  const filteredProducts = (c.frequentProducts || []).filter(p => {
    return !productSearch || p.productName.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase());
  });

  // Product categories summary
  const categoryMap: Record<string, { count: number; value: number }> = {};
  (c.frequentProducts || []).forEach(p => {
    if (!categoryMap[p.category]) categoryMap[p.category] = { count: 0, value: 0 };
    categoryMap[p.category].count += p.count;
    categoryMap[p.category].value += p.totalValue;
  });

  // Aging data (simulated from outstanding)
  const outstanding = c.outstanding;
  const aging = {
    current: Math.round(outstanding * 0.4),
    days30: Math.round(outstanding * 0.25),
    days60: Math.round(outstanding * 0.2),
    days90: Math.round(outstanding * 0.1),
    over90: Math.round(outstanding * 0.05),
  };

  const activityIcons: Record<string, typeof Clock> = {
    call: PhoneCall, email: Mail, meeting: Video, note: MessageSquare,
    quote: FileText, order: Package, project: Briefcase, payment: DollarSign,
  };

  const quoteStatusColors: Record<string, string> = {
    Pending: 'bg-warning/10 text-warning',
    Accepted: 'bg-success/10 text-success',
    Rejected: 'bg-destructive/10 text-destructive',
    Expired: 'bg-muted text-muted-foreground',
  };

  const invoiceStatusColors: Record<string, string> = {
    Paid: 'bg-success/10 text-success',
    Partial: 'bg-warning/10 text-warning',
    Overdue: 'bg-destructive/10 text-destructive',
    Pending: 'bg-info/10 text-info',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
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

          {/* Quick Actions Bar */}
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {[
              { icon: FileText, label: 'New Quote' },
              { icon: Briefcase, label: 'New Project' },
              { icon: DollarSign, label: 'Record Payment' },
              { icon: PhoneCall, label: 'Log Call' },
              { icon: Mail, label: 'Send Email' },
              { icon: FileUp, label: 'Add Document' },
            ].map(action => (
              <Button key={action.label} variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                <action.icon className="h-3 w-3" />{action.label}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="overview" className="p-4 pt-2">
          <TabsList className="w-full flex-wrap h-auto gap-0.5 bg-transparent justify-start">
            <TabsTrigger value="overview" className="text-xs h-7">Overview</TabsTrigger>
            <TabsTrigger value="products" className="text-xs h-7">Products</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs h-7">Activity</TabsTrigger>
            <TabsTrigger value="credit" className="text-xs h-7">Credit</TabsTrigger>
            <TabsTrigger value="projects" className="text-xs h-7">Projects</TabsTrigger>
            <TabsTrigger value="quotes" className="text-xs h-7">Quotes</TabsTrigger>
            <TabsTrigger value="invoices" className="text-xs h-7">Invoices</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs h-7">Documents</TabsTrigger>
          </TabsList>

          {/* ═══ OVERVIEW ═══ */}
          <TabsContent value="overview" className="space-y-3 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <Card>
                <CardContent className="p-3">
                  <h3 className="text-xs font-semibold mb-2">Customer Health</h3>
                  <CustomerHealth customer={c} />
                </CardContent>
              </Card>
            </div>
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

          {/* ═══ PRODUCTS ═══ */}
          <TabsContent value="products" className="space-y-3 mt-3">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-8 h-8 text-xs" value={productSearch} onChange={e => setProductSearch(e.target.value)} />
              </div>
            </div>

            {/* Category Summary */}
            {Object.keys(categoryMap).length > 0 && (
              <Card>
                <CardContent className="p-3">
                  <h3 className="text-xs font-semibold mb-2">Product Categories</h3>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(categoryMap).map(([cat, data]) => (
                      <div key={cat} className="p-2 rounded-md bg-primary/5 text-xs">
                        <span className="font-medium">{cat}</span>
                        <span className="text-muted-foreground ml-1">({data.count} orders · {formatETB(data.value)})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-3">
                <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" /> Purchase History
                </h3>
                {filteredProducts.length > 0 ? (
                  <div className="space-y-2">
                    {filteredProducts.map(p => (
                      <div key={p.productId} className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Star className="h-3 w-3 text-warning shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">{p.productName}</p>
                            <p className="text-[10px] text-muted-foreground">{p.category} · {p.count} orders · Avg qty: {p.averageQuantity}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
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

          {/* ═══ ACTIVITY ═══ */}
          <TabsContent value="activity" className="space-y-3 mt-3">
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[140px]">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search activities..." className="pl-8 h-8 text-xs" value={activitySearch} onChange={e => setActivitySearch(e.target.value)} />
              </div>
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {['call', 'email', 'meeting', 'note', 'quote', 'order', 'project', 'payment'].map(t => (
                    <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" className="h-8 text-xs" onClick={() => setShowAddActivity(!showAddActivity)}>
                <Plus className="h-3 w-3 mr-1" /> Add Activity
              </Button>
            </div>

            {showAddActivity && (
              <Card>
                <CardContent className="p-3 space-y-2">
                  <h3 className="text-xs font-semibold">Log Activity</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Select value={newActivity.type} onValueChange={v => setNewActivity(p => ({ ...p, type: v as CustomerActivityLog['type'] }))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['call', 'email', 'meeting', 'note'].map(t => (
                          <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Follow-up date" type="date" className="h-8 text-xs" value={newActivity.followUpDate} onChange={e => setNewActivity(p => ({ ...p, followUpDate: e.target.value }))} />
                    <Button size="sm" className="h-8 text-xs">Save</Button>
                  </div>
                  <Textarea placeholder="Description..." className="min-h-[50px] text-xs" value={newActivity.description} onChange={e => setNewActivity(p => ({ ...p, description: e.target.value }))} />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-3">
                <h3 className="text-xs font-semibold mb-3">Activity Timeline</h3>
                {filteredActivities.length > 0 ? (
                  <div className="space-y-0">
                    {filteredActivities.map((a, i) => {
                      const Icon = activityIcons[a.type] || Clock;
                      return (
                        <div key={a.id} className="flex gap-3 pb-3 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Icon className="h-3.5 w-3.5 text-primary" />
                            </div>
                            {i < filteredActivities.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[9px] h-4">{a.type}</Badge>
                              {a.followUpDate && <Badge className="text-[9px] h-4 bg-warning/10 text-warning"><Calendar className="h-2.5 w-2.5 mr-0.5" />{a.followUpDate}</Badge>}
                            </div>
                            <p className="text-xs mt-1">{a.description}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{getRelativeTime(a.date)} · {a.user}</p>
                            {a.relatedId && (
                              <Button variant="link" className="h-auto p-0 text-[10px] text-primary">
                                View {a.relatedType}: {a.relatedId}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No activities found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ CREDIT ═══ */}
          <TabsContent value="credit" className="space-y-3 mt-3">
            <Card>
              <CardContent className="p-3 space-y-3">
                <h3 className="text-xs font-semibold">Credit Summary</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Limit', value: formatETB(c.creditLimit || 0), color: '' },
                    { label: 'Used', value: formatETB(credit.used), color: 'text-warning' },
                    { label: 'Available', value: formatETB(credit.available), color: 'text-success' },
                    { label: 'Utilization', value: `${credit.utilization}%`, color: credit.utilization > 80 ? 'text-destructive' : 'text-primary' },
                  ].map(item => (
                    <div key={item.label} className="p-2 rounded-md bg-muted/50 text-center">
                      <p className="text-[10px] text-muted-foreground">{item.label}</p>
                      <p className={`text-xs font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-muted-foreground">Credit Utilization</span>
                    <span className="font-medium">{credit.utilization}%</span>
                  </div>
                  <Progress value={credit.utilization} className="h-2.5" />
                </div>
              </CardContent>
            </Card>

            {c.paymentHistory && (
              <Card>
                <CardContent className="p-3 space-y-3">
                  <h3 className="text-xs font-semibold">Payment Behavior</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-success/10 rounded-md text-center">
                      <p className="text-[10px] text-muted-foreground">On-time</p>
                      <p className="font-bold text-success text-sm">{c.paymentHistory.onTime}</p>
                      <p className="text-[9px] text-muted-foreground">{c.paymentHistory.onTime + c.paymentHistory.late > 0 ? Math.round((c.paymentHistory.onTime / (c.paymentHistory.onTime + c.paymentHistory.late)) * 100) : 0}%</p>
                    </div>
                    <div className="p-2 bg-warning/10 rounded-md text-center">
                      <p className="text-[10px] text-muted-foreground">Late</p>
                      <p className="font-bold text-warning text-sm">{c.paymentHistory.late}</p>
                      <p className="text-[9px] text-muted-foreground">{c.paymentHistory.onTime + c.paymentHistory.late > 0 ? Math.round((c.paymentHistory.late / (c.paymentHistory.onTime + c.paymentHistory.late)) * 100) : 0}%</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-md text-center">
                      <p className="text-[10px] text-muted-foreground">Avg Days Late</p>
                      <p className="font-bold text-sm">{c.paymentHistory.averageDaysLate}</p>
                      <p className="text-[9px] text-muted-foreground">days</p>
                    </div>
                  </div>
                  {c.paymentHistory.lastPaymentDate && (
                    <div className="text-[10px] text-muted-foreground pt-1 border-t">
                      Last payment: {formatETB(c.paymentHistory.lastPaymentAmount || 0)} on {c.paymentHistory.lastPaymentDate}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {outstanding > 0 && (
              <Card>
                <CardContent className="p-3 space-y-3">
                  <h3 className="text-xs font-semibold">Aging of Outstanding Invoices</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Current', value: aging.current, color: 'bg-success' },
                      { label: '1-30 days', value: aging.days30, color: 'bg-info' },
                      { label: '31-60 days', value: aging.days60, color: 'bg-warning' },
                      { label: '61-90 days', value: aging.days90, color: 'bg-chart-4' },
                      { label: '90+ days', value: aging.over90, color: 'bg-destructive' },
                    ].map(row => (
                      <div key={row.label}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className="font-medium">{formatETB(row.value)}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${row.color} rounded-full`} style={{ width: `${outstanding > 0 ? (row.value / outstanding) * 100 : 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs"><CreditCard className="h-3 w-3 mr-1" />Request Limit Increase</Button>
              <Button variant="outline" size="sm" className="text-xs"><FileText className="h-3 w-3 mr-1" />View Full Report</Button>
            </div>
          </TabsContent>

          {/* ═══ PROJECTS ═══ */}
          <TabsContent value="projects" className="space-y-3 mt-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold">Customer Projects ({customerProjects.length})</h3>
              <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />New Project</Button>
            </div>
            {customerProjects.length > 0 ? (
              <div className="space-y-2">
                {customerProjects.map(p => (
                  <Card key={p.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-muted-foreground">{p.projectNumber}</span>
                            <Badge className={`text-[9px] ${projectStatusColors[p.status]}`}>{p.status}</Badge>
                            {p.isOverdue && <AlertTriangle className="h-3 w-3 text-destructive" />}
                          </div>
                          <p className="text-xs font-medium mt-0.5">{language === 'am' ? p.nameAm : p.name}</p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-xs font-bold">{formatETBShort(p.value)}</p>
                          <p className="text-[10px] text-muted-foreground">Due: {p.dueDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={p.progress} className="h-1.5 flex-1" />
                        <span className="text-[10px] font-medium">{p.progress}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No projects yet</p>
                  <Button size="sm" variant="outline" className="mt-2 text-xs"><Plus className="h-3 w-3 mr-1" />Create First Project</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ═══ QUOTES ═══ */}
          <TabsContent value="quotes" className="space-y-3 mt-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold">Quotes ({customerQuotes.length})</h3>
              <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />New Quote</Button>
            </div>
            {customerQuotes.length > 0 ? (
              <div className="space-y-2">
                {customerQuotes.map(q => (
                  <Card key={q.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-muted-foreground">{q.id}</span>
                            <Badge className={`text-[9px] ${quoteStatusColors[q.status]}`}>{q.status}</Badge>
                          </div>
                          <p className="text-xs font-medium mt-0.5">{q.projectName}</p>
                          <p className="text-[10px] text-muted-foreground">{q.items} items · {q.date}</p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-xs font-bold">{formatETB(q.total)}</p>
                          <p className="text-[10px] text-muted-foreground">Valid: {q.validity}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No quotes yet</p>
                  <Button size="sm" variant="outline" className="mt-2 text-xs"><Plus className="h-3 w-3 mr-1" />Create First Quote</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ═══ INVOICES ═══ */}
          <TabsContent value="invoices" className="space-y-3 mt-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold">Invoices ({customerInvoices.length})</h3>
              <Button size="sm" className="h-7 text-xs"><DollarSign className="h-3 w-3 mr-1" />Record Payment</Button>
            </div>
            {customerInvoices.length > 0 ? (
              <div className="space-y-2">
                {customerInvoices.map(inv => (
                  <Card key={inv.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-muted-foreground">{inv.id}</span>
                            <Badge className={`text-[9px] ${invoiceStatusColors[inv.status]}`}>{inv.status}</Badge>
                          </div>
                          <p className="text-xs font-medium mt-0.5">{inv.customerName}</p>
                          <p className="text-[10px] text-muted-foreground">Project: {inv.projectId} · Due: {inv.dueDate}</p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-xs font-bold">{formatETB(inv.amount)}</p>
                          <p className="text-[10px] text-success">Paid: {formatETB(inv.paid)}</p>
                          {inv.balance > 0 && <p className="text-[10px] text-warning">Balance: {formatETB(inv.balance)}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Receipt className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No invoices yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ═══ DOCUMENTS ═══ */}
          <TabsContent value="documents" className="space-y-3 mt-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold">Documents</h3>
              <Button size="sm" className="h-7 text-xs"><FileUp className="h-3 w-3 mr-1" />Upload Document</Button>
            </div>
            <Card>
              <CardContent className="p-6 text-center">
                <FolderOpen className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-muted-foreground">No documents uploaded</p>
                <p className="text-xs text-muted-foreground mt-1">Upload contracts, IDs, certificates, and other documents</p>
                <Button size="sm" variant="outline" className="mt-3 text-xs"><FileUp className="h-3 w-3 mr-1" />Upload First Document</Button>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Contracts', 'IDs', 'Certificates', 'Other'].map(cat => (
                <div key={cat} className="p-2 rounded-md bg-muted/50 text-center">
                  <FolderOpen className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-[10px] font-medium">{cat}</p>
                  <p className="text-[10px] text-muted-foreground">0 files</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
