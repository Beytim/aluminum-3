import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Eye, Trash2, Play, CheckCircle, Calculator, ArrowUpDown, Pause, XCircle } from "lucide-react";
import { useState } from "react";
import type { EnhancedCuttingJob } from "@/data/enhancedProductionData";
import { formatETBShort, priorityColors } from "@/data/enhancedProductionData";

const statusColor: Record<string, string> = {
  Pending: 'bg-muted text-muted-foreground',
  'In Progress': 'bg-warning/10 text-warning',
  Completed: 'bg-success/10 text-success',
  Cancelled: 'bg-destructive/10 text-destructive',
};

interface Props {
  jobs: EnhancedCuttingJob[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onView: (job: EnhancedCuttingJob) => void;
  onEdit: (job: EnhancedCuttingJob) => void;
  onOptimize: (id: string) => void;
  onStatusChange: (id: string, status: EnhancedCuttingJob['status']) => void;
  onDelete: (id: string) => void;
}

type SortKey = 'jobNumber' | 'materialName' | 'totalCuts' | 'efficiency' | 'wastePercent' | 'totalCost' | 'status' | 'priority';

export function CuttingTable({ jobs, selectedIds, onSelect, onSelectAll, onView, onEdit, onOptimize, onStatusChange, onDelete }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('jobNumber');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...jobs].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * mul;
    return String(av).localeCompare(String(bv)) * mul;
  });

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <button className="flex items-center gap-0.5 hover:text-foreground" onClick={() => toggleSort(sortKeyName)}>
      {label}
      <ArrowUpDown className={`h-3 w-3 ${sortKey === sortKeyName ? 'text-primary' : 'text-muted-foreground/50'}`} />
    </button>
  );

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={selectedIds.length === jobs.length && jobs.length > 0}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead className="text-xs"><SortHeader label="Job #" sortKeyName="jobNumber" /></TableHead>
              <TableHead className="text-xs"><SortHeader label="Material" sortKeyName="materialName" /></TableHead>
              <TableHead className="text-xs">Work Order</TableHead>
              <TableHead className="text-xs">Project</TableHead>
              <TableHead className="text-xs text-center"><SortHeader label="Cuts" sortKeyName="totalCuts" /></TableHead>
              <TableHead className="text-xs text-right">Stock</TableHead>
              <TableHead className="text-xs text-right"><SortHeader label="Waste" sortKeyName="wastePercent" /></TableHead>
              <TableHead className="text-xs text-right"><SortHeader label="Efficiency" sortKeyName="efficiency" /></TableHead>
              <TableHead className="text-xs">Machine</TableHead>
              <TableHead className="text-xs">Assignee</TableHead>
              <TableHead className="text-xs"><SortHeader label="Status" sortKeyName="status" /></TableHead>
              <TableHead className="text-xs"><SortHeader label="Priority" sortKeyName="priority" /></TableHead>
              <TableHead className="text-xs text-right"><SortHeader label="Cost" sortKeyName="totalCost" /></TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(job => (
              <TableRow
                key={job.id}
                className={`cursor-pointer ${job.wastePercent > 15 ? 'bg-warning/5' : ''} ${selectedIds.includes(job.id) ? 'bg-primary/5' : ''}`}
                onClick={() => onView(job)}
              >
                <TableCell onClick={e => e.stopPropagation()}>
                  <Checkbox checked={selectedIds.includes(job.id)} onCheckedChange={() => onSelect(job.id)} />
                </TableCell>
                <TableCell className="text-xs font-mono font-bold text-primary">{job.jobNumber}</TableCell>
                <TableCell className="text-xs max-w-[140px] truncate">{job.materialName}</TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">{job.workOrderNumber || '—'}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">{job.projectName || '—'}</TableCell>
                <TableCell className="text-xs text-center font-medium">{job.totalCuts}</TableCell>
                <TableCell className="text-xs text-right font-mono">{job.stockLength}×{job.stocksUsed}</TableCell>
                <TableCell className="text-xs text-right">
                  <span className={job.wastePercent > 15 ? 'text-destructive font-medium' : job.wastePercent <= 5 ? 'text-success' : 'text-warning'}>
                    {job.waste}mm ({job.wastePercent}%)
                  </span>
                </TableCell>
                <TableCell className="text-xs text-right">
                  <span className={job.efficiency >= 95 ? 'text-success font-medium' : job.efficiency >= 85 ? 'text-foreground' : 'text-warning'}>
                    {job.efficiency}%
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{job.machine}</TableCell>
                <TableCell className="text-xs">{job.assignee}</TableCell>
                <TableCell><Badge className={`text-[9px] ${statusColor[job.status]}`}>{job.status}</Badge></TableCell>
                <TableCell><Badge className={`text-[9px] ${priorityColors[job.priority]}`}>{job.priority}</Badge></TableCell>
                <TableCell className="text-xs text-right font-mono">{formatETBShort(job.totalCost)}</TableCell>
                <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => onEdit(job)}>
                        <Pencil className="h-3.5 w-3.5 mr-2" />Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onView(job)}>
                        <Eye className="h-3.5 w-3.5 mr-2" />View Details
                      </DropdownMenuItem>
                      {job.status === 'Pending' && !job.optimized && (
                        <DropdownMenuItem onClick={() => onOptimize(job.id)}>
                          <Calculator className="h-3.5 w-3.5 mr-2" />Optimize
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {job.status === 'Pending' && (
                        <DropdownMenuItem onClick={() => onStatusChange(job.id, 'In Progress')}>
                          <Play className="h-3.5 w-3.5 mr-2" />Start Job
                        </DropdownMenuItem>
                      )}
                      {job.status === 'In Progress' && (
                        <>
                          <DropdownMenuItem onClick={() => onStatusChange(job.id, 'Completed')}>
                            <CheckCircle className="h-3.5 w-3.5 mr-2" />Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStatusChange(job.id, 'Pending')}>
                            <Pause className="h-3.5 w-3.5 mr-2" />Pause
                          </DropdownMenuItem>
                        </>
                      )}
                      {job.status !== 'Cancelled' && job.status !== 'Completed' && (
                        <DropdownMenuItem onClick={() => onStatusChange(job.id, 'Cancelled')}>
                          <XCircle className="h-3.5 w-3.5 mr-2" />Cancel
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => onDelete(job.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-2" />Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
