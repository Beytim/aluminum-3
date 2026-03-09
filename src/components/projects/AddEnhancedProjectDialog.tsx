import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import type { EnhancedProject, ProjectType, ProjectProduct } from "@/data/enhancedProjectData";
import type { Customer } from "@/data/sampleData";
import type { Product } from "@/data/sampleData";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (project: EnhancedProject) => void;
  customers: Customer[];
  products: Product[];
  existingCount: number;
}

const types: ProjectType[] = ['Residential', 'Commercial', 'Industrial', 'Government'];

export function AddEnhancedProjectDialog({ open, onOpenChange, onAdd, customers, products, existingCount }: Props) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', nameAm: '', customerId: '', type: '' as string, value: '', deposit: '', dueDate: '', startDate: '', notes: '', projectManager: '',
  });
  const [projectProducts, setProjectProducts] = useState<ProjectProduct[]>([]);
  const [addProductId, setAddProductId] = useState('');
  const [addProductQty, setAddProductQty] = useState('1');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.nameAm.trim()) e.nameAm = 'Required';
    if (!form.customerId) e.customerId = 'Required';
    if (!form.type) e.type = 'Required';
    if (!form.value || Number(form.value) <= 0) e.value = 'Must be > 0';
    if (!form.dueDate) e.dueDate = 'Required';
    if (Number(form.deposit) > Number(form.value)) e.deposit = 'Cannot exceed value';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddProduct = () => {
    const prod = products.find(p => p.id === addProductId);
    if (!prod) return;
    const qty = Number(addProductQty) || 1;
    if (projectProducts.some(pp => pp.productId === prod.id)) {
      setProjectProducts(prev => prev.map(pp => pp.productId === prod.id ? { ...pp, quantity: pp.quantity + qty, totalPrice: (pp.quantity + qty) * pp.unitPrice } : pp));
    } else {
      setProjectProducts(prev => [...prev, { productId: prod.id, productName: prod.name, quantity: qty, unitPrice: (prod as any).sellingPrice ?? (prod as any).selling_price ?? 0, totalPrice: qty * ((prod as any).sellingPrice ?? (prod as any).selling_price ?? 0), status: 'pending' }]);
    }
    setAddProductId('');
    setAddProductQty('1');
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const customer = customers.find(c => c.id === form.customerId);
    const val = Number(form.value);
    const dep = Number(form.deposit) || 0;
    const num = String(existingCount + 1).padStart(3, '0');
    const project: EnhancedProject = {
      id: `PJ-${num}`, projectNumber: `PJ-${num}`,
      name: form.name.trim(), nameAm: form.nameAm.trim(),
      customerId: form.customerId, customerName: customer?.name || '', customerContact: customer?.contact, customerPhone: customer?.phone,
      type: form.type as ProjectType, status: dep > 0 ? 'Deposit' : 'Quote',
      value: val, deposit: dep, depositPercentage: val > 0 ? Math.round((dep / val) * 100) : 0, balance: val - dep,
      materialCost: 0, laborCost: 0, overheadCost: 0, totalCost: 0, profit: 0, profitMargin: 0,
      orderDate: new Date().toISOString().split('T')[0],
      startDate: form.startDate || undefined,
      dueDate: form.dueDate,
      progress: 0,
      milestones: { depositPaid: dep > 0, materialsOrdered: false, materialsReceived: false, productionStarted: false, productionCompleted: false, installationStarted: false, installationCompleted: false, finalPayment: false },
      workOrderIds: [], purchaseOrderIds: [], invoiceIds: [], paymentIds: [], installationIds: [],
      products: projectProducts,
      projectManager: form.projectManager || 'Unassigned',
      isOverdue: false, isAtRisk: false,
      notes: form.notes || undefined,
      timeline: [{ date: new Date().toISOString().split('T')[0], event: 'Project created', type: 'status_change', user: 'Admin' }],
      createdAt: new Date().toISOString().split('T')[0], createdBy: 'Admin',
      updatedAt: new Date().toISOString().split('T')[0], updatedBy: 'Admin',
    };
    onAdd(project);
    toast({ title: 'Project Created', description: `${project.name} added.` });
    setForm({ name: '', nameAm: '', customerId: '', type: '', value: '', deposit: '', dueDate: '', startDate: '', notes: '', projectManager: '' });
    setProjectProducts([]);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
        <Tabs defaultValue="basic">
          <TabsList className="w-full justify-start h-auto bg-transparent gap-0.5">
            <TabsTrigger value="basic" className="text-xs h-7">Basic Info</TabsTrigger>
            <TabsTrigger value="financial" className="text-xs h-7">Financial</TabsTrigger>
            <TabsTrigger value="products" className="text-xs h-7">Products</TabsTrigger>
            <TabsTrigger value="dates" className="text-xs h-7">Dates & Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Name (EN) *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={errors.name ? 'border-destructive' : ''} />
                {errors.name && <p className="text-[10px] text-destructive mt-0.5">{errors.name}</p>}
              </div>
              <div>
                <Label className="text-xs">ስም (AM) *</Label>
                <Input value={form.nameAm} onChange={e => setForm(p => ({ ...p, nameAm: e.target.value }))} className={errors.nameAm ? 'border-destructive' : ''} />
                {errors.nameAm && <p className="text-[10px] text-destructive mt-0.5">{errors.nameAm}</p>}
              </div>
              <div>
                <Label className="text-xs">Customer *</Label>
                <Select value={form.customerId} onValueChange={v => setForm(p => ({ ...p, customerId: v }))}>
                  <SelectTrigger className={errors.customerId ? 'border-destructive' : ''}><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
                {errors.customerId && <p className="text-[10px] text-destructive mt-0.5">{errors.customerId}</p>}
              </div>
              <div>
                <Label className="text-xs">Type *</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger className={errors.type ? 'border-destructive' : ''}><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>{types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
                {errors.type && <p className="text-[10px] text-destructive mt-0.5">{errors.type}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Project Manager</Label>
                <Input value={form.projectManager} onChange={e => setForm(p => ({ ...p, projectManager: e.target.value }))} placeholder="e.g. Abebe Tekle" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Total Value (ETB) *</Label>
                <Input type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} className={errors.value ? 'border-destructive' : ''} />
                {errors.value && <p className="text-[10px] text-destructive mt-0.5">{errors.value}</p>}
              </div>
              <div>
                <Label className="text-xs">Deposit (ETB)</Label>
                <Input type="number" value={form.deposit} onChange={e => setForm(p => ({ ...p, deposit: e.target.value }))} className={errors.deposit ? 'border-destructive' : ''} />
                {errors.deposit && <p className="text-[10px] text-destructive mt-0.5">{errors.deposit}</p>}
              </div>
              {form.value && (
                <div className="sm:col-span-2 p-2 bg-muted/50 rounded-md text-xs">
                  <span className="text-muted-foreground">Balance: </span>
                  <span className="font-medium">ETB {(Number(form.value) - (Number(form.deposit) || 0)).toLocaleString()}</span>
                  {Number(form.deposit) > 0 && <span className="text-muted-foreground ml-2">({Math.round((Number(form.deposit) / Number(form.value)) * 100)}% deposited)</span>}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-3 space-y-3">
            <div className="flex gap-2">
              <Select value={addProductId} onValueChange={setAddProductId}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>{products.filter(p => p.status === 'Active').map(p => <SelectItem key={p.id} value={p.id}>{p.name} — ETB {p.sellingPrice.toLocaleString()}</SelectItem>)}</SelectContent>
              </Select>
              <Input type="number" className="w-20" min="1" value={addProductQty} onChange={e => setAddProductQty(e.target.value)} placeholder="Qty" />
              <Button size="sm" onClick={handleAddProduct} disabled={!addProductId}><Plus className="h-3.5 w-3.5" /></Button>
            </div>
            {projectProducts.length > 0 ? (
              <div className="space-y-2">
                {projectProducts.map(pp => (
                  <div key={pp.productId} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div>
                      <p className="text-xs font-medium">{pp.productName}</p>
                      <p className="text-[10px] text-muted-foreground">{pp.quantity} × ETB {pp.unitPrice.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">ETB {pp.totalPrice.toLocaleString()}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setProjectProducts(prev => prev.filter(p => p.productId !== pp.productId))}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-right text-xs font-semibold border-t pt-2">
                  Total: ETB {projectProducts.reduce((s, p) => s + p.totalPrice, 0).toLocaleString()}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">No products added. Select from catalog above.</p>
            )}
          </TabsContent>

          <TabsContent value="dates" className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Start Date</Label>
                <Input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Due Date *</Label>
                <Input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className={errors.dueDate ? 'border-destructive' : ''} />
                {errors.dueDate && <p className="text-[10px] text-destructive mt-0.5">{errors.dueDate}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Notes</Label>
                <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="min-h-[60px]" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
