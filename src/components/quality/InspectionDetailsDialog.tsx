import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import type { EnhancedInspection } from "@/data/enhancedQualityData";
import { getInspectionResultColor, getInspectionTypeLabel, getDefectSeverityColor } from "@/data/enhancedQualityData";

interface Props {
  inspection: EnhancedInspection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InspectionDetailsDialog({ inspection, open, onOpenChange }: Props) {
  if (!inspection) return null;
  const i = inspection;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {i.inspectionNumber}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${getInspectionResultColor(i.result)}`}>{i.result}</span>
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="checklist" className="text-xs">Checklist</TabsTrigger>
            <TabsTrigger value="defects" className="text-xs">Defects ({i.defectCount})</TabsTrigger>
            <TabsTrigger value="measurements" className="text-xs">Measurements</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Type</p><p className="text-sm font-medium">{getInspectionTypeLabel(i.type)}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Score</p><p className="text-sm font-medium">{i.score != null ? `${i.score}%` : 'N/A'}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Product</p><p className="text-sm font-medium">{i.productName}</p>{i.productCode && <p className="text-[10px] text-muted-foreground">{i.productCode}</p>}</CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Inspector</p><p className="text-sm font-medium">{i.inspectorName}</p></CardContent></Card>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {i.workOrderNumber && <div><span className="text-muted-foreground">Work Order:</span> <span className="font-mono">{i.workOrderNumber}</span></div>}
              {i.purchaseOrderNumber && <div><span className="text-muted-foreground">PO:</span> <span className="font-mono">{i.purchaseOrderNumber}</span></div>}
              {i.projectName && <div><span className="text-muted-foreground">Project:</span> {i.projectName}</div>}
              {i.supplierName && <div><span className="text-muted-foreground">Supplier:</span> {i.supplierName}</div>}
              {i.ncrNumber && <div><span className="text-muted-foreground">NCR:</span> <span className="font-mono text-destructive">{i.ncrNumber}</span></div>}
            </div>
            {i.notes && <div className="p-3 bg-muted rounded-lg text-xs">{i.notes}</div>}
          </TabsContent>

          <TabsContent value="checklist" className="space-y-2 mt-3">
            {i.checklistResults.map(cr => (
              <div key={cr.itemId} className="flex items-center gap-2 p-2 border rounded-lg">
                {cr.passed ? <CheckCircle className="h-4 w-4 text-success shrink-0" /> : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
                <span className="text-xs flex-1">{cr.description}</span>
                {cr.actualValue && <Badge variant="outline" className="text-[10px]">{cr.actualValue}</Badge>}
                {cr.notes && <span className="text-[10px] text-muted-foreground">{cr.notes}</span>}
              </div>
            ))}
            {i.checklistResults.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No checklist data</p>}
          </TabsContent>

          <TabsContent value="defects" className="space-y-2 mt-3">
            {i.defects.map(d => (
              <Card key={d.id}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium">{d.description}</p>
                      <div className="flex gap-1 mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getDefectSeverityColor(d.severity)}`}>{d.severity}</span>
                        <Badge variant="outline" className="text-[10px] capitalize">{d.category}</Badge>
                        <Badge variant="outline" className="text-[10px] capitalize">{d.disposition.replace(/_/g, ' ')}</Badge>
                      </div>
                    </div>
                    {d.resolved ? <CheckCircle className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
                  </div>
                  {d.costImpact && <p className="text-[10px] text-muted-foreground mt-1">Cost: ETB {d.costImpact.toLocaleString()}</p>}
                </CardContent>
              </Card>
            ))}
            {i.defects.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No defects found</p>}
          </TabsContent>

          <TabsContent value="measurements" className="space-y-2 mt-3">
            {i.measurements?.map((m, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 border rounded-lg">
                {m.passed ? <CheckCircle className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />}
                <span className="text-xs font-medium flex-1">{m.parameter}</span>
                <span className="text-[10px] text-muted-foreground">Spec: {m.specification}</span>
                <Badge variant={m.passed ? 'outline' : 'destructive'} className="text-[10px]">{m.actual}</Badge>
              </div>
            ))}
            {(!i.measurements || i.measurements.length === 0) && <p className="text-sm text-muted-foreground text-center py-4">No measurements recorded</p>}
          </TabsContent>

          <TabsContent value="history" className="space-y-2 mt-3">
            <div className="space-y-2 text-xs">
              <div className="p-2 border rounded-lg"><span className="text-muted-foreground">{i.createdAt}</span> — Created by {i.createdByName}</div>
              {i.completedDate && <div className="p-2 border rounded-lg"><span className="text-muted-foreground">{i.completedDate}</span> — Completed</div>}
              <div className="p-2 border rounded-lg"><span className="text-muted-foreground">{i.updatedAt}</span> — Last updated by {i.updatedByName}</div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
