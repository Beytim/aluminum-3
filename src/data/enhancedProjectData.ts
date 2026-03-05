// ══════════════════════════════════════════
// ENHANCED PROJECT DATA MODEL & SAMPLE DATA
// ══════════════════════════════════════════

export interface ProjectProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'ordered' | 'received' | 'installed';
  notes?: string;
}

export interface ProjectMilestones {
  depositPaid: boolean;
  materialsOrdered: boolean;
  materialsReceived: boolean;
  productionStarted: boolean;
  productionCompleted: boolean;
  installationStarted: boolean;
  installationCompleted: boolean;
  finalPayment: boolean;
}

export interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  type: 'contract' | 'drawing' | 'specification' | 'other';
  uploadedAt: string;
  uploadedBy: string;
}

export interface ProjectTimelineEvent {
  date: string;
  event: string;
  type: 'status_change' | 'payment' | 'note' | 'milestone';
  user: string;
}

export type ProjectType = 'Residential' | 'Commercial' | 'Industrial' | 'Government';
export type ProjectStatus = 'Quote' | 'Deposit' | 'Materials Ordered' | 'Production' | 'Ready' | 'Installation' | 'Completed' | 'On Hold' | 'Cancelled';

export interface EnhancedProject {
  id: string;
  projectNumber: string;
  name: string;
  nameAm: string;

  customerId: string;
  customerName: string;
  customerContact?: string;
  customerPhone?: string;

  type: ProjectType;
  status: ProjectStatus;

  value: number;
  deposit: number;
  depositPercentage: number;
  balance: number;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  profit: number;
  profitMargin: number;

  orderDate: string;
  startDate?: string;
  dueDate: string;
  completedDate?: string;

  progress: number;
  milestones: ProjectMilestones;

  quoteId?: string;
  workOrderIds: string[];
  purchaseOrderIds: string[];
  invoiceIds: string[];
  paymentIds: string[];
  installationIds: string[];

  products: ProjectProduct[];

  projectManager: string;
  projectManagerId?: string;
  teamMembers?: string[];

  documents?: ProjectDocument[];
  notes?: string;
  internalNotes?: string;

  isOverdue: boolean;
  isAtRisk: boolean;

  timeline?: ProjectTimelineEvent[];

  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  cancelledProjects: number;
  totalValue: number;
  totalDeposits: number;
  totalBalance: number;
  averageValue: number;
  averageProgress: number;
  onTrackProjects: number;
  atRiskProjects: number;
  overdueProjects: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  startingThisMonth: number;
  dueThisMonth: number;
  completingThisMonth: number;
}

export function calculateProjectStats(projects: EnhancedProject[]): ProjectStats {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const activeStatuses: ProjectStatus[] = ['Deposit', 'Materials Ordered', 'Production', 'Ready', 'Installation'];

  const byStatus: Record<string, number> = {};
  const byType: Record<string, number> = {};

  projects.forEach(p => {
    byStatus[p.status] = (byStatus[p.status] || 0) + 1;
    byType[p.type] = (byType[p.type] || 0) + 1;
  });

  const active = projects.filter(p => activeStatuses.includes(p.status));
  const completed = projects.filter(p => p.status === 'Completed');
  const onHold = projects.filter(p => p.status === 'On Hold');
  const cancelled = projects.filter(p => p.status === 'Cancelled');
  const overdue = projects.filter(p => p.isOverdue);
  const atRisk = projects.filter(p => p.isAtRisk && !p.isOverdue);

  return {
    totalProjects: projects.length,
    activeProjects: active.length,
    completedProjects: completed.length,
    onHoldProjects: onHold.length,
    cancelledProjects: cancelled.length,
    totalValue: projects.reduce((s, p) => s + p.value, 0),
    totalDeposits: projects.reduce((s, p) => s + p.deposit, 0),
    totalBalance: projects.reduce((s, p) => s + p.balance, 0),
    averageValue: projects.length > 0 ? projects.reduce((s, p) => s + p.value, 0) / projects.length : 0,
    averageProgress: projects.length > 0 ? projects.reduce((s, p) => s + p.progress, 0) / projects.length : 0,
    onTrackProjects: active.filter(p => !p.isOverdue && !p.isAtRisk).length,
    atRiskProjects: atRisk.length,
    overdueProjects: overdue.length,
    byStatus,
    byType,
    startingThisMonth: projects.filter(p => p.startDate?.startsWith(thisMonth)).length,
    dueThisMonth: projects.filter(p => p.dueDate.startsWith(thisMonth)).length,
    completingThisMonth: completed.filter(p => p.completedDate?.startsWith(thisMonth)).length,
  };
}

