import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { MapPin, Calendar, Users, Clock, AlertTriangle, Star, CheckCircle, Phone, Mail } from "lucide-react";
import type { EnhancedInstallation } from "@/data/enhancedInstallationData";
import { getStatusColor, getStatusLabel, getPriorityColor, getSeverityColor, daysUntil } from "@/data/enhancedInstallationData";

interface Props {
  installation: EnhancedInstallation | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
}

export function InstallationDetailsDialog({ installation: inst, open, onOpenChange, onStart, onComplete }: Props) {
  if (!inst) return null;

  const totalItems = inst.items.reduce((s, i) => s + i.quantity, 0);
  const installed = inst.items.reduce((s, i) => s + i.installedQuantity, 0);
  const progress = totalItems > 0 ? Math.round((installed / totalItems) * 100) : 0;
  const days = daysUntil(inst.scheduledDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                {inst.installationNumber}
                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(inst.status)}`}>{getStatusLabel(inst.status)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(inst.priority)}`}>{inst.priority}</span>
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{inst.customerName} — {inst.projectName || 'No project'}</p>
            </div>
            <div className="flex gap-2">
              {(inst.status === 'scheduled' || inst.status === 'confirmed') && (
                <Button size="sm" onClick={() => onStart(inst.id)}>Start</Button>
              )}
              {(inst.status === 'in_progress' || inst.status === 'partial') && (
                <Button size="sm" onClick={() => onComplete(inst.id)}>Complete</Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="items" className="text-xs">Items ({inst.items.length})</TabsTrigger>
            <TabsTrigger value="team" className="text-xs">Team ({inst.teamSize})</TabsTrigger>
            <TabsTrigger value="issues" className="text-xs">Issues ({inst.issueCount})</TabsTrigger>
            <TabsTrigger value="photos" className="text-xs">Photos</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-3">
            {/* Customer & Site */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-3 space-y-2">
                  <h4 className="text-xs font-semibold text-foreground">Customer</h4>
                  <p className="text-sm font-medium">{inst.customerName}</p>
                  {inst.customerContact && <p className="text-xs text-muted-foreground">{inst.customerContact}</p>}
                  <div className="flex flex-col gap-1">
                    {inst.customerPhone && <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{inst.customerPhone}</span>}
                    {inst.customerEmail && <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{inst.customerEmail}</span>}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 space-y-2">
                  <h4 className="text-xs font-semibold text-foreground">Site</h4>
                  <p className="text-sm flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{inst.siteAddress}</p>
                  {inst.siteContactPerson && <p className="text-xs text-muted-foreground">Contact: {inst.siteContactPerson} {inst.siteContactPhone}</p>}
                  {inst.accessInstructions && <p className="text-[10px] text-muted-foreground italic">{inst.accessInstructions}</p>}
                </CardContent>
              </Card>
            </div>

            {/* Schedule & Progress */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground">Schedule</p>
                  <p className="text-sm font-medium flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{inst.scheduledDate}</p>
                  {inst.scheduledStartTime && <p className="text-xs text-muted-foreground">{inst.scheduledStartTime} - {inst.scheduledEndTime || 'TBD'}</p>}
                  {inst.status !== 'completed' && inst.status !== 'cancelled' && (
                    <p className={`text-xs mt-1 ${days < 0 ? 'text-destructive' : days <= 2 ? 'text-warning' : 'text-muted-foreground'}`}>
                      {days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? 'Today' : `${days} days away`}
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground">Progress</p>
                  <p className="text-lg font-bold">{progress}%</p>
                  <p className="text-xs text-muted-foreground">{installed}/{totalItems} items installed</p>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Est. {inst.estimatedDuration}hrs</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Users className="h-3 w-3" />{inst.teamLead} · {inst.teamSize} members</p>
                </CardContent>
              </Card>
            </div>

            {/* Customer Feedback */}
            {inst.customerRating && (
              <Card>
                <CardContent className="p-3">
                  <h4 className="text-xs font-semibold mb-1">Customer Feedback</h4>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`h-4 w-4 ${s <= (inst.customerRating || 0) ? 'text-warning fill-warning' : 'text-muted'}`} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">{inst.customerRating}/5</span>
                  </div>
                  {inst.customerFeedback && <p className="text-xs text-muted-foreground mt-1">{inst.customerFeedback}</p>}
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {inst.notes && (
              <Card>
                <CardContent className="p-3">
                  <h4 className="text-xs font-semibold mb-1">Notes</h4>
                  <p className="text-xs text-muted-foreground">{inst.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="items" className="mt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Product</TableHead>
                  <TableHead className="text-xs">Location</TableHead>
                  <TableHead className="text-xs">Qty</TableHead>
                  <TableHead className="text-xs">Installed</TableHead>
                  <TableHead className="text-xs">Remaining</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inst.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="text-xs font-medium">{item.productName}</p>
                      <p className="text-[10px] text-muted-foreground">{item.productCode}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.location || '-'}</TableCell>
                    <TableCell className="text-xs">{item.quantity}</TableCell>
                    <TableCell className="text-xs">{item.installedQuantity}</TableCell>
                    <TableCell className="text-xs">{item.remainingQuantity}</TableCell>
                    <TableCell>
                      {item.isInstalled ? (
                        <span className="text-[10px] text-success flex items-center gap-1"><CheckCircle className="h-3 w-3" />Done</span>
                      ) : item.installedQuantity > 0 ? (
                        <span className="text-[10px] text-warning">Partial</span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">Pending</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="team" className="mt-3 space-y-3">
            <Card>
              <CardContent className="p-3">
                <h4 className="text-xs font-semibold mb-2">Team Lead</h4>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{inst.teamLead}</p>
                    <p className="text-[10px] text-muted-foreground">Lead · {inst.teamLeadId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-2">
              {inst.teamMembers.map(m => (
                <div key={m.employeeId} className="flex items-center justify-between p-2 border rounded-md">
                  <div>
                    <p className="text-xs font-medium">{m.name} {m.nameAm && <span className="text-muted-foreground">({m.nameAm})</span>}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{m.role}</p>
                  </div>
                  <div className="text-right">
                    {m.phone && <p className="text-[10px] text-muted-foreground">{m.phone}</p>}
                    {m.hourlyRate && <p className="text-[10px] text-muted-foreground">ETB {m.hourlyRate}/hr</p>}
                  </div>
                </div>
              ))}
            </div>
            {inst.assignedVehicle && <p className="text-xs text-muted-foreground">🚗 {inst.assignedVehicle}</p>}
          </TabsContent>

          <TabsContent value="issues" className="mt-3">
            {inst.issues.length > 0 ? (
              <div className="space-y-2">
                {inst.issues.map(issue => (
                  <Card key={issue.id}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${getSeverityColor(issue.severity)}`}>{issue.severity}</span>
                            <span className="text-[10px] text-muted-foreground capitalize">{issue.category.replace('_', ' ')}</span>
                          </div>
                          <p className="text-xs mt-1">{issue.description}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">Reported by {issue.reportedByName} on {issue.reportedAt}</p>
                        </div>
                        {issue.resolved ? (
                          <Badge variant="outline" className="text-success border-success/30 text-[10px]">Resolved</Badge>
                        ) : (
                          <Badge variant="outline" className="text-destructive border-destructive/30 text-[10px]">Open</Badge>
                        )}
                      </div>
                      {issue.resolution && <p className="text-[10px] text-muted-foreground mt-2 border-t pt-2">Resolution: {issue.resolution}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">No issues reported</p>
            )}
          </TabsContent>

          <TabsContent value="photos" className="mt-3">
            {inst.completionPhotos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {inst.completionPhotos.map(p => (
                  <div key={p.id} className="border rounded-md p-2">
                    <p className="text-[10px] text-muted-foreground capitalize">{p.category}</p>
                    <p className="text-xs">{p.caption || 'No caption'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">No photos uploaded yet</p>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-3">
            <div className="space-y-2">
              {inst.activityLog.map((a, idx) => (
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
