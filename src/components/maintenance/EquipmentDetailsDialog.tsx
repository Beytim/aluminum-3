import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Activity, Calendar, MapPin, Clock } from "lucide-react";
import type { Equipment } from "@/data/enhancedMaintenanceData";
import { getEquipmentStatusColor, getHealthColor, formatETB } from "@/data/enhancedMaintenanceData";

interface Props {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function EquipmentDetailsDialog({ equipment: eq, open, onOpenChange }: Props) {
  if (!eq) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            {eq.equipmentNumber} — {eq.name}
            <span className={`text-xs px-2 py-0.5 rounded-full ${getEquipmentStatusColor(eq.status)}`}>{eq.status.replace('_', ' ')}</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{eq.manufacturer} {eq.model}</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Health Score</p><p className={`text-2xl font-bold ${getHealthColor(eq.healthScore)}`}>{eq.healthScore}%</p></CardContent></Card>
            <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Operating Hours</p><p className="text-2xl font-bold">{eq.totalOperatingHours.toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="p-3"><p className="text-[10px] text-muted-foreground">Purchase Cost</p><p className="text-2xl font-bold">{formatETB(eq.purchaseCost)}</p></CardContent></Card>
          </div>

          <Card>
            <CardContent className="p-3 space-y-2">
              <h4 className="text-xs font-semibold">Specifications</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Category:</span> <span className="capitalize">{eq.category.replace('_', ' ')}</span></div>
                <div><span className="text-muted-foreground">Serial #:</span> {eq.serialNumber}</div>
                <div><span className="text-muted-foreground">Year:</span> {eq.yearOfManufacture}</div>
                <div><span className="text-muted-foreground">Criticality:</span> <span className="capitalize font-medium">{eq.criticality}</span></div>
                {eq.powerRating && <div><span className="text-muted-foreground">Power:</span> {eq.powerRating}</div>}
                {eq.capacity && <div><span className="text-muted-foreground">Capacity:</span> {eq.capacity}</div>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 space-y-2">
              <h4 className="text-xs font-semibold">Location & Department</h4>
              <p className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{eq.location}</p>
              <p className="text-xs text-muted-foreground">Department: {eq.department}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 space-y-2">
              <h4 className="text-xs font-semibold">Maintenance Schedule</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Frequency:</span> Every {eq.maintenanceFrequency.value} {eq.maintenanceFrequency.type}</div>
                <div><span className="text-muted-foreground">Last Done:</span> {eq.maintenanceFrequency.lastDone || 'N/A'}</div>
                <div><span className="text-muted-foreground">Next Due:</span> <span className="font-medium">{eq.maintenanceFrequency.nextDue || 'N/A'}</span></div>
              </div>
            </CardContent>
          </Card>

          {eq.warrantyExpiry && (
            <Card>
              <CardContent className="p-3">
                <h4 className="text-xs font-semibold mb-1">Warranty</h4>
                <p className="text-xs text-muted-foreground">Expires: {eq.warrantyExpiry} {new Date(eq.warrantyExpiry) < new Date() ? '(Expired)' : '(Active)'}</p>
              </CardContent>
            </Card>
          )}

          {eq.notes && (
            <Card>
              <CardContent className="p-3">
                <h4 className="text-xs font-semibold mb-1">Notes</h4>
                <p className="text-xs text-muted-foreground">{eq.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
