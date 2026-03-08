import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Save, Building2, User, Bell, Sliders, Globe, Palette, Shield,
  Mail, Phone, MapPin, Clock, DollarSign, Ruler, Weight, Percent,
  Factory, Package, Scissors, HardHat, Wrench, ClipboardCheck,
  Truck, Users, BarChart3, FileText, ShoppingCart, Warehouse,
  Check, RotateCcw, Download, Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settingsContext";
import { useLocalStorage, STORAGE_KEYS, clearAllStorage } from "@/lib/localStorage";

interface CompanySettings {
  name: string;
  legalName: string;
  taxId: string;
  phone: string;
  phoneSecondary: string;
  email: string;
  website: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  logo: string;
  tagline: string;
}

interface UserPreferences {
  language: string;
  theme: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  weightUnit: string;
  lengthUnit: string;
  areaUnit: string;
  pageSize: number;
  defaultView: string;
  compactMode: boolean;
  animationsEnabled: boolean;
  soundEnabled: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  lowStockAlerts: boolean;
  newOrderAlerts: boolean;
  productionMilestones: boolean;
  qualityAlerts: boolean;
  maintenanceReminders: boolean;
  paymentReminders: boolean;
  hrLeaveApprovals: boolean;
  procurementAlerts: boolean;
  installationSchedule: boolean;
  dailySummary: boolean;
  weeklySummary: boolean;
  criticalAlertsOnly: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

interface PricingDefaults {
  defaultMarkup: number;
  vatRate: number;
  cuttingFee: number;
  installationFee: number;
  transportFee: number;
  warrantyYearsAluminum: number;
  warrantyYearsHardware: number;
  paymentTermsDays: number;
  quoteValidityDays: number;
  depositPercent: number;
}

interface ModuleConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  enabled: boolean;
  description: string;
}

const defaultCompany: CompanySettings = {
  name: "AluERP Manufacturing PLC",
  legalName: "AluERP Window & Door Manufacturing PLC",
  taxId: "0012345678",
  phone: "+251-911-000000",
  phoneSecondary: "+251-911-111111",
  email: "info@aluerp.com",
  website: "www.aluerp.com",
  address: "Bole Sub-City, Woreda 03",
  city: "Addis Ababa",
  country: "Ethiopia",
  postalCode: "1000",
  logo: "",
  tagline: "Premium Aluminum Windows & Doors",
};

const defaultPreferences: UserPreferences = {
  language: "en",
  theme: "light",
  dateFormat: "dd/MM/yyyy",
  timeFormat: "24h",
  currency: "ETB",
  weightUnit: "kg",
  lengthUnit: "mm",
  areaUnit: "sqm",
  pageSize: 25,
  defaultView: "table",
  compactMode: false,
  animationsEnabled: true,
  soundEnabled: false,
};

const defaultNotifications: NotificationSettings = {
  emailNotifications: true,
  lowStockAlerts: true,
  newOrderAlerts: true,
  productionMilestones: true,
  qualityAlerts: true,
  maintenanceReminders: true,
  paymentReminders: true,
  hrLeaveApprovals: true,
  procurementAlerts: false,
  installationSchedule: true,
  dailySummary: false,
  weeklySummary: true,
  criticalAlertsOnly: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
};

const defaultPricing: PricingDefaults = {
  defaultMarkup: 60,
  vatRate: 15,
  cuttingFee: 50,
  installationFee: 250,
  transportFee: 1500,
  warrantyYearsAluminum: 5,
  warrantyYearsHardware: 2,
  paymentTermsDays: 30,
  quoteValidityDays: 15,
  depositPercent: 50,
};

