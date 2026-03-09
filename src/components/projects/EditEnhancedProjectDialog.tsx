import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { EnhancedProject, ProjectType, ProjectStatus, ProjectProduct } from "@/data/enhancedProjectData";
import type { Customer, Product } from "@/data/sampleData";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: EnhancedProject | null;
  customers: Customer[];
  products: Product[];
  onSave: (project: EnhancedProject) => void;
}

const statuses: ProjectStatus[] = ['Quote', 'Deposit', 'Materials Ordered', 'Production', 'Ready', 'Installation', 'Completed', 'On Hold', 'Cancelled'];
const types: ProjectType[] = ['Residential', 'Commercial', 'Industrial', 'Government'];

export function EditEnhancedProjectDialog({ open, onOpenChange, project, customers, products, onSave }: Props) {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', nameAm: '', customerId: '', type: '', status: '', value: '', deposit: '', dueDate: '', startDate: '', progress: '', notes: '', projectManager: '', materialCost: '', laborCost: '', overheadCost: '',
  });
  const [projectProducts, setProjectProducts] = useState<ProjectProduct[]>([]);
  const [addProductId, setAddProductId] = useState('');
  const [addProductQty, setAddProductQty] = useState('1');

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name, nameAm: project.nameAm, customerId: project.customerId,
        type: project.type, status: project.status, value: String(project.value),
        deposit: String(project.deposit), dueDate: project.dueDate, startDate: project.startDate || '',
        progress: String(project.progress), notes: project.notes || '', projectManager: project.projectManager,
        materialCost: String(project.materialCost), laborCost: String(project.laborCost), overheadCost: String(project.overheadCost),
      });
      setProjectProducts(project.products || []);
      setErrors({});
    }
  }, [project]);

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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.customerId) e.customerId = 'Required';
    if (!form.value || Number(form.value) <= 0) e.value = 'Must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !project) return;
    const customer = customers.find(c => c.id === form.customerId);
    const val = Number(form.value);
    const dep = Number(form.deposit) || 0;
    const matCost = Number(form.materialCost) || 0;
    const labCost = Number(form.laborCost) || 0;
    const ovhCost = Number(form.overheadCost) || 0;
    const totalCost = matCost + labCost + ovhCost;
    const profit = val - totalCost;
    const daysLeft = Math.ceil((new Date(form.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const prog = Number(form.progress) || 0;

    const updated: EnhancedProject = {
      ...project,
      name: form.name.trim(), nameAm: form.nameAm.trim(),
      customerId: form.customerId, customerName: customer?.name || project.customerName,
      customerContact: customer?.contact, customerPhone: customer?.phone,
      type: form.type as ProjectType, status: form.status as ProjectStatus,
      value: val, deposit: dep, depositPercentage: val > 0 ? Math.round((dep / val) * 100) : 0, balance: val - dep,
      materialCost: matCost, laborCost: labCost, overheadCost: ovhCost,
      totalCost, profit, profitMargin: val > 0 ? (profit / val * 100) : 0,
      dueDate: form.dueDate, startDate: form.startDate || undefined,
      progress: prog, notes: form.notes || undefined,
      projectManager: form.projectManager,
      products: projectProducts,
      isOverdue: daysLeft < 0 && form.status !== 'Completed' && form.status !== 'Cancelled',
      isAtRisk: daysLeft < 14 && daysLeft >= 0 && prog < 80 && form.status !== 'Completed',
      milestones: { ...project.milestones, depositPaid: dep > 0 },
      updatedAt: new Date().toISOString().split('T')[0], updatedBy: 'Admin',
    };
    onSave(updated);
    toast({ title: "Updated", description: `${updated.name} saved.` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
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
              </div>
              <div>
                <Label className="text-xs">ስም (AM)</Label>
                <Input value={form.nameAm} onChange={e => setForm(p => ({ ...p, nameAm: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Customer *</Label>
                <Select value={form.customerId} onValueChange={v => setForm(p => ({ ...p, customerId: v }))}>
                  <SelectTrigger className={errors.customerId ? 'border-destructive' : ''}><SelectValue /></SelectTrigger>
                  <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Progress %</Label>
                <Input type="number" min="0" max="100" value={form.progress} onChange={e => setForm(p => ({ ...p, progress: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Project Manager</Label>
                <Input value={form.projectManager} onChange={e => setForm(p => ({ ...p, projectManager: e.target.value }))} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Total Value (ETB) *</Label>
                <Input type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} className={errors.value ? 'border-destructive' : ''} />
              </div>
              <div>
                <Label className="text-xs">Deposit (ETB)</Label>
                <Input type="number" value={form.deposit} onChange={e => setForm(p => ({ ...p, deposit: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Material Cost (ETB)</Label>
                <Input type="number" value={form.materialCost} onChange={e => setForm(p => ({ ...p, materialCost: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Labor Cost (ETB)</Label>
                <Input type="number" value={form.laborCost} onChange={e => setForm(p => ({ ...p, laborCost: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Overhead (ETB)</Label>
                <Input type="number" value={form.overheadCost} onChange={e => setForm(p => ({ ...p, overheadCost: e.target.value }))} />
              </div>
              {form.value && (
                <div className="p-2 bg-muted/50 rounded-md text-xs">
                  <span className="text-muted-foreground">Balance: </span>
                  <span className="font-medium">ETB {(Number(form.value) - (Number(form.deposit) || 0)).toLocaleString()}</span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-3 space-y-3">
            <div className="flex gap-2">
              <Select value={addProductId} onValueChange={setAddProductId}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Add product" /></SelectTrigger>
                <SelectContent>{products.filter(p => p.status === 'Active').map(p => <SelectItem key={p.id} value={p.id}>{p.name} — ETB {((p as any).sellingPrice ?? (p as any).selling_price ?? 0).toLocaleString()}</SelectItem>)}</SelectContent>
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
              <p className="text-xs text-muted-foreground text-center py-4">No products added</p>
            )}
          </TabsContent>

          <TabsContent value="dates" className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Start Date</Label>
                <Input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Due Date</Label>
                <Input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Notes</Label>
                <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="min-h-[60px]" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
