import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Pencil, Trash2, AlertTriangle, Clock } from "lucide-react";
import type { EnhancedProject } from "@/data/enhancedProjectData";
import { projectStatusColors, projectTypeColors, formatETBShort, getDaysRemaining } from "@/data/enhancedProjectData";

interface Props {
  projects: EnhancedProject[];
  language: 'en' | 'am';
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  allSelected: boolean;
  onView: (p: EnhancedProject) => void;
  onEdit: (p: EnhancedProject) => void;
  onDelete: (id: string) => void;
}

export function ProjectTable({ projects, language, selectedIds, onToggleSelect, onToggleAll, allSelected, onView, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 px-2"><Checkbox checked={allSelected} onCheckedChange={onToggleAll} /></TableHead>
            <TableHead className="text-xs">#</TableHead>
            <TableHead className="text-xs">Project</TableHead>
            <TableHead className="text-xs hidden sm:table-cell">Customer</TableHead>
            <TableHead className="text-xs hidden md:table-cell">Type</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs text-right hidden sm:table-cell">Value</TableHead>
            <TableHead className="text-xs text-right hidden lg:table-cell">Deposit</TableHead>
            <TableHead className="text-xs text-right hidden lg:table-cell">Balance</TableHead>
            <TableHead className="text-xs hidden md:table-cell">Progress</TableHead>
            <TableHead className="text-xs hidden lg:table-cell">Due Date</TableHead>
            <TableHead className="text-xs hidden xl:table-cell">PM</TableHead>
            <TableHead className="text-xs w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(p => {
            const daysLeft = getDaysRemaining(p.dueDate);
            const dueDateColor = p.status === 'Completed' ? 'text-success' : daysLeft < 0 ? 'text-destructive font-medium' : daysLeft < 14 ? 'text-warning' : '';
            return (
              <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onView(p)}>
                <TableCell className="px-2" onClick={e => e.stopPropagation()}>
                  <Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => onToggleSelect(p.id)} />
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{p.projectNumber}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs font-medium">{language === 'am' ? p.nameAm : p.name}</p>
                    <p className="text-[10px] text-muted-foreground sm:hidden">{p.customerName}</p>
                  </div>
                </TableCell>
                <TableCell className="text-xs hidden sm:table-cell">{p.customerName}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge className={`text-[9px] ${projectTypeColors[p.type]}`}>{p.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Badge className={`text-[9px] ${projectStatusColors[p.status]}`}>{p.status}</Badge>
                    {p.isOverdue && <AlertTriangle className="h-3 w-3 text-destructive" />}
                    {p.isAtRisk && !p.isOverdue && <Clock className="h-3 w-3 text-warning" />}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-right font-medium hidden sm:table-cell">{formatETBShort(p.value)}</TableCell>
                <TableCell className="text-xs text-right text-success hidden lg:table-cell">{formatETBShort(p.deposit)}</TableCell>
                <TableCell className="text-xs text-right text-warning hidden lg:table-cell">{formatETBShort(p.balance)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <Progress value={p.progress} className="h-1.5 flex-1" />
                    <span className="text-[10px] font-medium w-8 text-right">{p.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className={`text-xs hidden lg:table-cell ${dueDateColor}`}>
                  {p.dueDate}
                  {p.status !== 'Completed' && <span className="text-[9px] block">{daysLeft > 0 ? `${daysLeft}d left` : `${Math.abs(daysLeft)}d late`}</span>}
                </TableCell>
                <TableCell className="text-xs hidden xl:table-cell">{p.projectManager.split(' ')[0]}</TableCell>
                <TableCell onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-3.5 w-3.5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(p)}><Eye className="h-3.5 w-3.5 mr-2" />View</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(p)}><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => onDelete(p.id)}><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
          {projects.length === 0 && (
            <TableRow><TableCell colSpan={13} className="text-center text-sm text-muted-foreground py-8">No projects found</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
