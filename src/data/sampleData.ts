// ══════════════════════════════════════════
// ALUMINUM BUSINESS MANAGEMENT SYSTEM
// COMPREHENSIVE TYPES & SAMPLE DATA
// ══════════════════════════════════════════

// ═══ TYPES ═══

export interface BOMComponent {
  id: string;
  type: 'Profile' | 'Hardware' | 'Glass' | 'Accessory' | 'Other';
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  total: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  nameAm: string;
  category: 'Windows' | 'Doors' | 'Curtain Walls' | 'Handrails' | 'Louvers' | 'Partitions' | 'Sheet' | 'Plate' | 'Bar/Rod' | 'Tube/Pipe' | 'Angle' | 'Channel' | 'Beam' | 'Profile' | 'Coil' | 'Custom';
  subcategory: string;
  productType: 'Raw Material' | 'Fabricated' | 'System' | 'Custom';
  profile: string;
  glass: string;
  colors: string[];
  laborHrs: number;
  materialCost: number;
  sellingPrice: number;
  status: 'Active' | 'Inactive';
  alloyType?: string;
  temper?: string;
  form?: string;
  length?: number;
  width?: number;
  thickness?: number;
  diameter?: number;
  wallThickness?: number;
  weightPerPiece?: number;
  weightPerMeter?: number;
  minStock?: number;
  maxStock?: number;
  currentStock?: number;
  warehouseLocation?: string;
  supplierId?: string;
  purchasePrice?: number;
  markupPercent?: number;
  batchNumber?: string;
  millCertificate?: boolean;
  dateReceived?: string;
  notes?: string;
  unit?: string;
  version?: string;
  effectiveDate?: string;
  bom?: BOMComponent[];
  profileCost?: number;
  glassCost?: number;
  hardwareCost?: number;
  accessoriesCost?: number;
  fabLaborCost?: number;
  installLaborCost?: number;
  overheadPercent?: number;
  leadTimeDays?: number;
  moq?: number;
}

export interface Project {
  id: string;
  name: string;
  nameAm: string;
  customerId: string;
  customerName: string;
  type: 'Residential' | 'Commercial';
  status: 'Quote' | 'Deposit' | 'Materials Ordered' | 'Production' | 'Ready' | 'Installation' | 'Completed';
  value: number;
  deposit: number;
  balance: number;
  progress: number;
  orderDate: string;
  dueDate: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  projectId?: string;
  quoteId?: string;
  orderDate: string;
  requestedDelivery: string;
  actualDelivery?: string;
  status: 'Draft' | 'Quote Accepted' | 'Payment Received' | 'Processing' | 'Ready' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled';
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid';
  paymentMethod?: 'Cash' | 'Card' | 'Bank Transfer' | 'Credit' | 'TeleBirr';
  shippingMethod?: 'Pickup' | 'Local Delivery' | 'Freight' | 'Courier';
  shippingAddress?: string;
  trackingNumber?: string;
  subtotal: number;
  tax: number;
  total: number;
  paid: number;
  balance: number;
  items: OrderItem[];
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  quantityShipped: number;
  unitPrice: number;
  lineTotal: number;
}

export interface WorkOrder {
  id: string;
  projectId: string;
  productId: string;
  productName: string;
  quantity: number;
  completed: number;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  stage: 'Cutting' | 'Machining' | 'Assembly' | 'Welding' | 'Glazing' | 'Quality Check' | 'Packaging';
  progress: number;
  startDate: string;
  dueDate: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  nameAm: string;
  category: 'Profile' | 'Glass' | 'Hardware' | 'Accessory' | 'Steel';
  unit: string;
  stock: number;
  minStock: number;
  reserved: number;
  available: number;
  location: string;
  cost: number;
  alloyType?: string;
  temper?: string;
  form?: string;
  length?: number;
  width?: number;
  thickness?: number;
  supplierId?: string;
  batchNumber?: string;
  millCertificate?: boolean;
  dateReceived?: string;
  sellingPrice?: number;
}

export interface Customer {
  id: string;
  name: string;
  nameAm: string;
  contact: string;
  type: 'Individual' | 'Company' | 'Contractor' | 'Developer' | 'Retail' | 'Wholesale' | 'Fabricator' | 'Distributor';
  phone: string;
  phoneSecondary?: string;
  email: string;
  address: string;
  shippingAddress?: string;
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  source?: string;
  projects: number;
  totalValue: number;
  outstanding: number;
  status?: 'Active' | 'Inactive';
  notes?: string;
}

export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  projectName: string;
  items: number;
  materialCost: number;
  laborCost: number;
  installCost: number;
  transportCost: number;
  cuttingFee?: number;
  finishUpcharge?: number;
  discount?: number;
  rushFee?: number;
  subtotal: number;
  vat: number;
  total: number;
  marginPercent?: number;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Expired';
  date: string;
  validity: string;
  finishType?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  website?: string;
  country: string;
  address?: string;
  leadTime: number;
  minOrderQty?: number;
  rating: number;
  preferred: boolean;
  paymentTerms: string;
  certifications: string[];
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  status: 'Draft' | 'Sent' | 'Confirmed' | 'Shipped' | 'Received' | 'Partially Received' | 'Cancelled';
  items: PurchaseOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paid: number;
  notes?: string;
  shippingMethod?: 'Sea' | 'Air' | 'Land';
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  received: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  projectId: string;
  customerName: string;
  amount: number;
  paid: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Overdue' | 'Pending';
  dueDate: string;
  issuedDate?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  date: string;
  customerName: string;
  amount: number;
  method: 'Bank Transfer' | 'TeleBirr' | 'Cash' | 'Cheque';
  reference: string;
}

export interface Employee {
  id: string;
  name: string;
  nameAm: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  status: 'active' | 'on-leave';
  salary: number;
  performance: number;
  attendance?: number;
  leaveBalance?: number;
}

export interface Installation {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  address: string;
  scheduledDate: string;
  team: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  notes: string;
  notesAm: string;
}

export interface MaintenanceTask {
  id: string;
  machineId: string;
  machineName: string;
  type: 'Preventive' | 'Corrective' | 'Predictive';
  scheduledDate: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
  assignee: string;
  notes: string;
  cost?: number;
  lastMaintenance?: string;
}

export interface QualityCheck {
  id: string;
  workOrderId: string;
  productName: string;
  inspector: string;
  date: string;
  result: 'Pass' | 'Fail' | 'Conditional';
  defects: string[];
  notes: string;
}

