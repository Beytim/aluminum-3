import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Play, CheckCircle, Trash2, AlertTriangle } from "lucide-react";
import type { EnhancedInstallation } from "@/data/enhancedInstallationData";
import { getStatusColor, getStatusLabel, getPriorityColor, daysUntil } from "@/data/enhancedInstallationData";

interface Props {
  installations: EnhancedInstallation[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onView: (inst: EnhancedInstallation) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function InstallationTable({ installations, selectedIds, onToggleSelect, onSelectAll, onView, onStart, onComplete, onDelete }: Props) {
  const allSelected = installations.length > 0 && selectedIds.length === installations.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"><Checkbox checked={allSelected} onCheckedChange={onSelectAll} /></TableHead>
          <TableHead className="text-xs">Installation #</TableHead>
          <TableHead className="text-xs">Customer</TableHead>
          <TableHead className="text-xs">Project</TableHead>
          <TableHead className="text-xs">Site</TableHead>
          <TableHead className="text-xs">Date</TableHead>
          <TableHead className="text-xs">Status</TableHead>
          <TableHead className="text-xs">Priority</TableHead>
          <TableHead className="text-xs">Team</TableHead>
          <TableHead className="text-xs">Items</TableHead>
          <TableHead className="text-xs">Issues</TableHead>
          <TableHead className="text-xs">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {installations.map(inst => {
          const totalItems = inst.items.reduce((s, i) => s + i.quantity, 0);
          const installed = inst.items.reduce((s, i) => s + i.installedQuantity, 0);
          const days = daysUntil(inst.scheduledDate);

          return (
            <TableRow key={inst.id} className={inst.isOverdue ? 'bg-destructive/5' : ''}>
              <TableCell><Checkbox checked={selectedIds.includes(inst.id)} onCheckedChange={() => onToggleSelect(inst.id)} /></TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono font-medium">{inst.installationNumber}</span>
                  {inst.isOverdue && <AlertTriangle className="h-3 w-3 text-destructive" />}
                </div>
              </TableCell>
              <TableCell className="text-xs">{inst.customerName}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{inst.projectName || '-'}</TableCell>
              <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">{inst.siteAddress}</TableCell>
              <TableCell>
                <div className="text-xs">
                  <span>{inst.scheduledDate}</span>
                  {inst.status !== 'completed' && inst.status !== 'cancelled' && (
                    <span className={`block text-[10px] ${days < 0 ? 'text-destructive' : days <= 2 ? 'text-warning' : 'text-muted-foreground'}`}>
                      {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `in ${days}d`}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(inst.status)}`}>{getStatusLabel(inst.status)}</span>
              </TableCell>
              <TableCell>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${getPriorityColor(inst.priority)}`}>{inst.priority}</span>
              </TableCell>
              <TableCell className="text-xs">{inst.teamLead} ({inst.teamSize})</TableCell>
              <TableCell className="text-xs">{installed}/{totalItems}</TableCell>
              <TableCell>
                {inst.hasIssues ? (
                  <span className="text-xs text-warning flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{inst.issueCount}</span>
                ) : <span className="text-xs text-muted-foreground">0</span>}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onView(inst)}><Eye className="h-3 w-3" /></Button>
                  {(inst.status === 'scheduled' || inst.status === 'confirmed') && (
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onStart(inst.id)}><Play className="h-3 w-3" /></Button>
                  )}
                  {(inst.status === 'in_progress' || inst.status === 'partial') && (
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onComplete(inst.id)}><CheckCircle className="h-3 w-3" /></Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => onDelete(inst.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
