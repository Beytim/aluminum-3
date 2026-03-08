import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import {
  sampleEnhancedEmployees, sampleLeaveRequests, samplePayrolls,
  calculateHRStats,
  type EnhancedEmployee, type LeaveRequest, type Payroll,
} from "@/data/enhancedHRData";
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

  const [employees, setEmployees] = useLocalStorage<EnhancedEmployee[]>(STORAGE_KEYS.ENHANCED_EMPLOYEES, sampleEnhancedEmployees);
  const [leaveRequests, setLeaveRequests] = useLocalStorage<LeaveRequest[]>(STORAGE_KEYS.LEAVE_REQUESTS, sampleLeaveRequests);
  const [payrolls, setPayrolls] = useLocalStorage<Payroll[]>(STORAGE_KEYS.PAYROLLS, samplePayrolls);

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
    if (quickFilter !== 'all') {
      list = list.filter(e => e.status === quickFilter);
    }
    return list;
  }, [employees, search, quickFilter]);

  const filteredLeave = useMemo(() => {
    let list = leaveRequests;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(l => l.requestNumber.toLowerCase().includes(q) || l.employeeName.toLowerCase().includes(q));
    }
    if (quickFilter !== 'all') {
      list = list.filter(l => l.status === quickFilter);
    }
    return list;
  }, [leaveRequests, search, quickFilter]);

  const filteredPayroll = useMemo(() => {
    let list = payrolls;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.payrollNumber.toLowerCase().includes(q) || p.employeeName.toLowerCase().includes(q));
    }
    if (quickFilter !== 'all') {
      list = list.filter(p => p.status === quickFilter);
    }
    return list;
  }, [payrolls, search, quickFilter]);

  const handleTabChange = (t: string) => {
    setTab(t);
    setSearch('');
    setQuickFilter('all');
    setSelectedEmp([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('hr.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {employees.length} employees · {stats.activeEmployees} active · {stats.pendingLeaveRequests} pending leave
          </p>
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

        {/* Filters */}
        <div className="mt-3">
          <HRFilters tab={tab} search={search} onSearchChange={setSearch} quickFilter={quickFilter} onQuickFilterChange={setQuickFilter} />
        </div>

        {/* Bulk actions */}
        {tab === 'employees' && selectedEmp.length > 0 && (
          <div className="mt-2">
            <HRBulkActions
              count={selectedEmp.length}
              onClear={() => setSelectedEmp([])}
              onDelete={() => { setEmployees(prev => prev.filter(e => !selectedEmp.includes(e.id))); setSelectedEmp([]); toast({ title: `Deleted ${selectedEmp.length} employees` }); }}
              onExport={() => toast({ title: "Exported", description: `${selectedEmp.length} employees` })}
            />
          </div>
        )}

        <TabsContent value="employees" className="mt-3">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <EmployeeTable
                employees={filteredEmployees}
                selected={selectedEmp}
                onSelect={setSelectedEmp}
                onView={setViewEmp}
                onDelete={id => { setEmployees(prev => prev.filter(e => e.id !== id)); toast({ title: "Deleted" }); }}
                language={language}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="mt-3">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <LeaveTable
                requests={filteredLeave}
                onApprove={id => {
                  setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status: 'approved', approvedBy: 'EMP-001', approvedByName: 'Abebe Tekle', approvedDate: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] } : l));
                  toast({ title: "Leave Approved" });
                }}
                onReject={id => {
                  setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected', updatedAt: new Date().toISOString().split('T')[0] } : l));
                  toast({ title: "Leave Rejected" });
                }}
                onDelete={id => { setLeaveRequests(prev => prev.filter(l => l.id !== id)); toast({ title: "Deleted" }); }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="mt-3">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <PayrollTable
                payrolls={filteredPayroll}
                onApprove={id => {
                  setPayrolls(prev => prev.map(p => p.id === id ? { ...p, status: 'approved', approvedBy: 'EMP-001', approvedByName: 'Abebe Tekle', approvedAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] } : p));
                  toast({ title: "Payroll Approved" });
                }}
                onPay={id => {
                  setPayrolls(prev => prev.map(p => p.id === id ? { ...p, status: 'paid', paidAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] } : p));
                  toast({ title: "Payment Processed" });
                }}
              />
            </CardContent>
          </Card>
          <div className="mt-3 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
            <strong>Payroll Summary:</strong> Total Net Pay: ETB {filteredPayroll.reduce((s, p) => s + p.netPay, 0).toLocaleString()} · 
            Total Tax: ETB {filteredPayroll.reduce((s, p) => s + p.incomeTax, 0).toLocaleString()} · 
            Total Pension: ETB {filteredPayroll.reduce((s, p) => s + p.pension, 0).toLocaleString()}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddEmployeeDialog open={addEmpOpen} onOpenChange={setAddEmpOpen} existingCount={employees.length}
        onAdd={emp => { setEmployees(prev => [...prev, emp]); toast({ title: "Employee Added", description: emp.fullName }); }} />
      <EmployeeDetailsDialog employee={viewEmp} open={!!viewEmp} onOpenChange={() => setViewEmp(null)} language={language} />
      <LeaveRequestDialog open={addLeaveOpen} onOpenChange={setAddLeaveOpen} employees={employees} existingCount={leaveRequests.length}
        onAdd={req => { setLeaveRequests(prev => [...prev, req]); toast({ title: "Leave Request Submitted", description: req.requestNumber }); }} />
    </div>
  );
}
