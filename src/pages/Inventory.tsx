import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, AlertTriangle, Boxes, Trash2 } from "lucide-react";
import { sampleInventory } from "@/data/sampleData";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import type { InventoryItem } from "@/data/sampleData";

export default function Inventory() {
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>(STORAGE_KEYS.INVENTORY, sampleInventory);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showLowStock, setShowLowStock] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t, language } = useI18n();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: '', nameAm: '', category: '', unit: '', stock: '', minStock: '', location: '', cost: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "all" || item.category === catFilter;
      const matchLow = !showLowStock || item.stock <= item.minStock;
      return matchSearch && matchCat && matchLow;
    });
  }, [search, catFilter, showLowStock, inventory]);

  const lowStockCount = inventory.filter(i => i.stock <= i.minStock).length;
  const totalValue = inventory.reduce((sum, i) => sum + i.stock * i.cost, 0);

  const handleAdd = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.category) e.category = 'Required';
    if (!form.stock || Number(form.stock) < 0) e.stock = 'Invalid';
    if (!form.cost || Number(form.cost) <= 0) e.cost = 'Must be > 0';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const code = `${form.category.substring(0, 2).toUpperCase()}-${String(inventory.length + 1).padStart(3, '0')}`;
    const stock = Number(form.stock);
    const item: InventoryItem = {
      id: `INV-${String(inventory.length + 1).padStart(3, '0')}`, code,
      name: form.name.trim(), nameAm: form.nameAm.trim() || form.name.trim(),
      category: form.category as InventoryItem['category'],
      unit: form.unit || 'piece', stock, minStock: Number(form.minStock) || 10,
      reserved: 0, available: stock, location: form.location || 'R1-A1', cost: Number(form.cost),
    };
    setInventory(prev => [...prev, item]);
    toast({ title: t('common.add'), description: `${item.name} added.` });
    setForm({ name: '', nameAm: '', category: '', unit: '', stock: '', minStock: '', location: '', cost: '' });
    setErrors({});
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('inventory.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {inventory.length} items · Value: ETB {totalValue.toLocaleString()}
            {lowStockCount > 0 && <span className="text-destructive font-medium ml-2">· {lowStockCount} {t('inventory.low_stock')}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">{t('inventory.receive')}</Button>
          <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />{t('common.add')}</Button>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-3 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('common.search')} className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {['Profile', 'Glass', 'Hardware', 'Accessory', 'Steel'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant={showLowStock ? "destructive" : "outline"} size="sm" onClick={() => setShowLowStock(!showLowStock)}>
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />{t('inventory.low_stock')} ({lowStockCount})
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Code</TableHead>
                <TableHead className="text-xs">{t('common.name')}</TableHead>
                <TableHead className="text-xs">{t('products.category')}</TableHead>
                <TableHead className="text-xs text-right">Stock</TableHead>
                <TableHead className="text-xs text-right">Reserved</TableHead>
                <TableHead className="text-xs text-right">Available</TableHead>
                <TableHead className="text-xs">Location</TableHead>
                <TableHead className="text-xs text-right">Cost</TableHead>
                <TableHead className="text-xs">{t('common.status')}</TableHead>
                <TableHead className="text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => {
                const isLow = item.stock <= item.minStock;
                return (
                  <TableRow key={item.id} className={isLow ? "bg-destructive/5" : ""}>
                    <TableCell className="text-xs font-mono">{item.code}</TableCell>
                    <TableCell className="text-xs font-medium">{language === 'am' ? item.nameAm : item.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{item.category}</Badge></TableCell>
                    <TableCell className="text-xs text-right font-semibold">{item.stock} {item.unit}</TableCell>
                    <TableCell className="text-xs text-right text-muted-foreground">{item.reserved}</TableCell>
                    <TableCell className="text-xs text-right font-medium">{item.available}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{item.location}</TableCell>
                    <TableCell className="text-xs text-right">ETB {item.cost}</TableCell>
                    <TableCell>
                      {isLow ? (
                        <Badge variant="destructive" className="text-[10px]">{t('inventory.low_stock')}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-success border-success/30">OK</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setInventory(prev => prev.filter(i => i.id !== item.id)); toast({ title: "Deleted" }); }}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Boxes className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t('common.no_data')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><Label className="text-xs">Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={errors.name ? 'border-destructive' : ''} />{errors.name && <p className="text-[10px] text-destructive">{errors.name}</p>}</div>
            <div><Label className="text-xs">ስም (AM)</Label><Input value={form.nameAm} onChange={e => setForm(p => ({ ...p, nameAm: e.target.value }))} /></div>
            <div><Label className="text-xs">Category *</Label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}><SelectTrigger className={errors.category ? 'border-destructive' : ''}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{['Profile', 'Glass', 'Hardware', 'Accessory', 'Steel'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
              {errors.category && <p className="text-[10px] text-destructive">{errors.category}</p>}
            </div>
            <div><Label className="text-xs">Unit</Label><Input value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} placeholder="meter, sqm, piece" /></div>
            <div><Label className="text-xs">Stock *</Label><Input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} className={errors.stock ? 'border-destructive' : ''} />{errors.stock && <p className="text-[10px] text-destructive">{errors.stock}</p>}</div>
            <div><Label className="text-xs">Min Stock</Label><Input type="number" value={form.minStock} onChange={e => setForm(p => ({ ...p, minStock: e.target.value }))} /></div>
            <div><Label className="text-xs">Location</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="R1-A1" /></div>
            <div><Label className="text-xs">Cost (ETB) *</Label><Input type="number" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} className={errors.cost ? 'border-destructive' : ''} />{errors.cost && <p className="text-[10px] text-destructive">{errors.cost}</p>}</div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button><Button onClick={handleAdd}>{t('common.add')}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
