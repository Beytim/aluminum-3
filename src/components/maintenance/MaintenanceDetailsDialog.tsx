import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Wrench, Calendar, Clock, Users, AlertTriangle, CheckCircle } from "lucide-react";
import type { EnhancedMaintenanceTask } from "@/data/enhancedMaintenanceData";
import { getStatusColor, getStatusLabel, getPriorityColor, getTypeColor, daysUntil, formatETB } from "@/data/enhancedMaintenanceData";

interface Props {
  task: EnhancedMaintenanceTask | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
}

export function MaintenanceDetailsDialog({ task, open, onOpenChange, onStart, onComplete }: Props) {
  if (!task) return null;
  const completedChecks = task.checklist.filter(c => c.completed).length;
  const days = daysUntil(task.scheduledDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                {task.taskNumber}
                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}>{getStatusLabel(task.status)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(task.type)}`}>{task.type}</span>
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{task.title}</p>
            </div>
            <div className="flex gap-2">
              {(task.status === 'scheduled' || task.status === 'pending_parts') && <Button size="sm" onClick={() => onStart(task.id)}>Start</Button>}
              {(task.status === 'in_progress' || task.status === 'overdue') && <Button size="sm" onClick={() => onComplete(task.id)}>Complete</Button>}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="checklist" className="text-xs">Checklist ({completedChecks}/{task.checklist.length})</TabsTrigger>
            <TabsTrigger value="parts" className="text-xs">Parts ({task.partsUsed.length})</TabsTrigger>
            <TabsTrigger value="labor" className="text-xs">Labor</TabsTrigger>
            <TabsTrigger value="downtime" className="text-xs">Downtime</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-3">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-3 space-y-2">
                  <h4 className="text-xs font-semibold">Equipment</h4>
                  <p className="text-sm font-medium">{task.equipmentName}</p>
                  <p className="text-[10px] text-muted-foreground">{task.equipmentNumber} · {task.equipmentCategory.replace('_', ' ')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 space-y-2">
                  <h4 className="text-xs font-semibold">Schedule</h4>
                  <p className="text-sm flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{task.scheduledDate}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Est. {task.scheduledDuration}hrs</p>
                  {task.status !== 'completed' && task.status !== 'cancelled' && (
                    <p className={`text-xs ${days < 0 ? 'text-destructive' : days <= 2 ? 'text-warning' : 'text-muted-foreground'}`}>
                      {days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? 'Due today' : `${days} days away`}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-3 space-y-2">
                <h4 className="text-xs font-semibold">Assignment</h4>
                <p className="text-sm flex items-center gap-1"><Users className="h-3.5 w-3.5" />{task.assignedToNames.join(', ')}</p>
                {task.leadTechnician && <p className="text-[10px] text-muted-foreground">Lead: {task.leadTechnician}</p>}
              </CardContent>
            </Card>

            {task.description && (
              <Card>
                <CardContent className="p-3">
                  <h4 className="text-xs font-semibold mb-1">Description</h4>
                  <p className="text-xs text-muted-foreground">{task.description}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-3 gap-3">
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Parts Cost</p><p className="text-sm font-bold">{formatETB(task.partsCost)}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Labor Cost</p><p className="text-sm font-bold">{formatETB(task.laborCost)}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Total Cost</p><p className="text-sm font-bold">{formatETB(task.totalCost)}</p></CardContent></Card>
            </div>

            {task.issuesFound && task.issuesFound.length > 0 && (
              <Card>
                <CardContent className="p-3">
                  <h4 className="text-xs font-semibold mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-warning" />Issues Found</h4>
                  <ul className="list-disc list-inside text-xs text-muted-foreground">
                    {task.issuesFound.map((i, idx) => <li key={idx}>{i}</li>)}
                  </ul>
                  {task.rootCause && <p className="text-xs text-muted-foreground mt-1"><strong>Root Cause:</strong> {task.rootCause}</p>}
                  {task.correctiveAction && <p className="text-xs text-muted-foreground"><strong>Corrective Action:</strong> {task.correctiveAction}</p>}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="checklist" className="mt-3">
            {task.checklist.length > 0 ? (
              <div className="space-y-2">
                {task.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 border rounded-md">
                    <Checkbox checked={item.completed} disabled />
                    <span className={`text-xs ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{item.item}</span>
                    {item.completed && <CheckCircle className="h-3 w-3 text-success ml-auto" />}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">{completedChecks}/{task.checklist.length} completed</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">No checklist items</p>
            )}
          </TabsContent>

          <TabsContent value="parts" className="mt-3">
            {task.partsUsed.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Part</TableHead>
                    <TableHead className="text-xs">Code</TableHead>
                    <TableHead className="text-xs">Qty</TableHead>
                    <TableHead className="text-xs">Unit Cost</TableHead>
                    <TableHead className="text-xs">Total</TableHead>
                    <TableHead className="text-xs">Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {task.partsUsed.map(p => (
                    <TableRow key={p.partId}>
                      <TableCell className="text-xs">{p.partName}</TableCell>
                      <TableCell className="text-xs font-mono">{p.partCode}</TableCell>
                      <TableCell className="text-xs">{p.quantity}</TableCell>
                      <TableCell className="text-xs">{formatETB(p.unitCost)}</TableCell>
                      <TableCell className="text-xs font-medium">{formatETB(p.totalCost)}</TableCell>
                      <TableCell><span className={`text-[10px] px-2 py-0.5 rounded-full ${p.fromStock ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{p.fromStock ? 'Stock' : 'Ordered'}</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">No parts used</p>
            )}
          </TabsContent>

          <TabsContent value="labor" className="mt-3 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Hours</p><p className="text-lg font-bold">{task.laborHours}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Rate</p><p className="text-lg font-bold">ETB {task.laborRate}/hr</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Total</p><p className="text-lg font-bold">{formatETB(task.laborCost)}</p></CardContent></Card>
            </div>
            {task.technicianNotes && (
              <Card><CardContent className="p-3"><h4 className="text-xs font-semibold mb-1">Technician Notes</h4><p className="text-xs text-muted-foreground">{task.technicianNotes}</p></CardContent></Card>
            )}
          </TabsContent>

          <TabsContent value="downtime" className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Downtime</p><p className="text-lg font-bold">{task.downtimeHours || 0} hrs</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Impact</p><p className="text-sm font-medium capitalize">{task.productionImpact || 'None'}</p></CardContent></Card>
            </div>
            {task.affectedWorkOrders && task.affectedWorkOrders.length > 0 && (
              <Card><CardContent className="p-3"><h4 className="text-xs font-semibold mb-1">Affected Work Orders</h4><div className="flex flex-wrap gap-1">{task.affectedWorkOrders.map(wo => <span key={wo} className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning">{wo}</span>)}</div></CardContent></Card>
            )}
            {task.affectedProjects && task.affectedProjects.length > 0 && (
              <Card><CardContent className="p-3"><h4 className="text-xs font-semibold mb-1">Affected Projects</h4><div className="flex flex-wrap gap-1">{task.affectedProjects.map(p => <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-info/10 text-info">{p}</span>)}</div></CardContent></Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-3">
            <div className="space-y-2">
              {task.activityLog.map((a, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs">{a.action}</p>
                    <p className="text-[10px] text-muted-foreground">{a.userName} · {a.date}</p>
                    {a.notes && <p className="text-[10px] text-muted-foreground italic">{a.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
