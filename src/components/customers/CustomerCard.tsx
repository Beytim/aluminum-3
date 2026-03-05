import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Eye, Pencil, Trash2, Phone, Mail } from "lucide-react";
import type { EnhancedCustomer } from "@/data/customerTypes";
import { formatETB, getRelativeTime, getHealthColor, getHealthBgColor } from "@/lib/customerHelpers";

interface Props {
  customer: EnhancedCustomer;
  language: 'en' | 'am';
  onView: (c: EnhancedCustomer) => void;
  onEdit: (c: EnhancedCustomer) => void;
  onDelete: (id: string) => void;
}

export function CustomerCard({ customer: c, language, onView, onEdit, onDelete }: Props) {
  const initials = c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all cursor-pointer group" onClick={() => onView(c)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getHealthBgColor(c.healthStatus)} ${getHealthColor(c.healthStatus)}`}>
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{language === 'am' ? c.nameAm : c.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{c.type}</Badge>
              <Badge variant={c.status === 'Active' ? 'default' : 'outline'} className="text-[10px] h-4 px-1.5">{c.status}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className={`h-2.5 w-2.5 rounded-full ${c.healthStatus === 'healthy' ? 'bg-success' : c.healthStatus === 'attention' ? 'bg-warning' : c.healthStatus === 'at-risk' ? 'bg-orange-500' : 'bg-destructive'}`} title={`Health: ${c.healthScore}`} />
            <span className="text-[10px] font-medium text-muted-foreground">{c.healthScore}</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] text-muted-foreground">Projects</p>
            <p className="text-xs font-semibold">{c.projects}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Total Value</p>
            <p className="text-xs font-semibold">{formatETB(c.totalValue)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Outstanding</p>
            <p className={`text-xs font-semibold ${c.outstanding > 0 ? 'text-warning' : 'text-success'}`}>{formatETB(c.outstanding)}</p>
          </div>
        </div>

        {c.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {c.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-[9px] h-4 px-1">{tag}</Badge>
            ))}
            {c.tags.length > 3 && <span className="text-[9px] text-muted-foreground">+{c.tags.length - 3}</span>}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t">
          <div className="text-[10px] text-muted-foreground">
            {c.lastActivityDate ? getRelativeTime(c.lastActivityDate) : 'No activity'}
          </div>
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={e => { e.stopPropagation(); onView(c); }}><Eye className="h-3 w-3" /></Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={e => { e.stopPropagation(); onEdit(c); }}><Pencil className="h-3 w-3" /></Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={e => { e.stopPropagation(); onDelete(c.id); }}><Trash2 className="h-3 w-3 text-destructive" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
