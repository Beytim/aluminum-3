// ══════════════════════════════════════════
// ENHANCED ORDER DATA MODEL & SAMPLE DATA
// ══════════════════════════════════════════

export type OrderStatus = 'Draft' | 'Quote Accepted' | 'Payment Received' | 'Processing' | 'Ready' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid';
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'TeleBirr' | 'Cheque' | 'Credit';
export type ShippingMethod = 'Pickup' | 'Local Delivery' | 'Freight' | 'Courier';

export interface EnhancedOrderItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  productNameAm?: string;
  category: string;
  quantity: number;
  quantityShipped: number;
  quantityDelivered: number;
  unitPrice: number;
  unitCost: number;
  discountPercent: number;
  discountAmount: number;
  lineTotal: number;
  lineCost: number;
  lineProfit: number;
  lineMargin: number;
  specifications?: {
    width?: number;
    height?: number;
    profile?: string;
    glass?: string;
    color?: string;
  };
  workOrderId?: string;
  cuttingJobIds?: string[];
  notes?: string;
}

export interface OrderPayment {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  recordedBy: string;
  recordedByName: string;
  createdAt: string;
}

export interface OrderDelivery {
  id: string;
  date: string;
  shippingMethod: ShippingMethod;
  trackingNumber?: string;
  carrier?: string;
  items: { productId: string; productName: string; quantity: number }[];
  receivedBy?: string;
  notes?: string;
  status: 'pending' | 'in_transit' | 'delivered';
  createdAt: string;
}

export interface OrderActivity {
  id: string;
  date: string;
  type: 'status_change' | 'payment' | 'delivery' | 'note' | 'created' | 'updated';
  description: string;
  user: string;
}

export interface EnhancedOrder {
  id: string;
  orderNumber: string;

  // Links
  customerId: string;
  customerName: string;
  customerPhone?: string;
  quoteId?: string;
  quoteNumber?: string;
  projectId?: string;
  projectName?: string;
  workOrderIds: string[];
  cuttingJobIds: string[];

  // Dates
  orderDate: string;
  requestedDelivery: string;
  actualDelivery?: string;
  dueDate: string;

  // Status
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  isOverdue: boolean;

  // Shipping
  shippingMethod?: ShippingMethod;
  shippingAddress?: string;
  trackingNumber?: string;

  // Items
  items: EnhancedOrderItem[];

  // Financial
  subtotal: number;
  discountTotal: number;
  taxRate: number;
  tax: number;
  total: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;

  // Payment
  payments: OrderPayment[];
  totalPaid: number;
  balance: number;
  paymentMethod?: PaymentMethod;

  // Delivery
  deliveries: OrderDelivery[];
  totalShipped: number;
  totalDelivered: number;

  // Activity
  activityLog: OrderActivity[];

  // Notes
  notes?: string;
  internalNotes?: string;

  // Audit
  createdAt: string;
  createdBy: string;
  createdByName: string;
  updatedAt: string;
  updatedBy: string;
  updatedByName: string;
}

export interface OrderStats {
  totalOrders: number;
  totalValue: number;
  totalProfit: number;
  averageMargin: number;
  receivable: number;
  overdueCount: number;
  toShip: number;
  completedOrders: number;
  thisMonthOrders: number;
  thisMonthValue: number;
  paidCount: number;
  partialCount: number;
  unpaidCount: number;
  processingCount: number;
  shippedCount: number;
  byStatus: Record<string, number>;
}

// ═══ HELPERS ═══

export const getOrderStatusColor = (status: OrderStatus): string => {
  const map: Record<OrderStatus, string> = {
    Draft: 'bg-muted text-muted-foreground',
    'Quote Accepted': 'bg-info/10 text-info',
    'Payment Received': 'bg-success/10 text-success',
    Processing: 'bg-primary/10 text-primary',
    Ready: 'bg-accent/10 text-accent-foreground',
    Shipped: 'bg-info/10 text-info',
    Delivered: 'bg-success/10 text-success',
    Completed: 'bg-success/10 text-success',
    Cancelled: 'bg-destructive/10 text-destructive',
  };
  return map[status] || 'bg-muted text-muted-foreground';
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const map: Record<PaymentStatus, string> = {
    Paid: 'bg-success/10 text-success',
    Partial: 'bg-warning/10 text-warning',
    Unpaid: 'bg-destructive/10 text-destructive',
  };
  return map[status];
};

