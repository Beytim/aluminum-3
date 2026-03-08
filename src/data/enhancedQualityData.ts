// ══════════════════════════════════════════
// ENHANCED QUALITY MODULE DATA
// ══════════════════════════════════════════

export type InspectionType = 'incoming' | 'in_process' | 'final' | 'installation' | 'maintenance' | 'audit';
export type InspectionResult = 'pass' | 'fail' | 'conditional' | 'rework' | 'scrap';
export type DefectSeverity = 'critical' | 'major' | 'minor' | 'observation';
export type NCRStatus = 'open' | 'investigating' | 'corrective_action' | 'verified' | 'closed' | 'rejected';
export type CAPAPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Defect {
  id: string;
  defectNumber: string;
  inspectionId: string;
  inspectionNumber: string;
  productId?: string;
  productName?: string;
  workOrderId?: string;
  workOrderNumber?: string;
  category: 'dimensional' | 'visual' | 'functional' | 'material' | 'finish' | 'assembly' | 'other';
  description: string;
  severity: DefectSeverity;
  location?: string;
  quantity?: number;
  rootCause?: string;
  rootCauseCategory?: 'material' | 'process' | 'human' | 'machine' | 'measurement' | 'environment';
  disposition: 'use_as_is' | 'rework' | 'scrap' | 'return_to_supplier';
  dispositionNotes?: string;
  reworkRequired: boolean;
  reworkWorkOrderId?: string;
  costImpact?: number;
  timeImpact?: number;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface EnhancedInspection {
  id: string;
  inspectionNumber: string;
  type: InspectionType;
  productId?: string;
  productName?: string;
  productCode?: string;
  workOrderId?: string;
  workOrderNumber?: string;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  inventoryItemId?: string;
  inventoryItemCode?: string;
  projectId?: string;
  projectName?: string;
  orderId?: string;
  orderNumber?: string;
  installationId?: string;
  equipmentId?: string;
  supplierId?: string;
  supplierName?: string;
  inspectorId: string;
  inspectorName: string;
  inspectorDept?: string;
  scheduledDate: string;
  inspectionDate: string;
  completedDate?: string;
  checklistId?: string;
  checklistName?: string;
  result: InspectionResult;
  score?: number;
  checklistResults: {
    itemId: string;
    description: string;
    passed: boolean;
    actualValue?: string;
    notes?: string;
  }[];
  defects: Defect[];
  defectCount: number;
  measurements?: {
    parameter: string;
    specification: string;
    actual: string;
    unit: string;
    passed: boolean;
  }[];
  ncrId?: string;
  ncrNumber?: string;
  status: 'draft' | 'completed' | 'verified' | 'cancelled';
  notes?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedBy: string;
  updatedByName: string;
  updatedAt: string;
}

export interface NCR {
  id: string;
  ncrNumber: string;
  inspectionId?: string;
  inspectionNumber?: string;
  productId?: string;
  productName?: string;
  workOrderId?: string;
  workOrderNumber?: string;
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  supplierId?: string;
  supplierName?: string;
  customerId?: string;
  customerName?: string;
  orderId?: string;
  orderNumber?: string;
  title: string;
  description: string;
  reportedDate: string;
  reportedBy: string;
  reportedByName: string;
  severity: DefectSeverity;
  category: 'product' | 'process' | 'material' | 'documentation' | 'service' | 'other';
  quantityAffected: number;
  quantityUnit: string;
  immediateAction: 'quarantine' | 'rework' | 'scrap' | 'use_as_is' | 'return';
  quarantineLocation?: string;
  investigationRequired: boolean;
  investigationStatus: 'not_started' | 'in_progress' | 'completed';
  investigationSummary?: string;
  rootCause?: string;
  rootCauseCategory?: string;
  capaRequired: boolean;
  capaId?: string;
  capaNumber?: string;
  preventiveAction?: string;
  verificationRequired: boolean;
  verificationStatus: 'pending' | 'in_progress' | 'verified';
  verifiedBy?: string;
  verifiedDate?: string;
  closureDate?: string;
  closedBy?: string;
  costImpact: number;
  timeImpact: number;
  scrapValue?: number;
  status: NCRStatus;
  notes?: string;
  activityLog: {
    date: string;
    user: string;
    userName: string;
    action: string;
    notes?: string;
  }[];
  createdAt: string;
  createdBy: string;
  createdByName: string;
  updatedAt: string;
  updatedBy: string;
  updatedByName: string;
}

export interface CustomerComplaint {
  id: string;
  complaintNumber: string;
  customerId: string;
  customerName: string;
  orderId?: string;
  orderNumber?: string;
  productId?: string;
  productName?: string;
  installationId?: string;
  date: string;
  receivedBy: string;
  channel: 'phone' | 'email' | 'in_person' | 'social_media' | 'other';
  subject: string;
  description: string;
  category: 'product_quality' | 'delivery' | 'installation' | 'service' | 'billing' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  responseRequired: boolean;
  responseDueDate?: string;
  responseSentDate?: string;
  response?: string;
  resolutionStatus: 'pending' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  resolutionDate?: string;
  resolutionNotes?: string;
  customerSatisfaction?: 1 | 2 | 3 | 4 | 5;
  ncrId?: string;
  ncrNumber?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

export interface QualityStats {
  totalInspections: number;
  inspectionsThisMonth: number;
  passRate: number;
  failRate: number;
  conditionalRate: number;
  totalDefects: number;
  openDefects: number;
  criticalDefects: number;
  totalNCRs: number;
  openNCRs: number;
  closedNCRs: number;
  totalComplaints: number;
  openComplaints: number;
  costOfQuality: number;
  reworkCost: number;
  scrapCost: number;
  defectsByCategory: Record<string, number>;
  defectsBySeverity: Record<string, number>;
  topDefects: { description: string; count: number }[];
  qualityByProduct: Record<string, { pass: number; fail: number; rate: number }>;
}

// ═══ HELPER FUNCTIONS ═══

export const getInspectionResultColor = (result: InspectionResult): string => {
  switch (result) {
    case 'pass': return 'bg-success/10 text-success';
    case 'fail': return 'bg-destructive/10 text-destructive';
    case 'conditional': return 'bg-warning/10 text-warning';
    case 'rework': return 'bg-[hsl(25,90%,50%)]/10 text-[hsl(25,90%,50%)]';
    case 'scrap': return 'bg-destructive/10 text-destructive';
  }
};

export const getDefectSeverityColor = (severity: DefectSeverity): string => {
  switch (severity) {
    case 'critical': return 'bg-destructive/10 text-destructive';
    case 'major': return 'bg-[hsl(25,90%,50%)]/10 text-[hsl(25,90%,50%)]';
    case 'minor': return 'bg-warning/10 text-warning';
    case 'observation': return 'bg-info/10 text-info';
  }
};

export const getNCRStatusColor = (status: NCRStatus): string => {
  switch (status) {
    case 'open': return 'bg-destructive/10 text-destructive';
    case 'investigating': return 'bg-warning/10 text-warning';
    case 'corrective_action': return 'bg-primary/10 text-primary';
    case 'verified': return 'bg-info/10 text-info';
    case 'closed': return 'bg-success/10 text-success';
    case 'rejected': return 'bg-muted text-muted-foreground';
  }
};

export const getInspectionTypeLabel = (type: InspectionType): string => {
  switch (type) {
    case 'incoming': return 'Incoming';
    case 'in_process': return 'In-Process';
    case 'final': return 'Final';
    case 'installation': return 'Installation';
    case 'maintenance': return 'Maintenance';
    case 'audit': return 'Audit';
  }
};

export const formatETB = (amount: number): string => `ETB ${amount.toLocaleString()}`;
export const formatETBShort = (amount: number): string => {
  if (amount >= 1000000) return `ETB ${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `ETB ${(amount / 1000).toFixed(0)}K`;
  return `ETB ${amount}`;
};

// ═══ CALCULATE QUALITY STATS ═══

export function calculateQualityStats(
  inspections: EnhancedInspection[],
  ncrs: NCR[],
  complaints: CustomerComplaint[]
): QualityStats {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

  const thisMonth = inspections.filter(i => i.inspectionDate >= monthStart);
  const totalCompleted = inspections.filter(i => i.status === 'completed' || i.status === 'verified');
  const passed = totalCompleted.filter(i => i.result === 'pass').length;
  const failed = totalCompleted.filter(i => i.result === 'fail').length;
  const conditional = totalCompleted.filter(i => i.result === 'conditional').length;
  const total = totalCompleted.length || 1;

  const allDefects = inspections.flatMap(i => i.defects);
  const defectsByCategory: Record<string, number> = {};
  const defectsBySeverity: Record<string, number> = {};
  const defectDescCount: Record<string, number> = {};

  allDefects.forEach(d => {
    defectsByCategory[d.category] = (defectsByCategory[d.category] || 0) + 1;
    defectsBySeverity[d.severity] = (defectsBySeverity[d.severity] || 0) + 1;
    defectDescCount[d.description] = (defectDescCount[d.description] || 0) + 1;
  });

  const topDefects = Object.entries(defectDescCount)
    .map(([description, count]) => ({ description, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const qualityByProduct: Record<string, { pass: number; fail: number; rate: number }> = {};
  totalCompleted.forEach(i => {
    const name = i.productName || 'Unknown';
    if (!qualityByProduct[name]) qualityByProduct[name] = { pass: 0, fail: 0, rate: 0 };
    if (i.result === 'pass') qualityByProduct[name].pass++;
    else qualityByProduct[name].fail++;
  });
  Object.values(qualityByProduct).forEach(v => {
    v.rate = v.pass + v.fail > 0 ? (v.pass / (v.pass + v.fail)) * 100 : 0;
  });

  const reworkCost = ncrs.filter(n => n.immediateAction === 'rework').reduce((s, n) => s + n.costImpact, 0);
  const scrapCost = ncrs.filter(n => n.immediateAction === 'scrap').reduce((s, n) => s + (n.scrapValue || 0), 0);

  return {
    totalInspections: inspections.length,
    inspectionsThisMonth: thisMonth.length,
    passRate: Number(((passed / total) * 100).toFixed(1)),
    failRate: Number(((failed / total) * 100).toFixed(1)),
    conditionalRate: Number(((conditional / total) * 100).toFixed(1)),
    totalDefects: allDefects.length,
    openDefects: allDefects.filter(d => !d.resolved).length,
    criticalDefects: allDefects.filter(d => d.severity === 'critical').length,
    totalNCRs: ncrs.length,
    openNCRs: ncrs.filter(n => n.status === 'open' || n.status === 'investigating' || n.status === 'corrective_action').length,
    closedNCRs: ncrs.filter(n => n.status === 'closed').length,
    totalComplaints: complaints.length,
    openComplaints: complaints.filter(c => c.resolutionStatus === 'pending' || c.resolutionStatus === 'in_progress').length,
    costOfQuality: reworkCost + scrapCost,
    reworkCost,
    scrapCost,
    defectsByCategory,
    defectsBySeverity,
    topDefects,
    qualityByProduct,
  };
}

// ═══ SAMPLE DATA ═══

export const sampleEnhancedInspections: EnhancedInspection[] = [
  {
    id: 'INSP-001', inspectionNumber: 'INSP-2025-001', type: 'final',
    productId: 'PRD-001', productName: 'Sliding Window 2-Panel', productCode: 'SW-201',
    workOrderId: 'WO-001', workOrderNumber: 'WO-2025-001',
    projectId: 'PRJ-001', projectName: 'Bole Tower Apartments',
    inspectorId: 'EMP-003', inspectorName: 'Marta Teshome', inspectorDept: 'Quality',
    scheduledDate: '2025-02-25', inspectionDate: '2025-02-25', completedDate: '2025-02-25',
    checklistName: 'Final Window Inspection',
    result: 'pass', score: 98,
    checklistResults: [
      { itemId: 'CL-01', description: 'Frame straightness ±1mm', passed: true, actualValue: '0.3mm' },
      { itemId: 'CL-02', description: 'Glass seal integrity', passed: true },
      { itemId: 'CL-03', description: 'Smooth operation', passed: true },
      { itemId: 'CL-04', description: 'Hardware alignment', passed: true },
      { itemId: 'CL-05', description: 'Surface finish quality', passed: true },
    ],
    defects: [], defectCount: 0,
    measurements: [
      { parameter: 'Width', specification: '1500±2mm', actual: '1500.5mm', unit: 'mm', passed: true },
      { parameter: 'Height', specification: '1200±2mm', actual: '1199.8mm', unit: 'mm', passed: true },
    ],
    status: 'verified',
    notes: 'All specs within tolerance. Ready for delivery.',
    createdBy: 'EMP-003', createdByName: 'Marta Teshome', createdAt: '2025-02-25',
    updatedBy: 'EMP-003', updatedByName: 'Marta Teshome', updatedAt: '2025-02-25',
  },
  {
    id: 'INSP-002', inspectionNumber: 'INSP-2025-002', type: 'in_process',
    productId: 'PRD-002', productName: 'Casement Window', productCode: 'CW-101',
    workOrderId: 'WO-002', workOrderNumber: 'WO-2025-002',
    projectId: 'PRJ-002', projectName: 'Merkato Commercial Center',
    inspectorId: 'EMP-003', inspectorName: 'Marta Teshome', inspectorDept: 'Quality',
    scheduledDate: '2025-02-28', inspectionDate: '2025-02-28', completedDate: '2025-02-28',
    result: 'conditional', score: 85,
    checklistResults: [
      { itemId: 'CL-01', description: 'Frame straightness ±1mm', passed: true, actualValue: '0.8mm' },
      { itemId: 'CL-02', description: 'Weld quality', passed: false, notes: 'Minor porosity on corner joints' },
      { itemId: 'CL-03', description: 'Surface finish', passed: true },
    ],
    defects: [
      {
        id: 'DEF-001', defectNumber: 'DEF-2025-001',
        inspectionId: 'INSP-002', inspectionNumber: 'INSP-2025-002',
        productId: 'PRD-002', productName: 'Casement Window',
        workOrderId: 'WO-002', workOrderNumber: 'WO-2025-002',
        category: 'visual', description: 'Minor porosity on corner weld joints',
        severity: 'minor', location: 'Bottom-left corner',
        disposition: 'rework', reworkRequired: true,
        costImpact: 500, timeImpact: 2,
        resolved: true, resolvedAt: '2025-03-01', resolvedBy: 'EMP-004',
        notes: 'Re-welded and polished',
        createdAt: '2025-02-28', createdBy: 'EMP-003',
      }
    ],
    defectCount: 1,
    status: 'completed',
    notes: 'Conditional pass - rework required on corner welds',
    createdBy: 'EMP-003', createdByName: 'Marta Teshome', createdAt: '2025-02-28',
    updatedBy: 'EMP-003', updatedByName: 'Marta Teshome', updatedAt: '2025-03-01',
  },
  {
    id: 'INSP-003', inspectionNumber: 'INSP-2025-003', type: 'incoming',
    productId: 'PRD-010', productName: 'Aluminum Profile 6063-T5',
    purchaseOrderId: 'PO-001', purchaseOrderNumber: 'PO-2025-001',
    supplierId: 'SUP-001', supplierName: 'China Zhongwang Holdings',
    inspectorId: 'EMP-003', inspectorName: 'Marta Teshome', inspectorDept: 'Quality',
    scheduledDate: '2025-03-01', inspectionDate: '2025-03-01', completedDate: '2025-03-01',
    result: 'fail', score: 60,
    checklistResults: [
      { itemId: 'CL-01', description: 'Material certificate verification', passed: true },
      { itemId: 'CL-02', description: 'Dimensional check', passed: false, notes: 'Wall thickness out of spec' },
      { itemId: 'CL-03', description: 'Surface quality', passed: false, notes: 'Visible surface oxidation on 15% of batch' },
      { itemId: 'CL-04', description: 'Alloy composition', passed: true },
    ],
    defects: [
      {
        id: 'DEF-002', defectNumber: 'DEF-2025-002',
        inspectionId: 'INSP-003', inspectionNumber: 'INSP-2025-003',
        productName: 'Aluminum Profile 6063-T5',
        category: 'dimensional', description: 'Wall thickness below minimum spec (1.1mm vs 1.4mm min)',
        severity: 'critical', quantity: 50,
        rootCause: 'Supplier manufacturing defect', rootCauseCategory: 'material',
        disposition: 'return_to_supplier', reworkRequired: false,
        costImpact: 45000, timeImpact: 48,
        resolved: false,
        notes: 'Return to supplier initiated',
        createdAt: '2025-03-01', createdBy: 'EMP-003',
      },
      {
        id: 'DEF-003', defectNumber: 'DEF-2025-003',
        inspectionId: 'INSP-003', inspectionNumber: 'INSP-2025-003',
        productName: 'Aluminum Profile 6063-T5',
        category: 'finish', description: 'Surface oxidation on profiles',
        severity: 'major', quantity: 30,
        rootCause: 'Improper storage during transit', rootCauseCategory: 'environment',
        disposition: 'return_to_supplier', reworkRequired: false,
        costImpact: 25000,
        resolved: false,
        createdAt: '2025-03-01', createdBy: 'EMP-003',
      }
    ],
    defectCount: 2,
    ncrId: 'NCR-001', ncrNumber: 'NCR-2025-001',
    status: 'completed',
    notes: 'Failed incoming inspection. NCR raised. Return to supplier.',
    createdBy: 'EMP-003', createdByName: 'Marta Teshome', createdAt: '2025-03-01',
    updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle', updatedAt: '2025-03-02',
  },
  {
    id: 'INSP-004', inspectionNumber: 'INSP-2025-004', type: 'installation',
    productId: 'PRD-003', productName: 'Curtain Wall Panel',
    projectId: 'PRJ-001', projectName: 'Bole Tower Apartments',
    installationId: 'INST-001',
    inspectorId: 'EMP-003', inspectorName: 'Marta Teshome', inspectorDept: 'Quality',
    scheduledDate: '2025-03-05', inspectionDate: '2025-03-05', completedDate: '2025-03-05',
    result: 'pass', score: 95,
    checklistResults: [
      { itemId: 'CL-01', description: 'Alignment with building grid', passed: true },
      { itemId: 'CL-02', description: 'Sealant application', passed: true },
      { itemId: 'CL-03', description: 'Water tightness', passed: true },
      { itemId: 'CL-04', description: 'Glass integrity', passed: true },
    ],
    defects: [], defectCount: 0,
    status: 'verified',
    notes: 'Installation quality approved. Customer signed off.',
    createdBy: 'EMP-003', createdByName: 'Marta Teshome', createdAt: '2025-03-05',
    updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle', updatedAt: '2025-03-05',
  },
  {
    id: 'INSP-005', inspectionNumber: 'INSP-2025-005', type: 'final',
    productId: 'PRD-004', productName: 'Folding Door 4-Panel',
    workOrderId: 'WO-005', workOrderNumber: 'WO-2025-005',
    projectId: 'PRJ-003', projectName: 'Kazanchis Office Tower',
    inspectorId: 'EMP-006', inspectorName: 'Hana Gebremariam', inspectorDept: 'Quality',
    scheduledDate: '2025-03-06', inspectionDate: '2025-03-06',
    result: 'pass', score: 100,
    checklistResults: [
      { itemId: 'CL-01', description: 'Panel alignment', passed: true },
      { itemId: 'CL-02', description: 'Folding mechanism', passed: true },
      { itemId: 'CL-03', description: 'Lock operation', passed: true },
      { itemId: 'CL-04', description: 'Weatherstrip seal', passed: true },
    ],
    defects: [], defectCount: 0,
    status: 'completed',
    notes: 'Perfect score. Ready for delivery.',
    createdBy: 'EMP-006', createdByName: 'Hana Gebremariam', createdAt: '2025-03-06',
    updatedBy: 'EMP-006', updatedByName: 'Hana Gebremariam', updatedAt: '2025-03-06',
  },
  {
    id: 'INSP-006', inspectionNumber: 'INSP-2025-006', type: 'in_process',
    productId: 'PRD-005', productName: 'Fixed Glass Panel',
    workOrderId: 'WO-003', workOrderNumber: 'WO-2025-003',
    inspectorId: 'EMP-003', inspectorName: 'Marta Teshome',
    scheduledDate: '2025-03-07', inspectionDate: '2025-03-07',
    result: 'fail', score: 45,
    checklistResults: [
      { itemId: 'CL-01', description: 'Frame dimensions', passed: false, notes: 'Width off by 5mm' },
      { itemId: 'CL-02', description: 'Glass fitment', passed: false, notes: 'Cannot fit glass due to frame error' },
    ],
    defects: [
      {
        id: 'DEF-004', defectNumber: 'DEF-2025-004',
        inspectionId: 'INSP-006', inspectionNumber: 'INSP-2025-006',
        productName: 'Fixed Glass Panel',
        workOrderId: 'WO-003', workOrderNumber: 'WO-2025-003',
        category: 'dimensional', description: 'Frame width 5mm oversize - cutting error',
        severity: 'major', quantity: 3,
        rootCause: 'Incorrect cutting program', rootCauseCategory: 'process',
        disposition: 'rework', reworkRequired: true,
        costImpact: 3500, timeImpact: 4,
        resolved: false,
        createdAt: '2025-03-07', createdBy: 'EMP-003',
      }
    ],
    defectCount: 1,
    ncrId: 'NCR-002', ncrNumber: 'NCR-2025-002',
    status: 'completed',
    notes: 'Failed - cutting error caused dimensional defect',
    createdBy: 'EMP-003', createdByName: 'Marta Teshome', createdAt: '2025-03-07',
    updatedBy: 'EMP-003', updatedByName: 'Marta Teshome', updatedAt: '2025-03-07',
  },
];

export const sampleNCRs: NCR[] = [
  {
    id: 'NCR-001', ncrNumber: 'NCR-2025-001',
    inspectionId: 'INSP-003', inspectionNumber: 'INSP-2025-003',
    productName: 'Aluminum Profile 6063-T5',
    purchaseOrderId: 'PO-001', purchaseOrderNumber: 'PO-2025-001',
    supplierId: 'SUP-001', supplierName: 'China Zhongwang Holdings',
    title: 'Sub-standard aluminum profiles - wall thickness and oxidation',
    description: 'Incoming inspection revealed wall thickness below spec and surface oxidation on batch from China Zhongwang.',
    reportedDate: '2025-03-01', reportedBy: 'EMP-003', reportedByName: 'Marta Teshome',
    severity: 'critical',
    category: 'material',
    quantityAffected: 200, quantityUnit: 'pcs',
    immediateAction: 'return',
    investigationRequired: true,
    investigationStatus: 'in_progress',
    investigationSummary: 'Supplier notified. Awaiting replacement shipment.',
    rootCause: 'Supplier quality control failure',
    rootCauseCategory: 'material',
    capaRequired: true, capaNumber: 'CAPA-2025-001',
    verificationRequired: true,
    verificationStatus: 'pending',
    costImpact: 70000, timeImpact: 96,
    status: 'investigating',
    notes: 'Supplier has acknowledged the issue and offered replacement.',
    activityLog: [
      { date: '2025-03-01', user: 'EMP-003', userName: 'Marta Teshome', action: 'NCR Created', notes: 'Failed incoming inspection' },
      { date: '2025-03-02', user: 'EMP-001', userName: 'Abebe Tekle', action: 'Supplier Notified' },
      { date: '2025-03-03', user: 'EMP-001', userName: 'Abebe Tekle', action: 'Investigation Started' },
    ],
    createdAt: '2025-03-01', createdBy: 'EMP-003', createdByName: 'Marta Teshome',
    updatedAt: '2025-03-03', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
  },
  {
    id: 'NCR-002', ncrNumber: 'NCR-2025-002',
    inspectionId: 'INSP-006', inspectionNumber: 'INSP-2025-006',
    productName: 'Fixed Glass Panel',
    workOrderId: 'WO-003', workOrderNumber: 'WO-2025-003',
    title: 'Frame cutting error - dimensional defect on fixed glass panels',
    description: 'Cutting program error resulted in frames 5mm oversize, preventing glass installation.',
    reportedDate: '2025-03-07', reportedBy: 'EMP-003', reportedByName: 'Marta Teshome',
    severity: 'major',
    category: 'process',
    quantityAffected: 3, quantityUnit: 'pcs',
    immediateAction: 'rework',
    investigationRequired: true,
    investigationStatus: 'completed',
    investigationSummary: 'Cutting program had incorrect offset value entered by operator.',
    rootCause: 'Operator entered wrong offset in cutting program',
    rootCauseCategory: 'human',
    capaRequired: true, capaNumber: 'CAPA-2025-002',
    preventiveAction: 'Implement double-check procedure for cutting programs',
    verificationRequired: true,
    verificationStatus: 'verified',
    verifiedBy: 'EMP-001', verifiedDate: '2025-03-08',
    costImpact: 3500, timeImpact: 8,
    status: 'corrective_action',
    activityLog: [
      { date: '2025-03-07', user: 'EMP-003', userName: 'Marta Teshome', action: 'NCR Created' },
      { date: '2025-03-07', user: 'EMP-002', userName: 'Dawit Hailu', action: 'Investigation Completed' },
      { date: '2025-03-08', user: 'EMP-001', userName: 'Abebe Tekle', action: 'CAPA Assigned' },
    ],
    createdAt: '2025-03-07', createdBy: 'EMP-003', createdByName: 'Marta Teshome',
    updatedAt: '2025-03-08', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
  },
  {
    id: 'NCR-003', ncrNumber: 'NCR-2025-003',
    customerId: 'CUS-002', customerName: 'Samuel Girma',
    orderId: 'ORD-002', orderNumber: 'ORD-2025-002',
    productName: 'Sliding Window 2-Panel',
    title: 'Customer complaint - sliding mechanism stiff after installation',
    description: 'Customer reported sliding mechanism is stiff and difficult to operate after 2 weeks of installation.',
    reportedDate: '2025-02-20', reportedBy: 'EMP-005', reportedByName: 'Yonas Bekele',
    severity: 'minor',
    category: 'product',
    quantityAffected: 2, quantityUnit: 'pcs',
    immediateAction: 'use_as_is',
    investigationRequired: true,
    investigationStatus: 'completed',
    investigationSummary: 'Track rollers need lubrication. Adjustment of track alignment resolved issue.',
    rootCause: 'Insufficient lubrication during assembly',
    rootCauseCategory: 'process',
    capaRequired: false,
    verificationRequired: false,
    verificationStatus: 'verified',
    verifiedBy: 'EMP-005', verifiedDate: '2025-02-22',
    closureDate: '2025-02-22', closedBy: 'EMP-001',
    costImpact: 800, timeImpact: 3,
    status: 'closed',
    activityLog: [
      { date: '2025-02-20', user: 'EMP-005', userName: 'Yonas Bekele', action: 'NCR Created from complaint' },
      { date: '2025-02-21', user: 'EMP-005', userName: 'Yonas Bekele', action: 'On-site visit and fix' },
      { date: '2025-02-22', user: 'EMP-001', userName: 'Abebe Tekle', action: 'NCR Closed' },
    ],
    createdAt: '2025-02-20', createdBy: 'EMP-005', createdByName: 'Yonas Bekele',
    updatedAt: '2025-02-22', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
  },
];

export const sampleComplaints: CustomerComplaint[] = [
  {
    id: 'CMP-001', complaintNumber: 'CMP-2025-001',
    customerId: 'CUS-002', customerName: 'Samuel Girma',
    orderId: 'ORD-002', orderNumber: 'ORD-2025-002',
    productName: 'Sliding Window 2-Panel',
    date: '2025-02-18', receivedBy: 'Yonas Bekele',
    channel: 'phone',
    subject: 'Stiff sliding mechanism',
    description: 'Customer called to report that sliding windows are difficult to open after 2 weeks.',
    category: 'product_quality', severity: 'medium',
    responseRequired: true, responseDueDate: '2025-02-19', responseSentDate: '2025-02-19',
    response: 'Scheduled site visit for adjustment',
    resolutionStatus: 'closed', resolutionDate: '2025-02-22',
    resolutionNotes: 'Track realigned and lubricated. Customer satisfied.',
    customerSatisfaction: 4,
    ncrId: 'NCR-003', ncrNumber: 'NCR-2025-003',
    createdAt: '2025-02-18', createdBy: 'EMP-005', updatedAt: '2025-02-22',
  },
  {
    id: 'CMP-002', complaintNumber: 'CMP-2025-002',
    customerId: 'CUS-003', customerName: 'Tigist Alemayehu',
    productName: 'Casement Window',
    date: '2025-03-02', receivedBy: 'Abebe Tekle',
    channel: 'email',
    subject: 'Scratched frame finish',
    description: 'Customer noticed scratches on frame finish of 3 casement windows during delivery.',
    category: 'delivery', severity: 'low',
    responseRequired: true, responseDueDate: '2025-03-03', responseSentDate: '2025-03-03',
    response: 'Apologized and scheduled touch-up visit.',
    resolutionStatus: 'resolved', resolutionDate: '2025-03-05',
    resolutionNotes: 'Touch-up paint applied on-site. No replacement needed.',
    customerSatisfaction: 3,
    createdAt: '2025-03-02', createdBy: 'EMP-001', updatedAt: '2025-03-05',
  },
];
