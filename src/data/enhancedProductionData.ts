// ══════════════════════════════════════════
// ENHANCED PRODUCTION DATA MODEL & SAMPLE DATA
// ══════════════════════════════════════════

export type ProductionStage =
  | 'Pending' | 'Cutting' | 'Machining' | 'Assembly' | 'Welding'
  | 'Glazing' | 'Quality Check' | 'Packaging' | 'Completed' | 'On Hold' | 'Cancelled';

export type WorkOrderPriority = 'Low' | 'Medium' | 'High' | 'Urgent' | 'Critical';
export type WorkOrderStatus = 'Draft' | 'Scheduled' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';

export interface WorkOrderMaterial {
  id: string;
  inventoryItemId: string;
  itemCode: string;
  itemName: string;
  itemCategory: string;
  quantityRequired: number;
  quantityConsumed: number;
  quantityRemaining: number;
  unit: string;
  estimatedUnitCost: number;
  actualUnitCost: number;
  estimatedTotalCost: number;
  actualTotalCost: number;
  isFromBOM: boolean;
  fullyConsumed: boolean;
  notes?: string;
}

export interface LaborEntry {
  id: string;
  workOrderId: string;
  workerId: string;
  workerName: string;
  workerRole?: string;
  date: string;
  hours: number;
  stage: ProductionStage;
  task: string;
  hourlyRate: number;
  totalCost: number;
  isOvertime: boolean;
  overtimeMultiplier: number;
  unitsProduced?: number;
  approved: boolean;
  approvedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface ProductionIssue {
  id: string;
  issueNumber: string;
  workOrderId: string;
  type: 'material_shortage' | 'machine_breakdown' | 'quality_problem' | 'staff_shortage' | 'design_issue' | 'other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description: string;
  reportedBy: string;
  reportedByName: string;
  reportedAt: string;
  estimatedDelay: number;
  costImpact: number;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}

export interface CuttingJobReference {
  cuttingJobId: string;
  cuttingJobNumber: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  materialUsed: number;
  wasteGenerated: number;
  createdAt: string;
  completedAt?: string;
}

export interface QualityCheckReference {
  checkId: string;
  checkNumber: string;
  stage: ProductionStage;
  result: 'pass' | 'fail' | 'conditional';
  checkedBy: string;
  checkedAt: string;
  defects?: string[];
  notes?: string;
}

export interface StageHistoryEntry {
  stage: ProductionStage;
  enteredAt: string;
  exitedAt?: string;
  duration?: number;
  completedBy?: string;
  notes?: string;
}

export interface EnhancedWorkOrder {
  id: string;
  workOrderNumber: string;

  // Links
  projectId: string;
  projectName: string;
  projectCode: string;
  customerId?: string;
  customerName?: string;
  quoteId?: string;
  quoteNumber?: string;

  // Product
  productId: string;
  productCode: string;
  productName: string;
  productNameAm?: string;
  productCategory: string;
  productType: 'Raw Material' | 'Fabricated' | 'System' | 'Custom';

  specifications: {
    width?: number;
    height?: number;
    thickness?: number;
    profile?: string;
    glass?: string;
    color?: string;
    alloyType?: string;
    temper?: string;
  };

  // Quantities
  quantity: number;
  completed: number;
  remaining: number;
  scrap: number;
  rework: number;
  goodUnits: number;

  // Dates
  createdAt: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;

  // Costs
  estimated: {
    hours: number;
    laborCost: number;
    materialCost: number;
    overheadCost: number;
    totalCost: number;
  };
  actual: {
    hours: number;
    laborCost: number;
    materialCost: number;
    overheadCost: number;
    totalCost: number;
  };

  // Variances
  variances: {
    hoursVariance: number;
    costVariance: number;
    efficiency: number;
    scheduleVariance: number;
  };

  // Status
  status: WorkOrderStatus;
  currentStage: ProductionStage;
  priority: WorkOrderPriority;
  progress: number;

  stageHistory: StageHistoryEntry[];

  // Team
  assignedTeam?: string;
  assignedWorkers: string[];
  supervisorId?: string;
  supervisorName?: string;

  // Linked data
  materials: WorkOrderMaterial[];
  cuttingJobs: CuttingJobReference[];
  qualityChecks: QualityCheckReference[];
  laborEntries: LaborEntry[];
  issues: ProductionIssue[];

  // Notes
  notes?: string;
  supervisorNotes?: string;

  // Flags
  isOverdue: boolean;
  isAtRisk: boolean;
  isBlocked: boolean;

  // Audit
  createdBy: string;
  createdByName: string;
  updatedBy: string;
  updatedByName: string;
  updatedAt: string;
}

// ═══ ENHANCED CUTTING JOB ═══
export interface EnhancedCuttingJob {
  id: string;
  jobNumber: string;

  // Links
  workOrderId?: string;
  workOrderNumber?: string;
  projectId?: string;
  projectName?: string;
  customerId?: string;
  customerName?: string;

  // Material (from Inventory)
  inventoryItemId?: string;
  materialCode: string;
  materialName: string;
  materialNameAm?: string;
  materialCategory: string;
  alloyType?: string;
  temper?: string;

  // Stock info
  stockLength: number;
  stocksUsed: number;

  // Cuts
  cuts: number[];
  totalCuts: number;
  totalCutLength: number;
  waste: number;
  wastePercent: number;

  // Optimization
  optimized: boolean;
  optimizationLayout?: number[][];
  efficiency: number;

  // Remnants
  remnants: { length: number; reusable: boolean; inventoryItemId?: string }[];

  // Operator
  assignee: string;
  assigneeName?: string;
  machine: string;

  // Dates
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;

  // Costs
  materialCost: number;
  wasteCost: number;
  laborCost: number;
  totalCost: number;

  // Status
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: WorkOrderPriority;

  // Quality
  qualityChecked: boolean;
  qualityResult?: 'pass' | 'fail' | 'conditional';
  qualityNotes?: string;

