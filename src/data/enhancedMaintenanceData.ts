// ══════════════════════════════════════════
// ENHANCED MAINTENANCE DATA MODEL & SAMPLE DATA
// ══════════════════════════════════════════

export type MaintenanceStatus = 'scheduled' | 'pending_parts' | 'in_progress' | 'completed' | 'overdue' | 'cancelled' | 'deferred';
export type MaintenancePriority = 'critical' | 'high' | 'medium' | 'low' | 'planned';
export type MaintenanceType = 'preventive' | 'corrective' | 'emergency' | 'predictive' | 'calibration' | 'inspection' | 'overhaul';
export type EquipmentCategory = 'cutting_machine' | 'cnc_machine' | 'welding_machine' | 'assembly_line' | 'glass_processing' | 'painting_line' | 'hand_tools' | 'power_tools' | 'compressor' | 'generator' | 'forklift' | 'vehicle' | 'measuring_device' | 'testing_equipment';
export type EquipmentStatus = 'operational' | 'under_maintenance' | 'breakdown' | 'decommissioned';

export interface Equipment {
  id: string;
  equipmentNumber: string;
  name: string;
  nameAm?: string;
  category: EquipmentCategory;
  manufacturer: string;
  model: string;
  serialNumber: string;
  yearOfManufacture: number;
  purchaseDate: string;
  purchaseCost: number;
  location: string;
  department: string;
  powerRating?: string;
  capacity?: string;
  maintenanceFrequency: {
    type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
    value: number;
    lastDone?: string;
    nextDue?: string;
  };
  totalOperatingHours: number;
  warrantyExpiry?: string;
  supplierId?: string;
  supplierName?: string;
  status: EquipmentStatus;
  healthScore: number;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenancePartUsed {
  partId: string;
  partName: string;
  partCode: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  fromStock: boolean;
}

export interface EnhancedMaintenanceTask {
  id: string;
  taskNumber: string;
  equipmentId: string;
  equipmentName: string;
  equipmentNumber: string;
  equipmentCategory: EquipmentCategory;
  type: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  scheduledDate: string;
  scheduledDuration: number;
  startDate?: string;
  completionDate?: string;
  title: string;
  description: string;
  checklist: { item: string; completed: boolean; notes?: string }[];
  assignedTo: string[];
  assignedToNames: string[];
  leadTechnician?: string;
  partsUsed: MaintenancePartUsed[];
  laborHours: number;
  laborRate: number;
  laborCost: number;
  partsCost: number;
  totalCost: number;
  downtimeHours?: number;
  productionImpact?: 'none' | 'minor' | 'major' | 'complete_shutdown';
  issuesFound?: string[];
  rootCause?: string;
  correctiveAction?: string;
  outcome?: 'successful' | 'partial' | 'failed' | 'deferred';
  followUpRequired: boolean;
  affectedWorkOrders?: string[];
  affectedProjects?: string[];
  notes?: string;
  technicianNotes?: string;
  isOverdue: boolean;
  isEmergency: boolean;
  requiresShutdown: boolean;
  activityLog: { date: string; user: string; userName: string; action: string; notes?: string }[];
  createdAt: string;
  createdBy: string;
  createdByName: string;
  updatedAt: string;
}

export interface MaintenanceStats {
  totalTasks: number;
  openTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
  criticalTasks: number;
  preventiveTasks: number;
  correctiveTasks: number;
  emergencyTasks: number;
  totalCostMTD: number;
  partsCostMTD: number;
  laborCostMTD: number;
  totalDowntimeHours: number;
  totalEquipment: number;
  equipmentWithIssues: number;
  averageHealthScore: number;
  completionRate: number;
  byStatus: Record<MaintenanceStatus, number>;
}

// Helpers
export const getStatusColor = (s: MaintenanceStatus): string => {
  const m: Record<MaintenanceStatus, string> = {
    scheduled: 'bg-info/10 text-info', pending_parts: 'bg-warning/10 text-warning',
    in_progress: 'bg-primary/10 text-primary', completed: 'bg-success/10 text-success',
    overdue: 'bg-destructive/10 text-destructive', cancelled: 'bg-muted text-muted-foreground',
    deferred: 'bg-orange-500/10 text-orange-500',
  };
  return m[s];
};

export const getStatusLabel = (s: MaintenanceStatus): string =>
  s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

export const getPriorityColor = (p: MaintenancePriority): string => {
  const m: Record<MaintenancePriority, string> = {
    critical: 'bg-destructive/10 text-destructive', high: 'bg-orange-500/10 text-orange-500',
    medium: 'bg-warning/10 text-warning', low: 'bg-info/10 text-info', planned: 'bg-success/10 text-success',
  };
  return m[p];
};

export const getTypeColor = (t: MaintenanceType): string => {
  const m: Record<MaintenanceType, string> = {
    preventive: 'bg-success/10 text-success', corrective: 'bg-warning/10 text-warning',
    emergency: 'bg-destructive/10 text-destructive', predictive: 'bg-info/10 text-info',
    calibration: 'bg-primary/10 text-primary', inspection: 'bg-muted text-muted-foreground',
    overhaul: 'bg-purple-500/10 text-purple-500',
  };
  return m[t];
};

export const getEquipmentStatusColor = (s: EquipmentStatus): string => {
  const m: Record<EquipmentStatus, string> = {
    operational: 'bg-success/10 text-success', under_maintenance: 'bg-warning/10 text-warning',
    breakdown: 'bg-destructive/10 text-destructive', decommissioned: 'bg-muted text-muted-foreground',
  };
  return m[s];
};

export const getHealthColor = (score: number): string =>
  score >= 90 ? 'text-success' : score >= 70 ? 'text-warning' : score >= 50 ? 'text-orange-500' : 'text-destructive';

export const formatETB = (amt: number): string => {
  if (amt >= 1000000) return `ETB ${(amt / 1000000).toFixed(1)}M`;
  if (amt >= 1000) return `ETB ${(amt / 1000).toFixed(0)}K`;
  return `ETB ${amt.toLocaleString()}`;
};

export const daysUntil = (d: string): number => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

export function calculateMaintenanceStats(tasks: EnhancedMaintenanceTask[], equipment: Equipment[]): MaintenanceStats {
  const byStatus: Record<MaintenanceStatus, number> = { scheduled: 0, pending_parts: 0, in_progress: 0, completed: 0, overdue: 0, cancelled: 0, deferred: 0 };
  tasks.forEach(t => byStatus[t.status]++);
  const completed = tasks.filter(t => t.status === 'completed');
  const monthStart = new Date().toISOString().slice(0, 7);
  const mtdTasks = tasks.filter(t => t.createdAt.startsWith(monthStart));

  return {
    totalTasks: tasks.length,
    openTasks: byStatus.scheduled + byStatus.pending_parts,
    inProgressTasks: byStatus.in_progress,
    completedTasks: byStatus.completed,
    overdueTasks: byStatus.overdue,
    criticalTasks: tasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length,
    preventiveTasks: tasks.filter(t => t.type === 'preventive').length,
    correctiveTasks: tasks.filter(t => t.type === 'corrective').length,
    emergencyTasks: tasks.filter(t => t.type === 'emergency').length,
    totalCostMTD: mtdTasks.reduce((s, t) => s + t.totalCost, 0),
    partsCostMTD: mtdTasks.reduce((s, t) => s + t.partsCost, 0),
    laborCostMTD: mtdTasks.reduce((s, t) => s + t.laborCost, 0),
    totalDowntimeHours: tasks.reduce((s, t) => s + (t.downtimeHours || 0), 0),
    totalEquipment: equipment.length,
    equipmentWithIssues: equipment.filter(e => e.status !== 'operational').length,
    averageHealthScore: equipment.length > 0 ? Math.round(equipment.reduce((s, e) => s + e.healthScore, 0) / equipment.length) : 0,
    completionRate: tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0,
    byStatus,
  };
}

// ═══ SAMPLE EQUIPMENT ═══
export const sampleEquipment: Equipment[] = [
  {
    id: 'EQ-001', equipmentNumber: 'EQ-001', name: 'Double Head Cutting Machine', nameAm: 'ድርብ ራስ መቁረጫ ማሽን',
    category: 'cutting_machine', manufacturer: 'Emmegi', model: 'Classic Magic 450', serialNumber: 'EM-2019-04521',
    yearOfManufacture: 2019, purchaseDate: '2019-06-15', purchaseCost: 850000,
    location: 'Production Hall A', department: 'Cutting',
    powerRating: '3.5 kW', capacity: '450mm blade',
    maintenanceFrequency: { type: 'monthly', value: 1, lastDone: '2025-02-15', nextDue: '2025-03-15' },
    totalOperatingHours: 12500, warrantyExpiry: '2024-06-15',
    status: 'operational', healthScore: 88, criticality: 'critical',
    notes: 'Primary cutting machine. Blade replacement every 500hrs.',
    createdAt: '2019-06-15', updatedAt: '2025-02-15',
  },
  {
    id: 'EQ-002', equipmentNumber: 'EQ-002', name: 'CNC Copy Router', nameAm: 'CNC ኮፒ ራውተር',
    category: 'cnc_machine', manufacturer: 'Yilmaz', model: 'FR 225', serialNumber: 'YZ-2020-08934',
    yearOfManufacture: 2020, purchaseDate: '2020-03-10', purchaseCost: 1200000,
    location: 'Production Hall A', department: 'Production',
    powerRating: '5.5 kW', capacity: '3-axis routing',
    maintenanceFrequency: { type: 'monthly', value: 1, lastDone: '2025-01-20', nextDue: '2025-02-20' },
    totalOperatingHours: 9800, warrantyExpiry: '2025-03-10',
    status: 'under_maintenance', healthScore: 65, criticality: 'high',
    notes: 'Overdue for maintenance. Spindle vibration reported.',
    createdAt: '2020-03-10', updatedAt: '2025-02-28',
  },
  {
    id: 'EQ-003', equipmentNumber: 'EQ-003', name: 'Corner Crimping Machine', nameAm: 'ማዕዘን ክሪምፒንግ ማሽን',
    category: 'assembly_line', manufacturer: 'Ozgenc', model: 'KM-400', serialNumber: 'OZ-2021-11223',
    yearOfManufacture: 2021, purchaseDate: '2021-01-05', purchaseCost: 450000,
    location: 'Assembly Area', department: 'Assembly',
    maintenanceFrequency: { type: 'quarterly', value: 1, lastDone: '2025-01-10', nextDue: '2025-04-10' },
    totalOperatingHours: 6200,
    status: 'operational', healthScore: 92, criticality: 'high',
    createdAt: '2021-01-05', updatedAt: '2025-01-10',
  },
  {
    id: 'EQ-004', equipmentNumber: 'EQ-004', name: 'TIG Welding Machine', nameAm: 'TIG ዌልዲንግ ማሽን',
    category: 'welding_machine', manufacturer: 'Fronius', model: 'TransTig 210', serialNumber: 'FR-2022-33445',
    yearOfManufacture: 2022, purchaseDate: '2022-07-20', purchaseCost: 180000,
    location: 'Welding Bay', department: 'Production',
    powerRating: '210A', maintenanceFrequency: { type: 'quarterly', value: 1, lastDone: '2025-02-01', nextDue: '2025-05-01' },
    totalOperatingHours: 4100,
    status: 'operational', healthScore: 95, criticality: 'medium',
    createdAt: '2022-07-20', updatedAt: '2025-02-01',
  },
  {
    id: 'EQ-005', equipmentNumber: 'EQ-005', name: 'Glass Cutting Table', nameAm: 'መስታወት መቁረጫ ጠረጴዛ',
    category: 'glass_processing', manufacturer: 'Bottero', model: 'BCS 220', serialNumber: 'BT-2020-55667',
    yearOfManufacture: 2020, purchaseDate: '2020-11-01', purchaseCost: 650000,
    location: 'Glass Workshop', department: 'Glass Processing',
    maintenanceFrequency: { type: 'monthly', value: 1, lastDone: '2025-02-20', nextDue: '2025-03-20' },
    totalOperatingHours: 8500,
    status: 'operational', healthScore: 82, criticality: 'high',
    createdAt: '2020-11-01', updatedAt: '2025-02-20',
  },
  {
    id: 'EQ-006', equipmentNumber: 'EQ-006', name: 'Air Compressor', nameAm: 'አየር ኮምፕሬሰር',
    category: 'compressor', manufacturer: 'Atlas Copco', model: 'GA 11', serialNumber: 'AC-2018-77889',
    yearOfManufacture: 2018, purchaseDate: '2018-04-15', purchaseCost: 320000,
    location: 'Utility Room', department: 'Facility',
    powerRating: '11 kW', maintenanceFrequency: { type: 'quarterly', value: 1, lastDone: '2024-12-15', nextDue: '2025-03-15' },
    totalOperatingHours: 18200,
    status: 'operational', healthScore: 72, criticality: 'critical',
    notes: 'Powers all pneumatic tools. Filter replacement overdue.',
    createdAt: '2018-04-15', updatedAt: '2024-12-15',
  },
  {
    id: 'EQ-007', equipmentNumber: 'EQ-007', name: 'Forklift Toyota 3T', nameAm: 'ፎርክሊፍት ቶዮታ 3ቶን',
    category: 'forklift', manufacturer: 'Toyota', model: '8FD30', serialNumber: 'TY-2021-99001',
    yearOfManufacture: 2021, purchaseDate: '2021-05-20', purchaseCost: 1500000,
    location: 'Warehouse', department: 'Logistics',
    maintenanceFrequency: { type: 'monthly', value: 1, lastDone: '2025-02-25', nextDue: '2025-03-25' },
    totalOperatingHours: 5600,
    status: 'operational', healthScore: 90, criticality: 'medium',
    createdAt: '2021-05-20', updatedAt: '2025-02-25',
  },
  {
    id: 'EQ-008', equipmentNumber: 'EQ-008', name: 'Toyota Hilux (Installation)', nameAm: 'ቶዮታ ሃይለክስ (ማስገጠሚያ)',
    category: 'vehicle', manufacturer: 'Toyota', model: 'Hilux 2.4D', serialNumber: 'VEH-2023-AA1234',
    yearOfManufacture: 2023, purchaseDate: '2023-01-10', purchaseCost: 2800000,
    location: 'Parking', department: 'Installation',
    maintenanceFrequency: { type: 'quarterly', value: 1, lastDone: '2025-01-15', nextDue: '2025-04-15' },
    totalOperatingHours: 3200,
    status: 'operational', healthScore: 96, criticality: 'medium',
    createdAt: '2023-01-10', updatedAt: '2025-01-15',
  },
];

// ═══ SAMPLE MAINTENANCE TASKS ═══
export const sampleEnhancedMaintenanceTasks: EnhancedMaintenanceTask[] = [
  {
    id: 'MT-001', taskNumber: 'MT-001',
    equipmentId: 'EQ-002', equipmentName: 'CNC Copy Router', equipmentNumber: 'EQ-002', equipmentCategory: 'cnc_machine',
    type: 'corrective', priority: 'high', status: 'in_progress',
    scheduledDate: '2025-03-05', scheduledDuration: 8, startDate: '2025-03-05',
    title: 'Spindle Bearing Replacement', description: 'Excessive vibration detected in spindle assembly. Bearing replacement required.',
    checklist: [
      { item: 'Disconnect power and lock-out', completed: true },
      { item: 'Remove spindle assembly', completed: true },
      { item: 'Replace bearings (2x SKF 6205)', completed: false },
      { item: 'Reassemble and align', completed: false },
      { item: 'Test run and calibrate', completed: false },
    ],
    assignedTo: ['EMP-007'], assignedToNames: ['Girma Assefa'], leadTechnician: 'Girma Assefa',
    partsUsed: [
      { partId: 'SP-001', partName: 'SKF 6205 Bearing', partCode: 'BRG-6205', quantity: 2, unitCost: 2500, totalCost: 5000, fromStock: true },
      { partId: 'SP-002', partName: 'Spindle Seal Kit', partCode: 'SEL-CNC-01', quantity: 1, unitCost: 3500, totalCost: 3500, fromStock: true },
    ],
    laborHours: 6, laborRate: 150, laborCost: 900, partsCost: 8500, totalCost: 9400,
    downtimeHours: 12, productionImpact: 'major',
    issuesFound: ['Bearing worn due to insufficient lubrication', 'Seal degradation'],
    rootCause: 'Lubrication schedule not followed',
    affectedWorkOrders: ['WO-003', 'WO-005'],
    affectedProjects: ['PJ-003'],
    isOverdue: false, isEmergency: false, requiresShutdown: true, followUpRequired: true,
    activityLog: [
      { date: '2025-03-04', user: 'EMP-007', userName: 'Girma Assefa', action: 'Vibration analysis performed' },
      { date: '2025-03-05', user: 'EMP-007', userName: 'Girma Assefa', action: 'Maintenance started - spindle disassembly' },
    ],
    createdAt: '2025-03-04', createdBy: 'EMP-007', createdByName: 'Girma Assefa', updatedAt: '2025-03-05',
  },
  {
    id: 'MT-002', taskNumber: 'MT-002',
    equipmentId: 'EQ-001', equipmentName: 'Double Head Cutting Machine', equipmentNumber: 'EQ-001', equipmentCategory: 'cutting_machine',
    type: 'preventive', priority: 'planned', status: 'scheduled',
    scheduledDate: '2025-03-15', scheduledDuration: 4,
    title: 'Monthly PM - Blade and Lubrication', description: 'Monthly preventive maintenance: blade inspection, lubrication, alignment check.',
    checklist: [
      { item: 'Inspect cutting blades', completed: false },
      { item: 'Lubricate guide rails', completed: false },
      { item: 'Check belt tension', completed: false },
      { item: 'Clean chip collection', completed: false },
      { item: 'Verify cutting angles', completed: false },
    ],
    assignedTo: ['EMP-007'], assignedToNames: ['Girma Assefa'], leadTechnician: 'Girma Assefa',
    partsUsed: [],
    laborHours: 0, laborRate: 150, laborCost: 0, partsCost: 0, totalCost: 0,
    isOverdue: false, isEmergency: false, requiresShutdown: true, followUpRequired: false,
    activityLog: [
      { date: '2025-03-01', user: 'EMP-001', userName: 'Abebe Tekle', action: 'PM task auto-generated' },
    ],
    createdAt: '2025-03-01', createdBy: 'EMP-001', createdByName: 'Abebe Tekle', updatedAt: '2025-03-01',
  },
  {
    id: 'MT-003', taskNumber: 'MT-003',
    equipmentId: 'EQ-006', equipmentName: 'Air Compressor', equipmentNumber: 'EQ-006', equipmentCategory: 'compressor',
    type: 'preventive', priority: 'medium', status: 'overdue',
    scheduledDate: '2025-02-28', scheduledDuration: 3,
    title: 'Quarterly Service - Filter & Oil', description: 'Quarterly service: replace air filter, oil filter, oil change.',
    checklist: [
      { item: 'Replace air intake filter', completed: false },
      { item: 'Replace oil filter', completed: false },
      { item: 'Drain and replace compressor oil', completed: false },
      { item: 'Check safety valve', completed: false },
      { item: 'Test pressure output', completed: false },
    ],
    assignedTo: ['EMP-008'], assignedToNames: ['Solomon Tadesse'],
    partsUsed: [
      { partId: 'SP-003', partName: 'Air Filter Element', partCode: 'AF-GA11', quantity: 1, unitCost: 1800, totalCost: 1800, fromStock: false },
      { partId: 'SP-004', partName: 'Compressor Oil 5L', partCode: 'OIL-COMP-5', quantity: 1, unitCost: 2200, totalCost: 2200, fromStock: true },
    ],
    laborHours: 0, laborRate: 125, laborCost: 0, partsCost: 4000, totalCost: 4000,
    downtimeHours: 4, productionImpact: 'minor',
    isOverdue: true, isEmergency: false, requiresShutdown: true, followUpRequired: false,
    notes: 'Filter not in stock - ordered from supplier.',
    activityLog: [
      { date: '2025-02-15', user: 'EMP-001', userName: 'Abebe Tekle', action: 'PM task scheduled' },
      { date: '2025-03-01', user: 'EMP-001', userName: 'Abebe Tekle', action: 'Marked overdue - awaiting filter delivery' },
    ],
    createdAt: '2025-02-15', createdBy: 'EMP-001', createdByName: 'Abebe Tekle', updatedAt: '2025-03-01',
  },
  {
    id: 'MT-004', taskNumber: 'MT-004',
    equipmentId: 'EQ-005', equipmentName: 'Glass Cutting Table', equipmentNumber: 'EQ-005', equipmentCategory: 'glass_processing',
    type: 'calibration', priority: 'medium', status: 'scheduled',
    scheduledDate: '2025-03-20', scheduledDuration: 2,
    title: 'Cutting Head Calibration', description: 'Calibrate glass cutting head for precision cuts. Check scoring depth and alignment.',
    checklist: [
      { item: 'Check scoring wheel condition', completed: false },
      { item: 'Calibrate X/Y axes', completed: false },
      { item: 'Test cut samples', completed: false },
      { item: 'Update calibration log', completed: false },
    ],
    assignedTo: ['EMP-007'], assignedToNames: ['Girma Assefa'],
    partsUsed: [],
    laborHours: 0, laborRate: 150, laborCost: 0, partsCost: 0, totalCost: 0,
    isOverdue: false, isEmergency: false, requiresShutdown: true, followUpRequired: false,
    activityLog: [
      { date: '2025-03-05', user: 'EMP-001', userName: 'Abebe Tekle', action: 'Calibration scheduled' },
    ],
    createdAt: '2025-03-05', createdBy: 'EMP-001', createdByName: 'Abebe Tekle', updatedAt: '2025-03-05',
  },
  {
    id: 'MT-005', taskNumber: 'MT-005',
    equipmentId: 'EQ-004', equipmentName: 'TIG Welding Machine', equipmentNumber: 'EQ-004', equipmentCategory: 'welding_machine',
    type: 'inspection', priority: 'low', status: 'completed',
    scheduledDate: '2025-02-20', scheduledDuration: 1, startDate: '2025-02-20', completionDate: '2025-02-20',
    title: 'Quarterly Inspection', description: 'Routine inspection of welding machine. Check cables, torch, gas flow.',
    checklist: [
      { item: 'Inspect power cable', completed: true },
      { item: 'Check torch and nozzle', completed: true },
      { item: 'Test gas flow rate', completed: true },
      { item: 'Verify arc stability', completed: true },
    ],
    assignedTo: ['EMP-008'], assignedToNames: ['Solomon Tadesse'],
    partsUsed: [],
    laborHours: 1, laborRate: 125, laborCost: 125, partsCost: 0, totalCost: 125,
    outcome: 'successful',
    isOverdue: false, isEmergency: false, requiresShutdown: false, followUpRequired: false,
    technicianNotes: 'All parameters within spec. Nozzle tip slightly worn - replace within 30 days.',
    activityLog: [
      { date: '2025-02-20', user: 'EMP-008', userName: 'Solomon Tadesse', action: 'Inspection completed - all OK' },
    ],
    createdAt: '2025-02-15', createdBy: 'EMP-001', createdByName: 'Abebe Tekle', updatedAt: '2025-02-20',
  },
  {
    id: 'MT-006', taskNumber: 'MT-006',
    equipmentId: 'EQ-007', equipmentName: 'Forklift Toyota 3T', equipmentNumber: 'EQ-007', equipmentCategory: 'forklift',
    type: 'preventive', priority: 'planned', status: 'completed',
    scheduledDate: '2025-02-25', scheduledDuration: 3, startDate: '2025-02-25', completionDate: '2025-02-25',
    title: 'Monthly PM - Fluid & Brakes', description: 'Monthly preventive: check hydraulic fluid, brake pads, tire pressure.',
    checklist: [
      { item: 'Check hydraulic oil level', completed: true },
      { item: 'Inspect brake pads', completed: true },
      { item: 'Check tire pressure', completed: true },
      { item: 'Test mast operation', completed: true },
      { item: 'Lubricate chains', completed: true },
    ],
    assignedTo: ['EMP-008'], assignedToNames: ['Solomon Tadesse'],
    partsUsed: [
      { partId: 'SP-005', partName: 'Hydraulic Oil 2L', partCode: 'HYD-FL-2', quantity: 1, unitCost: 800, totalCost: 800, fromStock: true },
    ],
    laborHours: 2.5, laborRate: 125, laborCost: 312, partsCost: 800, totalCost: 1112,
    outcome: 'successful',
    isOverdue: false, isEmergency: false, requiresShutdown: false, followUpRequired: false,
    activityLog: [
      { date: '2025-02-25', user: 'EMP-008', userName: 'Solomon Tadesse', action: 'PM completed successfully' },
    ],
    createdAt: '2025-02-20', createdBy: 'EMP-001', createdByName: 'Abebe Tekle', updatedAt: '2025-02-25',
  },
  {
    id: 'MT-007', taskNumber: 'MT-007',
    equipmentId: 'EQ-008', equipmentName: 'Toyota Hilux (Installation)', equipmentNumber: 'EQ-008', equipmentCategory: 'vehicle',
    type: 'preventive', priority: 'medium', status: 'scheduled',
    scheduledDate: '2025-03-12', scheduledDuration: 4,
    title: 'Vehicle Service - Oil & Tires', description: 'Quarterly vehicle service: oil change, tire rotation, brake check, lights.',
    checklist: [
      { item: 'Engine oil change', completed: false },
      { item: 'Oil filter replacement', completed: false },
      { item: 'Tire rotation', completed: false },
      { item: 'Brake pad inspection', completed: false },
      { item: 'Light and signal check', completed: false },
    ],
    assignedTo: ['EMP-008'], assignedToNames: ['Solomon Tadesse'],
    partsUsed: [],
    laborHours: 0, laborRate: 125, laborCost: 0, partsCost: 0, totalCost: 0,
    isOverdue: false, isEmergency: false, requiresShutdown: false, followUpRequired: false,
    notes: 'Installation vehicle - coordinate with installation team schedule.',
    activityLog: [
      { date: '2025-03-05', user: 'EMP-001', userName: 'Abebe Tekle', action: 'Service scheduled' },
    ],
    createdAt: '2025-03-05', createdBy: 'EMP-001', createdByName: 'Abebe Tekle', updatedAt: '2025-03-05',
  },
  {
    id: 'MT-008', taskNumber: 'MT-008',
    equipmentId: 'EQ-003', equipmentName: 'Corner Crimping Machine', equipmentNumber: 'EQ-003', equipmentCategory: 'assembly_line',
    type: 'emergency', priority: 'critical', status: 'pending_parts',
    scheduledDate: '2025-03-07', scheduledDuration: 6,
    title: 'Hydraulic Cylinder Repair', description: 'Hydraulic cylinder leaking. Assembly line partially stopped.',
    checklist: [
      { item: 'Isolate hydraulic circuit', completed: true },
      { item: 'Remove cylinder', completed: true },
      { item: 'Replace seals and piston rod', completed: false },
      { item: 'Reinstall and test', completed: false },
    ],
    assignedTo: ['EMP-007', 'EMP-008'], assignedToNames: ['Girma Assefa', 'Solomon Tadesse'], leadTechnician: 'Girma Assefa',
    partsUsed: [
      { partId: 'SP-006', partName: 'Hydraulic Seal Kit', partCode: 'HSK-KM400', quantity: 1, unitCost: 4500, totalCost: 4500, fromStock: false },
    ],
    laborHours: 4, laborRate: 150, laborCost: 600, partsCost: 4500, totalCost: 5100,
    downtimeHours: 16, productionImpact: 'major',
    affectedWorkOrders: ['WO-004'],
    isOverdue: false, isEmergency: true, requiresShutdown: true, followUpRequired: true,
    notes: 'Seal kit ordered - expected delivery Mar 8.',
    activityLog: [
      { date: '2025-03-07', user: 'EMP-003', userName: 'Yosef Bekele', action: 'Breakdown reported - hydraulic leak' },
      { date: '2025-03-07', user: 'EMP-007', userName: 'Girma Assefa', action: 'Emergency response - cylinder removed' },
      { date: '2025-03-07', user: 'EMP-001', userName: 'Abebe Tekle', action: 'Parts ordered from supplier' },
    ],
    createdAt: '2025-03-07', createdBy: 'EMP-003', createdByName: 'Yosef Bekele', updatedAt: '2025-03-07',
  },
];