export interface CuttingJob {
  id: string;
  orderId?: string;
  productName: string;
  originalLength: number;
  cuts: number[];
  totalCuts: number;
  waste: number;
  wastePercent: number;
  assignee: string;
  machine: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export interface Activity {
  id: string;
  type: 'order' | 'stock' | 'alert' | 'quote' | 'production' | 'install' | 'payment';
  message: string;
  messageAm: string;
  time: string;
}

export interface StockAdjustment {
  id: string;
  itemId: string;
  itemName: string;
  type: 'Receive' | 'Issue' | 'Adjustment' | 'Damaged' | 'Lost' | 'Counted';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  user: string;
  date: string;
}

// ═══ SAMPLE PRODUCTS ═══
export const sampleProducts: Product[] = [
  { id: 'PRD-001', code: 'SW-6063-S1', name: 'Sliding Window 2-Panel', nameAm: 'ተንሸራታች መስኮት 2-ፓነል', category: 'Windows', subcategory: 'Sliding', productType: 'Fabricated', profile: '6063-T5', glass: '6mm Clear Tempered', colors: ['White', 'Bronze', 'Black'], laborHrs: 3.5, materialCost: 4500, sellingPrice: 7200, status: 'Active', alloyType: '6063', temper: 'T5', form: 'Profile', currentStock: 45, minStock: 10, maxStock: 100, warehouseLocation: 'A-1-1', purchasePrice: 4200, markupPercent: 60, width: 1200, length: 1500, profileCost: 2500, glassCost: 1200, hardwareCost: 850, accessoriesCost: 420, fabLaborCost: 800, installLaborCost: 600, overheadPercent: 20, version: '1.0', effectiveDate: '2024-03-15', bom: [
    { id: 'BOM-001', type: 'Profile', name: 'Frame 40x40', quantity: 6.2, unit: 'm', unitCost: 80, total: 496 },
    { id: 'BOM-002', type: 'Hardware', name: 'Handle Set', quantity: 2, unit: 'set', unitCost: 225, total: 450 },
    { id: 'BOM-003', type: 'Glass', name: '6mm Clear Tempered', quantity: 1.8, unit: 'm²', unitCost: 450, total: 810 },
    { id: 'BOM-004', type: 'Accessory', name: 'EPDM Gasket', quantity: 12, unit: 'm', unitCost: 10, total: 120 },
  ] },
  { id: 'PRD-002', code: 'CW-6063-S2', name: 'Casement Window Single', nameAm: 'ካዝመንት መስኮት ነጠላ', category: 'Windows', subcategory: 'Casement', productType: 'Fabricated', profile: '6063-T5', glass: '5mm Clear Float', colors: ['White', 'Silver'], laborHrs: 2.5, materialCost: 3200, sellingPrice: 5100, status: 'Active', alloyType: '6063', temper: 'T5', form: 'Profile', currentStock: 32, minStock: 8, maxStock: 80, warehouseLocation: 'A-1-2', purchasePrice: 3000, markupPercent: 59, profileCost: 1800, glassCost: 800, hardwareCost: 600, fabLaborCost: 500, overheadPercent: 18 },
  { id: 'PRD-003', code: 'FW-6063-S3', name: 'Fixed Window Large', nameAm: 'ቋሚ መስኮት ትልቅ', category: 'Windows', subcategory: 'Fixed', productType: 'Fabricated', profile: '6063-T5', glass: '8mm Tinted Tempered', colors: ['White', 'Bronze', 'Grey'], laborHrs: 2.0, materialCost: 3800, sellingPrice: 6000, status: 'Active', alloyType: '6063', temper: 'T5', form: 'Profile', currentStock: 28, minStock: 5, maxStock: 60, warehouseLocation: 'A-2-1', purchasePrice: 3500, markupPercent: 58, profileCost: 2000, glassCost: 1200, hardwareCost: 200, fabLaborCost: 400, overheadPercent: 15 },
  { id: 'PRD-004', code: 'SD-6063-D1', name: 'Sliding Door 3-Panel', nameAm: 'ተንሸራታች በር 3-ፓነል', category: 'Doors', subcategory: 'Sliding', productType: 'Fabricated', profile: '6063-T6', glass: '10mm Clear Tempered', colors: ['White', 'Black', 'Bronze'], laborHrs: 6.0, materialCost: 12000, sellingPrice: 19500, status: 'Active', alloyType: '6063', temper: 'T6', form: 'Profile', currentStock: 15, minStock: 3, maxStock: 40, warehouseLocation: 'B-1-1', purchasePrice: 11000, markupPercent: 63, profileCost: 5500, glassCost: 3200, hardwareCost: 2000, accessoriesCost: 800, fabLaborCost: 1200, installLaborCost: 800, overheadPercent: 20 },
  { id: 'PRD-005', code: 'HD-6063-D2', name: 'Hinged Door Double', nameAm: 'የሚከፈት በር ድርብ', category: 'Doors', subcategory: 'Hinged', productType: 'Fabricated', profile: '6063-T6', glass: '8mm Frosted Tempered', colors: ['White', 'Bronze'], laborHrs: 5.0, materialCost: 9500, sellingPrice: 15200, status: 'Active', alloyType: '6063', temper: 'T6', form: 'Profile', currentStock: 12, minStock: 3, maxStock: 30, warehouseLocation: 'B-1-2', purchasePrice: 8800, markupPercent: 60, profileCost: 4500, glassCost: 2500, hardwareCost: 1500, fabLaborCost: 1000, overheadPercent: 18 },
  { id: 'PRD-006', code: 'FD-6063-D3', name: 'Folding Door 4-Panel', nameAm: 'ተጣጣፊ በር 4-ፓነል', category: 'Doors', subcategory: 'Folding', productType: 'Fabricated', profile: '6063-T6', glass: '10mm Clear Tempered', colors: ['Black', 'Grey'], laborHrs: 8.0, materialCost: 18000, sellingPrice: 29000, status: 'Active', alloyType: '6063', temper: 'T6', form: 'Profile', currentStock: 8, minStock: 2, maxStock: 20, warehouseLocation: 'B-2-1', purchasePrice: 16500, markupPercent: 61, profileCost: 8000, glassCost: 5000, hardwareCost: 3000, accessoriesCost: 1200, fabLaborCost: 1500, installLaborCost: 1000, overheadPercent: 22 },
  { id: 'PRD-007', code: 'CW-6060-C1', name: 'Curtain Wall System', nameAm: 'ከርተን ወል ሲስተም', category: 'Curtain Walls', subcategory: 'Stick System', productType: 'System', profile: '6060-T5', glass: '12mm DGU', colors: ['Silver'], laborHrs: 12.0, materialCost: 35000, sellingPrice: 55000, status: 'Active', alloyType: '6060', temper: 'T5', form: 'Profile', currentStock: 5, minStock: 2, maxStock: 15, warehouseLocation: 'C-1-1', purchasePrice: 32000, markupPercent: 57, profileCost: 15000, glassCost: 12000, hardwareCost: 5000, accessoriesCost: 2000, fabLaborCost: 3000, installLaborCost: 2000, overheadPercent: 25 },
  { id: 'PRD-008', code: 'HR-6063-H1', name: 'Glass Handrail System', nameAm: 'የመስታወት ዘንግ ስርዓት', category: 'Handrails', subcategory: 'Glass', productType: 'Fabricated', profile: '6063-T6', glass: '12mm Clear Tempered', colors: ['Silver', 'Black'], laborHrs: 4.0, materialCost: 8500, sellingPrice: 13500, status: 'Active', alloyType: '6063', temper: 'T6', form: 'Profile', currentStock: 18, minStock: 5, maxStock: 40, warehouseLocation: 'C-2-1', purchasePrice: 7800, markupPercent: 59, profileCost: 3500, glassCost: 3000, hardwareCost: 1500, fabLaborCost: 800, overheadPercent: 15 },
  { id: 'PRD-009', code: 'LV-6063-L1', name: 'Aluminum Louver Window', nameAm: 'አልሚኒየም ላውቨር መስኮት', category: 'Louvers', subcategory: 'Adjustable', productType: 'Fabricated', profile: '6063-T5', glass: '5mm Frosted', colors: ['White', 'Silver'], laborHrs: 3.0, materialCost: 3500, sellingPrice: 5600, status: 'Active', alloyType: '6063', temper: 'T5', form: 'Profile', currentStock: 22, minStock: 5, maxStock: 50, warehouseLocation: 'A-3-1', purchasePrice: 3200, markupPercent: 60, profileCost: 1800, glassCost: 800, hardwareCost: 500, fabLaborCost: 600, overheadPercent: 15 },
  { id: 'PRD-010', code: 'PT-6063-P1', name: 'Office Partition System', nameAm: 'የቢሮ ክፋፍል ስርዓት', category: 'Partitions', subcategory: 'Full Height', productType: 'Custom', profile: '6063-T5', glass: '10mm Clear Tempered', colors: ['Silver', 'White'], laborHrs: 5.0, materialCost: 7200, sellingPrice: 11500, status: 'Active', alloyType: '6063', temper: 'T5', form: 'Profile', currentStock: 10, minStock: 3, maxStock: 25, warehouseLocation: 'D-1-1', purchasePrice: 6600, markupPercent: 60, profileCost: 3500, glassCost: 2200, hardwareCost: 800, fabLaborCost: 700, overheadPercent: 18 },
  { id: 'PRD-011', code: 'SH-6061-01', name: '6061 Aluminum Sheet 4x8', nameAm: '6061 አልሚኒየም ሉህ 4x8', category: 'Sheet', subcategory: 'Standard', productType: 'Raw Material', profile: '6061-T6', glass: '', colors: [], laborHrs: 0, materialCost: 2800, sellingPrice: 4200, status: 'Active', alloyType: '6061', temper: 'T6', form: 'Sheet', length: 2440, width: 1220, thickness: 3, currentStock: 50, minStock: 15, maxStock: 100, warehouseLocation: 'E-1-1', purchasePrice: 2500, markupPercent: 50 },
  { id: 'PRD-012', code: 'TB-6063-01', name: '6063 Round Tube 50mm', nameAm: '6063 ክብ ቱቦ 50ሚሜ', category: 'Tube/Pipe', subcategory: 'Round', productType: 'Raw Material', profile: '6063-T5', glass: '', colors: [], laborHrs: 0, materialCost: 850, sellingPrice: 1350, status: 'Active', alloyType: '6063', temper: 'T5', form: 'Tube/Pipe', diameter: 50, wallThickness: 2, weightPerMeter: 0.82, currentStock: 200, minStock: 50, maxStock: 500, warehouseLocation: 'E-2-1', purchasePrice: 750, markupPercent: 59 },
];

// ═══ SAMPLE PROJECTS ═══
export const sampleProjects: Project[] = [
  { id: 'PJ-001', name: 'Bole Apartments Tower A', nameAm: 'ቦሌ አፓርትመንት ታወር ሀ', customerId: 'CUS-001', customerName: 'Ayat Real Estate', type: 'Commercial', status: 'Production', value: 850000, deposit: 425000, balance: 425000, progress: 45, orderDate: '2025-01-15', dueDate: '2025-04-30' },
  { id: 'PJ-002', name: 'Villa Sunshine Residence', nameAm: 'ቪላ ሳንሻይን መኖሪያ', customerId: 'CUS-002', customerName: 'Ato Kebede Alemu', type: 'Residential', status: 'Materials Ordered', value: 285000, deposit: 142500, balance: 142500, progress: 25, orderDate: '2025-02-01', dueDate: '2025-05-15' },
  { id: 'PJ-003', name: 'Megenagna Office Complex', nameAm: 'መገናኛ ቢሮ ኮምፕሌክስ', customerId: 'CUS-003', customerName: 'Ethio Engineering', type: 'Commercial', status: 'Installation', value: 1200000, deposit: 900000, balance: 300000, progress: 85, orderDate: '2024-11-01', dueDate: '2025-03-15' },
  { id: 'PJ-004', name: 'Sarbet Hotel Renovation', nameAm: 'ሳርቤት ሆቴል ማደስ', customerId: 'CUS-004', customerName: 'Getahun Hotels PLC', type: 'Commercial', status: 'Quote', value: 450000, deposit: 0, balance: 450000, progress: 5, orderDate: '2025-02-20', dueDate: '2025-06-30' },
  { id: 'PJ-005', name: 'CMC Residential Block', nameAm: 'ሲኤምሲ መኖሪያ ብሎክ', customerId: 'CUS-005', customerName: 'Noah Construction', type: 'Residential', status: 'Ready', value: 520000, deposit: 390000, balance: 130000, progress: 95, orderDate: '2024-12-10', dueDate: '2025-03-01' },
  { id: 'PJ-006', name: 'Kazanchis Bank Branch', nameAm: 'ካዛንቺስ ባንክ ቅርንጫፍ', customerId: 'CUS-006', customerName: 'Commercial Bank Ethiopia', type: 'Commercial', status: 'Deposit', value: 380000, deposit: 190000, balance: 190000, progress: 15, orderDate: '2025-02-10', dueDate: '2025-05-20' },
  { id: 'PJ-007', name: 'Addis View Penthouse', nameAm: 'አዲስ ቪው ፔንትሃውስ', customerId: 'CUS-007', customerName: 'W/ro Tigist Haile', type: 'Residential', status: 'Completed', value: 195000, deposit: 195000, balance: 0, progress: 100, orderDate: '2024-09-15', dueDate: '2025-01-15' },
];

// ═══ SAMPLE ORDERS ═══
export const sampleOrders: Order[] = [
  { id: 'ORD-001', customerId: 'CUS-001', customerName: 'Ayat Real Estate', projectId: 'PJ-001', orderDate: '2025-01-20', requestedDelivery: '2025-04-30', status: 'Processing', paymentStatus: 'Partial', paymentMethod: 'Bank Transfer', shippingMethod: 'Local Delivery', subtotal: 765000, tax: 114750, total: 879750, paid: 425000, balance: 454750, items: [
    { productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 48, quantityShipped: 22, unitPrice: 7200, lineTotal: 345600 },
    { productId: 'PRD-004', productName: 'Sliding Door 3-Panel', quantity: 12, quantityShipped: 5, unitPrice: 19500, lineTotal: 234000 },
    { productId: 'PRD-003', productName: 'Fixed Window Large', quantity: 24, quantityShipped: 10, unitPrice: 6000, lineTotal: 144000 },
  ] },
  { id: 'ORD-002', customerId: 'CUS-003', customerName: 'Ethio Engineering', projectId: 'PJ-003', orderDate: '2024-11-05', requestedDelivery: '2025-03-15', status: 'Shipped', paymentStatus: 'Partial', paymentMethod: 'Bank Transfer', shippingMethod: 'Local Delivery', subtotal: 1043000, tax: 156450, total: 1199450, paid: 900000, balance: 299450, items: [
    { productId: 'PRD-007', productName: 'Curtain Wall System', quantity: 1, quantityShipped: 1, unitPrice: 55000, lineTotal: 55000 },
    { productId: 'PRD-008', productName: 'Glass Handrail System', quantity: 6, quantityShipped: 4, unitPrice: 13500, lineTotal: 81000 },
    { productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 120, quantityShipped: 100, unitPrice: 7200, lineTotal: 864000 },
  ] },
  { id: 'ORD-003', customerId: 'CUS-005', customerName: 'Noah Construction', projectId: 'PJ-005', orderDate: '2024-12-15', requestedDelivery: '2025-03-01', status: 'Ready', paymentStatus: 'Partial', paymentMethod: 'Cash', shippingMethod: 'Pickup', subtotal: 452000, tax: 67800, total: 519800, paid: 390000, balance: 129800, items: [
    { productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 32, quantityShipped: 30, unitPrice: 7200, lineTotal: 230400 },
    { productId: 'PRD-005', productName: 'Hinged Door Double', quantity: 8, quantityShipped: 8, unitPrice: 15200, lineTotal: 121600 },
    { productId: 'PRD-009', productName: 'Aluminum Louver Window', quantity: 15, quantityShipped: 10, unitPrice: 5600, lineTotal: 84000 },
  ] },
  { id: 'ORD-004', customerId: 'CUS-006', customerName: 'Commercial Bank Ethiopia', projectId: 'PJ-006', orderDate: '2025-02-12', requestedDelivery: '2025-05-20', status: 'Draft', paymentStatus: 'Unpaid', paymentMethod: 'Bank Transfer', shippingMethod: 'Local Delivery', subtotal: 330000, tax: 49500, total: 379500, paid: 190000, balance: 189500, items: [
    { productId: 'PRD-010', productName: 'Office Partition System', quantity: 20, quantityShipped: 0, unitPrice: 11500, lineTotal: 230000 },
    { productId: 'PRD-002', productName: 'Casement Window Single', quantity: 15, quantityShipped: 0, unitPrice: 5100, lineTotal: 76500 },
  ] },
  { id: 'ORD-005', customerId: 'CUS-002', customerName: 'Ato Kebede Alemu', projectId: 'PJ-002', orderDate: '2025-02-05', requestedDelivery: '2025-05-15', status: 'Payment Received', paymentStatus: 'Paid', paymentMethod: 'TeleBirr', shippingMethod: 'Local Delivery', subtotal: 248000, tax: 37200, total: 285200, paid: 285200, balance: 0, items: [
    { productId: 'PRD-002', productName: 'Casement Window Single', quantity: 16, quantityShipped: 0, unitPrice: 5100, lineTotal: 81600 },
    { productId: 'PRD-009', productName: 'Aluminum Louver Window', quantity: 6, quantityShipped: 0, unitPrice: 5600, lineTotal: 33600 },
    { productId: 'PRD-005', productName: 'Hinged Door Double', quantity: 4, quantityShipped: 0, unitPrice: 15200, lineTotal: 60800 },
  ] },
  { id: 'ORD-006', customerId: 'CUS-007', customerName: 'W/ro Tigist Haile', projectId: 'PJ-007', orderDate: '2024-09-20', requestedDelivery: '2025-01-15', actualDelivery: '2025-01-12', status: 'Completed', paymentStatus: 'Paid', paymentMethod: 'Bank Transfer', shippingMethod: 'Local Delivery', subtotal: 169500, tax: 25425, total: 194925, paid: 194925, balance: 0, items: [
    { productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 10, quantityShipped: 10, unitPrice: 7200, lineTotal: 72000 },
    { productId: 'PRD-004', productName: 'Sliding Door 3-Panel', quantity: 2, quantityShipped: 2, unitPrice: 19500, lineTotal: 39000 },
    { productId: 'PRD-008', productName: 'Glass Handrail System', quantity: 3, quantityShipped: 3, unitPrice: 13500, lineTotal: 40500 },
  ] },
];

// ═══ SAMPLE INVENTORY ═══
export const sampleInventory: InventoryItem[] = [
  { id: 'INV-001', code: 'PF-6063-01', name: 'Window Frame Profile 6063', nameAm: 'የመስኮት ፍሬም ፕሮፋይል 6063', category: 'Profile', unit: 'meter', stock: 450, minStock: 100, reserved: 120, available: 330, location: 'R1-A1', cost: 85, alloyType: '6063', temper: 'T5', form: 'Profile', sellingPrice: 135, batchNumber: 'BT-2025-001', millCertificate: true, dateReceived: '2025-02-01' },
  { id: 'INV-002', code: 'PF-6063-02', name: 'Door Frame Profile 6063', nameAm: 'የበር ፍሬም ፕሮፋይል 6063', category: 'Profile', unit: 'meter', stock: 280, minStock: 80, reserved: 90, available: 190, location: 'R1-A2', cost: 120, alloyType: '6063', temper: 'T6', form: 'Profile', sellingPrice: 195, batchNumber: 'BT-2025-002', millCertificate: true, dateReceived: '2025-01-15' },
  { id: 'INV-003', code: 'PF-6060-01', name: 'Curtain Wall Mullion 6060', nameAm: 'ከርተን ወል ሙሊዮን 6060', category: 'Profile', unit: 'meter', stock: 150, minStock: 50, reserved: 80, available: 70, location: 'R1-B1', cost: 180, alloyType: '6060', temper: 'T5', form: 'Profile', sellingPrice: 290, batchNumber: 'BT-2025-003', millCertificate: true, dateReceived: '2025-01-20' },
  { id: 'INV-004', code: 'GL-CLR-06', name: '6mm Clear Tempered Glass', nameAm: '6ሚሜ ግልጽ ጠንካራ መስታወት', category: 'Glass', unit: 'sqm', stock: 85, minStock: 30, reserved: 25, available: 60, location: 'R2-A1', cost: 450, sellingPrice: 720, dateReceived: '2025-02-10' },
  { id: 'INV-005', code: 'GL-TNT-08', name: '8mm Tinted Tempered Glass', nameAm: '8ሚሜ ቀለም ጠንካራ መስታወት', category: 'Glass', unit: 'sqm', stock: 45, minStock: 20, reserved: 15, available: 30, location: 'R2-A2', cost: 620, sellingPrice: 990, dateReceived: '2025-02-05' },
  { id: 'INV-006', code: 'GL-DGU-12', name: '12mm DGU Glass Unit', nameAm: '12ሚሜ ዲጂዩ መስታወት', category: 'Glass', unit: 'sqm', stock: 25, minStock: 15, reserved: 10, available: 15, location: 'R2-B1', cost: 1200, sellingPrice: 1920, dateReceived: '2025-01-25' },
  { id: 'INV-007', code: 'HW-HNG-01', name: 'Heavy Duty Hinge (pair)', nameAm: 'ከባድ ሂንጅ (ጥንድ)', category: 'Hardware', unit: 'pair', stock: 120, minStock: 40, reserved: 30, available: 90, location: 'R3-A1', cost: 350, sellingPrice: 560, dateReceived: '2025-02-15' },
  { id: 'INV-008', code: 'HW-LCK-01', name: 'Multi-point Lock System', nameAm: 'ብዙ-ነጥብ ቁልፍ ስርዓት', category: 'Hardware', unit: 'piece', stock: 65, minStock: 25, reserved: 15, available: 50, location: 'R3-A2', cost: 850, sellingPrice: 1360, dateReceived: '2025-02-12' },
  { id: 'INV-009', code: 'HW-HDL-01', name: 'Aluminum Handle Set', nameAm: 'የአልሚኒየም እጀታ ስብስብ', category: 'Hardware', unit: 'set', stock: 95, minStock: 30, reserved: 20, available: 75, location: 'R3-B1', cost: 280, sellingPrice: 450, dateReceived: '2025-02-08' },
  { id: 'INV-010', code: 'AC-GSK-01', name: 'EPDM Gasket Roll', nameAm: 'ኢፒዲኤም ጋስኬት ጥቅል', category: 'Accessory', unit: 'meter', stock: 500, minStock: 200, reserved: 100, available: 400, location: 'R4-A1', cost: 25, sellingPrice: 40, dateReceived: '2025-01-30' },
  { id: 'INV-011', code: 'AC-WS-01', name: 'Weather Strip Roll', nameAm: 'የአየር ሁኔታ ስትሪፕ ጥቅል', category: 'Accessory', unit: 'meter', stock: 350, minStock: 150, reserved: 80, available: 270, location: 'R4-A2', cost: 18, sellingPrice: 30, dateReceived: '2025-02-01' },
  { id: 'INV-012', code: 'AC-SIL-01', name: 'Silicone Sealant (tube)', nameAm: 'ሲሊኮን ማተሚያ (ቱቦ)', category: 'Accessory', unit: 'piece', stock: 180, minStock: 50, reserved: 30, available: 150, location: 'R4-B1', cost: 120, sellingPrice: 190, dateReceived: '2025-02-10' },
  { id: 'INV-013', code: 'AC-SCR-01', name: 'Self-tapping Screws (box)', nameAm: 'ራስ-ቆፋሪ ብሎኖች (ሳጥን)', category: 'Accessory', unit: 'box', stock: 45, minStock: 20, reserved: 10, available: 35, location: 'R4-B2', cost: 85, sellingPrice: 135, dateReceived: '2025-01-28' },
  { id: 'INV-014', code: 'ST-ANG-01', name: 'Steel Angle 40x40mm', nameAm: 'ብረት አንግል 40x40ሚሜ', category: 'Steel', unit: 'meter', stock: 8, minStock: 30, reserved: 0, available: 8, location: 'R5-A1', cost: 95, sellingPrice: 150, dateReceived: '2025-01-10' },
  { id: 'INV-015', code: 'ST-PLT-01', name: 'Steel Base Plate 6mm', nameAm: 'ብረት መሰረት ሰሌዳ 6ሚሜ', category: 'Steel', unit: 'piece', stock: 12, minStock: 10, reserved: 5, available: 7, location: 'R5-A2', cost: 250, sellingPrice: 400, dateReceived: '2025-01-15' },
];

// ═══ SAMPLE CUSTOMERS ═══
export const sampleCustomers: Customer[] = [
  { id: 'CUS-001', name: 'Ayat Real Estate', nameAm: 'አያት ሪል ኢስቴት', contact: 'Ato Yonas Bekele', type: 'Developer', phone: '+251-911-234567', phoneSecondary: '+251-911-234568', email: 'yonas@ayatre.com', address: 'Bole, Addis Ababa', taxId: 'TIN-0012345', paymentTerms: 'Net 30', creditLimit: 2000000, source: 'Referral', projects: 3, totalValue: 2500000, outstanding: 425000, status: 'Active' },
  { id: 'CUS-002', name: 'Ato Kebede Alemu', nameAm: 'አቶ ከበደ ዓለሙ', contact: 'Kebede Alemu', type: 'Individual', phone: '+251-912-345678', email: 'kebede@gmail.com', address: 'CMC, Addis Ababa', paymentTerms: 'COD', creditLimit: 500000, source: 'Website', projects: 1, totalValue: 285000, outstanding: 142500, status: 'Active' },
  { id: 'CUS-003', name: 'Ethio Engineering', nameAm: 'ኢትዮ ኢንጅነሪንግ', contact: 'Eng. Dawit Tesfaye', type: 'Contractor', phone: '+251-913-456789', email: 'dawit@ethioeng.com', address: 'Megenagna, Addis Ababa', taxId: 'TIN-0023456', paymentTerms: 'Net 60', creditLimit: 5000000, source: 'Trade Show', projects: 5, totalValue: 3800000, outstanding: 300000, status: 'Active' },
  { id: 'CUS-004', name: 'Getahun Hotels PLC', nameAm: 'ጌታሁን ሆቴሎች ኃ/የ/ማ', contact: 'W/ro Meron Getahun', type: 'Company', phone: '+251-914-567890', email: 'meron@getahunhotels.com', address: 'Sarbet, Addis Ababa', taxId: 'TIN-0034567', paymentTerms: 'Net 30', creditLimit: 1000000, source: 'Website', projects: 2, totalValue: 950000, outstanding: 450000, status: 'Active' },
  { id: 'CUS-005', name: 'Noah Construction', nameAm: 'ኖህ ኮንስትራክሽን', contact: 'Ato Samuel Noah', type: 'Contractor', phone: '+251-915-678901', email: 'samuel@noahcon.com', address: 'Lideta, Addis Ababa', taxId: 'TIN-0045678', paymentTerms: 'Net 30', creditLimit: 3000000, source: 'Referral', projects: 4, totalValue: 1800000, outstanding: 130000, status: 'Active' },
  { id: 'CUS-006', name: 'Commercial Bank Ethiopia', nameAm: 'የኢትዮጵያ ንግድ ባንክ', contact: 'Ato Tadesse Girma', type: 'Company', phone: '+251-916-789012', email: 'tadesse@cbe.com.et', address: 'Kazanchis, Addis Ababa', taxId: 'TIN-0056789', paymentTerms: 'Net 30', creditLimit: 10000000, source: 'Direct', projects: 1, totalValue: 380000, outstanding: 190000, status: 'Active' },
  { id: 'CUS-007', name: 'W/ro Tigist Haile', nameAm: 'ወ/ሮ ትግስት ኃይሌ', contact: 'Tigist Haile', type: 'Individual', phone: '+251-917-890123', email: 'tigist@yahoo.com', address: 'Bole Atlas, Addis Ababa', paymentTerms: 'COD', creditLimit: 300000, projects: 1, totalValue: 195000, outstanding: 0, status: 'Active' },
  { id: 'CUS-008', name: 'Addis Builders PLC', nameAm: 'አዲስ ገንቢዎች ኃ/የ/ማ', contact: 'Ato Henok Assefa', type: 'Contractor', phone: '+251-918-901234', email: 'henok@addisbuilders.com', address: 'Mexico, Addis Ababa', taxId: 'TIN-0067890', paymentTerms: 'Net 30', creditLimit: 2000000, source: 'Referral', projects: 2, totalValue: 620000, outstanding: 85000, status: 'Active' },
];

// ═══ SAMPLE QUOTES ═══
export const sampleQuotes: Quote[] = [
  { id: 'QT-001', customerId: 'CUS-004', customerName: 'Getahun Hotels PLC', projectName: 'Sarbet Hotel Renovation', items: 12, materialCost: 280000, laborCost: 85000, installCost: 45000, transportCost: 15000, cuttingFee: 2400, finishUpcharge: 42000, discount: 0, subtotal: 469400, vat: 70410, total: 539810, marginPercent: 38, status: 'Pending', date: '2025-02-20', validity: '2025-03-20', finishType: 'Anodized' },
  { id: 'QT-002', customerId: 'CUS-001', customerName: 'Ayat Real Estate', projectName: 'Bole Tower B', items: 45, materialCost: 520000, laborCost: 150000, installCost: 80000, transportCost: 25000, cuttingFee: 9000, finishUpcharge: 78000, subtotal: 862000, vat: 129300, total: 991300, marginPercent: 42, status: 'Pending', date: '2025-02-18', validity: '2025-03-18', finishType: 'Powder Coated' },
  { id: 'QT-003', customerId: 'CUS-008', customerName: 'Addis Builders PLC', projectName: 'Residential Complex G+5', items: 28, materialCost: 185000, laborCost: 55000, installCost: 35000, transportCost: 10000, subtotal: 285000, vat: 42750, total: 327750, marginPercent: 35, status: 'Accepted', date: '2025-02-10', validity: '2025-03-10', finishType: 'Mill Finish' },
  { id: 'QT-004', customerId: 'CUS-002', customerName: 'Ato Kebede Alemu', projectName: 'Villa Gate & Windows', items: 8, materialCost: 65000, laborCost: 18000, installCost: 12000, transportCost: 5000, subtotal: 100000, vat: 15000, total: 115000, marginPercent: 28, status: 'Rejected', date: '2025-01-25', validity: '2025-02-25' },
  { id: 'QT-005', customerId: 'CUS-005', customerName: 'Noah Construction', projectName: 'CMC Phase 2 Block C', items: 35, materialCost: 320000, laborCost: 95000, installCost: 55000, transportCost: 18000, cuttingFee: 7000, subtotal: 495000, vat: 74250, total: 569250, marginPercent: 40, status: 'Accepted', date: '2025-02-05', validity: '2025-03-05', finishType: 'Polished' },
  { id: 'QT-006', customerId: 'CUS-003', customerName: 'Ethio Engineering', projectName: 'Lideta Tower Phase 2', items: 60, materialCost: 780000, laborCost: 220000, installCost: 120000, transportCost: 35000, rushFee: 57750, subtotal: 1212750, vat: 181912, total: 1394662, marginPercent: 45, status: 'Pending', date: '2025-02-25', validity: '2025-03-25', finishType: 'Anodized', notes: 'Rush order - 5% surcharge' },
];

// ═══ SAMPLE WORK ORDERS ═══
export const sampleWorkOrders: WorkOrder[] = [
  { id: 'WO-001', projectId: 'PJ-001', productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 48, completed: 22, assignee: 'Team Alpha', priority: 'High', stage: 'Assembly', progress: 46, startDate: '2025-02-10', dueDate: '2025-03-15' },
  { id: 'WO-002', projectId: 'PJ-001', productId: 'PRD-004', productName: 'Sliding Door 3-Panel', quantity: 12, completed: 5, assignee: 'Team Beta', priority: 'High', stage: 'Welding', progress: 42, startDate: '2025-02-12', dueDate: '2025-03-20' },
  { id: 'WO-003', projectId: 'PJ-002', productId: 'PRD-002', productName: 'Casement Window Single', quantity: 16, completed: 0, assignee: 'Team Alpha', priority: 'Medium', stage: 'Cutting', progress: 5, startDate: '2025-02-25', dueDate: '2025-04-01' },
  { id: 'WO-004', projectId: 'PJ-003', productId: 'PRD-007', productName: 'Curtain Wall System', quantity: 1, completed: 0, assignee: 'Team Gamma', priority: 'High', stage: 'Glazing', progress: 75, startDate: '2025-01-15', dueDate: '2025-03-01' },
  { id: 'WO-005', projectId: 'PJ-005', productId: 'PRD-001', productName: 'Sliding Window 2-Panel', quantity: 32, completed: 30, assignee: 'Team Beta', priority: 'Medium', stage: 'Quality Check', progress: 94, startDate: '2025-01-20', dueDate: '2025-02-28' },
  { id: 'WO-006', projectId: 'PJ-005', productId: 'PRD-005', productName: 'Hinged Door Double', quantity: 8, completed: 8, assignee: 'Team Alpha', priority: 'Low', stage: 'Packaging', progress: 100, startDate: '2025-02-01', dueDate: '2025-02-28' },
  { id: 'WO-007', projectId: 'PJ-003', productId: 'PRD-008', productName: 'Glass Handrail System', quantity: 6, completed: 4, assignee: 'Team Gamma', priority: 'High', stage: 'Assembly', progress: 67, startDate: '2025-02-05', dueDate: '2025-03-10' },
  { id: 'WO-008', projectId: 'PJ-001', productId: 'PRD-003', productName: 'Fixed Window Large', quantity: 24, completed: 10, assignee: 'Team Beta', priority: 'Medium', stage: 'Machining', progress: 42, startDate: '2025-02-15', dueDate: '2025-03-25' },
  { id: 'WO-009', projectId: 'PJ-006', productId: 'PRD-010', productName: 'Office Partition System', quantity: 4, completed: 0, assignee: 'Team Alpha', priority: 'Medium', stage: 'Cutting', progress: 0, startDate: '2025-03-01', dueDate: '2025-04-15' },
  { id: 'WO-010', projectId: 'PJ-002', productId: 'PRD-009', productName: 'Aluminum Louver Window', quantity: 6, completed: 0, assignee: 'Team Beta', priority: 'Low', stage: 'Cutting', progress: 0, startDate: '2025-03-05', dueDate: '2025-04-10' },
];

// ═══ SAMPLE PURCHASE ORDERS ═══
export const samplePurchaseOrders: PurchaseOrder[] = [
  { id: 'PO-001', supplierId: 'SUP-001', supplierName: 'Emirates Aluminum (EMAL)', orderDate: '2025-01-10', expectedDelivery: '2025-02-25', status: 'Received', items: [
    { productId: 'INV-001', productName: 'Window Frame Profile 6063', quantity: 500, received: 500, unitPrice: 80, lineTotal: 40000 },
    { productId: 'INV-002', productName: 'Door Frame Profile 6063', quantity: 300, received: 300, unitPrice: 115, lineTotal: 34500 },
  ], subtotal: 74500, shipping: 12000, total: 86500, paid: 86500 },
  { id: 'PO-002', supplierId: 'SUP-002', supplierName: 'China Zhongwang Holdings', orderDate: '2025-02-01', expectedDelivery: '2025-04-01', status: 'Shipped', shippingMethod: 'Sea', items: [
    { productId: 'INV-003', productName: 'Curtain Wall Mullion 6060', quantity: 200, received: 0, unitPrice: 170, lineTotal: 34000 },
    { productId: 'INV-001', productName: 'Window Frame Profile 6063', quantity: 1000, received: 0, unitPrice: 78, lineTotal: 78000 },
  ], subtotal: 112000, shipping: 25000, total: 137000, paid: 41100, notes: 'Container ETH-2025-0234' },
  { id: 'PO-003', supplierId: 'SUP-004', supplierName: 'Addis Glass Factory', orderDate: '2025-02-15', expectedDelivery: '2025-02-22', status: 'Confirmed', items: [
    { productId: 'INV-004', productName: '6mm Clear Tempered Glass', quantity: 100, received: 0, unitPrice: 420, lineTotal: 42000 },
    { productId: 'INV-005', productName: '8mm Tinted Tempered Glass', quantity: 50, received: 0, unitPrice: 580, lineTotal: 29000 },
  ], subtotal: 71000, shipping: 3000, total: 74000, paid: 0 },
  { id: 'PO-004', supplierId: 'SUP-005', supplierName: 'Guangzhou Hardware Co.', orderDate: '2025-02-20', expectedDelivery: '2025-04-15', status: 'Sent', shippingMethod: 'Sea', items: [
    { productId: 'INV-007', productName: 'Heavy Duty Hinge (pair)', quantity: 200, received: 0, unitPrice: 320, lineTotal: 64000 },
    { productId: 'INV-008', productName: 'Multi-point Lock System', quantity: 100, received: 0, unitPrice: 800, lineTotal: 80000 },
    { productId: 'INV-009', productName: 'Aluminum Handle Set', quantity: 150, received: 0, unitPrice: 260, lineTotal: 39000 },
  ], subtotal: 183000, shipping: 18000, total: 201000, paid: 100500, notes: 'TT 50/50 payment terms' },
];

// ═══ SAMPLE CUTTING JOBS ═══
export const sampleCuttingJobs: CuttingJob[] = [
  { id: 'CJ-001', orderId: 'ORD-001', productName: 'Window Frame Profile 6063', originalLength: 6000, cuts: [1200, 1200, 1200, 1200], totalCuts: 4, waste: 1200, wastePercent: 20, assignee: 'Yosef Bekele', machine: 'Double Head Cutting', status: 'Completed', startTime: '2025-02-20 08:00', endTime: '2025-02-20 09:30' },
  { id: 'CJ-002', orderId: 'ORD-001', productName: 'Door Frame Profile 6063', originalLength: 6000, cuts: [2100, 2100, 900, 900], totalCuts: 4, waste: 0, wastePercent: 0, assignee: 'Yosef Bekele', machine: 'Double Head Cutting', status: 'Completed', startTime: '2025-02-20 10:00', endTime: '2025-02-20 11:00' },
  { id: 'CJ-003', orderId: 'ORD-002', productName: 'Curtain Wall Mullion 6060', originalLength: 6000, cuts: [3000, 2800], totalCuts: 2, waste: 200, wastePercent: 3.3, assignee: 'Abebe Tekle', machine: 'CNC Copy Router', status: 'In Progress', startTime: '2025-02-27 08:00' },
  { id: 'CJ-004', orderId: 'ORD-003', productName: 'Window Frame Profile 6063', originalLength: 6000, cuts: [1500, 1500, 1500, 1500], totalCuts: 4, waste: 0, wastePercent: 0, assignee: 'Yosef Bekele', machine: 'Double Head Cutting', status: 'Pending', notes: 'Optimal cut - zero waste' },
  { id: 'CJ-005', orderId: 'ORD-005', productName: 'Window Frame Profile 6063', originalLength: 6000, cuts: [800, 800, 800, 800, 800, 800], totalCuts: 6, waste: 1200, wastePercent: 20, assignee: 'Abebe Tekle', machine: 'Double Head Cutting', status: 'Pending' },
];

// ═══ SAMPLE INVOICES ═══
export const sampleInvoices: Invoice[] = [
  { id: 'INV-001', projectId: 'PJ-001', customerName: 'Ayat Real Estate', amount: 425000, paid: 425000, balance: 0, status: 'Paid', dueDate: '2025-02-15', issuedDate: '2025-01-20' },
  { id: 'INV-002', projectId: 'PJ-001', customerName: 'Ayat Real Estate', amount: 425000, paid: 0, balance: 425000, status: 'Overdue', dueDate: '2025-02-28', issuedDate: '2025-02-01' },
  { id: 'INV-003', projectId: 'PJ-002', customerName: 'Ato Kebede Alemu', amount: 142500, paid: 142500, balance: 0, status: 'Paid', dueDate: '2025-03-01', issuedDate: '2025-02-05' },
  { id: 'INV-004', projectId: 'PJ-003', customerName: 'Ethio Engineering', amount: 600000, paid: 600000, balance: 0, status: 'Paid', dueDate: '2025-01-30', issuedDate: '2024-11-10' },
  { id: 'INV-005', projectId: 'PJ-003', customerName: 'Ethio Engineering', amount: 300000, paid: 300000, balance: 0, status: 'Paid', dueDate: '2025-02-15', issuedDate: '2025-01-15' },
  { id: 'INV-006', projectId: 'PJ-003', customerName: 'Ethio Engineering', amount: 300000, paid: 150000, balance: 150000, status: 'Partial', dueDate: '2025-03-15', issuedDate: '2025-02-15' },
  { id: 'INV-007', projectId: 'PJ-005', customerName: 'Noah Construction', amount: 260000, paid: 260000, balance: 0, status: 'Paid', dueDate: '2025-01-10', issuedDate: '2024-12-15' },
  { id: 'INV-008', projectId: 'PJ-006', customerName: 'Commercial Bank Ethiopia', amount: 190000, paid: 190000, balance: 0, status: 'Paid', dueDate: '2025-03-10', issuedDate: '2025-02-12' },
  { id: 'INV-009', projectId: 'PJ-004', customerName: 'Getahun Hotels PLC', amount: 225000, paid: 0, balance: 225000, status: 'Pending', dueDate: '2025-04-15', issuedDate: '2025-02-25' },
];

// ═══ SAMPLE PAYMENTS ═══
export const samplePayments: Payment[] = [
  { id: 'PAY-001', invoiceId: 'INV-001', date: '2025-02-10', customerName: 'Ayat Real Estate', amount: 425000, method: 'Bank Transfer', reference: 'CBE-TXN-20250210-001' },
  { id: 'PAY-002', invoiceId: 'INV-003', date: '2025-02-25', customerName: 'Ato Kebede Alemu', amount: 142500, method: 'TeleBirr', reference: 'TB-20250225-4521' },
  { id: 'PAY-003', invoiceId: 'INV-004', date: '2025-01-28', customerName: 'Ethio Engineering', amount: 300000, method: 'Bank Transfer', reference: 'CBE-TXN-20250128-005' },
  { id: 'PAY-004', invoiceId: 'INV-004', date: '2025-01-30', customerName: 'Ethio Engineering', amount: 300000, method: 'Bank Transfer', reference: 'CBE-TXN-20250130-002' },
  { id: 'PAY-005', invoiceId: 'INV-005', date: '2025-02-14', customerName: 'Ethio Engineering', amount: 300000, method: 'Bank Transfer', reference: 'CBE-TXN-20250214-008' },
  { id: 'PAY-006', invoiceId: 'INV-006', date: '2025-03-01', customerName: 'Ethio Engineering', amount: 150000, method: 'Cheque', reference: 'CHQ-0045821' },
  { id: 'PAY-007', invoiceId: 'INV-007', date: '2025-01-05', customerName: 'Noah Construction', amount: 130000, method: 'Bank Transfer', reference: 'CBE-TXN-20250105-003' },
  { id: 'PAY-008', invoiceId: 'INV-007', date: '2025-01-10', customerName: 'Noah Construction', amount: 130000, method: 'Cash', reference: 'CASH-20250110-001' },
  { id: 'PAY-009', invoiceId: 'INV-008', date: '2025-03-05', customerName: 'Commercial Bank Ethiopia', amount: 190000, method: 'Bank Transfer', reference: 'CBE-TXN-20250305-010' },
  { id: 'PAY-010', invoiceId: 'INV-005', date: '2025-02-20', customerName: 'Noah Construction', amount: 65000, method: 'TeleBirr', reference: 'TB-20250220-7812' },
  { id: 'PAY-011', invoiceId: 'INV-001', date: '2025-02-12', customerName: 'Ayat Real Estate', amount: 200000, method: 'Cheque', reference: 'CHQ-0045799' },
  { id: 'PAY-012', invoiceId: 'INV-002', date: '2025-02-28', customerName: 'Getahun Hotels PLC', amount: 95000, method: 'Bank Transfer', reference: 'CBE-TXN-20250228-015' },
];

// ═══ SAMPLE EMPLOYEES ═══
export const sampleEmployees: Employee[] = [
  { id: 'EMP-001', name: 'Abebe Tekle', nameAm: 'አበበ ተክሌ', position: 'Production Manager', department: 'Production', email: 'abebe@aluerp.com', phone: '+251-911-111111', hireDate: '2020-03-15', status: 'active', salary: 35000, performance: 92, attendance: 96, leaveBalance: 12 },
  { id: 'EMP-002', name: 'Hana Mulugeta', nameAm: 'ሃና ሙሉጌታ', position: 'Sales Manager', department: 'Sales', email: 'hana@aluerp.com', phone: '+251-912-222222', hireDate: '2021-06-01', status: 'active', salary: 28000, performance: 88, attendance: 94, leaveBalance: 8 },
  { id: 'EMP-003', name: 'Yosef Bekele', nameAm: 'ዮሴፍ በቀለ', position: 'Lead Fabricator', department: 'Production', email: 'yosef@aluerp.com', phone: '+251-913-333333', hireDate: '2019-09-20', status: 'active', salary: 22000, performance: 95, attendance: 98, leaveBalance: 15 },
  { id: 'EMP-004', name: 'Sara Desta', nameAm: 'ሳራ ደስታ', position: 'Accountant', department: 'Finance', email: 'sara@aluerp.com', phone: '+251-914-444444', hireDate: '2022-01-10', status: 'active', salary: 25000, performance: 85, attendance: 92, leaveBalance: 10 },
  { id: 'EMP-005', name: 'Dawit Hailu', nameAm: 'ዳዊት ኃይሉ', position: 'Installation Lead', department: 'Installation', email: 'dawit@aluerp.com', phone: '+251-915-555555', hireDate: '2020-08-05', status: 'active', salary: 20000, performance: 90, attendance: 95, leaveBalance: 14 },
  { id: 'EMP-006', name: 'Marta Teshome', nameAm: 'ማርታ ተሾመ', position: 'Quality Inspector', department: 'Quality', email: 'marta@aluerp.com', phone: '+251-916-666666', hireDate: '2023-02-15', status: 'on-leave', salary: 18000, performance: 87, attendance: 88, leaveBalance: 3 },
];

// ═══ SAMPLE SUPPLIERS ═══
export const sampleSuppliers: Supplier[] = [
  { id: 'SUP-001', company: 'Emirates Aluminum (EMAL)', contact: 'Ahmed Al-Rashid', phone: '+971-50-1234567', email: 'ahmed@emal.ae', website: 'www.emal.ae', country: 'UAE', address: 'Dubai, UAE', leadTime: 45, minOrderQty: 500, rating: 5, preferred: true, paymentTerms: 'LC 90 Days', certifications: ['ISO 9001', 'ISO 14001'] },
  { id: 'SUP-002', company: 'China Zhongwang Holdings', contact: 'Li Wei', phone: '+86-139-1234567', email: 'liwei@zhongwang.com', website: 'www.zhongwang.com', country: 'China', address: 'Liaoyang, China', leadTime: 60, minOrderQty: 1000, rating: 4, preferred: true, paymentTerms: 'TT 30%/70%', certifications: ['ISO 9001'] },
  { id: 'SUP-003', company: 'Schüco International', contact: 'Hans Mueller', phone: '+49-170-1234567', email: 'mueller@schueco.com', website: 'www.schueco.com', country: 'Germany', address: 'Bielefeld, Germany', leadTime: 75, minOrderQty: 200, rating: 5, preferred: false, paymentTerms: 'LC 60 Days', certifications: ['ISO 9001', 'ISO 14001', 'CE'] },
  { id: 'SUP-004', company: 'Addis Glass Factory', contact: 'Ato Tewodros Mengistu', phone: '+251-911-987654', email: 'tewodros@addisglass.com', country: 'Ethiopia', address: 'Akaki, Addis Ababa', leadTime: 7, minOrderQty: 20, rating: 4, preferred: true, paymentTerms: 'Net 30', certifications: ['ES ISO'] },
  { id: 'SUP-005', company: 'Guangzhou Hardware Co.', contact: 'Chen Xiao', phone: '+86-135-9876543', email: 'chen@gzhardware.com', country: 'China', address: 'Guangzhou, China', leadTime: 55, minOrderQty: 100, rating: 3, preferred: false, paymentTerms: 'TT 50%/50%', certifications: ['ISO 9001'] },
];

// ═══ SAMPLE INSTALLATIONS ═══
export const sampleInstallations: Installation[] = [
  { id: 'INST-001', projectId: 'PJ-003', projectName: 'Megenagna Office Complex', customerName: 'Ethio Engineering', address: 'Megenagna, Addis Ababa', scheduledDate: '2025-02-28', team: 'Install Team A', status: 'In Progress', notes: 'Curtain wall floor 5-8 ongoing', notesAm: 'ከርተን ወል ወለል 5-8 በሂደት ላይ' },
  { id: 'INST-002', projectId: 'PJ-005', projectName: 'CMC Residential Block', customerName: 'Noah Construction', address: 'CMC, Addis Ababa', scheduledDate: '2025-03-01', team: 'Install Team B', status: 'Scheduled', notes: 'Windows Block A, floors 1-3', notesAm: 'መስኮቶች ብሎክ ሀ ወለል 1-3' },
  { id: 'INST-003', projectId: 'PJ-001', projectName: 'Bole Apartments Tower A', customerName: 'Ayat Real Estate', address: 'Bole, Addis Ababa', scheduledDate: '2025-03-15', team: 'Install Team A', status: 'Scheduled', notes: 'Pending production completion', notesAm: 'የምርት ማጠናቀቂያ በመጠባበቅ ላይ' },
];

// ═══ SAMPLE MAINTENANCE TASKS ═══
export const sampleMaintenanceTasks: MaintenanceTask[] = [
  { id: 'MT-001', machineId: 'M-001', machineName: 'Double Head Cutting Machine', type: 'Preventive', scheduledDate: '2025-03-01', status: 'Scheduled', assignee: 'Yosef Bekele', notes: 'Blade replacement and calibration', cost: 5000, lastMaintenance: '2025-01-15' },
  { id: 'MT-002', machineId: 'M-002', machineName: 'CNC Copy Router', type: 'Corrective', scheduledDate: '2025-02-27', status: 'Overdue', assignee: 'Abebe Tekle', notes: 'Motor bearing replacement needed', cost: 15000, lastMaintenance: '2024-12-20' },
  { id: 'MT-003', machineId: 'M-003', machineName: 'Crimping Machine', type: 'Preventive', scheduledDate: '2025-03-05', status: 'Scheduled', assignee: 'Yosef Bekele', notes: 'Regular maintenance check', cost: 3000, lastMaintenance: '2025-02-05' },
  { id: 'MT-004', machineId: 'M-004', machineName: 'Glass Cutting Table', type: 'Predictive', scheduledDate: '2025-03-10', status: 'Scheduled', assignee: 'Dawit Hailu', notes: 'Sensor indicates wear on cutting wheel', cost: 8000, lastMaintenance: '2025-01-25' },
];

// ═══ SAMPLE QUALITY CHECKS ═══
export const sampleQualityChecks: QualityCheck[] = [
  { id: 'QC-001', workOrderId: 'WO-005', productName: 'Sliding Window 2-Panel', inspector: 'Marta Teshome', date: '2025-02-25', result: 'Pass', defects: [], notes: 'All specs within tolerance' },
  { id: 'QC-002', workOrderId: 'WO-001', productName: 'Sliding Window 2-Panel', inspector: 'Marta Teshome', date: '2025-02-26', result: 'Conditional', defects: ['Minor scratch on frame'], notes: 'Touch-up required before packaging' },
  { id: 'QC-003', workOrderId: 'WO-004', productName: 'Curtain Wall System', inspector: 'Abebe Tekle', date: '2025-02-27', result: 'Pass', defects: [], notes: 'Pressure test passed' },
  { id: 'QC-004', workOrderId: 'WO-002', productName: 'Sliding Door 3-Panel', inspector: 'Marta Teshome', date: '2025-02-26', result: 'Fail', defects: ['Welding defect', 'Alignment off by 2mm'], notes: 'Rework required' },
];

// ═══ SAMPLE STOCK ADJUSTMENTS ═══
export const sampleStockAdjustments: StockAdjustment[] = [
  { id: 'SA-001', itemId: 'INV-001', itemName: 'Window Frame Profile 6063', type: 'Receive', quantity: 200, previousStock: 250, newStock: 450, reason: 'PO-001 received', user: 'Abebe Tekle', date: '2025-02-01' },
  { id: 'SA-002', itemId: 'INV-014', itemName: 'Steel Angle 40x40mm', type: 'Issue', quantity: -22, previousStock: 30, newStock: 8, reason: 'Used for PJ-003 installation', user: 'Dawit Hailu', date: '2025-02-15' },
  { id: 'SA-003', itemId: 'INV-004', itemName: '6mm Clear Tempered Glass', type: 'Damaged', quantity: -5, previousStock: 90, newStock: 85, reason: '5 sqm damaged in transit', user: 'Yosef Bekele', date: '2025-02-12' },
  { id: 'SA-004', itemId: 'INV-012', itemName: 'Silicone Sealant (tube)', type: 'Counted', quantity: 10, previousStock: 170, newStock: 180, reason: 'Physical count adjustment', user: 'Sara Desta', date: '2025-02-20' },
];

// ═══ SAMPLE ACTIVITIES ═══
export const sampleActivities: Activity[] = [
  { id: '1', type: 'production', message: 'Work Order WO-005 quality check passed', messageAm: 'የሥራ ትዕዛዝ WO-005 ጥራት ምርመራ አልፏል', time: '10 min ago' },
  { id: '2', type: 'alert', message: 'Steel Angle 40x40mm critically low (8 remaining)', messageAm: 'ብረት አንግል 40x40ሚሜ በጣም ዝቅ (8 ቀሪ)', time: '25 min ago' },
  { id: '3', type: 'stock', message: '200m Window Frame Profile received from PO-001', messageAm: '200ሜ የመስኮት ፍሬም ፕሮፋይል ከPO-001 ተቀብሏል', time: '1 hour ago' },
  { id: '4', type: 'quote', message: 'Quote QT-006 sent to Ethio Engineering (ETB 1.39M)', messageAm: 'ዋጋ ግምት QT-006 ለኢትዮ ኢንጅነሪንግ ተልኳል (ETB 1.39M)', time: '2 hours ago' },
  { id: '5', type: 'install', message: 'Installation INST-001 started at Megenagna', messageAm: 'ማስገጠም INST-001 በመገናኛ ተጀምሯል', time: '3 hours ago' },
  { id: '6', type: 'payment', message: 'Payment PAY-009 received from CBE - ETB 190,000', messageAm: 'ክፍያ PAY-009 ከንግድ ባንክ ተቀብሏል - ETB 190,000', time: '4 hours ago' },
  { id: '7', type: 'production', message: 'WO-006 completed - 8 Hinged Doors packaged', messageAm: 'WO-006 ተጠናቋል - 8 የሚከፈት በሮች ተጠቅልለዋል', time: '5 hours ago' },
  { id: '8', type: 'order', message: 'New order ORD-005 from Ato Kebede - ETB 285K', messageAm: 'አዲስ ትዕዛዝ ORD-005 ከአቶ ከበደ - ETB 285K', time: '5.5 hours ago' },
  { id: '9', type: 'alert', message: 'Maintenance overdue: CNC Copy Router (MT-002)', messageAm: 'ጥገና ያለፈው ጊዜ: CNC ኮፒ ራውተር (MT-002)', time: '6 hours ago' },
  { id: '10', type: 'stock', message: 'PO-002 shipped from China - ETA April 1', messageAm: 'PO-002 ከቻይና ተልኳል - ይደርሳል ኤፕሪል 1', time: '8 hours ago' },
];

// ═══ CHART DATA ═══
export const salesTrendData = [
  { day: 'Feb 1', sales: 45000 }, { day: 'Feb 3', sales: 72000 }, { day: 'Feb 5', sales: 38000 },
  { day: 'Feb 7', sales: 95000 }, { day: 'Feb 9', sales: 125000 }, { day: 'Feb 11', sales: 88000 },
  { day: 'Feb 13', sales: 152000 }, { day: 'Feb 15', sales: 110000 }, { day: 'Feb 17', sales: 67000 },
  { day: 'Feb 19', sales: 185000 }, { day: 'Feb 21', sales: 142000 }, { day: 'Feb 23', sales: 98000 },
  { day: 'Feb 25', sales: 220000 }, { day: 'Feb 27', sales: 175000 }, { day: 'Mar 1', sales: 195000 },
];

export const revenueTargetData = [
  { month: 'Sep', revenue: 680000, target: 750000 },
  { month: 'Oct', revenue: 820000, target: 750000 },
  { month: 'Nov', revenue: 710000, target: 800000 },
  { month: 'Dec', revenue: 950000, target: 800000 },
  { month: 'Jan', revenue: 780000, target: 850000 },
  { month: 'Feb', revenue: 890000, target: 850000 },
];

export const topProductsData = [
  { name: 'Sliding Window', sales: 345600, qty: 48 },
  { name: 'Sliding Door', sales: 234000, qty: 12 },
  { name: 'Fixed Window', sales: 144000, qty: 24 },
  { name: 'Curtain Wall', sales: 55000, qty: 1 },
  { name: 'Handrail', sales: 81000, qty: 6 },
];

export const inventoryByAlloyData = [
  { name: '6063', value: 45, fill: 'hsl(212, 72%, 42%)' },
  { name: '6060', value: 15, fill: 'hsl(38, 92%, 50%)' },
  { name: '6061', value: 12, fill: 'hsl(142, 72%, 40%)' },
  { name: 'Glass', value: 18, fill: 'hsl(280, 60%, 50%)' },
  { name: 'Other', value: 10, fill: 'hsl(0, 72%, 51%)' },
];

export const projectsByTypeData = [
  { name: 'Residential', value: 35, fill: 'hsl(212, 72%, 42%)' },
  { name: 'Commercial', value: 65, fill: 'hsl(38, 92%, 50%)' },
];
