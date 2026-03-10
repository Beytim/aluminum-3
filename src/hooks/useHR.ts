import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EnhancedEmployee, LeaveRequest, Payroll } from "@/data/enhancedHRData";

// ═══ EMPLOYEES ═══
const mapEmployee = (r: any): EnhancedEmployee => ({
  id: r.id, employeeNumber: r.employee_number,
  firstName: r.first_name, lastName: r.last_name, fullName: r.full_name,
  firstNameAm: r.first_name_am, lastNameAm: r.last_name_am, fullNameAm: r.full_name_am,
  gender: r.gender, dateOfBirth: r.date_of_birth, maritalStatus: r.marital_status,
  personalEmail: r.personal_email, workEmail: r.work_email,
  personalPhone: r.personal_phone, workPhone: r.work_phone,
  emergencyContactName: r.emergency_contact_name, emergencyContactPhone: r.emergency_contact_phone,
  emergencyContactRelation: r.emergency_contact_relation,
  address: r.address, city: r.city, subCity: r.sub_city,
  nationalId: r.national_id, taxId: r.tax_id, pensionNumber: r.pension_number,
  department: r.department, position: r.position, positionLevel: r.position_level,
  employmentType: r.employment_type, status: r.status,
  reportsTo: r.reports_to, reportsToName: r.reports_to_name,
  hireDate: r.hire_date, probationEndDate: r.probation_end_date,
  confirmationDate: r.confirmation_date, terminationDate: r.termination_date, terminationReason: r.termination_reason,
  salary: Number(r.salary), salaryCurrency: 'ETB',
  bankName: r.bank_name, bankAccount: r.bank_account, bankBranch: r.bank_branch,
  healthInsurance: r.health_insurance, pensionEnrolled: r.pension_enrolled,
  transportationAllowance: Number(r.transportation_allowance),
  mealAllowance: Number(r.meal_allowance), housingAllowance: Number(r.housing_allowance),
  leaveBalances: r.leave_balances || { annual: 20, sick: 10 },
  leaveAccrualRate: Number(r.leave_accrual_rate),
  attendance: r.attendance || { totalDays: 0, presentDays: 0, absentDays: 0, lateDays: 0, overtime: 0, attendanceRate: 0 },
  performanceRating: r.performance_rating,
  lastReviewDate: r.last_review_date, nextReviewDate: r.next_review_date,
  skills: r.skills || [], notes: r.notes,
  createdAt: r.created_at, createdBy: r.created_by,
  updatedAt: r.updated_at, updatedBy: r.updated_by,
});

const empToDb = (e: Partial<EnhancedEmployee>) => ({
  employee_number: e.employeeNumber, first_name: e.firstName, last_name: e.lastName, full_name: e.fullName,
  first_name_am: e.firstNameAm, last_name_am: e.lastNameAm, full_name_am: e.fullNameAm,
  gender: e.gender, date_of_birth: e.dateOfBirth, marital_status: e.maritalStatus,
  personal_email: e.personalEmail, work_email: e.workEmail,
  personal_phone: e.personalPhone, work_phone: e.workPhone,
  emergency_contact_name: e.emergencyContactName, emergency_contact_phone: e.emergencyContactPhone,
  emergency_contact_relation: e.emergencyContactRelation,
  address: e.address, city: e.city, sub_city: e.subCity,
  national_id: e.nationalId, tax_id: e.taxId, pension_number: e.pensionNumber,
  department: e.department, position: e.position, position_level: e.positionLevel,
  employment_type: e.employmentType, status: e.status,
  reports_to: e.reportsTo, reports_to_name: e.reportsToName,
  hire_date: e.hireDate, probation_end_date: e.probationEndDate,
  confirmation_date: e.confirmationDate, termination_date: e.terminationDate, termination_reason: e.terminationReason,
  salary: e.salary, bank_name: e.bankName, bank_account: e.bankAccount, bank_branch: e.bankBranch,
  health_insurance: e.healthInsurance, pension_enrolled: e.pensionEnrolled,
  transportation_allowance: e.transportationAllowance,
  meal_allowance: e.mealAllowance, housing_allowance: e.housingAllowance,
  leave_balances: e.leaveBalances as any, leave_accrual_rate: e.leaveAccrualRate,
  attendance: e.attendance as any, performance_rating: e.performanceRating,
  last_review_date: e.lastReviewDate, next_review_date: e.nextReviewDate,
  skills: e.skills as any, notes: e.notes,
});

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase.from("employees").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapEmployee);
    },
  });
}

export function useEmployeeMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["employees"] });
  return {
    addEmployee: useMutation({ mutationFn: async (e: EnhancedEmployee) => { const { error } = await supabase.from("employees").insert(empToDb(e) as any); if (error) throw error; }, onSuccess: inv }),
    updateEmployee: useMutation({ mutationFn: async (e: EnhancedEmployee) => { const { error } = await supabase.from("employees").update(empToDb(e) as any).eq("id", e.id); if (error) throw error; }, onSuccess: inv }),
    deleteEmployee: useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("employees").delete().eq("id", id); if (error) throw error; }, onSuccess: inv }),
  };
}

