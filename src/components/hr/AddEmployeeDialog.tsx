import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { EnhancedEmployee, Department, PositionLevel, EmploymentType } from "@/data/enhancedHRData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (emp: EnhancedEmployee) => void;
  existingCount: number;
}

const departments: Department[] = ['production', 'sales', 'finance', 'hr', 'it', 'procurement', 'quality', 'maintenance', 'installation', 'cutting', 'projects', 'administration', 'management'];
const levels: PositionLevel[] = ['entry', 'junior', 'senior', 'supervisor', 'manager', 'director', 'executive'];
const types: EmploymentType[] = ['full_time', 'part_time', 'contract', 'intern', 'temporary', 'consultant'];

export default function AddEmployeeDialog({ open, onOpenChange, onAdd, existingCount }: Props) {
  const [tab, setTab] = useState('personal');
  const [form, setForm] = useState({
    firstName: '', lastName: '', firstNameAm: '', lastNameAm: '',
    gender: 'male' as 'male' | 'female' | 'other',
    dateOfBirth: '', maritalStatus: '',
    personalEmail: '', workEmail: '', personalPhone: '', workPhone: '',
    emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: '',
    address: '', city: 'Addis Ababa', subCity: '',
    department: '' as Department | '', position: '', positionLevel: '' as PositionLevel | '',
    employmentType: 'full_time' as EmploymentType, reportsToName: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: '', bankName: '', bankAccount: '', bankBranch: '',
    transportationAllowance: '0', mealAllowance: '0', housingAllowance: '0',
    healthInsurance: true, pensionEnrolled: true,
  });

  const reset = () => {
    setForm({
      firstName: '', lastName: '', firstNameAm: '', lastNameAm: '',
      gender: 'male', dateOfBirth: '', maritalStatus: '',
      personalEmail: '', workEmail: '', personalPhone: '', workPhone: '',
      emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: '',
      address: '', city: 'Addis Ababa', subCity: '',
      department: '', position: '', positionLevel: '',
      employmentType: 'full_time', reportsToName: '',
      hireDate: new Date().toISOString().split('T')[0],
      salary: '', bankName: '', bankAccount: '', bankBranch: '',
      transportationAllowance: '0', mealAllowance: '0', housingAllowance: '0',
      healthInsurance: true, pensionEnrolled: true,
    });
    setTab('personal');
  };

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.department || !form.position) return;
    const num = existingCount + 1;
    const emp: EnhancedEmployee = {
      id: `EMP-${String(num).padStart(3, '0')}`,
      employeeNumber: `EMP-${String(num).padStart(3, '0')}`,
      firstName: form.firstName, lastName: form.lastName,
      fullName: `${form.firstName} ${form.lastName}`,
      firstNameAm: form.firstNameAm || undefined, lastNameAm: form.lastNameAm || undefined,
      fullNameAm: form.firstNameAm && form.lastNameAm ? `${form.firstNameAm} ${form.lastNameAm}` : undefined,
      gender: form.gender, dateOfBirth: form.dateOfBirth || '1990-01-01',
      maritalStatus: (form.maritalStatus as any) || undefined,
      personalEmail: form.personalEmail, workEmail: form.workEmail || `${form.firstName.toLowerCase()}@aluerp.com`,
      personalPhone: form.personalPhone, workPhone: form.workPhone || undefined,
      emergencyContactName: form.emergencyContactName || undefined,
      emergencyContactPhone: form.emergencyContactPhone || undefined,
      emergencyContactRelation: form.emergencyContactRelation || undefined,
      address: form.address, city: form.city, subCity: form.subCity || undefined,
      department: form.department as Department,
      position: form.position,
      positionLevel: (form.positionLevel as PositionLevel) || 'entry',
      employmentType: form.employmentType,
      status: 'probation',
      reportsToName: form.reportsToName || undefined,
      hireDate: form.hireDate,
      probationEndDate: new Date(new Date(form.hireDate).getTime() + 90 * 86400000).toISOString().split('T')[0],
      salary: Number(form.salary) || 0, salaryCurrency: 'ETB',
      bankName: form.bankName || undefined, bankAccount: form.bankAccount || undefined, bankBranch: form.bankBranch || undefined,
      healthInsurance: form.healthInsurance, pensionEnrolled: form.pensionEnrolled,
      transportationAllowance: Number(form.transportationAllowance) || 0,
      mealAllowance: Number(form.mealAllowance) || 0,
      housingAllowance: Number(form.housingAllowance) || 0,
      leaveBalances: { annual: 0, sick: 2 },
      leaveAccrualRate: 1.0,
      attendance: { totalDays: 0, presentDays: 0, absentDays: 0, lateDays: 0, overtime: 0, attendanceRate: 100 },
      performanceRating: 3, skills: [],
      createdAt: new Date().toISOString().split('T')[0], createdBy: 'EMP-001',
      updatedAt: new Date().toISOString().split('T')[0], updatedBy: 'EMP-001',
    };
    onAdd(emp);
    reset();
    onOpenChange(false);
  };

  const u = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="personal" className="text-xs">Personal</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs">Contact</TabsTrigger>
            <TabsTrigger value="employment" className="text-xs">Employment</TabsTrigger>
            <TabsTrigger value="compensation" className="text-xs">Compensation</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">First Name *</Label><Input value={form.firstName} onChange={e => u('firstName', e.target.value)} /></div>
              <div><Label className="text-xs">Last Name *</Label><Input value={form.lastName} onChange={e => u('lastName', e.target.value)} /></div>
              <div><Label className="text-xs">ስም (AM)</Label><Input value={form.firstNameAm} onChange={e => u('firstNameAm', e.target.value)} /></div>
              <div><Label className="text-xs">የአባት ስም (AM)</Label><Input value={form.lastNameAm} onChange={e => u('lastNameAm', e.target.value)} /></div>
              <div>
                <Label className="text-xs">Gender</Label>
                <Select value={form.gender} onValueChange={v => u('gender', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={e => u('dateOfBirth', e.target.value)} /></div>
              <div>
                <Label className="text-xs">Marital Status</Label>
                <Select value={form.maritalStatus} onValueChange={v => u('maritalStatus', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{['single', 'married', 'divorced', 'widowed'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Personal Email</Label><Input value={form.personalEmail} onChange={e => u('personalEmail', e.target.value)} /></div>
              <div><Label className="text-xs">Work Email</Label><Input value={form.workEmail} onChange={e => u('workEmail', e.target.value)} /></div>
              <div><Label className="text-xs">Personal Phone</Label><Input value={form.personalPhone} onChange={e => u('personalPhone', e.target.value)} /></div>
              <div><Label className="text-xs">Work Phone</Label><Input value={form.workPhone} onChange={e => u('workPhone', e.target.value)} /></div>
              <div><Label className="text-xs">Emergency Contact</Label><Input value={form.emergencyContactName} onChange={e => u('emergencyContactName', e.target.value)} /></div>
              <div><Label className="text-xs">Emergency Phone</Label><Input value={form.emergencyContactPhone} onChange={e => u('emergencyContactPhone', e.target.value)} /></div>
              <div><Label className="text-xs">Address</Label><Input value={form.address} onChange={e => u('address', e.target.value)} /></div>
              <div><Label className="text-xs">City</Label><Input value={form.city} onChange={e => u('city', e.target.value)} /></div>
              <div><Label className="text-xs">Sub-City</Label><Input value={form.subCity} onChange={e => u('subCity', e.target.value)} /></div>
            </div>
          </TabsContent>

          <TabsContent value="employment" className="mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Department *</Label>
                <Select value={form.department} onValueChange={v => u('department', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{departments.map(d => <SelectItem key={d} value={d} className="capitalize">{d.replace('_', ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Position *</Label><Input value={form.position} onChange={e => u('position', e.target.value)} /></div>
              <div>
                <Label className="text-xs">Level</Label>
                <Select value={form.positionLevel} onValueChange={v => u('positionLevel', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{levels.map(l => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Employment Type</Label>
                <Select value={form.employmentType} onValueChange={v => u('employmentType', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{types.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace('_', ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Reports To</Label><Input value={form.reportsToName} onChange={e => u('reportsToName', e.target.value)} /></div>
              <div><Label className="text-xs">Hire Date</Label><Input type="date" value={form.hireDate} onChange={e => u('hireDate', e.target.value)} /></div>
            </div>
          </TabsContent>

          <TabsContent value="compensation" className="mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Base Salary (ETB)</Label><Input type="number" value={form.salary} onChange={e => u('salary', e.target.value)} /></div>
              <div><Label className="text-xs">Bank Name</Label><Input value={form.bankName} onChange={e => u('bankName', e.target.value)} /></div>
              <div><Label className="text-xs">Bank Account</Label><Input value={form.bankAccount} onChange={e => u('bankAccount', e.target.value)} /></div>
              <div><Label className="text-xs">Bank Branch</Label><Input value={form.bankBranch} onChange={e => u('bankBranch', e.target.value)} /></div>
              <div><Label className="text-xs">Transport Allowance</Label><Input type="number" value={form.transportationAllowance} onChange={e => u('transportationAllowance', e.target.value)} /></div>
              <div><Label className="text-xs">Meal Allowance</Label><Input type="number" value={form.mealAllowance} onChange={e => u('mealAllowance', e.target.value)} /></div>
              <div><Label className="text-xs">Housing Allowance</Label><Input type="number" value={form.housingAllowance} onChange={e => u('housingAllowance', e.target.value)} /></div>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2"><Checkbox checked={form.healthInsurance} onCheckedChange={c => u('healthInsurance', !!c)} /><Label className="text-xs">Health Insurance</Label></div>
                <div className="flex items-center gap-2"><Checkbox checked={form.pensionEnrolled} onCheckedChange={c => u('pensionEnrolled', !!c)} /><Label className="text-xs">Pension Enrolled</Label></div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!form.firstName || !form.lastName || !form.department || !form.position}>Add Employee</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
