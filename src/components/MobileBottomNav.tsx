import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Factory, DollarSign } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage } from "@/lib/localStorage";

const allNavItems = [
  { path: "/", icon: LayoutDashboard, labelKey: "nav.dashboard", moduleId: null },
  { path: "/projects", icon: FolderKanban, labelKey: "nav.projects", moduleId: "projects" },
  { path: "/production", icon: Factory, labelKey: "nav.production", moduleId: "production" },
  { path: "/finance", icon: DollarSign, labelKey: "nav.finance", moduleId: "finance" },
];

interface ModuleToggle { id: string; enabled: boolean }

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
              <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
              {isActive && (
                <div className="absolute top-0 w-10 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
