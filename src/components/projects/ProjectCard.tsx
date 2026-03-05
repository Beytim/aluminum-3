import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2, Calendar, User, AlertTriangle, Clock } from "lucide-react";
import type { EnhancedProject } from "@/data/enhancedProjectData";
import { projectStatusColors, projectTypeColors, formatETBShort, getDaysRemaining } from "@/data/enhancedProjectData";

interface Props {
  project: EnhancedProject;
  language: 'en' | 'am';
  onView: (p: EnhancedProject) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project: p, language, onView, onDelete }: Props) {
  const daysLeft = getDaysRemaining(p.dueDate);
  const dueDateColor = p.status === 'Completed' ? 'text-success' : daysLeft < 0 ? 'text-destructive' : daysLeft < 14 ? 'text-warning' : 'text-muted-foreground';

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer group" onClick={() => onView(p)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-mono text-muted-foreground">{p.projectNumber}</p>
              <Badge className={`text-[9px] h-4 px-1.5 ${projectTypeColors[p.type]}`}>{p.type}</Badge>
            </div>
            <h3 className="text-sm font-semibold mt-0.5 truncate">{language === 'am' ? p.nameAm : p.name}</h3>
            <p className="text-[10px] text-muted-foreground">{p.customerName}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Badge className={`text-[10px] ${projectStatusColors[p.status]}`}>{p.status}</Badge>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => { e.stopPropagation(); onDelete(p.id); }}>
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        </div>

        {(p.isOverdue || p.isAtRisk) && (
          <div className="flex items-center gap-1.5">
            {p.isOverdue && <Badge variant="destructive" className="text-[9px] h-4"><AlertTriangle className="h-2.5 w-2.5 mr-0.5" />Overdue</Badge>}
            {p.isAtRisk && !p.isOverdue && <Badge className="text-[9px] h-4 bg-warning/10 text-warning"><Clock className="h-2.5 w-2.5 mr-0.5" />At Risk</Badge>}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 text-[10px] pt-2 border-t">
          <div>
            <span className="text-muted-foreground">Value</span>
            <p className="font-semibold text-foreground">{formatETBShort(p.value)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Deposit</span>
            <p className="font-semibold text-success">{formatETBShort(p.deposit)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Balance</span>
            <p className="font-semibold text-warning">{formatETBShort(p.balance)}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{p.progress}%</span>
          </div>
          <Progress value={p.progress} className="h-1.5" />
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className={`flex items-center gap-0.5 ${dueDateColor}`}>
            <Calendar className="h-2.5 w-2.5" />
            {p.dueDate}
            {p.status !== 'Completed' && <span className="ml-0.5">({daysLeft > 0 ? `${daysLeft}d left` : `${Math.abs(daysLeft)}d late`})</span>}
          </span>
          <span className="flex items-center gap-0.5">
            <User className="h-2.5 w-2.5" />
            {p.projectManager.split(' ')[0]}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
