// ══════════════════════════════════════════
// ENHANCED HR MODULE DATA
// ══════════════════════════════════════════

export type EmploymentStatus = 'active' | 'probation' | 'notice' | 'terminated' | 'resigned' | 'retired' | 'on_leave' | 'suspended';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary' | 'consultant';
export type Department = 'production' | 'sales' | 'finance' | 'hr' | 'it' | 'procurement' | 'quality' | 'maintenance' | 'installation' | 'cutting' | 'projects' | 'administration' | 'management';
export type PositionLevel = 'entry' | 'junior' | 'senior' | 'supervisor' | 'manager' | 'director' | 'executive';
export type LeaveType = 'annual' | 'sick' | 'maternity' | 'paternity' | 'bereavement' | 'unpaid' | 'study' | 'compensatory' | 'emergency' | 'other';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'taken';
export type PayrollStatus = 'draft' | 'calculated' | 'approved' | 'paid' | 'cancelled';
export type PerformanceRating = 1 | 2 | 3 | 4 | 5;

// ═══ INTERFACES ═══

export interface EnhancedEmployee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  firstNameAm?: string;
  lastNameAm?: string;
  fullNameAm?: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  personalEmail: string;
  workEmail: string;
  personalPhone: string;
  workPhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  address: string;
  city: string;
  subCity?: string;
  nationalId?: string;
  taxId?: string;
  pensionNumber?: string;
  department: Department;
  position: string;
  positionLevel: PositionLevel;
  employmentType: EmploymentType;
  status: EmploymentStatus;
  reportsTo?: string;
  reportsToName?: string;
  hireDate: string;
  probationEndDate?: string;
  confirmationDate?: string;
  terminationDate?: string;
  terminationReason?: string;
  salary: number;
  salaryCurrency: 'ETB';
  bankName?: string;
  bankAccount?: string;
  bankBranch?: string;
  healthInsurance: boolean;
  pensionEnrolled: boolean;
  transportationAllowance: number;
  mealAllowance: number;
  housingAllowance: number;
  leaveBalances: {
    annual: number;
    sick: number;
    maternity?: number;
    paternity?: number;
    compensatory?: number;
  };
  leaveAccrualRate: number;
  attendance: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    overtime: number;
    attendanceRate: number;
  };
  performanceRating: PerformanceRating;
  lastReviewDate?: string;
  nextReviewDate?: string;
  skills: { name: string; level: 'beginner' | 'intermediate' | 'advanced' | 'expert' }[];
  notes?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface LeaveRequest {
  id: string;
  requestNumber: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason: string;
  status: LeaveStatus;
  submittedDate: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  rejectionReason?: string;
  handoverTo?: string;
  handoverNotes?: string;
  remainingBalanceAfter: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payroll {
  id: string;
  payrollNumber: string;
  period: string;
  startDate: string;
  endDate: string;
  paymentDate: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department: Department;
  baseSalary: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimePay: number;
  transportationAllowance: number;
  mealAllowance: number;
  housingAllowance: number;
  totalAllowances: number;
  performanceBonus: number;
  attendanceBonus: number;
  totalBonuses: number;
  grossPay: number;
  incomeTax: number;
  pension: number;
  healthInsurance: number;
  loanRepayment: number;
  totalDeductions: number;
  netPay: number;
  bankName: string;
  bankAccount: string;
  status: PayrollStatus;
  calculatedBy: string;
  calculatedByName: string;
  calculatedAt: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceReview {
  id: string;
  reviewNumber: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  reviewPeriod: string;
  ratings: {
    quality: PerformanceRating;
    productivity: PerformanceRating;
    teamwork: PerformanceRating;
    communication: PerformanceRating;
    initiative: PerformanceRating;
    attendance: PerformanceRating;
    technical: PerformanceRating;
  };
  overallRating: PerformanceRating;
  averageRating: number;
  strengths: string;
  areasForImprovement: string;
  achievements: string;
  employeeComments?: string;
  promotionRecommended: boolean;
  salaryIncreaseRecommended: boolean;
  increasePercentage?: number;
  status: 'draft' | 'submitted' | 'reviewed' | 'acknowledged' | 'completed';
  nextReviewDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HRStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  probationEmployees: number;
  employeesByDepartment: Partial<Record<Department, number>>;
  fullTimeCount: number;
  partTimeCount: number;
  contractCount: number;
  presentToday: number;
  absentToday: number;
  averageAttendanceRate: number;
  pendingLeaveRequests: number;
  totalPayrollThisMonth: number;
  averageSalary: number;
  averagePerformanceRating: number;
  topPerformers: number;
  pendingReviews: number;
  turnoverRate: number;
  genderRatio: { male: number; female: number; other: number };
  averageTenure: number;
}

// ═══ HELPERS ═══

export const getEmploymentStatusColor = (status: EmploymentStatus): string => {
  const map: Record<EmploymentStatus, string> = {
    active: 'bg-success/10 text-success',
    probation: 'bg-warning/10 text-warning',
    notice: 'bg-[hsl(25,90%,50%)]/10 text-[hsl(25,90%,50%)]',
    terminated: 'bg-destructive/10 text-destructive',
    resigned: 'bg-muted text-muted-foreground',
    retired: 'bg-info/10 text-info',
    on_leave: 'bg-warning/10 text-warning',
    suspended: 'bg-destructive/10 text-destructive',
  };
  return map[status];
};

export const getLeaveStatusColor = (status: LeaveStatus): string => {
  const map: Record<LeaveStatus, string> = {
    pending: 'bg-warning/10 text-warning',
    approved: 'bg-success/10 text-success',
    rejected: 'bg-destructive/10 text-destructive',
    cancelled: 'bg-muted text-muted-foreground',
    taken: 'bg-info/10 text-info',
  };
  return map[status];
};

export const getPerformanceRatingColor = (r: PerformanceRating): string => {
  if (r >= 4) return 'text-success';
  if (r >= 3) return 'text-warning';
  return 'text-destructive';
};

export const getDepartmentLabel = (d: Department): string =>
  d.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export const formatETB = (amount: number): string => `ETB ${amount.toLocaleString()}`;
export const formatETBShort = (amount: number): string => {
  if (amount >= 1000000) return `ETB ${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `ETB ${(amount / 1000).toFixed(0)}K`;
  return `ETB ${amount}`;
};

export const calculateTenure = (hireDate: string): number => {
  const diff = new Date().getTime() - new Date(hireDate).getTime();
  return Number((diff / (1000 * 60 * 60 * 24 * 365)).toFixed(1));
};

export const calculateLeaveDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let days = 0;
  const current = new Date(start);
  while (current <= end) {
    const dow = current.getDay();
    if (dow !== 0 && dow !== 6) days++;
    current.setDate(current.getDate() + 1);
  }
  return days;
};

// Ethiopian income tax brackets (simplified)
export const calculateIncomeTax = (grossIncome: number): number => {
  if (grossIncome <= 600) return 0;
  if (grossIncome <= 1650) return (grossIncome - 600) * 0.10;
  if (grossIncome <= 3200) return 105 + (grossIncome - 1650) * 0.15;
  if (grossIncome <= 5250) return 337.5 + (grossIncome - 3200) * 0.20;
  if (grossIncome <= 7800) return 747.5 + (grossIncome - 5250) * 0.25;
  if (grossIncome <= 10900) return 1385 + (grossIncome - 7800) * 0.30;
  return 2315 + (grossIncome - 10900) * 0.35;
};

// ═══ CALCULATE HR STATS ═══

export function calculateHRStats(
  employees: EnhancedEmployee[],
  leaveRequests: LeaveRequest[],
  payrolls: Payroll[]
): HRStats {
  const active = employees.filter(e => e.status === 'active');
  const onLeave = employees.filter(e => e.status === 'on_leave');
  const probation = employees.filter(e => e.status === 'probation');

  const byDept: Partial<Record<Department, number>> = {};
  employees.forEach(e => { byDept[e.department] = (byDept[e.department] || 0) + 1; });

  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthPayrolls = payrolls.filter(p => p.period === monthStr);
  const totalPayroll = monthPayrolls.reduce((s, p) => s + p.netPay, 0);

  const salaries = employees.filter(e => e.status === 'active' || e.status === 'probation').map(e => e.salary);
  const avgSalary = salaries.length ? salaries.reduce((a, b) => a + b, 0) / salaries.length : 0;

  const ratings = employees.map(e => e.performanceRating);
  const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  const genderRatio = { male: 0, female: 0, other: 0 };
  employees.forEach(e => { genderRatio[e.gender]++; });

  const tenures = employees.filter(e => e.status !== 'terminated' && e.status !== 'resigned').map(e => calculateTenure(e.hireDate));
  const avgTenure = tenures.length ? tenures.reduce((a, b) => a + b, 0) / tenures.length : 0;

  const terminated = employees.filter(e => e.status === 'terminated' || e.status === 'resigned').length;
  const avgHeadcount = employees.length || 1;

  return {
    totalEmployees: employees.length,
    activeEmployees: active.length,
    onLeaveEmployees: onLeave.length,
    probationEmployees: probation.length,
    employeesByDepartment: byDept,
    fullTimeCount: employees.filter(e => e.employmentType === 'full_time').length,
    partTimeCount: employees.filter(e => e.employmentType === 'part_time').length,
    contractCount: employees.filter(e => e.employmentType === 'contract').length,
    presentToday: active.length - onLeave.length,
    absentToday: onLeave.length,
    averageAttendanceRate: Number((employees.reduce((s, e) => s + e.attendance.attendanceRate, 0) / (employees.length || 1)).toFixed(1)),
    pendingLeaveRequests: leaveRequests.filter(l => l.status === 'pending').length,
    totalPayrollThisMonth: totalPayroll || employees.filter(e => e.status === 'active').reduce((s, e) => s + e.salary, 0),
    averageSalary: Math.round(avgSalary),
    averagePerformanceRating: Number(avgRating.toFixed(1)),
    topPerformers: employees.filter(e => e.performanceRating >= 4).length,
    pendingReviews: 0,
    turnoverRate: Number(((terminated / avgHeadcount) * 100).toFixed(1)),
    genderRatio,
    averageTenure: Number(avgTenure.toFixed(1)),
  };
}

// ═══ SAMPLE DATA ═══

const depts: Department[] = ['production', 'sales', 'finance', 'installation', 'quality', 'maintenance', 'cutting', 'procurement', 'management', 'hr'];

export const sampleEnhancedEmployees: EnhancedEmployee[] = [
  {
    id: 'EMP-001', employeeNumber: 'EMP-001',
    firstName: 'Abebe', lastName: 'Tekle', fullName: 'Abebe Tekle',
    firstNameAm: 'አበበ', lastNameAm: 'ተክሌ', fullNameAm: 'አበበ ተክሌ',
    gender: 'male', dateOfBirth: '1985-06-15', maritalStatus: 'married',
    personalEmail: 'abebe.t@gmail.com', workEmail: 'abebe@aluerp.com',
    personalPhone: '+251911234567', workPhone: '+251115551001',
    emergencyContactName: 'Meron Tekle', emergencyContactPhone: '+251912345678', emergencyContactRelation: 'Spouse',
    address: 'Bole Sub-City, Woreda 03', city: 'Addis Ababa', subCity: 'Bole',
    nationalId: 'ET-2345678', taxId: 'TIN-0012345', pensionNumber: 'PEN-001234',
    department: 'management', position: 'General Manager', positionLevel: 'executive',
    employmentType: 'full_time', status: 'active',
    reportsTo: undefined, reportsToName: undefined,
    hireDate: '2018-01-15', confirmationDate: '2018-04-15',
    salary: 45000, salaryCurrency: 'ETB',
    bankName: 'Commercial Bank of Ethiopia', bankAccount: '1000123456789', bankBranch: 'Bole Branch',
    healthInsurance: true, pensionEnrolled: true,
    transportationAllowance: 3000, mealAllowance: 2000, housingAllowance: 5000,
    leaveBalances: { annual: 18, sick: 10, paternity: 5 },
    leaveAccrualRate: 1.5,
    attendance: { totalDays: 22, presentDays: 21, absentDays: 0, lateDays: 1, overtime: 10, attendanceRate: 95.5 },
    performanceRating: 5, lastReviewDate: '2025-01-15', nextReviewDate: '2025-07-15',
    skills: [
      { name: 'Management', level: 'expert' },
      { name: 'Strategic Planning', level: 'advanced' },
      { name: 'Aluminum Manufacturing', level: 'expert' },
    ],
    notes: 'Founding member. 7+ years of experience.',
    createdAt: '2018-01-15', createdBy: 'SYSTEM', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'EMP-002', employeeNumber: 'EMP-002',
    firstName: 'Dawit', lastName: 'Hailu', fullName: 'Dawit Hailu',
    firstNameAm: 'ዳዊት', lastNameAm: 'ሃይሉ', fullNameAm: 'ዳዊት ሃይሉ',
    gender: 'male', dateOfBirth: '1990-03-22', maritalStatus: 'married',
    personalEmail: 'dawit.h@gmail.com', workEmail: 'dawit@aluerp.com',
    personalPhone: '+251922345678',
    address: 'Kirkos Sub-City, Woreda 08', city: 'Addis Ababa', subCity: 'Kirkos',
    taxId: 'TIN-0023456', pensionNumber: 'PEN-002345',
    department: 'production', position: 'Production Manager', positionLevel: 'manager',
    employmentType: 'full_time', status: 'active',
    reportsTo: 'EMP-001', reportsToName: 'Abebe Tekle',
    hireDate: '2019-06-01', confirmationDate: '2019-09-01',
    salary: 28000, salaryCurrency: 'ETB',
    bankName: 'Awash Bank', bankAccount: '2000234567890', bankBranch: 'Mexico Branch',
    healthInsurance: true, pensionEnrolled: true,
    transportationAllowance: 2000, mealAllowance: 1500, housingAllowance: 3000,
    leaveBalances: { annual: 14, sick: 8, paternity: 5 },
    leaveAccrualRate: 1.25,
    attendance: { totalDays: 22, presentDays: 22, absentDays: 0, lateDays: 0, overtime: 20, attendanceRate: 100 },
    performanceRating: 4, lastReviewDate: '2025-01-15', nextReviewDate: '2025-07-15',
    skills: [
      { name: 'Production Planning', level: 'expert' },
      { name: 'Quality Control', level: 'advanced' },
      { name: 'Team Leadership', level: 'advanced' },
    ],
    createdAt: '2019-06-01', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'EMP-003', employeeNumber: 'EMP-003',
    firstName: 'Marta', lastName: 'Teshome', fullName: 'Marta Teshome',
    firstNameAm: 'ማርታ', lastNameAm: 'ተሾመ', fullNameAm: 'ማርታ ተሾመ',
    gender: 'female', dateOfBirth: '1992-11-08', maritalStatus: 'single',
    personalEmail: 'marta.t@gmail.com', workEmail: 'marta@aluerp.com',
    personalPhone: '+251933456789',
    address: 'Arada Sub-City, Woreda 05', city: 'Addis Ababa', subCity: 'Arada',
    taxId: 'TIN-0034567', pensionNumber: 'PEN-003456',
    department: 'quality', position: 'Quality Inspector', positionLevel: 'senior',
    employmentType: 'full_time', status: 'active',
    reportsTo: 'EMP-001', reportsToName: 'Abebe Tekle',
    hireDate: '2020-02-15', confirmationDate: '2020-05-15',
    salary: 18000, salaryCurrency: 'ETB',
    bankName: 'Dashen Bank', bankAccount: '3000345678901',
    healthInsurance: true, pensionEnrolled: true,
    transportationAllowance: 1500, mealAllowance: 1000, housingAllowance: 2000,
    leaveBalances: { annual: 16, sick: 10, maternity: 90 },
    leaveAccrualRate: 1.25,
    attendance: { totalDays: 22, presentDays: 20, absentDays: 1, lateDays: 1, overtime: 8, attendanceRate: 90.9 },
    performanceRating: 4, lastReviewDate: '2025-01-20', nextReviewDate: '2025-07-20',
    skills: [
      { name: 'Quality Inspection', level: 'expert' },
      { name: 'ISO Standards', level: 'advanced' },
      { name: 'Aluminum Testing', level: 'advanced' },
    ],
    createdAt: '2020-02-15', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'EMP-004', employeeNumber: 'EMP-004',
    firstName: 'Solomon', lastName: 'Bekele', fullName: 'Solomon Bekele',
    firstNameAm: 'ሰለሞን', lastNameAm: 'በቀለ', fullNameAm: 'ሰለሞን በቀለ',
    gender: 'male', dateOfBirth: '1988-07-30', maritalStatus: 'married',
    personalEmail: 'solomon.b@gmail.com', workEmail: 'solomon@aluerp.com',
    personalPhone: '+251944567890',
    address: 'Yeka Sub-City, Woreda 12', city: 'Addis Ababa', subCity: 'Yeka',
    department: 'cutting', position: 'Senior Machine Operator', positionLevel: 'senior',
    employmentType: 'full_time', status: 'active',
    reportsTo: 'EMP-002', reportsToName: 'Dawit Hailu',
    hireDate: '2019-11-01', confirmationDate: '2020-02-01',
    salary: 15000, salaryCurrency: 'ETB',
    bankName: 'Bank of Abyssinia', bankAccount: '4000456789012',
    healthInsurance: true, pensionEnrolled: true,
    transportationAllowance: 1200, mealAllowance: 1000, housingAllowance: 0,
    leaveBalances: { annual: 12, sick: 8, paternity: 5 },
    leaveAccrualRate: 1.0,
    attendance: { totalDays: 22, presentDays: 21, absentDays: 0, lateDays: 1, overtime: 15, attendanceRate: 95.5 },
    performanceRating: 3,
    skills: [
      { name: 'CNC Operation', level: 'expert' },
      { name: 'Aluminum Cutting', level: 'expert' },
      { name: 'Machine Maintenance', level: 'intermediate' },
    ],
    createdAt: '2019-11-01', createdBy: 'EMP-001', updatedAt: '2025-02-15', updatedBy: 'EMP-002',
  },
  {
    id: 'EMP-005', employeeNumber: 'EMP-005',
    firstName: 'Yonas', lastName: 'Bekele', fullName: 'Yonas Bekele',
    firstNameAm: 'ዮናስ', lastNameAm: 'በቀለ', fullNameAm: 'ዮናስ በቀለ',
    gender: 'male', dateOfBirth: '1993-01-14', maritalStatus: 'single',
    personalEmail: 'yonas.b@gmail.com', workEmail: 'yonas@aluerp.com',
    personalPhone: '+251955678901',
    address: 'Nifas Silk-Lafto, Woreda 06', city: 'Addis Ababa', subCity: 'Nifas Silk-Lafto',
    department: 'installation', position: 'Installation Supervisor', positionLevel: 'supervisor',
    employmentType: 'full_time', status: 'active',
    reportsTo: 'EMP-002', reportsToName: 'Dawit Hailu',
    hireDate: '2021-03-01', confirmationDate: '2021-06-01',
    salary: 16000, salaryCurrency: 'ETB',
    bankName: 'Cooperative Bank of Oromia', bankAccount: '5000567890123',
    healthInsurance: true, pensionEnrolled: true,
    transportationAllowance: 2500, mealAllowance: 1200, housingAllowance: 0,
    leaveBalances: { annual: 10, sick: 6, paternity: 5 },
    leaveAccrualRate: 1.0,
    attendance: { totalDays: 22, presentDays: 19, absentDays: 2, lateDays: 1, overtime: 12, attendanceRate: 86.4 },
    performanceRating: 4,
    skills: [
      { name: 'Window Installation', level: 'expert' },
      { name: 'Curtain Wall Installation', level: 'advanced' },
      { name: 'Site Management', level: 'intermediate' },
    ],
    createdAt: '2021-03-01', createdBy: 'EMP-001', updatedAt: '2025-02-20', updatedBy: 'EMP-001',
  },
  {
    id: 'EMP-006', employeeNumber: 'EMP-006',
    firstName: 'Hana', lastName: 'Gebremariam', fullName: 'Hana Gebremariam',
    firstNameAm: 'ሃና', lastNameAm: 'ገብረማሪያም', fullNameAm: 'ሃና ገብረማሪያም',
    gender: 'female', dateOfBirth: '1995-09-25', maritalStatus: 'single',
    personalEmail: 'hana.g@gmail.com', workEmail: 'hana@aluerp.com',
    personalPhone: '+251966789012',
    address: 'Lideta Sub-City, Woreda 04', city: 'Addis Ababa', subCity: 'Lideta',
    department: 'sales', position: 'Sales Representative', positionLevel: 'junior',
    employmentType: 'full_time', status: 'active',
    reportsTo: 'EMP-001', reportsToName: 'Abebe Tekle',
    hireDate: '2023-01-10', confirmationDate: '2023-04-10',
    salary: 12000, salaryCurrency: 'ETB',
    bankName: 'Commercial Bank of Ethiopia', bankAccount: '6000678901234',
    healthInsurance: true, pensionEnrolled: true,
    transportationAllowance: 1000, mealAllowance: 800, housingAllowance: 0,
    leaveBalances: { annual: 8, sick: 6, maternity: 90 },
    leaveAccrualRate: 1.0,
    attendance: { totalDays: 22, presentDays: 22, absentDays: 0, lateDays: 0, overtime: 5, attendanceRate: 100 },
    performanceRating: 5,
    skills: [
      { name: 'Sales', level: 'advanced' },
      { name: 'Customer Relations', level: 'advanced' },
      { name: 'Amharic', level: 'expert' },
    ],
    createdAt: '2023-01-10', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'EMP-007', employeeNumber: 'EMP-007',
    firstName: 'Teklu', lastName: 'Mesfin', fullName: 'Teklu Mesfin',
    firstNameAm: 'ተክሉ', lastNameAm: 'መስፍን', fullNameAm: 'ተክሉ መስፍን',
    gender: 'male', dateOfBirth: '1991-04-18', maritalStatus: 'married',
    personalEmail: 'teklu.m@gmail.com', workEmail: 'teklu@aluerp.com',
    personalPhone: '+251977890123',
    address: 'Kolfe Keranio, Woreda 10', city: 'Addis Ababa', subCity: 'Kolfe Keranio',
    department: 'finance', position: 'Finance Officer', positionLevel: 'senior',
    employmentType: 'full_time', status: 'active',
    reportsTo: 'EMP-001', reportsToName: 'Abebe Tekle',
    hireDate: '2020-08-01', confirmationDate: '2020-11-01',
    salary: 20000, salaryCurrency: 'ETB',
    bankName: 'Dashen Bank', bankAccount: '7000789012345', bankBranch: 'Piassa Branch',
    healthInsurance: true, pensionEnrolled: true,
    transportationAllowance: 1500, mealAllowance: 1000, housingAllowance: 2000,
    leaveBalances: { annual: 14, sick: 10, paternity: 5 },
    leaveAccrualRate: 1.25,
    attendance: { totalDays: 22, presentDays: 21, absentDays: 1, lateDays: 0, overtime: 4, attendanceRate: 95.5 },
    performanceRating: 3,
    skills: [
      { name: 'Accounting', level: 'expert' },
      { name: 'Peachtree', level: 'advanced' },
      { name: 'Tax Compliance', level: 'advanced' },
    ],
    createdAt: '2020-08-01', createdBy: 'EMP-001', updatedAt: '2025-02-28', updatedBy: 'EMP-001',
  },
  {
    id: 'EMP-008', employeeNumber: 'EMP-008',
    firstName: 'Kidist', lastName: 'Alemu', fullName: 'Kidist Alemu',
    firstNameAm: 'ቅድስት', lastNameAm: 'አለሙ', fullNameAm: 'ቅድስት አለሙ',
    gender: 'female', dateOfBirth: '1997-12-03', maritalStatus: 'single',
    personalEmail: 'kidist.a@gmail.com', workEmail: 'kidist@aluerp.com',
    personalPhone: '+251988901234',
    address: 'Bole Sub-City, Woreda 14', city: 'Addis Ababa', subCity: 'Bole',
    department: 'procurement', position: 'Procurement Officer', positionLevel: 'junior',
    employmentType: 'full_time', status: 'probation',
    reportsTo: 'EMP-007', reportsToName: 'Teklu Mesfin',
    hireDate: '2025-01-15', probationEndDate: '2025-04-15',
    salary: 11000, salaryCurrency: 'ETB',
    bankName: 'Awash Bank', bankAccount: '8000890123456',
    healthInsurance: false, pensionEnrolled: true,
    transportationAllowance: 800, mealAllowance: 600, housingAllowance: 0,
    leaveBalances: { annual: 2, sick: 2, maternity: 90 },
    leaveAccrualRate: 1.0,
    attendance: { totalDays: 22, presentDays: 20, absentDays: 1, lateDays: 1, overtime: 2, attendanceRate: 90.9 },
    performanceRating: 3,
    skills: [
      { name: 'Procurement', level: 'intermediate' },
      { name: 'Supplier Management', level: 'beginner' },
    ],
    createdAt: '2025-01-15', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'EMP-009', employeeNumber: 'EMP-009',
    firstName: 'Bereket', lastName: 'Tadesse', fullName: 'Bereket Tadesse',
    firstNameAm: 'በረከት', lastNameAm: 'ታደሰ', fullNameAm: 'በረከት ታደሰ',
    gender: 'male', dateOfBirth: '1994-08-20', maritalStatus: 'single',
    personalEmail: 'bereket.t@gmail.com', workEmail: 'bereket@aluerp.com',
    personalPhone: '+251999012345',
    address: 'Akaky Kaliti, Woreda 02', city: 'Addis Ababa', subCity: 'Akaky Kaliti',
    department: 'maintenance', position: 'Maintenance Technician', positionLevel: 'junior',
    employmentType: 'full_time', status: 'on_leave',
    reportsTo: 'EMP-002', reportsToName: 'Dawit Hailu',
    hireDate: '2022-07-01', confirmationDate: '2022-10-01',
    salary: 13000, salaryCurrency: 'ETB',
    bankName: 'Nib Bank', bankAccount: '9000901234567',
    healthInsurance: true, pensionEnrolled: true,
    transportationAllowance: 1000, mealAllowance: 800, housingAllowance: 0,
    leaveBalances: { annual: 5, sick: 4, paternity: 5 },
    leaveAccrualRate: 1.0,
    attendance: { totalDays: 22, presentDays: 15, absentDays: 5, lateDays: 2, overtime: 0, attendanceRate: 68.2 },
    performanceRating: 2,
    skills: [
      { name: 'Equipment Repair', level: 'intermediate' },
      { name: 'Electrical Systems', level: 'intermediate' },
    ],
    createdAt: '2022-07-01', createdBy: 'EMP-001', updatedAt: '2025-03-05', updatedBy: 'EMP-002',
  },
  {
    id: 'EMP-010', employeeNumber: 'EMP-010',
    firstName: 'Tsion', lastName: 'Kebede', fullName: 'Tsion Kebede',
    firstNameAm: 'ፅዮን', lastNameAm: 'ከበደ', fullNameAm: 'ፅዮን ከበደ',
    gender: 'female', dateOfBirth: '1996-02-14', maritalStatus: 'single',
    personalEmail: 'tsion.k@gmail.com', workEmail: 'tsion@aluerp.com',
    personalPhone: '+251910111213',
    address: 'Gulele Sub-City, Woreda 07', city: 'Addis Ababa', subCity: 'Gulele',
    department: 'hr', position: 'HR Officer', positionLevel: 'junior',
    employmentType: 'full_time', status: 'active',
    reportsTo: 'EMP-001', reportsToName: 'Abebe Tekle',
    hireDate: '2023-06-01', confirmationDate: '2023-09-01',
    salary: 14000, salaryCurrency: 'ETB',
    bankName: 'Commercial Bank of Ethiopia', bankAccount: '1001011121314',
    healthInsurance: true, pensionEnrolled: true,
    transportationAllowance: 1000, mealAllowance: 800, housingAllowance: 0,
    leaveBalances: { annual: 10, sick: 8, maternity: 90 },
    leaveAccrualRate: 1.0,
    attendance: { totalDays: 22, presentDays: 22, absentDays: 0, lateDays: 0, overtime: 3, attendanceRate: 100 },
    performanceRating: 4,
    skills: [
      { name: 'HR Management', level: 'intermediate' },
      { name: 'Payroll', level: 'intermediate' },
      { name: 'Recruitment', level: 'advanced' },
    ],
    createdAt: '2023-06-01', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
];

export const sampleLeaveRequests: LeaveRequest[] = [
  {
    id: 'LV-001', requestNumber: 'LV-2025-001',
    employeeId: 'EMP-009', employeeName: 'Bereket Tadesse',
    leaveType: 'annual', startDate: '2025-03-03', endDate: '2025-03-14', daysRequested: 10,
    reason: 'Family visit to Bahir Dar',
    status: 'approved', submittedDate: '2025-02-25',
    approvedBy: 'EMP-002', approvedByName: 'Dawit Hailu', approvedDate: '2025-02-26',
    remainingBalanceAfter: 5,
    createdAt: '2025-02-25', updatedAt: '2025-02-26',
  },
  {
    id: 'LV-002', requestNumber: 'LV-2025-002',
    employeeId: 'EMP-003', employeeName: 'Marta Teshome',
    leaveType: 'sick', startDate: '2025-03-10', endDate: '2025-03-11', daysRequested: 2,
    reason: 'Doctor appointment and recovery',
    status: 'approved', submittedDate: '2025-03-09',
    approvedBy: 'EMP-001', approvedByName: 'Abebe Tekle', approvedDate: '2025-03-09',
    remainingBalanceAfter: 8,
    createdAt: '2025-03-09', updatedAt: '2025-03-09',
  },
  {
    id: 'LV-003', requestNumber: 'LV-2025-003',
    employeeId: 'EMP-006', employeeName: 'Hana Gebremariam',
    leaveType: 'annual', startDate: '2025-03-20', endDate: '2025-03-21', daysRequested: 2,
    reason: 'Personal errand',
    status: 'pending', submittedDate: '2025-03-07',
    remainingBalanceAfter: 6,
    createdAt: '2025-03-07', updatedAt: '2025-03-07',
  },
  {
    id: 'LV-004', requestNumber: 'LV-2025-004',
    employeeId: 'EMP-004', employeeName: 'Solomon Bekele',
    leaveType: 'emergency', startDate: '2025-02-15', endDate: '2025-02-15', daysRequested: 1,
    reason: 'Family emergency',
    status: 'taken', submittedDate: '2025-02-15',
    approvedBy: 'EMP-002', approvedByName: 'Dawit Hailu', approvedDate: '2025-02-15',
    remainingBalanceAfter: 12,
    createdAt: '2025-02-15', updatedAt: '2025-02-15',
  },
];

export const samplePayrolls: Payroll[] = sampleEnhancedEmployees.filter(e => e.status === 'active' || e.status === 'probation').map((e, idx) => {
  const overtime = e.attendance.overtime * (e.salary / 176) * 1.5;
  const totalAllowances = e.transportationAllowance + e.mealAllowance + e.housingAllowance;
  const gross = e.salary + overtime + totalAllowances;
  const tax = calculateIncomeTax(gross);
  const pension = e.pensionEnrolled ? gross * 0.07 : 0;
  const health = e.healthInsurance ? 200 : 0;
  const totalDeductions = tax + pension + health;
  return {
    id: `PAYRL-${String(idx + 1).padStart(3, '0')}`,
    payrollNumber: `PAYRL-2025-${String(idx + 1).padStart(3, '0')}`,
    period: '2025-03', startDate: '2025-03-01', endDate: '2025-03-31', paymentDate: '2025-03-28',
    employeeId: e.id, employeeName: e.fullName, employeeNumber: e.employeeNumber, department: e.department,
    baseSalary: e.salary,
    overtimeHours: e.attendance.overtime, overtimeRate: (e.salary / 176) * 1.5, overtimePay: Math.round(overtime),
    transportationAllowance: e.transportationAllowance, mealAllowance: e.mealAllowance, housingAllowance: e.housingAllowance,
    totalAllowances,
    performanceBonus: e.performanceRating >= 4 ? 1000 : 0, attendanceBonus: e.attendance.attendanceRate >= 95 ? 500 : 0,
    totalBonuses: (e.performanceRating >= 4 ? 1000 : 0) + (e.attendance.attendanceRate >= 95 ? 500 : 0),
    grossPay: Math.round(gross + (e.performanceRating >= 4 ? 1000 : 0) + (e.attendance.attendanceRate >= 95 ? 500 : 0)),
    incomeTax: Math.round(tax), pension: Math.round(pension), healthInsurance: health, loanRepayment: 0,
    totalDeductions: Math.round(totalDeductions),
    netPay: Math.round(gross + (e.performanceRating >= 4 ? 1000 : 0) + (e.attendance.attendanceRate >= 95 ? 500 : 0) - totalDeductions),
    bankName: e.bankName || '', bankAccount: e.bankAccount || '',
    status: 'calculated' as PayrollStatus,
    calculatedBy: 'EMP-010', calculatedByName: 'Tsion Kebede', calculatedAt: '2025-03-25',
    createdAt: '2025-03-25', updatedAt: '2025-03-25',
  };
});
