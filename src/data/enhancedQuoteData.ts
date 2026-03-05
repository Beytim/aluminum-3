// ══════════════════════════════════════════
// ENHANCED QUOTE DATA MODEL & SAMPLE DATA
// ══════════════════════════════════════════

export type QuoteStatus = 'Draft' | 'Pending' | 'Accepted' | 'Rejected' | 'Expired' | 'Converted';

export interface QuoteItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  productNameAm?: string;
  category: string;
  quantity: number;
  unit: 'pcs' | 'sqm' | 'meter' | 'set';
  width?: number;
  height?: number;
  profile?: string;
  glass?: string;
  color?: string;
  materialCost: number;
  glassCost: number;
  hardwareCost: number;
  accessoriesCost: number;
  fabricationLabor: number;
  installationLabor: number;
  totalCostPerUnit: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  netPrice: number;
  lineTotal: number;
  lineCost: number;
  lineProfit: number;
  lineMargin: number;
  notes?: string;
  isOptional?: boolean;
}

export interface QuoteVersionEntry {
  version: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  changes: string;
  total: number;
  status: QuoteStatus;
}

export interface QuoteActivityEntry {
  date: string;
  user: string;
  userName: string;
  action: 'created' | 'updated' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'converted';
  notes?: string;
}

export interface EnhancedQuote {
  id: string;
  quoteNumber: string;
  version: string;
  versionHistory: QuoteVersionEntry[];
  customerId: string;
  customerName: string;
  customerCode: string;
  customerContact?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerSnapshot: {
    healthScore: number;
    outstandingBalance: number;
    creditLimit: number;
    paymentTerms: string;
  };
  projectId?: string;
  projectName: string;
  projectStatus?: string;
  title: string;
  description?: string;
  items: QuoteItem[];
  subtotal: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountAmount: number;
  taxableAmount: number;
  installationCost: number;
  transportCost: number;
  cuttingFee: number;
  finishUpcharge: number;
  rushFee: number;
  otherFees: number;
  feesDescription?: string;
  taxRate: number;
  taxAmount: number;
  total: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  quoteDate: string;
  expiryDate: string;
  validityDays: number;
  convertedDate?: string;
  status: QuoteStatus;
  paymentTerms: string;
  deliveryTerms?: string;
  warranty?: string;
  finishType?: 'Mill Finish' | 'Anodized' | 'Powder Coated' | 'Polished';
  notes?: string;
  termsAndConditions?: string;
  internalNotes?: string;
  activityLog: QuoteActivityEntry[];
  isExpired: boolean;
  isConverted: boolean;
  currency: 'ETB';
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedBy: string;
  updatedByName: string;
  updatedAt: string;
}

export interface QuoteStats {
  totalQuotes: number;
  draftQuotes: number;
  pendingQuotes: number;
  acceptedQuotes: number;
  rejectedQuotes: number;
  expiredQuotes: number;
  convertedQuotes: number;
  totalValue: number;
  pendingValue: number;
  acceptedValue: number;
  averageValue: number;
  conversionRate: number;
  averageMargin: number;
  expiringThisWeek: number;
  expiringThisMonth: number;
  byStatus: Record<string, number>;
}

// ═══ HELPERS ═══

export function calculateQuoteStats(quotes: EnhancedQuote[]): QuoteStats {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const byStatus: Record<string, number> = {};
  quotes.forEach(q => { byStatus[q.status] = (byStatus[q.status] || 0) + 1; });

  const pending = quotes.filter(q => q.status === 'Pending');
  const accepted = quotes.filter(q => q.status === 'Accepted' || q.status === 'Converted');
  const total = quotes.length;

  return {
    totalQuotes: total,
    draftQuotes: byStatus['Draft'] || 0,
    pendingQuotes: byStatus['Pending'] || 0,
    acceptedQuotes: byStatus['Accepted'] || 0,
    rejectedQuotes: byStatus['Rejected'] || 0,
    expiredQuotes: byStatus['Expired'] || 0,
    convertedQuotes: byStatus['Converted'] || 0,
    totalValue: quotes.reduce((s, q) => s + q.total, 0),
    pendingValue: pending.reduce((s, q) => s + q.total, 0),
    acceptedValue: accepted.reduce((s, q) => s + q.total, 0),
    averageValue: total > 0 ? quotes.reduce((s, q) => s + q.total, 0) / total : 0,
    conversionRate: total > 0 ? (accepted.length / total) * 100 : 0,
    averageMargin: total > 0 ? quotes.reduce((s, q) => s + q.profitMargin, 0) / total : 0,
    expiringThisWeek: quotes.filter(q => q.status === 'Pending' && new Date(q.expiryDate) <= weekFromNow && new Date(q.expiryDate) >= now).length,
    expiringThisMonth: quotes.filter(q => q.status === 'Pending' && new Date(q.expiryDate) <= monthFromNow && new Date(q.expiryDate) >= now).length,
    byStatus,
  };
}

