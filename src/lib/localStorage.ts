// ══════════════════════════════════════════
// LOCAL STORAGE PERSISTENCE LAYER
// ══════════════════════════════════════════

const STORAGE_PREFIX = 'aluerp_';

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

export function removeStorageItem(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key);
}

export function clearAllStorage(): void {
  Object.keys(localStorage)
    .filter(k => k.startsWith(STORAGE_PREFIX))
    .forEach(k => localStorage.removeItem(k));
}

// Storage keys enum
export const STORAGE_KEYS = {
  PRODUCTS: 'products',
  PROJECTS: 'projects',
  CUSTOMERS: 'customers',
  QUOTES: 'quotes',
  ORDERS: 'orders',
  INVENTORY: 'inventory',
  WORK_ORDERS: 'work_orders',
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
  EMPLOYEES: 'employees',
  SUPPLIERS: 'suppliers',
  INSTALLATIONS: 'installations',
  QUALITY_CHECKS: 'quality_checks',
  INSPECTIONS: 'inspections',
  NCRS: 'ncrs',
  CUSTOMER_COMPLAINTS: 'customer_complaints',
  MAINTENANCE_TASKS: 'maintenance_tasks',
  CUTTING_JOBS: 'cutting_jobs',
  PURCHASE_ORDERS: 'purchase_orders',
  STOCK_ADJUSTMENTS: 'stock_adjustments',
  SETTINGS: 'settings',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

// Hook for reactive localStorage
import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => getStorageItem(key, defaultValue));

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      setStorageItem(key, newValue);
      return newValue;
    });
  }, [key]);

  return [storedValue, setValue];
}
