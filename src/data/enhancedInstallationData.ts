// ══════════════════════════════════════════
// ENHANCED INSTALLATION DATA MODEL & SAMPLE DATA
// ══════════════════════════════════════════

export type InstallationStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'delayed' | 'cancelled' | 'rescheduled' | 'partial';
export type InstallationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type IssueSeverity = 'minor' | 'major' | 'critical' | 'blocker';

export interface TeamMember {
  employeeId: string;
  name: string;
  nameAm?: string;
  role: 'lead' | 'technician' | 'helper' | 'electrician';
  phone?: string;
  skills?: string[];
  hourlyRate?: number;
}

export interface InstallationItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  installedQuantity: number;
  remainingQuantity: number;
  workOrderId?: string;
  orderItemId?: string;
  location?: string;
  notes?: string;
  isInstalled: boolean;
  installedAt?: string;
  installedBy?: string;
  issues?: InstallationIssue[];
}

export interface InstallationIssue {
  id: string;
  reportedAt: string;
  reportedBy: string;
  reportedByName: string;
  category: 'product_defect' | 'measurement' | 'damage' | 'missing_parts' | 'site_issue' | 'other';
  description: string;
  severity: IssueSeverity;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  requiresRework: boolean;
  reworkOrderId?: string;
}

export interface InstallationPhoto {
  id: string;
  url: string;
  caption?: string;
  category: 'before' | 'during' | 'after' | 'issue' | 'completion';
  uploadedAt: string;
  uploadedBy: string;
  uploadedByName: string;
  location?: string;
}

export interface EnhancedInstallation {
  id: string;
  installationNumber: string;

  // Links
  projectId?: string;
  projectName?: string;
  orderId?: string;
  orderNumber?: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  customerContact?: string;
  customerPhone?: string;
  customerEmail?: string;
  quoteId?: string;

  // Location
  siteAddress: string;
  siteCity?: string;
  siteSubCity?: string;
  siteContactPerson?: string;
  siteContactPhone?: string;
  accessInstructions?: string;

  // Items
  items: InstallationItem[];

  // Schedule
  scheduledDate: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  estimatedDuration: number;
  actualStartDate?: string;
  actualEndDate?: string;

  // Status
  status: InstallationStatus;
  priority: InstallationPriority;

  // Team
  teamLead: string;
  teamLeadId: string;
  teamMembers: TeamMember[];
  teamSize: number;
  assignedVehicle?: string;

  // Completion
  completionNotes?: string;
  customerSignature?: string;
  completionPhotos: InstallationPhoto[];
  completedBy?: string;
  completedAt?: string;

  // Issues
  issues: InstallationIssue[];
  hasIssues: boolean;
  issueCount: number;

  // Delays
  weatherDelay?: boolean;
  siteAccessDelay?: boolean;
  materialDelay?: boolean;
  delayReasons?: string[];
  delayHours?: number;

  // Customer feedback
  customerRating?: number;
  customerFeedback?: string;

  // Flags
  isOverdue: boolean;
  isToday: boolean;
  requiresFollowUp: boolean;

  // Notes
  notes?: string;
  notesAm?: string;
  internalNotes?: string;

  // Activity
  activityLog: {
    date: string;
    user: string;
    userName: string;
    action: string;
    notes?: string;
  }[];

  // Audit
  createdAt: string;
  createdBy: string;
  createdByName: string;
  updatedAt: string;
  updatedBy: string;
  updatedByName: string;
}

export interface InstallationStats {
  totalInstallations: number;
  scheduledInstallations: number;
  inProgressInstallations: number;
  completedInstallations: number;
  delayedInstallations: number;
  todayInstallations: number;
  thisWeekInstallations: number;
  thisMonthInstallations: number;
  installationsWithIssues: number;
  totalIssues: number;
  unresolvedIssues: number;
  averageCompletionTime: number;
  onTimeRate: number;
  customerSatisfaction: number;
  urgentInstallations: number;
  highPriorityInstallations: number;
  byStatus: Record<InstallationStatus, number>;
  upcomingWeek: number;
}

