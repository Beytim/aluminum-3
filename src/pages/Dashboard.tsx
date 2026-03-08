import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FileText, PackagePlus, ClipboardList, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";

// Enhanced data imports
import { enhancedSampleProducts, calculateProductStats, type EnhancedProduct } from "@/data/enhancedProductData";
import { enhancedSampleInventory, sampleStockMovements, calculateInventoryStats, type EnhancedInventoryItem, type StockMovement } from "@/data/enhancedInventoryData";
import { enhancedSampleWorkOrders, enhancedSampleCuttingJobs, calculateProductionStats, calculateCuttingStats, type EnhancedWorkOrder, type EnhancedCuttingJob } from "@/data/enhancedProductionData";
import { enhancedSampleProjects, calculateProjectStats, type EnhancedProject } from "@/data/enhancedProjectData";
import { enhancedCustomers } from "@/data/enhancedCustomerData";
import type { EnhancedCustomer } from "@/data/customerTypes";
import { enhancedSampleOrders, calculateOrderStats, type EnhancedOrder } from "@/data/enhancedOrderData";
import { enhancedSampleQuotes, calculateQuoteStats, type EnhancedQuote } from "@/data/enhancedQuoteData";
import { sampleEnhancedInstallations, calculateInstallationStats, type EnhancedInstallation } from "@/data/enhancedInstallationData";
import { sampleEnhancedMaintenanceTasks, sampleEquipment, calculateMaintenanceStats, type EnhancedMaintenanceTask, type Equipment } from "@/data/enhancedMaintenanceData";
import { sampleEnhancedInspections, sampleNCRs, sampleComplaints, calculateQualityStats, type EnhancedInspection, type NCR, type CustomerComplaint } from "@/data/enhancedQualityData";
import { sampleEnhancedSuppliers, sampleEnhancedPOs, sampleReorderSuggestions, calculateProcurementStats, type EnhancedSupplier, type EnhancedPurchaseOrder, type ReorderSuggestion } from "@/data/enhancedProcurementData";
import { sampleEnhancedInvoices, sampleEnhancedPayments, sampleExpenses, calculateFinanceStats, type EnhancedInvoice, type EnhancedPayment, type Expense } from "@/data/enhancedFinanceData";
import { sampleEnhancedEmployees, sampleLeaveRequests, samplePayrolls, calculateHRStats, type EnhancedEmployee, type LeaveRequest, type Payroll } from "@/data/enhancedHRData";

// Dashboard components
import DashboardKPIGrid, { DollarSign, TrendingUp, Package, Users, ShoppingCart, Wrench, Shield, Truck as TruckIcon, Warehouse, Factory, Scissors, HardHat, UserCheck } from "@/components/dashboard/DashboardKPIGrid";
import ModuleSummaryCard from "@/components/dashboard/ModuleSummaryCard";
import DashboardAlerts from "@/components/dashboard/DashboardAlerts";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

