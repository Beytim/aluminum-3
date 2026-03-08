import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Scissors, TrendingUp, Recycle } from "lucide-react";
import type { EnhancedCuttingJob } from "@/data/enhancedProductionData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: EnhancedCuttingJob | null;
  onApplyOptimization?: (jobId: string, layout: number[][], stockNeeded: number, totalWaste: number) => void;
}

interface OptResult {
  layout: number[][];
  stockNeeded: number;
  totalWaste: number;
  efficiency: number;
  remnants: { length: number; reusable: boolean }[];
}

export function OptimizerDialog({ open, onOpenChange, job, onApplyOptimization }: Props) {
  const [stockLength, setStockLength] = useState(job?.stockLength?.toString() || '6000');
  const [requiredCuts, setRequiredCuts] = useState(job?.cuts?.join(', ') || '');
  const [bladeKerf, setBladeKerf] = useState('3');
  const [result, setResult] = useState<OptResult | null>(null);

  const runOptimizer = () => {
    const stock = Number(stockLength);
    const kerf = Number(bladeKerf);
    const cuts = requiredCuts.split(',').map(c => Number(c.trim())).filter(c => c > 0);
    if (!stock || cuts.length === 0) return;

    // First Fit Decreasing algorithm with blade kerf
    const sorted = [...cuts].sort((a, b) => b - a);
    const bins: number[][] = [];

    for (const cut of sorted) {
      let placed = false;
      for (let i = 0; i < bins.length; i++) {
        const used = bins[i].reduce((s, c) => s + c + kerf, 0);
        if (used + cut <= stock) {
          bins[i].push(cut);
          placed = true;
          break;
        }
      }
      if (!placed) bins.push([cut]);
    }

    const totalUsed = bins.reduce((s, bin) => s + bin.reduce((ss, c) => ss + c, 0), 0);
    const totalStock = stock * bins.length;
    const totalWaste = totalStock - totalUsed - (bins.reduce((s, bin) => s + (bin.length) * kerf, 0));
    const efficiency = Number(((totalUsed / totalStock) * 100).toFixed(1));

    const remnants = bins.map(bin => {
      const used = bin.reduce((s, c) => s + c + kerf, 0);
      const rem = stock - used;
      return rem > 0 ? { length: rem, reusable: rem > 200 } : null;
    }).filter(Boolean) as { length: number; reusable: boolean }[];

    setResult({ layout: bins, stockNeeded: bins.length, totalWaste: Math.max(0, totalWaste), efficiency, remnants });
  };

  const handleApply = () => {
    if (result && job && onApplyOptimization) {
      onApplyOptimization(job.id, result.layout, result.stockNeeded, result.totalWaste);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Cut Optimizer {job && `— ${job.jobNumber}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Input */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Stock Length (mm)</Label>
              <Input type="number" value={stockLength} onChange={e => setStockLength(e.target.value)} className="h-9" />
            </div>
            <div>
              <Label className="text-xs">Blade Kerf (mm)</Label>
              <Input type="number" value={bladeKerf} onChange={e => setBladeKerf(e.target.value)} className="h-9" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Required Cut Lengths (comma-separated mm)</Label>
            <Input value={requiredCuts} onChange={e => setRequiredCuts(e.target.value)} placeholder="1200, 1200, 1500, 900, 800, 1800" className="h-9 font-mono text-sm" />
          </div>
          <Button onClick={runOptimizer} className="w-full gap-2">
            <Scissors className="h-4 w-4" />Optimize Cuts
          </Button>

          {/* Results */}
          {result && (
            <div className="space-y-4 pt-3 border-t border-border">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-2">
                <Card><CardContent className="p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">Stocks Needed</p>
                  <p className="text-xl font-bold text-primary">{result.stockNeeded}</p>
                </CardContent></Card>
                <Card><CardContent className="p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">Efficiency</p>
                  <p className={`text-xl font-bold ${result.efficiency >= 90 ? 'text-success' : result.efficiency >= 80 ? 'text-warning' : 'text-destructive'}`}>{result.efficiency}%</p>
                </CardContent></Card>
                <Card><CardContent className="p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">Total Waste</p>
                  <p className="text-xl font-bold text-destructive">{result.totalWaste}mm</p>
                </CardContent></Card>
                <Card><CardContent className="p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">Remnants</p>
                  <p className="text-xl font-bold text-chart-4">{result.remnants.length}</p>
                  <p className="text-[9px] text-muted-foreground">{result.remnants.filter(r => r.reusable).length} reusable</p>
                </CardContent></Card>
              </div>

              {/* Layout Visualization */}
              <div className="space-y-2">
                <p className="text-xs font-semibold">Optimized Layout</p>
                {result.layout.map((bin, idx) => {
                  const used = bin.reduce((s, c) => s + c, 0);
                  const waste = Number(stockLength) - used - (bin.length * Number(bladeKerf));
                  return (
                    <div key={idx} className="p-3 border rounded-lg bg-card">
                      <div className="flex justify-between text-[10px] mb-1.5">
                        <span className="font-medium">Stock #{idx + 1} — {stockLength}mm</span>
                        <div className="flex gap-2">
                          <span>Used: {used}mm</span>
                          <span className={waste > 0 ? 'text-warning' : 'text-success'}>Waste: {Math.max(0, waste)}mm</span>
                          <span className="text-muted-foreground">({((used / Number(stockLength)) * 100).toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="flex gap-0.5 h-8 rounded overflow-hidden border border-border">
                        {bin.map((cut, ci) => (
                          <div key={ci} className="bg-primary/70 hover:bg-primary flex items-center justify-center text-[9px] text-primary-foreground font-mono transition-colors" style={{ width: `${(cut / Number(stockLength)) * 100}%` }}>
                            {cut}mm
                          </div>
                        ))}
                        {waste > 0 && (
                          <div className="bg-destructive/15 flex items-center justify-center text-[9px] text-destructive font-mono border-l border-dashed border-destructive/30" style={{ width: `${(Math.max(0, waste) / Number(stockLength)) * 100}%` }}>
                            {Math.max(0, waste)}mm
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Remnants */}
              {result.remnants.length > 0 && (
                <div>
                  <p className="text-xs font-semibold flex items-center gap-1 mb-2"><Recycle className="h-3 w-3" />Remnants</p>
                  <div className="flex gap-2 flex-wrap">
                    {result.remnants.map((rem, i) => (
                      <Badge key={i} variant="outline" className={`text-xs ${rem.reusable ? 'border-success/30 text-success' : 'border-destructive/30 text-destructive'}`}>
                        {rem.length}mm {rem.reusable ? '✓ Reusable' : '✗ Scrap'}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Button */}
              {job && onApplyOptimization && (
                <Button onClick={handleApply} className="w-full gap-2">
                  <TrendingUp className="h-4 w-4" />Apply Optimization to {job.jobNumber}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
