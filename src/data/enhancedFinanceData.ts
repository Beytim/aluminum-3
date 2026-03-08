// ══════════════════════════════════════════
// ENHANCED FINANCE DATA MODEL & SAMPLE DATA
// ══════════════════════════════════════════

export type InvoiceStatus = 'Draft' | 'Sent' | 'Partial' | 'Paid' | 'Overdue' | 'Cancelled' | 'Credit Note';
export type FinancePaymentMethod = 'Cash' | 'Bank Transfer' | 'TeleBirr' | 'Cheque' | 'Credit Card' | 'CBE Birr' | 'HelloCash' | 'Mobile Money';
export type Currency = 'ETB' | 'USD' | 'EUR' | 'CNY' | 'GBP';
export type ExpenseCategory = 'Materials' | 'Labor' | 'Equipment' | 'Transport' | 'Utilities' | 'Rent' | 'Salaries' | 'Marketing' | 'Other';

export interface EnhancedInvoiceItem {
  id: string;
  productId?: string;
  productName?: string;
  productCode?: string;
  workOrderId?: string;
  projectId?: string;
  orderId?: string;
  installationId?: string;
  maintenanceId?: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  netPrice: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
  lineTotalWithTax: number;
  costPrice?: number;
  profit?: number;
  margin?: number;
}

export interface EnhancedInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  customerTaxId?: string;
  customerAddress?: string;
  projectId?: string;
  projectName?: string;
  orderId?: string;
  orderNumber?: string;
  quoteId?: string;
  quoteNumber?: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: InvoiceStatus;
  currency: Currency;
  exchangeRate: number;
  items: EnhancedInvoiceItem[];
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  shippingCost: number;
  otherCharges: number;
  chargesDescription?: string;
  total: number;
  totalInETB: number;
  payments: EnhancedPayment[];
  totalPaid: number;
  totalPaidInETB: number;
  balance: number;
  balanceInETB: number;
  paymentTerms: string;
  paymentDueDays: number;
  notes?: string;
  termsAndConditions?: string;
  internalNotes?: string;
  isOverdue: boolean;
  isFullyPaid: boolean;
  activityLog: { date: string; user: string; userName: string; action: string; notes?: string }[];
  createdAt: string;
  createdBy: string;
  createdByName: string;
  updatedAt: string;
}

export interface EnhancedPayment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  amount: number;
  currency: Currency;
  exchangeRate: number;
  amountInETB: number;
  method: FinancePaymentMethod;
  reference: string;
  bankName?: string;
  accountNumber?: string;
  transactionId?: string;
  chequeNumber?: string;
  phoneNumber?: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Reversed' | 'Bounced';
  reconciled: boolean;
  reconciledDate?: string;
  notes?: string;
  recordedBy: string;
  recordedByName: string;
  recordedAt: string;
}

