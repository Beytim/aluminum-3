// ══════════════════════════════════════════
// BILINGUAL SUPPORT (English / Amharic)
// ══════════════════════════════════════════

import React, { createContext, useContext, useState, useCallback } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from './localStorage';

export type Language = 'en' | 'am';

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', am: 'ዳሽቦርድ' },
  'nav.products': { en: 'Products', am: 'ምርቶች' },
  'nav.inventory': { en: 'Inventory', am: 'ክምችት' },
  'nav.production': { en: 'Production', am: 'ምርት' },
  'nav.cutting': { en: 'Cutting', am: 'መቁረጫ' },
  'nav.projects': { en: 'Projects', am: 'ፕሮጀክቶች' },
  'nav.customers': { en: 'Customers', am: 'ደንበኞች' },
  'nav.quotes': { en: 'Quotes', am: 'ዋጋ ግምት' },
  'nav.installation': { en: 'Installation', am: 'ማስገጠም' },
  'nav.maintenance': { en: 'Maintenance', am: 'ጥገና' },
  'nav.quality': { en: 'Quality', am: 'ጥራት' },
  'nav.procurement': { en: 'Procurement', am: 'ግዥ' },
  'nav.finance': { en: 'Finance', am: 'ፋይናንስ' },
  'nav.hr': { en: 'HR', am: 'ሰው ሀብት' },
  'nav.reports': { en: 'Reports', am: 'ሪፖርቶች' },
  'nav.settings': { en: 'Settings', am: 'ቅንብሮች' },
  'nav.users': { en: 'Users', am: 'ተጠቃሚዎች' },

  // Dashboard
  'dash.active_projects': { en: 'Active Projects', am: 'ንቁ ፕሮጀክቶች' },
  'dash.in_production': { en: 'In Production', am: 'በምርት ላይ' },
  'dash.ready_install': { en: 'Ready to Install', am: 'ለማስገጠም ዝግጁ' },
  'dash.monthly_revenue': { en: 'Monthly Revenue', am: 'ወርሃዊ ገቢ' },
  'dash.welcome': { en: 'Welcome back. Here\'s your business overview.', am: 'እንኳን ደህና መጡ። የንግድ ሥራ ዝርዝር ከዚህ በታች ይመልከቱ።' },
  'dash.low_stock_alerts': { en: 'Low Stock Alerts', am: 'ዝቅተኛ ክምችት ማሳወቂያ' },
  'dash.recent_activity': { en: 'Recent Activity', am: 'የቅርብ ጊዜ ተግባራት' },
  'dash.revenue_target': { en: 'Revenue vs Target', am: 'ገቢ vs ዒላማ' },
  'dash.projects_type': { en: 'Projects by Type', am: 'በዓይነት ፕሮጀክቶች' },
  'dash.today_installs': { en: "Today's Installations", am: 'የዛሬ ማስገጠሚያዎች' },
  'dash.quick_actions': { en: 'Quick Actions', am: 'ፈጣን ድርጊቶች' },

  // Common
  'common.search': { en: 'Search...', am: 'ፈልግ...' },
  'common.add': { en: 'Add', am: 'ጨምር' },
  'common.edit': { en: 'Edit', am: 'አርም' },
  'common.delete': { en: 'Delete', am: 'ሰርዝ' },
  'common.save': { en: 'Save', am: 'አስቀምጥ' },
  'common.cancel': { en: 'Cancel', am: 'ሰርዝ' },
  'common.export': { en: 'Export', am: 'ላክ' },
  'common.import': { en: 'Import', am: 'አስገባ' },
  'common.filter': { en: 'Filter', am: 'አጣራ' },
  'common.status': { en: 'Status', am: 'ሁኔታ' },
  'common.actions': { en: 'Actions', am: 'ድርጊቶች' },
  'common.total': { en: 'Total', am: 'ጠቅላላ' },
  'common.name': { en: 'Name', am: 'ስም' },
  'common.date': { en: 'Date', am: 'ቀን' },
  'common.amount': { en: 'Amount', am: 'መጠን' },
  'common.no_data': { en: 'No data found', am: 'ምንም ውሂብ አልተገኘም' },

  // Products
  'products.title': { en: 'Product Catalog', am: 'የምርት ካታሎግ' },
  'products.add': { en: 'Add Product', am: 'ምርት ጨምር' },
  'products.category': { en: 'Category', am: 'ምድብ' },
  'products.material_cost': { en: 'Material Cost', am: 'የቁሳቁስ ዋጋ' },
  'products.selling_price': { en: 'Selling Price', am: 'የሽያጭ ዋጋ' },

  // Inventory
  'inventory.title': { en: 'Inventory Management', am: 'የክምችት አስተዳደር' },
  'inventory.low_stock': { en: 'Low Stock', am: 'ዝቅተኛ ክምችት' },
  'inventory.receive': { en: 'Receive Stock', am: 'ክምችት ቀበል' },
  'inventory.issue': { en: 'Issue Stock', am: 'ክምችት ስጥ' },

  // Production
  'production.title': { en: 'Production Management', am: 'የምርት አስተዳደር' },
  'production.work_order': { en: 'Work Order', am: 'የሥራ ትዕዛዝ' },
  'production.stages': { en: 'Production Stages', am: 'የምርት ደረጃዎች' },

  // Finance
  'finance.title': { en: 'Finance', am: 'ፋይናንስ' },
  'finance.invoices': { en: 'Invoices', am: 'ደረሰኞች' },
  'finance.payments': { en: 'Payments', am: 'ክፍያዎች' },
  'finance.overdue': { en: 'Overdue', am: 'ያለፈው ጊዜ' },

  // HR
  'hr.title': { en: 'Human Resources', am: 'ሰው ሀብት' },
  'hr.employees': { en: 'Employees', am: 'ሰራተኞች' },
  'hr.attendance': { en: 'Attendance', am: 'ቅጥሪ' },
  'hr.payroll': { en: 'Payroll', am: 'ደመወዝ' },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>(
    () => getStorageItem(STORAGE_KEYS.LANGUAGE, 'en') as Language
  );

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    setStorageItem(STORAGE_KEYS.LANGUAGE, lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