export function formatETB(amount: number): string {
  return `ETB ${amount.toLocaleString()}`;
}

export function formatETBCompact(value: number): string {
  if (value >= 1000000) return `ETB ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `ETB ${(value / 1000).toFixed(0)}K`;
  return `ETB ${value.toLocaleString()}`;
}

export function daysUntilExpiry(expiryDate: string): number {
  return Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function getQuoteStatusColor(status: QuoteStatus): string {
  const colors: Record<QuoteStatus, string> = {
    'Draft': 'bg-muted text-muted-foreground',
    'Pending': 'bg-warning/10 text-warning',
    'Accepted': 'bg-success/10 text-success',
    'Rejected': 'bg-destructive/10 text-destructive',
    'Expired': 'bg-muted text-muted-foreground',
    'Converted': 'bg-primary/10 text-primary',
  };
  return colors[status] || 'bg-muted text-muted-foreground';
}

export function generateQuoteNumber(existingCount: number): string {
  return `QT-${String(existingCount + 1).padStart(3, '0')}`;
}

function makeItem(id: string, productId: string, code: string, name: string, nameAm: string, category: string, qty: number, unit: 'pcs' | 'sqm' | 'meter' | 'set', matCost: number, glassCost: number, hwCost: number, accCost: number, fabLabor: number, instLabor: number, sellPrice: number, discPct: number, profile?: string, glass?: string, color?: string): QuoteItem {
  const totalCostPerUnit = matCost + glassCost + hwCost + accCost + fabLabor + instLabor;
  const discountAmount = Math.round(sellPrice * discPct / 100);
  const netPrice = sellPrice - discountAmount;
  const lineTotal = netPrice * qty;
  const lineCost = totalCostPerUnit * qty;
  return {
    id, productId, productCode: code, productName: name, productNameAm: nameAm, category, quantity: qty, unit,
    profile, glass, color,
    materialCost: matCost, glassCost, hardwareCost: hwCost, accessoriesCost: accCost,
    fabricationLabor: fabLabor, installationLabor: instLabor, totalCostPerUnit,
    unitPrice: sellPrice, discountPercent: discPct, discountAmount, netPrice,
    lineTotal, lineCost, lineProfit: lineTotal - lineCost, lineMargin: lineTotal > 0 ? Math.round(((lineTotal - lineCost) / lineTotal) * 100) : 0,
  };
}

// ═══ SAMPLE DATA - 15 quotes linked to existing customers/products/projects ═══
export const enhancedSampleQuotes: EnhancedQuote[] = [
  // QT-001: Getahun Hotels - Sarbet Hotel (linked to PJ-004)
  (() => {
    const items = [
      makeItem('qi-001', 'PRD-001', 'SW-6063-S1', 'Sliding Window 2-Panel', 'ተንሸራታች መስኮት 2-ፓነል', 'Windows', 8, 'pcs', 4500, 1200, 800, 300, 2000, 1500, 14000, 5, '6063-T5', '6mm Clear Tempered', 'Bronze'),
      makeItem('qi-002', 'PRD-005', 'HD-6063-D2', 'Hinged Door Double', 'የሚከፈት በር ድርብ', 'Doors', 4, 'pcs', 4500, 2500, 1500, 0, 1000, 800, 15200, 0, '6063-T6', '8mm Frosted Tempered', 'Bronze'),
    ];
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const installationCost = 45000;
    const transportCost = 15000;
    const cuttingFee = 2400;
    const finishUpcharge = 42000;
    const discountAmount = 0;
    const taxableAmount = subtotal - discountAmount;
    const fees = installationCost + transportCost + cuttingFee + finishUpcharge;
    const taxAmount = Math.round((taxableAmount + fees) * 0.15);
    const total = taxableAmount + fees + taxAmount;
    const totalCost = items.reduce((s, i) => s + i.lineCost, 0);
    return {
      id: 'QT-001', quoteNumber: 'QT-001', version: 'v1',
      versionHistory: [{ version: 'v1', createdAt: '2025-02-20', createdBy: 'EMP-002', createdByName: 'Hana Mulugeta', changes: 'Initial quote', total, status: 'Pending' as QuoteStatus }],
      customerId: 'CUS-004', customerName: 'Getahun Hotels PLC', customerCode: 'CUST-0004', customerContact: 'W/ro Meron Getahun', customerEmail: 'meron@getahunhotels.com', customerPhone: '+251-914-567890',
      customerSnapshot: { healthScore: 52, outstandingBalance: 450000, creditLimit: 1000000, paymentTerms: 'Net 30' },
      projectId: 'PJ-004', projectName: 'Sarbet Hotel Renovation', projectStatus: 'Quote',
      title: 'Sarbet Hotel Renovation - Windows & Doors', items, subtotal, discountAmount, discountType: undefined, discountValue: undefined,
      taxableAmount, installationCost, transportCost, cuttingFee, finishUpcharge, rushFee: 0, otherFees: 0,
      taxRate: 15, taxAmount, total, totalCost, totalProfit: total - totalCost, profitMargin: Math.round(((total - totalCost) / total) * 100),
      quoteDate: '2025-02-20', expiryDate: '2025-03-22', validityDays: 30,
      status: 'Pending' as QuoteStatus, paymentTerms: '50% deposit, 50% on delivery', warranty: '5 years on frame, 2 years on hardware',
      finishType: 'Anodized' as const,
      activityLog: [{ date: '2025-02-20', user: 'EMP-002', userName: 'Hana Mulugeta', action: 'created' as const, notes: 'Initial quote created' }],
      isExpired: false, isConverted: false, currency: 'ETB' as const,
      createdBy: 'EMP-002', createdByName: 'Hana Mulugeta', createdAt: '2025-02-20',
      updatedBy: 'EMP-002', updatedByName: 'Hana Mulugeta', updatedAt: '2025-02-20',
    };
  })(),

  // QT-002: Ayat Real Estate - Bole Tower B (linked to PJ-001)
  (() => {
    const items = [
      makeItem('qi-003', 'PRD-001', 'SW-6063-S1', 'Sliding Window 2-Panel', 'ተንሸራታች መስኮት 2-ፓነል', 'Windows', 48, 'pcs', 4500, 1200, 800, 300, 2000, 1500, 7200, 0, '6063-T5', '6mm Clear Tempered', 'White'),
      makeItem('qi-004', 'PRD-004', 'SD-6063-D1', 'Sliding Door 3-Panel', 'ተንሸራታች በር 3-ፓነል', 'Doors', 12, 'pcs', 5500, 3200, 2000, 800, 1200, 800, 19500, 0, '6063-T6', '10mm Clear Tempered', 'White'),
      makeItem('qi-005', 'PRD-003', 'FW-6063-S3', 'Fixed Window Large', 'ቋሚ መስኮት ትልቅ', 'Windows', 24, 'pcs', 2000, 1200, 200, 0, 400, 0, 6000, 0, '6063-T5', '8mm Tinted Tempered', 'Bronze'),
    ];
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const installationCost = 80000;
    const transportCost = 25000;
    const cuttingFee = 9000;
    const finishUpcharge = 78000;
    const discountAmount = 0;
    const taxableAmount = subtotal;
    const fees = installationCost + transportCost + cuttingFee + finishUpcharge;
    const taxAmount = Math.round((taxableAmount + fees) * 0.15);
    const total = taxableAmount + fees + taxAmount;
    const totalCost = items.reduce((s, i) => s + i.lineCost, 0);
    return {
      id: 'QT-002', quoteNumber: 'QT-002', version: 'v2',
      versionHistory: [
        { version: 'v1', createdAt: '2025-02-15', createdBy: 'EMP-002', createdByName: 'Hana Mulugeta', changes: 'Initial quote', total: total - 50000, status: 'Draft' as QuoteStatus },
        { version: 'v2', createdAt: '2025-02-18', createdBy: 'EMP-002', createdByName: 'Hana Mulugeta', changes: 'Updated pricing after customer feedback', total, status: 'Pending' as QuoteStatus },
      ],
      customerId: 'CUS-001', customerName: 'Ayat Real Estate', customerCode: 'CUST-0001', customerContact: 'Ato Yonas Bekele', customerEmail: 'yonas@ayatre.com', customerPhone: '+251-911-234567',
      customerSnapshot: { healthScore: 78, outstandingBalance: 425000, creditLimit: 2000000, paymentTerms: 'Net 30' },
      projectName: 'Bole Tower B', title: 'Bole Tower B - Full Windows & Doors Package', items, subtotal, discountAmount, taxableAmount,
      installationCost, transportCost, cuttingFee, finishUpcharge, rushFee: 0, otherFees: 0,
      taxRate: 15, taxAmount, total, totalCost, totalProfit: total - totalCost, profitMargin: Math.round(((total - totalCost) / total) * 100),
      quoteDate: '2025-02-18', expiryDate: '2025-03-20', validityDays: 30,
      status: 'Pending' as QuoteStatus, paymentTerms: '50% deposit, 50% on completion', finishType: 'Powder Coated' as const,
      warranty: '5 years on frame, 2 years on hardware',
      activityLog: [
        { date: '2025-02-15', user: 'EMP-002', userName: 'Hana Mulugeta', action: 'created' as const },
        { date: '2025-02-18', user: 'EMP-002', userName: 'Hana Mulugeta', action: 'updated' as const, notes: 'Revised pricing v2' },
        { date: '2025-02-19', user: 'EMP-002', userName: 'Hana Mulugeta', action: 'sent' as const, notes: 'Sent via email' },
      ],
      isExpired: false, isConverted: false, currency: 'ETB' as const,
      createdBy: 'EMP-002', createdByName: 'Hana Mulugeta', createdAt: '2025-02-15',
      updatedBy: 'EMP-002', updatedByName: 'Hana Mulugeta', updatedAt: '2025-02-18',
    };
  })(),

  // QT-003: Addis Builders - Accepted → PJ-009
  (() => {
    const items = [
      makeItem('qi-006', 'PRD-001', 'SW-6063-S1', 'Sliding Window 2-Panel', 'ተንሸራታች መስኮት 2-ፓነል', 'Windows', 40, 'pcs', 4500, 1200, 800, 300, 2000, 1500, 7200, 0),
      makeItem('qi-007', 'PRD-002', 'CW-6063-S2', 'Casement Window Single', 'ካዝመንት መስኮት ነጠላ', 'Windows', 20, 'pcs', 1800, 800, 600, 0, 500, 0, 5100, 0),
      makeItem('qi-008', 'PRD-005', 'HD-6063-D2', 'Hinged Door Double', 'የሚከፈት በር ድርብ', 'Doors', 10, 'pcs', 4500, 2500, 1500, 0, 1000, 800, 15200, 0),
    ];
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const installationCost = 35000;
    const transportCost = 10000;
    const fees = installationCost + transportCost;
    const taxAmount = Math.round((subtotal + fees) * 0.15);
    const total = subtotal + fees + taxAmount;
    const totalCost = items.reduce((s, i) => s + i.lineCost, 0);
    return {
      id: 'QT-003', quoteNumber: 'QT-003', version: 'v1',
      versionHistory: [{ version: 'v1', createdAt: '2025-02-10', createdBy: 'EMP-003', createdByName: 'Sara Mengistu', changes: 'Initial quote', total, status: 'Accepted' as QuoteStatus }],
      customerId: 'CUS-008', customerName: 'Addis Builders PLC', customerCode: 'CUST-0008', customerContact: 'Ato Henok Assefa', customerEmail: 'henok@addisbuilders.com',
      customerSnapshot: { healthScore: 72, outstandingBalance: 85000, creditLimit: 2000000, paymentTerms: 'Net 30' },
      projectId: 'PJ-009', projectName: 'Residential Complex G+5', projectStatus: 'Production',
      title: 'Residential Complex G+5 - Windows & Doors', items, subtotal, discountAmount: 0, taxableAmount: subtotal,
      installationCost, transportCost, cuttingFee: 0, finishUpcharge: 0, rushFee: 0, otherFees: 0,
      taxRate: 15, taxAmount, total, totalCost, totalProfit: total - totalCost, profitMargin: Math.round(((total - totalCost) / total) * 100),
      quoteDate: '2025-02-10', expiryDate: '2025-03-12', validityDays: 30, convertedDate: '2025-02-15',
      status: 'Converted' as QuoteStatus, paymentTerms: '50% deposit, 50% on delivery', finishType: 'Mill Finish' as const,
      activityLog: [
        { date: '2025-02-10', user: 'EMP-003', userName: 'Sara Mengistu', action: 'created' as const },
        { date: '2025-02-12', user: 'EMP-003', userName: 'Sara Mengistu', action: 'sent' as const },
        { date: '2025-02-14', user: 'EMP-003', userName: 'Sara Mengistu', action: 'accepted' as const },
        { date: '2025-02-15', user: 'EMP-003', userName: 'Sara Mengistu', action: 'converted' as const, notes: 'Converted to project PJ-009' },
      ],
      isExpired: false, isConverted: true, currency: 'ETB' as const,
      createdBy: 'EMP-003', createdByName: 'Sara Mengistu', createdAt: '2025-02-10',
      updatedBy: 'EMP-003', updatedByName: 'Sara Mengistu', updatedAt: '2025-02-15',
    };
  })(),

  // QT-004: Kebede - Rejected
  (() => {
    const items = [
      makeItem('qi-009', 'PRD-002', 'CW-6063-S2', 'Casement Window Single', 'ካዝመንት መስኮት ነጠላ', 'Windows', 6, 'pcs', 1800, 800, 600, 0, 500, 0, 5100, 0),
      makeItem('qi-010', 'PRD-005', 'HD-6063-D2', 'Hinged Door Double', 'የሚከፈት በር ድርብ', 'Doors', 2, 'pcs', 4500, 2500, 1500, 0, 1000, 800, 15200, 0),
    ];
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const installationCost = 12000;
    const transportCost = 5000;
    const fees = installationCost + transportCost;
    const taxAmount = Math.round((subtotal + fees) * 0.15);
    const total = subtotal + fees + taxAmount;
    const totalCost = items.reduce((s, i) => s + i.lineCost, 0);
    return {
      id: 'QT-004', quoteNumber: 'QT-004', version: 'v1',
      versionHistory: [{ version: 'v1', createdAt: '2025-01-25', createdBy: 'EMP-002', createdByName: 'Hana Mulugeta', changes: 'Initial quote', total, status: 'Rejected' as QuoteStatus }],
      customerId: 'CUS-002', customerName: 'Ato Kebede Alemu', customerCode: 'CUST-0002', customerContact: 'Kebede Alemu', customerEmail: 'kebede@gmail.com',
      customerSnapshot: { healthScore: 65, outstandingBalance: 142500, creditLimit: 500000, paymentTerms: 'COD' },
      projectName: 'Villa Gate & Windows', title: 'Villa Gate & Windows Package', items, subtotal, discountAmount: 0, taxableAmount: subtotal,
      installationCost, transportCost, cuttingFee: 0, finishUpcharge: 0, rushFee: 0, otherFees: 0,
      taxRate: 15, taxAmount, total, totalCost, totalProfit: total - totalCost, profitMargin: Math.round(((total - totalCost) / total) * 100),
      quoteDate: '2025-01-25', expiryDate: '2025-02-25', validityDays: 30,
      status: 'Rejected' as QuoteStatus, paymentTerms: 'COD',
      activityLog: [
        { date: '2025-01-25', user: 'EMP-002', userName: 'Hana Mulugeta', action: 'created' as const },
        { date: '2025-02-10', user: 'EMP-002', userName: 'Hana Mulugeta', action: 'rejected' as const, notes: 'Customer found cheaper option' },
      ],
      isExpired: false, isConverted: false, currency: 'ETB' as const,
      createdBy: 'EMP-002', createdByName: 'Hana Mulugeta', createdAt: '2025-01-25',
      updatedBy: 'EMP-002', updatedByName: 'Hana Mulugeta', updatedAt: '2025-02-10',
    };
  })(),

  // QT-005: Noah Construction - Accepted → PJ-005
  (() => {
    const items = [
      makeItem('qi-011', 'PRD-001', 'SW-6063-S1', 'Sliding Window 2-Panel', 'ተንሸራታች መስኮት 2-ፓነል', 'Windows', 32, 'pcs', 4500, 1200, 800, 300, 2000, 1500, 7200, 0),
      makeItem('qi-012', 'PRD-005', 'HD-6063-D2', 'Hinged Door Double', 'የሚከፈት በር ድርብ', 'Doors', 8, 'pcs', 4500, 2500, 1500, 0, 1000, 800, 15200, 0),
      makeItem('qi-013', 'PRD-009', 'LV-6063-L1', 'Aluminum Louver Window', 'አልሚኒየም ላውቨር መስኮት', 'Windows', 15, 'pcs', 1800, 800, 500, 0, 600, 0, 5600, 0),
    ];
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const installationCost = 55000;
    const transportCost = 18000;
    const cuttingFee = 7000;
    const fees = installationCost + transportCost + cuttingFee;
    const taxAmount = Math.round((subtotal + fees) * 0.15);
    const total = subtotal + fees + taxAmount;
    const totalCost = items.reduce((s, i) => s + i.lineCost, 0);
    return {
      id: 'QT-005', quoteNumber: 'QT-005', version: 'v1',
      versionHistory: [{ version: 'v1', createdAt: '2025-02-05', createdBy: 'EMP-003', createdByName: 'Sara Mengistu', changes: 'Initial quote', total, status: 'Accepted' as QuoteStatus }],
      customerId: 'CUS-005', customerName: 'Noah Construction', customerCode: 'CUST-0005', customerContact: 'Ato Samuel Noah', customerEmail: 'samuel@noahcon.com',
      customerSnapshot: { healthScore: 92, outstandingBalance: 130000, creditLimit: 3000000, paymentTerms: 'Net 30' },
      projectId: 'PJ-005', projectName: 'CMC Phase 2 Block C', projectStatus: 'Ready',
      title: 'CMC Phase 2 Block C - Full Package', items, subtotal, discountAmount: 0, taxableAmount: subtotal,
      installationCost, transportCost, cuttingFee, finishUpcharge: 0, rushFee: 0, otherFees: 0,
      taxRate: 15, taxAmount, total, totalCost, totalProfit: total - totalCost, profitMargin: Math.round(((total - totalCost) / total) * 100),
      quoteDate: '2025-02-05', expiryDate: '2025-03-07', validityDays: 30, convertedDate: '2025-02-08',
      status: 'Converted' as QuoteStatus, paymentTerms: 'Net 30', finishType: 'Polished' as const,
      activityLog: [
        { date: '2025-02-05', user: 'EMP-003', userName: 'Sara Mengistu', action: 'created' as const },
        { date: '2025-02-07', user: 'EMP-003', userName: 'Sara Mengistu', action: 'accepted' as const },
        { date: '2025-02-08', user: 'EMP-003', userName: 'Sara Mengistu', action: 'converted' as const, notes: 'Converted to project PJ-005' },
      ],
      isExpired: false, isConverted: true, currency: 'ETB' as const,
      createdBy: 'EMP-003', createdByName: 'Sara Mengistu', createdAt: '2025-02-05',
      updatedBy: 'EMP-003', updatedByName: 'Sara Mengistu', updatedAt: '2025-02-08',
    };
  })(),

  // QT-006: Ethio Engineering - Lideta Tower Phase 2 (linked to PJ-008)
  (() => {
    const items = [
      makeItem('qi-014', 'PRD-001', 'SW-6063-S1', 'Sliding Window 2-Panel', 'ተንሸራታች መስኮት 2-ፓነል', 'Windows', 45, 'pcs', 4500, 1200, 800, 300, 2000, 1500, 7200, 0),
      makeItem('qi-015', 'PRD-004', 'SD-6063-D1', 'Sliding Door 3-Panel', 'ተንሸራታች በር 3-ፓነል', 'Doors', 15, 'pcs', 5500, 3200, 2000, 800, 1200, 800, 19500, 0),
      makeItem('qi-016', 'PRD-007', 'CW-6060-C1', 'Curtain Wall System', 'ከርተን ወል ሲስተም', 'Curtain Walls', 3, 'pcs', 15000, 12000, 5000, 2000, 3000, 2000, 55000, 0),
    ];
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const installationCost = 120000;
    const transportCost = 35000;
    const rushFee = 57750;
    const fees = installationCost + transportCost + rushFee;
    const taxAmount = Math.round((subtotal + fees) * 0.15);
    const total = subtotal + fees + taxAmount;
    const totalCost = items.reduce((s, i) => s + i.lineCost, 0);
    return {
      id: 'QT-006', quoteNumber: 'QT-006', version: 'v1',
      versionHistory: [{ version: 'v1', createdAt: '2025-02-25', createdBy: 'EMP-002', createdByName: 'Hana Mulugeta', changes: 'Initial quote', total, status: 'Pending' as QuoteStatus }],
      customerId: 'CUS-003', customerName: 'Ethio Engineering', customerCode: 'CUST-0003', customerContact: 'Eng. Dawit Tesfaye', customerEmail: 'dawit@ethioeng.com',
      customerSnapshot: { healthScore: 88, outstandingBalance: 300000, creditLimit: 5000000, paymentTerms: 'Net 60' },
      projectId: 'PJ-008', projectName: 'Lideta Tower Phase 2', projectStatus: 'Quote',
      title: 'Lideta Tower Phase 2 - Rush Order', description: 'Rush order - 5% surcharge applied',
      items, subtotal, discountAmount: 0, taxableAmount: subtotal,
      installationCost, transportCost, cuttingFee: 0, finishUpcharge: 0, rushFee, otherFees: 0,
      taxRate: 15, taxAmount, total, totalCost, totalProfit: total - totalCost, profitMargin: Math.round(((total - totalCost) / total) * 100),
      quoteDate: '2025-02-25', expiryDate: '2025-03-27', validityDays: 30,
      status: 'Pending' as QuoteStatus, paymentTerms: 'Net 60', finishType: 'Anodized' as const,
      internalNotes: 'Rush order - 5% surcharge. Customer is VIP - prioritize.',
      activityLog: [
        { date: '2025-02-25', user: 'EMP-002', userName: 'Hana Mulugeta', action: 'created' as const },
        { date: '2025-02-26', user: 'EMP-002', userName: 'Hana Mulugeta', action: 'sent' as const },
      ],
      isExpired: false, isConverted: false, currency: 'ETB' as const,
      createdBy: 'EMP-002', createdByName: 'Hana Mulugeta', createdAt: '2025-02-25',
      updatedBy: 'EMP-002', updatedByName: 'Hana Mulugeta', updatedAt: '2025-02-26',
    };
  })(),

  // QT-007 to QT-015: Additional quotes for variety
  ...([
    { id: 'QT-007', cusId: 'CUS-007', cusName: 'W/ro Tigist Haile', cusCode: 'CUST-0007', project: 'Penthouse Extension', title: 'Penthouse Extension Windows', status: 'Draft' as QuoteStatus, date: '2025-03-01', expiry: '2025-03-31', by: 'Dawit Hailu', byId: 'EMP-004', health: 85, outstanding: 0, creditLimit: 300000, terms: 'COD', prodItems: [['PRD-001', 5, 7200], ['PRD-008', 2, 13500]] as [string, number, number][] },
    { id: 'QT-008', cusId: 'CUS-006', cusName: 'Commercial Bank Ethiopia', cusCode: 'CUST-0006', project: 'Kazanchis Branch Phase 2', title: 'Branch Renovation', status: 'Pending' as QuoteStatus, date: '2025-02-28', expiry: '2025-03-30', by: 'Hana Mulugeta', byId: 'EMP-002', health: 60, outstanding: 190000, creditLimit: 10000000, terms: 'Net 30', prodItems: [['PRD-010', 15, 11500], ['PRD-002', 10, 5100]] as [string, number, number][] },
    { id: 'QT-009', cusId: 'CUS-009', cusName: 'Sunshine Properties', cusCode: 'CUST-0009', project: 'Gerji Towers', title: 'Gerji Towers Windows', status: 'Pending' as QuoteStatus, date: '2025-02-15', expiry: '2025-03-17', by: 'Sara Mengistu', byId: 'EMP-003', health: 40, outstanding: 0, creditLimit: 4000000, terms: 'Net 30', prodItems: [['PRD-001', 60, 7200], ['PRD-004', 20, 19500], ['PRD-007', 4, 55000]] as [string, number, number][] },
    { id: 'QT-010', cusId: 'CUS-010', cusName: 'Abay Construction', cusCode: 'CUST-0010', project: 'Piassa Office Building', title: 'Piassa Office Partitions', status: 'Expired' as QuoteStatus, date: '2025-01-10', expiry: '2025-02-09', by: 'Dawit Hailu', byId: 'EMP-004', health: 42, outstanding: 350000, creditLimit: 1500000, terms: 'Net 60', prodItems: [['PRD-010', 25, 11500], ['PRD-009', 10, 5600]] as [string, number, number][] },
    { id: 'QT-011', cusId: 'CUS-011', cusName: 'Unity University', cusCode: 'CUST-0011', project: 'Library Extension', title: 'Library Windows & Curtain Wall', status: 'Accepted' as QuoteStatus, date: '2025-01-20', expiry: '2025-02-19', by: 'Sara Mengistu', byId: 'EMP-003', health: 55, outstanding: 200000, creditLimit: 2000000, terms: 'Net 30', prodItems: [['PRD-007', 2, 55000], ['PRD-001', 30, 7200], ['PRD-010', 8, 11500]] as [string, number, number][] },
    { id: 'QT-012', cusId: 'CUS-001', cusName: 'Ayat Real Estate', cusCode: 'CUST-0001', project: 'Bole Tower C', title: 'Bole Tower C - Doors Only', status: 'Draft' as QuoteStatus, date: '2025-03-02', expiry: '2025-04-01', by: 'Hana Mulugeta', byId: 'EMP-002', health: 78, outstanding: 425000, creditLimit: 2000000, terms: 'Net 30', prodItems: [['PRD-004', 18, 19500], ['PRD-006', 6, 29000]] as [string, number, number][] },
    { id: 'QT-013', cusId: 'CUS-003', cusName: 'Ethio Engineering', cusCode: 'CUST-0003', project: 'Megenagna Phase 3', title: 'Megenagna Phase 3 - Handrails', status: 'Pending' as QuoteStatus, date: '2025-03-01', expiry: '2025-03-31', by: 'Hana Mulugeta', byId: 'EMP-002', health: 88, outstanding: 300000, creditLimit: 5000000, terms: 'Net 60', prodItems: [['PRD-008', 12, 13500]] as [string, number, number][] },
    { id: 'QT-014', cusId: 'CUS-005', cusName: 'Noah Construction', cusCode: 'CUST-0005', project: 'Lideta Phase 3', title: 'Lideta Phase 3 - Windows', status: 'Pending' as QuoteStatus, date: '2025-03-03', expiry: '2025-04-02', by: 'Sara Mengistu', byId: 'EMP-003', health: 92, outstanding: 130000, creditLimit: 3000000, terms: 'Net 30', prodItems: [['PRD-001', 50, 7200], ['PRD-002', 30, 5100]] as [string, number, number][] },
    { id: 'QT-015', cusId: 'CUS-012', cusName: 'Ato Tesfaye Lemma', cusCode: 'CUST-0012', project: 'Summit Villa', title: 'Summit Villa - Complete Package', status: 'Expired' as QuoteStatus, date: '2024-12-15', expiry: '2025-01-14', by: 'Dawit Hailu', byId: 'EMP-004', health: 75, outstanding: 0, creditLimit: 400000, terms: 'COD', prodItems: [['PRD-001', 8, 7200], ['PRD-005', 3, 15200]] as [string, number, number][] },
  ] as const).map(q => {
    const productMap: Record<string, { code: string; name: string; nameAm: string; cat: string; matCost: number; glassCost: number; hwCost: number; accCost: number; fabLabor: number; instLabor: number }> = {
      'PRD-001': { code: 'SW-6063-S1', name: 'Sliding Window 2-Panel', nameAm: 'ተንሸራታች መስኮት 2-ፓነል', cat: 'Windows', matCost: 4500, glassCost: 1200, hwCost: 800, accCost: 300, fabLabor: 2000, instLabor: 1500 },
      'PRD-002': { code: 'CW-6063-S2', name: 'Casement Window Single', nameAm: 'ካዝመንት መስኮት ነጠላ', cat: 'Windows', matCost: 1800, glassCost: 800, hwCost: 600, accCost: 0, fabLabor: 500, instLabor: 0 },
      'PRD-004': { code: 'SD-6063-D1', name: 'Sliding Door 3-Panel', nameAm: 'ተንሸራታች በር 3-ፓነል', cat: 'Doors', matCost: 5500, glassCost: 3200, hwCost: 2000, accCost: 800, fabLabor: 1200, instLabor: 800 },
      'PRD-005': { code: 'HD-6063-D2', name: 'Hinged Door Double', nameAm: 'የሚከፈት በር ድርብ', cat: 'Doors', matCost: 4500, glassCost: 2500, hwCost: 1500, accCost: 0, fabLabor: 1000, instLabor: 800 },
      'PRD-006': { code: 'FD-6063-D3', name: 'Folding Door 4-Panel', nameAm: 'ተጣጣፊ በር 4-ፓነል', cat: 'Doors', matCost: 8000, glassCost: 5000, hwCost: 3000, accCost: 1200, fabLabor: 1500, instLabor: 1000 },
      'PRD-007': { code: 'CW-6060-C1', name: 'Curtain Wall System', nameAm: 'ከርተን ወል ሲስተም', cat: 'Curtain Walls', matCost: 15000, glassCost: 12000, hwCost: 5000, accCost: 2000, fabLabor: 3000, instLabor: 2000 },
      'PRD-008': { code: 'HR-6063-H1', name: 'Glass Handrail System', nameAm: 'የመስታወት ዘንግ ስርዓት', cat: 'Handrails', matCost: 3500, glassCost: 3000, hwCost: 1500, accCost: 0, fabLabor: 800, instLabor: 0 },
      'PRD-009': { code: 'LV-6063-L1', name: 'Aluminum Louver Window', nameAm: 'አልሚኒየም ላውቨር መስኮት', cat: 'Windows', matCost: 1800, glassCost: 800, hwCost: 500, accCost: 0, fabLabor: 600, instLabor: 0 },
      'PRD-010': { code: 'PT-6063-P1', name: 'Office Partition System', nameAm: 'የቢሮ ክፋፍል ስርዓት', cat: 'Partitions', matCost: 3500, glassCost: 2200, hwCost: 800, accCost: 0, fabLabor: 700, instLabor: 0 },
    };
    const items = q.prodItems.map(([pId, qty, price], i) => {
      const p = productMap[pId as string];
      return makeItem(`qi-${q.id}-${i}`, pId as string, p.code, p.name, p.nameAm, p.cat, qty as number, 'pcs', p.matCost, p.glassCost, p.hwCost, p.accCost, p.fabLabor, p.instLabor, price as number, 0);
    });
    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const installationCost = Math.round(subtotal * 0.08);
    const transportCost = Math.round(subtotal * 0.03);
    const fees = installationCost + transportCost;
    const taxAmount = Math.round((subtotal + fees) * 0.15);
    const total = subtotal + fees + taxAmount;
    const totalCost = items.reduce((s, i) => s + i.lineCost, 0);
    return {
      id: q.id, quoteNumber: q.id, version: 'v1',
      versionHistory: [{ version: 'v1', createdAt: q.date, createdBy: q.byId, createdByName: q.by, changes: 'Initial quote', total, status: q.status }],
      customerId: q.cusId, customerName: q.cusName, customerCode: q.cusCode,
      customerSnapshot: { healthScore: q.health, outstandingBalance: q.outstanding, creditLimit: q.creditLimit, paymentTerms: q.terms },
      projectName: q.project, title: q.title, items, subtotal, discountAmount: 0, taxableAmount: subtotal,
      installationCost, transportCost, cuttingFee: 0, finishUpcharge: 0, rushFee: 0, otherFees: 0,
      taxRate: 15, taxAmount, total, totalCost, totalProfit: total - totalCost, profitMargin: Math.round(((total - totalCost) / total) * 100),
      quoteDate: q.date, expiryDate: q.expiry, validityDays: 30,
      status: q.status, paymentTerms: q.terms,
      activityLog: [{ date: q.date, user: q.byId, userName: q.by, action: 'created' as const }],
      isExpired: q.status === 'Expired', isConverted: q.status === 'Converted', currency: 'ETB' as const,
      createdBy: q.byId, createdByName: q.by, createdAt: q.date,
      updatedBy: q.byId, updatedByName: q.by, updatedAt: q.date,
    } as EnhancedQuote;
  }),
];