const fmtETB = (v: number) => v >= 1_000_000 ? `ETB ${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `ETB ${(v / 1_000).toFixed(0)}K` : `ETB ${v}`;

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, language } = useI18n();

  // Load all module data
  const [products] = useLocalStorage<EnhancedProduct[]>(STORAGE_KEYS.PRODUCTS, enhancedSampleProducts);
  const [inventory] = useLocalStorage<EnhancedInventoryItem[]>(STORAGE_KEYS.INVENTORY, enhancedSampleInventory);
  const [stockMovements] = useLocalStorage<StockMovement[]>(STORAGE_KEYS.STOCK_ADJUSTMENTS, sampleStockMovements);
  const [workOrders] = useLocalStorage<EnhancedWorkOrder[]>(STORAGE_KEYS.WORK_ORDERS, enhancedSampleWorkOrders);
  const [cuttingJobs] = useLocalStorage<EnhancedCuttingJob[]>(STORAGE_KEYS.CUTTING_JOBS, enhancedSampleCuttingJobs);
  const [projects] = useLocalStorage<EnhancedProject[]>(STORAGE_KEYS.PROJECTS, enhancedSampleProjects);
  const [customers] = useLocalStorage<EnhancedCustomer[]>(STORAGE_KEYS.CUSTOMERS, enhancedCustomers);
  const [orders] = useLocalStorage<EnhancedOrder[]>(STORAGE_KEYS.ORDERS, enhancedSampleOrders);
  const [quotes] = useLocalStorage<EnhancedQuote[]>(STORAGE_KEYS.QUOTES, enhancedSampleQuotes);
  const [installations] = useLocalStorage<EnhancedInstallation[]>(STORAGE_KEYS.INSTALLATIONS, sampleEnhancedInstallations);
  const [maintenanceTasks] = useLocalStorage<EnhancedMaintenanceTask[]>(STORAGE_KEYS.MAINTENANCE_TASKS, sampleEnhancedMaintenanceTasks);
  const [equipment] = useLocalStorage<Equipment[]>('equipment', sampleEquipment);
  const [inspections] = useLocalStorage<EnhancedInspection[]>(STORAGE_KEYS.INSPECTIONS, sampleEnhancedInspections);
  const [ncrs] = useLocalStorage<NCR[]>(STORAGE_KEYS.NCRS, sampleNCRs);
  const [complaints] = useLocalStorage<CustomerComplaint[]>(STORAGE_KEYS.CUSTOMER_COMPLAINTS, sampleComplaints);
  const [suppliers] = useLocalStorage<EnhancedSupplier[]>(STORAGE_KEYS.SUPPLIERS, sampleEnhancedSuppliers);
  const [purchaseOrders] = useLocalStorage<EnhancedPurchaseOrder[]>(STORAGE_KEYS.PURCHASE_ORDERS, sampleEnhancedPOs);
  const [reorders] = useLocalStorage<ReorderSuggestion[]>('reorders', sampleReorderSuggestions);
  const [invoices] = useLocalStorage<EnhancedInvoice[]>(STORAGE_KEYS.INVOICES, sampleEnhancedInvoices);
  const [paymentsData] = useLocalStorage<EnhancedPayment[]>(STORAGE_KEYS.PAYMENTS, sampleEnhancedPayments);
  const [expensesData] = useLocalStorage<Expense[]>('expenses', sampleExpenses);
  const [employees] = useLocalStorage<EnhancedEmployee[]>(STORAGE_KEYS.ENHANCED_EMPLOYEES, sampleEnhancedEmployees);
  const [leaveRequests] = useLocalStorage<LeaveRequest[]>(STORAGE_KEYS.LEAVE_REQUESTS, sampleLeaveRequests);
  const [payrolls] = useLocalStorage<Payroll[]>(STORAGE_KEYS.PAYROLLS, samplePayrolls);

  // Calculate all stats
  const productStats = useMemo(() => calculateProductStats(products), [products]);
  const inventoryStats = useMemo(() => calculateInventoryStats(inventory, stockMovements), [inventory, stockMovements]);
  const productionStats = useMemo(() => calculateProductionStats(workOrders), [workOrders]);
  const cuttingStats = useMemo(() => calculateCuttingStats(cuttingJobs), [cuttingJobs]);
  const projectStats = useMemo(() => calculateProjectStats(projects), [projects]);
  const orderStats = useMemo(() => calculateOrderStats(orders), [orders]);
  const quoteStats = useMemo(() => calculateQuoteStats(quotes), [quotes]);
  const installationStats = useMemo(() => calculateInstallationStats(installations), [installations]);
  const maintenanceStats = useMemo(() => calculateMaintenanceStats(maintenanceTasks, equipment), [maintenanceTasks, equipment]);
  const qualityStats = useMemo(() => calculateQualityStats(inspections, ncrs, complaints), [inspections, ncrs, complaints]);
  const procurementStats = useMemo(() => calculateProcurementStats(suppliers, purchaseOrders, reorders), [suppliers, purchaseOrders, reorders]);
  const financeStats = useMemo(() => calculateFinanceStats(invoices, paymentsData, expensesData), [invoices, paymentsData, expensesData]);
  const hrStats = useMemo(() => calculateHRStats(employees, leaveRequests, payrolls), [employees, leaveRequests, payrolls]);

  // Top-level KPI cards (8)
  const topKPIs = [
    { icon: DollarSign, label: 'Revenue MTD', value: fmtETB(financeStats.totalRevenueMTD), sub: `${invoices.length} invoices`, trend: 'up' as const, trendValue: `Profit: ${fmtETB(financeStats.grossProfitMTD)}`, color: 'bg-primary' },
    { icon: ShoppingCart, label: 'Orders', value: `${orderStats.totalOrders} total`, sub: `${fmtETB(orderStats.totalValue)}`, trend: 'up' as const, trendValue: `${orderStats.processingCount} processing`, color: 'bg-chart-2' },
    { icon: Factory, label: 'Production', value: `${productionStats.activeWorkOrders} active`, sub: `${productionStats.completedWorkOrders} completed`, trend: 'up' as const, trendValue: `${productionStats.onTimeRate.toFixed(0)}% on-time`, color: 'bg-chart-3' },
    { icon: Shield, label: 'Quality Rate', value: `${qualityStats.passRate.toFixed(0)}%`, sub: `${qualityStats.openNCRs} open NCRs`, trend: qualityStats.passRate >= 90 ? 'up' as const : 'down' as const, trendValue: `${qualityStats.totalInspections} inspections`, color: qualityStats.passRate >= 90 ? 'bg-success' : 'bg-warning' },
    { icon: Warehouse, label: 'Inventory', value: fmtETB(inventoryStats.totalValue), sub: `${inventory.length} items`, trend: inventoryStats.lowStockItems > 0 ? 'down' as const : 'up' as const, trendValue: `${inventoryStats.lowStockItems} low stock`, color: 'bg-chart-4' },
    { icon: Users, label: 'Customers', value: String(customers.filter(c => c.status === 'Active').length), sub: `${customers.length} total`, trend: 'up' as const, trendValue: `${fmtETB(orderStats.totalValue)} revenue`, color: 'bg-info' },
    { icon: UserCheck, label: 'Employees', value: String(hrStats.activeEmployees), sub: `${hrStats.pendingLeaveRequests} leave pending`, trend: 'neutral' as const, trendValue: `${hrStats.presentToday} present today`, color: 'bg-chart-5' },
    { icon: TruckIcon, label: 'Procurement', value: `${procurementStats.openPOs} open POs`, sub: fmtETB(procurementStats.totalSpentMTD), trend: procurementStats.overduePOs > 0 ? 'down' as const : 'up' as const, trendValue: `${procurementStats.overduePOs} overdue`, color: 'bg-accent' },
  ];

  // Alerts from all modules
  const alerts = useMemo(() => {
    const a: { id: string; type: 'critical' | 'warning' | 'info'; module: string; message: string; route?: string }[] = [];
    if (inventoryStats.lowStockItems > 0)
      a.push({ id: 'inv-low', type: 'critical', module: 'Inventory', message: `${inventoryStats.lowStockItems} items below minimum stock`, route: '/inventory' });
    if (qualityStats.openNCRs > 0)
      a.push({ id: 'qa-ncr', type: 'warning', module: 'Quality', message: `${qualityStats.openNCRs} open non-conformance reports`, route: '/quality' });
    if (maintenanceStats.overdueTasks > 0)
      a.push({ id: 'mnt-over', type: 'critical', module: 'Maintenance', message: `${maintenanceStats.overdueTasks} overdue maintenance tasks`, route: '/maintenance' });
    if (hrStats.pendingLeaveRequests > 0)
      a.push({ id: 'hr-leave', type: 'info', module: 'HR', message: `${hrStats.pendingLeaveRequests} leave requests awaiting approval`, route: '/hr' });
    if (procurementStats.overduePOs > 0)
      a.push({ id: 'proc-over', type: 'warning', module: 'Procurement', message: `${procurementStats.overduePOs} overdue purchase orders`, route: '/procurement' });
    if (quoteStats.expiringThisWeek > 0)
      a.push({ id: 'qt-exp', type: 'warning', module: 'Quotes', message: `${quoteStats.expiringThisWeek} quotes expiring this week`, route: '/quotes' });
    if (productStats.criticalStockCount > 0)
      a.push({ id: 'prd-crit', type: 'critical', module: 'Products', message: `${productStats.criticalStockCount} products at critical stock`, route: '/products' });
    if (installationStats.thisWeekInstallations > 0)
      a.push({ id: 'inst-wk', type: 'info', module: 'Installation', message: `${installationStats.thisWeekInstallations} installations scheduled this week`, route: '/installation' });
    return a.sort((x, y) => (x.type === 'critical' ? 0 : x.type === 'warning' ? 1 : 2) - (y.type === 'critical' ? 0 : y.type === 'warning' ? 1 : 2));
  }, [inventoryStats, qualityStats, maintenanceStats, hrStats, procurementStats, quoteStats, productStats, installationStats]);

  // Chart data
  const revenueData = [
    { month: 'Oct', revenue: 2800000, cost: 1900000, profit: 900000 },
    { month: 'Nov', revenue: 3200000, cost: 2100000, profit: 1100000 },
    { month: 'Dec', revenue: 2600000, cost: 1800000, profit: 800000 },
    { month: 'Jan', revenue: 3500000, cost: 2300000, profit: 1200000 },
    { month: 'Feb', revenue: 3800000, cost: 2400000, profit: 1400000 },
    { month: 'Mar', revenue: 4100000, cost: 2600000, profit: 1500000 },
  ];

  const moduleLoadData = [
    { name: 'Production', value: productionStats.activeWorkOrders, color: 'hsl(212, 72%, 42%)' },
    { name: 'Cutting', value: cuttingStats.inProgressJobs, color: 'hsl(38, 92%, 50%)' },
    { name: 'Installation', value: installationStats.inProgressInstallations, color: 'hsl(142, 72%, 40%)' },
    { name: 'Maintenance', value: maintenanceStats.inProgressTasks, color: 'hsl(280, 60%, 50%)' },
    { name: 'Quality', value: qualityStats.totalInspections, color: 'hsl(0, 72%, 51%)' },
  ].filter(m => m.value > 0);

  const qualityTrend = [
    { month: 'Oct', rate: 88 }, { month: 'Nov', rate: 91 }, { month: 'Dec', rate: 89 },
    { month: 'Jan', rate: 93 }, { month: 'Feb', rate: 92 }, { month: 'Mar', rate: qualityStats.passRate },
  ];

  const stages = ['Cutting', 'Machining', 'Assembly', 'Welding', 'Glazing', 'QC', 'Packaging'];
  const productionData = stages.map(stage => ({
    stage,
    count: workOrders.filter(w => {
      const s = stage === 'QC' ? 'Quality Check' : stage;
      return w.currentStage === s && w.status !== 'Completed' && w.status !== 'Cancelled';
    }).length,
  }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('nav.dashboard')}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {language === 'am' ? 'ሁሉም ሞጁሎች ማጠቃለያ' : 'All modules at a glance'} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/quotes')}><FileText className="h-3.5 w-3.5 mr-1.5" />New Quote</Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/orders')}><ClipboardList className="h-3.5 w-3.5 mr-1.5" />New Order</Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/inventory')}><PackagePlus className="h-3.5 w-3.5 mr-1.5" />Add Stock</Button>
          <Button size="sm" onClick={() => navigate('/procurement')}><Truck className="h-3.5 w-3.5 mr-1.5" />Receive PO</Button>
        </div>
      </div>

      {/* Top 8 KPIs */}
      <DashboardKPIGrid cards={topKPIs} />

      {/* Alerts */}
      <DashboardAlerts alerts={alerts} />

      {/* Charts */}
      <DashboardCharts revenueData={revenueData} moduleLoadData={moduleLoadData} qualityTrend={qualityTrend} productionData={productionData} />

      {/* Module Summary Grid - 14 modules */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Module Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <ModuleSummaryCard title="Products" icon={Package} route="/products" accentColor="bg-primary" items={[
            { label: 'Active', value: productStats.activeProducts },
            { label: 'Avg Margin', value: `${productStats.avgMargin.toFixed(0)}%`, color: productStats.avgMargin >= 25 ? 'text-success' : 'text-warning' },
            { label: 'Low Stock', value: productStats.lowStockCount, color: productStats.lowStockCount > 0 ? 'text-destructive' : 'text-foreground' },
            { label: 'Inv. Value', value: fmtETB(productStats.totalInventoryValue) },
          ]} />
          <ModuleSummaryCard title="Inventory" icon={Warehouse} route="/inventory" accentColor="bg-chart-4" items={[
            { label: 'Total Items', value: inventory.length },
            { label: 'Total Value', value: fmtETB(inventoryStats.totalValue) },
            { label: 'Low Stock', value: inventoryStats.lowStockItems, color: inventoryStats.lowStockItems > 0 ? 'text-destructive' : 'text-foreground' },
            { label: 'Movements', value: stockMovements.length },
          ]} />
          <ModuleSummaryCard title="Production" icon={Factory} route="/production" accentColor="bg-chart-3" items={[
            { label: 'Active WOs', value: productionStats.activeWorkOrders },
            { label: 'Completed', value: productionStats.completedWorkOrders, color: 'text-success' },
            { label: 'Efficiency', value: `${productionStats.averageEfficiency.toFixed(0)}%` },
            { label: 'Overdue', value: productionStats.overdueCount, color: productionStats.overdueCount > 0 ? 'text-destructive' : 'text-foreground' },
          ]} />
          <ModuleSummaryCard title="Cutting" icon={Scissors} route="/cutting" accentColor="bg-chart-2" items={[
            { label: 'In Progress', value: cuttingStats.inProgressJobs },
            { label: 'Completed', value: cuttingStats.completedJobs, color: 'text-success' },
            { label: 'Avg Waste', value: `${cuttingStats.averageWastePercent.toFixed(1)}%` },
            { label: 'Total Cuts', value: cuttingStats.totalCuts },
          ]} />
          <ModuleSummaryCard title="Projects" icon={HardHat} route="/projects" accentColor="bg-info" items={[
            { label: 'Active', value: projectStats.activeProjects },
            { label: 'Total Value', value: fmtETB(projectStats.totalValue) },
            { label: 'Completed', value: projectStats.completedProjects, color: 'text-success' },
            { label: 'At Risk', value: projectStats.behindSchedule || 0, color: (projectStats.behindSchedule || 0) > 0 ? 'text-warning' : 'text-foreground' },
          ]} />
          <ModuleSummaryCard title="Customers" icon={Users} route="/customers" accentColor="bg-chart-5" items={[
            { label: 'Active', value: customers.filter(c => c.status === 'Active').length },
            { label: 'Total', value: customers.length },
            { label: 'Companies', value: customers.filter(c => c.type === 'Company').length },
            { label: 'Contractors', value: customers.filter(c => c.type === 'Contractor').length },
          ]} />
          <ModuleSummaryCard title="Orders" icon={ShoppingCart} route="/orders" accentColor="bg-success" items={[
            { label: 'Total', value: orderStats.totalOrders },
            { label: 'Value', value: fmtETB(orderStats.totalValue) },
            { label: 'Processing', value: orderStats.processingCount },
            { label: 'Completed', value: orderStats.completedOrders, color: 'text-success' },
          ]} />
          <ModuleSummaryCard title="Quotes" icon={FileText} route="/quotes" accentColor="bg-warning" items={[
            { label: 'Pending', value: quoteStats.pendingQuotes },
            { label: 'Total Value', value: fmtETB(quoteStats.totalValue) },
            { label: 'Accepted', value: quoteStats.acceptedQuotes, color: 'text-success' },
            { label: 'Expiring', value: quoteStats.expiringThisWeek, color: quoteStats.expiringThisWeek > 0 ? 'text-warning' : 'text-foreground' },
          ]} />
          <ModuleSummaryCard title="Installation" icon={Wrench} route="/installation" accentColor="bg-chart-1" items={[
            { label: 'In Progress', value: installationStats.inProgressInstallations },
            { label: 'This Week', value: installationStats.thisWeekInstallations },
            { label: 'Completed', value: installationStats.completedInstallations, color: 'text-success' },
            { label: 'Delayed', value: installationStats.delayedInstallations, color: installationStats.delayedInstallations > 0 ? 'text-destructive' : 'text-foreground' },
          ]} />
          <ModuleSummaryCard title="Maintenance" icon={Wrench} route="/maintenance" accentColor="bg-chart-4" items={[
            { label: 'In Progress', value: maintenanceStats.inProgressTasks },
            { label: 'Open', value: maintenanceStats.openTasks },
            { label: 'Overdue', value: maintenanceStats.overdueTasks, color: maintenanceStats.overdueTasks > 0 ? 'text-destructive' : 'text-foreground' },
            { label: 'Cost MTD', value: fmtETB(maintenanceStats.totalCostMTD) },
          ]} />
          <ModuleSummaryCard title="Quality" icon={Shield} route="/quality" accentColor="bg-success" items={[
            { label: 'Pass Rate', value: `${qualityStats.passRate.toFixed(0)}%`, color: qualityStats.passRate >= 90 ? 'text-success' : 'text-warning' },
            { label: 'Open NCRs', value: qualityStats.openNCRs, color: qualityStats.openNCRs > 0 ? 'text-warning' : 'text-foreground' },
            { label: 'Inspections', value: qualityStats.totalInspections },
            { label: 'Complaints', value: complaints.length },
          ]} />
          <ModuleSummaryCard title="Procurement" icon={TruckIcon} route="/procurement" accentColor="bg-accent" items={[
            { label: 'Open POs', value: procurementStats.openPOs },
            { label: 'Spent MTD', value: fmtETB(procurementStats.totalSpentMTD) },
            { label: 'Suppliers', value: suppliers.length },
            { label: 'Overdue', value: procurementStats.overduePOs, color: procurementStats.overduePOs > 0 ? 'text-destructive' : 'text-foreground' },
          ]} />
          <ModuleSummaryCard title="Finance" icon={DollarSign} route="/finance" accentColor="bg-primary" items={[
            { label: 'Revenue MTD', value: fmtETB(financeStats.totalRevenueMTD) },
            { label: 'Expenses', value: fmtETB(financeStats.totalExpensesMTD) },
            { label: 'Receivables', value: fmtETB(financeStats.totalReceivables), color: 'text-warning' },
            { label: 'Overdue', value: fmtETB(financeStats.overdueReceivables), color: financeStats.overdueReceivables > 0 ? 'text-destructive' : 'text-foreground' },
          ]} />
          <ModuleSummaryCard title="HR" icon={UserCheck} route="/hr" accentColor="bg-chart-5" items={[
            { label: 'Active Staff', value: hrStats.activeEmployees },
            { label: 'Present', value: hrStats.presentToday },
            { label: 'On Leave', value: hrStats.onLeaveEmployees },
            { label: 'Payroll MTD', value: fmtETB(hrStats.totalPayrollThisMonth) },
          ]} />
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="md:hidden grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => navigate('/quotes')}>
          <FileText className="h-5 w-5" /><span className="text-xs">New Quote</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => navigate('/orders')}>
          <ClipboardList className="h-5 w-5" /><span className="text-xs">New Order</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => navigate('/inventory')}>
          <PackagePlus className="h-5 w-5" /><span className="text-xs">Add Stock</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => navigate('/procurement')}>
          <Truck className="h-5 w-5" /><span className="text-xs">Receive PO</span>
        </Button>
      </div>
    </div>
  );
}