export interface Expense {
  id: string;
  expenseNumber: string;
  supplierId?: string;
  supplierName?: string;
  projectId?: string;
  projectName?: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency: Currency;
  exchangeRate: number;
  amountInETB: number;
  taxRate: number;
  taxAmount: number;
  paymentMethod: FinancePaymentMethod;
  paid: boolean;
  paidDate?: string;
  notes?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface CreditNote {
  id: string;
  creditNoteNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  reason: 'Return' | 'Damage' | 'Shortage' | 'Quality' | 'Goodwill' | 'Other';
  amount: number;
  currency: Currency;
  amountInETB: number;
  notes?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

// ═══ EXCHANGE RATES (to ETB) ═══
export const exchangeRates: Record<Currency, number> = {
  ETB: 1,
  USD: 56.5,
  EUR: 61.2,
  CNY: 7.8,
  GBP: 71.5,
};

// ═══ HELPER FUNCTIONS ═══

export const getInvoiceStatusColor = (status: InvoiceStatus): string => {
  const map: Record<InvoiceStatus, string> = {
    Draft: 'bg-muted text-muted-foreground',
    Sent: 'bg-info/10 text-info',
    Partial: 'bg-warning/10 text-warning',
    Paid: 'bg-success/10 text-success',
    Overdue: 'bg-destructive/10 text-destructive',
    Cancelled: 'bg-muted text-muted-foreground',
    'Credit Note': 'bg-purple-500/10 text-purple-500',
  };
  return map[status] || 'bg-muted text-muted-foreground';
};

export const getPaymentMethodColor = (method: FinancePaymentMethod): string => {
  const map: Record<string, string> = {
    Cash: 'bg-success/10 text-success',
    'Bank Transfer': 'bg-primary/10 text-primary',
    TeleBirr: 'bg-info/10 text-info',
    Cheque: 'bg-warning/10 text-warning',
    'Credit Card': 'bg-purple-500/10 text-purple-500',
    'CBE Birr': 'bg-info/10 text-info',
    HelloCash: 'bg-accent/10 text-accent',
    'Mobile Money': 'bg-accent/10 text-accent',
  };
  return map[method] || 'bg-muted text-muted-foreground';
};

export const formatCurrency = (amount: number, currency: Currency = 'ETB'): string => {
  const symbols: Record<Currency, string> = { ETB: 'ETB', USD: '$', EUR: '€', CNY: '¥', GBP: '£' };
  return `${symbols[currency]} ${amount.toLocaleString()}`;
};

export const formatETB = (amount: number): string => `ETB ${amount.toLocaleString()}`;

export const formatETBShort = (amount: number): string => {
  if (amount >= 1_000_000) return `ETB ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `ETB ${(amount / 1_000).toFixed(0)}K`;
  return `ETB ${amount.toLocaleString()}`;
};

export const daysOverdue = (dueDate: string): number => {
  const diff = new Date().getTime() - new Date(dueDate).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const calculateVAT = (amount: number): number => amount * 0.15;

export interface FinanceStats {
  totalRevenueMTD: number;
  totalRevenueYTD: number;
  averageInvoiceValue: number;
  totalReceivables: number;
  overdueReceivables: number;
  overduePercentage: number;
  avgDaysOutstanding: number;
  currentCashBalance: number;
  grossProfitMTD: number;
  grossMarginMTD: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  totalPaymentsMTD: number;
  totalExpensesMTD: number;
  paymentMethodBreakdown: Record<string, number>;
  revenueTrend: { month: string; amount: number }[];
}

export const calculateFinanceStats = (invoices: EnhancedInvoice[], payments: EnhancedPayment[], expenses: Expense[]): FinanceStats => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const mtdInvoices = invoices.filter(i => {
    const d = new Date(i.issueDate);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const ytdInvoices = invoices.filter(i => new Date(i.issueDate).getFullYear() === thisYear);
  const mtdPayments = payments.filter(p => {
    const d = new Date(p.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const mtdExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const totalRevenueMTD = mtdInvoices.reduce((s, i) => s + i.totalInETB, 0);
  const totalRevenueYTD = ytdInvoices.reduce((s, i) => s + i.totalInETB, 0);
  const totalReceivables = invoices.filter(i => i.status !== 'Paid' && i.status !== 'Cancelled').reduce((s, i) => s + i.balanceInETB, 0);
  const overdueInvs = invoices.filter(i => i.isOverdue);
  const overdueReceivables = overdueInvs.reduce((s, i) => s + i.balanceInETB, 0);
  const totalPaidMTD = mtdPayments.reduce((s, p) => s + p.amountInETB, 0);
  const totalExpMTD = mtdExpenses.reduce((s, e) => s + e.amountInETB, 0);

  const methodBreakdown: Record<string, number> = {};
  payments.forEach(p => { methodBreakdown[p.method] = (methodBreakdown[p.method] || 0) + p.amountInETB; });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueTrend = months.slice(0, thisMonth + 1).map((m, idx) => ({
    month: m,
    amount: ytdInvoices.filter(i => new Date(i.issueDate).getMonth() === idx).reduce((s, i) => s + i.totalInETB, 0),
  }));

  return {
    totalRevenueMTD: totalRevenueMTD,
    totalRevenueYTD,
    averageInvoiceValue: invoices.length ? invoices.reduce((s, i) => s + i.totalInETB, 0) / invoices.length : 0,
    totalReceivables,
    overdueReceivables,
    overduePercentage: totalReceivables > 0 ? (overdueReceivables / totalReceivables) * 100 : 0,
    avgDaysOutstanding: 32,
    currentCashBalance: totalPaidMTD - totalExpMTD + 1_500_000,
    grossProfitMTD: totalRevenueMTD * 0.35,
    grossMarginMTD: 35,
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter(i => i.status === 'Paid').length,
    unpaidInvoices: invoices.filter(i => !['Paid', 'Cancelled'].includes(i.status)).length,
    overdueInvoices: overdueInvs.length,
    totalPaymentsMTD: totalPaidMTD,
    totalExpensesMTD: totalExpMTD,
    paymentMethodBreakdown: methodBreakdown,
    revenueTrend,
  };
};

// ═══ SAMPLE DATA ═══

const makeItems = (desc: string, qty: number, price: number, prodId?: string): EnhancedInvoiceItem => {
  const disc = 0;
  const net = price;
  const lineTotal = qty * net;
  const tax = lineTotal * 0.15;
  return {
    id: `ITEM-${Math.random().toString(36).slice(2, 7)}`,
    productId: prodId,
    productName: desc,
    productCode: prodId,
    description: desc,
    quantity: qty,
    unit: 'pcs',
    unitPrice: price,
    discountPercent: disc,
    discountAmount: 0,
    netPrice: net,
    taxRate: 15,
    taxAmount: tax,
    lineTotal,
    lineTotalWithTax: lineTotal + tax,
    costPrice: price * 0.6,
    profit: lineTotal * 0.4,
    margin: 40,
  };
};

export const sampleEnhancedInvoices: EnhancedInvoice[] = [
  {
    id: 'INV-001', invoiceNumber: 'INV-0001',
    customerId: 'CUS-001', customerName: 'Ayat Real Estate', customerCode: 'CUST-0001', customerTaxId: 'TIN-0012345', customerAddress: 'Bole, Addis Ababa',
    projectId: 'PJ-001', projectName: 'Bole Tower A Windows',
    orderId: 'ORD-001', orderNumber: 'ORD-0001',
    issueDate: '2025-02-01', dueDate: '2025-03-03', status: 'Partial',
    currency: 'ETB', exchangeRate: 1,
    items: [
      makeItems('Sliding Window 2-Panel', 48, 7200, 'PRD-001'),
      makeItems('Fixed Window Large', 24, 6000, 'PRD-003'),
    ],
    subtotal: 489600, discountAmount: 0, taxableAmount: 489600, taxRate: 15, taxAmount: 73440,
    shippingCost: 15000, otherCharges: 0, total: 578040, totalInETB: 578040,
    payments: [], totalPaid: 300000, totalPaidInETB: 300000, balance: 278040, balanceInETB: 278040,
    paymentTerms: 'Net 30', paymentDueDays: 30,
    notes: 'First phase delivery', isOverdue: false, isFullyPaid: false,
    activityLog: [
      { date: '2025-02-01', user: 'USR-001', userName: 'Admin', action: 'Invoice created' },
      { date: '2025-02-10', user: 'USR-002', userName: 'Finance', action: 'Payment recorded ETB 300,000' },
    ],
    createdAt: '2025-02-01', createdBy: 'USR-001', createdByName: 'Admin', updatedAt: '2025-02-10',
  },
  {
    id: 'INV-002', invoiceNumber: 'INV-0002',
    customerId: 'CUS-002', customerName: 'Ato Kebede Alemu', customerCode: 'CUST-0002', customerAddress: 'CMC, Addis Ababa',
    projectId: 'PJ-002', projectName: 'Villa Renovation',
    issueDate: '2025-01-15', dueDate: '2025-02-14', status: 'Overdue',
    currency: 'ETB', exchangeRate: 1,
    items: [makeItems('Casement Window', 12, 8500, 'PRD-002')],
    subtotal: 102000, discountAmount: 0, taxableAmount: 102000, taxRate: 15, taxAmount: 15300,
    shippingCost: 5000, otherCharges: 0, total: 122300, totalInETB: 122300,
    payments: [], totalPaid: 50000, totalPaidInETB: 50000, balance: 72300, balanceInETB: 72300,
    paymentTerms: 'COD', paymentDueDays: 30,
    isOverdue: true, isFullyPaid: false,
    activityLog: [{ date: '2025-01-15', user: 'USR-001', userName: 'Admin', action: 'Invoice created' }],
    createdAt: '2025-01-15', createdBy: 'USR-001', createdByName: 'Admin', updatedAt: '2025-01-15',
  },
  {
    id: 'INV-003', invoiceNumber: 'INV-0003',
    customerId: 'CUS-003', customerName: 'Sunshine Construction', customerCode: 'CUST-0003', customerAddress: 'Kirkos, Addis Ababa',
    projectId: 'PJ-003', projectName: 'Kirkos Office Complex',
    orderId: 'ORD-003', orderNumber: 'ORD-0003',
    issueDate: '2025-02-20', dueDate: '2025-03-22', status: 'Sent',
    currency: 'ETB', exchangeRate: 1,
    items: [
      makeItems('Curtain Wall System', 6, 45000, 'PRD-005'),
      makeItems('Entrance Door Double', 4, 28000, 'PRD-006'),
    ],
    subtotal: 382000, discountAmount: 10000, taxableAmount: 372000, taxRate: 15, taxAmount: 55800,
    shippingCost: 20000, otherCharges: 5000, chargesDescription: 'Crane rental', total: 452800, totalInETB: 452800,
    payments: [], totalPaid: 0, totalPaidInETB: 0, balance: 452800, balanceInETB: 452800,
    paymentTerms: 'Net 30', paymentDueDays: 30,
    isOverdue: false, isFullyPaid: false,
    activityLog: [{ date: '2025-02-20', user: 'USR-001', userName: 'Admin', action: 'Invoice created and sent' }],
    createdAt: '2025-02-20', createdBy: 'USR-001', createdByName: 'Admin', updatedAt: '2025-02-20',
  },
  {
    id: 'INV-004', invoiceNumber: 'INV-0004',
    customerId: 'CUS-004', customerName: 'Wzo. Meron Tadesse', customerCode: 'CUST-0004', customerAddress: 'Summit, Addis Ababa',
    projectId: 'PJ-004', projectName: 'Summit Residence',
    issueDate: '2025-01-05', dueDate: '2025-02-04', paidDate: '2025-01-28', status: 'Paid',
    currency: 'ETB', exchangeRate: 1,
    items: [makeItems('Sliding Door 3-Panel', 6, 19500, 'PRD-004')],
    subtotal: 117000, discountAmount: 5000, taxableAmount: 112000, taxRate: 15, taxAmount: 16800,
    shippingCost: 8000, otherCharges: 0, total: 136800, totalInETB: 136800,
    payments: [], totalPaid: 136800, totalPaidInETB: 136800, balance: 0, balanceInETB: 0,
    paymentTerms: 'Net 30', paymentDueDays: 30,
    isOverdue: false, isFullyPaid: true,
    activityLog: [
      { date: '2025-01-05', user: 'USR-001', userName: 'Admin', action: 'Invoice created' },
      { date: '2025-01-28', user: 'USR-002', userName: 'Finance', action: 'Full payment received' },
    ],
    createdAt: '2025-01-05', createdBy: 'USR-001', createdByName: 'Admin', updatedAt: '2025-01-28',
  },
  {
    id: 'INV-005', invoiceNumber: 'INV-0005',
    customerId: 'CUS-005', customerName: 'Global Trading PLC', customerCode: 'CUST-0005', customerAddress: 'Megenagna, Addis Ababa',
    orderId: 'ORD-005', orderNumber: 'ORD-0005',
    issueDate: '2025-02-25', dueDate: '2025-03-27', status: 'Draft',
    currency: 'USD', exchangeRate: 56.5,
    items: [makeItems('Aluminum Sheet 4x8', 100, 85)],
    subtotal: 8500, discountAmount: 0, taxableAmount: 8500, taxRate: 15, taxAmount: 1275,
    shippingCost: 500, otherCharges: 0, total: 10275, totalInETB: 580537.5,
    payments: [], totalPaid: 0, totalPaidInETB: 0, balance: 10275, balanceInETB: 580537.5,
    paymentTerms: 'Net 45', paymentDueDays: 45,
    isOverdue: false, isFullyPaid: false,
    activityLog: [{ date: '2025-02-25', user: 'USR-001', userName: 'Admin', action: 'Draft invoice created' }],
    createdAt: '2025-02-25', createdBy: 'USR-001', createdByName: 'Admin', updatedAt: '2025-02-25',
  },
  {
    id: 'INV-006', invoiceNumber: 'INV-0006',
    customerId: 'CUS-001', customerName: 'Ayat Real Estate', customerCode: 'CUST-0001', customerAddress: 'Bole, Addis Ababa',
    projectId: 'PJ-001', projectName: 'Bole Tower A Windows',
    issueDate: '2025-03-01', dueDate: '2025-03-31', status: 'Sent',
    currency: 'ETB', exchangeRate: 1,
    items: [makeItems('Handrail System', 20, 12000, 'PRD-007')],
    subtotal: 240000, discountAmount: 0, taxableAmount: 240000, taxRate: 15, taxAmount: 36000,
    shippingCost: 10000, otherCharges: 0, total: 286000, totalInETB: 286000,
    payments: [], totalPaid: 0, totalPaidInETB: 0, balance: 286000, balanceInETB: 286000,
    paymentTerms: 'Net 30', paymentDueDays: 30,
    isOverdue: false, isFullyPaid: false,
    activityLog: [{ date: '2025-03-01', user: 'USR-001', userName: 'Admin', action: 'Invoice created' }],
    createdAt: '2025-03-01', createdBy: 'USR-001', createdByName: 'Admin', updatedAt: '2025-03-01',
  },
];

export const sampleEnhancedPayments: EnhancedPayment[] = [
  {
    id: 'PAY-001', paymentNumber: 'PAY-0001',
    invoiceId: 'INV-001', invoiceNumber: 'INV-0001',
    customerId: 'CUS-001', customerName: 'Ayat Real Estate',
    date: '2025-02-10', amount: 200000, currency: 'ETB', exchangeRate: 1, amountInETB: 200000,
    method: 'Bank Transfer', reference: 'TXN-2025-0210-001', bankName: 'CBE', transactionId: 'CBE-87654321',
    status: 'Completed', reconciled: true, reconciledDate: '2025-02-11',
    recordedBy: 'USR-002', recordedByName: 'Finance Team', recordedAt: '2025-02-10',
  },
  {
    id: 'PAY-002', paymentNumber: 'PAY-0002',
    invoiceId: 'INV-001', invoiceNumber: 'INV-0001',
    customerId: 'CUS-001', customerName: 'Ayat Real Estate',
    date: '2025-02-20', amount: 100000, currency: 'ETB', exchangeRate: 1, amountInETB: 100000,
    method: 'TeleBirr', reference: 'TB-98765432', phoneNumber: '+251-911-234567',
    status: 'Completed', reconciled: true, reconciledDate: '2025-02-21',
    recordedBy: 'USR-002', recordedByName: 'Finance Team', recordedAt: '2025-02-20',
  },
  {
    id: 'PAY-003', paymentNumber: 'PAY-0003',
    invoiceId: 'INV-002', invoiceNumber: 'INV-0002',
    customerId: 'CUS-002', customerName: 'Ato Kebede Alemu',
    date: '2025-01-25', amount: 50000, currency: 'ETB', exchangeRate: 1, amountInETB: 50000,
    method: 'Cash', reference: 'CASH-20250125',
    status: 'Completed', reconciled: false,
    recordedBy: 'USR-002', recordedByName: 'Finance Team', recordedAt: '2025-01-25',
  },
  {
    id: 'PAY-004', paymentNumber: 'PAY-0004',
    invoiceId: 'INV-004', invoiceNumber: 'INV-0004',
    customerId: 'CUS-004', customerName: 'Wzo. Meron Tadesse',
    date: '2025-01-28', amount: 136800, currency: 'ETB', exchangeRate: 1, amountInETB: 136800,
    method: 'Bank Transfer', reference: 'TXN-2025-0128-003', bankName: 'Awash Bank',
    status: 'Completed', reconciled: true, reconciledDate: '2025-01-29',
    recordedBy: 'USR-002', recordedByName: 'Finance Team', recordedAt: '2025-01-28',
  },
  {
    id: 'PAY-005', paymentNumber: 'PAY-0005',
    invoiceId: 'INV-002', invoiceNumber: 'INV-0002',
    customerId: 'CUS-002', customerName: 'Ato Kebede Alemu',
    date: '2025-03-01', amount: 20000, currency: 'ETB', exchangeRate: 1, amountInETB: 20000,
    method: 'CBE Birr', reference: 'CBB-12345',
    status: 'Pending', reconciled: false,
    recordedBy: 'USR-002', recordedByName: 'Finance Team', recordedAt: '2025-03-01',
  },
];

export const sampleExpenses: Expense[] = [
  {
    id: 'EXP-001', expenseNumber: 'EXP-0001',
    supplierId: 'SUP-001', supplierName: 'China Aluminum Corp',
    date: '2025-02-05', category: 'Materials', description: 'Aluminum profiles import - Q1 batch',
    amount: 850000, currency: 'ETB', exchangeRate: 1, amountInETB: 850000,
    taxRate: 15, taxAmount: 127500, paymentMethod: 'Bank Transfer', paid: true, paidDate: '2025-02-05',
    createdBy: 'USR-001', createdByName: 'Admin', createdAt: '2025-02-05',
  },
  {
    id: 'EXP-002', expenseNumber: 'EXP-0002',
    projectId: 'PJ-001', projectName: 'Bole Tower A Windows',
    date: '2025-02-15', category: 'Transport', description: 'Delivery to Bole site',
    amount: 25000, currency: 'ETB', exchangeRate: 1, amountInETB: 25000,
    taxRate: 15, taxAmount: 3750, paymentMethod: 'Cash', paid: true, paidDate: '2025-02-15',
    createdBy: 'USR-002', createdByName: 'Finance Team', createdAt: '2025-02-15',
  },
  {
    id: 'EXP-003', expenseNumber: 'EXP-0003',
    date: '2025-02-28', category: 'Salaries', description: 'February 2025 payroll',
    amount: 420000, currency: 'ETB', exchangeRate: 1, amountInETB: 420000,
    taxRate: 0, taxAmount: 0, paymentMethod: 'Bank Transfer', paid: true, paidDate: '2025-02-28',
    createdBy: 'USR-001', createdByName: 'Admin', createdAt: '2025-02-28',
  },
  {
    id: 'EXP-004', expenseNumber: 'EXP-0004',
    date: '2025-03-01', category: 'Utilities', description: 'Factory electricity - March',
    amount: 35000, currency: 'ETB', exchangeRate: 1, amountInETB: 35000,
    taxRate: 15, taxAmount: 5250, paymentMethod: 'Bank Transfer', paid: false,
    createdBy: 'USR-002', createdByName: 'Finance Team', createdAt: '2025-03-01',
  },
  {
    id: 'EXP-005', expenseNumber: 'EXP-0005',
    date: '2025-03-05', category: 'Equipment', description: 'Cutting blade replacement',
    amount: 18000, currency: 'ETB', exchangeRate: 1, amountInETB: 18000,
    taxRate: 15, taxAmount: 2700, paymentMethod: 'Cash', paid: true, paidDate: '2025-03-05',
    createdBy: 'USR-001', createdByName: 'Admin', createdAt: '2025-03-05',
  },
];

export const sampleCreditNotes: CreditNote[] = [
  {
    id: 'CN-001', creditNoteNumber: 'CN-0001',
    invoiceId: 'INV-002', invoiceNumber: 'INV-0002',
    customerId: 'CUS-002', customerName: 'Ato Kebede Alemu',
    date: '2025-02-20', reason: 'Quality',
    amount: 8500, currency: 'ETB', amountInETB: 8500,
    notes: 'Credit for damaged window frame during delivery',
    createdBy: 'USR-001', createdByName: 'Admin', createdAt: '2025-02-20',
  },
];
