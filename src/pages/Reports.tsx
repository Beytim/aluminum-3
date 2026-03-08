import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download, FileText, BarChart3, DollarSign, Package, Factory,
  Wrench, Users, Shield, Truck, Scissors, HardHat, Warehouse, UserCheck,
  TrendingUp, ClipboardList,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import { generateReportPDF } from "@/lib/pdfExport";

// Enhanced data imports (same as Dashboard)
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

// Report components
import ReportKPIs, { type ReportKPI } from "@/components/reports/ReportKPIs";
import ReportCardGrid, { type ReportCard } from "@/components/reports/ReportCardGrid";
import CrossModuleCharts from "@/components/reports/CrossModuleCharts";

const fmtETB = (v: number) => v >= 1_000_000 ? `ETB ${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `ETB ${(v / 1_000).toFixed(0)}K` : `ETB ${v}`;

export default function Reports() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("overview");

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

  // Top KPIs
  const topKPIs: ReportKPI[] = [
    { icon: DollarSign, label: 'Total Revenue', value: fmtETB(financeStats.totalRevenueMTD), sub: `${invoices.length} invoices`, trend: 'up', trendValue: `Margin: ${financeStats.grossProfitMTD > 0 ? ((financeStats.grossProfitMTD / financeStats.totalRevenueMTD) * 100).toFixed(0) : 0}%`, color: 'bg-primary' },
    { icon: ClipboardList, label: 'Orders', value: String(orderStats.totalOrders), sub: fmtETB(orderStats.totalValue), trend: 'up', trendValue: `${orderStats.completedOrders} completed`, color: 'bg-chart-2' },
    { icon: Factory, label: 'Work Orders', value: String(workOrders.length), sub: `${productionStats.activeWorkOrders} active`, trend: 'up', trendValue: `${productionStats.onTimeRate.toFixed(0)}% on-time`, color: 'bg-chart-3' },
    { icon: Shield, label: 'Quality', value: `${qualityStats.passRate.toFixed(0)}%`, sub: `${qualityStats.openNCRs} open NCRs`, trend: qualityStats.passRate >= 90 ? 'up' : 'down', trendValue: `${qualityStats.totalInspections} inspections`, color: 'bg-success' },
    { icon: Warehouse, label: 'Inventory', value: fmtETB(inventoryStats.totalValue), sub: `${inventory.length} items`, trend: inventoryStats.lowStockItems > 0 ? 'down' : 'up', trendValue: `${inventoryStats.lowStockItems} low stock`, color: 'bg-chart-4' },
    { icon: UserCheck, label: 'Workforce', value: String(hrStats.activeEmployees), sub: `${hrStats.presentToday} present`, trend: 'neutral', trendValue: `Payroll: ${fmtETB(hrStats.totalPayrollThisMonth)}`, color: 'bg-chart-5' },
  ];

  // Chart data
  const revenueVsCost = [
    { month: 'Oct', revenue: 2800000, cost: 1900000, profit: 900000 },
    { month: 'Nov', revenue: 3200000, cost: 2100000, profit: 1100000 },
    { month: 'Dec', revenue: 2600000, cost: 1800000, profit: 800000 },
    { month: 'Jan', revenue: 3500000, cost: 2300000, profit: 1200000 },
    { month: 'Feb', revenue: 3800000, cost: 2400000, profit: 1400000 },
    { month: 'Mar', revenue: 4100000, cost: 2600000, profit: 1500000 },
  ];

  const ordersByStatus = useMemo(() => {
    const statusMap: Record<string, number> = {};
    orders.forEach(o => { statusMap[o.status] = (statusMap[o.status] || 0) + 1; });
    return Object.entries(statusMap).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const qualityTrend = [
    { month: 'Oct', passRate: 88, defectRate: 12 },
    { month: 'Nov', passRate: 91, defectRate: 9 },
    { month: 'Dec', passRate: 89, defectRate: 11 },
    { month: 'Jan', passRate: 93, defectRate: 7 },
    { month: 'Feb', passRate: 92, defectRate: 8 },
    { month: 'Mar', passRate: qualityStats.passRate, defectRate: 100 - qualityStats.passRate },
  ];

  const stages = ['Cutting', 'Machining', 'Assembly', 'Welding', 'Glazing', 'QC', 'Packaging'];
  const productionPipeline = stages.map(stage => ({
    stage,
    count: workOrders.filter(w => {
      const s = stage === 'QC' ? 'Quality Check' : stage;
      return w.currentStage === s && w.status !== 'Completed' && w.status !== 'Cancelled';
    }).length,
  }));

  const expenseBreakdown = useMemo(() => {
    const catMap: Record<string, number> = {};
    expensesData.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amountInETB; });
    return Object.entries(catMap).map(([name, value]) => ({ name, value }));
  }, [expensesData]);

  const moduleHealth = useMemo(() => [
    { module: 'Production', score: Math.min(100, productionStats.onTimeRate) },
    { module: 'Quality', score: qualityStats.passRate },
    { module: 'Inventory', score: inventoryStats.lowStockItems === 0 ? 95 : Math.max(50, 95 - inventoryStats.lowStockItems * 10) },
    { module: 'Finance', score: financeStats.paidInvoices > 0 ? (financeStats.paidInvoices / financeStats.totalInvoices) * 100 : 80 },
    { module: 'HR', score: hrStats.activeEmployees > 0 ? Math.min(100, (hrStats.presentToday / hrStats.activeEmployees) * 100) : 0 },
    { module: 'Procurement', score: procurementStats.overduePOs === 0 ? 95 : Math.max(50, 95 - procurementStats.overduePOs * 15) },
  ], [productionStats, qualityStats, inventoryStats, financeStats, hrStats, procurementStats]);

  const customerRevenue = useMemo(() =>
    customers.map(c => ({ name: c.name.split(' ').slice(0, 2).join(' '), revenue: c.totalValue, orders: c.projects }))
      .sort((a, b) => b.revenue - a.revenue).slice(0, 8),
    [customers]
  );

  const inventoryByCategory = useMemo(() => {
    const catMap: Record<string, { value: number; qty: number }> = {};
    inventory.forEach(i => {
      if (!catMap[i.category]) catMap[i.category] = { value: 0, qty: 0 };
      catMap[i.category].value += i.stock * i.unitCost;
      catMap[i.category].qty += i.stock;
    });
    return Object.entries(catMap).map(([category, d]) => ({ category, ...d }));
  }, [inventory]);

  // Report cards for PDF export
  const reportCards: ReportCard[] = [
    { title: "Financial Summary", icon: DollarSign, desc: "Revenue, expenses, profit & loss analysis", category: "Finance", dataPoints: invoices.length + expensesData.length, onClick: () => exportFinanceReport() },
    { title: "Project Status Report", icon: HardHat, desc: "All projects with stages, budgets, timelines", category: "Operations", dataPoints: projects.length, onClick: () => exportProjectReport() },
    { title: "Production Schedule", icon: Factory, desc: "Work orders, stages, efficiency metrics", category: "Operations", dataPoints: workOrders.length, onClick: () => exportProductionReport() },
    { title: "Quality Analysis", icon: Shield, desc: "Inspections, NCRs, defect analysis", category: "Quality", dataPoints: inspections.length + ncrs.length, onClick: () => exportQualityReport() },
    { title: "Inventory Valuation", icon: Package, desc: "Stock levels, values, and movements", category: "Inventory", dataPoints: inventory.length, onClick: () => exportInventoryReport() },
    { title: "Customer Report", icon: Users, desc: "Customer performance, revenue, and status", category: "Sales", dataPoints: customers.length, onClick: () => exportCustomerReport() },
    { title: "Order Analysis", icon: ClipboardList, desc: "Order pipeline, fulfillment, payment status", category: "Sales", dataPoints: orders.length, onClick: () => exportOrderReport() },
    { title: "HR & Payroll", icon: UserCheck, desc: "Employees, attendance, payroll costs", category: "HR", dataPoints: employees.length + payrolls.length, onClick: () => exportHRReport() },
    { title: "Supplier Performance", icon: Truck, desc: "Lead times, quality ratings, PO status", category: "Operations", dataPoints: suppliers.length + purchaseOrders.length, onClick: () => exportSupplierReport() },
    { title: "Installation Schedule", icon: Wrench, desc: "Installation timeline and team assignments", category: "Operations", dataPoints: installations.length, onClick: () => exportInstallationReport() },
    { title: "Maintenance Report", icon: Wrench, desc: "Equipment status and maintenance schedule", category: "Operations", dataPoints: maintenanceTasks.length, onClick: () => exportMaintenanceReport() },
    { title: "Profitability by Product", icon: TrendingUp, desc: "Product margins, BOM costs, revenue potential", category: "Finance", dataPoints: products.length, onClick: () => exportProductReport() },
  ];

  // PDF Export functions
  const exportFinanceReport = () => {
    generateReportPDF("Financial Summary Report",
      ['Invoice', 'Customer', 'Amount (ETB)', 'Paid (ETB)', 'Balance', 'Status'],
      invoices.map(i => [i.invoiceNumber, i.customerName, i.totalInETB.toLocaleString(), i.totalPaidInETB.toLocaleString(), i.balanceInETB.toLocaleString(), i.status])
    );
  };
  const exportProjectReport = () => {
    generateReportPDF("Project Status Report",
      ['Project', 'Customer', 'Status', 'Progress', 'Budget (ETB)', 'Spent (ETB)'],
      projects.map(p => [p.name, p.customerName, p.status, `${p.progress}%`, p.value.toLocaleString(), p.totalCost.toLocaleString()])
    );
  };
  const exportProductionReport = () => {
    generateReportPDF("Production Schedule Report",
      ['WO#', 'Product', 'Status', 'Stage', 'Priority', 'Due Date'],
      workOrders.map(w => [w.workOrderNumber, w.productName, w.status, w.currentStage, w.priority, w.scheduledEnd])
    );
  };
  const exportQualityReport = () => {
    generateReportPDF("Quality Analysis Report",
      ['Inspection', 'Product', 'Type', 'Result', 'Score', 'Date'],
      inspections.map(i => [i.inspectionNumber, i.productName || 'N/A', i.type, i.result, `${i.score ?? 'N/A'}%`, i.inspectionDate])
    );
  };
  const exportInventoryReport = () => {
    generateReportPDF("Inventory Valuation Report",
      ['Code', 'Name', 'Category', 'Stock', 'Unit Cost', 'Total Value', 'Status'],
      inventory.map(i => [i.itemCode, i.productName, i.category, String(i.stock), `ETB ${i.unitCost.toLocaleString()}`, `ETB ${(i.stock * i.unitCost).toLocaleString()}`, i.status])
    );
  };
  const exportCustomerReport = () => {
    generateReportPDF("Customer Performance Report",
      ['Customer', 'Type', 'Status', 'Total Value', 'Outstanding', 'Projects'],
      customers.map(c => [c.name, c.type, c.status, `ETB ${c.totalValue.toLocaleString()}`, `ETB ${c.outstanding.toLocaleString()}`, String(c.projects)])
    );
  };
  const exportOrderReport = () => {
    generateReportPDF("Order Analysis Report",
      ['Order#', 'Customer', 'Status', 'Total (ETB)', 'Paid (ETB)', 'Balance', 'Payment'],
      orders.map(o => [o.orderNumber, o.customerName, o.status, o.total.toLocaleString(), o.totalPaid.toLocaleString(), o.balance.toLocaleString(), o.paymentStatus])
    );
  };
  const exportHRReport = () => {
    generateReportPDF("HR & Payroll Report",
      ['Employee', 'Department', 'Position', 'Status', 'Employment'],
      employees.map(e => [e.fullName, e.department, e.position, e.status, e.employmentType])
    );
  };
  const exportSupplierReport = () => {
    generateReportPDF("Supplier Performance Report",
      ['Supplier', 'Category', 'Rating', 'Lead Time', 'Total POs', 'Status'],
      suppliers.map(s => [s.companyName, s.productCategories[0] || 'N/A', `${s.rating}/5`, `${s.averageLeadTime} days`, String(s.performance.totalOrders), s.status])
    );
  };
  const exportInstallationReport = () => {
    generateReportPDF("Installation Schedule Report",
      ['Installation', 'Project', 'Status', 'Start', 'End', 'Team Lead'],
      installations.map(i => [i.installationNumber, i.projectName, i.status, i.scheduledStartDate, i.scheduledEndDate, i.teamLeadName])
    );
  };
  const exportMaintenanceReport = () => {
    generateReportPDF("Maintenance Report",
      ['Task', 'Equipment', 'Type', 'Priority', 'Status', 'Due Date'],
      maintenanceTasks.map(m => [m.taskNumber, m.equipmentName, m.maintenanceType, m.priority, m.status, m.scheduledDate])
    );
  };
  const exportProductReport = () => {
    generateReportPDF("Product Profitability Report",
      ['Code', 'Name', 'Category', 'Cost (ETB)', 'Price (ETB)', 'Margin %', 'Stock'],
      products.map(p => [p.code, p.name, p.category, p.totalCost.toLocaleString(), p.sellingPrice.toLocaleString(), `${((p.sellingPrice - p.totalCost) / p.sellingPrice * 100).toFixed(1)}%`, String(p.currentStock)])
    );
  };

  const handleExportAll = () => {
    const totalRevenue = financeStats.totalRevenueMTD;
    const totalExpenses = expensesData.reduce((s, e) => s + e.amountInETB, 0);
    generateReportPDF("Executive Business Summary",
      ['Module', 'Metric', 'Value'],
      [
        ['Finance', 'Total Revenue', fmtETB(totalRevenue)],
        ['Finance', 'Total Expenses', fmtETB(totalExpenses)],
        ['Finance', 'Gross Profit', fmtETB(totalRevenue - totalExpenses)],
        ['Orders', 'Total Orders', String(orderStats.totalOrders)],
        ['Orders', 'Order Value', fmtETB(orderStats.totalValue)],
        ['Production', 'Active Work Orders', String(productionStats.activeWorkOrders)],
        ['Production', 'On-Time Rate', `${productionStats.onTimeRate.toFixed(0)}%`],
        ['Quality', 'Pass Rate', `${qualityStats.passRate.toFixed(0)}%`],
        ['Quality', 'Open NCRs', String(qualityStats.openNCRs)],
        ['Inventory', 'Total Value', fmtETB(inventoryStats.totalValue)],
        ['Inventory', 'Low Stock Items', String(inventoryStats.lowStockItems)],
        ['Projects', 'Active Projects', String(projectStats.activeProjects)],
        ['Projects', 'Total Value', fmtETB(projectStats.totalValue)],
        ['Customers', 'Active Customers', String(customers.filter(c => c.status === 'Active').length)],
        ['HR', 'Active Employees', String(hrStats.activeEmployees)],
        ['HR', 'Present Today', String(hrStats.presentToday)],
        ['Procurement', 'Open POs', String(procurementStats.openPOs)],
        ['Procurement', 'Overdue POs', String(procurementStats.overduePOs)],
        ['Installation', 'In Progress', String(installationStats.inProgressInstallations)],
        ['Maintenance', 'Overdue Tasks', String(maintenanceStats.overdueTasks)],
      ]
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('nav.reports')}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Cross-module analytics & exportable reports across all 14 modules</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select defaultValue="month">
            <SelectTrigger className="w-28 sm:w-36 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExportAll}>
            <Download className="h-3.5 w-3.5 mr-1.5" />Executive Summary PDF
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <ReportKPIs kpis={topKPIs} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-9">
          <TabsTrigger value="overview" className="text-xs">Analytics</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs">Export Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <CrossModuleCharts
            revenueVsCost={revenueVsCost}
            ordersByStatus={ordersByStatus}
            qualityTrend={qualityTrend}
            productionPipeline={productionPipeline}
            expenseBreakdown={expenseBreakdown}
            moduleHealth={moduleHealth}
            customerRevenue={customerRevenue}
            inventoryByCategory={inventoryByCategory}
          />
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <ReportCardGrid cards={reportCards} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
