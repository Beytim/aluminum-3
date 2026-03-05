import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Pencil, Trash2, Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { EnhancedCustomer } from "@/data/customerTypes";
import { formatETB, getRelativeTime, getHealthColor } from "@/lib/customerHelpers";

type SortKey = 'name' | 'type' | 'totalValue' | 'outstanding' | 'projects' | 'healthScore';
type SortDir = 'asc' | 'desc';

interface Props {
  customers: EnhancedCustomer[];
  language: 'en' | 'am';
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
  onView: (c: EnhancedCustomer) => void;
  onEdit: (c: EnhancedCustomer) => void;
  onDelete: (id: string) => void;
}

export function CustomerTable({ customers, language, selectedIds, onSelectIds, onView, onEdit, onDelete }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...customers].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    if (sortKey === 'name') return mul * a.name.localeCompare(b.name);
    return mul * ((a[sortKey] as number) - (b[sortKey] as number));
  });

  const allSelected = customers.length > 0 && selectedIds.length === customers.length;
  const toggleAll = () => onSelectIds(allSelected ? [] : customers.map(c => c.id));
  const toggleOne = (id: string) => onSelectIds(
    selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id]
  );

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-30" />;
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>
          <TableHead className="text-xs cursor-pointer" onClick={() => toggleSort('name')}>
            <span className="flex items-center">Name <SortIcon col="name" /></span>
          </TableHead>
          <TableHead className="text-xs hidden sm:table-cell">Contact</TableHead>
          <TableHead className="text-xs hidden md:table-cell cursor-pointer" onClick={() => toggleSort('type')}>
            <span className="flex items-center">Type <SortIcon col="type" /></span>
          </TableHead>
          <TableHead className="text-xs hidden lg:table-cell">Phone</TableHead>
          <TableHead className="text-xs text-right hidden sm:table-cell cursor-pointer" onClick={() => toggleSort('projects')}>
            <span className="flex items-center justify-end">Projects <SortIcon col="projects" /></span>
          </TableHead>
          <TableHead className="text-xs text-right cursor-pointer" onClick={() => toggleSort('totalValue')}>
            <span className="flex items-center justify-end">Value <SortIcon col="totalValue" /></span>
          </TableHead>
          <TableHead className="text-xs text-right hidden md:table-cell cursor-pointer" onClick={() => toggleSort('outstanding')}>
            <span className="flex items-center justify-end">Outstanding <SortIcon col="outstanding" /></span>
          </TableHead>
          <TableHead className="text-xs text-center hidden lg:table-cell cursor-pointer" onClick={() => toggleSort('healthScore')}>
            <span className="flex items-center justify-center">Health <SortIcon col="healthScore" /></span>
          </TableHead>
          <TableHead className="text-xs w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map(c => (
          <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onView(c)}>
            <TableCell onClick={e => e.stopPropagation()}>
              <Checkbox checked={selectedIds.includes(c.id)} onCheckedChange={() => toggleOne(c.id)} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium">{language === 'am' ? c.nameAm : c.name}</p>
                  <p className="text-[10px] text-muted-foreground">{c.code}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-xs hidden sm:table-cell">{c.contact}</TableCell>
            <TableCell className="hidden md:table-cell"><Badge variant="secondary" className="text-[10px]">{c.type}</Badge></TableCell>
            <TableCell className="text-xs hidden lg:table-cell">{c.phone}</TableCell>
            <TableCell className="text-xs text-right hidden sm:table-cell">{c.projects}</TableCell>
            <TableCell className="text-xs text-right font-medium">{formatETB(c.totalValue)}</TableCell>
            <TableCell className="text-xs text-right hidden md:table-cell">
              <span className={c.outstanding > 0 ? "text-warning font-medium" : "text-success"}>{formatETB(c.outstanding)}</span>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              <div className="flex items-center justify-center gap-1">
                <div className={`h-2 w-2 rounded-full ${c.healthStatus === 'healthy' ? 'bg-success' : c.healthStatus === 'attention' ? 'bg-warning' : c.healthStatus === 'at-risk' ? 'bg-orange-500' : 'bg-destructive'}`} />
                <span className="text-[10px]">{c.healthScore}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-0.5" onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(c)}><Eye className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(c)}><Pencil className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(c.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
