import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, ArrowRight, Clock, Package, Users, Scissors, CheckCircle, DollarSign, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EnhancedWorkOrder } from "@/data/enhancedProductionData";
import { stageColors, priorityColors, statusColors, getDaysUntilDue, getEfficiencyColor, formatETBFull, formatETBShort } from "@/data/enhancedProductionData";

interface Props {
  workOrder: EnhancedWorkOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdvance: (id: string) => void;
  onUpdateOutput?: (id: string, goodUnits: number, scrap: number, rework: number) => void;
}

export function WorkOrderDetailsDialog({ workOrder: wo, open, onOpenChange, onAdvance, onUpdateOutput }: Props) {
  const [goodInput, setGoodInput] = useState(0);
  const [scrapInput, setScrapInput] = useState(0);
  const [reworkInput, setReworkInput] = useState(0);

  if (!wo) return null;

  const daysLeft = getDaysUntilDue(wo.scheduledEnd);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <span className="font-mono">{wo.workOrderNumber}</span>
            <Badge className={`${priorityColors[wo.priority]}`}>{wo.priority}</Badge>
            <Badge className={`${statusColors[wo.status]}`}>{wo.status}</Badge>
            {wo.isOverdue && <Badge variant="destructive" className="text-[10px]"><AlertTriangle className="h-3 w-3 mr-1" />OVERDUE</Badge>}
            {wo.isBlocked && <Badge variant="destructive" className="text-[10px]">BLOCKED</Badge>}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto">
            <TabsTrigger value="overview" className="text-[10px] px-2 py-1">Overview</TabsTrigger>
            <TabsTrigger value="production" className="text-[10px] px-2 py-1">Production</TabsTrigger>
            <TabsTrigger value="materials" className="text-[10px] px-2 py-1">Materials</TabsTrigger>
            <TabsTrigger value="labor" className="text-[10px] px-2 py-1">Labor</TabsTrigger>
            <TabsTrigger value="cutting" className="text-[10px] px-2 py-1">Cutting</TabsTrigger>
            <TabsTrigger value="quality" className="text-[10px] px-2 py-1">Quality</TabsTrigger>
            <TabsTrigger value="costs" className="text-[10px] px-2 py-1">Costs</TabsTrigger>
            <TabsTrigger value="issues" className="text-[10px] px-2 py-1">Issues</TabsTrigger>
          </TabsList>

          {/* TAB 1: Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-3 space-y-2">
                  <p className="text-xs font-semibold flex items-center gap-1"><Package className="h-3 w-3" /> Product</p>
                  <p className="text-sm font-bold">{wo.productName}</p>
                  <p className="text-[10px] text-muted-foreground">{wo.productCode} · {wo.productCategory} · {wo.productType}</p>
                  {wo.specifications.profile && <p className="text-[10px] text-muted-foreground">Profile: {wo.specifications.profile}</p>}
                  {wo.specifications.glass && <p className="text-[10px] text-muted-foreground">Glass: {wo.specifications.glass}</p>}
                  {wo.specifications.color && <p className="text-[10px] text-muted-foreground">Color: {wo.specifications.color}</p>}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 space-y-2">
                  <p className="text-xs font-semibold">Progress</p>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{wo.progress}%</p>
                    <Progress value={wo.progress} className="h-2 mt-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
                    <div><p className="font-bold text-success">{wo.goodUnits}</p><p className="text-muted-foreground">Good</p></div>
                    <div><p className="font-bold text-warning">{wo.rework}</p><p className="text-muted-foreground">Rework</p></div>
                    <div><p className="font-bold text-destructive">{wo.scrap}</p><p className="text-muted-foreground">Scrap</p></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 space-y-2">
                  <p className="text-xs font-semibold flex items-center gap-1"><Clock className="h-3 w-3" /> Timeline</p>
                  <div className="space-y-1 text-[10px]">
                    <p>Start: <strong>{wo.actualStart || wo.scheduledStart}</strong></p>
                    <p>Due: <strong className={daysLeft < 0 ? 'text-destructive' : daysLeft <= 7 ? 'text-warning' : ''}>{wo.scheduledEnd}</strong></p>
                    <p>{daysLeft < 0 ? <span className="text-destructive font-bold">{Math.abs(daysLeft)} days overdue</span> : <span>{daysLeft} days remaining</span>}</p>
                    {wo.variances.efficiency > 0 && (
                      <p>Efficiency: <strong className={getEfficiencyColor(wo.variances.efficiency)}>{wo.variances.efficiency}%</strong></p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
              <div className="p-2 border rounded"><span className="text-muted-foreground">Project:</span> <strong>{wo.projectName}</strong></div>
              <div className="p-2 border rounded"><span className="text-muted-foreground">Customer:</span> <strong>{wo.customerName || '—'}</strong></div>
              <div className="p-2 border rounded"><span className="text-muted-foreground">Team:</span> <strong>{wo.assignedTeam || 'Unassigned'}</strong></div>
              <div className="p-2 border rounded"><span className="text-muted-foreground">Supervisor:</span> <strong>{wo.supervisorName || '—'}</strong></div>
            </div>

            {/* Stage History */}
            <Card>
              <CardContent className="p-3">
                <p className="text-xs font-semibold mb-2">Stage Progression</p>
                <div className="flex flex-wrap gap-1">
                  {wo.stageHistory.map((sh, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Badge className={`text-[9px] ${stageColors[sh.stage]}`}>{sh.stage}</Badge>
                      {sh.duration && <span className="text-[9px] text-muted-foreground">{sh.duration}h</span>}
                      {i < wo.stageHistory.length - 1 && <span className="text-muted-foreground">→</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {wo.progress < 100 && wo.status !== 'On Hold' && wo.status !== 'Cancelled' && (
              <Button size="sm" onClick={() => onAdvance(wo.id)}>
                <ArrowRight className="h-3.5 w-3.5 mr-1.5" />Advance Stage
              </Button>
            )}
          </TabsContent>

          {/* TAB 2: Production */}
          <TabsContent value="production" className="space-y-3">
            <div className="grid grid-cols-4 gap-2 text-center">
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Total</p><p className="text-xl font-bold">{wo.quantity}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Completed</p><p className="text-xl font-bold text-success">{wo.completed}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Remaining</p><p className="text-xl font-bold text-warning">{wo.remaining}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Scrap</p><p className="text-xl font-bold text-destructive">{wo.scrap}</p></CardContent></Card>
            </div>

            {/* Record Production Output */}
            {wo.status === 'In Progress' && onUpdateOutput && (
              <Card className="border-primary/30">
                <CardContent className="p-3 space-y-3">
                  <p className="text-xs font-semibold">Record Production Output</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-[10px]">Good Units</Label>
                      <Input type="number" min={0} max={wo.quantity} value={goodInput} onChange={e => setGoodInput(Number(e.target.value))} className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-[10px]">Scrap</Label>
                      <Input type="number" min={0} value={scrapInput} onChange={e => setScrapInput(Number(e.target.value))} className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-[10px]">Rework</Label>
                      <Input type="number" min={0} value={reworkInput} onChange={e => setReworkInput(Number(e.target.value))} className="h-8 text-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground">Total: {goodInput + scrapInput + reworkInput} / {wo.quantity}</p>
                    <Button size="sm" disabled={goodInput <= 0} onClick={() => {
                      onUpdateOutput(wo.id, goodInput, scrapInput, reworkInput);
                      setGoodInput(0); setScrapInput(0); setReworkInput(0);
                    }}>
                      <Save className="h-3.5 w-3.5 mr-1" />Save Output
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Stage</TableHead>
                  <TableHead className="text-xs">Entered</TableHead>
                  <TableHead className="text-xs">Exited</TableHead>
                  <TableHead className="text-xs">Duration</TableHead>
                  <TableHead className="text-xs">By</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {wo.stageHistory.map((sh, i) => (
                    <TableRow key={i}>
                      <TableCell><Badge className={`text-[10px] ${stageColors[sh.stage]}`}>{sh.stage}</Badge></TableCell>
                      <TableCell className="text-xs">{sh.enteredAt}</TableCell>
                      <TableCell className="text-xs">{sh.exitedAt || '—'}</TableCell>
                      <TableCell className="text-xs">{sh.duration ? `${sh.duration}h` : '—'}</TableCell>
                      <TableCell className="text-xs">{sh.completedBy || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          {/* TAB 3: Materials */}
          <TabsContent value="materials" className="space-y-3">
            {wo.materials.length > 0 ? (
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Material</TableHead>
                  <TableHead className="text-xs text-right">Required</TableHead>
                  <TableHead className="text-xs text-right">Consumed</TableHead>
                  <TableHead className="text-xs text-right">Remaining</TableHead>
                  <TableHead className="text-xs text-right">Est. Cost</TableHead>
                  <TableHead className="text-xs text-right">Act. Cost</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {wo.materials.map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="text-xs"><div><p className="font-medium">{m.itemName}</p><p className="text-[10px] text-muted-foreground">{m.itemCode}</p></div></TableCell>
                      <TableCell className="text-xs text-right">{m.quantityRequired} {m.unit}</TableCell>
                      <TableCell className="text-xs text-right">{m.quantityConsumed} {m.unit}</TableCell>
                      <TableCell className="text-xs text-right">{m.quantityRemaining} {m.unit}</TableCell>
                      <TableCell className="text-xs text-right font-mono">{formatETBShort(m.estimatedTotalCost)}</TableCell>
                      <TableCell className="text-xs text-right font-mono">{formatETBShort(m.actualTotalCost)}</TableCell>
                      <TableCell>{m.fullyConsumed ? <Badge className="text-[10px] bg-success/10 text-success">Done</Badge> : <Badge className="text-[10px] bg-warning/10 text-warning">In Progress</Badge>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No materials tracked for this work order</p>
            )}
          </TabsContent>

          {/* TAB 4: Labor */}
          <TabsContent value="labor" className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Est. Hours</p><p className="text-lg font-bold">{wo.estimated.hours}h</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Act. Hours</p><p className="text-lg font-bold">{wo.actual.hours}h</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Labor Cost</p><p className="text-lg font-bold">{formatETBShort(wo.actual.laborCost)}</p></CardContent></Card>
            </div>
            {wo.laborEntries.length > 0 ? (
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Worker</TableHead>
                  <TableHead className="text-xs">Stage</TableHead>
                  <TableHead className="text-xs">Task</TableHead>
                  <TableHead className="text-xs text-right">Hours</TableHead>
                  <TableHead className="text-xs text-right">Cost</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {wo.laborEntries.map(le => (
                    <TableRow key={le.id}>
                      <TableCell className="text-xs">{le.date}</TableCell>
                      <TableCell className="text-xs">{le.workerName}</TableCell>
                      <TableCell><Badge className={`text-[10px] ${stageColors[le.stage]}`}>{le.stage}</Badge></TableCell>
                      <TableCell className="text-xs">{le.task}</TableCell>
                      <TableCell className="text-xs text-right">{le.hours}h</TableCell>
                      <TableCell className="text-xs text-right font-mono">{formatETBFull(le.totalCost)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No labor entries recorded</p>
            )}
          </TabsContent>

          {/* TAB 5: Cutting */}
          <TabsContent value="cutting" className="space-y-3">
            {wo.cuttingJobs.length > 0 ? (
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Job #</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Material Used</TableHead>
                  <TableHead className="text-xs text-right">Waste</TableHead>
                  <TableHead className="text-xs">Completed</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {wo.cuttingJobs.map(cj => (
                    <TableRow key={cj.cuttingJobId}>
                      <TableCell className="text-xs font-mono">{cj.cuttingJobNumber}</TableCell>
                      <TableCell><Badge className={`text-[10px] ${cj.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{cj.status}</Badge></TableCell>
                      <TableCell className="text-xs text-right">{cj.materialUsed}mm</TableCell>
                      <TableCell className="text-xs text-right">{cj.wasteGenerated}mm</TableCell>
                      <TableCell className="text-xs">{cj.completedAt || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No cutting jobs linked</p>
            )}
          </TabsContent>

          {/* TAB 6: Quality */}
          <TabsContent value="quality" className="space-y-3">
            {wo.qualityChecks.length > 0 ? (
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Check #</TableHead>
                  <TableHead className="text-xs">Stage</TableHead>
                  <TableHead className="text-xs">Result</TableHead>
                  <TableHead className="text-xs">Inspector</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Notes</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {wo.qualityChecks.map(qc => (
                    <TableRow key={qc.checkId}>
                      <TableCell className="text-xs font-mono">{qc.checkNumber}</TableCell>
                      <TableCell><Badge className={`text-[10px] ${stageColors[qc.stage]}`}>{qc.stage}</Badge></TableCell>
                      <TableCell><Badge className={`text-[10px] ${qc.result === 'pass' ? 'bg-success/10 text-success' : qc.result === 'fail' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>{qc.result}</Badge></TableCell>
                      <TableCell className="text-xs">{qc.checkedBy}</TableCell>
                      <TableCell className="text-xs">{qc.checkedAt}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{qc.notes || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No quality checks recorded</p>
            )}
          </TabsContent>

          {/* TAB 7: Costs */}
          <TabsContent value="costs" className="space-y-3">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs text-right">Estimated</TableHead>
                <TableHead className="text-xs text-right">Actual</TableHead>
                <TableHead className="text-xs text-right">Variance</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {[
                  { label: 'Materials', est: wo.estimated.materialCost, act: wo.actual.materialCost },
                  { label: 'Labor', est: wo.estimated.laborCost, act: wo.actual.laborCost },
                  { label: 'Overhead', est: wo.estimated.overheadCost, act: wo.actual.overheadCost },
                  { label: 'TOTAL', est: wo.estimated.totalCost, act: wo.actual.totalCost },
                ].map(row => {
                  const variance = row.est - row.act;
                  return (
                    <TableRow key={row.label} className={row.label === 'TOTAL' ? 'font-bold bg-muted/30' : ''}>
                      <TableCell className="text-xs">{row.label}</TableCell>
                      <TableCell className="text-xs text-right font-mono">{formatETBFull(row.est)}</TableCell>
                      <TableCell className="text-xs text-right font-mono">{formatETBFull(row.act)}</TableCell>
                      <TableCell className={`text-xs text-right font-mono ${variance >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {variance >= 0 ? '+' : ''}{formatETBFull(variance)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          {/* TAB 8: Issues */}
          <TabsContent value="issues" className="space-y-3">
            {wo.issues.length > 0 ? (
              wo.issues.map(issue => (
                <Card key={issue.id}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono">{issue.issueNumber}</span>
                          <Badge className={`text-[10px] ${issue.severity === 'Critical' || issue.severity === 'High' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>{issue.severity}</Badge>
                          <Badge className={`text-[10px] ${issue.resolved ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{issue.resolved ? 'Resolved' : 'Open'}</Badge>
                        </div>
                        <p className="text-sm font-medium mt-1">{issue.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{issue.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
                      <span>Type: <strong>{issue.type.replace(/_/g, ' ')}</strong></span>
                      <span>Delay: <strong>{issue.estimatedDelay}h</strong></span>
                      <span>Cost: <strong>{formatETBFull(issue.costImpact)}</strong></span>
                    </div>
                    {issue.resolution && <p className="text-[10px] text-success mt-1">Resolution: {issue.resolution}</p>}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No issues reported</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
