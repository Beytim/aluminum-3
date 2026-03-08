import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { I18nProvider } from "@/lib/i18n";
import { SettingsProvider } from "@/lib/settingsContext";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Production from "./pages/Production";
import Cutting from "./pages/Cutting";
import Projects from "./pages/Projects";
import Customers from "./pages/Customers";
import Quotes from "./pages/Quotes";
import Installation from "./pages/Installation";
import Maintenance from "./pages/Maintenance";
import Quality from "./pages/Quality";
import Procurement from "./pages/Procurement";
import Finance from "./pages/Finance";
import HR from "./pages/HR";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import SettingsPage from "./pages/SettingsPage";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SettingsProvider>
        <I18nProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/production" element={<Production />} />
                        <Route path="/cutting" element={<Cutting />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/quotes" element={<Quotes />} />
                        <Route path="/installation" element={<Installation />} />
                        <Route path="/maintenance" element={<Maintenance />} />
                        <Route path="/quality" element={<Quality />} />
                        <Route path="/procurement" element={<Procurement />} />
                        <Route path="/finance" element={<Finance />} />
                        <Route path="/hr" element={<HR />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </I18nProvider>
      </SettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
