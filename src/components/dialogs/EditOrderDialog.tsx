import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Order, Customer } from "@/data/sampleData";

const statusOptions = ['Draft', 'Quote Accepted', 'Payment Received', 'Processing', 'Ready', 'Shipped', 'Delivered', 'Completed', 'Cancelled'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  customers: Customer[];
  onSave: (order: Order) => void;
}

export function EditOrderDialog({ open, onOpenChange, order, customers, onSave }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    customerId: '', status: '', paymentStatus: '', paymentMethod: '',
    shippingMethod: '', requestedDelivery: '', paid: '', notes: '', trackingNumber: '',
  });

  useEffect(() => {
    if (order) {
      setForm({
        customerId: order.customerId, status: order.status,
        paymentStatus: order.paymentStatus, paymentMethod: order.paymentMethod || '',
        shippingMethod: order.shippingMethod || '', requestedDelivery: order.requestedDelivery,
        paid: String(order.paid), notes: order.notes || '', trackingNumber: order.trackingNumber || '',
      });
    }
  }, [order]);

  const handleSubmit = () => {
    if (!order) return;
    const customer = customers.find(c => c.id === form.customerId);
    const paid = Number(form.paid) || 0;
    const updated: Order = {
      ...order,
      customerId: form.customerId, customerName: customer?.name || order.customerName,
      status: form.status as Order['status'],
      paymentStatus: form.paymentStatus as Order['paymentStatus'],
      paymentMethod: (form.paymentMethod || undefined) as Order['paymentMethod'],
      shippingMethod: (form.shippingMethod || undefined) as Order['shippingMethod'],
      requestedDelivery: form.requestedDelivery, paid,
      balance: order.total - paid,
      notes: form.notes || undefined, trackingNumber: form.trackingNumber || undefined,
    };
    onSave(updated);
    toast({ title: "Updated", description: `${updated.id} saved.` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Order {order?.id}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Customer</Label>
            <Select value={form.customerId} onValueChange={v => setForm(p => ({ ...p, customerId: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Payment Status</Label>
            <Select value={form.paymentStatus} onValueChange={v => setForm(p => ({ ...p, paymentStatus: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Paid', 'Partial', 'Unpaid'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Payment Method</Label>
            <Select value={form.paymentMethod} onValueChange={v => setForm(p => ({ ...p, paymentMethod: v }))}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {['Cash', 'Card', 'Bank Transfer', 'Credit', 'TeleBirr'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Shipping Method</Label>
            <Select value={form.shippingMethod} onValueChange={v => setForm(p => ({ ...p, shippingMethod: v }))}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {['Pickup', 'Local Delivery', 'Freight', 'Courier'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Delivery Date</Label>
            <Input type="date" value={form.requestedDelivery} onChange={e => setForm(p => ({ ...p, requestedDelivery: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Amount Paid (ETB)</Label>
            <Input type="number" value={form.paid} onChange={e => setForm(p => ({ ...p, paid: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Tracking Number</Label>
            <Input value={form.trackingNumber} onChange={e => setForm(p => ({ ...p, trackingNumber: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Notes</Label>
            <Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