export const formatETB = (value: number): string => {
  if (value >= 1000000) return `ETB ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `ETB ${(value / 1000).toFixed(0)}K`;
  return `ETB ${value.toLocaleString()}`;
};

export const formatETBFull = (value: number): string => `ETB ${value.toLocaleString()}`;

export const calculateOrderStats = (orders: EnhancedOrder[]): OrderStats => {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const thisMonthOrders = orders.filter(o => o.orderDate.startsWith(thisMonth));
  const byStatus: Record<string, number> = {};
  orders.forEach(o => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });

  return {
    totalOrders: orders.length,
    totalValue: orders.reduce((s, o) => s + o.total, 0),
    totalProfit: orders.reduce((s, o) => s + o.totalProfit, 0),
    averageMargin: orders.length > 0 ? orders.reduce((s, o) => s + o.profitMargin, 0) / orders.length : 0,
    receivable: orders.reduce((s, o) => s + o.balance, 0),
    overdueCount: orders.filter(o => o.isOverdue).length,
    toShip: orders.filter(o => ['Payment Received', 'Processing', 'Ready'].includes(o.status)).length,
    completedOrders: orders.filter(o => o.status === 'Completed').length,
    thisMonthOrders: thisMonthOrders.length,
    thisMonthValue: thisMonthOrders.reduce((s, o) => s + o.total, 0),
    paidCount: orders.filter(o => o.paymentStatus === 'Paid').length,
    partialCount: orders.filter(o => o.paymentStatus === 'Partial').length,
    unpaidCount: orders.filter(o => o.paymentStatus === 'Unpaid').length,
    processingCount: orders.filter(o => o.status === 'Processing').length,
    shippedCount: orders.filter(o => o.status === 'Shipped').length,
    byStatus,
  };
};

// ═══ SAMPLE ORDERS (linked to real modules) ═══

export const enhancedSampleOrders: EnhancedOrder[] = [
  {
    id: 'ORD-001', orderNumber: 'ORD-001',
    customerId: 'CUS-001', customerName: 'Ayat Real Estate', customerPhone: '+251-911-234567',
    quoteId: 'QT-002', quoteNumber: 'QT-002',
    projectId: 'PJ-001', projectName: 'Bole Apartments Tower A',
    workOrderIds: ['WO-001', 'WO-002', 'WO-008'], cuttingJobIds: ['CJ-001', 'CJ-002'],
    orderDate: '2025-01-20', requestedDelivery: '2025-04-30', dueDate: '2025-04-30',
    status: 'Processing', paymentStatus: 'Partial', isOverdue: false,
    shippingMethod: 'Local Delivery', shippingAddress: 'Bole, Addis Ababa',
    items: [
      { id: 'OI-001', productId: 'PRD-001', productCode: 'SW-6063-S1', productName: 'Sliding Window 2-Panel', productNameAm: 'ተንሸራታች መስኮት 2-ፓነል', category: 'Windows', quantity: 48, quantityShipped: 20, quantityDelivered: 20, unitPrice: 7200, unitCost: 4500, discountPercent: 0, discountAmount: 0, lineTotal: 345600, lineCost: 216000, lineProfit: 129600, lineMargin: 37.5, specifications: { width: 1200, height: 1500, profile: '6063-T5', glass: '6mm Clear Tempered', color: 'White' }, workOrderId: 'WO-001', cuttingJobIds: ['CJ-001'] },
      { id: 'OI-002', productId: 'PRD-004', productCode: 'SD-6063-D1', productName: 'Sliding Door 3-Panel', productNameAm: 'ተንሸራታች በር 3-ፓነል', category: 'Doors', quantity: 12, quantityShipped: 5, quantityDelivered: 5, unitPrice: 19500, unitCost: 12000, discountPercent: 0, discountAmount: 0, lineTotal: 234000, lineCost: 144000, lineProfit: 90000, lineMargin: 38.5, workOrderId: 'WO-002', cuttingJobIds: ['CJ-002'] },
      { id: 'OI-003', productId: 'PRD-003', productCode: 'FW-6063-S3', productName: 'Fixed Window Large', productNameAm: 'ቋሚ መስኮት ትልቅ', category: 'Windows', quantity: 24, quantityShipped: 10, quantityDelivered: 10, unitPrice: 6000, unitCost: 3800, discountPercent: 0, discountAmount: 0, lineTotal: 144000, lineCost: 91200, lineProfit: 52800, lineMargin: 36.7, workOrderId: 'WO-008' },
    ],
    subtotal: 723600, discountTotal: 0, taxRate: 15, tax: 108540, total: 832140,
    totalCost: 451200, totalProfit: 272400, profitMargin: 37.6,
    payments: [
      { id: 'PAY-001', date: '2025-01-25', amount: 425000, method: 'Bank Transfer', reference: 'TXN-2025-0125', recordedBy: 'EMP-001', recordedByName: 'Abebe Tekle', createdAt: '2025-01-25T10:00:00Z' },
    ],
    totalPaid: 425000, balance: 407140, paymentMethod: 'Bank Transfer',
    deliveries: [
      { id: 'DEL-001', date: '2025-03-01', shippingMethod: 'Local Delivery', items: [{ productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 20 }, { productId: 'PRD-004', productName: 'Sliding Door 3-Panel', quantity: 5 }, { productId: 'PRD-003', productName: 'Fixed Window Large', quantity: 10 }], receivedBy: 'Ato Yonas', status: 'delivered', createdAt: '2025-03-01T09:00:00Z' },
    ],
    totalShipped: 35, totalDelivered: 35,
    activityLog: [
      { id: 'AL-001', date: '2025-01-20', type: 'created', description: 'Order created from QT-002', user: 'Abebe T.' },
      { id: 'AL-002', date: '2025-01-25', type: 'payment', description: 'Payment ETB 425,000 via Bank Transfer', user: 'Finance' },
      { id: 'AL-003', date: '2025-02-10', type: 'status_change', description: 'Status → Processing', user: 'Admin' },
      { id: 'AL-004', date: '2025-03-01', type: 'delivery', description: 'Partial delivery: 35 units', user: 'Logistics' },
    ],
    notes: 'Large order for Tower A. Multiple delivery phases planned.',
    createdAt: '2025-01-20T10:00:00Z', createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
    updatedAt: '2025-03-01T14:00:00Z', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
  },
  {
    id: 'ORD-002', orderNumber: 'ORD-002',
    customerId: 'CUS-003', customerName: 'Ethio Engineering', customerPhone: '+251-913-456789',
    projectId: 'PJ-003', projectName: 'Megenagna Office Complex',
    workOrderIds: ['WO-004', 'WO-007'], cuttingJobIds: [],
    orderDate: '2024-11-05', requestedDelivery: '2025-03-15', dueDate: '2025-03-15',
    status: 'Shipped', paymentStatus: 'Partial', isOverdue: true,
    shippingMethod: 'Local Delivery', shippingAddress: 'Megenagna, Addis Ababa',
    items: [
      { id: 'OI-004', productId: 'PRD-007', productCode: 'CW-6060-C1', productName: 'Curtain Wall System', category: 'Curtain Walls', quantity: 1, quantityShipped: 1, quantityDelivered: 0, unitPrice: 55000, unitCost: 35000, discountPercent: 0, discountAmount: 0, lineTotal: 55000, lineCost: 35000, lineProfit: 20000, lineMargin: 36.4, workOrderId: 'WO-004' },
      { id: 'OI-005', productId: 'PRD-008', productCode: 'HR-6063-H1', productName: 'Glass Handrail System', category: 'Handrails', quantity: 6, quantityShipped: 4, quantityDelivered: 0, unitPrice: 13500, unitCost: 8500, discountPercent: 0, discountAmount: 0, lineTotal: 81000, lineCost: 51000, lineProfit: 30000, lineMargin: 37.0, workOrderId: 'WO-007' },
      { id: 'OI-006', productId: 'PRD-001', productCode: 'SW-6063-S1', productName: 'Sliding Window 2-Panel', category: 'Windows', quantity: 120, quantityShipped: 100, quantityDelivered: 0, unitPrice: 7200, unitCost: 4500, discountPercent: 0, discountAmount: 0, lineTotal: 864000, lineCost: 540000, lineProfit: 324000, lineMargin: 37.5 },
    ],
    subtotal: 1000000, discountTotal: 0, taxRate: 15, tax: 150000, total: 1150000,
    totalCost: 626000, totalProfit: 374000, profitMargin: 37.4,
    payments: [
      { id: 'PAY-002', date: '2024-11-10', amount: 600000, method: 'Bank Transfer', reference: 'TXN-2024-1110', recordedBy: 'EMP-001', recordedByName: 'Abebe Tekle', createdAt: '2024-11-10T10:00:00Z' },
      { id: 'PAY-003', date: '2025-01-15', amount: 300000, method: 'Bank Transfer', reference: 'TXN-2025-0115', recordedBy: 'EMP-001', recordedByName: 'Abebe Tekle', createdAt: '2025-01-15T10:00:00Z' },
    ],
    totalPaid: 900000, balance: 250000,
    deliveries: [],
    totalShipped: 105, totalDelivered: 0,
    activityLog: [
      { id: 'AL-005', date: '2024-11-05', type: 'created', description: 'Order created', user: 'Abebe T.' },
      { id: 'AL-006', date: '2024-11-10', type: 'payment', description: 'Payment ETB 600,000', user: 'Finance' },
      { id: 'AL-007', date: '2025-01-15', type: 'payment', description: 'Payment ETB 300,000', user: 'Finance' },
      { id: 'AL-008', date: '2025-03-05', type: 'status_change', description: 'Status → Shipped', user: 'Logistics' },
    ],
    createdAt: '2024-11-05T10:00:00Z', createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
    updatedAt: '2025-03-05T14:00:00Z', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
  },
  {
    id: 'ORD-003', orderNumber: 'ORD-003',
    customerId: 'CUS-005', customerName: 'Noah Construction', customerPhone: '+251-915-678901',
    quoteId: 'QT-005', quoteNumber: 'QT-005',
    projectId: 'PJ-005', projectName: 'CMC Residential Block',
    workOrderIds: ['WO-005', 'WO-006'], cuttingJobIds: [],
    orderDate: '2024-12-15', requestedDelivery: '2025-03-01', dueDate: '2025-03-01',
    status: 'Ready', paymentStatus: 'Partial', isOverdue: true,
    shippingMethod: 'Pickup', shippingAddress: 'Lideta, Addis Ababa',
    items: [
      { id: 'OI-007', productId: 'PRD-001', productCode: 'SW-6063-S1', productName: 'Sliding Window 2-Panel', category: 'Windows', quantity: 32, quantityShipped: 30, quantityDelivered: 30, unitPrice: 7200, unitCost: 4500, discountPercent: 0, discountAmount: 0, lineTotal: 230400, lineCost: 144000, lineProfit: 86400, lineMargin: 37.5, workOrderId: 'WO-005' },
      { id: 'OI-008', productId: 'PRD-005', productCode: 'HD-6063-D2', productName: 'Hinged Door Double', category: 'Doors', quantity: 8, quantityShipped: 8, quantityDelivered: 8, unitPrice: 15200, unitCost: 9500, discountPercent: 0, discountAmount: 0, lineTotal: 121600, lineCost: 76000, lineProfit: 45600, lineMargin: 37.5, workOrderId: 'WO-006' },
      { id: 'OI-009', productId: 'PRD-009', productCode: 'LV-6063-L1', productName: 'Aluminum Louver Window', category: 'Louvers', quantity: 15, quantityShipped: 10, quantityDelivered: 10, unitPrice: 5600, unitCost: 3500, discountPercent: 0, discountAmount: 0, lineTotal: 84000, lineCost: 52500, lineProfit: 31500, lineMargin: 37.5 },
    ],
    subtotal: 436000, discountTotal: 0, taxRate: 15, tax: 65400, total: 501400,
    totalCost: 272500, totalProfit: 163500, profitMargin: 37.5,
    payments: [
      { id: 'PAY-004', date: '2024-12-20', amount: 390000, method: 'Cash', recordedBy: 'EMP-001', recordedByName: 'Abebe Tekle', createdAt: '2024-12-20T10:00:00Z' },
    ],
    totalPaid: 390000, balance: 111400,
    deliveries: [],
    totalShipped: 48, totalDelivered: 48,
    activityLog: [
      { id: 'AL-009', date: '2024-12-15', type: 'created', description: 'Order created from QT-005', user: 'Abebe T.' },
      { id: 'AL-010', date: '2024-12-20', type: 'payment', description: 'Payment ETB 390,000 Cash', user: 'Finance' },
    ],
    createdAt: '2024-12-15T10:00:00Z', createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
    updatedAt: '2025-02-28T14:00:00Z', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
  },
  {
    id: 'ORD-004', orderNumber: 'ORD-004',
    customerId: 'CUS-006', customerName: 'Commercial Bank Ethiopia', customerPhone: '+251-916-789012',
    projectId: 'PJ-006', projectName: 'CBE Branch Kazanchis',
    workOrderIds: ['WO-009'], cuttingJobIds: [],
    orderDate: '2025-02-12', requestedDelivery: '2025-05-20', dueDate: '2025-05-20',
    status: 'Draft', paymentStatus: 'Partial', isOverdue: false,
    shippingMethod: 'Local Delivery', shippingAddress: 'Kazanchis, Addis Ababa',
    items: [
      { id: 'OI-010', productId: 'PRD-010', productCode: 'PT-6063-P1', productName: 'Office Partition System', category: 'Partitions', quantity: 20, quantityShipped: 0, quantityDelivered: 0, unitPrice: 11500, unitCost: 7200, discountPercent: 0, discountAmount: 0, lineTotal: 230000, lineCost: 144000, lineProfit: 86000, lineMargin: 37.4, workOrderId: 'WO-009' },
      { id: 'OI-011', productId: 'PRD-002', productCode: 'CW-6063-S2', productName: 'Casement Window Single', category: 'Windows', quantity: 15, quantityShipped: 0, quantityDelivered: 0, unitPrice: 5100, unitCost: 3200, discountPercent: 0, discountAmount: 0, lineTotal: 76500, lineCost: 48000, lineProfit: 28500, lineMargin: 37.3 },
    ],
    subtotal: 306500, discountTotal: 0, taxRate: 15, tax: 45975, total: 352475,
    totalCost: 192000, totalProfit: 114500, profitMargin: 37.3,
    payments: [
      { id: 'PAY-005', date: '2025-02-15', amount: 190000, method: 'Bank Transfer', reference: 'TXN-2025-0215', recordedBy: 'EMP-001', recordedByName: 'Abebe Tekle', createdAt: '2025-02-15T10:00:00Z' },
    ],
    totalPaid: 190000, balance: 162475,
    deliveries: [],
    totalShipped: 0, totalDelivered: 0,
    activityLog: [
      { id: 'AL-011', date: '2025-02-12', type: 'created', description: 'Order created', user: 'Abebe T.' },
      { id: 'AL-012', date: '2025-02-15', type: 'payment', description: 'Deposit ETB 190,000', user: 'Finance' },
    ],
    createdAt: '2025-02-12T10:00:00Z', createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
    updatedAt: '2025-02-15T14:00:00Z', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
  },
  {
    id: 'ORD-005', orderNumber: 'ORD-005',
    customerId: 'CUS-002', customerName: 'Ato Kebede Alemu', customerPhone: '+251-912-345678',
    projectId: 'PJ-002', projectName: 'Villa Sunshine Residence',
    workOrderIds: ['WO-003', 'WO-010'], cuttingJobIds: ['CJ-003'],
    orderDate: '2025-02-05', requestedDelivery: '2025-05-15', dueDate: '2025-05-15',
    status: 'Payment Received', paymentStatus: 'Paid', isOverdue: false,
    shippingMethod: 'Local Delivery', shippingAddress: 'CMC, Addis Ababa',
    items: [
      { id: 'OI-012', productId: 'PRD-002', productCode: 'CW-6063-S2', productName: 'Casement Window Single', category: 'Windows', quantity: 16, quantityShipped: 0, quantityDelivered: 0, unitPrice: 5100, unitCost: 3200, discountPercent: 0, discountAmount: 0, lineTotal: 81600, lineCost: 51200, lineProfit: 30400, lineMargin: 37.3, workOrderId: 'WO-003', cuttingJobIds: ['CJ-003'] },
      { id: 'OI-013', productId: 'PRD-009', productCode: 'LV-6063-L1', productName: 'Aluminum Louver Window', category: 'Louvers', quantity: 6, quantityShipped: 0, quantityDelivered: 0, unitPrice: 5600, unitCost: 3500, discountPercent: 0, discountAmount: 0, lineTotal: 33600, lineCost: 21000, lineProfit: 12600, lineMargin: 37.5 },
      { id: 'OI-014', productId: 'PRD-005', productCode: 'HD-6063-D2', productName: 'Hinged Door Double', category: 'Doors', quantity: 4, quantityShipped: 0, quantityDelivered: 0, unitPrice: 15200, unitCost: 9500, discountPercent: 0, discountAmount: 0, lineTotal: 60800, lineCost: 38000, lineProfit: 22800, lineMargin: 37.5, workOrderId: 'WO-010' },
    ],
    subtotal: 176000, discountTotal: 0, taxRate: 15, tax: 26400, total: 202400,
    totalCost: 110200, totalProfit: 65800, profitMargin: 37.4,
    payments: [
      { id: 'PAY-006', date: '2025-02-06', amount: 202400, method: 'TeleBirr', reference: 'TB-2025-0206', recordedBy: 'EMP-001', recordedByName: 'Abebe Tekle', createdAt: '2025-02-06T10:00:00Z' },
    ],
    totalPaid: 202400, balance: 0,
    deliveries: [],
    totalShipped: 0, totalDelivered: 0,
    activityLog: [
      { id: 'AL-013', date: '2025-02-05', type: 'created', description: 'Order created', user: 'Abebe T.' },
      { id: 'AL-014', date: '2025-02-06', type: 'payment', description: 'Full payment ETB 202,400 via TeleBirr', user: 'Finance' },
      { id: 'AL-015', date: '2025-02-06', type: 'status_change', description: 'Status → Payment Received', user: 'System' },
    ],
    createdAt: '2025-02-05T10:00:00Z', createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
    updatedAt: '2025-02-06T14:00:00Z', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
  },
  {
    id: 'ORD-006', orderNumber: 'ORD-006',
    customerId: 'CUS-007', customerName: 'W/ro Tigist Haile', customerPhone: '+251-917-890123',
    projectId: 'PJ-007', projectName: 'Bole Atlas Villa',
    workOrderIds: [], cuttingJobIds: [],
    orderDate: '2024-09-20', requestedDelivery: '2025-01-15', actualDelivery: '2025-01-12', dueDate: '2025-01-15',
    status: 'Completed', paymentStatus: 'Paid', isOverdue: false,
    shippingMethod: 'Local Delivery', shippingAddress: 'Bole Atlas, Addis Ababa',
    items: [
      { id: 'OI-015', productId: 'PRD-001', productCode: 'SW-6063-S1', productName: 'Sliding Window 2-Panel', category: 'Windows', quantity: 10, quantityShipped: 10, quantityDelivered: 10, unitPrice: 7200, unitCost: 4500, discountPercent: 0, discountAmount: 0, lineTotal: 72000, lineCost: 45000, lineProfit: 27000, lineMargin: 37.5 },
      { id: 'OI-016', productId: 'PRD-004', productCode: 'SD-6063-D1', productName: 'Sliding Door 3-Panel', category: 'Doors', quantity: 2, quantityShipped: 2, quantityDelivered: 2, unitPrice: 19500, unitCost: 12000, discountPercent: 0, discountAmount: 0, lineTotal: 39000, lineCost: 24000, lineProfit: 15000, lineMargin: 38.5 },
      { id: 'OI-017', productId: 'PRD-008', productCode: 'HR-6063-H1', productName: 'Glass Handrail System', category: 'Handrails', quantity: 3, quantityShipped: 3, quantityDelivered: 3, unitPrice: 13500, unitCost: 8500, discountPercent: 0, discountAmount: 0, lineTotal: 40500, lineCost: 25500, lineProfit: 15000, lineMargin: 37.0 },
    ],
    subtotal: 151500, discountTotal: 0, taxRate: 15, tax: 22725, total: 174225,
    totalCost: 94500, totalProfit: 57000, profitMargin: 37.6,
    payments: [
      { id: 'PAY-007', date: '2024-09-25', amount: 100000, method: 'Bank Transfer', reference: 'TXN-2024-0925', recordedBy: 'EMP-001', recordedByName: 'Abebe Tekle', createdAt: '2024-09-25T10:00:00Z' },
      { id: 'PAY-008', date: '2025-01-12', amount: 74225, method: 'Bank Transfer', reference: 'TXN-2025-0112', recordedBy: 'EMP-001', recordedByName: 'Abebe Tekle', createdAt: '2025-01-12T10:00:00Z' },
    ],
    totalPaid: 174225, balance: 0,
    deliveries: [
      { id: 'DEL-002', date: '2025-01-12', shippingMethod: 'Local Delivery', items: [{ productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 10 }, { productId: 'PRD-004', productName: 'Sliding Door 3-Panel', quantity: 2 }, { productId: 'PRD-008', productName: 'Glass Handrail System', quantity: 3 }], receivedBy: 'Tigist Haile', status: 'delivered', createdAt: '2025-01-12T09:00:00Z' },
    ],
    totalShipped: 15, totalDelivered: 15,
    activityLog: [
      { id: 'AL-016', date: '2024-09-20', type: 'created', description: 'Order created', user: 'Abebe T.' },
      { id: 'AL-017', date: '2024-09-25', type: 'payment', description: 'Deposit ETB 100,000', user: 'Finance' },
      { id: 'AL-018', date: '2025-01-12', type: 'delivery', description: 'Full delivery completed', user: 'Logistics' },
      { id: 'AL-019', date: '2025-01-12', type: 'payment', description: 'Final payment ETB 74,225', user: 'Finance' },
      { id: 'AL-020', date: '2025-01-15', type: 'status_change', description: 'Status → Completed', user: 'Admin' },
    ],
    createdAt: '2024-09-20T10:00:00Z', createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
    updatedAt: '2025-01-15T14:00:00Z', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
  },
  {
    id: 'ORD-007', orderNumber: 'ORD-007',
    customerId: 'CUS-008', customerName: 'Addis Builders PLC', customerPhone: '+251-918-901234',
    quoteId: 'QT-003', quoteNumber: 'QT-003',
    projectId: 'PJ-008', projectName: 'Residential Complex G+5',
    workOrderIds: [], cuttingJobIds: [],
    orderDate: '2025-02-15', requestedDelivery: '2025-06-01', dueDate: '2025-06-01',
    status: 'Quote Accepted', paymentStatus: 'Unpaid', isOverdue: false,
    shippingMethod: 'Local Delivery',
    items: [
      { id: 'OI-018', productId: 'PRD-001', productCode: 'SW-6063-S1', productName: 'Sliding Window 2-Panel', category: 'Windows', quantity: 60, quantityShipped: 0, quantityDelivered: 0, unitPrice: 7200, unitCost: 4500, discountPercent: 5, discountAmount: 21600, lineTotal: 410400, lineCost: 270000, lineProfit: 140400, lineMargin: 34.2 },
      { id: 'OI-019', productId: 'PRD-005', productCode: 'HD-6063-D2', productName: 'Hinged Door Double', category: 'Doors', quantity: 10, quantityShipped: 0, quantityDelivered: 0, unitPrice: 15200, unitCost: 9500, discountPercent: 0, discountAmount: 0, lineTotal: 152000, lineCost: 95000, lineProfit: 57000, lineMargin: 37.5 },
    ],
    subtotal: 562400, discountTotal: 21600, taxRate: 15, tax: 81120, total: 621920,
    totalCost: 365000, totalProfit: 235320, profitMargin: 37.8,
    payments: [],
    totalPaid: 0, balance: 621920,
    deliveries: [],
    totalShipped: 0, totalDelivered: 0,
    activityLog: [
      { id: 'AL-021', date: '2025-02-15', type: 'created', description: 'Order created from QT-003', user: 'Abebe T.' },
    ],
    createdAt: '2025-02-15T10:00:00Z', createdBy: 'EMP-001', createdByName: 'Abebe Tekle',
    updatedAt: '2025-02-15T10:00:00Z', updatedBy: 'EMP-001', updatedByName: 'Abebe Tekle',
  },
  {
    id: 'ORD-008', orderNumber: 'ORD-008',
    customerId: 'CUS-004', customerName: 'Getahun Hotels PLC', customerPhone: '+251-914-567890',
    quoteId: 'QT-001', quoteNumber: 'QT-001',
    projectId: 'PJ-004', projectName: 'Sarbet Hotel Renovation',
    workOrderIds: [], cuttingJobIds: [],
    orderDate: '2025-03-01', requestedDelivery: '2025-06-30', dueDate: '2025-06-30',
    status: 'Quote Accepted', paymentStatus: 'Unpaid', isOverdue: false,
    shippingMethod: 'Local Delivery', shippingAddress: 'Sarbet, Addis Ababa',
    items: [
      { id: 'OI-020', productId: 'PRD-006', productCode: 'FD-6063-D3', productName: 'Folding Door 4-Panel', category: 'Doors', quantity: 6, quantityShipped: 0, quantityDelivered: 0, unitPrice: 29000, unitCost: 18000, discountPercent: 0, discountAmount: 0, lineTotal: 174000, lineCost: 108000, lineProfit: 66000, lineMargin: 37.9 },
      { id: 'OI-021', productId: 'PRD-003', productCode: 'FW-6063-S3', productName: 'Fixed Window Large', category: 'Windows', quantity: 20, quantityShipped: 0, quantityDelivered: 0, unitPrice: 6000, unitCost: 3800, discountPercent: 0, discountAmount: 0, lineTotal: 120000, lineCost: 76000, lineProfit: 44000, lineMargin: 36.7 },
      { id: 'OI-022', productId: 'PRD-009', productCode: 'LV-6063-L1', productName: 'Aluminum Louver Window', category: 'Louvers', quantity: 12, quantityShipped: 0, quantityDelivered: 0, unitPrice: 5600, unitCost: 3500, discountPercent: 0, discountAmount: 0, lineTotal: 67200, lineCost: 42000, lineProfit: 25200, lineMargin: 37.5 },
    ],
    subtotal: 361200, discountTotal: 0, taxRate: 15, tax: 54180, total: 415380,
    totalCost: 226000, totalProfit: 135200, profitMargin: 37.4,
    payments: [],
    totalPaid: 0, balance: 415380,
    deliveries: [],
    totalShipped: 0, totalDelivered: 0,
    activityLog: [
      { id: 'AL-022', date: '2025-03-01', type: 'created', description: 'Order created from QT-001', user: 'Sales' },
    ],
    createdAt: '2025-03-01T10:00:00Z', createdBy: 'EMP-002', createdByName: 'Hana Mulugeta',
    updatedAt: '2025-03-01T10:00:00Z', updatedBy: 'EMP-002', updatedByName: 'Hana Mulugeta',
  },
];
