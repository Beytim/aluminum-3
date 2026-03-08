import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Scissors, Clock, Gauge, AlertTriangle, Recycle, DollarSign, Play, CheckCircle, FileText } from "lucide-react";
import type { EnhancedCuttingJob } from "@/data/enhancedProductionData";
import { formatETBFull, formatETBShort, priorityColors } from "@/data/enhancedProductionData";

const statusColor: Record<string, string> = {
  Pending: 'bg-muted text-muted-foreground',
  'In Progress': 'bg-warning/10 text-warning',
  Completed: 'bg-success/10 text-success',
  Cancelled: 'bg-destructive/10 text-destructive',
};

interface Props {
  job: EnhancedCuttingJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: EnhancedCuttingJob['status']) => void;
  onOptimize: (id: string) => void;
}

export function CuttingDetailsDialog({ job, open, onOpenChange, onStatusChange, onOptimize }: Props) {
  if (!job) return null;

  const totalStock = job.stockLength * job.stocksUsed;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <Scissors className="h-5 w-5 text-primary" />
            <DialogTitle className="text-lg">{job.jobNumber}</DialogTitle>
            <Badge className={`text-xs ${statusColor[job.status]}`}>{job.status}</Badge>
            <Badge className={`text-xs ${priorityColors[job.priority]}`}>{job.priority}</Badge>
            {job.optimized && <Badge variant="outline" className="text-xs bg-info/10 text-info border-info/20">Optimized</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{job.materialName}</p>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList className="h-8">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">Cut Layout</TabsTrigger>
            <TabsTrigger value="remnants" className="text-xs">Remnants</TabsTrigger>
            <TabsTrigger value="costs" className="text-xs">Costs</TabsTrigger>
            <TabsTrigger value="quality" className="text-xs">Quality</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Quick Actions */}
            <div className="flex gap-2 flex-wrap">
              {job.status === 'Pending' && (
                <>
                  <Button size="sm" className="text-xs gap-1" onClick={() => onOptimize(job.id)}>
                    <Gauge className="h-3 w-3" />Run Optimizer
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => onStatusChange(job.id, 'In Progress')}>
                    <Play className="h-3 w-3" />Start Cutting
                  </Button>
                </>
              )}
              {job.status === 'In Progress' && (
                <Button size="sm" className="text-xs gap-1" onClick={() => onStatusChange(job.id, 'Completed')}>
                  <CheckCircle className="h-3 w-3" />Mark Complete
                </Button>
              )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card><CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Efficiency</p>
                <p className={`text-2xl font-bold ${job.efficiency >= 90 ? 'text-success' : job.efficiency >= 80 ? 'text-warning' : 'text-destructive'}`}>{job.efficiency}%</p>
                <Progress value={job.efficiency} className="h-1.5 mt-1" />
              </CardContent></Card>
              <Card><CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Waste</p>
                <p className={`text-2xl font-bold ${job.wastePercent <= 5 ? 'text-success' : job.wastePercent <= 10 ? 'text-warning' : 'text-destructive'}`}>{job.wastePercent}%</p>
                <p className="text-[10px] text-muted-foreground">{job.waste}mm of {totalStock}mm</p>
              </CardContent></Card>
              <Card><CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Total Cuts</p>
                <p className="text-2xl font-bold text-foreground">{job.totalCuts}</p>
                <p className="text-[10px] text-muted-foreground">{job.totalCutLength}mm total</p>
              </CardContent></Card>
              <Card><CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Stock Used</p>
                <p className="text-2xl font-bold text-primary">{job.stocksUsed}</p>
                <p className="text-[10px] text-muted-foreground">{job.stockLength}mm each</p>
              </CardContent></Card>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card>
                <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-xs text-muted-foreground">Production Link</CardTitle></CardHeader>
                <CardContent className="px-4 pb-3 space-y-1 text-xs">
                  {job.workOrderNumber && <p>Work Order: <strong className="font-mono">{job.workOrderNumber}</strong></p>}
                  {job.projectName && <p>Project: <strong>{job.projectName}</strong></p>}
                  {job.customerName && <p>Customer: <strong>{job.customerName}</strong></p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-xs text-muted-foreground">Material Details</CardTitle></CardHeader>
                <CardContent className="px-4 pb-3 space-y-1 text-xs">
                  <p>Material: <strong>{job.materialName}</strong></p>
                  <p>Category: <strong>{job.materialCategory}</strong></p>
                  {job.alloyType && <p>Alloy: <strong>{job.alloyType}-{job.temper}</strong></p>}
                  <p>Machine: <strong>{job.machine}</strong></p>
                  <p>Operator: <strong>{job.assignee}</strong></p>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            {(job.scheduledDate || job.startTime || job.endTime) && (
              <Card>
                <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-xs text-muted-foreground">Timeline</CardTitle></CardHeader>
                <CardContent className="px-4 pb-3 text-xs space-y-1">
                  {job.scheduledDate && <p><Clock className="h-3 w-3 inline mr-1" />Scheduled: <strong>{job.scheduledDate}</strong></p>}
                  {job.startTime && <p><Play className="h-3 w-3 inline mr-1" />Started: <strong>{new Date(job.startTime).toLocaleString()}</strong></p>}
                  {job.endTime && <p><CheckCircle className="h-3 w-3 inline mr-1" />Completed: <strong>{new Date(job.endTime).toLocaleString()}</strong></p>}
                  {job.duration && <p>Duration: <strong>{job.duration} hours</strong></p>}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Cut Layout Tab */}
          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm">Cut Layout Visualization</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                {Array.from({ length: job.stocksUsed }, (_, stockIdx) => {
                  const cutsPerStock = Math.ceil(job.cuts.length / job.stocksUsed);
                  const stockCuts = job.cuts.slice(stockIdx * cutsPerStock, (stockIdx + 1) * cutsPerStock);
                  const used = stockCuts.reduce((s, c) => s + c, 0);
                  const waste = job.stockLength - used;
                  return (
                    <div key={stockIdx} className="border rounded-lg p-3">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-medium">Stock #{stockIdx + 1} — {job.stockLength}mm</span>
                        <span className="text-muted-foreground">Used: {used}mm · Waste: {waste}mm ({((waste / job.stockLength) * 100).toFixed(1)}%)</span>
                      </div>
                      <div className="flex gap-0.5 h-10 rounded overflow-hidden border border-border">
                        {stockCuts.map((cut, ci) => (
                          <div
                            key={ci}
                            className="bg-primary/70 hover:bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-mono transition-colors relative group"
                            style={{ width: `${(cut / job.stockLength) * 100}%` }}
                          >
                            {cut}mm
                          </div>
                        ))}
                        {waste > 0 && (
                          <div
                            className="bg-destructive/15 flex items-center justify-center text-[10px] text-destructive font-mono border-l border-dashed border-destructive/30"
                            style={{ width: `${(waste / job.stockLength) * 100}%` }}
                          >
                            {waste}mm
                          </div>
                        )}
                      </div>
                      {/* Scale ruler */}
                      <div className="flex justify-between text-[8px] text-muted-foreground mt-1 px-0.5">
                        <span>0</span>
                        <span>{job.stockLength / 4}mm</span>
                        <span>{job.stockLength / 2}mm</span>
                        <span>{(job.stockLength * 3) / 4}mm</span>
                        <span>{job.stockLength}mm</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Cut List */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm">Cut List</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">#</TableHead>
                      <TableHead className="text-xs">Length</TableHead>
                      <TableHead className="text-xs">% of Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {job.cuts.map((cut, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs">{i + 1}</TableCell>
                        <TableCell className="text-xs font-mono font-medium">{cut}mm</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{((cut / job.stockLength) * 100).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Remnants Tab */}
          <TabsContent value="remnants" className="space-y-4">
            {job.remnants.length > 0 ? (
              <Card>
                <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-sm flex items-center gap-2"><Recycle className="h-4 w-4" />Remnants ({job.remnants.length})</CardTitle></CardHeader>
                <CardContent className="px-4 pb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">#</TableHead>
                        <TableHead className="text-xs">Length</TableHead>
                        <TableHead className="text-xs">Reusable</TableHead>
                        <TableHead className="text-xs">Est. Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {job.remnants.map((rem, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs">{i + 1}</TableCell>
                          <TableCell className="text-xs font-mono font-medium">{rem.length}mm</TableCell>
                          <TableCell>
                            <Badge className={`text-[9px] ${rem.reusable ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                              {rem.reusable ? '✓ Reusable' : '✗ Scrap'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs font-mono">{formatETBShort(rem.length * 0.085)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Recycle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No remnants from this cutting job</p>
                <p className="text-xs">Perfect utilization — zero waste!</p>
              </div>
            )}
          </TabsContent>

          {/* Costs Tab */}
          <TabsContent value="costs" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card><CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Material Cost</p>
                <p className="text-xl font-bold text-foreground">{formatETBFull(job.materialCost)}</p>
              </CardContent></Card>
              <Card><CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Waste Cost</p>
                <p className="text-xl font-bold text-destructive">{formatETBFull(job.wasteCost)}</p>
                <p className="text-[10px] text-muted-foreground">{((job.wasteCost / (job.materialCost || 1)) * 100).toFixed(1)}% of material</p>
              </CardContent></Card>
              <Card><CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">Labor Cost</p>
                <p className="text-xl font-bold text-info">{formatETBFull(job.laborCost)}</p>
                {job.duration && <p className="text-[10px] text-muted-foreground">{job.duration}hrs</p>}
              </CardContent></Card>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center border-t border-border pt-3">
                  <span className="text-sm font-semibold">Total Cost</span>
                  <span className="text-xl font-bold text-primary">{formatETBFull(job.totalCost)}</span>
                </div>
              </CardContent>
            </Card>
            {/* Cost breakdown bar */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-4"><CardTitle className="text-xs text-muted-foreground">Cost Breakdown</CardTitle></CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex h-6 rounded overflow-hidden">
                  <div className="bg-primary/70 flex items-center justify-center text-[9px] text-primary-foreground" style={{ width: `${(job.materialCost / job.totalCost) * 100}%` }}>
                    Material {((job.materialCost / job.totalCost) * 100).toFixed(0)}%
                  </div>
                  <div className="bg-destructive/50 flex items-center justify-center text-[9px] text-destructive-foreground" style={{ width: `${(job.wasteCost / job.totalCost) * 100}%` }}>
                    {job.wasteCost > 0 ? `Waste ${((job.wasteCost / job.totalCost) * 100).toFixed(0)}%` : ''}
                  </div>
                  <div className="bg-info/70 flex items-center justify-center text-[9px] text-info-foreground" style={{ width: `${(job.laborCost / job.totalCost) * 100}%` }}>
                    Labor {((job.laborCost / job.totalCost) * 100).toFixed(0)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Tab */}
          <TabsContent value="quality" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                {job.qualityChecked ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${job.qualityResult === 'pass' ? 'bg-success/10 text-success' : job.qualityResult === 'conditional' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
                        {job.qualityResult === 'pass' ? '✓ Passed' : job.qualityResult === 'conditional' ? '⚠ Conditional' : '✗ Failed'}
                      </Badge>
                    </div>
                    {job.qualityNotes && <p className="text-xs text-muted-foreground">{job.qualityNotes}</p>}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Quality check not yet performed</p>
                    <p className="text-xs">QC will be done after cutting is completed</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
