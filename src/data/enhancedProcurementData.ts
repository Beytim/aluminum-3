// ══════════════════════════════════════════
// ENHANCED PROCUREMENT DATA MODEL & SAMPLE DATA
// ══════════════════════════════════════════

export type SupplierStatus = 'Active' | 'Inactive' | 'Blacklisted' | 'Pending' | 'Prospect';
export type POStatus = 'Draft' | 'Pending Approval' | 'Sent' | 'Confirmed' | 'Shipped' | 'Partial' | 'Received' | 'Cancelled' | 'On Hold' | 'Disputed';
export type ProcCurrency = 'ETB' | 'USD' | 'EUR' | 'CNY' | 'GBP' | 'AED' | 'TRY';
export type PaymentTerms = 'COD' | 'Net 15' | 'Net 30' | 'Net 45' | 'Net 60' | 'LC' | 'TT Advance' | 'TT Partial';
export type ShippingTerms = 'EXW' | 'FOB' | 'CIF' | 'CIP' | 'DAP' | 'DDU' | 'DDP';

export interface EnhancedSupplier {
  id: string;
  supplierCode: string;
  companyName: string;
  companyNameAm?: string;
  tradingName?: string;
  businessType: 'Manufacturer' | 'Distributor' | 'Agent' | 'Trader' | 'Importer';
  contactPerson: string;
  position?: string;
  phone: string;
  phoneSecondary?: string;
  email: string;
  website?: string;
  country: string;
  city?: string;
  address?: string;
  taxId?: string;
  paymentTerms: PaymentTerms;
  currency: ProcCurrency;
  bankName?: string;
  bankAccount?: string;
  swiftCode?: string;
  creditLimit: number;
  creditUsed: number;
  productCategories: string[];
  certifications: string[];
  rating: number;
  performance: {
    onTimeDeliveryRate: number;
    qualityRating: number;
    responseTime: number;
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: string;
  };
  averageLeadTime: number;
  minOrderQty?: number;
  shippingTerms: ShippingTerms[];
  preferred: boolean;
  approved: boolean;
  status: SupplierStatus;
  notes?: string;
  activityLog: { date: string; user: string; userName: string; action: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface EnhancedPOItem {
  id: string;
  productId?: string;
  productCode?: string;
  productName: string;
  inventoryItemId?: string;
  projectId?: string;
  projectName?: string;
  description: string;
  quantity: number;
  unit: string;
  received: number;
  rejected: number;
  remaining: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  lineTotal: number;
  unitPriceInETB: number;
  lineTotalInETB: number;
  taxRate: number;
  taxAmount: number;
  landedUnitCost: number;
  inspected: boolean;
  inspectionResult?: 'Pass' | 'Fail' | 'Conditional';
  status: 'Pending' | 'Partial' | 'Received' | 'Cancelled';
  notes?: string;
}

export interface EnhancedPurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  projectId?: string;
  projectName?: string;
  orderDate: string;
  expectedDelivery: string;
  shippedDate?: string;
  receivedDate?: string;
  status: POStatus;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  currency: ProcCurrency;
  exchangeRate: number;
  items: EnhancedPOItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingCost: number;
  shippingTerms: ShippingTerms;
  shippingMethod?: 'Sea' | 'Air' | 'Land' | 'Courier';
  trackingNumber?: string;
  carrier?: string;
  insurance: number;
  customsDuty: number;
  otherCharges: number;
  total: number;
  totalInETB: number;
  paymentTerms: PaymentTerms;
  paid: number;
  paidInETB: number;
  balance: number;
  balanceInETB: number;
  payments: { id: string; date: string; amount: number; amountInETB: number; method: string; reference: string }[];
  receipts: { id: string; date: string; receivedBy: string; items: { itemId: string; quantity: number; accepted: number; rejected: number }[]; notes?: string }[];
  isOverdue: boolean;
  isUrgent: boolean;
  notes?: string;
  internalNotes?: string;
  activityLog: { date: string; user: string; userName: string; action: string; notes?: string }[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReorderSuggestion {
  id: string;
  inventoryItemId: string;
  itemCode: string;
  itemName: string;
  category: string;
  currentStock: number;
  minStock: number;
  availableStock: number;
  averageDailyUsage: number;
  daysUntilStockout: number;
  suggestedQuantity: number;
  suggestedUnit: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  preferredSupplierId?: string;
  preferredSupplierName?: string;
  estimatedUnitCost: number;
  estimatedTotalCost: number;
  supplierLeadTime: number;
  status: 'Pending' | 'Approved' | 'Ordered' | 'Cancelled';
  createdPOId?: string;
}

// ═══ EXCHANGE RATES ═══
export const procExchangeRates: Record<ProcCurrency, number> = {
  ETB: 1, USD: 56.5, EUR: 61.2, CNY: 7.8, GBP: 71.5, AED: 15.4, TRY: 1.7,
};

// ═══ HELPERS ═══
export const getPOStatusColor = (status: POStatus): string => {
  const map: Record<POStatus, string> = {
    Draft: 'bg-muted text-muted-foreground',
    'Pending Approval': 'bg-warning/10 text-warning',
    Sent: 'bg-info/10 text-info',
    Confirmed: 'bg-primary/10 text-primary',
    Shipped: 'bg-purple-500/10 text-purple-500',
    Partial: 'bg-orange-500/10 text-orange-500',
    Received: 'bg-success/10 text-success',
    Cancelled: 'bg-destructive/10 text-destructive',
    'On Hold': 'bg-muted text-muted-foreground',
    Disputed: 'bg-destructive/10 text-destructive',
  };
  return map[status] || 'bg-muted text-muted-foreground';
};

export const getSupplierStatusColor = (status: SupplierStatus): string => {
  const map: Record<SupplierStatus, string> = {
    Active: 'bg-success/10 text-success',
    Inactive: 'bg-muted text-muted-foreground',
    Blacklisted: 'bg-destructive/10 text-destructive',
    Pending: 'bg-warning/10 text-warning',
    Prospect: 'bg-info/10 text-info',
  };
  return map[status] || 'bg-muted text-muted-foreground';
};

export const getReorderPriorityColor = (p: string): string => {
  const map: Record<string, string> = {
    Critical: 'bg-destructive/10 text-destructive',
    High: 'bg-orange-500/10 text-orange-500',
    Medium: 'bg-warning/10 text-warning',
    Low: 'bg-info/10 text-info',
  };
  return map[p] || 'bg-muted text-muted-foreground';
};

export const procFormatCurrency = (amount: number, currency: ProcCurrency = 'ETB'): string => {
  const sym: Record<ProcCurrency, string> = { ETB: 'ETB', USD: '$', EUR: '€', CNY: '¥', GBP: '£', AED: 'AED', TRY: '₺' };
  return `${sym[currency]} ${amount.toLocaleString()}`;
};

export const procFormatETB = (amount: number): string => `ETB ${amount.toLocaleString()}`;
export const procFormatETBShort = (amount: number): string => {
  if (amount >= 1_000_000) return `ETB ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `ETB ${(amount / 1_000).toFixed(0)}K`;
  return `ETB ${amount.toLocaleString()}`;
};

export interface ProcurementStats {
  totalSuppliers: number;
  activeSuppliers: number;
  preferredSuppliers: number;
  totalPOs: number;
  openPOs: number;
  overduePOs: number;
  totalSpentMTD: number;
  totalSpentYTD: number;
  avgLeadTime: number;
  onTimeDeliveryRate: number;
  outstandingCommitments: number;
  itemsToReorder: number;
  avgPOValue: number;
  receivedPOs: number;
}

export const calculateProcurementStats = (suppliers: EnhancedSupplier[], pos: EnhancedPurchaseOrder[], reorders: ReorderSuggestion[]): ProcurementStats => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const mtdPOs = pos.filter(p => { const d = new Date(p.orderDate); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; });
  const ytdPOs = pos.filter(p => new Date(p.orderDate).getFullYear() === thisYear);
  const openStatuses: POStatus[] = ['Draft', 'Pending Approval', 'Sent', 'Confirmed', 'Shipped', 'Partial'];
  const openPOs = pos.filter(p => openStatuses.includes(p.status));

  return {
    totalSuppliers: suppliers.length,
    activeSuppliers: suppliers.filter(s => s.status === 'Active').length,
    preferredSuppliers: suppliers.filter(s => s.preferred).length,
    totalPOs: pos.length,
    openPOs: openPOs.length,
    overduePOs: pos.filter(p => p.isOverdue).length,
    totalSpentMTD: mtdPOs.reduce((s, p) => s + p.totalInETB, 0),
    totalSpentYTD: ytdPOs.reduce((s, p) => s + p.totalInETB, 0),
    avgLeadTime: suppliers.length > 0 ? Math.round(suppliers.reduce((s, sup) => s + sup.averageLeadTime, 0) / suppliers.length) : 0,
    onTimeDeliveryRate: suppliers.length > 0 ? Math.round(suppliers.reduce((s, sup) => s + sup.performance.onTimeDeliveryRate, 0) / suppliers.length) : 0,
    outstandingCommitments: openPOs.reduce((s, p) => s + p.balanceInETB, 0),
    itemsToReorder: reorders.filter(r => r.status === 'Pending').length,
    avgPOValue: pos.length > 0 ? pos.reduce((s, p) => s + p.totalInETB, 0) / pos.length : 0,
    receivedPOs: pos.filter(p => p.status === 'Received').length,
  };
};

// ═══ SAMPLE DATA ═══

export const sampleEnhancedSuppliers: EnhancedSupplier[] = [
  {
    id: 'SUP-001', supplierCode: 'SUP-0001', companyName: 'China Aluminum Corp', companyNameAm: 'ቻይና አሉሚኒየም ኮርፕ',
    businessType: 'Manufacturer', contactPerson: 'Wang Li', position: 'Sales Manager',
    phone: '+86-755-8888-1234', email: 'wang.li@chinaalucorp.com', website: 'www.chinaalucorp.com',
    country: 'China', city: 'Shenzhen', address: '88 Industrial Ave, Nanshan District',
    taxId: 'CN-912345678', paymentTerms: 'TT Advance', currency: 'USD',
    bankName: 'Bank of China', swiftCode: 'BKCHCNBJ',
    creditLimit: 500000, creditUsed: 185000,
    productCategories: ['Profiles', 'Sheets', 'Bars'], certifications: ['ISO 9001', 'ISO 14001', 'ASTM B221'],
    rating: 4.5,
    performance: { onTimeDeliveryRate: 92, qualityRating: 4.3, responseTime: 4, totalOrders: 24, totalSpent: 12500000, averageOrderValue: 520833, lastOrderDate: '2025-02-15' },
    averageLeadTime: 45, minOrderQty: 5000, shippingTerms: ['FOB', 'CIF'], preferred: true, approved: true,
    status: 'Active',
    activityLog: [{ date: '2025-02-15', user: 'USR-001', userName: 'Admin', action: 'New PO created' }],
    createdAt: '2023-01-15', updatedAt: '2025-02-15',
  },
  {
    id: 'SUP-002', supplierCode: 'SUP-0002', companyName: 'Gulf Glass Industries', companyNameAm: 'ጋልፍ ግላስ ኢንዱስትሪስ',
    businessType: 'Manufacturer', contactPerson: 'Ahmed Al-Rashid', position: 'Export Manager',
    phone: '+971-4-555-7890', email: 'ahmed@gulfglass.ae', website: 'www.gulfglass.ae',
    country: 'UAE', city: 'Dubai', address: 'Jebel Ali Free Zone',
    paymentTerms: 'Net 30', currency: 'AED',
    creditLimit: 200000, creditUsed: 45000,
    productCategories: ['Glass', 'Tempered Glass', 'Laminated Glass'], certifications: ['ISO 9001', 'EN 12150'],
    rating: 4.2,
    performance: { onTimeDeliveryRate: 88, qualityRating: 4.5, responseTime: 6, totalOrders: 15, totalSpent: 4200000, averageOrderValue: 280000, lastOrderDate: '2025-01-20' },
    averageLeadTime: 21, minOrderQty: 100, shippingTerms: ['FOB', 'CIF', 'DDP'], preferred: true, approved: true,
    status: 'Active',
    activityLog: [{ date: '2025-01-20', user: 'USR-001', userName: 'Admin', action: 'PO-003 created' }],
    createdAt: '2023-06-10', updatedAt: '2025-01-20',
  },
  {
    id: 'SUP-003', supplierCode: 'SUP-0003', companyName: 'Turkey Hardware Co.', companyNameAm: 'ቱርክ ሃርድዌር ኩባንያ',
    businessType: 'Distributor', contactPerson: 'Mehmet Yilmaz', position: 'Director',
    phone: '+90-212-444-5678', email: 'mehmet@turkhw.com', website: 'www.turkhw.com',
    country: 'Turkey', city: 'Istanbul',
    paymentTerms: 'Net 45', currency: 'USD',
    creditLimit: 150000, creditUsed: 32000,
    productCategories: ['Hardware', 'Locks', 'Handles', 'Hinges'], certifications: ['ISO 9001', 'CE'],
    rating: 3.8,
    performance: { onTimeDeliveryRate: 82, qualityRating: 3.9, responseTime: 12, totalOrders: 18, totalSpent: 3800000, averageOrderValue: 211111, lastOrderDate: '2025-02-28' },
    averageLeadTime: 28, minOrderQty: 500, shippingTerms: ['FOB', 'EXW'], preferred: false, approved: true,
    status: 'Active',
    activityLog: [{ date: '2025-02-28', user: 'USR-001', userName: 'Admin', action: 'PO-005 created' }],
    createdAt: '2023-03-20', updatedAt: '2025-02-28',
  },
  {
    id: 'SUP-004', supplierCode: 'SUP-0004', companyName: 'Addis Hardware Supply', companyNameAm: 'አዲስ ሃርድዌር ሰፕላይ',
    businessType: 'Distributor', contactPerson: 'Ato Tesfaye Girma', position: 'Owner',
    phone: '+251-911-456789', email: 'tesfaye@addishw.com',
    country: 'Ethiopia', city: 'Addis Ababa', address: 'Merkato, Addis Ababa',
    paymentTerms: 'COD', currency: 'ETB',
    creditLimit: 500000, creditUsed: 80000,
    productCategories: ['Hardware', 'Accessories', 'Sealants', 'Tools'], certifications: [],
    rating: 3.5,
    performance: { onTimeDeliveryRate: 95, qualityRating: 3.5, responseTime: 2, totalOrders: 45, totalSpent: 2200000, averageOrderValue: 48889, lastOrderDate: '2025-03-05' },
    averageLeadTime: 3, minOrderQty: 50, shippingTerms: ['EXW'], preferred: false, approved: true,
    status: 'Active',
    activityLog: [{ date: '2025-03-05', user: 'USR-001', userName: 'Admin', action: 'Local purchase' }],
    createdAt: '2022-09-01', updatedAt: '2025-03-05',
  },
  {
    id: 'SUP-005', supplierCode: 'SUP-0005', companyName: 'European Sealing Solutions', companyNameAm: 'ዩሮፒያን ሲሊንግ ሶሉሽንስ',
    businessType: 'Manufacturer', contactPerson: 'Klaus Schmidt', position: 'Sales Director',
    phone: '+49-89-123-4567', email: 'klaus@euseal.de', website: 'www.euseal.de',
    country: 'Germany', city: 'Munich',
    paymentTerms: 'Net 60', currency: 'EUR',
    creditLimit: 100000, creditUsed: 15000,
    productCategories: ['Sealants', 'Gaskets', 'Weather Stripping'], certifications: ['ISO 9001', 'DIN EN ISO 14001'],
    rating: 4.7,
    performance: { onTimeDeliveryRate: 96, qualityRating: 4.8, responseTime: 8, totalOrders: 8, totalSpent: 1500000, averageOrderValue: 187500, lastOrderDate: '2025-01-10' },
    averageLeadTime: 35, shippingTerms: ['CIF', 'DDP'], preferred: true, approved: true,
    status: 'Active',
    activityLog: [{ date: '2025-01-10', user: 'USR-001', userName: 'Admin', action: 'Annual order placed' }],
    createdAt: '2024-01-15', updatedAt: '2025-01-10',
  },
];

const makePOItem = (name: string, qty: number, price: number, unit: string, received: number, prodId?: string): EnhancedPOItem => ({
  id: `POI-${Math.random().toString(36).slice(2, 7)}`,
  productId: prodId, productName: name, description: name,
  quantity: qty, unit, received, rejected: 0, remaining: qty - received,
  unitPrice: price, discountPercent: 0, discountAmount: 0, lineTotal: qty * price,
  unitPriceInETB: price * 56.5, lineTotalInETB: qty * price * 56.5,
  taxRate: 0, taxAmount: 0, landedUnitCost: price * 1.15,
  inspected: received > 0, inspectionResult: received > 0 ? 'Pass' : undefined,
  status: received >= qty ? 'Received' : received > 0 ? 'Partial' : 'Pending',
});

export const sampleEnhancedPOs: EnhancedPurchaseOrder[] = [
  {
    id: 'PO-001', poNumber: 'PO-0001', supplierId: 'SUP-001', supplierName: 'China Aluminum Corp', supplierCode: 'SUP-0001',
    projectId: 'PJ-001', projectName: 'Bole Tower A Windows',
    orderDate: '2025-01-10', expectedDelivery: '2025-02-25', shippedDate: '2025-02-10', receivedDate: '2025-03-01',
    status: 'Received', approvalStatus: 'Approved', approvedBy: 'Admin',
    currency: 'USD', exchangeRate: 56.5,
    items: [
      makePOItem('Aluminum Profile 6063-T5', 2000, 4.5, 'kg', 2000, 'PRD-001'),
      makePOItem('Aluminum Sheet 1mm', 500, 8.2, 'sqm', 500),
    ],
    subtotal: 13100, discountAmount: 0, taxAmount: 0, shippingCost: 2500, shippingTerms: 'FOB',
    shippingMethod: 'Sea', carrier: 'Maersk', trackingNumber: 'MAEU1234567',
    insurance: 350, customsDuty: 1800, otherCharges: 500,
    total: 18250, totalInETB: 1031125, paymentTerms: 'TT Advance',
    paid: 18250, paidInETB: 1031125, balance: 0, balanceInETB: 0,
    payments: [{ id: 'PPAY-001', date: '2025-01-12', amount: 18250, amountInETB: 1031125, method: 'TT', reference: 'TT-20250112-001' }],
    receipts: [{ id: 'REC-001', date: '2025-03-01', receivedBy: 'Warehouse Team', items: [{ itemId: 'POI-1', quantity: 2000, accepted: 2000, rejected: 0 }, { itemId: 'POI-2', quantity: 500, accepted: 500, rejected: 0 }] }],
    isOverdue: false, isUrgent: false,
    activityLog: [
      { date: '2025-01-10', user: 'USR-001', userName: 'Admin', action: 'PO created' },
      { date: '2025-01-12', user: 'USR-002', userName: 'Finance', action: 'Payment sent' },
      { date: '2025-03-01', user: 'USR-003', userName: 'Warehouse', action: 'Goods received' },
    ],
    createdBy: 'USR-001', createdByName: 'Admin', createdAt: '2025-01-10', updatedAt: '2025-03-01',
  },
  {
    id: 'PO-002', poNumber: 'PO-0002', supplierId: 'SUP-002', supplierName: 'Gulf Glass Industries', supplierCode: 'SUP-0002',
    projectId: 'PJ-003', projectName: 'Kirkos Office Complex',
    orderDate: '2025-02-05', expectedDelivery: '2025-02-26',
    status: 'Shipped', approvalStatus: 'Approved',
    currency: 'AED', exchangeRate: 15.4,
    items: [
      makePOItem('Tempered Glass 6mm Clear', 200, 120, 'sqm', 0),
      makePOItem('Laminated Glass 10mm', 50, 280, 'sqm', 0),
    ],
    subtotal: 38000, discountAmount: 500, taxAmount: 0, shippingCost: 4500, shippingTerms: 'CIF',
    shippingMethod: 'Sea', carrier: 'Emirates Shipping', trackingNumber: 'ESL-9876543',
    insurance: 600, customsDuty: 2200, otherCharges: 300,
    total: 45100, totalInETB: 694540, paymentTerms: 'Net 30',
    paid: 22550, paidInETB: 347270, balance: 22550, balanceInETB: 347270,
    payments: [{ id: 'PPAY-002', date: '2025-02-08', amount: 22550, amountInETB: 347270, method: 'TT', reference: 'TT-20250208-002' }],
    receipts: [], isOverdue: true, isUrgent: false,
    activityLog: [
      { date: '2025-02-05', user: 'USR-001', userName: 'Admin', action: 'PO created' },
      { date: '2025-02-08', user: 'USR-002', userName: 'Finance', action: '50% advance paid' },
      { date: '2025-02-20', user: 'USR-001', userName: 'Admin', action: 'Shipped notification received' },
    ],
    createdBy: 'USR-001', createdByName: 'Admin', createdAt: '2025-02-05', updatedAt: '2025-02-20',
  },
  {
    id: 'PO-003', poNumber: 'PO-0003', supplierId: 'SUP-003', supplierName: 'Turkey Hardware Co.', supplierCode: 'SUP-0003',
    orderDate: '2025-02-28', expectedDelivery: '2025-03-28',
    status: 'Confirmed', approvalStatus: 'Approved',
    currency: 'USD', exchangeRate: 56.5,
    items: [
      makePOItem('Door Handles - Premium', 500, 12, 'pcs', 0),
      makePOItem('Window Locks - Multi-point', 300, 18, 'pcs', 0),
      makePOItem('Hinges - Heavy Duty', 1000, 5, 'pcs', 0),
    ],
    subtotal: 16400, discountAmount: 400, taxAmount: 0, shippingCost: 1800, shippingTerms: 'FOB',
    shippingMethod: 'Air',
    insurance: 200, customsDuty: 1200, otherCharges: 0,
    total: 19200, totalInETB: 1084800, paymentTerms: 'Net 45',
    paid: 0, paidInETB: 0, balance: 19200, balanceInETB: 1084800,
    payments: [], receipts: [], isOverdue: false, isUrgent: false,
    activityLog: [
      { date: '2025-02-28', user: 'USR-001', userName: 'Admin', action: 'PO created and sent' },
      { date: '2025-03-02', user: 'USR-001', userName: 'Admin', action: 'Supplier confirmed' },
    ],
    createdBy: 'USR-001', createdByName: 'Admin', createdAt: '2025-02-28', updatedAt: '2025-03-02',
  },
  {
    id: 'PO-004', poNumber: 'PO-0004', supplierId: 'SUP-004', supplierName: 'Addis Hardware Supply', supplierCode: 'SUP-0004',
    orderDate: '2025-03-05', expectedDelivery: '2025-03-08',
    status: 'Sent', approvalStatus: 'Approved',
    currency: 'ETB', exchangeRate: 1,
    items: [
      makePOItem('Silicon Sealant - Clear', 200, 350, 'pcs', 0),
      makePOItem('Rubber Gasket Roll', 50, 1200, 'rolls', 0),
      makePOItem('Screw Set - Assorted', 100, 180, 'boxes', 0),
    ],
    subtotal: 148000, discountAmount: 0, taxAmount: 22200, shippingCost: 0, shippingTerms: 'EXW',
    insurance: 0, customsDuty: 0, otherCharges: 0,
    total: 170200, totalInETB: 170200, paymentTerms: 'COD',
    paid: 0, paidInETB: 0, balance: 170200, balanceInETB: 170200,
    payments: [], receipts: [], isOverdue: false, isUrgent: true,
    activityLog: [{ date: '2025-03-05', user: 'USR-001', userName: 'Admin', action: 'Urgent local purchase' }],
    createdBy: 'USR-001', createdByName: 'Admin', createdAt: '2025-03-05', updatedAt: '2025-03-05',
  },
  {
    id: 'PO-005', poNumber: 'PO-0005', supplierId: 'SUP-005', supplierName: 'European Sealing Solutions', supplierCode: 'SUP-0005',
    orderDate: '2025-01-10', expectedDelivery: '2025-02-15', receivedDate: '2025-02-18',
    status: 'Received', approvalStatus: 'Approved',
    currency: 'EUR', exchangeRate: 61.2,
    items: [
      makePOItem('EPDM Weather Strip', 5000, 2.5, 'meters', 5000),
      makePOItem('Structural Sealant', 100, 45, 'tubes', 100),
    ],
    subtotal: 17000, discountAmount: 500, taxAmount: 0, shippingCost: 1200, shippingTerms: 'DDP',
    shippingMethod: 'Air',
    insurance: 180, customsDuty: 0, otherCharges: 0,
    total: 17880, totalInETB: 1094256, paymentTerms: 'Net 60',
    paid: 17880, paidInETB: 1094256, balance: 0, balanceInETB: 0,
    payments: [{ id: 'PPAY-005', date: '2025-03-10', amount: 17880, amountInETB: 1094256, method: 'TT', reference: 'TT-20250310-005' }],
    receipts: [{ id: 'REC-005', date: '2025-02-18', receivedBy: 'Warehouse Team', items: [{ itemId: 'POI-3', quantity: 5000, accepted: 4980, rejected: 20 }, { itemId: 'POI-4', quantity: 100, accepted: 100, rejected: 0 }] }],
    isOverdue: false, isUrgent: false,
    activityLog: [
      { date: '2025-01-10', user: 'USR-001', userName: 'Admin', action: 'PO created' },
      { date: '2025-02-18', user: 'USR-003', userName: 'Warehouse', action: 'Goods received and inspected' },
    ],
    createdBy: 'USR-001', createdByName: 'Admin', createdAt: '2025-01-10', updatedAt: '2025-02-18',
  },
];

export const sampleReorderSuggestions: ReorderSuggestion[] = [
  { id: 'RO-001', inventoryItemId: 'INV-001', itemCode: 'ALU-6063', itemName: 'Aluminum Profile 6063-T5', category: 'Profile', currentStock: 150, minStock: 500, availableStock: 120, averageDailyUsage: 25, daysUntilStockout: 5, suggestedQuantity: 2000, suggestedUnit: 'kg', priority: 'Critical', preferredSupplierId: 'SUP-001', preferredSupplierName: 'China Aluminum Corp', estimatedUnitCost: 254.25, estimatedTotalCost: 508500, supplierLeadTime: 45, status: 'Pending' },
  { id: 'RO-002', inventoryItemId: 'INV-005', itemCode: 'GLS-6MM', itemName: 'Clear Glass 6mm', category: 'Glass', currentStock: 80, minStock: 200, availableStock: 60, averageDailyUsage: 10, daysUntilStockout: 6, suggestedQuantity: 300, suggestedUnit: 'sqm', priority: 'High', preferredSupplierId: 'SUP-002', preferredSupplierName: 'Gulf Glass Industries', estimatedUnitCost: 1848, estimatedTotalCost: 554400, supplierLeadTime: 21, status: 'Pending' },
  { id: 'RO-003', inventoryItemId: 'INV-010', itemCode: 'HDL-PREM', itemName: 'Premium Door Handles', category: 'Hardware', currentStock: 45, minStock: 100, availableStock: 30, averageDailyUsage: 3, daysUntilStockout: 10, suggestedQuantity: 200, suggestedUnit: 'pcs', priority: 'Medium', preferredSupplierId: 'SUP-003', preferredSupplierName: 'Turkey Hardware Co.', estimatedUnitCost: 678, estimatedTotalCost: 135600, supplierLeadTime: 28, status: 'Pending' },
  { id: 'RO-004', inventoryItemId: 'INV-015', itemCode: 'SEL-CLR', itemName: 'Silicon Sealant - Clear', category: 'Accessory', currentStock: 30, minStock: 50, availableStock: 25, averageDailyUsage: 5, daysUntilStockout: 5, suggestedQuantity: 200, suggestedUnit: 'pcs', priority: 'High', preferredSupplierId: 'SUP-004', preferredSupplierName: 'Addis Hardware Supply', estimatedUnitCost: 350, estimatedTotalCost: 70000, supplierLeadTime: 3, status: 'Pending' },
];
