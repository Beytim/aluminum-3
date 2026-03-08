import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Plus, Trash2, Eye, Search, Loader2, Globe, CheckCircle, Pencil } from "lucide-react";
import {
  useSuppliers, useAddSupplier, useUpdateSupplier, useDeleteSupplier,
  calculateSupplierStats, type Supplier,
} from "@/hooks/useSuppliers";

const countries = ['China', 'UAE', 'Turkey', 'Ethiopia', 'Germany', 'Italy', 'India', 'USA', 'UK', 'Other'];
const categories = ['Profiles', 'Sheets', 'Glass', 'Hardware', 'Sealants', 'Accessories', 'Tools', 'Bars', 'Tubes'];
const certs = ['ISO 9001', 'ISO 14001', 'CE', 'ASTM B221', 'EN 12150', 'DIN EN ISO 14001'];
const businessTypes = ['Manufacturer', 'Distributor', 'Agent', 'Trader', 'Importer'];
const currencies = ['ETB', 'USD', 'EUR', 'CNY', 'AED', 'TRY', 'GBP'];
const paymentTermsList = ['COD', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'LC', 'TT Advance', 'TT Partial'];

export default function Suppliers() {
  const { data: suppliers = [], isLoading } = useSuppliers();
  const addSupplier = useAddSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [tab, setTab] = useState("basic");

  const stats = useMemo(() => calculateSupplierStats(suppliers), [suppliers]);

  const filtered = useMemo(() => {
    return suppliers.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !search || s.company_name.toLowerCase().includes(q) || s.contact_person.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) || s.supplier_code.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [suppliers, search, statusFilter]);

  // ─── Add form state ───
  const emptyForm = {
    companyName: '', companyNameAm: '', tradingName: '', businessType: 'Manufacturer',
    contactPerson: '', position: '', phone: '', phoneSecondary: '', email: '', website: '',
    country: 'Ethiopia', city: '', address: '', taxId: '',
    paymentTerms: 'Net 30', currency: 'ETB',
    bankName: '', bankAccount: '', swiftCode: '',
    averageLeadTime: '30', minOrderQty: '', preferred: false, approved: false,
    notes: '', selectedCategories: [] as string[], selectedCerts: [] as string[],
  };
  const [form, setForm] = useState(emptyForm);

  const resetForm = () => { setForm(emptyForm); setTab("basic"); };

  const handleAdd = async () => {
    if (!form.companyName.trim()) return;
    const code = `SUP-${String(suppliers.length + 1).padStart(4, '0')}`;
    await addSupplier.mutateAsync({
      supplier_code: code,
      company_name: form.companyName.trim(),
      company_name_am: form.companyNameAm.trim(),
      trading_name: form.tradingName || null,
      business_type: form.businessType as any,
      contact_person: form.contactPerson.trim(),
      position: form.position || null,
      phone: form.phone.trim(),
      phone_secondary: form.phoneSecondary || null,
      email: form.email.trim(),
      website: form.website || null,
      country: form.country,
      city: form.city || null,
      address: form.address || null,
      tax_id: form.taxId || null,
      payment_terms: form.paymentTerms as any,
      currency: form.currency as any,
      bank_name: form.bankName || null,
      bank_account: form.bankAccount || null,
      swift_code: form.swiftCode || null,
      credit_limit: 0,
      credit_used: 0,
      product_categories: form.selectedCategories,
      certifications: form.selectedCerts,
      rating: 3,
      on_time_delivery_rate: 0,
      quality_rating: 0,
      response_time_hrs: 0,
      total_orders: 0,
      total_spent: 0,
      average_order_value: 0,
      last_order_date: null,
      average_lead_time: Number(form.averageLeadTime) || 30,
      min_order_qty: Number(form.minOrderQty) || null,
      shipping_terms: ['FOB'],
      preferred: form.preferred,
      approved: form.approved,
      status: 'Active' as any,
      notes: form.notes || null,
      created_by: null,
      updated_by: null,
    });
    resetForm();
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => deleteSupplier.mutate(id);

  const statusColor = (s: string) => {
    switch (s) {
      case 'Active': return 'bg-success/10 text-success';
      case 'Inactive': return 'bg-muted text-muted-foreground';
      case 'Blacklisted': return 'bg-destructive/10 text-destructive';
      case 'Pending': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Suppliers</h1>
          <p className="text-sm text-muted-foreground">{suppliers.length} suppliers · {stats.active} active · {stats.preferred} preferred</p>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setDialogOpen(true); }}><Plus className="h-3.5 w-3.5 mr-1.5" />Add Supplier</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card><CardContent className="p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Total</p>
          <p className="text-xl font-bold">{stats.total}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Active</p>
          <p className="text-xl font-bold text-success">{stats.active}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Preferred</p>
          <p className="text-xl font-bold text-primary">{stats.preferred}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Avg Rating</p>
          <p className="text-xl font-bold">{stats.avgRating.toFixed(1)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Avg Lead Time</p>
          <p className="text-xl font-bold">{Math.round(stats.avgLeadTime)}d</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Blacklisted">Blacklisted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="shadow-card">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Code</TableHead>
                <TableHead className="text-xs">Company</TableHead>
                <TableHead className="text-xs">Country</TableHead>
                <TableHead className="text-xs">Contact</TableHead>
                <TableHead className="text-xs">Rating</TableHead>
                <TableHead className="text-xs">Lead Time</TableHead>
                <TableHead className="text-xs">Categories</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="text-xs font-mono">{s.supplier_code}</TableCell>
                  <TableCell className="text-xs">
                    <div>
                      <span className="font-medium">{s.company_name}</span>
                      {s.preferred && <Badge className="ml-1 text-[9px] bg-success/10 text-success border-0">Preferred</Badge>}
                    </div>
                  </TableCell>
                  <TableCell><div className="flex items-center gap-1 text-xs"><Globe className="h-3 w-3 text-muted-foreground" />{s.country}</div></TableCell>
                  <TableCell className="text-xs">{s.contact_person}</TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.round(s.rating) ? 'text-warning fill-warning' : 'text-muted'}`} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{s.average_lead_time}d</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-0.5 max-w-[120px]">
                      {(s.product_categories || []).slice(0, 2).map(c => <Badge key={c} variant="outline" className="text-[9px]">{c}</Badge>)}
                      {(s.product_categories || []).length > 2 && <span className="text-[9px] text-muted-foreground">+{s.product_categories.length - 2}</span>}
                    </div>
                  </TableCell>
                  <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(s.status)}`}>{s.status}</span></TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewSupplier(s)}><Eye className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(s.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No suppliers found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Supplier Dialog */}
      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) resetForm(); setDialogOpen(v); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Supplier</DialogTitle></DialogHeader>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="basic" className="text-xs">Basic Info</TabsTrigger>
              <TabsTrigger value="contact" className="text-xs">Contact</TabsTrigger>
              <TabsTrigger value="products" className="text-xs">Products</TabsTrigger>
              <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Company Name *</Label><Input className="h-9 text-xs" value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} /></div>
                <div><Label className="text-xs">Company Name (AM)</Label><Input className="h-9 text-xs" value={form.companyNameAm} onChange={e => setForm(p => ({ ...p, companyNameAm: e.target.value }))} /></div>
                <div><Label className="text-xs">Trading Name</Label><Input className="h-9 text-xs" value={form.tradingName} onChange={e => setForm(p => ({ ...p, tradingName: e.target.value }))} /></div>
                <div>
                  <Label className="text-xs">Business Type</Label>
                  <Select value={form.businessType} onValueChange={v => setForm(p => ({ ...p, businessType: v }))}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{businessTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Country</Label>
                  <Select value={form.country} onValueChange={v => setForm(p => ({ ...p, country: v }))}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">City</Label><Input className="h-9 text-xs" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} /></div>
                <div><Label className="text-xs">Tax ID</Label><Input className="h-9 text-xs" value={form.taxId} onChange={e => setForm(p => ({ ...p, taxId: e.target.value }))} /></div>
                <div><Label className="text-xs">Address</Label><Input className="h-9 text-xs" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} /></div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Contact Person</Label><Input className="h-9 text-xs" value={form.contactPerson} onChange={e => setForm(p => ({ ...p, contactPerson: e.target.value }))} /></div>
                <div><Label className="text-xs">Position</Label><Input className="h-9 text-xs" value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} /></div>
                <div><Label className="text-xs">Phone</Label><Input className="h-9 text-xs" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
                <div><Label className="text-xs">Phone 2</Label><Input className="h-9 text-xs" value={form.phoneSecondary} onChange={e => setForm(p => ({ ...p, phoneSecondary: e.target.value }))} /></div>
                <div><Label className="text-xs">Email</Label><Input className="h-9 text-xs" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
                <div><Label className="text-xs">Website</Label><Input className="h-9 text-xs" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} /></div>
                <div>
                  <Label className="text-xs">Currency</Label>
                  <Select value={form.currency} onValueChange={v => setForm(p => ({ ...p, currency: v }))}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Payment Terms</Label>
                  <Select value={form.paymentTerms} onValueChange={v => setForm(p => ({ ...p, paymentTerms: v }))}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{paymentTermsList.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Bank Name</Label><Input className="h-9 text-xs" value={form.bankName} onChange={e => setForm(p => ({ ...p, bankName: e.target.value }))} /></div>
                <div><Label className="text-xs">SWIFT Code</Label><Input className="h-9 text-xs" value={form.swiftCode} onChange={e => setForm(p => ({ ...p, swiftCode: e.target.value }))} /></div>
                <div><Label className="text-xs">Lead Time (days)</Label><Input type="number" className="h-9 text-xs" value={form.averageLeadTime} onChange={e => setForm(p => ({ ...p, averageLeadTime: e.target.value }))} /></div>
                <div><Label className="text-xs">Min Order Qty</Label><Input type="number" className="h-9 text-xs" value={form.minOrderQty} onChange={e => setForm(p => ({ ...p, minOrderQty: e.target.value }))} /></div>
              </div>
            </TabsContent>

            <TabsContent value="products" className="space-y-3 mt-3">
              <div>
                <Label className="text-xs mb-2 block">Product Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <label key={c} className="flex items-center gap-1.5 text-xs">
                      <Checkbox checked={form.selectedCategories.includes(c)} onCheckedChange={checked => setForm(prev => ({ ...prev, selectedCategories: checked ? [...prev.selectedCategories, c] : prev.selectedCategories.filter(x => x !== c) }))} />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs mb-2 block">Certifications</Label>
                <div className="flex flex-wrap gap-2">
                  {certs.map(c => (
                    <label key={c} className="flex items-center gap-1.5 text-xs">
                      <Checkbox checked={form.selectedCerts.includes(c)} onCheckedChange={checked => setForm(prev => ({ ...prev, selectedCerts: checked ? [...prev.selectedCerts, c] : prev.selectedCerts.filter(x => x !== c) }))} />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs">
                <Checkbox checked={form.preferred} onCheckedChange={checked => setForm(p => ({ ...p, preferred: !!checked }))} />
                Mark as Preferred Supplier
              </label>
            </TabsContent>

            <TabsContent value="notes" className="mt-3">
              <Label className="text-xs">Notes</Label>
              <Textarea className="text-xs" rows={4} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-4">
            <Button variant="outline" size="sm" onClick={() => { resetForm(); setDialogOpen(false); }}>Cancel</Button>
            <Button size="sm" onClick={handleAdd} disabled={addSupplier.isPending || !form.companyName.trim()}>
              {addSupplier.isPending ? "Adding..." : "Add Supplier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Supplier Dialog */}
      {viewSupplier && (
        <Dialog open={!!viewSupplier} onOpenChange={() => setViewSupplier(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {viewSupplier.company_name}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(viewSupplier.status)}`}>{viewSupplier.status}</span>
                {viewSupplier.preferred && <Badge className="text-[9px] bg-success/10 text-success border-0">Preferred</Badge>}
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="products" className="text-xs">Products</TabsTrigger>
                <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-3 mt-3">
                <div className="grid grid-cols-2 gap-3">
                  <Card><CardContent className="p-3">
                    <p className="text-[10px] text-muted-foreground mb-1">Contact</p>
                    <p className="text-sm font-medium">{viewSupplier.contact_person}</p>
                    {viewSupplier.position && <p className="text-[10px] text-muted-foreground">{viewSupplier.position}</p>}
                    <p className="text-xs mt-1">{viewSupplier.phone}</p>
                    <p className="text-xs text-primary">{viewSupplier.email}</p>
                  </CardContent></Card>
                  <Card><CardContent className="p-3">
                    <p className="text-[10px] text-muted-foreground mb-1">Location</p>
                    <div className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-sm font-medium">{viewSupplier.country}</span></div>
                    {viewSupplier.city && <p className="text-xs text-muted-foreground">{viewSupplier.city}</p>}
                    {viewSupplier.address && <p className="text-xs text-muted-foreground">{viewSupplier.address}</p>}
                  </CardContent></Card>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <Card><CardContent className="p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Rating</p>
                    <div className="flex gap-0.5 justify-center mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(viewSupplier.rating) ? 'text-warning fill-warning' : 'text-muted'}`} />)}</div>
                  </CardContent></Card>
                  <Card><CardContent className="p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Total Orders</p>
                    <p className="text-lg font-bold">{viewSupplier.total_orders}</p>
                  </CardContent></Card>
                  <Card><CardContent className="p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Total Spent</p>
                    <p className="text-sm font-bold">ETB {viewSupplier.total_spent.toLocaleString()}</p>
                  </CardContent></Card>
                  <Card><CardContent className="p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">Lead Time</p>
                    <p className="text-lg font-bold">{viewSupplier.average_lead_time}d</p>
                  </CardContent></Card>
                </div>
                {(viewSupplier.certifications || []).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {viewSupplier.certifications.map(c => <Badge key={c} variant="outline" className="text-[10px]"><CheckCircle className="h-3 w-3 mr-0.5" />{c}</Badge>)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="products" className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {(viewSupplier.product_categories || []).map(c => <Badge key={c} className="text-xs">{c}</Badge>)}
                </div>
                <div className="mt-3 text-xs space-y-1">
                  <p><span className="text-muted-foreground">Business Type:</span> {viewSupplier.business_type}</p>
                  <p><span className="text-muted-foreground">Currency:</span> {viewSupplier.currency}</p>
                  <p><span className="text-muted-foreground">Payment Terms:</span> {viewSupplier.payment_terms}</p>
                  {viewSupplier.min_order_qty && <p><span className="text-muted-foreground">Min Order:</span> {viewSupplier.min_order_qty}</p>}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="mt-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'On-Time Delivery', value: `${viewSupplier.on_time_delivery_rate}%` },
                    { label: 'Quality Rating', value: `${viewSupplier.quality_rating}/5` },
                    { label: 'Response Time', value: `${viewSupplier.response_time_hrs}h` },
                    { label: 'Avg Order Value', value: `ETB ${viewSupplier.average_order_value.toLocaleString()}` },
                  ].map(m => (
                    <Card key={m.label}><CardContent className="p-3 text-center">
                      <p className="text-[10px] text-muted-foreground">{m.label}</p>
                      <p className="text-lg font-bold">{m.value}</p>
                    </CardContent></Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
