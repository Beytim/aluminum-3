import {
  LayoutDashboard, Package, Boxes, Factory, Scissors, FolderKanban,
  Users, FileText, Wrench, ShieldCheck, ClipboardCheck, Truck,
  DollarSign, UserCog, BarChart3, Settings, Globe, Moon, Sun,
  Search, Building2, ShoppingCart, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage } from "@/lib/localStorage";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const allModules = [
  { title: 'nav.dashboard', url: '/', icon: LayoutDashboard, moduleId: null },
  { title: 'nav.products', url: '/products', icon: Package, moduleId: 'products' },
  { title: 'nav.inventory', url: '/inventory', icon: Boxes, moduleId: 'inventory' },
  { title: 'nav.production', url: '/production', icon: Factory, moduleId: 'production' },
  { title: 'nav.cutting', url: '/cutting', icon: Scissors, moduleId: 'cutting' },
  { title: 'nav.projects', url: '/projects', icon: FolderKanban, moduleId: 'projects' },
  { title: 'nav.customers', url: '/customers', icon: Users, moduleId: 'customers' },
  { title: 'Orders', url: '/orders', icon: ShoppingCart, moduleId: 'orders' },
  { title: 'nav.quotes', url: '/quotes', icon: FileText, moduleId: 'quotes' },
  { title: 'nav.installation', url: '/installation', icon: Wrench, moduleId: 'installation' },
  { title: 'nav.maintenance', url: '/maintenance', icon: ShieldCheck, moduleId: 'maintenance' },
  { title: 'nav.quality', url: '/quality', icon: ClipboardCheck, moduleId: 'quality' },
  { title: 'nav.procurement', url: '/procurement', icon: Truck, moduleId: 'procurement' },
  { title: 'nav.finance', url: '/finance', icon: DollarSign, moduleId: 'finance' },
  { title: 'nav.hr', url: '/hr', icon: UserCog, moduleId: 'hr' },
  { title: 'nav.reports', url: '/reports', icon: BarChart3, moduleId: 'reports' },
  { title: 'nav.users', url: '/users', icon: Building2, moduleId: null },
  { title: 'nav.settings', url: '/settings', icon: Settings, moduleId: null },
];

interface ModuleToggle { id: string; enabled: boolean }

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { t, language, setLanguage } = useI18n();
  const [moduleSettings] = useLocalStorage<ModuleToggle[]>('settings_modules', []);

  const disabledIds = new Set(moduleSettings.filter(m => !m.enabled).map(m => m.id));
  const modules = allModules.filter(m => m.moduleId === null || !disabledIds.has(m.moduleId));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-md gradient-primary flex items-center justify-center">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-sidebar-primary-foreground">AluERP</h1>
              <p className="text-[10px] text-sidebar-foreground/60">Window & Door MFG</p>
            </div>
          </div>
        )}
        {!collapsed && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-sidebar-foreground/40" />
            <Input
              placeholder={t('common.search')}
              className="pl-8 h-8 text-xs bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
            />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider">
            Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 mr-2 shrink-0" />
                      {!collapsed && <span className="text-xs">{t(item.title)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!collapsed && (
        <SidebarFooter className="p-3 border-t border-sidebar-border space-y-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 h-7 text-[10px] ${language === 'en' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/60'}`}
              onClick={() => setLanguage('en')}
            >
              <Globe className="h-3 w-3 mr-1" />EN
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 h-7 text-[10px] ${language === 'am' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/60'}`}
              onClick={() => setLanguage('am')}
            >
              <Globe className="h-3 w-3 mr-1" />አማ
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-medium text-sidebar-accent-foreground">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-primary-foreground truncate">Admin User</p>
              <p className="text-[10px] text-sidebar-foreground/50">admin@aluerp.com</p>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
