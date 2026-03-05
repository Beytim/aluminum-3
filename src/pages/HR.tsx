import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Briefcase, Trash2 } from "lucide-react";
import { sampleEmployees } from "@/data/sampleData";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import type { Employee } from "@/data/sampleData";

export default function HR() {
  const [employees, setEmployees] = useLocalStorage<Employee[]>(STORAGE_KEYS.EMPLOYEES, sampleEmployees);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t, language } = useI18n();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', nameAm: '', position: '', department: '', email: '', phone: '', salary: '' });

  const departments = [...new Set(employees.map(e => e.department))];
  const totalPayroll = employees.reduce((s, e) => s + e.salary, 0);

  const handleAdd = () => {
    if (!form.name.trim() || !form.department) return;
    const emp: Employee = {
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      name: form.name.trim(), nameAm: form.nameAm.trim() || form.name.trim(),
      position: form.position || 'Staff', department: form.department,
      email: form.email, phone: form.phone,
      hireDate: new Date().toISOString().split('T')[0],
      status: 'active', salary: Number(form.salary) || 0, performance: 80,
    };
    setEmployees(prev => [...prev, emp]);
    toast({ title: "Employee Added", description: emp.name });
    setForm({ name: '', nameAm: '', position: '', department: '', email: '', phone: '', salary: '' });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('hr.title')}</h1>
          <p className="text-sm text-muted-foreground">{employees.length} {t('hr.employees').toLowerCase()} · Payroll: ETB {totalPayroll.toLocaleString()}/mo</p>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />Add Employee</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {departments.map(dept => {
          const count = employees.filter(e => e.department === dept).length;
          return (
            <Card key={dept} className="shadow-card">
              <CardContent className="p-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <div><p className="text-[10px] text-muted-foreground">{dept}</p><p className="text-sm font-bold">{count}</p></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">ID</TableHead>
                <TableHead className="text-xs">{t('common.name')}</TableHead>
                <TableHead className="text-xs">Position</TableHead>
                <TableHead className="text-xs">Department</TableHead>
                <TableHead className="text-xs">Hire Date</TableHead>
                <TableHead className="text-xs text-right">Salary</TableHead>
                <TableHead className="text-xs">Performance</TableHead>
                <TableHead className="text-xs">{t('common.status')}</TableHead>
                <TableHead className="text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map(emp => (
                <TableRow key={emp.id}>
                  <TableCell className="text-xs font-mono">{emp.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{language === 'am' ? emp.nameAm : emp.name}</p>
                        <p className="text-[10px] text-muted-foreground">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{emp.position}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px]">{emp.department}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{emp.hireDate}</TableCell>
                  <TableCell className="text-xs text-right font-medium">ETB {emp.salary.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={emp.performance} className="h-1.5 w-16" />
                      <span className="text-[10px] font-medium">{emp.performance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={emp.status === 'active' ? 'outline' : 'secondary'} className={`text-[10px] ${emp.status === 'active' ? 'text-success border-success/30' : 'text-warning border-warning/30'}`}>
                      {emp.status === 'active' ? 'Active' : 'On Leave'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEmployees(prev => prev.filter(e => e.id !== emp.id)); toast({ title: "Deleted" }); }}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><Label className="text-xs">Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div><Label className="text-xs">ስም (AM)</Label><Input value={form.nameAm} onChange={e => setForm(p => ({ ...p, nameAm: e.target.value }))} /></div>
            <div><Label className="text-xs">Position</Label><Input value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} /></div>
            <div><Label className="text-xs">Department *</Label>
              <Select value={form.department} onValueChange={v => setForm(p => ({ ...p, department: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{['Production', 'Sales', 'Finance', 'Installation', 'Quality', 'Admin'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Email</Label><Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
            <div><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
            <div><Label className="text-xs">Salary (ETB)</Label><Input type="number" value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} /></div>
          </div>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleAdd}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
