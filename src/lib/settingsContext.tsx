// ══════════════════════════════════════════
// GLOBAL SETTINGS CONTEXT
// Provides theme, currency formatting, units, and preferences app-wide
// ══════════════════════════════════════════

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { getStorageItem, setStorageItem } from './localStorage';

// ═══ TYPES ═══

export type Theme = 'light' | 'dark' | 'system';
export type CurrencyCode = 'ETB' | 'USD' | 'EUR' | 'GBP';
export type LengthUnit = 'mm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb';
export type AreaUnit = 'sqm' | 'sqft';
export type DateFormatType = 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';

export interface AppSettings {
  // Display
  theme: Theme;
  compactMode: boolean;
  animationsEnabled: boolean;
  defaultView: 'table' | 'grid' | 'board';
  pageSize: number;

  // Regional
  currency: CurrencyCode;
  lengthUnit: LengthUnit;
  weightUnit: WeightUnit;
  areaUnit: AreaUnit;
  dateFormat: DateFormatType;
  timeFormat: '12h' | '24h';
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  compactMode: false,
  animationsEnabled: true,
  defaultView: 'table',
  pageSize: 25,
  currency: 'ETB',
  lengthUnit: 'mm',
  weightUnit: 'kg',
  areaUnit: 'sqm',
  dateFormat: 'dd/MM/yyyy',
  timeFormat: '24h',
};

const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; prefix: string; locale: string }> = {
  ETB: { symbol: 'ETB', prefix: 'ETB ', locale: 'en-ET' },
  USD: { symbol: '$', prefix: '$ ', locale: 'en-US' },
  EUR: { symbol: '€', prefix: '€ ', locale: 'de-DE' },
  GBP: { symbol: '£', prefix: '£ ', locale: 'en-GB' },
};

const LENGTH_LABELS: Record<LengthUnit, string> = { mm: 'mm', m: 'm', in: 'in', ft: 'ft' };
const WEIGHT_LABELS: Record<WeightUnit, string> = { kg: 'kg', lb: 'lbs' };
const AREA_LABELS: Record<AreaUnit, string> = { sqm: 'm²', sqft: 'ft²' };

// Conversion factors (base: mm for length, kg for weight, sqm for area)
const LENGTH_TO_MM: Record<LengthUnit, number> = { mm: 1, m: 1000, in: 25.4, ft: 304.8 };
const WEIGHT_TO_KG: Record<WeightUnit, number> = { kg: 1, lb: 0.453592 };
const AREA_TO_SQM: Record<AreaUnit, number> = { sqm: 1, sqft: 0.092903 };

// ═══ CONTEXT ═══

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;

  // Formatting helpers
  formatCurrency: (value: number) => string;
  formatCurrencyShort: (value: number) => string;
  formatLength: (valueMm: number) => string;
  formatWeight: (valueKg: number) => string;
  formatArea: (valueSqm: number) => string;
  formatDate: (date: string | Date) => string;
  formatTime: (date: string | Date) => string;

  // Unit labels
  currencySymbol: string;
  lengthLabel: string;
  weightLabel: string;
  areaLabel: string;

  // Theme
  isDark: boolean;
}

const SettingsContext = createContext<SettingsContextType>(null!);

const STORAGE_KEY = 'settings_app';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = getStorageItem<Partial<AppSettings>>(STORAGE_KEY, {});
    return { ...DEFAULT_SETTINGS, ...stored };
  });

  // Resolve effective theme
  const isDark = useMemo(() => {
    if (settings.theme === 'system') {
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return settings.theme === 'dark';
  }, [settings.theme]);

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    if (settings.theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setSettings(prev => ({ ...prev })); // trigger re-render
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [settings.theme]);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      setStorageItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setStorageItem(STORAGE_KEY, DEFAULT_SETTINGS);
  }, []);

  // ═══ FORMATTING HELPERS ═══

  const currencyConfig = CURRENCY_CONFIG[settings.currency];

  const formatCurrency = useCallback((value: number): string => {
    return `${currencyConfig.prefix}${value.toLocaleString()}`;
  }, [currencyConfig]);

  const formatCurrencyShort = useCallback((value: number): string => {
    const prefix = currencyConfig.prefix;
    if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${prefix}${(value / 1_000).toFixed(0)}K`;
    return `${prefix}${value}`;
  }, [currencyConfig]);

  const formatLength = useCallback((valueMm: number): string => {
    const converted = valueMm / LENGTH_TO_MM[settings.lengthUnit];
    const decimals = settings.lengthUnit === 'mm' ? 0 : settings.lengthUnit === 'm' ? 2 : 1;
    return `${converted.toFixed(decimals)} ${LENGTH_LABELS[settings.lengthUnit]}`;
  }, [settings.lengthUnit]);

  const formatWeight = useCallback((valueKg: number): string => {
    const converted = valueKg / WEIGHT_TO_KG[settings.weightUnit];
    return `${converted.toFixed(1)} ${WEIGHT_LABELS[settings.weightUnit]}`;
  }, [settings.weightUnit]);

  const formatArea = useCallback((valueSqm: number): string => {
    const converted = valueSqm / AREA_TO_SQM[settings.areaUnit];
    return `${converted.toFixed(1)} ${AREA_LABELS[settings.areaUnit]}`;
  }, [settings.areaUnit]);

  const formatDate = useCallback((date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return String(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    switch (settings.dateFormat) {
      case 'MM/dd/yyyy': return `${month}/${day}/${year}`;
      case 'yyyy-MM-dd': return `${year}-${month}-${day}`;
      default: return `${day}/${month}/${year}`;
    }
  }, [settings.dateFormat]);

  const formatTime = useCallback((date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return String(date);
    if (settings.timeFormat === '12h') {
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  }, [settings.timeFormat]);

  const ctx = useMemo<SettingsContextType>(() => ({
    settings,
    updateSettings,
    resetSettings,
    formatCurrency,
    formatCurrencyShort,
    formatLength,
    formatWeight,
    formatArea,
    formatDate,
    formatTime,
    currencySymbol: currencyConfig.symbol,
    lengthLabel: LENGTH_LABELS[settings.lengthUnit],
    weightLabel: WEIGHT_LABELS[settings.weightUnit],
    areaLabel: AREA_LABELS[settings.areaUnit],
    isDark,
  }), [settings, updateSettings, resetSettings, formatCurrency, formatCurrencyShort, formatLength, formatWeight, formatArea, formatDate, formatTime, currencyConfig, isDark]);

  return <SettingsContext.Provider value={ctx}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
