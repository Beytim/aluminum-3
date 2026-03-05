// ══════════════════════════════════════════
// ENHANCED CUSTOMER TYPES
// ══════════════════════════════════════════

export interface CustomerActivityLog {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'quote' | 'order' | 'project' | 'payment';
  date: string;
  user: string;
  description: string;
  followUpDate?: string;
  completed: boolean;
  relatedId?: string;
  relatedType?: string;
}

export interface FrequentProduct {
  productId: string;
  productName: string;
  category: string;
  count: number;
  totalValue: number;
  lastOrdered: string;
  averageQuantity: number;
}

export interface CreditHistoryEntry {
  date: string;
  amount: number;
  type: 'increase' | 'decrease' | 'used';
  reason: string;
}

export interface PaymentHistoryData {
  onTime: number;
  late: number;
  averageDaysLate: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
}

export interface CustomerHealthResult {
  score: number;
  status: 'healthy' | 'attention' | 'at-risk' | 'critical';
  factors: {
    paymentHistory: number;
    projectValue: number;
    projectFrequency: number;
    outstandingRatio: number;
  };
}

export interface EnhancedCustomer {
  // Core
  id: string;
  code: string;
  name: string;
  nameAm: string;
  contact: string;
  type: 'Individual' | 'Company' | 'Contractor' | 'Developer' | 'Retail' | 'Wholesale' | 'Fabricator' | 'Distributor';
  phone: string;
  phoneSecondary?: string;
  email: string;
  address: string;
  shippingAddress?: string;
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  source?: string;
  projects: number;
  totalValue: number;
  outstanding: number;
  status: 'Active' | 'Inactive';
  notes?: string;

  // Module connections
  projectIds?: string[];
  quoteIds?: string[];
  orderIds?: string[];

  // Products connection
  frequentProducts?: FrequentProduct[];

  // Business info
  website?: string;
  socialMedia?: {
    facebook?: string;
    telegram?: string;
    whatsapp?: string;
  };

  // Location
  location?: {
    city: string;
    subCity: string;
  };

  // Credit
  creditHistory?: CreditHistoryEntry[];
  paymentHistory?: PaymentHistoryData;

  // Health
  healthScore: number;
  healthStatus: 'healthy' | 'attention' | 'at-risk' | 'critical';

  // Activity
  lastActivityDate?: string;
  lastActivityType?: 'quote' | 'order' | 'project' | 'payment' | 'call' | 'email';
  customerSince: string;

  // Communication
  preferredContact: 'phone' | 'email' | 'whatsapp' | 'in-person' | 'telegram';
  language: 'en' | 'am' | 'both';

  // Segmentation
  tags: string[];
  segments: ('residential' | 'commercial' | 'government' | 'contractors')[];

  // Activity log
  activityLog?: CustomerActivityLog[];

  // Referral
  referredBy?: string;
  referralCount: number;

  // Audit
  createdAt: string;
  updatedAt: string;
}

// Re-export the old Customer type for backwards compatibility
export type { Customer } from '@/data/sampleData';