export function formatETBShort(value: number): string {
  if (value >= 1000000) return `ETB ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `ETB ${(value / 1000).toFixed(0)}K`;
  return `ETB ${value.toLocaleString()}`;
}

export function formatETBFull(value: number): string {
  return `ETB ${value.toLocaleString()}`;
}

export function getDaysRemaining(dueDate: string): number {
  return Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export const projectStatusColors: Record<string, string> = {
  'Quote': 'bg-muted text-muted-foreground',
  'Deposit': 'bg-info/10 text-info',
  'Materials Ordered': 'bg-warning/10 text-warning',
  'Production': 'bg-primary/10 text-primary',
  'Ready': 'bg-success/10 text-success',
  'Installation': 'bg-chart-4/10 text-chart-4',
  'Completed': 'bg-success/10 text-success',
  'On Hold': 'bg-warning/10 text-warning',
  'Cancelled': 'bg-destructive/10 text-destructive',
};

export const projectTypeColors: Record<string, string> = {
  'Residential': 'bg-chart-3/10 text-chart-3',
  'Commercial': 'bg-primary/10 text-primary',
  'Industrial': 'bg-chart-4/10 text-chart-4',
  'Government': 'bg-chart-2/10 text-chart-2',
};

// ═══ SAMPLE DATA ═══
export const enhancedSampleProjects: EnhancedProject[] = [
  {
    id: 'PJ-001', projectNumber: 'PJ-001',
    name: 'Bole Apartments Tower A', nameAm: 'ቦሌ አፓርትመንት ታወር ሀ',
    customerId: 'CUS-001', customerName: 'Ayat Real Estate', customerContact: 'Ato Yonas Bekele', customerPhone: '+251-911-234567',
    type: 'Commercial', status: 'Production',
    value: 850000, deposit: 425000, depositPercentage: 50, balance: 425000,
    materialCost: 380000, laborCost: 120000, overheadCost: 45000, totalCost: 545000, profit: 305000, profitMargin: 35.9,
    orderDate: '2025-01-15', startDate: '2025-02-01', dueDate: '2025-04-30',
    progress: 45,
    milestones: { depositPaid: true, materialsOrdered: true, materialsReceived: true, productionStarted: true, productionCompleted: false, installationStarted: false, installationCompleted: false, finalPayment: false },
    quoteId: 'QT-002', workOrderIds: ['WO-001', 'WO-002', 'WO-008'], purchaseOrderIds: ['PO-001'], invoiceIds: ['INV-001'], paymentIds: ['PAY-001'], installationIds: [],
    products: [
      { productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 48, unitPrice: 7200, totalPrice: 345600, status: 'ordered' },
      { productId: 'PRD-004', productName: 'Sliding Door 3-Panel', quantity: 12, unitPrice: 19500, totalPrice: 234000, status: 'ordered' },
      { productId: 'PRD-003', productName: 'Fixed Window Large', quantity: 24, unitPrice: 6000, totalPrice: 144000, status: 'pending' },
    ],
    projectManager: 'Abebe Tekle', projectManagerId: 'EMP-001', teamMembers: ['EMP-003', 'EMP-005'],
    isOverdue: true, isAtRisk: true,
    timeline: [
      { date: '2025-01-15', event: 'Project created', type: 'status_change', user: 'Admin' },
      { date: '2025-01-20', event: 'Deposit ETB 425,000 received', type: 'payment', user: 'Finance' },
      { date: '2025-02-01', event: 'Production started', type: 'milestone', user: 'Production' },
      { date: '2025-02-15', event: 'Materials ordered from EMAL', type: 'milestone', user: 'Procurement' },
    ],
    notes: 'High priority project for Ayat Real Estate',
    createdAt: '2025-01-15', createdBy: 'EMP-001', updatedAt: '2025-03-06', updatedBy: 'EMP-001',
  },
  {
    id: 'PJ-002', projectNumber: 'PJ-002',
    name: 'Villa Sunshine Residence', nameAm: 'ቪላ ሳንሻይን መኖሪያ',
    customerId: 'CUS-002', customerName: 'Ato Kebede Alemu', customerContact: 'Kebede Alemu', customerPhone: '+251-912-345678',
    type: 'Residential', status: 'Materials Ordered',
    value: 285000, deposit: 142500, depositPercentage: 50, balance: 142500,
    materialCost: 140000, laborCost: 45000, overheadCost: 15000, totalCost: 200000, profit: 85000, profitMargin: 29.8,
    orderDate: '2025-02-01', startDate: '2025-02-20', dueDate: '2025-05-15',
    progress: 25,
    milestones: { depositPaid: true, materialsOrdered: true, materialsReceived: false, productionStarted: false, productionCompleted: false, installationStarted: false, installationCompleted: false, finalPayment: false },
    quoteId: 'QT-004', workOrderIds: ['WO-003', 'WO-010'], purchaseOrderIds: [], invoiceIds: [], paymentIds: [], installationIds: [],
    products: [
      { productId: 'PRD-002', productName: 'Casement Window Single', quantity: 16, unitPrice: 5100, totalPrice: 81600, status: 'ordered' },
      { productId: 'PRD-005', productName: 'Hinged Door Double', quantity: 4, unitPrice: 15200, totalPrice: 60800, status: 'pending' },
      { productId: 'PRD-009', productName: 'Aluminum Louver Window', quantity: 6, unitPrice: 5600, totalPrice: 33600, status: 'pending' },
    ],
    projectManager: 'Dawit Hailu', projectManagerId: 'EMP-002',
    isOverdue: false, isAtRisk: false,
    timeline: [
      { date: '2025-02-01', event: 'Project created from quote QT-004', type: 'status_change', user: 'Sales' },
      { date: '2025-02-05', event: 'Deposit ETB 142,500 received', type: 'payment', user: 'Finance' },
      { date: '2025-02-20', event: 'Materials ordered', type: 'milestone', user: 'Procurement' },
    ],
    createdAt: '2025-02-01', createdBy: 'EMP-002', updatedAt: '2025-02-20', updatedBy: 'EMP-002',
  },
  {
    id: 'PJ-003', projectNumber: 'PJ-003',
    name: 'Megenagna Office Complex', nameAm: 'መገናኛ ቢሮ ኮምፕሌክስ',
    customerId: 'CUS-003', customerName: 'Ethio Engineering', customerContact: 'Eng. Dawit Tesfaye', customerPhone: '+251-913-456789',
    type: 'Commercial', status: 'Installation',
    value: 1200000, deposit: 900000, depositPercentage: 75, balance: 300000,
    materialCost: 550000, laborCost: 180000, overheadCost: 70000, totalCost: 800000, profit: 400000, profitMargin: 33.3,
    orderDate: '2024-11-01', startDate: '2024-11-15', dueDate: '2025-03-15',
    progress: 85,
    milestones: { depositPaid: true, materialsOrdered: true, materialsReceived: true, productionStarted: true, productionCompleted: true, installationStarted: true, installationCompleted: false, finalPayment: false },
    workOrderIds: ['WO-004', 'WO-007'], purchaseOrderIds: ['PO-003'], invoiceIds: ['INV-003'], paymentIds: [], installationIds: ['INST-001'],
    products: [
      { productId: 'PRD-007', productName: 'Curtain Wall System', quantity: 1, unitPrice: 55000, totalPrice: 55000, status: 'installed' },
      { productId: 'PRD-008', productName: 'Glass Handrail System', quantity: 6, unitPrice: 13500, totalPrice: 81000, status: 'received' },
      { productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 120, unitPrice: 7200, totalPrice: 864000, status: 'installed' },
    ],
    projectManager: 'Abebe Tekle', projectManagerId: 'EMP-001', teamMembers: ['EMP-004', 'EMP-006'],
    isOverdue: true, isAtRisk: true,
    timeline: [
      { date: '2024-11-01', event: 'Project created', type: 'status_change', user: 'Admin' },
      { date: '2024-11-10', event: 'Deposit ETB 900,000 received', type: 'payment', user: 'Finance' },
      { date: '2025-01-15', event: 'Production completed', type: 'milestone', user: 'Production' },
      { date: '2025-02-01', event: 'Installation started', type: 'milestone', user: 'Installation' },
    ],
    createdAt: '2024-11-01', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'PJ-004', projectNumber: 'PJ-004',
    name: 'Sarbet Hotel Renovation', nameAm: 'ሳርቤት ሆቴል ማደስ',
    customerId: 'CUS-004', customerName: 'Getahun Hotels PLC', customerContact: 'W/ro Meron Getahun', customerPhone: '+251-914-567890',
    type: 'Commercial', status: 'Quote',
    value: 450000, deposit: 0, depositPercentage: 0, balance: 450000,
    materialCost: 0, laborCost: 0, overheadCost: 0, totalCost: 0, profit: 0, profitMargin: 0,
    orderDate: '2025-02-20', dueDate: '2025-06-30',
    progress: 5,
    milestones: { depositPaid: false, materialsOrdered: false, materialsReceived: false, productionStarted: false, productionCompleted: false, installationStarted: false, installationCompleted: false, finalPayment: false },
    quoteId: 'QT-001', workOrderIds: [], purchaseOrderIds: [], invoiceIds: [], paymentIds: [], installationIds: [],
    products: [],
    projectManager: 'Sara Mengistu', projectManagerId: 'EMP-003',
    isOverdue: false, isAtRisk: false,
    timeline: [
      { date: '2025-02-20', event: 'Quote submitted to client', type: 'status_change', user: 'Sales' },
    ],
    createdAt: '2025-02-20', createdBy: 'EMP-003', updatedAt: '2025-02-20', updatedBy: 'EMP-003',
  },
  {
    id: 'PJ-005', projectNumber: 'PJ-005',
    name: 'CMC Residential Block', nameAm: 'ሲኤምሲ መኖሪያ ብሎክ',
    customerId: 'CUS-005', customerName: 'Noah Construction', customerContact: 'Ato Samuel Noah', customerPhone: '+251-915-678901',
    type: 'Residential', status: 'Ready',
    value: 520000, deposit: 390000, depositPercentage: 75, balance: 130000,
    materialCost: 250000, laborCost: 80000, overheadCost: 30000, totalCost: 360000, profit: 160000, profitMargin: 30.8,
    orderDate: '2024-12-10', startDate: '2024-12-20', dueDate: '2025-03-01',
    progress: 95,
    milestones: { depositPaid: true, materialsOrdered: true, materialsReceived: true, productionStarted: true, productionCompleted: true, installationStarted: false, installationCompleted: false, finalPayment: false },
    quoteId: 'QT-005', workOrderIds: ['WO-005', 'WO-006'], purchaseOrderIds: [], invoiceIds: [], paymentIds: [], installationIds: [],
    products: [
      { productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 32, unitPrice: 7200, totalPrice: 230400, status: 'received' },
      { productId: 'PRD-005', productName: 'Hinged Door Double', quantity: 8, unitPrice: 15200, totalPrice: 121600, status: 'received' },
      { productId: 'PRD-009', productName: 'Aluminum Louver Window', quantity: 15, unitPrice: 5600, totalPrice: 84000, status: 'received' },
    ],
    projectManager: 'Dawit Hailu', projectManagerId: 'EMP-002', teamMembers: ['EMP-005'],
    isOverdue: true, isAtRisk: false,
    timeline: [
      { date: '2024-12-10', event: 'Project created', type: 'status_change', user: 'Sales' },
      { date: '2024-12-15', event: 'Deposit ETB 390,000 received', type: 'payment', user: 'Finance' },
      { date: '2025-02-25', event: 'Production completed, ready for install', type: 'milestone', user: 'Production' },
    ],
    createdAt: '2024-12-10', createdBy: 'EMP-002', updatedAt: '2025-02-25', updatedBy: 'EMP-002',
  },
  {
    id: 'PJ-006', projectNumber: 'PJ-006',
    name: 'Kazanchis Bank Branch', nameAm: 'ካዛንቺስ ባንክ ቅርንጫፍ',
    customerId: 'CUS-006', customerName: 'Commercial Bank Ethiopia', customerContact: 'Ato Tadesse Girma', customerPhone: '+251-916-789012',
    type: 'Government', status: 'Deposit',
    value: 380000, deposit: 190000, depositPercentage: 50, balance: 190000,
    materialCost: 180000, laborCost: 55000, overheadCost: 20000, totalCost: 255000, profit: 125000, profitMargin: 32.9,
    orderDate: '2025-02-10', startDate: '2025-03-01', dueDate: '2025-05-20',
    progress: 15,
    milestones: { depositPaid: true, materialsOrdered: false, materialsReceived: false, productionStarted: false, productionCompleted: false, installationStarted: false, installationCompleted: false, finalPayment: false },
    workOrderIds: ['WO-009'], purchaseOrderIds: [], invoiceIds: [], paymentIds: [], installationIds: [],
    products: [
      { productId: 'PRD-010', productName: 'Office Partition System', quantity: 20, unitPrice: 11500, totalPrice: 230000, status: 'pending' },
      { productId: 'PRD-002', productName: 'Casement Window Single', quantity: 15, unitPrice: 5100, totalPrice: 76500, status: 'pending' },
    ],
    projectManager: 'Abebe Tekle', projectManagerId: 'EMP-001',
    isOverdue: false, isAtRisk: false,
    timeline: [
      { date: '2025-02-10', event: 'Project created', type: 'status_change', user: 'Sales' },
      { date: '2025-02-12', event: 'Deposit ETB 190,000 received', type: 'payment', user: 'Finance' },
    ],
    createdAt: '2025-02-10', createdBy: 'EMP-001', updatedAt: '2025-02-12', updatedBy: 'EMP-001',
  },
  {
    id: 'PJ-007', projectNumber: 'PJ-007',
    name: 'Addis View Penthouse', nameAm: 'አዲስ ቪው ፔንትሃውስ',
    customerId: 'CUS-007', customerName: 'W/ro Tigist Haile', customerContact: 'Tigist Haile', customerPhone: '+251-917-890123',
    type: 'Residential', status: 'Completed',
    value: 195000, deposit: 195000, depositPercentage: 100, balance: 0,
    materialCost: 95000, laborCost: 30000, overheadCost: 12000, totalCost: 137000, profit: 58000, profitMargin: 29.7,
    orderDate: '2024-09-15', startDate: '2024-10-01', dueDate: '2025-01-15', completedDate: '2025-01-12',
    progress: 100,
    milestones: { depositPaid: true, materialsOrdered: true, materialsReceived: true, productionStarted: true, productionCompleted: true, installationStarted: true, installationCompleted: true, finalPayment: true },
    workOrderIds: [], purchaseOrderIds: [], invoiceIds: [], paymentIds: [], installationIds: [],
    products: [
      { productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 10, unitPrice: 7200, totalPrice: 72000, status: 'installed' },
      { productId: 'PRD-004', productName: 'Sliding Door 3-Panel', quantity: 2, unitPrice: 19500, totalPrice: 39000, status: 'installed' },
      { productId: 'PRD-008', productName: 'Glass Handrail System', quantity: 3, unitPrice: 13500, totalPrice: 40500, status: 'installed' },
    ],
    projectManager: 'Sara Mengistu', projectManagerId: 'EMP-003',
    isOverdue: false, isAtRisk: false,
    timeline: [
      { date: '2024-09-15', event: 'Project created', type: 'status_change', user: 'Sales' },
      { date: '2024-09-20', event: 'Full payment ETB 195,000 received', type: 'payment', user: 'Finance' },
      { date: '2025-01-12', event: 'Installation completed - Project closed', type: 'milestone', user: 'Installation' },
    ],
    createdAt: '2024-09-15', createdBy: 'EMP-003', updatedAt: '2025-01-12', updatedBy: 'EMP-003',
  },
  {
    id: 'PJ-008', projectNumber: 'PJ-008',
    name: 'Lideta Tower Phase 2', nameAm: 'ሊደታ ታወር ምዕራፍ 2',
    customerId: 'CUS-003', customerName: 'Ethio Engineering', customerContact: 'Eng. Dawit Tesfaye', customerPhone: '+251-913-456789',
    type: 'Commercial', status: 'Quote',
    value: 1400000, deposit: 0, depositPercentage: 0, balance: 1400000,
    materialCost: 0, laborCost: 0, overheadCost: 0, totalCost: 0, profit: 0, profitMargin: 0,
    orderDate: '2025-02-25', dueDate: '2025-08-30',
    progress: 2,
    milestones: { depositPaid: false, materialsOrdered: false, materialsReceived: false, productionStarted: false, productionCompleted: false, installationStarted: false, installationCompleted: false, finalPayment: false },
    quoteId: 'QT-006', workOrderIds: [], purchaseOrderIds: [], invoiceIds: [], paymentIds: [], installationIds: [],
    products: [],
    projectManager: 'Abebe Tekle', projectManagerId: 'EMP-001',
    isOverdue: false, isAtRisk: false,
    timeline: [
      { date: '2025-02-25', event: 'Quote QT-006 sent to client', type: 'status_change', user: 'Sales' },
    ],
    createdAt: '2025-02-25', createdBy: 'EMP-001', updatedAt: '2025-02-25', updatedBy: 'EMP-001',
  },
  {
    id: 'PJ-009', projectNumber: 'PJ-009',
    name: 'Addis Builders Residential G+5', nameAm: 'አዲስ ገንቢዎች መኖሪያ G+5',
    customerId: 'CUS-008', customerName: 'Addis Builders PLC', customerContact: 'Ato Henok Assefa', customerPhone: '+251-918-901234',
    type: 'Residential', status: 'Production',
    value: 620000, deposit: 310000, depositPercentage: 50, balance: 310000,
    materialCost: 300000, laborCost: 95000, overheadCost: 35000, totalCost: 430000, profit: 190000, profitMargin: 30.6,
    orderDate: '2025-01-10', startDate: '2025-01-25', dueDate: '2025-04-15',
    progress: 55,
    milestones: { depositPaid: true, materialsOrdered: true, materialsReceived: true, productionStarted: true, productionCompleted: false, installationStarted: false, installationCompleted: false, finalPayment: false },
    quoteId: 'QT-003', workOrderIds: [], purchaseOrderIds: [], invoiceIds: [], paymentIds: [], installationIds: [],
    products: [
      { productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 40, unitPrice: 7200, totalPrice: 288000, status: 'ordered' },
      { productId: 'PRD-002', productName: 'Casement Window Single', quantity: 20, unitPrice: 5100, totalPrice: 102000, status: 'ordered' },
      { productId: 'PRD-005', productName: 'Hinged Door Double', quantity: 10, unitPrice: 15200, totalPrice: 152000, status: 'pending' },
    ],
    projectManager: 'Dawit Hailu', projectManagerId: 'EMP-002',
    isOverdue: false, isAtRisk: false,
    timeline: [
      { date: '2025-01-10', event: 'Project created from quote QT-003', type: 'status_change', user: 'Sales' },
      { date: '2025-01-15', event: 'Deposit ETB 310,000 received', type: 'payment', user: 'Finance' },
      { date: '2025-01-25', event: 'Production started', type: 'milestone', user: 'Production' },
    ],
    createdAt: '2025-01-10', createdBy: 'EMP-002', updatedAt: '2025-02-15', updatedBy: 'EMP-002',
  },
  {
    id: 'PJ-010', projectNumber: 'PJ-010',
    name: 'Unity University Library', nameAm: 'ዩኒቲ ዩኒቨርሲቲ ቤተ መጻሕፍት',
    customerId: 'CUS-011', customerName: 'Unity University', customerContact: 'Dr. Mesfin Taye', customerPhone: '+251-921-234567',
    type: 'Commercial', status: 'Materials Ordered',
    value: 450000, deposit: 225000, depositPercentage: 50, balance: 225000,
    materialCost: 220000, laborCost: 65000, overheadCost: 25000, totalCost: 310000, profit: 140000, profitMargin: 31.1,
    orderDate: '2025-01-20', startDate: '2025-02-10', dueDate: '2025-05-30',
    progress: 20,
    milestones: { depositPaid: true, materialsOrdered: true, materialsReceived: false, productionStarted: false, productionCompleted: false, installationStarted: false, installationCompleted: false, finalPayment: false },
    workOrderIds: [], purchaseOrderIds: [], invoiceIds: [], paymentIds: [], installationIds: [],
    products: [
      { productId: 'PRD-007', productName: 'Curtain Wall System', quantity: 2, unitPrice: 55000, totalPrice: 110000, status: 'ordered' },
      { productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 30, unitPrice: 7200, totalPrice: 216000, status: 'pending' },
      { productId: 'PRD-010', productName: 'Office Partition System', quantity: 8, unitPrice: 11500, totalPrice: 92000, status: 'pending' },
    ],
    projectManager: 'Sara Mengistu', projectManagerId: 'EMP-003',
    isOverdue: false, isAtRisk: false,
    timeline: [
      { date: '2025-01-20', event: 'Project created', type: 'status_change', user: 'Sales' },
      { date: '2025-01-25', event: 'Deposit ETB 225,000 received', type: 'payment', user: 'Finance' },
      { date: '2025-02-10', event: 'Materials ordered', type: 'milestone', user: 'Procurement' },
    ],
    createdAt: '2025-01-20', createdBy: 'EMP-003', updatedAt: '2025-02-10', updatedBy: 'EMP-003',
  },
  {
    id: 'PJ-011', projectNumber: 'PJ-011',
    name: 'Abay Office Renovation', nameAm: 'አባይ ቢሮ ማደስ',
    customerId: 'CUS-010', customerName: 'Abay Construction', customerContact: 'Ato Girma Abay', customerPhone: '+251-920-123456',
    type: 'Commercial', status: 'On Hold',
    value: 280000, deposit: 84000, depositPercentage: 30, balance: 196000,
    materialCost: 130000, laborCost: 40000, overheadCost: 15000, totalCost: 185000, profit: 95000, profitMargin: 33.9,
    orderDate: '2025-01-05', startDate: '2025-01-20', dueDate: '2025-04-10',
    progress: 30,
    milestones: { depositPaid: true, materialsOrdered: true, materialsReceived: false, productionStarted: true, productionCompleted: false, installationStarted: false, installationCompleted: false, finalPayment: false },
    workOrderIds: [], purchaseOrderIds: [], invoiceIds: [], paymentIds: [], installationIds: [],
    products: [
      { productId: 'PRD-010', productName: 'Office Partition System', quantity: 12, unitPrice: 11500, totalPrice: 138000, status: 'ordered' },
      { productId: 'PRD-002', productName: 'Casement Window Single', quantity: 18, unitPrice: 5100, totalPrice: 91800, status: 'pending' },
    ],
    projectManager: 'Abebe Tekle', projectManagerId: 'EMP-001',
    isOverdue: false, isAtRisk: true,
    internalNotes: 'On hold due to customer payment delay',
    timeline: [
      { date: '2025-01-05', event: 'Project created', type: 'status_change', user: 'Sales' },
      { date: '2025-01-10', event: 'Deposit ETB 84,000 received', type: 'payment', user: 'Finance' },
      { date: '2025-02-15', event: 'Project put on hold - payment delay', type: 'status_change', user: 'PM' },
    ],
    createdAt: '2025-01-05', createdBy: 'EMP-001', updatedAt: '2025-02-15', updatedBy: 'EMP-001',
  },
];
