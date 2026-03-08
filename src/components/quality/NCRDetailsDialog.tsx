import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NCR } from "@/data/enhancedQualityData";
import { getNCRStatusColor, getDefectSeverityColor, formatETB } from "@/data/enhancedQualityData";

interface Props {
  ncr: NCR | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NCRDetailsDialog({ ncr, open, onOpenChange }: Props) {
  if (!ncr) return null;
  const n = ncr;
  const daysOpen = Math.ceil((new Date(n.closureDate || new Date()).getTime() - new Date(n.reportedDate).getTime()) / 86400000);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {n.ncrNumber}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${getNCRStatusColor(n.status)}`}>{n.status.replace('_', ' ')}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${getDefectSeverityColor(n.severity)}`}>{n.severity}</span>
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="investigation" className="text-xs">Investigation</TabsTrigger>
            <TabsTrigger value="capa" className="text-xs">CAPA</TabsTrigger>
            <TabsTrigger value="disposition" className="text-xs">Disposition</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-3">
            <h3 className="text-sm font-semibold">{n.title}</h3>
            <p className="text-xs text-muted-foreground">{n.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Reported By</p><p className="text-sm">{n.reportedByName}</p><p className="text-[10px] text-muted-foreground">{n.reportedDate}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Days Open</p><p className="text-sm font-bold">{daysOpen}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Qty Affected</p><p className="text-sm">{n.quantityAffected} {n.quantityUnit}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Cost Impact</p><p className="text-sm font-bold">{formatETB(n.costImpact)}</p></CardContent></Card>
            </div>
            <div className="text-xs space-y-1">
              {n.productName && <p><span className="text-muted-foreground">Product:</span> {n.productName}</p>}
              {n.supplierName && <p><span className="text-muted-foreground">Supplier:</span> {n.supplierName}</p>}
              {n.customerName && <p><span className="text-muted-foreground">Customer:</span> {n.customerName}</p>}
              {n.inspectionNumber && <p><span className="text-muted-foreground">Inspection:</span> <span className="font-mono">{n.inspectionNumber}</span></p>}
            </div>
          </TabsContent>

          <TabsContent value="investigation" className="space-y-3 mt-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Status:</span>
              <Badge variant="outline" className="text-[10px] capitalize">{n.investigationStatus.replace('_', ' ')}</Badge>
            </div>
            {n.investigationSummary && <div className="p-3 bg-muted rounded-lg text-xs"><p className="font-medium mb-1">Summary</p>{n.investigationSummary}</div>}
            {n.rootCause && <div className="p-3 border rounded-lg text-xs"><p className="font-medium mb-1">Root Cause</p><p>{n.rootCause}</p>{n.rootCauseCategory && <Badge variant="outline" className="text-[10px] mt-1 capitalize">{n.rootCauseCategory}</Badge>}</div>}
            {!n.rootCause && <p className="text-sm text-muted-foreground text-center py-4">Investigation pending</p>}
          </TabsContent>

          <TabsContent value="capa" className="space-y-3 mt-3">
            {n.capaRequired ? (
              <>
                {n.capaNumber && <p className="text-xs"><span className="text-muted-foreground">CAPA #:</span> <span className="font-mono">{n.capaNumber}</span></p>}
                {n.preventiveAction && <div className="p-3 bg-muted rounded-lg text-xs"><p className="font-medium mb-1">Preventive Action</p>{n.preventiveAction}</div>}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Verification:</span>
                  <Badge variant="outline" className="text-[10px] capitalize">{n.verificationStatus}</Badge>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No CAPA required</p>
            )}
          </TabsContent>

          <TabsContent value="disposition" className="space-y-3 mt-3">
            <Card><CardContent className="p-3">
              <p className="text-[10px] text-muted-foreground">Immediate Action</p>
              <p className="text-sm font-medium capitalize">{n.immediateAction.replace(/_/g, ' ')}</p>
              {n.quarantineLocation && <p className="text-[10px] text-muted-foreground mt-1">Location: {n.quarantineLocation}</p>}
            </CardContent></Card>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-muted-foreground">Cost Impact:</span> <span className="font-bold">{formatETB(n.costImpact)}</span></div>
              <div><span className="text-muted-foreground">Time Impact:</span> <span className="font-bold">{n.timeImpact}h</span></div>
              {n.scrapValue != null && <div><span className="text-muted-foreground">Scrap Value:</span> <span>{formatETB(n.scrapValue)}</span></div>}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-2 mt-3">
            {n.activityLog.map((a, idx) => (
              <div key={idx} className="p-2 border rounded-lg text-xs flex gap-2">
                <span className="text-muted-foreground shrink-0">{a.date}</span>
                <div><span className="font-medium">{a.userName}</span> — {a.action}{a.notes && <span className="text-muted-foreground"> · {a.notes}</span>}</div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