const defaultModules: ModuleConfig[] = [
  { id: "products", name: "Products", icon: Package, enabled: true, description: "Product catalog, BOM, pricing" },
  { id: "inventory", name: "Inventory", icon: Warehouse, enabled: true, description: "Stock tracking, movements, alerts" },
  { id: "production", name: "Production", icon: Factory, enabled: true, description: "Work orders, stage tracking" },
  { id: "cutting", name: "Cutting", icon: Scissors, enabled: true, description: "Cut lists, optimization, waste" },
  { id: "projects", name: "Projects", icon: HardHat, enabled: true, description: "Project management, milestones" },
  { id: "customers", name: "Customers", icon: Users, enabled: true, description: "CRM, contacts, history" },
  { id: "orders", name: "Orders", icon: ShoppingCart, enabled: true, description: "Order processing, fulfillment" },
  { id: "quotes", name: "Quotes", icon: FileText, enabled: true, description: "Quotations, approvals, PDF export" },
  { id: "installation", name: "Installation", icon: Wrench, enabled: true, description: "Scheduling, teams, site tracking" },
  { id: "maintenance", name: "Maintenance", icon: Wrench, enabled: true, description: "Equipment, preventive tasks" },
  { id: "quality", name: "Quality", icon: ClipboardCheck, enabled: true, description: "Inspections, NCRs, defects" },
  { id: "procurement", name: "Procurement", icon: Truck, enabled: true, description: "Suppliers, POs, receiving" },
  { id: "finance", name: "Finance", icon: DollarSign, enabled: true, description: "Invoices, payments, expenses" },
  { id: "hr", name: "HR", icon: Users, enabled: true, description: "Employees, leave, payroll" },
  { id: "reports", name: "Reports", icon: BarChart3, enabled: true, description: "Analytics, cross-module reports" },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const { t, language, setLanguage } = useI18n();
  const { settings: appSettings, updateSettings: updateAppSettings, resetSettings: resetAppSettings } = useSettings();

  const [company, setCompany] = useLocalStorage<CompanySettings>('settings_company', defaultCompany);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('settings_preferences', defaultPreferences);
  const [notifications, setNotifications] = useLocalStorage<NotificationSettings>('settings_notifications', defaultNotifications);
  const [pricing, setPricing] = useLocalStorage<PricingDefaults>('settings_pricing', defaultPricing);
  const [modules, setModules] = useLocalStorage<ModuleConfig[]>('settings_modules', defaultModules);

  const updateCompany = (key: keyof CompanySettings, value: string) => setCompany(prev => ({ ...prev, [key]: value }));
  const updatePref = (key: keyof UserPreferences, value: string | number | boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    // Sync to global settings context for live updates
    const settingsKeyMap: Record<string, string> = {
      language: 'language', theme: 'theme', currency: 'currency',
      weightUnit: 'weightUnit', lengthUnit: 'lengthUnit', areaUnit: 'areaUnit',
      dateFormat: 'dateFormat', timeFormat: 'timeFormat', pageSize: 'pageSize',
      defaultView: 'defaultView', compactMode: 'compactMode',
      animationsEnabled: 'animationsEnabled',
    };
    if (settingsKeyMap[key]) {
      updateAppSettings({ [settingsKeyMap[key]]: value } as any);
    }
    // Language is handled by i18n context
    if (key === 'language') setLanguage(value as 'en' | 'am');
  };
  const updateNotif = (key: keyof NotificationSettings, value: boolean | string) => setNotifications(prev => ({ ...prev, [key]: value }));
  const updatePricing = (key: keyof PricingDefaults, value: number) => setPricing(prev => ({ ...prev, [key]: value }));
  const toggleModule = (id: string) => setModules(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));

  const handleSave = () => {
    toast({ title: "Settings Saved", description: "All your preferences have been updated successfully." });
  };

  const handleReset = () => {
    setCompany(defaultCompany);
    setPreferences(defaultPreferences);
    setNotifications(defaultNotifications);
    setPricing(defaultPricing);
    setModules(defaultModules);
    toast({ title: "Settings Reset", description: "All settings restored to defaults." });
  };

  const handleExportSettings = () => {
    const data = { company, preferences, notifications, pricing, modules };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aluerp-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Settings Exported", description: "Configuration file downloaded." });
  };

  const enabledModuleCount = modules.filter(m => m.enabled).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('nav.settings')}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Configure your business, preferences, notifications & modules</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleExportSettings}>
            <Download className="h-3.5 w-3.5 mr-1.5" />Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />Reset
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-3.5 w-3.5 mr-1.5" />Save All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="company">
        <TabsList className="h-9 flex-wrap">
          <TabsTrigger value="company" className="text-xs gap-1"><Building2 className="h-3.5 w-3.5" />Company</TabsTrigger>
          <TabsTrigger value="preferences" className="text-xs gap-1"><User className="h-3.5 w-3.5" />Preferences</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs gap-1"><Bell className="h-3.5 w-3.5" />Notifications</TabsTrigger>
          <TabsTrigger value="pricing" className="text-xs gap-1"><DollarSign className="h-3.5 w-3.5" />Pricing</TabsTrigger>
          <TabsTrigger value="modules" className="text-xs gap-1"><Sliders className="h-3.5 w-3.5" />Modules</TabsTrigger>
        </TabsList>

        {/* ═══ COMPANY PROFILE ═══ */}
        <TabsContent value="company" className="mt-4 space-y-4">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" />Business Information</CardTitle>
              <CardDescription className="text-xs">Your company details appear on quotes, invoices, and reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label className="text-xs">Business Name</Label><Input value={company.name} onChange={e => updateCompany('name', e.target.value)} /></div>
                <div><Label className="text-xs">Legal Name</Label><Input value={company.legalName} onChange={e => updateCompany('legalName', e.target.value)} /></div>
                <div><Label className="text-xs">Tax ID / TIN</Label><Input value={company.taxId} onChange={e => updateCompany('taxId', e.target.value)} /></div>
                <div><Label className="text-xs">Website</Label><Input value={company.website} onChange={e => updateCompany('website', e.target.value)} /></div>
              </div>
              <div><Label className="text-xs">Tagline</Label><Input value={company.tagline} onChange={e => updateCompany('tagline', e.target.value)} placeholder="Short description for headers" /></div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label className="text-xs">Primary Phone</Label><Input value={company.phone} onChange={e => updateCompany('phone', e.target.value)} /></div>
                <div><Label className="text-xs">Secondary Phone</Label><Input value={company.phoneSecondary} onChange={e => updateCompany('phoneSecondary', e.target.value)} /></div>
                <div><Label className="text-xs">Email</Label><Input type="email" value={company.email} onChange={e => updateCompany('email', e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label className="text-xs">Street Address</Label><Input value={company.address} onChange={e => updateCompany('address', e.target.value)} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><Label className="text-xs">City</Label><Input value={company.city} onChange={e => updateCompany('city', e.target.value)} /></div>
                <div><Label className="text-xs">Country</Label><Input value={company.country} onChange={e => updateCompany('country', e.target.value)} /></div>
                <div><Label className="text-xs">Postal Code</Label><Input value={company.postalCode} onChange={e => updateCompany('postalCode', e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ USER PREFERENCES ═══ */}
        <TabsContent value="preferences" className="mt-4 space-y-4">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Globe className="h-4 w-4 text-primary" />Language & Regional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Language</Label>
                  <Select value={preferences.language} onValueChange={v => updatePref('language', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Date Format</Label>
                  <Select value={preferences.dateFormat} onValueChange={v => updatePref('dateFormat', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Time Format</Label>
                  <Select value={preferences.timeFormat} onValueChange={v => updatePref('timeFormat', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 Hour</SelectItem>
                      <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Ruler className="h-4 w-4 text-primary" />Units & Currency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs">Currency</Label>
                  <Select value={preferences.currency} onValueChange={v => updatePref('currency', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETB">ETB (Birr)</SelectItem>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                      <SelectItem value="GBP">£ GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Weight</Label>
                  <Select value={preferences.weightUnit} onValueChange={v => updatePref('weightUnit', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="lb">Pounds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Length</Label>
                  <Select value={preferences.lengthUnit} onValueChange={v => updatePref('lengthUnit', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm">Millimeters</SelectItem>
                      <SelectItem value="m">Meters</SelectItem>
                      <SelectItem value="in">Inches</SelectItem>
                      <SelectItem value="ft">Feet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Area</Label>
                  <Select value={preferences.areaUnit} onValueChange={v => updatePref('areaUnit', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqm">sq meters</SelectItem>
                      <SelectItem value="sqft">sq feet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Palette className="h-4 w-4 text-primary" />Display</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Theme</Label>
                  <Select value={preferences.theme} onValueChange={v => updatePref('theme', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Default View</Label>
                  <Select value={preferences.defaultView} onValueChange={v => updatePref('defaultView', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="table">Table View</SelectItem>
                      <SelectItem value="grid">Grid / Card View</SelectItem>
                      <SelectItem value="board">Board / Kanban</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Rows Per Page</Label>
                  <Select value={String(preferences.pageSize)} onValueChange={v => updatePref('pageSize', Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium">Compact Mode</Label>
                    <p className="text-[10px] text-muted-foreground">Reduce spacing for more data density</p>
                  </div>
                  <Switch checked={preferences.compactMode} onCheckedChange={v => updatePref('compactMode', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium">Animations</Label>
                    <p className="text-[10px] text-muted-foreground">Enable smooth transitions and effects</p>
                  </div>
                  <Switch checked={preferences.animationsEnabled} onCheckedChange={v => updatePref('animationsEnabled', v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium">Sound Effects</Label>
                    <p className="text-[10px] text-muted-foreground">Play sounds for alerts and actions</p>
                  </div>
                  <Switch checked={preferences.soundEnabled} onCheckedChange={v => updatePref('soundEnabled', v)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ NOTIFICATIONS ═══ */}
        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Bell className="h-4 w-4 text-primary" />Alert Preferences</CardTitle>
              <CardDescription className="text-xs">Choose which notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div>
                  <Label className="text-xs font-medium">Email Notifications</Label>
                  <p className="text-[10px] text-muted-foreground">Master toggle for all email alerts</p>
                </div>
                <Switch checked={notifications.emailNotifications} onCheckedChange={v => updateNotif('emailNotifications', v)} />
              </div>

              <Separator />

              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground mb-2">MODULE ALERTS</p>
                {[
                  { key: 'lowStockAlerts' as const, label: 'Low Stock Alerts', desc: 'When inventory falls below minimum', icon: Package },
                  { key: 'newOrderAlerts' as const, label: 'New Order Notifications', desc: 'When a new order is placed', icon: ShoppingCart },
                  { key: 'productionMilestones' as const, label: 'Production Milestones', desc: 'Stage completions and delays', icon: Factory },
                  { key: 'qualityAlerts' as const, label: 'Quality Alerts', desc: 'Failed inspections and new NCRs', icon: ClipboardCheck },
                  { key: 'maintenanceReminders' as const, label: 'Maintenance Reminders', desc: 'Upcoming and overdue tasks', icon: Wrench },
                  { key: 'paymentReminders' as const, label: 'Payment Reminders', desc: 'Overdue invoices and payments', icon: DollarSign },
                  { key: 'hrLeaveApprovals' as const, label: 'HR & Leave Approvals', desc: 'Leave requests awaiting action', icon: Users },
                  { key: 'procurementAlerts' as const, label: 'Procurement Alerts', desc: 'PO status changes and deliveries', icon: Truck },
                  { key: 'installationSchedule' as const, label: 'Installation Schedule', desc: 'Upcoming installations this week', icon: Wrench },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-xs font-medium">{item.label}</Label>
                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch checked={notifications[item.key]} onCheckedChange={v => updateNotif(item.key, v)} />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground mb-2">SUMMARY REPORTS</p>
                <div className="flex items-center justify-between py-2">
                  <div><Label className="text-xs font-medium">Daily Summary</Label><p className="text-[10px] text-muted-foreground">End-of-day activity digest</p></div>
                  <Switch checked={notifications.dailySummary} onCheckedChange={v => updateNotif('dailySummary', v)} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div><Label className="text-xs font-medium">Weekly Summary</Label><p className="text-[10px] text-muted-foreground">Monday morning business overview</p></div>
                  <Switch checked={notifications.weeklySummary} onCheckedChange={v => updateNotif('weeklySummary', v)} />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground">QUIET HOURS</p>
                <div className="flex items-center justify-between">
                  <div><Label className="text-xs font-medium">Critical Alerts Only</Label><p className="text-[10px] text-muted-foreground">During quiet hours, only send critical alerts</p></div>
                  <Switch checked={notifications.criticalAlertsOnly} onCheckedChange={v => updateNotif('criticalAlertsOnly', v)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-xs">Start</Label><Input type="time" value={notifications.quietHoursStart} onChange={e => updateNotif('quietHoursStart', e.target.value)} /></div>
                  <div><Label className="text-xs">End</Label><Input type="time" value={notifications.quietHoursEnd} onChange={e => updateNotif('quietHoursEnd', e.target.value)} /></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ PRICING DEFAULTS ═══ */}
        <TabsContent value="pricing" className="mt-4 space-y-4">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Percent className="h-4 w-4 text-primary" />Markup & Tax</CardTitle>
              <CardDescription className="text-xs">Default values applied to new quotes and orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><Label className="text-xs">Default Markup %</Label><Input type="number" value={pricing.defaultMarkup} onChange={e => updatePricing('defaultMarkup', Number(e.target.value))} /></div>
                <div><Label className="text-xs">VAT Rate %</Label><Input type="number" value={pricing.vatRate} onChange={e => updatePricing('vatRate', Number(e.target.value))} /></div>
                <div><Label className="text-xs">Deposit %</Label><Input type="number" value={pricing.depositPercent} onChange={e => updatePricing('depositPercent', Number(e.target.value))} /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" />Service Fees (ETB)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><Label className="text-xs">Cutting Fee (per cut)</Label><Input type="number" value={pricing.cuttingFee} onChange={e => updatePricing('cuttingFee', Number(e.target.value))} /></div>
                <div><Label className="text-xs">Installation (per sqm)</Label><Input type="number" value={pricing.installationFee} onChange={e => updatePricing('installationFee', Number(e.target.value))} /></div>
                <div><Label className="text-xs">Transport (base)</Label><Input type="number" value={pricing.transportFee} onChange={e => updatePricing('transportFee', Number(e.target.value))} /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Terms & Warranty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div><Label className="text-xs">Payment Terms (days)</Label><Input type="number" value={pricing.paymentTermsDays} onChange={e => updatePricing('paymentTermsDays', Number(e.target.value))} /></div>
                <div><Label className="text-xs">Quote Validity (days)</Label><Input type="number" value={pricing.quoteValidityDays} onChange={e => updatePricing('quoteValidityDays', Number(e.target.value))} /></div>
                <div><Label className="text-xs">Warranty - Aluminum (yrs)</Label><Input type="number" value={pricing.warrantyYearsAluminum} onChange={e => updatePricing('warrantyYearsAluminum', Number(e.target.value))} /></div>
                <div><Label className="text-xs">Warranty - Hardware (yrs)</Label><Input type="number" value={pricing.warrantyYearsHardware} onChange={e => updatePricing('warrantyYearsHardware', Number(e.target.value))} /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══ MODULE CONFIGURATION ═══ */}
        <TabsContent value="modules" className="mt-4 space-y-4">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm flex items-center gap-2"><Sliders className="h-4 w-4 text-primary" />Module Configuration</CardTitle>
                  <CardDescription className="text-xs">Enable or disable modules to customize your workspace</CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">{enabledModuleCount}/{modules.length} active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {modules.map(mod => (
                  <div
                    key={mod.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      mod.enabled
                        ? 'bg-primary/5 border-primary/20 hover:border-primary/40'
                        : 'bg-muted/30 border-border opacity-60 hover:opacity-80'
                    }`}
                    onClick={() => toggleModule(mod.id)}
                  >
                    <div className={`p-2 rounded-md ${mod.enabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <mod.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{mod.name}</span>
                        <Switch checked={mod.enabled} onCheckedChange={() => toggleModule(mod.id)} onClick={e => e.stopPropagation()} />
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{mod.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-destructive/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-destructive"><Shield className="h-4 w-4" />Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">Clear All Local Data</p>
                  <p className="text-[10px] text-muted-foreground">Remove all saved data including orders, customers, and settings</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    clearAllStorage();
                    toast({ title: "Data Cleared", description: "All local data has been removed. Refresh to see defaults.", variant: "destructive" });
                  }}
                >
                  Clear Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