// Helper functions
export const getStatusColor = (status: InstallationStatus): string => {
  switch (status) {
    case 'scheduled': return 'bg-info/10 text-info';
    case 'confirmed': return 'bg-primary/10 text-primary';
    case 'in_progress': return 'bg-warning/10 text-warning';
    case 'completed': return 'bg-success/10 text-success';
    case 'delayed': return 'bg-orange-500/10 text-orange-500';
    case 'cancelled': return 'bg-destructive/10 text-destructive';
    case 'rescheduled': return 'bg-purple-500/10 text-purple-500';
    case 'partial': return 'bg-amber-500/10 text-amber-500';
  }
};

export const getStatusLabel = (status: InstallationStatus): string => {
  switch (status) {
    case 'scheduled': return 'Scheduled';
    case 'confirmed': return 'Confirmed';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'delayed': return 'Delayed';
    case 'cancelled': return 'Cancelled';
    case 'rescheduled': return 'Rescheduled';
    case 'partial': return 'Partial';
  }
};

export const getPriorityColor = (priority: InstallationPriority): string => {
  switch (priority) {
    case 'urgent': return 'bg-destructive/10 text-destructive';
    case 'high': return 'bg-orange-500/10 text-orange-500';
    case 'medium': return 'bg-warning/10 text-warning';
    case 'low': return 'bg-muted text-muted-foreground';
  }
};

export const getSeverityColor = (severity: IssueSeverity): string => {
  switch (severity) {
    case 'blocker': return 'bg-destructive/10 text-destructive';
    case 'critical': return 'bg-orange-500/10 text-orange-500';
    case 'major': return 'bg-warning/10 text-warning';
    case 'minor': return 'bg-info/10 text-info';
  }
};

