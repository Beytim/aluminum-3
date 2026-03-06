import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { EnhancedInventoryItem, StockMovement, MovementType } from "@/data/enhancedInventoryData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: EnhancedInventoryItem | null;
  type: 'receive' | 'issue';
  onConfirm: (movement: StockMovement, updatedItem: EnhancedInventoryItem) => void;
  movementCount: number;
}

export default function StockMovementDialog({ open, onOpenChange, item, type, onConfirm, movementCount }: Props) {
  const [quantity, setQuantity] = useState('');
  const [sourceType, setSourceType] = useState<string>('manual');
  const [sourceId, setSourceId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!item) return null;

  const handleConfirm = () => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) { setError('Enter valid quantity'); return; }
    if (type === 'issue' && qty > item.available) { setError(`Only ${item.available} available`); return; }

    const actualQty = type === 'issue' ? -qty : qty;
    const newStock = item.stock + actualQty;
    const movId = `MOV-${String(movementCount + 1).padStart(3, '0')}`;

    const movement: StockMovement = {
      id: movId, movementNumber: movId,
      inventoryItemId: item.id, itemCode: item.itemCode, itemName: item.productName,
      type: type === 'receive' ? 'receipt' : 'issue',
      quantity: actualQty, unit: item.primaryUnit,
      previousStock: item.stock, newStock,
      sourceType: sourceType as any, sourceId: sourceId || undefined, sourceNumber: sourceId || undefined,
      userId: 'EMP-001', userName: 'Current User',
      date: new Date().toISOString(), notes: notes || undefined,
      createdAt: new Date().toISOString(),
    };

    const updatedItem: EnhancedInventoryItem = {
      ...item,
      stock: newStock,
      available: newStock - item.reserved,
      totalValue: newStock * item.unitCost,
      updatedAt: new Date().toISOString(),
    };

    onConfirm(movement, updatedItem);
    onOpenChange(false);
    setQuantity(''); setSourceType('manual'); setSourceId(''); setNotes(''); setError('');
  };

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) { setQuantity(''); setError(''); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{type === 'receive' ? '📥 Receive Stock' : '📤 Issue Stock'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="p-2 bg-muted rounded">
            <p className="text-xs font-medium">{item.productName}</p>
            <p className="text-[10px] text-muted-foreground">{item.itemCode} · Current: {item.stock} {item.primaryUnit} · Available: {item.available}</p>
          </div>

          <div>
            <Label className="text-xs">Quantity ({item.primaryUnit}) *</Label>
            <Input type="number" value={quantity} onChange={e => { setQuantity(e.target.value); setError(''); }} className={error ? 'border-destructive' : ''} />
            {error && <p className="text-[10px] text-destructive mt-0.5">{error}</p>}
          </div>

          <div>
            <Label className="text-xs">Source Type</Label>
            <Select value={sourceType} onValueChange={setSourceType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="purchase_order">Purchase Order</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="work_order">Work Order</SelectItem>
                <SelectItem value="return">Return</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sourceType !== 'manual' && (
            <div>
              <Label className="text-xs">Reference ID</Label>
              <Input value={sourceId} onChange={e => setSourceId(e.target.value)} placeholder="e.g. PO-001, PJ-003" />
            </div>
          )}

          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
          </div>

          {quantity && Number(quantity) > 0 && (
            <div className="p-2 bg-muted rounded text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">New Stock:</span>
                <span className="font-bold">{type === 'receive' ? item.stock + Number(quantity) : item.stock - Number(quantity)} {item.primaryUnit}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} className={type === 'receive' ? 'bg-success hover:bg-success/90' : ''}>
            {type === 'receive' ? 'Receive' : 'Issue'} Stock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
