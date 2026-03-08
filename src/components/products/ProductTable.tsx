import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Pencil, Copy, Trash2, Power, PowerOff, Download, AlertTriangle, Package } from "lucide-react";
import type { Product } from "@/hooks/useProducts";
import { calcTotalCost, calcMargin } from "@/hooks/useProducts";

interface Props {
  products: Product[];
  selectedIds: Set<string>;
  allSelected: boolean;
  onToggleAll: () => void;
  onToggleSelect: (id: string) => void;
  onView: (p: Product) => void;
  onEdit: (p: Product) => void;
  onClone: (p: Product) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (p: Product) => void;
  onExportOne: (p: Product) => void;
  language: string;
}

export default function ProductTable({
  products, selectedIds, allSelected, onToggleAll, onToggleSelect,
  onView, onEdit, onClone, onDelete, onToggleStatus, onExportOne, language,
}: Props) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 px-2"><Checkbox checked={allSelected} onCheckedChange={onToggleAll} /></TableHead>
              <TableHead className="text-xs">Code</TableHead>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs hidden sm:table-cell">Category</TableHead>
              <TableHead className="text-xs hidden md:table-cell">Profile</TableHead>
              <TableHead className="text-xs hidden sm:table-cell">Type</TableHead>
              <TableHead className="text-xs hidden md:table-cell text-right">Stock</TableHead>
              <TableHead className="text-xs hidden lg:table-cell text-right">Margin</TableHead>
              <TableHead className="text-xs text-right">Cost</TableHead>
              <TableHead className="text-xs text-right">Price</TableHead>
              <TableHead className="text-xs hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-xs w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(p => {
              const mg = calcMargin(p);
              const isLow = p.current_stock <= p.min_stock;
              return (
                <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onView(p)}>
                  <TableCell className="px-2" onClick={e => e.stopPropagation()}>
                    <Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => onToggleSelect(p.id)} />
                  </TableCell>
                  <TableCell className="text-xs font-mono">{p.code}</TableCell>
                  <TableCell className="text-xs font-medium max-w-[140px] truncate">{language === 'am' ? p.name_am : p.name}</TableCell>
                  <TableCell className="hidden sm:table-cell"><Badge variant="secondary" className="text-[10px]">{p.category}</Badge></TableCell>
                  <TableCell className="text-xs hidden md:table-cell">{p.profile}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="text-[10px]">
                      {p.product_type === 'Raw Material' ? 'Raw' : p.product_type === 'Fabricated' ? 'Fab' : p.product_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-right hidden md:table-cell">
                    <span className="flex items-center justify-end gap-1">
                      {p.current_stock}
                      {isLow && <AlertTriangle className="h-3 w-3 text-destructive" />}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-right hidden lg:table-cell">
                    <span className={`font-medium ${mg >= 40 ? 'text-success' : mg >= 25 ? 'text-chart-2' : mg >= 0 ? 'text-warning' : 'text-destructive'}`}>
                      {mg.toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-right">ETB {(calcTotalCost(p) || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-right font-semibold">ETB {(p.selling_price || 0).toLocaleString()}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={p.status === 'Active' ? 'outline' : 'secondary'}
                      className={`text-[10px] ${p.status === 'Active' ? 'text-success border-success/30' : ''}`}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-3.5 w-3.5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => onView(p)}><Eye className="h-3.5 w-3.5 mr-2" />View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(p)}><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onClone(p)}><Copy className="h-3.5 w-3.5 mr-2" />Clone</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onToggleStatus(p)}>
                          {p.status === 'Active' ? <><PowerOff className="h-3.5 w-3.5 mr-2" />Deactivate</> : <><Power className="h-3.5 w-3.5 mr-2" />Activate</>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onExportOne(p)}><Download className="h-3.5 w-3.5 mr-2" />Export</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(p.id)}><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No products found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
