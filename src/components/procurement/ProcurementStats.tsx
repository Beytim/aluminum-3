import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, AlertTriangle, Wallet, Clock, CheckCircle, Package, TrendingUp } from "lucide-react";
import { procFormatETBShort, type ProcurementStats as Stats } from "@/data/enhancedProcurementData";

interface Props { stats: Stats }

const cards = [
  { key: 'suppliers', label: 'Total Suppliers', icon: Users, color: 'bg-primary/10 text-primary', getValue: (s: Stats) => String(s.totalSuppliers), getSub: (s: Stats) => `${s.activeSuppliers} active · ${s.preferredSuppliers} preferred` },
  { key: 'openPOs', label: 'Open POs', icon: FileText, color: 'bg-warning/10 text-warning', getValue: (s: Stats) => String(s.openPOs), getSub: (s: Stats) => `${s.totalPOs} total POs` },
  { key: 'overdue', label: 'Overdue POs', icon: AlertTriangle, color: 'bg-destructive/10 text-destructive', getValue: (s: Stats) => String(s.overduePOs), getSub: () => 'Past expected delivery' },
  { key: 'spent', label: 'Spent MTD', icon: Wallet, color: 'bg-success/10 text-success', getValue: (s: Stats) => procFormatETBShort(s.totalSpentMTD), getSub: (s: Stats) => `YTD: ${procFormatETBShort(s.totalSpentYTD)}` },
  { key: 'leadTime', label: 'Avg Lead Time', icon: Clock, color: 'bg-info/10 text-info', getValue: (s: Stats) => `${s.avgLeadTime} days`, getSub: () => 'Across all suppliers' },
  { key: 'onTime', label: 'On-Time Delivery', icon: CheckCircle, color: 'bg-success/10 text-success', getValue: (s: Stats) => `${s.onTimeDeliveryRate}%`, getSub: () => 'Supplier average' },
  { key: 'reorder', label: 'Items to Reorder', icon: Package, color: 'bg-orange-500/10 text-orange-500', getValue: (s: Stats) => String(s.itemsToReorder), getSub: () => 'Below minimum stock' },
  { key: 'commitments', label: 'Outstanding', icon: TrendingUp, color: 'bg-warning/10 text-warning', getValue: (s: Stats) => procFormatETBShort(s.outstandingCommitments), getSub: () => 'Open PO commitments' },
];

export default function ProcurementStatsComponent({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map(c => (
        <Card key={c.key} className="shadow-card">
          <CardContent className="p-3 flex items-center gap-2.5">
            <div className={`h-9 w-9 rounded-lg ${c.color} flex items-center justify-center shrink-0`}>
              <c.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground truncate">{c.label}</p>
              <p className="text-sm font-bold truncate">{c.getValue(stats)}</p>
              <p className="text-[10px] text-muted-foreground truncate">{c.getSub(stats)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
