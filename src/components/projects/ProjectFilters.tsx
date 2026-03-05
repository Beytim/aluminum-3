import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import type { ProjectStatus, ProjectType } from "@/data/enhancedProjectData";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  typeFilter: string;
  onTypeChange: (v: string) => void;
  riskFilter: string;
  onRiskChange: (v: string) => void;
  managerFilter: string;
  onManagerChange: (v: string) => void;
  managers: string[];
  activeFilterCount: number;
  onClearAll: () => void;
}

const statuses: ProjectStatus[] = ['Quote', 'Deposit', 'Materials Ordered', 'Production', 'Ready', 'Installation', 'Completed', 'On Hold', 'Cancelled'];
const types: ProjectType[] = ['Residential', 'Commercial', 'Industrial', 'Government'];

export function ProjectFilters({ search, onSearchChange, statusFilter, onStatusChange, typeFilter, onTypeChange, riskFilter, onRiskChange, managerFilter, onManagerChange, managers, activeFilterCount, onClearAll }: Props) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-3 flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-9 h-8 text-xs" value={search} onChange={e => onSearchChange(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={onRiskChange}>
          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Risk" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="on-track">On Track</SelectItem>
          </SelectContent>
        </Select>
        <Select value={managerFilter} onValueChange={onManagerChange}>
          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="PM" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All PMs</SelectItem>
            {managers.map(m => <SelectItem key={m} value={m}>{m.split(' ')[0]}</SelectItem>)}
          </SelectContent>
        </Select>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onClearAll}>
            <X className="h-3 w-3 mr-1" />Clear ({activeFilterCount})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
