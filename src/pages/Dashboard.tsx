import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Boxes, DollarSign, TrendingUp, ShoppingCart, AlertTriangle,
  Plus, FileText, PackagePlus, ClipboardList, Truck,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  salesTrendData, topProductsData, inventoryByAlloyData,
  sampleActivities, sampleInventory, sampleInstallations,
  sampleProjects, sampleOrders, sampleInvoices,
} from "@/data/sampleData";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/localStorage";
import type { Project, InventoryItem, Installation, Order, Invoice } from "@/data/sampleData";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const [projects] = useLocalStorage<Project[]>(STORAGE_KEYS.PROJECTS, sampleProjects);
  const [inventory] = useLocalStorage<InventoryItem[]>(STORAGE_KEYS.INVENTORY, sampleInventory);
  const [installations] = useLocalStorage<Installation[]>(STORAGE_KEYS.INSTALLATIONS, sampleInstallations);
  const [orders] = useLocalStorage<Order[]>(STORAGE_KEYS.ORDERS, sampleOrders);
  const [invoices] = useLocalStorage<Invoice[]>(STORAGE_KEYS.INVOICES, sampleInvoices);

  const lowStockItems = inventory.filter(i => i.stock <= i.minStock);
  const totalInventoryValue = inventory.reduce((s, i) => s + i.stock * i.cost, 0);
  const todaySales = orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.total, 0);
  const monthlySales = orders.reduce((s, o) => s + o.paid, 0);
  const pendingOrders = orders.filter(o => !['Completed', 'Cancelled', 'Delivered'].includes(o.status)).length;

  const statCards = [
    { title: 'Inventory Value', titleAm: 'የክምችት ዋጋ', value: `ETB ${(totalInventoryValue / 1000).toFixed(0)}K`, change: `${inventory.length} items`, icon: Boxes, color: 'text-primary' },
    { title: "Today's Sales", titleAm: 'የዛሬ ሽያጭ', value: `ETB ${(todaySales / 1000).toFixed(0)}K`, change: '+12% vs yesterday', icon: DollarSign, color: 'text-success' },
    { title: 'Monthly Sales', titleAm: 'ወርሃዊ ሽያጭ', value: `ETB ${(monthlySales / 1000000).toFixed(2)}M`, change: `${orders.length} orders`, icon: TrendingUp, color: 'text-info' },
    { title: 'Pending Orders', titleAm: 'በመጠባበቅ ላይ ያሉ', value: String(pendingOrders), change: `${lowStockItems.length} low stock`, icon: ShoppingCart, color: 'text-warning' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('nav.dashboard')}</h1>
          <p className="text-sm text-muted-foreground">{t('dash.welcome')}</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/quotes')}><FileText className="h-3.5 w-3.5 mr-1.5" />Create Quote</Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/inventory')}><PackagePlus className="h-3.5 w-3.5 mr-1.5" />Add Inventory</Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/orders')}><ClipboardList className="h-3.5 w-3.5 mr-1.5" />New Order</Button>
          <Button size="sm" onClick={() => navigate('/procurement')}><Truck className="h-3.5 w-3.5 mr-1.5" />Receive PO</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
            <CardContent className="p-4 relative">
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                <stat.icon className="w-full h-full" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{language === 'am' ? stat.titleAm : stat.title}</span>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <p className="text-xs mt-1 text-success">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 30-day Sales Trend */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{language === 'am' ? 'የ30 ቀን ሽያጭ ዝንባሌ' : 'Sales Trend (30 Days)'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 18%, 86%)" />
                <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="hsl(215, 12%, 50%)" />
                <YAxis tick={{ fontSize: 9 }} stroke="hsl(215, 12%, 50%)" tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip formatter={(value: number) => [`ETB ${value.toLocaleString()}`, 'Sales']} />
                <Line type="monotone" dataKey="sales" stroke="hsl(212, 72%, 42%)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory by Alloy Type */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{language === 'am' ? 'ክምችት በአሎይ ዓይነት' : 'Inventory by Alloy Type'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={inventoryByAlloyData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {inventoryByAlloyData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {inventoryByAlloyData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                  <span className="text-muted-foreground">{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Bar Chart */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">{language === 'am' ? 'ከፍተኛ 5 ምርቶች' : 'Top 5 Selling Products'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProductsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 18%, 86%)" />
              <XAxis type="number" tick={{ fontSize: 9 }} stroke="hsl(215, 12%, 50%)" tickFormatter={(v) => `${v/1000}k`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} stroke="hsl(215, 12%, 50%)" width={100} />
              <Tooltip formatter={(value: number) => [`ETB ${value.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="sales" fill="hsl(212, 72%, 42%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />{t('dash.low_stock_alerts')} ({lowStockItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[260px] overflow-auto">
              {lowStockItems.length > 0 ? lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-destructive/5 border border-destructive/10">
                  <div>
                    <p className="text-xs font-medium text-card-foreground">{language === 'am' ? item.nameAm : item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.category} · {item.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-destructive">{item.stock} {item.unit}</p>
                    <p className="text-[10px] text-muted-foreground">Min: {item.minStock}</p>
                  </div>
                </div>
              )) : <p className="text-xs text-muted-foreground text-center py-4">All stock levels OK ✅</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t('dash.recent_activity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[260px] overflow-auto">
              {sampleActivities.map((activity) => (
                <div key={activity.id} className="flex gap-2 text-sm">
                  <span className="text-base shrink-0">
                    {activity.type === 'order' ? '🛒' : activity.type === 'stock' ? '📦' : activity.type === 'alert' ? '⚠️' : activity.type === 'quote' ? '📋' : activity.type === 'production' ? '🏭' : activity.type === 'payment' ? '💰' : '🔧'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-card-foreground leading-snug">
                      {language === 'am' ? activity.messageAm : activity.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t('dash.today_installs')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[260px] overflow-auto">
              {installations.map((inst) => (
                <div key={inst.id} className="p-2 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-card-foreground">{inst.projectName}</p>
                      <p className="text-[10px] text-muted-foreground">{inst.customerName}</p>
                      <p className="text-[10px] text-muted-foreground">{inst.address}</p>
                    </div>
                    <Badge variant={inst.status === 'Completed' ? 'default' : inst.status === 'In Progress' ? 'secondary' : 'outline'} className="text-[10px]">
                      {inst.status}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{inst.team} · {inst.scheduledDate}</p>
                </div>
              ))}
              {/* Pending Payments */}
              <div className="pt-2 border-t mt-2">
                <p className="text-xs font-semibold mb-2 text-card-foreground">{language === 'am' ? 'በመጠባበቅ ላይ ያሉ ክፍያዎች' : 'Pending Payments'}</p>
                {invoices.filter(i => i.balance > 0).slice(0, 3).map(inv => (
                  <div key={inv.id} className="flex justify-between text-[10px] py-1">
                    <span className="text-muted-foreground">{inv.customerName}</span>
                    <span className="font-medium text-warning">ETB {inv.balance.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Quick Actions */}
      <div className="md:hidden grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => navigate('/quotes')}>
          <FileText className="h-5 w-5" />
          <span className="text-xs">Create Quote</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => navigate('/inventory')}>
          <PackagePlus className="h-5 w-5" />
          <span className="text-xs">Add Inventory</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => navigate('/orders')}>
          <ClipboardList className="h-5 w-5" />
          <span className="text-xs">New Order</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => navigate('/procurement')}>
          <Truck className="h-5 w-5" />
          <span className="text-xs">Receive PO</span>
        </Button>
      </div>
    </div>
  );
}