  notes?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

// ═══ STATS INTERFACES ═══
export interface ProductionStats {
  totalWorkOrders: number;
  activeWorkOrders: number;
  completedWorkOrders: number;
  onHoldWorkOrders: number;
  cancelledWorkOrders: number;
  byStage: Record<string, number>;
  byPriority: Record<string, number>;
  byStatus: Record<string, number>;
  averageProgress: number;
  averageEfficiency: number;
  onTimeRate: number;
  totalMaterialCost: number;
  totalLaborCost: number;
  totalEstimatedCost: number;
  totalActualCost: number;
  costVariance: number;
  scrapRate: number;
  reworkRate: number;
  overdueCount: number;
  atRiskCount: number;
  blockedCount: number;
  completedThisWeek: number;
  completedThisMonth: number;
  throughputPerDay: number;
}

export interface CuttingStats {
  totalJobs: number;
  pendingJobs: number;
  inProgressJobs: number;
  completedJobs: number;
  totalCuts: number;
  totalStockUsed: number;
  totalWaste: number;
  averageWastePercent: number;
  averageEfficiency: number;
  totalMaterialCost: number;
  totalWasteCost: number;
  remnantsCreated: number;
  reusableRemnants: number;
  byMachine: Record<string, number>;
}

// ═══ HELPERS ═══

const productionStages: ProductionStage[] = ['Pending', 'Cutting', 'Machining', 'Assembly', 'Welding', 'Glazing', 'Quality Check', 'Packaging', 'Completed'];

export function getProductionStages(): ProductionStage[] {
  return productionStages;
}

export function calculateProductionStats(workOrders: EnhancedWorkOrder[]): ProductionStats {
  const active = workOrders.filter(w => w.status === 'In Progress' || w.status === 'Scheduled');
  const completed = workOrders.filter(w => w.status === 'Completed');
  const overdue = workOrders.filter(w => w.isOverdue);
  const atRisk = workOrders.filter(w => w.isAtRisk && !w.isOverdue);
  const blocked = workOrders.filter(w => w.isBlocked);

  const byStage: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  workOrders.forEach(w => {
    byStage[w.currentStage] = (byStage[w.currentStage] || 0) + 1;
    byPriority[w.priority] = (byPriority[w.priority] || 0) + 1;
    byStatus[w.status] = (byStatus[w.status] || 0) + 1;
  });

  const totalEst = workOrders.reduce((s, w) => s + w.estimated.totalCost, 0);
  const totalAct = workOrders.reduce((s, w) => s + w.actual.totalCost, 0);
  const avgProgress = workOrders.length > 0 ? workOrders.reduce((s, w) => s + w.progress, 0) / workOrders.length : 0;
  const avgEfficiency = workOrders.filter(w => w.variances.efficiency > 0).length > 0
    ? workOrders.filter(w => w.variances.efficiency > 0).reduce((s, w) => s + w.variances.efficiency, 0) / workOrders.filter(w => w.variances.efficiency > 0).length
    : 0;

  const totalQty = workOrders.reduce((s, w) => s + w.quantity, 0);
  const totalScrap = workOrders.reduce((s, w) => s + w.scrap, 0);
  const totalRework = workOrders.reduce((s, w) => s + w.rework, 0);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    totalWorkOrders: workOrders.length,
    activeWorkOrders: active.length,
    completedWorkOrders: completed.length,
    onHoldWorkOrders: workOrders.filter(w => w.status === 'On Hold').length,
    cancelledWorkOrders: workOrders.filter(w => w.status === 'Cancelled').length,
    byStage,
    byPriority,
    byStatus,
    averageProgress: Math.round(avgProgress),
    averageEfficiency: Math.round(avgEfficiency),
    onTimeRate: completed.length > 0 ? Math.round((completed.filter(w => !w.isOverdue).length / completed.length) * 100) : 0,
    totalMaterialCost: workOrders.reduce((s, w) => s + w.actual.materialCost, 0),
    totalLaborCost: workOrders.reduce((s, w) => s + w.actual.laborCost, 0),
    totalEstimatedCost: totalEst,
    totalActualCost: totalAct,
    costVariance: totalEst - totalAct,
    scrapRate: totalQty > 0 ? Math.round((totalScrap / totalQty) * 100) : 0,
    reworkRate: totalQty > 0 ? Math.round((totalRework / totalQty) * 100) : 0,
    overdueCount: overdue.length,
    atRiskCount: atRisk.length,
    blockedCount: blocked.length,
    completedThisWeek: completed.filter(w => w.actualEnd && new Date(w.actualEnd) >= weekAgo).length,
    completedThisMonth: completed.filter(w => w.actualEnd && new Date(w.actualEnd) >= monthStart).length,
    throughputPerDay: completed.length > 0 ? Math.round((completed.reduce((s, w) => s + w.goodUnits, 0) / 30) * 10) / 10 : 0,
  };
}

export function calculateCuttingStats(jobs: EnhancedCuttingJob[]): CuttingStats {
  const completed = jobs.filter(j => j.status === 'Completed');
  const byMachine: Record<string, number> = {};
  jobs.forEach(j => { byMachine[j.machine] = (byMachine[j.machine] || 0) + 1; });

  const totalWaste = jobs.reduce((s, j) => s + j.waste, 0);
  const totalCutLen = jobs.reduce((s, j) => s + j.totalCutLength, 0);
  const totalStock = jobs.reduce((s, j) => s + j.stockLength * j.stocksUsed, 0);

  return {
    totalJobs: jobs.length,
    pendingJobs: jobs.filter(j => j.status === 'Pending').length,
    inProgressJobs: jobs.filter(j => j.status === 'In Progress').length,
    completedJobs: completed.length,
    totalCuts: jobs.reduce((s, j) => s + j.totalCuts, 0),
    totalStockUsed: totalStock,
    totalWaste: totalWaste,
    averageWastePercent: jobs.length > 0 ? Math.round((jobs.reduce((s, j) => s + j.wastePercent, 0) / jobs.length) * 10) / 10 : 0,
    averageEfficiency: jobs.length > 0 ? Math.round((jobs.reduce((s, j) => s + j.efficiency, 0) / jobs.length) * 10) / 10 : 0,
    totalMaterialCost: jobs.reduce((s, j) => s + j.materialCost, 0),
    totalWasteCost: jobs.reduce((s, j) => s + j.wasteCost, 0),
    remnantsCreated: jobs.reduce((s, j) => s + j.remnants.length, 0),
    reusableRemnants: jobs.reduce((s, j) => s + j.remnants.filter(r => r.reusable).length, 0),
    byMachine,
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

export const stageColors: Record<string, string> = {
  'Pending': 'bg-muted text-muted-foreground',
  'Cutting': 'bg-info/10 text-info',
  'Machining': 'bg-primary/10 text-primary',
  'Assembly': 'bg-warning/10 text-warning',
  'Welding': 'bg-destructive/10 text-destructive',
  'Glazing': 'bg-chart-4/10 text-chart-4',
  'Quality Check': 'bg-chart-3/10 text-chart-3',
  'Packaging': 'bg-success/10 text-success',
  'Completed': 'bg-success/10 text-success',
  'On Hold': 'bg-warning/10 text-warning',
  'Cancelled': 'bg-destructive/10 text-destructive',
};

export const priorityColors: Record<string, string> = {
  'Low': 'bg-muted text-muted-foreground',
  'Medium': 'bg-info/10 text-info',
  'High': 'bg-warning/10 text-warning',
  'Urgent': 'bg-destructive/10 text-destructive',
  'Critical': 'bg-destructive text-destructive-foreground',
};

export const statusColors: Record<string, string> = {
  'Draft': 'bg-muted text-muted-foreground',
  'Scheduled': 'bg-info/10 text-info',
  'In Progress': 'bg-primary/10 text-primary',
  'On Hold': 'bg-warning/10 text-warning',
  'Completed': 'bg-success/10 text-success',
  'Cancelled': 'bg-destructive/10 text-destructive',
};

export function getDaysUntilDue(dueDate: string): number {
  return Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function getDueDateColor(dueDate: string): string {
  const days = getDaysUntilDue(dueDate);
  if (days < 0) return 'text-destructive';
  if (days <= 3) return 'text-destructive';
  if (days <= 7) return 'text-warning';
  return 'text-muted-foreground';
}

export function getEfficiencyColor(efficiency: number): string {
  if (efficiency >= 90) return 'text-success';
  if (efficiency >= 70) return 'text-warning';
  return 'text-destructive';
}

export function getMarginColor(margin: number): string {
  if (margin >= 40) return 'text-success';
  if (margin >= 25) return 'text-warning';
  return 'text-destructive';
}

// ═══ SAMPLE WORK ORDERS - Linked to Projects, Products, Customers, Inventory ═══
export const enhancedSampleWorkOrders: EnhancedWorkOrder[] = [
  {
    id: 'WO-001', workOrderNumber: 'WO-2025-001',
    projectId: 'PJ-001', projectName: 'Bole Apartments Tower A', projectCode: 'PJ-001',
    customerId: 'CUS-001', customerName: 'Ayat Real Estate',
    quoteId: 'QT-002', quoteNumber: 'QT-002',
    productId: 'PRD-001', productCode: 'SW-6063-S1',
    productName: 'Sliding Window 2-Panel', productNameAm: 'ተንሸራታች መስኮት 2-ፓነል',
    productCategory: 'Windows', productType: 'Fabricated',
    specifications: { width: 1200, height: 1500, profile: '6063-T5', glass: '6mm Clear Tempered', color: 'White', alloyType: '6063', temper: 'T5' },
    quantity: 48, completed: 22, remaining: 26, scrap: 2, rework: 1, goodUnits: 19,
    createdAt: '2025-02-01', scheduledStart: '2025-02-10', scheduledEnd: '2025-03-15',
    actualStart: '2025-02-10',
    estimated: { hours: 168, laborCost: 23520, materialCost: 216000, overheadCost: 12000, totalCost: 251520 },
    actual: { hours: 112, laborCost: 15680, materialCost: 148000, overheadCost: 8000, totalCost: 171680 },
    variances: { hoursVariance: -56, costVariance: 79840, efficiency: 93, scheduleVariance: 0 },
    status: 'In Progress', currentStage: 'Assembly', priority: 'High', progress: 46,
    stageHistory: [
      { stage: 'Cutting', enteredAt: '2025-02-10', exitedAt: '2025-02-14', duration: 32, completedBy: 'Yosef B.', notes: 'All frames cut' },
      { stage: 'Machining', enteredAt: '2025-02-14', exitedAt: '2025-02-18', duration: 24, completedBy: 'Abebe T.' },
      { stage: 'Assembly', enteredAt: '2025-02-18', notes: 'In progress' },
    ],
    assignedTeam: 'Team Alpha', assignedWorkers: ['EMP-003', 'EMP-005'], supervisorId: 'EMP-001', supervisorName: 'Abebe Tekle',
    materials: [
      { id: 'MAT-001', inventoryItemId: 'INV-013', itemCode: 'PF-6063-01', itemName: 'Window Frame Profile 6063', itemCategory: 'Profile', quantityRequired: 297.6, quantityConsumed: 176, quantityRemaining: 121.6, unit: 'meter', estimatedUnitCost: 85, actualUnitCost: 85, estimatedTotalCost: 25296, actualTotalCost: 14960, isFromBOM: true, fullyConsumed: false },
      { id: 'MAT-002', inventoryItemId: 'INV-015', itemCode: 'GL-CLR-06', itemName: '6mm Clear Tempered Glass', itemCategory: 'Glass', quantityRequired: 86.4, quantityConsumed: 39.6, quantityRemaining: 46.8, unit: 'sqm', estimatedUnitCost: 450, actualUnitCost: 450, estimatedTotalCost: 38880, actualTotalCost: 17820, isFromBOM: true, fullyConsumed: false },
      { id: 'MAT-003', inventoryItemId: 'INV-017', itemCode: 'HW-HDL-01', itemName: 'Aluminum Handle Set', itemCategory: 'Hardware', quantityRequired: 96, quantityConsumed: 44, quantityRemaining: 52, unit: 'set', estimatedUnitCost: 280, actualUnitCost: 280, estimatedTotalCost: 26880, actualTotalCost: 12320, isFromBOM: true, fullyConsumed: false },
    ],
    cuttingJobs: [
      { cuttingJobId: 'CJ-001', cuttingJobNumber: 'CJ-2025-001', status: 'completed', materialUsed: 5800, wasteGenerated: 200, createdAt: '2025-02-10', completedAt: '2025-02-12' },
      { cuttingJobId: 'CJ-002', cuttingJobNumber: 'CJ-2025-002', status: 'completed', materialUsed: 4200, wasteGenerated: 0, createdAt: '2025-02-12', completedAt: '2025-02-13' },
    ],
    qualityChecks: [
      { checkId: 'QC-001', checkNumber: 'QC-2025-001', stage: 'Cutting', result: 'pass', checkedBy: 'Marta T.', checkedAt: '2025-02-14' },
      { checkId: 'QC-002', checkNumber: 'QC-2025-002', stage: 'Machining', result: 'conditional', checkedBy: 'Marta T.', checkedAt: '2025-02-18', defects: ['Minor scratch on 1 frame'], notes: 'Rework completed' },
    ],
    laborEntries: [
      { id: 'LE-001', workOrderId: 'WO-001', workerId: 'EMP-003', workerName: 'Sara Mengistu', workerRole: 'Fabricator', date: '2025-02-10', hours: 8, stage: 'Cutting', task: 'Frame cutting', hourlyRate: 138, totalCost: 1104, isOvertime: false, overtimeMultiplier: 1, approved: true, createdAt: '2025-02-10' },
      { id: 'LE-002', workOrderId: 'WO-001', workerId: 'EMP-005', workerName: 'Dawit Hailu', workerRole: 'Fabricator', date: '2025-02-10', hours: 8, stage: 'Cutting', task: 'Frame cutting', hourlyRate: 125, totalCost: 1000, isOvertime: false, overtimeMultiplier: 1, approved: true, createdAt: '2025-02-10' },
    ],
    issues: [],
    isOverdue: false, isAtRisk: false, isBlocked: false,
    createdBy: 'EMP-001', createdByName: 'Abebe Tekle', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle', updatedAt: '2025-03-06',
  },
  {
    id: 'WO-002', workOrderNumber: 'WO-2025-002',
    projectId: 'PJ-001', projectName: 'Bole Apartments Tower A', projectCode: 'PJ-001',
    customerId: 'CUS-001', customerName: 'Ayat Real Estate',
    productId: 'PRD-004', productCode: 'SD-6063-D1',
    productName: 'Sliding Door 3-Panel', productNameAm: 'ተንሸራታች በር 3-ፓነል',
    productCategory: 'Doors', productType: 'Fabricated',
    specifications: { profile: '6063-T6', glass: '10mm Clear Tempered', color: 'White', alloyType: '6063', temper: 'T6' },
    quantity: 12, completed: 5, remaining: 7, scrap: 0, rework: 0, goodUnits: 5,
    createdAt: '2025-02-05', scheduledStart: '2025-02-12', scheduledEnd: '2025-03-20',
    actualStart: '2025-02-12',
    estimated: { hours: 72, laborCost: 10080, materialCost: 144000, overheadCost: 5000, totalCost: 159080 },
    actual: { hours: 38, laborCost: 5320, materialCost: 68000, overheadCost: 2500, totalCost: 75820 },
    variances: { hoursVariance: -34, costVariance: 83260, efficiency: 89, scheduleVariance: 0 },
    status: 'In Progress', currentStage: 'Welding', priority: 'High', progress: 42,
    stageHistory: [
      { stage: 'Cutting', enteredAt: '2025-02-12', exitedAt: '2025-02-15', duration: 18, completedBy: 'Team Beta' },
      { stage: 'Welding', enteredAt: '2025-02-15' },
    ],
    assignedTeam: 'Team Beta', assignedWorkers: ['EMP-004', 'EMP-006'], supervisorId: 'EMP-002', supervisorName: 'Dawit Hailu',
    materials: [], cuttingJobs: [], qualityChecks: [], laborEntries: [], issues: [],
    isOverdue: false, isAtRisk: false, isBlocked: false,
    createdBy: 'EMP-001', createdByName: 'Abebe Tekle', updatedBy: 'EMP-002', updatedByName: 'Dawit Hailu', updatedAt: '2025-03-01',
  },
  {
    id: 'WO-003', workOrderNumber: 'WO-2025-003',
    projectId: 'PJ-002', projectName: 'Villa Sunshine Residence', projectCode: 'PJ-002',
    customerId: 'CUS-002', customerName: 'Ato Kebede Alemu',
    quoteId: 'QT-004', quoteNumber: 'QT-004',
    productId: 'PRD-002', productCode: 'CW-6063-S2',
    productName: 'Casement Window Single', productNameAm: 'ካዝመንት መስኮት ነጠላ',
    productCategory: 'Windows', productType: 'Fabricated',
    specifications: { profile: '6063-T5', glass: '5mm Clear Float', color: 'White', alloyType: '6063', temper: 'T5' },
    quantity: 16, completed: 0, remaining: 16, scrap: 0, rework: 0, goodUnits: 0,
    createdAt: '2025-02-20', scheduledStart: '2025-02-25', scheduledEnd: '2025-04-01',
    estimated: { hours: 40, laborCost: 5600, materialCost: 51200, overheadCost: 3000, totalCost: 59800 },
    actual: { hours: 4, laborCost: 560, materialCost: 3200, overheadCost: 200, totalCost: 3960 },
    variances: { hoursVariance: -36, costVariance: 55840, efficiency: 0, scheduleVariance: 0 },
    status: 'In Progress', currentStage: 'Cutting', priority: 'Medium', progress: 5,
    stageHistory: [{ stage: 'Cutting', enteredAt: '2025-02-25', notes: 'Started cutting' }],
    assignedTeam: 'Team Alpha', assignedWorkers: ['EMP-003'], supervisorId: 'EMP-002', supervisorName: 'Dawit Hailu',
    materials: [], cuttingJobs: [], qualityChecks: [], laborEntries: [], issues: [],
    isOverdue: false, isAtRisk: false, isBlocked: false,
    createdBy: 'EMP-002', createdByName: 'Dawit Hailu', updatedBy: 'EMP-002', updatedByName: 'Dawit Hailu', updatedAt: '2025-02-25',
  },
  {
    id: 'WO-004', workOrderNumber: 'WO-2025-004',
    projectId: 'PJ-003', projectName: 'Megenagna Office Complex', projectCode: 'PJ-003',
    customerId: 'CUS-003', customerName: 'Ethio Engineering',
    productId: 'PRD-007', productCode: 'CW-6060-C1',
    productName: 'Curtain Wall System', productNameAm: 'ከርተን ወል ሲስተም',
    productCategory: 'Curtain Walls', productType: 'System',
    specifications: { profile: '6060-T5', glass: '12mm DGU', alloyType: '6060', temper: 'T5' },
    quantity: 1, completed: 0, remaining: 1, scrap: 0, rework: 0, goodUnits: 0,
    createdAt: '2025-01-10', scheduledStart: '2025-01-15', scheduledEnd: '2025-03-01',
    actualStart: '2025-01-15',
    estimated: { hours: 96, laborCost: 13440, materialCost: 35000, overheadCost: 5000, totalCost: 53440 },
    actual: { hours: 72, laborCost: 10080, materialCost: 32000, overheadCost: 4000, totalCost: 46080 },
    variances: { hoursVariance: -24, costVariance: 7360, efficiency: 88, scheduleVariance: 6 },
    status: 'In Progress', currentStage: 'Glazing', priority: 'High', progress: 75,
    stageHistory: [
      { stage: 'Cutting', enteredAt: '2025-01-15', exitedAt: '2025-01-22', duration: 40, completedBy: 'Team Gamma' },
      { stage: 'Assembly', enteredAt: '2025-01-22', exitedAt: '2025-02-05', duration: 80, completedBy: 'Team Gamma' },
      { stage: 'Glazing', enteredAt: '2025-02-05' },
    ],
    assignedTeam: 'Team Gamma', assignedWorkers: ['EMP-004', 'EMP-006', 'EMP-003'], supervisorId: 'EMP-001', supervisorName: 'Abebe Tekle',
    materials: [], cuttingJobs: [], qualityChecks: [], laborEntries: [], issues: [],
    isOverdue: true, isAtRisk: true, isBlocked: false,
    notes: 'Complex installation - requires specialized glazing team',
    createdBy: 'EMP-001', createdByName: 'Abebe Tekle', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle', updatedAt: '2025-03-01',
  },
  {
    id: 'WO-005', workOrderNumber: 'WO-2025-005',
    projectId: 'PJ-005', projectName: 'CMC Residential Block', projectCode: 'PJ-005',
    customerId: 'CUS-005', customerName: 'Noah Construction',
    productId: 'PRD-001', productCode: 'SW-6063-S1',
    productName: 'Sliding Window 2-Panel', productNameAm: 'ተንሸራታች መስኮት 2-ፓነል',
    productCategory: 'Windows', productType: 'Fabricated',
    specifications: { width: 1200, height: 1500, profile: '6063-T5', glass: '6mm Clear Tempered', color: 'White' },
    quantity: 32, completed: 30, remaining: 2, scrap: 1, rework: 0, goodUnits: 29,
    createdAt: '2025-01-15', scheduledStart: '2025-01-20', scheduledEnd: '2025-02-28',
    actualStart: '2025-01-20',
    estimated: { hours: 112, laborCost: 15680, materialCost: 144000, overheadCost: 7000, totalCost: 166680 },
    actual: { hours: 105, laborCost: 14700, materialCost: 140000, overheadCost: 6500, totalCost: 161200 },
    variances: { hoursVariance: -7, costVariance: 5480, efficiency: 94, scheduleVariance: -2 },
    status: 'In Progress', currentStage: 'Quality Check', priority: 'Medium', progress: 94,
    stageHistory: [
      { stage: 'Cutting', enteredAt: '2025-01-20', exitedAt: '2025-01-25', duration: 32, completedBy: 'Team Beta' },
      { stage: 'Machining', enteredAt: '2025-01-25', exitedAt: '2025-01-30', duration: 28, completedBy: 'Team Beta' },
      { stage: 'Assembly', enteredAt: '2025-01-30', exitedAt: '2025-02-10', duration: 56, completedBy: 'Team Beta' },
      { stage: 'Quality Check', enteredAt: '2025-02-10' },
    ],
    assignedTeam: 'Team Beta', assignedWorkers: ['EMP-005'], supervisorId: 'EMP-002', supervisorName: 'Dawit Hailu',
    materials: [], cuttingJobs: [], qualityChecks: [], laborEntries: [], issues: [],
    isOverdue: true, isAtRisk: false, isBlocked: false,
    createdBy: 'EMP-002', createdByName: 'Dawit Hailu', updatedBy: 'EMP-002', updatedByName: 'Dawit Hailu', updatedAt: '2025-02-28',
  },
  {
    id: 'WO-006', workOrderNumber: 'WO-2025-006',
    projectId: 'PJ-005', projectName: 'CMC Residential Block', projectCode: 'PJ-005',
    customerId: 'CUS-005', customerName: 'Noah Construction',
    productId: 'PRD-005', productCode: 'HD-6063-D2',
    productName: 'Hinged Door Double', productNameAm: 'የሚከፈት በር ድርብ',
    productCategory: 'Doors', productType: 'Fabricated',
    specifications: { profile: '6063-T6', glass: '8mm Frosted Tempered', color: 'Bronze' },
    quantity: 8, completed: 8, remaining: 0, scrap: 0, rework: 0, goodUnits: 8,
    createdAt: '2025-01-18', scheduledStart: '2025-02-01', scheduledEnd: '2025-02-28',
    actualStart: '2025-02-01', actualEnd: '2025-02-25',
    estimated: { hours: 40, laborCost: 5600, materialCost: 76000, overheadCost: 3000, totalCost: 84600 },
    actual: { hours: 38, laborCost: 5320, materialCost: 74000, overheadCost: 2800, totalCost: 82120 },
    variances: { hoursVariance: -2, costVariance: 2480, efficiency: 97, scheduleVariance: -3 },
    status: 'Completed', currentStage: 'Completed', priority: 'Low', progress: 100,
    stageHistory: [
      { stage: 'Cutting', enteredAt: '2025-02-01', exitedAt: '2025-02-05', duration: 16, completedBy: 'Team Alpha' },
      { stage: 'Assembly', enteredAt: '2025-02-05', exitedAt: '2025-02-15', duration: 40, completedBy: 'Team Alpha' },
      { stage: 'Quality Check', enteredAt: '2025-02-15', exitedAt: '2025-02-18', duration: 8, completedBy: 'QC Team' },
      { stage: 'Packaging', enteredAt: '2025-02-18', exitedAt: '2025-02-25', duration: 4, completedBy: 'Team Alpha' },
      { stage: 'Completed', enteredAt: '2025-02-25' },
    ],
    assignedTeam: 'Team Alpha', assignedWorkers: ['EMP-003', 'EMP-005'], supervisorId: 'EMP-001', supervisorName: 'Abebe Tekle',
    materials: [], cuttingJobs: [], qualityChecks: [
      { checkId: 'QC-003', checkNumber: 'QC-2025-003', stage: 'Quality Check', result: 'pass', checkedBy: 'Marta T.', checkedAt: '2025-02-18' },
    ], laborEntries: [], issues: [],
    isOverdue: false, isAtRisk: false, isBlocked: false,
    createdBy: 'EMP-001', createdByName: 'Abebe Tekle', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle', updatedAt: '2025-02-25',
  },
  {
    id: 'WO-007', workOrderNumber: 'WO-2025-007',
    projectId: 'PJ-003', projectName: 'Megenagna Office Complex', projectCode: 'PJ-003',
    customerId: 'CUS-003', customerName: 'Ethio Engineering',
    productId: 'PRD-008', productCode: 'HR-6063-H1',
    productName: 'Glass Handrail System', productNameAm: 'የመስታወት ዘንግ ስርዓት',
    productCategory: 'Handrails', productType: 'Fabricated',
    specifications: { profile: '6063-T6', glass: '12mm Clear Tempered', color: 'Silver' },
    quantity: 6, completed: 4, remaining: 2, scrap: 0, rework: 1, goodUnits: 3,
    createdAt: '2025-02-01', scheduledStart: '2025-02-05', scheduledEnd: '2025-03-10',
    actualStart: '2025-02-05',
    estimated: { hours: 24, laborCost: 3360, materialCost: 51000, overheadCost: 2000, totalCost: 56360 },
    actual: { hours: 20, laborCost: 2800, materialCost: 38000, overheadCost: 1500, totalCost: 42300 },
    variances: { hoursVariance: -4, costVariance: 14060, efficiency: 90, scheduleVariance: 0 },
    status: 'In Progress', currentStage: 'Assembly', priority: 'High', progress: 67,
    stageHistory: [
      { stage: 'Cutting', enteredAt: '2025-02-05', exitedAt: '2025-02-08', duration: 12, completedBy: 'Team Gamma' },
      { stage: 'Assembly', enteredAt: '2025-02-08' },
    ],
    assignedTeam: 'Team Gamma', assignedWorkers: ['EMP-004', 'EMP-006'], supervisorId: 'EMP-001', supervisorName: 'Abebe Tekle',
    materials: [], cuttingJobs: [], qualityChecks: [], laborEntries: [], issues: [
      { id: 'ISS-001', issueNumber: 'ISS-2025-001', workOrderId: 'WO-007', type: 'quality_problem', severity: 'Medium', title: 'Minor scratch on frame', description: 'Scratch found during assembly inspection', reportedBy: 'EMP-004', reportedByName: 'Yosef Berhane', reportedAt: '2025-02-20', estimatedDelay: 4, costImpact: 500, resolved: true, resolvedAt: '2025-02-22', resolvedBy: 'EMP-003', resolution: 'Frame buffed and refinished' },
    ],
    isOverdue: false, isAtRisk: false, isBlocked: false,
    createdBy: 'EMP-001', createdByName: 'Abebe Tekle', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle', updatedAt: '2025-03-01',
  },
  {
    id: 'WO-008', workOrderNumber: 'WO-2025-008',
    projectId: 'PJ-001', projectName: 'Bole Apartments Tower A', projectCode: 'PJ-001',
    customerId: 'CUS-001', customerName: 'Ayat Real Estate',
    productId: 'PRD-003', productCode: 'FW-6063-S3',
    productName: 'Fixed Window Large', productNameAm: 'ቋሚ መስኮት ትልቅ',
    productCategory: 'Windows', productType: 'Fabricated',
    specifications: { profile: '6063-T5', glass: '8mm Tinted Tempered', color: 'Bronze' },
    quantity: 24, completed: 10, remaining: 14, scrap: 0, rework: 0, goodUnits: 10,
    createdAt: '2025-02-10', scheduledStart: '2025-02-15', scheduledEnd: '2025-03-25',
    actualStart: '2025-02-15',
    estimated: { hours: 48, laborCost: 6720, materialCost: 91200, overheadCost: 4000, totalCost: 101920 },
    actual: { hours: 24, laborCost: 3360, materialCost: 45000, overheadCost: 2000, totalCost: 50360 },
    variances: { hoursVariance: -24, costVariance: 51560, efficiency: 92, scheduleVariance: 0 },
    status: 'In Progress', currentStage: 'Machining', priority: 'Medium', progress: 42,
    stageHistory: [
      { stage: 'Cutting', enteredAt: '2025-02-15', exitedAt: '2025-02-20', duration: 24, completedBy: 'Team Beta' },
      { stage: 'Machining', enteredAt: '2025-02-20' },
    ],
    assignedTeam: 'Team Beta', assignedWorkers: ['EMP-004'], supervisorId: 'EMP-002', supervisorName: 'Dawit Hailu',
    materials: [], cuttingJobs: [], qualityChecks: [], laborEntries: [], issues: [],
    isOverdue: false, isAtRisk: false, isBlocked: false,
    createdBy: 'EMP-002', createdByName: 'Dawit Hailu', updatedBy: 'EMP-002', updatedByName: 'Dawit Hailu', updatedAt: '2025-03-01',
  },
  {
    id: 'WO-009', workOrderNumber: 'WO-2025-009',
    projectId: 'PJ-006', projectName: 'Kazanchis Bank Branch', projectCode: 'PJ-006',
    customerId: 'CUS-006', customerName: 'Commercial Bank Ethiopia',
    productId: 'PRD-010', productCode: 'PT-6063-P1',
    productName: 'Office Partition System', productNameAm: 'የቢሮ ክፋፍል ስርዓት',
    productCategory: 'Partitions', productType: 'Custom',
    specifications: { profile: '6063-T5', glass: '10mm Clear Tempered', color: 'Silver' },
    quantity: 20, completed: 0, remaining: 20, scrap: 0, rework: 0, goodUnits: 0,
    createdAt: '2025-02-20', scheduledStart: '2025-03-01', scheduledEnd: '2025-04-15',
    estimated: { hours: 100, laborCost: 14000, materialCost: 144000, overheadCost: 6000, totalCost: 164000 },
    actual: { hours: 0, laborCost: 0, materialCost: 0, overheadCost: 0, totalCost: 0 },
    variances: { hoursVariance: -100, costVariance: 164000, efficiency: 0, scheduleVariance: 0 },
    status: 'Scheduled', currentStage: 'Pending', priority: 'Medium', progress: 0,
    stageHistory: [],
    assignedTeam: 'Team Alpha', assignedWorkers: ['EMP-003'], supervisorId: 'EMP-001', supervisorName: 'Abebe Tekle',
    materials: [], cuttingJobs: [], qualityChecks: [], laborEntries: [], issues: [],
    isOverdue: false, isAtRisk: false, isBlocked: false,
    createdBy: 'EMP-001', createdByName: 'Abebe Tekle', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle', updatedAt: '2025-02-20',
  },
  {
    id: 'WO-010', workOrderNumber: 'WO-2025-010',
    projectId: 'PJ-002', projectName: 'Villa Sunshine Residence', projectCode: 'PJ-002',
    customerId: 'CUS-002', customerName: 'Ato Kebede Alemu',
    productId: 'PRD-009', productCode: 'LV-6063-L1',
    productName: 'Aluminum Louver Window', productNameAm: 'አልሚኒየም ላውቨር መስኮት',
    productCategory: 'Louvers', productType: 'Fabricated',
    specifications: { profile: '6063-T5', glass: '5mm Frosted', color: 'White' },
    quantity: 6, completed: 0, remaining: 6, scrap: 0, rework: 0, goodUnits: 0,
    createdAt: '2025-03-01', scheduledStart: '2025-03-05', scheduledEnd: '2025-04-10',
    estimated: { hours: 18, laborCost: 2520, materialCost: 21000, overheadCost: 1000, totalCost: 24520 },
    actual: { hours: 0, laborCost: 0, materialCost: 0, overheadCost: 0, totalCost: 0 },
    variances: { hoursVariance: -18, costVariance: 24520, efficiency: 0, scheduleVariance: 0 },
    status: 'Scheduled', currentStage: 'Pending', priority: 'Low', progress: 0,
    stageHistory: [],
    assignedTeam: 'Team Beta', assignedWorkers: ['EMP-005'], supervisorId: 'EMP-002', supervisorName: 'Dawit Hailu',
    materials: [], cuttingJobs: [], qualityChecks: [], laborEntries: [], issues: [],
    isOverdue: false, isAtRisk: false, isBlocked: false,
    createdBy: 'EMP-002', createdByName: 'Dawit Hailu', updatedBy: 'EMP-002', updatedByName: 'Dawit Hailu', updatedAt: '2025-03-01',
  },
  {
    id: 'WO-011', workOrderNumber: 'WO-2025-011',
    projectId: 'PJ-009', projectName: 'Addis Builders Residential G+5', projectCode: 'PJ-009',
    customerId: 'CUS-008', customerName: 'Addis Builders PLC',
    quoteId: 'QT-003', quoteNumber: 'QT-003',
    productId: 'PRD-001', productCode: 'SW-6063-S1',
    productName: 'Sliding Window 2-Panel', productNameAm: 'ተንሸራታች መስኮት 2-ፓነል',
    productCategory: 'Windows', productType: 'Fabricated',
    specifications: { width: 1200, height: 1500, profile: '6063-T5', glass: '6mm Clear Tempered', color: 'White' },
    quantity: 40, completed: 20, remaining: 20, scrap: 1, rework: 2, goodUnits: 17,
    createdAt: '2025-01-25', scheduledStart: '2025-01-28', scheduledEnd: '2025-03-15',
    actualStart: '2025-01-28',
    estimated: { hours: 140, laborCost: 19600, materialCost: 180000, overheadCost: 8000, totalCost: 207600 },
    actual: { hours: 82, laborCost: 11480, materialCost: 100000, overheadCost: 4500, totalCost: 115980 },
    variances: { hoursVariance: -58, costVariance: 91620, efficiency: 85, scheduleVariance: 2 },
    status: 'In Progress', currentStage: 'Assembly', priority: 'High', progress: 50,
    stageHistory: [
      { stage: 'Cutting', enteredAt: '2025-01-28', exitedAt: '2025-02-05', duration: 48, completedBy: 'Team Alpha' },
      { stage: 'Assembly', enteredAt: '2025-02-05' },
    ],
    assignedTeam: 'Team Alpha', assignedWorkers: ['EMP-003', 'EMP-005'], supervisorId: 'EMP-002', supervisorName: 'Dawit Hailu',
    materials: [], cuttingJobs: [], qualityChecks: [], laborEntries: [], issues: [
      { id: 'ISS-002', issueNumber: 'ISS-2025-002', workOrderId: 'WO-011', type: 'material_shortage', severity: 'High', title: 'Glass shortage for remaining units', description: 'Not enough 6mm tempered glass for remaining 20 units', reportedBy: 'EMP-003', reportedByName: 'Sara Mengistu', reportedAt: '2025-03-01', estimatedDelay: 5, costImpact: 2000, resolved: false },
    ],
    isOverdue: false, isAtRisk: true, isBlocked: true,
    notes: 'Blocked due to glass shortage - waiting on PO delivery',
    createdBy: 'EMP-002', createdByName: 'Dawit Hailu', updatedBy: 'EMP-003', updatedByName: 'Sara Mengistu', updatedAt: '2025-03-01',
  },
  {
    id: 'WO-012', workOrderNumber: 'WO-2025-012',
    projectId: 'PJ-010', projectName: 'Unity University Library', projectCode: 'PJ-010',
    customerId: 'CUS-011', customerName: 'Unity University',
    productId: 'PRD-007', productCode: 'CW-6060-C1',
    productName: 'Curtain Wall System', productNameAm: 'ከርተን ወል ሲስተም',
    productCategory: 'Curtain Walls', productType: 'System',
    specifications: { profile: '6060-T5', glass: '12mm DGU', alloyType: '6060', temper: 'T5' },
    quantity: 2, completed: 0, remaining: 2, scrap: 0, rework: 0, goodUnits: 0,
    createdAt: '2025-02-15', scheduledStart: '2025-03-10', scheduledEnd: '2025-05-15',
    estimated: { hours: 192, laborCost: 26880, materialCost: 70000, overheadCost: 10000, totalCost: 106880 },
    actual: { hours: 0, laborCost: 0, materialCost: 0, overheadCost: 0, totalCost: 0 },
    variances: { hoursVariance: -192, costVariance: 106880, efficiency: 0, scheduleVariance: 0 },
    status: 'Draft', currentStage: 'Pending', priority: 'Medium', progress: 0,
    stageHistory: [],
    assignedTeam: 'Team Gamma', assignedWorkers: [], supervisorId: 'EMP-001', supervisorName: 'Abebe Tekle',
    materials: [], cuttingJobs: [], qualityChecks: [], laborEntries: [], issues: [],
    isOverdue: false, isAtRisk: false, isBlocked: false,
    createdBy: 'EMP-003', createdByName: 'Sara Mengistu', updatedBy: 'EMP-003', updatedByName: 'Sara Mengistu', updatedAt: '2025-02-15',
  },
];

// ═══ SAMPLE CUTTING JOBS - Linked to Work Orders, Projects, Inventory ═══
export const enhancedSampleCuttingJobs: EnhancedCuttingJob[] = [
  {
    id: 'CJ-001', jobNumber: 'CJ-2025-001',
    workOrderId: 'WO-001', workOrderNumber: 'WO-2025-001',
    projectId: 'PJ-001', projectName: 'Bole Apartments Tower A',
    customerId: 'CUS-001', customerName: 'Ayat Real Estate',
    inventoryItemId: 'INV-013', materialCode: 'PF-6063-01',
    materialName: 'Window Frame Profile 6063', materialNameAm: 'የመስኮት ፍሬም ፕሮፋይል 6063',
    materialCategory: 'Profile', alloyType: '6063', temper: 'T5',
    stockLength: 6000, stocksUsed: 1,
    cuts: [1200, 1200, 1500, 1500], totalCuts: 4, totalCutLength: 5400, waste: 600, wastePercent: 10,
    optimized: true, efficiency: 90,
    remnants: [{ length: 600, reusable: true }],
    assignee: 'Yosef B.', machine: 'Double Head Cutting Saw',
    scheduledDate: '2025-02-10', startTime: '2025-02-10T08:00:00', endTime: '2025-02-10T10:30:00', duration: 2.5,
    materialCost: 510, wasteCost: 51, laborCost: 345, totalCost: 906,
    status: 'Completed', priority: 'High',
    qualityChecked: true, qualityResult: 'pass',
    createdAt: '2025-02-10', createdBy: 'EMP-003', updatedAt: '2025-02-10',
  },
  {
    id: 'CJ-002', jobNumber: 'CJ-2025-002',
    workOrderId: 'WO-001', workOrderNumber: 'WO-2025-001',
    projectId: 'PJ-001', projectName: 'Bole Apartments Tower A',
    inventoryItemId: 'INV-013', materialCode: 'PF-6063-01',
    materialName: 'Window Frame Profile 6063', materialCategory: 'Profile',
    stockLength: 6000, stocksUsed: 1,
    cuts: [1200, 1200, 1200, 1200, 1200], totalCuts: 5, totalCutLength: 6000, waste: 0, wastePercent: 0,
    optimized: true, efficiency: 100,
    remnants: [],
    assignee: 'Yosef B.', machine: 'Double Head Cutting Saw',
    scheduledDate: '2025-02-12', startTime: '2025-02-12T08:00:00', endTime: '2025-02-12T09:30:00', duration: 1.5,
    materialCost: 510, wasteCost: 0, laborCost: 207, totalCost: 717,
    status: 'Completed', priority: 'High',
    qualityChecked: true, qualityResult: 'pass',
    createdAt: '2025-02-12', createdBy: 'EMP-003', updatedAt: '2025-02-12',
  },
  {
    id: 'CJ-003', jobNumber: 'CJ-2025-003',
    workOrderId: 'WO-005', workOrderNumber: 'WO-2025-005',
    projectId: 'PJ-005', projectName: 'CMC Residential Block',
    customerId: 'CUS-005', customerName: 'Noah Construction',
    inventoryItemId: 'INV-013', materialCode: 'PF-6063-01',
    materialName: 'Window Frame Profile 6063', materialCategory: 'Profile',
    stockLength: 6000, stocksUsed: 3,
    cuts: [1200, 1200, 1500, 1200, 1500, 1200, 1500, 1200, 1200, 1200, 1500, 1200, 1500, 1200], totalCuts: 14, totalCutLength: 18300, waste: 300, wastePercent: 1.7,
    optimized: true, efficiency: 98.3,
    remnants: [{ length: 300, reusable: false }],
    assignee: 'Abebe T.', machine: 'CNC Router',
    scheduledDate: '2025-01-20', startTime: '2025-01-20T08:00:00', endTime: '2025-01-20T14:00:00', duration: 6,
    materialCost: 1530, wasteCost: 25.5, laborCost: 828, totalCost: 2383.5,
    status: 'Completed', priority: 'Medium',
    qualityChecked: true, qualityResult: 'pass',
    createdAt: '2025-01-20', createdBy: 'EMP-005', updatedAt: '2025-01-20',
  },
  {
    id: 'CJ-004', jobNumber: 'CJ-2025-004',
    workOrderId: 'WO-003', workOrderNumber: 'WO-2025-003',
    projectId: 'PJ-002', projectName: 'Villa Sunshine Residence',
    customerId: 'CUS-002', customerName: 'Ato Kebede Alemu',
    inventoryItemId: 'INV-013', materialCode: 'PF-6063-01',
    materialName: 'Window Frame Profile 6063', materialCategory: 'Profile',
    stockLength: 6000, stocksUsed: 1,
    cuts: [800, 800, 1000, 1000, 800, 800], totalCuts: 6, totalCutLength: 5200, waste: 800, wastePercent: 13.3,
    optimized: false, efficiency: 86.7,
    remnants: [{ length: 800, reusable: true }],
    assignee: 'Yosef B.', machine: 'Manual Mitre Saw',
    scheduledDate: '2025-02-25',
    materialCost: 510, wasteCost: 68, laborCost: 345, totalCost: 923,
    status: 'In Progress', priority: 'Medium',
    qualityChecked: false,
    createdAt: '2025-02-25', createdBy: 'EMP-003', updatedAt: '2025-02-25',
  },
  {
    id: 'CJ-005', jobNumber: 'CJ-2025-005',
    workOrderId: 'WO-004', workOrderNumber: 'WO-2025-004',
    projectId: 'PJ-003', projectName: 'Megenagna Office Complex',
    customerId: 'CUS-003', customerName: 'Ethio Engineering',
    inventoryItemId: 'INV-014', materialCode: 'PF-6063-02',
    materialName: 'Door Frame Profile 6063', materialNameAm: 'የበር ፍሬም ፕሮፋይል 6063',
    materialCategory: 'Profile', alloyType: '6063', temper: 'T6',
    stockLength: 6000, stocksUsed: 2,
    cuts: [2400, 2400, 1800, 1800, 1200, 1200], totalCuts: 6, totalCutLength: 10800, waste: 1200, wastePercent: 10,
    optimized: true, efficiency: 90,
    remnants: [{ length: 600, reusable: true }, { length: 600, reusable: true }],
    assignee: 'Dawit H.', machine: 'Double Head Cutting Saw',
    scheduledDate: '2025-01-15', startTime: '2025-01-15T08:00:00', endTime: '2025-01-15T12:00:00', duration: 4,
    materialCost: 1440, wasteCost: 144, laborCost: 500, totalCost: 2084,
    status: 'Completed', priority: 'High',
    qualityChecked: true, qualityResult: 'pass',
    createdAt: '2025-01-15', createdBy: 'EMP-001', updatedAt: '2025-01-15',
  },
  {
    id: 'CJ-006', jobNumber: 'CJ-2025-006',
    workOrderId: 'WO-011', workOrderNumber: 'WO-2025-011',
    projectId: 'PJ-009', projectName: 'Addis Builders Residential G+5',
    customerId: 'CUS-008', customerName: 'Addis Builders PLC',
    inventoryItemId: 'INV-013', materialCode: 'PF-6063-01',
    materialName: 'Window Frame Profile 6063', materialCategory: 'Profile',
    stockLength: 6000, stocksUsed: 4,
    cuts: [1200, 1200, 1500, 1200, 1200, 1500, 1200, 1200, 1500, 1200, 1500, 1200, 1200, 1500, 1200, 1200, 1500, 1200, 1200, 1500],
    totalCuts: 20, totalCutLength: 26200, waste: 1400, wastePercent: 5.1,
    optimized: true, efficiency: 94.9,
    remnants: [{ length: 600, reusable: true }, { length: 400, reusable: false }, { length: 200, reusable: false }, { length: 200, reusable: false }],
    assignee: 'Yosef B.', machine: 'CNC Router',
    scheduledDate: '2025-01-28', startTime: '2025-01-28T08:00:00', endTime: '2025-01-28T16:00:00', duration: 8,
    materialCost: 2040, wasteCost: 119, laborCost: 1104, totalCost: 3263,
    status: 'Completed', priority: 'High',
    qualityChecked: true, qualityResult: 'pass',
    createdAt: '2025-01-28', createdBy: 'EMP-003', updatedAt: '2025-01-28',
  },
  {
    id: 'CJ-007', jobNumber: 'CJ-2025-007',
    workOrderId: 'WO-009', workOrderNumber: 'WO-2025-009',
    projectId: 'PJ-006', projectName: 'Kazanchis Bank Branch',
    customerId: 'CUS-006', customerName: 'Commercial Bank Ethiopia',
    inventoryItemId: 'INV-013', materialCode: 'PF-6063-01',
    materialName: 'Window Frame Profile 6063', materialCategory: 'Profile',
    stockLength: 6000, stocksUsed: 1,
    cuts: [1800, 1800, 2400], totalCuts: 3, totalCutLength: 6000, waste: 0, wastePercent: 0,
    optimized: true, efficiency: 100,
    remnants: [],
    assignee: 'Abebe T.', machine: 'Manual Mitre Saw',
    scheduledDate: '2025-03-01',
    materialCost: 510, wasteCost: 0, laborCost: 345, totalCost: 855,
    status: 'Pending', priority: 'Medium',
    qualityChecked: false,
    createdAt: '2025-03-01', createdBy: 'EMP-001', updatedAt: '2025-03-01',
  },
  {
    id: 'CJ-008', jobNumber: 'CJ-2025-008',
    workOrderId: 'WO-008', workOrderNumber: 'WO-2025-008',
    projectId: 'PJ-001', projectName: 'Bole Apartments Tower A',
    customerId: 'CUS-001', customerName: 'Ayat Real Estate',
    inventoryItemId: 'INV-016', materialCode: 'GL-TNT-08',
    materialName: '8mm Tinted Tempered Glass', materialNameAm: '8ሚሜ ቀለም ጠንካራ መስታወት',
    materialCategory: 'Glass',
    stockLength: 3000, stocksUsed: 2,
    cuts: [1200, 1500, 1200, 1500], totalCuts: 4, totalCutLength: 5400, waste: 600, wastePercent: 10,
    optimized: true, efficiency: 90,
    remnants: [{ length: 300, reusable: false }, { length: 300, reusable: false }],
    assignee: 'Dawit H.', machine: 'Glass Cutting Table',
    scheduledDate: '2025-02-20', startTime: '2025-02-20T08:00:00', endTime: '2025-02-20T11:00:00', duration: 3,
    materialCost: 3720, wasteCost: 372, laborCost: 375, totalCost: 4467,
    status: 'Completed', priority: 'Medium',
    qualityChecked: true, qualityResult: 'pass',
    createdAt: '2025-02-20', createdBy: 'EMP-005', updatedAt: '2025-02-20',
  },
];