// ═══ LEAVE REQUESTS ═══
const mapLeave = (r: any): LeaveRequest => ({
  id: r.id, requestNumber: r.request_number,
  employeeId: r.employee_id, employeeName: r.employee_name,
  leaveType: r.leave_type, startDate: r.start_date, endDate: r.end_date,
  daysRequested: Number(r.days_requested), reason: r.reason, status: r.status,
  submittedDate: r.submitted_date, approvedBy: r.approved_by, approvedByName: r.approved_by_name,
  approvedDate: r.approved_date, rejectionReason: r.rejection_reason,
  handoverTo: r.handover_to, handoverNotes: r.handover_notes,
  remainingBalanceAfter: Number(r.remaining_balance_after), notes: r.notes,
  createdAt: r.created_at, updatedAt: r.updated_at,
});

export function useLeaveRequests() {
  return useQuery({
    queryKey: ["leave_requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leave_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapLeave);
    },
  });
}

export function useLeaveMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["leave_requests"] });
  return {
    addLeave: useMutation({
      mutationFn: async (l: LeaveRequest) => {
        const { error } = await supabase.from("leave_requests").insert({
          request_number: l.requestNumber, employee_id: l.employeeId, employee_name: l.employeeName,
          leave_type: l.leaveType, start_date: l.startDate, end_date: l.endDate,
          days_requested: l.daysRequested, reason: l.reason, status: l.status,
          submitted_date: l.submittedDate, remaining_balance_after: l.remainingBalanceAfter, notes: l.notes,
        } as any);
        if (error) throw error;
      },
      onSuccess: inv,
    }),
    updateLeave: useMutation({
      mutationFn: async (l: LeaveRequest) => {
        const { error } = await supabase.from("leave_requests").update({
          status: l.status, approved_by: l.approvedBy, approved_by_name: l.approvedByName,
          approved_date: l.approvedDate, rejection_reason: l.rejectionReason,
        } as any).eq("id", l.id);
        if (error) throw error;
      },
      onSuccess: inv,
    }),
  };
}

// ═══ PAYROLLS ═══
const mapPayroll = (r: any): Payroll => ({
  id: r.id, payrollNumber: r.payroll_number, period: r.period,
  startDate: r.start_date, endDate: r.end_date, paymentDate: r.payment_date,
  employeeId: r.employee_id, employeeName: r.employee_name, employeeNumber: r.employee_number,
  department: r.department, baseSalary: Number(r.base_salary),
  overtimeHours: Number(r.overtime_hours), overtimeRate: Number(r.overtime_rate), overtimePay: Number(r.overtime_pay),
  transportationAllowance: Number(r.transportation_allowance),
  mealAllowance: Number(r.meal_allowance), housingAllowance: Number(r.housing_allowance),
  totalAllowances: Number(r.total_allowances),
  performanceBonus: Number(r.performance_bonus), attendanceBonus: Number(r.attendance_bonus), totalBonuses: Number(r.total_bonuses),
  grossPay: Number(r.gross_pay), incomeTax: Number(r.income_tax), pension: Number(r.pension),
  healthInsurance: Number(r.health_insurance), loanRepayment: Number(r.loan_repayment), totalDeductions: Number(r.total_deductions),
  netPay: Number(r.net_pay), bankName: r.bank_name, bankAccount: r.bank_account,
  status: r.status, calculatedBy: r.calculated_by, calculatedByName: r.calculated_by_name, calculatedAt: r.calculated_at,
  approvedBy: r.approved_by, approvedByName: r.approved_by_name, approvedAt: r.approved_at, paidAt: r.paid_at,
  notes: r.notes, createdAt: r.created_at, updatedAt: r.updated_at,
});

export function usePayrolls() {
  return useQuery({
    queryKey: ["payrolls"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payrolls").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapPayroll);
    },
  });
}

export function usePayrollMutations() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["payrolls"] });
  return {
    addPayroll: useMutation({
      mutationFn: async (p: Payroll) => {
        const { error } = await supabase.from("payrolls").insert({
          payroll_number: p.payrollNumber, period: p.period, start_date: p.startDate, end_date: p.endDate,
          payment_date: p.paymentDate, employee_id: p.employeeId, employee_name: p.employeeName,
          employee_number: p.employeeNumber, department: p.department, base_salary: p.baseSalary,
          overtime_hours: p.overtimeHours, overtime_rate: p.overtimeRate, overtime_pay: p.overtimePay,
          transportation_allowance: p.transportationAllowance, meal_allowance: p.mealAllowance,
          housing_allowance: p.housingAllowance, total_allowances: p.totalAllowances,
          performance_bonus: p.performanceBonus, attendance_bonus: p.attendanceBonus, total_bonuses: p.totalBonuses,
          gross_pay: p.grossPay, income_tax: p.incomeTax, pension: p.pension,
          health_insurance: p.healthInsurance, loan_repayment: p.loanRepayment, total_deductions: p.totalDeductions,
          net_pay: p.netPay, bank_name: p.bankName, bank_account: p.bankAccount, status: p.status,
        } as any);
        if (error) throw error;
      },
      onSuccess: inv,
    }),
  };
}
