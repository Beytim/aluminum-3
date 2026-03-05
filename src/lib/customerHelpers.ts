// ══════════════════════════════════════════
// CUSTOMER HELPER FUNCTIONS
// ══════════════════════════════════════════

import type { Customer, EnhancedCustomer, CustomerHealthResult, FrequentProduct } from '@/data/customerTypes';

export function calculateCustomerHealth(customer: EnhancedCustomer): CustomerHealthResult {
  const paymentScore = customer.paymentHistory
    ? Math.max(0, 100 - (customer.paymentHistory.late / Math.max(1, customer.paymentHistory.onTime + customer.paymentHistory.late)) * 100)
    : 70;

  const maxValue = 5000000;
  const projectValueScore = Math.min(100, (customer.totalValue / maxValue) * 100);

  const projectFreqScore = Math.min(100, (customer.projects / 10) * 100);

  const outstandingRatio = customer.totalValue > 0
    ? (1 - customer.outstanding / customer.totalValue) * 100
    : 100;

  const score = Math.round(
    paymentScore * 0.4 +
    projectValueScore * 0.25 +
    projectFreqScore * 0.2 +
    outstandingRatio * 0.15
  );

  let status: CustomerHealthResult['status'] = 'healthy';
  if (score < 30) status = 'critical';
  else if (score < 50) status = 'at-risk';
  else if (score < 70) status = 'attention';

  return {
    score,
    status,
    factors: {
      paymentHistory: Math.round(paymentScore),
      projectValue: Math.round(projectValueScore),
      projectFrequency: Math.round(projectFreqScore),
      outstandingRatio: Math.round(outstandingRatio),
    },
  };
}

export function calculateCreditMetrics(customer: EnhancedCustomer) {
  const limit = customer.creditLimit || 0;
  const used = customer.outstanding;
  return {
    used,
    available: Math.max(0, limit - used),
    utilization: limit > 0 ? Math.round((used / limit) * 100) : 0,
  };
}

export function calculateLifetimeValue(customer: EnhancedCustomer): number {
  return customer.totalValue;
}

export function generateCustomerCode(existingCount: number): string {
  return `CUST-${String(existingCount + 1).padStart(4, '0')}`;
}

export function findDuplicates(
  customers: EnhancedCustomer[],
  newCustomer: Partial<EnhancedCustomer>
): EnhancedCustomer[] {
  return customers.filter(c => {
    if (newCustomer.email && c.email && c.email.toLowerCase() === newCustomer.email.toLowerCase()) return true;
    if (newCustomer.phone && c.phone === newCustomer.phone) return true;
    if (newCustomer.name && c.name.toLowerCase() === newCustomer.name.toLowerCase()) return true;
    return false;
  });
}

export function getHealthColor(status: string) {
  switch (status) {
    case 'healthy': return 'text-success';
    case 'attention': return 'text-warning';
    case 'at-risk': return 'text-orange-500';
    case 'critical': return 'text-destructive';
    default: return 'text-muted-foreground';
  }
}

export function getHealthBgColor(status: string) {
  switch (status) {
    case 'healthy': return 'bg-success/10';
    case 'attention': return 'bg-warning/10';
    case 'at-risk': return 'bg-orange-500/10';
    case 'critical': return 'bg-destructive/10';
    default: return 'bg-muted';
  }
}

export function formatETB(amount: number): string {
  return `ETB ${amount.toLocaleString()}`;
}

export function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}
