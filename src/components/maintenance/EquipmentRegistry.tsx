import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye } from "lucide-react";
import { useState } from "react";
import type { Equipment } from "@/data/enhancedMaintenanceData";
import { getEquipmentStatusColor, getHealthColor } from "@/data/enhancedMaintenanceData";

interface Props {
  equipment: Equipment[];
  onView: (eq: Equipment) => void;
}

export function EquipmentRegistry({ equipment, onView }: Props) {
  const [search, setSearch] = useState('');
  const filtered = equipment.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.equipmentNumber.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Search equipment..." className="pl-8 h-8 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map(eq => (
          <Card key={eq.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(eq)}>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono text-muted-foreground">{eq.equipmentNumber}</p>
                  <h4 className="text-sm font-semibold text-foreground">{eq.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{eq.manufacturer} {eq.model}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${getEquipmentStatusColor(eq.status)}`}>
                  {eq.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">{eq.department} · {eq.location}</span>
                <span className={`font-bold ${getHealthColor(eq.healthScore)}`}>{eq.healthScore}%</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{eq.totalOperatingHours.toLocaleString()} hrs</span>
                <span>Next: {eq.maintenanceFrequency.nextDue || 'N/A'}</span>
              </div>
              <div className="flex justify-end">
                <Button size="sm" variant="ghost" className="text-[10px] h-6 px-2" onClick={e => { e.stopPropagation(); onView(eq); }}>
                  <Eye className="h-3 w-3 mr-1" />Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
