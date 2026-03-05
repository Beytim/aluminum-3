import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Plus, Trash2 } from "lucide-react";
import { sampleSuppliers } from "@/data/sampleData";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import type { Supplier } from "@/data/sampleData";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>(STORAGE_KEYS.SUPPLIERS, sampleSuppliers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ company: '', contact: '', phone: '', email: '', country: '', leadTime: '', paymentTerms: '' });

  const handleAdd = () => {
    if (!form.company.trim()) return;
    const supplier: Supplier = {
      id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      company: form.company.trim(), contact: form.contact.trim(),
      phone: form.phone, email: form.email, country: form.country || 'Ethiopia',
      leadTime: Number(form.leadTime) || 7, rating: 3, preferred: false,
      paymentTerms: form.paymentTerms || 'Net 30', certifications: [],
    };
    setSuppliers(prev => [...prev, supplier]);
    toast({ title: "Supplier Added", description: supplier.company });
    setForm({ company: '', contact: '', phone: '', email: '', country: '', leadTime: '', paymentTerms: '' });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Suppliers</h1>
          <p className="text-sm text-muted-foreground">{suppliers.length} suppliers</p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />Add Supplier</Button>
      </div>
      <Card className="shadow-card">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Company</TableHead>
                <TableHead className="text-xs">Contact</TableHead>
                <TableHead className="text-xs">Country</TableHead>
                <TableHead className="text-xs">Rating</TableHead>
                <TableHead className="text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="text-xs font-medium">{s.company}</TableCell>
                  <TableCell className="text-xs">{s.contact}</TableCell>
                  <TableCell className="text-xs">{s.country}</TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < s.rating ? 'text-warning fill-warning' : 'text-muted'}`} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSuppliers(prev => prev.filter(x => x.id !== s.id)); toast({ title: "Deleted" }); }}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Supplier</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><Label className="text-xs">Company *</Label><Input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} /></div>
            <div><Label className="text-xs">Contact</Label><Input value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} /></div>
            <div><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
            <div><Label className="text-xs">Email</Label><Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
            <div><Label className="text-xs">Country</Label><Input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} /></div>
            <div><Label className="text-xs">Lead Time (days)</Label><Input type="number" value={form.leadTime} onChange={e => setForm(p => ({ ...p, leadTime: e.target.value }))} /></div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleAdd}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
