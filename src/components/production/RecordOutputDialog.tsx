import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Package } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrderNumber: string;
  quantity: number;
  onSave: (goodUnits: number, scrap: number, rework: number) => void;
}

export function RecordOutputDialog({ open, onOpenChange, workOrderNumber, quantity, onSave }: Props) {
  const [good, setGood] = useState(0);
  const [scrap, setScrap] = useState(0);
  const [rework, setRework] = useState(0);

  const total = good + scrap + rework;

  const handleSave = () => {
    onSave(good, scrap, rework);
    setGood(0);
    setScrap(0);
    setRework(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Record Production Output
          </DialogTitle>
          <DialogDescription>
            You must record good units before completing <strong>{workOrderNumber}</strong>. Enter production output below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Good Units *</Label>
            <Input type="number" min={0} max={quantity} value={good} onChange={e => setGood(Number(e.target.value))} className="h-9" />
          </div>
          <div>
            <Label className="text-xs">Scrap</Label>
            <Input type="number" min={0} value={scrap} onChange={e => setScrap(Number(e.target.value))} className="h-9" />
          </div>
          <div>
            <Label className="text-xs">Rework</Label>
            <Input type="number" min={0} value={rework} onChange={e => setRework(Number(e.target.value))} className="h-9" />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Total: {total} / {quantity} units
        </p>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" disabled={good <= 0} onClick={handleSave}>
            <Save className="h-3.5 w-3.5 mr-1.5" />Save & Complete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
