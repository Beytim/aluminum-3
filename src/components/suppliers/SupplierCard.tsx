import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Globe, Phone, Mail } from "lucide-react";
import type { Supplier } from "@/hooks/useSuppliers";

interface Props {
  supplier: Supplier;
  onClick: () => void;
}

const statusColor = (s: string) => {
  switch (s) {
    case 'Active': return 'bg-success/10 text-success';
    case 'Inactive': return 'bg-muted text-muted-foreground';
    case 'Blacklisted': return 'bg-destructive/10 text-destructive';
    case 'Pending': return 'bg-warning/10 text-warning';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default function SupplierCard({ supplier: s, onClick }: Props) {
  return (
    <Card className="shadow-card hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-sm">{s.company_name}</p>
            {s.company_name_am && <p className="text-[10px] text-muted-foreground">{s.company_name_am}</p>}
            <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{s.supplier_code}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(s.status)}`}>{s.status}</span>
            {s.preferred && <Badge className="text-[9px] bg-success/10 text-success border-0">Preferred</Badge>}
          </div>
        </div>

        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < Math.round(s.rating) ? 'text-warning fill-warning' : 'text-muted'}`} />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">{s.rating.toFixed(1)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="flex items-center gap-1 text-muted-foreground"><Globe className="h-3 w-3" />{s.country}{s.city ? `, ${s.city}` : ''}</div>
          <div className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{s.phone || '—'}</div>
          <div className="flex items-center gap-1 text-muted-foreground"><Mail className="h-3 w-3" />{s.email || '—'}</div>
          <div className="text-muted-foreground">Lead: {s.average_lead_time}d</div>
        </div>

        <div className="flex flex-wrap gap-1">
          {(s.product_categories || []).slice(0, 3).map(c => <Badge key={c} variant="outline" className="text-[9px]">{c}</Badge>)}
          {(s.product_categories || []).length > 3 && <span className="text-[9px] text-muted-foreground">+{s.product_categories.length - 3}</span>}
        </div>

        <div className="flex justify-between text-[10px] text-muted-foreground border-t pt-2">
          <span>{s.business_type}</span>
          <span>{s.total_orders} orders · ETB {s.total_spent.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