export const formatETB = (amount: number): string => {
  if (amount >= 1000000) return `ETB ${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `ETB ${(amount / 1000).toFixed(0)}K`;
  return `ETB ${amount.toLocaleString()}`;
};

export const isOverdue = (date: string): boolean => new Date(date) < new Date(new Date().toDateString());
export const isToday = (date: string): boolean => date === new Date().toISOString().split('T')[0];
export const daysUntil = (date: string): number => Math.ceil((new Date(date).getTime() - new Date().getTime()) / 86400000);

export function calculateInstallationStats(installations: EnhancedInstallation[]): InstallationStats {
  const today = new Date().toISOString().split('T')[0];
  const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const monthStart = today.slice(0, 7);

  const byStatus: Record<InstallationStatus, number> = {
    scheduled: 0, confirmed: 0, in_progress: 0, completed: 0,
    delayed: 0, cancelled: 0, rescheduled: 0, partial: 0,
  };
  installations.forEach(i => byStatus[i.status]++);

  const completed = installations.filter(i => i.status === 'completed');
  const withRatings = completed.filter(i => i.customerRating);
  const avgRating = withRatings.length > 0
    ? withRatings.reduce((s, i) => s + (i.customerRating || 0), 0) / withRatings.length
    : 0;

  return {
    totalInstallations: installations.length,
    scheduledInstallations: byStatus.scheduled + byStatus.confirmed,
    inProgressInstallations: byStatus.in_progress,
    completedInstallations: byStatus.completed,
    delayedInstallations: byStatus.delayed,
    todayInstallations: installations.filter(i => i.scheduledDate === today).length,
    thisWeekInstallations: installations.filter(i => i.scheduledDate >= today && i.scheduledDate <= weekFromNow).length,
    thisMonthInstallations: installations.filter(i => i.scheduledDate.startsWith(monthStart)).length,
    installationsWithIssues: installations.filter(i => i.hasIssues).length,
    totalIssues: installations.reduce((s, i) => s + i.issueCount, 0),
    unresolvedIssues: installations.reduce((s, i) => s + i.issues.filter(is => !is.resolved).length, 0),
    averageCompletionTime: completed.length > 0 ? completed.reduce((s, i) => s + i.estimatedDuration, 0) / completed.length : 0,
    onTimeRate: completed.length > 0 ? Math.round((completed.filter(i => !i.isOverdue).length / completed.length) * 100) : 0,
    customerSatisfaction: Number(avgRating.toFixed(1)),
    urgentInstallations: installations.filter(i => i.priority === 'urgent').length,
    highPriorityInstallations: installations.filter(i => i.priority === 'high').length,
    byStatus,
    upcomingWeek: installations.filter(i => i.scheduledDate >= today && i.scheduledDate <= weekFromNow && i.status !== 'completed' && i.status !== 'cancelled').length,
  };
}

// ═══ SAMPLE DATA ═══
export const sampleEnhancedInstallations: EnhancedInstallation[] = [
  {
    id: 'INST-001',
    installationNumber: 'INST-001',
    projectId: 'PJ-003',
    projectName: 'Megenagna Office Complex',
    orderId: 'ORD-003',
    orderNumber: 'ORD-003',
    customerId: 'CUS-003',
    customerName: 'Ethio Engineering',
    customerCode: 'CUST-0003',
    customerContact: 'W/ro Tigist Haile',
    customerPhone: '+251-913-456789',
    customerEmail: 'tigist@ethioeng.com',
    siteAddress: 'Megenagna, Addis Ababa',
    siteCity: 'Addis Ababa',
    siteSubCity: 'Yeka',
    siteContactPerson: 'Ato Biniam',
    siteContactPhone: '+251-912-111222',
    accessInstructions: 'Enter from main gate, check with security. Floors 5-8 via service elevator.',
    items: [
      { id: 'II-001', productId: 'PRD-005', productName: 'Curtain Wall System', productCode: 'CW-6060-C1', quantity: 12, installedQuantity: 8, remainingQuantity: 4, workOrderId: 'WO-003', isInstalled: false, location: 'Floors 5-8, North facade', installedBy: 'Dawit Hailu' },
      { id: 'II-002', productId: 'PRD-001', productName: 'Sliding Window 2-Panel', productCode: 'SW-6063-2P', quantity: 24, installedQuantity: 24, remainingQuantity: 0, workOrderId: 'WO-001', isInstalled: true, location: 'Floors 5-8, All offices', installedAt: '2025-02-25', installedBy: 'Dawit Hailu' },
    ],
    scheduledDate: '2025-02-28',
    scheduledStartTime: '08:00',
    scheduledEndTime: '17:00',
    estimatedDuration: 16,
    actualStartDate: '2025-02-28',
    status: 'in_progress',
    priority: 'high',
    teamLead: 'Dawit Hailu',
    teamLeadId: 'EMP-005',
    teamMembers: [
      { employeeId: 'EMP-005', name: 'Dawit Hailu', nameAm: 'ዳዊት ኃይሉ', role: 'lead', phone: '+251-915-555555', skills: ['curtain_wall', 'windows', 'doors'], hourlyRate: 125 },
      { employeeId: 'EMP-010', name: 'Tesfaye Abera', nameAm: 'ተስፋዬ አበራ', role: 'technician', phone: '+251-917-888888', skills: ['windows', 'glazing'], hourlyRate: 100 },
      { employeeId: 'EMP-011', name: 'Mulugeta Kassa', nameAm: 'ሙሉጌታ ካሳ', role: 'helper', phone: '+251-918-999999', hourlyRate: 75 },
    ],
    teamSize: 3,
    assignedVehicle: 'Vehicle 01 - Toyota Hilux',
    completionPhotos: [],
    issues: [
      { id: 'ISS-001', reportedAt: '2025-03-01', reportedBy: 'EMP-005', reportedByName: 'Dawit Hailu', category: 'measurement', description: 'Floor 7 window opening 15mm wider than specification', severity: 'major', resolved: false, requiresRework: false },
    ],
    hasIssues: true,
    issueCount: 1,
    isOverdue: false,
    isToday: false,
    requiresFollowUp: true,
    notes: 'Curtain wall floors 5-8 ongoing. Windows completed.',
    notesAm: 'ከርተን ወል ወለል 5-8 በሂደት ላይ። መስኮቶች ተጠናቅቀዋል።',
    internalNotes: 'Customer requested extra sealant around floor 6 windows.',
    activityLog: [
      { date: '2025-02-28', user: 'EMP-005', userName: 'Dawit Hailu', action: 'Started installation', notes: 'Team arrived at 8:00 AM' },
      { date: '2025-02-25', user: 'EMP-005', userName: 'Dawit Hailu', action: 'Windows installed (24 units)' },
      { date: '2025-03-01', user: 'EMP-005', userName: 'Dawit Hailu', action: 'Issue reported: measurement discrepancy floor 7' },
    ],
    createdAt: '2025-02-20', createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
    updatedAt: '2025-03-01', updatedBy: 'EMP-005', updatedByName: 'Dawit Hailu',
  },
  {
    id: 'INST-002',
    installationNumber: 'INST-002',
    projectId: 'PJ-005',
    projectName: 'CMC Residential Block',
    orderId: 'ORD-005',
    orderNumber: 'ORD-005',
    customerId: 'CUS-005',
    customerName: 'Noah Construction',
    customerCode: 'CUST-0005',
    customerContact: 'Ato Noah Gebremedhin',
    customerPhone: '+251-915-678901',
    siteAddress: 'CMC, Addis Ababa',
    siteCity: 'Addis Ababa',
    siteSubCity: 'Yeka',
    siteContactPerson: 'Site Manager Hailu',
    siteContactPhone: '+251-919-333444',
    accessInstructions: 'Construction site. Wear PPE. Report to site office first.',
    items: [
      { id: 'II-003', productId: 'PRD-001', productName: 'Sliding Window 2-Panel', productCode: 'SW-6063-2P', quantity: 36, installedQuantity: 0, remainingQuantity: 36, isInstalled: false, location: 'Block A, Floors 1-3' },
      { id: 'II-004', productId: 'PRD-004', productName: 'Sliding Door 3-Panel', productCode: 'SD-6063-3P', quantity: 6, installedQuantity: 0, remainingQuantity: 6, isInstalled: false, location: 'Block A, Ground floor entrances' },
    ],
    scheduledDate: '2025-03-10',
    scheduledStartTime: '07:30',
    scheduledEndTime: '17:00',
    estimatedDuration: 24,
    status: 'scheduled',
    priority: 'medium',
    teamLead: 'Dawit Hailu',
    teamLeadId: 'EMP-005',
    teamMembers: [
      { employeeId: 'EMP-005', name: 'Dawit Hailu', nameAm: 'ዳዊት ኃይሉ', role: 'lead', phone: '+251-915-555555', hourlyRate: 125 },
      { employeeId: 'EMP-010', name: 'Tesfaye Abera', role: 'technician', hourlyRate: 100 },
      { employeeId: 'EMP-011', name: 'Mulugeta Kassa', role: 'helper', hourlyRate: 75 },
      { employeeId: 'EMP-012', name: 'Abel Tadesse', role: 'helper', hourlyRate: 75 },
    ],
    teamSize: 4,
    assignedVehicle: 'Vehicle 02 - Isuzu NQR',
    completionPhotos: [],
    issues: [],
    hasIssues: false,
    issueCount: 0,
    isOverdue: false,
    isToday: false,
    requiresFollowUp: false,
    notes: 'Windows Block A, floors 1-3. Doors ground floor.',
    notesAm: 'መስኮቶች ብሎክ ሀ ወለል 1-3። በሮች ፎቅ።',
    activityLog: [
      { date: '2025-03-05', user: 'EMP-001', userName: 'Abebe Tekle', action: 'Installation scheduled' },
      { date: '2025-03-06', user: 'EMP-001', userName: 'Abebe Tekle', action: 'Team assigned' },
    ],
    createdAt: '2025-03-05', createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
    updatedAt: '2025-03-06', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
  },
  {
    id: 'INST-003',
    installationNumber: 'INST-003',
    projectId: 'PJ-001',
    projectName: 'Bole Apartments Tower A',
    orderId: 'ORD-001',
    orderNumber: 'ORD-001',
    customerId: 'CUS-001',
    customerName: 'Ayat Real Estate',
    customerCode: 'CUST-0001',
    customerContact: 'Ato Yonas Bekele',
    customerPhone: '+251-911-234567',
    customerEmail: 'yonas@ayatre.com',
    siteAddress: 'Bole, Addis Ababa',
    siteCity: 'Addis Ababa',
    siteSubCity: 'Bole',
    siteContactPerson: 'Ato Yonas',
    siteContactPhone: '+251-911-234567',
    items: [
      { id: 'II-005', productId: 'PRD-001', productName: 'Sliding Window 2-Panel', productCode: 'SW-6063-2P', quantity: 48, installedQuantity: 48, remainingQuantity: 0, workOrderId: 'WO-001', isInstalled: true, installedAt: '2025-02-15', installedBy: 'Dawit Hailu', location: 'All floors' },
      { id: 'II-006', productId: 'PRD-004', productName: 'Sliding Door 3-Panel', productCode: 'SD-6063-3P', quantity: 12, installedQuantity: 12, remainingQuantity: 0, workOrderId: 'WO-002', isInstalled: true, installedAt: '2025-02-18', installedBy: 'Dawit Hailu', location: 'Balconies' },
    ],
    scheduledDate: '2025-02-10',
    estimatedDuration: 40,
    actualStartDate: '2025-02-10',
    actualEndDate: '2025-02-20',
    status: 'completed',
    priority: 'high',
    teamLead: 'Dawit Hailu',
    teamLeadId: 'EMP-005',
    teamMembers: [
      { employeeId: 'EMP-005', name: 'Dawit Hailu', role: 'lead', hourlyRate: 125 },
      { employeeId: 'EMP-010', name: 'Tesfaye Abera', role: 'technician', hourlyRate: 100 },
      { employeeId: 'EMP-011', name: 'Mulugeta Kassa', role: 'helper', hourlyRate: 75 },
    ],
    teamSize: 3,
    completedBy: 'Dawit Hailu',
    completedAt: '2025-02-20',
    completionNotes: 'All 60 items installed. Customer satisfied.',
    completionPhotos: [],
    customerRating: 5,
    customerFeedback: 'Excellent work. Very professional team.',
    issues: [],
    hasIssues: false,
    issueCount: 0,
    isOverdue: false,
    isToday: false,
    requiresFollowUp: false,
    notes: 'Bole Tower A - all windows and doors',
    notesAm: 'ቦሌ ታወር ሀ - ሁሉም መስኮቶች እና በሮች',
    activityLog: [
      { date: '2025-02-10', user: 'EMP-005', userName: 'Dawit Hailu', action: 'Started installation' },
      { date: '2025-02-15', user: 'EMP-005', userName: 'Dawit Hailu', action: '48 windows installed' },
      { date: '2025-02-18', user: 'EMP-005', userName: 'Dawit Hailu', action: '12 doors installed' },
      { date: '2025-02-20', user: 'EMP-005', userName: 'Dawit Hailu', action: 'Installation completed' },
    ],
    createdAt: '2025-02-05', createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
    updatedAt: '2025-02-20', updatedBy: 'EMP-005', updatedByName: 'Dawit Hailu',
  },
  {
    id: 'INST-004',
    installationNumber: 'INST-004',
    projectId: 'PJ-004',
    projectName: 'Sarbet Hotel Renovation',
    orderId: 'ORD-004',
    orderNumber: 'ORD-004',
    customerId: 'CUS-004',
    customerName: 'Getahun Hotels PLC',
    customerCode: 'CUST-0004',
    customerContact: 'Ato Getahun',
    customerPhone: '+251-914-567890',
    siteAddress: 'Sarbet, Addis Ababa',
    siteCity: 'Addis Ababa',
    siteSubCity: 'Nifas Silk-Lafto',
    siteContactPerson: 'Hotel Manager',
    siteContactPhone: '+251-914-567890',
    accessInstructions: 'Use service entrance. Installation after 10 PM only.',
    items: [
      { id: 'II-007', productId: 'PRD-003', productName: 'Fixed Window Large', productCode: 'FW-6063-L', quantity: 20, installedQuantity: 0, remainingQuantity: 20, isInstalled: false, location: 'Lobby and restaurant' },
    ],
    scheduledDate: '2025-03-20',
    scheduledStartTime: '22:00',
    scheduledEndTime: '06:00',
    estimatedDuration: 16,
    status: 'confirmed',
    priority: 'urgent',
    teamLead: 'Dawit Hailu',
    teamLeadId: 'EMP-005',
    teamMembers: [
      { employeeId: 'EMP-005', name: 'Dawit Hailu', role: 'lead', hourlyRate: 125 },
      { employeeId: 'EMP-010', name: 'Tesfaye Abera', role: 'technician', hourlyRate: 100 },
    ],
    teamSize: 2,
    completionPhotos: [],
    issues: [],
    hasIssues: false,
    issueCount: 0,
    isOverdue: false,
    isToday: false,
    requiresFollowUp: false,
    notes: 'Night installation - hotel operational. Fixed windows for lobby.',
    notesAm: 'የሌሊት ማስገጠም - ሆቴል ሥራ ላይ። ቋሚ መስኮቶች ለሎቢ።',
    activityLog: [
      { date: '2025-03-08', user: 'EMP-001', userName: 'Abebe Tekle', action: 'Installation confirmed with customer' },
    ],
    createdAt: '2025-03-05', createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
    updatedAt: '2025-03-08', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
  },
  {
    id: 'INST-005',
    installationNumber: 'INST-005',
    projectId: 'PJ-002',
    projectName: 'Villa Sunshine Residence',
    orderId: 'ORD-002',
    orderNumber: 'ORD-002',
    customerId: 'CUS-002',
    customerName: 'Ato Kebede Alemu',
    customerCode: 'CUST-0002',
    customerContact: 'Kebede Alemu',
    customerPhone: '+251-912-345678',
    siteAddress: 'CMC, Addis Ababa',
    siteCity: 'Addis Ababa',
    siteSubCity: 'Yeka',
    items: [
      { id: 'II-008', productId: 'PRD-002', productName: 'Casement Window Single', productCode: 'CW-6063-1P', quantity: 8, installedQuantity: 5, remainingQuantity: 3, isInstalled: false, location: 'Bedrooms', issues: [
        { id: 'ISS-002', reportedAt: '2025-02-26', reportedBy: 'EMP-005', reportedByName: 'Dawit Hailu', category: 'missing_parts', description: 'Handle hardware missing for 3 windows', severity: 'major', resolved: true, resolvedAt: '2025-02-27', resolvedBy: 'Yosef Bekele', resolution: 'Parts delivered from warehouse', requiresRework: false },
      ] },
      { id: 'II-009', productId: 'PRD-006', productName: 'Aluminum Handrail', productCode: 'HR-6063-S', quantity: 4, installedQuantity: 0, remainingQuantity: 4, isInstalled: false, location: 'Balcony and staircase' },
    ],
    scheduledDate: '2025-02-25',
    estimatedDuration: 12,
    actualStartDate: '2025-02-25',
    status: 'delayed',
    priority: 'medium',
    teamLead: 'Dawit Hailu',
    teamLeadId: 'EMP-005',
    teamMembers: [
      { employeeId: 'EMP-005', name: 'Dawit Hailu', role: 'lead', hourlyRate: 125 },
      { employeeId: 'EMP-011', name: 'Mulugeta Kassa', role: 'helper', hourlyRate: 75 },
    ],
    teamSize: 2,
    materialDelay: true,
    delayReasons: ['Missing hardware parts for 3 windows', 'Handrail brackets delayed from supplier'],
    delayHours: 16,
    completionPhotos: [],
    issues: [
      { id: 'ISS-002', reportedAt: '2025-02-26', reportedBy: 'EMP-005', reportedByName: 'Dawit Hailu', category: 'missing_parts', description: 'Handle hardware missing for 3 windows', severity: 'major', resolved: true, resolvedAt: '2025-02-27', resolvedBy: 'Yosef Bekele', resolution: 'Parts delivered from warehouse', requiresRework: false },
    ],
    hasIssues: true,
    issueCount: 1,
    isOverdue: true,
    isToday: false,
    requiresFollowUp: true,
    notes: 'Villa Sunshine - casement windows and handrails',
    notesAm: 'ቪላ ሳንሻይን - ካሴመንት መስኮቶች እና ሃንድሬይል',
    activityLog: [
      { date: '2025-02-25', user: 'EMP-005', userName: 'Dawit Hailu', action: 'Started installation' },
      { date: '2025-02-25', user: 'EMP-005', userName: 'Dawit Hailu', action: '5 casement windows installed' },
      { date: '2025-02-26', user: 'EMP-005', userName: 'Dawit Hailu', action: 'Issue: missing hardware parts' },
      { date: '2025-02-27', user: 'EMP-003', userName: 'Yosef Bekele', action: 'Parts delivered' },
    ],
    createdAt: '2025-02-20', createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
    updatedAt: '2025-02-27', updatedBy: 'EMP-005', updatedByName: 'Dawit Hailu',
  },
  {
    id: 'INST-006',
    installationNumber: 'INST-006',
    projectId: 'PJ-003',
    projectName: 'Megenagna Office Complex',
    customerId: 'CUS-003',
    customerName: 'Ethio Engineering',
    customerCode: 'CUST-0003',
    customerPhone: '+251-913-456789',
    siteAddress: 'Megenagna, Addis Ababa',
    siteCity: 'Addis Ababa',
    siteSubCity: 'Yeka',
    items: [
      { id: 'II-010', productId: 'PRD-004', productName: 'Sliding Door 3-Panel', productCode: 'SD-6063-3P', quantity: 8, installedQuantity: 0, remainingQuantity: 8, isInstalled: false, location: 'Office entrances floors 1-4' },
    ],
    scheduledDate: '2025-03-15',
    estimatedDuration: 12,
    status: 'scheduled',
    priority: 'medium',
    teamLead: 'Dawit Hailu',
    teamLeadId: 'EMP-005',
    teamMembers: [
      { employeeId: 'EMP-005', name: 'Dawit Hailu', role: 'lead', hourlyRate: 125 },
      { employeeId: 'EMP-010', name: 'Tesfaye Abera', role: 'technician', hourlyRate: 100 },
    ],
    teamSize: 2,
    completionPhotos: [],
    issues: [],
    hasIssues: false,
    issueCount: 0,
    isOverdue: false,
    isToday: false,
    requiresFollowUp: false,
    notes: 'Office entrance sliding doors',
    notesAm: 'የቢሮ መግቢያ ስላይዲንግ በሮች',
    activityLog: [
      { date: '2025-03-07', user: 'EMP-001', userName: 'Abebe Tekle', action: 'Installation scheduled' },
    ],
    createdAt: '2025-03-07', createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
    updatedAt: '2025-03-07', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
  },
];
