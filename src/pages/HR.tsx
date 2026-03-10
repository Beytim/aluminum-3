import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/lib/settingsContext";
import { calculateHRStats, type EnhancedEmployee, type LeaveRequest, type Payroll } from "@/data/enhancedHRData";
import { useEmployees, useEmployeeMutations, useLeaveRequests, useLeaveMutations, usePayrolls } from "@/hooks/useHR";
import HRStats from "@/components/hr/HRStats";
import HRFilters from "@/components/hr/HRFilters";
import HRBulkActions from "@/components/hr/HRBulkActions";
import EmployeeTable from "@/components/hr/EmployeeTable";
import LeaveTable from "@/components/hr/LeaveTable";
import PayrollTable from "@/components/hr/PayrollTable";
import AddEmployeeDialog from "@/components/hr/AddEmployeeDialog";
import EmployeeDetailsDialog from "@/components/hr/EmployeeDetailsDialog";
import LeaveRequestDialog from "@/components/hr/LeaveRequestDialog";

export default function HR() {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const { formatCurrency } = useSettings();

  const { data: employees = [], isLoading } = useEmployees();
  const { addEmployee, deleteEmployee } = useEmployeeMutations();
  const { data: leaveRequests = [] } = useLeaveRequests();
  const { addLeave, updateLeave } = useLeaveMutations();
  const { data: payrolls = [] } = usePayrolls();

  const [tab, setTab] = useState('employees');
  const [search, setSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState('all');
  const [selectedEmp, setSelectedEmp] = useState<string[]>([]);
  const [addEmpOpen, setAddEmpOpen] = useState(false);
  const [addLeaveOpen, setAddLeaveOpen] = useState(false);
  const [viewEmp, setViewEmp] = useState<EnhancedEmployee | null>(null);

  const stats = useMemo(() => calculateHRStats(employees, leaveRequests, payrolls), [employees, leaveRequests, payrolls]);

  const filteredEmployees = useMemo(() => {
    let list = employees;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => e.fullName.toLowerCase().includes(q) || e.employeeNumber.toLowerCase().includes(q) || e.workEmail.toLowerCase().includes(q) || e.position.toLowerCase().includes(q));
    }
    if (quickFilter !== 'all') list = list.filter(e => e.status === quickFilter);
    return list;
  }, [employees, search, quickFilter]);

  const filteredLeave = useMemo(() => {
    let list = leaveRequests;
    if (search) { const q = search.toLowerCase(); list = list.filter(l => l.requestNumber.toLowerCase().includes(q) || l.employeeName.toLowerCase().includes(q)); }
    if (quickFilter !== 'all') list = list.filter(l => l.status === quickFilter);
    return list;
  }, [leaveRequests, search, quickFilter]);

  const filteredPayroll = useMemo(() => {
    let list = payrolls;
    if (search) { const q = search.toLowerCase(); list = list.filter(p => p.payrollNumber.toLowerCase().includes(q) || p.employeeName.toLowerCase().includes(q)); }
    if (quickFilter !== 'all') list = list.filter(p => p.status === quickFilter);
    return list;
  }, [payrolls, search, quickFilter]);

  const handleTabChange = (t: string) => { setTab(t); setSearch(''); setQuickFilter('all'); setSelectedEmp([]); };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('hr.title')}</h1>
          <p className="text-sm text-muted-foreground">{employees.length} employees · {stats.activeEmployees} active · {stats.pendingLeaveRequests} pending leave</p>
        </div>
        <div className="flex gap-2">
          {tab === 'employees' && <Button size="sm" onClick={() => setAddEmpOpen(true)}><Plus className="h-3.5 w-3.5 mr-1.5" />Add Employee</Button>}
          {tab === 'leave' && <Button size="sm" onClick={() => setAddLeaveOpen(true)}><Calendar className="h-3.5 w-3.5 mr-1.5" />Leave Request</Button>}
        </div>
      </div>

      <HRStats stats={stats} />

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="employees" className="text-xs">Employees ({employees.length})</TabsTrigger>
          <TabsTrigger value="leave" className="text-xs">Leave ({leaveRequests.length})</TabsTrigger>
          <TabsTrigger value="payroll" className="text-xs">Payroll ({payrolls.length})</TabsTrigger>
        </TabsList>

        <div className="mt-3">
          <HRFilters tab={tab} search={search} onSearchChange={setSearch} quickFilter={quickFilter} onQuickFilterChange={setQuickFilter} />
        </div>

        {tab === 'employees' && selectedEmp.length > 0 && (
          <div className="mt-2">
            <HRBulkActions count={selectedEmp.length} onClear={() => setSelectedEmp([])}
              onDelete={() => { selectedEmp.forEach(id => deleteEmployee.mutate(id)); setSelectedEmp([]); toast({ title: `Deleted ${selectedEmp.length} employees` }); }}
              onExport={() => toast({ title: "Exported" })}
            />
          </div>
        )}

        <TabsContent value="employees" className="mt-3">
          <Card><CardContent className="p-0 overflow-x-auto">
            <EmployeeTable employees={filteredEmployees} selected={selectedEmp} onSelect={setSelectedEmp}
              onView={setViewEmp} onDelete={id => { deleteEmployee.mutate(id); toast({ title: "Deleted" }); }} language={language}
            />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="leave" className="mt-3">
          <Card><CardContent className="p-0 overflow-x-auto">
            <LeaveTable requests={filteredLeave}
              onApprove={id => { const l = leaveRequests.find(r => r.id === id); if (l) updateLeave.mutate({ ...l, status: 'approved', approvedBy: 'Admin', approvedByName: 'Admin', approvedDate: new Date().toISOString().split('T')[0] }); toast({ title: "Leave Approved" }); }}
              onReject={id => { const l = leaveRequests.find(r => r.id === id); if (l) updateLeave.mutate({ ...l, status: 'rejected' }); toast({ title: "Leave Rejected" }); }}
              onDelete={id => toast({ title: "Delete not supported" })}
            />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="payroll" className="mt-3">
          <Card><CardContent className="p-0 overflow-x-auto">
            <PayrollTable payrolls={filteredPayroll}
              onApprove={id => toast({ title: "Payroll approval coming soon" })}
              onPay={id => toast({ title: "Payment processing coming soon" })}
            />
          </CardContent></Card>
          <div className="mt-3 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
            <strong>Payroll Summary:</strong> Total Net Pay: {formatCurrency(filteredPayroll.reduce((s, p) => s + p.netPay, 0))} · 
            Total Tax: {formatCurrency(filteredPayroll.reduce((s, p) => s + p.incomeTax, 0))} · 
            Total Pension: {formatCurrency(filteredPayroll.reduce((s, p) => s + p.pension, 0))}
          </div>
        </TabsContent>
      </Tabs>

      <AddEmployeeDialog open={addEmpOpen} onOpenChange={setAddEmpOpen} existingCount={employees.length}
        onAdd={emp => { addEmployee.mutate(emp); toast({ title: "Employee Added", description: emp.fullName }); }} />
      <EmployeeDetailsDialog employee={viewEmp} open={!!viewEmp} onOpenChange={() => setViewEmp(null)} language={language} />
      <LeaveRequestDialog open={addLeaveOpen} onOpenChange={setAddLeaveOpen} employees={employees} existingCount={leaveRequests.length}
        onAdd={req => { addLeave.mutate(req); toast({ title: "Leave Request Submitted", description: req.requestNumber }); }} />
    </div>
  );
}
