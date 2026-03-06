// ══════════════════════════════════════════
// ENHANCED INVENTORY DATA MODEL & SAMPLE DATA
// ══════════════════════════════════════════

export type InventoryCategory = 'Profile' | 'Glass' | 'Hardware' | 'Accessory' | 'Steel' | 'Finished Product';
export type ProductType = 'RawMaterial' | 'Fabricated' | 'System' | 'Custom';
export type QualityStatus = 'quarantine' | 'approved' | 'rejected' | 'returned';
export type MovementType = 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'return' | 'damaged' | 'count';
export type ReservationStatus = 'active' | 'used' | 'expired' | 'cancelled';

export interface EnhancedInventoryItem {
  id: string;
  itemCode: string;
  productId: string;
  productCode: string;
  productName: string;
  productNameAm: string;
  category: InventoryCategory;
  productType: ProductType;
  alloyType?: string;
  temper?: string;
  profile?: string;
  glass?: string;
  color?: string;
  length?: number;
  width?: number;
  thickness?: number;
  diameter?: number;
  primaryUnit: string;
  secondaryUnit?: string;
  conversionFactor?: number;
  stock: number;
  reserved: number;
  available: number;
  minimum: number;
  maximum: number;
  reorderPoint: number;
  reorderQuantity: number;
  warehouse: string;
  zone: string;
  rack: string;
  shelf: string;
  bin: string;
  isRemnant: boolean;
  parentItemId?: string;
  originalLength?: number;
  remainingLength?: number;
  isReusable?: boolean;
  batchNumber?: string;
  supplierBatch?: string;
  receivedDate: string;
  age: number;
  supplierId?: string;
  supplierName?: string;
  supplierSku?: string;
  leadTimeDays?: number;
  moq?: number;
  unitCost: number;
  averageCost: number;
  lastPurchasePrice?: number;
  sellingPrice?: number;
  totalValue: number;
  qualityStatus: QualityStatus;
  qualityCheckedBy?: string;
  qualityCheckedDate?: string;
  status: 'active' | 'inactive' | 'discontinued' | 'obsolete';
  notes?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface StockMovement {
  id: string;
  movementNumber: string;
  inventoryItemId: string;
  itemCode: string;
  itemName: string;
  type: MovementType;
  quantity: number;
  unit: string;
  previousStock: number;
  newStock: number;
  sourceType: 'purchase_order' | 'work_order' | 'project' | 'quote' | 'manual' | 'return';
  sourceId?: string;
  sourceNumber?: string;
  projectId?: string;
  projectName?: string;
  purchaseOrderId?: string;
  poNumber?: string;
  fromLocation?: string;
  toLocation?: string;
  userId: string;
  userName: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface StockReservation {
  id: string;
  reservationNumber: string;
  inventoryItemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  reservedForType: 'quote' | 'project' | 'work_order' | 'order';
  reservedForId: string;
  reservedForNumber: string;
  customerId?: string;
  customerName?: string;
  reservedDate: string;
  expiresDate?: string;
  releasedDate?: string;
  status: ReservationStatus;
  reservedBy: string;
  reservedByName: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryStats {
  totalItems: number;
  activeItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockItems: number;
  totalValue: number;
  averageItemValue: number;
  receiptsThisMonth: number;
  issuesThisMonth: number;
  turnoverRate: number;
  daysOfStock: number;
  slowMovingItems: number;
  itemsInQuarantine: number;
  itemsToReorder: number;
  estimatedReorderCost: number;
  remnantCount: number;
  remnantValue: number;
  byCategory: Record<string, { count: number; value: number }>;
  byProductType: Record<string, { count: number; value: number }>;
}

// ═══ HELPERS ═══

export function calculateInventoryStats(
  items: EnhancedInventoryItem[],
  movements: StockMovement[]
): InventoryStats {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const active = items.filter(i => i.status === 'active');
  const lowStock = active.filter(i => i.stock <= i.minimum && i.stock > 0);
  const outOfStock = active.filter(i => i.stock === 0);
  const overstock = active.filter(i => i.stock > i.maximum);
  const toReorder = active.filter(i => i.available <= i.reorderPoint);
  const quarantine = items.filter(i => i.qualityStatus === 'quarantine');
  const remnants = items.filter(i => i.isRemnant);
  const slow = active.filter(i => i.age > 90);

  const totalValue = items.reduce((s, i) => s + i.totalValue, 0);
  const monthReceipts = movements.filter(m => m.type === 'receipt' && m.date.startsWith(thisMonth));
  const monthIssues = movements.filter(m => m.type === 'issue' && m.date.startsWith(thisMonth));

  const byCategory: Record<string, { count: number; value: number }> = {};
  const byProductType: Record<string, { count: number; value: number }> = {};
  items.forEach(i => {
    if (!byCategory[i.category]) byCategory[i.category] = { count: 0, value: 0 };
    byCategory[i.category].count++;
    byCategory[i.category].value += i.totalValue;
    if (!byProductType[i.productType]) byProductType[i.productType] = { count: 0, value: 0 };
    byProductType[i.productType].count++;
    byProductType[i.productType].value += i.totalValue;
  });

  return {
    totalItems: items.length,
    activeItems: active.length,
    lowStockItems: lowStock.length,
    outOfStockItems: outOfStock.length,
    overstockItems: overstock.length,
    totalValue,
    averageItemValue: items.length > 0 ? totalValue / items.length : 0,
    receiptsThisMonth: monthReceipts.length,
    issuesThisMonth: monthIssues.length,
    turnoverRate: 4.2,
    daysOfStock: 45,
    slowMovingItems: slow.length,
    itemsInQuarantine: quarantine.length,
    itemsToReorder: toReorder.length,
    estimatedReorderCost: toReorder.reduce((s, i) => s + i.reorderQuantity * i.unitCost, 0),
    remnantCount: remnants.length,
    remnantValue: remnants.reduce((s, i) => s + i.totalValue, 0),
    byCategory,
    byProductType,
  };
}

export function formatETBShort(value: number): string {
  if (value >= 1000000) return `ETB ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `ETB ${(value / 1000).toFixed(0)}K`;
  return `ETB ${value.toLocaleString()}`;
}

export function formatETBFull(value: number): string {
  return `ETB ${value.toLocaleString()}`;
}

export function formatLocation(item: EnhancedInventoryItem): string {
  return `${item.warehouse}-${item.zone}-${item.rack}-${item.shelf}`;
}

export function getStockStatusColor(item: EnhancedInventoryItem): string {
  if (item.stock === 0) return 'bg-destructive/10 text-destructive';
  if (item.stock <= item.minimum) return 'bg-warning/10 text-warning';
  if (item.stock > item.maximum) return 'bg-chart-4/10 text-chart-4';
  return 'bg-success/10 text-success';
}

export function getStockStatusLabel(item: EnhancedInventoryItem): string {
  if (item.stock === 0) return 'Out of Stock';
  if (item.stock <= item.minimum) return 'Low Stock';
  if (item.stock > item.maximum) return 'Overstock';
  return 'In Stock';
}

export function getQualityStatusColor(status: QualityStatus): string {
  const colors: Record<QualityStatus, string> = {
    approved: 'bg-success/10 text-success',
    quarantine: 'bg-warning/10 text-warning',
    rejected: 'bg-destructive/10 text-destructive',
    returned: 'bg-muted text-muted-foreground',
  };
  return colors[status];
}

export function needsReorder(item: EnhancedInventoryItem): boolean {
  return item.available <= item.reorderPoint;
}

export function isAvailableForQuantity(item: EnhancedInventoryItem, qty: number): boolean {
  return item.available >= qty;
}

// ═══ SAMPLE DATA - Synced with existing Products (PRD-001 to PRD-012) ═══

export const enhancedSampleInventory: EnhancedInventoryItem[] = [
  {
    id: 'INV-001', itemCode: 'INV-001', productId: 'PRD-001', productCode: 'SW-6063-S1',
    productName: 'Sliding Window 2-Panel', productNameAm: 'ተንሸራታች መስኮት 2-ፓነል',
    category: 'Finished Product', productType: 'Fabricated',
    alloyType: '6063', temper: 'T5', profile: '6063-T5', glass: '6mm Clear Tempered', color: 'White',
    width: 1200, length: 1500,
    primaryUnit: 'pcs', stock: 45, reserved: 12, available: 33,
    minimum: 10, maximum: 100, reorderPoint: 15, reorderQuantity: 20,
    warehouse: 'Main', zone: 'A', rack: 'R01', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-001', receivedDate: '2025-02-01', age: 33,
    supplierId: 'SUP-001', supplierName: 'Emirates Aluminum', leadTimeDays: 45,
    unitCost: 4500, averageCost: 4500, lastPurchasePrice: 4200, sellingPrice: 7200,
    totalValue: 202500, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-02-01', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-002', itemCode: 'INV-002', productId: 'PRD-002', productCode: 'CW-6063-S2',
    productName: 'Casement Window Single', productNameAm: 'ካዝመንት መስኮት ነጠላ',
    category: 'Finished Product', productType: 'Fabricated',
    alloyType: '6063', temper: 'T5', profile: '6063-T5', glass: '5mm Clear Float', color: 'White',
    primaryUnit: 'pcs', stock: 32, reserved: 8, available: 24,
    minimum: 8, maximum: 80, reorderPoint: 12, reorderQuantity: 15,
    warehouse: 'Main', zone: 'A', rack: 'R01', shelf: 'S02', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-002', receivedDate: '2025-01-20', age: 45,
    supplierId: 'SUP-001', supplierName: 'Emirates Aluminum', leadTimeDays: 45,
    unitCost: 3200, averageCost: 3200, sellingPrice: 5100,
    totalValue: 102400, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-01-20', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-003', itemCode: 'INV-003', productId: 'PRD-003', productCode: 'FW-6063-S3',
    productName: 'Fixed Window Large', productNameAm: 'ቋሚ መስኮት ትልቅ',
    category: 'Finished Product', productType: 'Fabricated',
    alloyType: '6063', temper: 'T5', profile: '6063-T5', glass: '8mm Tinted Tempered', color: 'Bronze',
    primaryUnit: 'pcs', stock: 28, reserved: 5, available: 23,
    minimum: 5, maximum: 60, reorderPoint: 8, reorderQuantity: 12,
    warehouse: 'Main', zone: 'A', rack: 'R02', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-003', receivedDate: '2025-01-25', age: 40,
    supplierId: 'SUP-001', supplierName: 'Emirates Aluminum', leadTimeDays: 45,
    unitCost: 3800, averageCost: 3800, sellingPrice: 6000,
    totalValue: 106400, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-01-25', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-004', itemCode: 'INV-004', productId: 'PRD-004', productCode: 'SD-6063-D1',
    productName: 'Sliding Door 3-Panel', productNameAm: 'ተንሸራታች በር 3-ፓነል',
    category: 'Finished Product', productType: 'Fabricated',
    alloyType: '6063', temper: 'T6', profile: '6063-T6', glass: '10mm Clear Tempered', color: 'White',
    primaryUnit: 'pcs', stock: 15, reserved: 4, available: 11,
    minimum: 3, maximum: 40, reorderPoint: 5, reorderQuantity: 10,
    warehouse: 'Main', zone: 'B', rack: 'R01', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-004', receivedDate: '2025-02-05', age: 29,
    supplierId: 'SUP-001', supplierName: 'Emirates Aluminum', leadTimeDays: 60,
    unitCost: 12000, averageCost: 12000, lastPurchasePrice: 11000, sellingPrice: 19500,
    totalValue: 180000, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-02-05', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-005', itemCode: 'INV-005', productId: 'PRD-005', productCode: 'HD-6063-D2',
    productName: 'Hinged Door Double', productNameAm: 'የሚከፈት በር ድርብ',
    category: 'Finished Product', productType: 'Fabricated',
    alloyType: '6063', temper: 'T6', profile: '6063-T6', glass: '8mm Frosted Tempered', color: 'Bronze',
    primaryUnit: 'pcs', stock: 12, reserved: 3, available: 9,
    minimum: 3, maximum: 30, reorderPoint: 5, reorderQuantity: 8,
    warehouse: 'Main', zone: 'B', rack: 'R01', shelf: 'S02', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-005', receivedDate: '2025-02-10', age: 24,
    supplierId: 'SUP-001', supplierName: 'Emirates Aluminum', leadTimeDays: 60,
    unitCost: 9500, averageCost: 9500, sellingPrice: 15200,
    totalValue: 114000, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-02-10', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-006', itemCode: 'INV-006', productId: 'PRD-006', productCode: 'FD-6063-D3',
    productName: 'Folding Door 4-Panel', productNameAm: 'ተጣጣፊ በር 4-ፓነል',
    category: 'Finished Product', productType: 'Fabricated',
    alloyType: '6063', temper: 'T6', profile: '6063-T6', glass: '10mm Clear Tempered', color: 'Black',
    primaryUnit: 'pcs', stock: 8, reserved: 2, available: 6,
    minimum: 2, maximum: 20, reorderPoint: 3, reorderQuantity: 5,
    warehouse: 'Main', zone: 'B', rack: 'R02', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-006', receivedDate: '2025-01-30', age: 35,
    supplierId: 'SUP-002', supplierName: 'China Zhongwang', leadTimeDays: 75,
    unitCost: 18000, averageCost: 18000, sellingPrice: 29000,
    totalValue: 144000, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-01-30', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-007', itemCode: 'INV-007', productId: 'PRD-007', productCode: 'CW-6060-C1',
    productName: 'Curtain Wall System', productNameAm: 'ከርተን ወል ሲስተም',
    category: 'Finished Product', productType: 'System',
    alloyType: '6060', temper: 'T5', profile: '6060-T5', glass: '12mm DGU',
    primaryUnit: 'pcs', stock: 5, reserved: 2, available: 3,
    minimum: 2, maximum: 15, reorderPoint: 3, reorderQuantity: 5,
    warehouse: 'Main', zone: 'C', rack: 'R01', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-007', receivedDate: '2025-01-15', age: 50,
    supplierId: 'SUP-002', supplierName: 'China Zhongwang', leadTimeDays: 90,
    unitCost: 35000, averageCost: 35000, sellingPrice: 55000,
    totalValue: 175000, qualityStatus: 'approved', status: 'active',
    notes: 'Critical item - long lead time',
    createdAt: '2025-01-15', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-008', itemCode: 'INV-008', productId: 'PRD-008', productCode: 'HR-6063-H1',
    productName: 'Glass Handrail System', productNameAm: 'የመስታወት ዘንግ ስርዓት',
    category: 'Finished Product', productType: 'Fabricated',
    alloyType: '6063', temper: 'T6', profile: '6063-T6', glass: '12mm Clear Tempered',
    primaryUnit: 'pcs', stock: 18, reserved: 5, available: 13,
    minimum: 5, maximum: 40, reorderPoint: 8, reorderQuantity: 10,
    warehouse: 'Main', zone: 'C', rack: 'R02', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-008', receivedDate: '2025-02-08', age: 26,
    supplierId: 'SUP-001', supplierName: 'Emirates Aluminum', leadTimeDays: 45,
    unitCost: 8500, averageCost: 8500, sellingPrice: 13500,
    totalValue: 153000, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-02-08', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-009', itemCode: 'INV-009', productId: 'PRD-009', productCode: 'LV-6063-L1',
    productName: 'Aluminum Louver Window', productNameAm: 'አልሚኒየም ላውቨር መስኮት',
    category: 'Finished Product', productType: 'Fabricated',
    alloyType: '6063', temper: 'T5', profile: '6063-T5', glass: '5mm Frosted',
    primaryUnit: 'pcs', stock: 22, reserved: 6, available: 16,
    minimum: 5, maximum: 50, reorderPoint: 8, reorderQuantity: 12,
    warehouse: 'Main', zone: 'A', rack: 'R03', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-009', receivedDate: '2025-02-12', age: 22,
    supplierId: 'SUP-001', supplierName: 'Emirates Aluminum', leadTimeDays: 30,
    unitCost: 3500, averageCost: 3500, sellingPrice: 5600,
    totalValue: 77000, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-02-12', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-010', itemCode: 'INV-010', productId: 'PRD-010', productCode: 'PT-6063-P1',
    productName: 'Office Partition System', productNameAm: 'የቢሮ ክፋፍል ስርዓት',
    category: 'Finished Product', productType: 'Custom',
    alloyType: '6063', temper: 'T5', profile: '6063-T5', glass: '10mm Clear Tempered',
    primaryUnit: 'pcs', stock: 10, reserved: 4, available: 6,
    minimum: 3, maximum: 25, reorderPoint: 5, reorderQuantity: 8,
    warehouse: 'Main', zone: 'D', rack: 'R01', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-010', receivedDate: '2025-02-15', age: 19,
    supplierId: 'SUP-003', supplierName: 'Hindalco Industries', leadTimeDays: 60,
    unitCost: 7200, averageCost: 7200, sellingPrice: 11500,
    totalValue: 72000, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-02-15', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-011', itemCode: 'INV-011', productId: 'PRD-011', productCode: 'SH-6061-01',
    productName: '6061 Aluminum Sheet 4x8', productNameAm: '6061 አልሚኒየም ሉህ 4x8',
    category: 'Profile', productType: 'RawMaterial',
    alloyType: '6061', temper: 'T6', length: 2440, width: 1220, thickness: 3,
    primaryUnit: 'pcs', secondaryUnit: 'sqm', conversionFactor: 2.98,
    stock: 50, reserved: 10, available: 40,
    minimum: 15, maximum: 100, reorderPoint: 20, reorderQuantity: 30,
    warehouse: 'Main', zone: 'E', rack: 'R01', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-011', receivedDate: '2025-02-15', age: 19,
    supplierId: 'SUP-002', supplierName: 'China Zhongwang', leadTimeDays: 60,
    unitCost: 2800, averageCost: 2800, lastPurchasePrice: 2500, sellingPrice: 4200,
    totalValue: 140000, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-02-15', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-012', itemCode: 'INV-012', productId: 'PRD-012', productCode: 'TB-6063-01',
    productName: '6063 Round Tube 50mm', productNameAm: '6063 ክብ ቱቦ 50ሚሜ',
    category: 'Profile', productType: 'RawMaterial',
    alloyType: '6063', temper: 'T5', diameter: 50,
    primaryUnit: 'meter', stock: 200, reserved: 30, available: 170,
    minimum: 50, maximum: 500, reorderPoint: 75, reorderQuantity: 100,
    warehouse: 'Main', zone: 'E', rack: 'R02', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-012', receivedDate: '2025-01-28', age: 37,
    supplierId: 'SUP-002', supplierName: 'China Zhongwang', leadTimeDays: 60,
    unitCost: 850, averageCost: 850, lastPurchasePrice: 750, sellingPrice: 1350,
    totalValue: 170000, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-01-28', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  // Raw material items (linked to BOM components)
  {
    id: 'INV-013', itemCode: 'INV-013', productId: '', productCode: 'PF-6063-01',
    productName: 'Window Frame Profile 6063', productNameAm: 'የመስኮት ፍሬም ፕሮፋይል 6063',
    category: 'Profile', productType: 'RawMaterial',
    alloyType: '6063', temper: 'T5',
    primaryUnit: 'meter', stock: 450, reserved: 120, available: 330,
    minimum: 100, maximum: 800, reorderPoint: 150, reorderQuantity: 200,
    warehouse: 'Main', zone: 'A', rack: 'R04', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-013', receivedDate: '2025-02-01', age: 33,
    supplierId: 'SUP-001', supplierName: 'Emirates Aluminum', leadTimeDays: 45,
    unitCost: 85, averageCost: 85, sellingPrice: 135,
    totalValue: 38250, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-02-01', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-014', itemCode: 'INV-014', productId: '', productCode: 'PF-6063-02',
    productName: 'Door Frame Profile 6063', productNameAm: 'የበር ፍሬም ፕሮፋይል 6063',
    category: 'Profile', productType: 'RawMaterial',
    alloyType: '6063', temper: 'T6',
    primaryUnit: 'meter', stock: 280, reserved: 90, available: 190,
    minimum: 80, maximum: 500, reorderPoint: 120, reorderQuantity: 150,
    warehouse: 'Main', zone: 'A', rack: 'R04', shelf: 'S02', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-014', receivedDate: '2025-01-15', age: 50,
    supplierId: 'SUP-001', supplierName: 'Emirates Aluminum', leadTimeDays: 45,
    unitCost: 120, averageCost: 120, sellingPrice: 195,
    totalValue: 33600, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-01-15', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-015', itemCode: 'INV-015', productId: '', productCode: 'GL-CLR-06',
    productName: '6mm Clear Tempered Glass', productNameAm: '6ሚሜ ግልጽ ጠንካራ መስታወት',
    category: 'Glass', productType: 'RawMaterial',
    primaryUnit: 'sqm', stock: 85, reserved: 25, available: 60,
    minimum: 30, maximum: 200, reorderPoint: 40, reorderQuantity: 50,
    warehouse: 'Main', zone: 'F', rack: 'R01', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-015', receivedDate: '2025-02-10', age: 24,
    supplierId: 'SUP-004', supplierName: 'Guardian Glass', leadTimeDays: 30,
    unitCost: 450, averageCost: 450, sellingPrice: 720,
    totalValue: 38250, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-02-10', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-016', itemCode: 'INV-016', productId: '', productCode: 'GL-TNT-08',
    productName: '8mm Tinted Tempered Glass', productNameAm: '8ሚሜ ቀለም ጠንካራ መስታወት',
    category: 'Glass', productType: 'RawMaterial',
    primaryUnit: 'sqm', stock: 45, reserved: 15, available: 30,
    minimum: 20, maximum: 100, reorderPoint: 25, reorderQuantity: 30,
    warehouse: 'Main', zone: 'F', rack: 'R01', shelf: 'S02', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-016', receivedDate: '2025-02-05', age: 29,
    supplierId: 'SUP-004', supplierName: 'Guardian Glass', leadTimeDays: 30,
    unitCost: 620, averageCost: 620, sellingPrice: 990,
    totalValue: 27900, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-02-05', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-017', itemCode: 'INV-017', productId: '', productCode: 'HW-HDL-01',
    productName: 'Aluminum Handle Set', productNameAm: 'የአልሚኒየም እጀታ ስብስብ',
    category: 'Hardware', productType: 'RawMaterial',
    primaryUnit: 'set', stock: 95, reserved: 20, available: 75,
    minimum: 30, maximum: 200, reorderPoint: 40, reorderQuantity: 50,
    warehouse: 'Main', zone: 'G', rack: 'R01', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-017', receivedDate: '2025-02-08', age: 26,
    supplierId: 'SUP-005', supplierName: 'Assa Abloy', leadTimeDays: 21,
    unitCost: 280, averageCost: 280, sellingPrice: 450,
    totalValue: 26600, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-02-08', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-018', itemCode: 'INV-018', productId: '', productCode: 'HW-LCK-01',
    productName: 'Multi-point Lock System', productNameAm: 'ብዙ-ነጥብ ቁልፍ ስርዓት',
    category: 'Hardware', productType: 'RawMaterial',
    primaryUnit: 'pcs', stock: 65, reserved: 15, available: 50,
    minimum: 25, maximum: 150, reorderPoint: 30, reorderQuantity: 40,
    warehouse: 'Main', zone: 'G', rack: 'R01', shelf: 'S02', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-018', receivedDate: '2025-02-12', age: 22,
    supplierId: 'SUP-005', supplierName: 'Assa Abloy', leadTimeDays: 21,
    unitCost: 850, averageCost: 850, sellingPrice: 1360,
    totalValue: 55250, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-02-12', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-019', itemCode: 'INV-019', productId: '', productCode: 'AC-GSK-01',
    productName: 'EPDM Gasket Roll', productNameAm: 'ኢፒዲኤም ጋስኬት ጥቅል',
    category: 'Accessory', productType: 'RawMaterial',
    primaryUnit: 'meter', stock: 500, reserved: 100, available: 400,
    minimum: 200, maximum: 1000, reorderPoint: 250, reorderQuantity: 300,
    warehouse: 'Main', zone: 'H', rack: 'R01', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-019', receivedDate: '2025-01-30', age: 35,
    supplierId: 'SUP-006', supplierName: 'Local Supplier', leadTimeDays: 7,
    unitCost: 25, averageCost: 25, sellingPrice: 40,
    totalValue: 12500, qualityStatus: 'approved', status: 'active',
    createdAt: '2025-01-30', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  {
    id: 'INV-020', itemCode: 'INV-020', productId: '', productCode: 'ST-ANG-01',
    productName: 'Steel Angle 40x40mm', productNameAm: 'ብረት አንግል 40x40ሚሜ',
    category: 'Steel', productType: 'RawMaterial',
    primaryUnit: 'meter', stock: 8, reserved: 0, available: 8,
    minimum: 30, maximum: 200, reorderPoint: 40, reorderQuantity: 60,
    warehouse: 'Main', zone: 'I', rack: 'R01', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-020', receivedDate: '2025-01-10', age: 55,
    supplierId: 'SUP-006', supplierName: 'Local Supplier', leadTimeDays: 5,
    unitCost: 95, averageCost: 95, sellingPrice: 150,
    totalValue: 760, qualityStatus: 'approved', status: 'active',
    notes: 'CRITICAL: Far below minimum stock!',
    createdAt: '2025-01-10', createdBy: 'EMP-001', updatedAt: '2025-03-01', updatedBy: 'EMP-001',
  },
  // Remnant item
  {
    id: 'INV-021', itemCode: 'INV-021', productId: 'PRD-011', productCode: 'SH-6061-REM',
    productName: '6061 Sheet Remnant', productNameAm: '6061 ሉህ ቅሪት',
    category: 'Profile', productType: 'RawMaterial',
    alloyType: '6061', temper: 'T6', width: 1220, thickness: 3,
    primaryUnit: 'pcs', stock: 3, reserved: 0, available: 3,
    minimum: 0, maximum: 10, reorderPoint: 0, reorderQuantity: 0,
    warehouse: 'Main', zone: 'E', rack: 'R99', shelf: 'REM', bin: 'B01',
    isRemnant: true, parentItemId: 'INV-011', originalLength: 2440, remainingLength: 800, isReusable: true,
    receivedDate: '2025-03-01', age: 5,
    unitCost: 1400, averageCost: 1400, totalValue: 4200,
    qualityStatus: 'approved', status: 'active',
    notes: 'Remnant from cutting job CJ-005',
    createdAt: '2025-03-01', createdBy: 'EMP-003', updatedAt: '2025-03-01', updatedBy: 'EMP-003',
  },
  // Quarantine item
  {
    id: 'INV-022', itemCode: 'INV-022', productId: '', productCode: 'GL-DGU-12',
    productName: '12mm DGU Glass Unit', productNameAm: '12ሚሜ ዲጂዩ መስታወት',
    category: 'Glass', productType: 'RawMaterial',
    primaryUnit: 'sqm', stock: 25, reserved: 0, available: 0,
    minimum: 15, maximum: 80, reorderPoint: 20, reorderQuantity: 25,
    warehouse: 'Main', zone: 'F', rack: 'QA', shelf: 'S01', bin: 'B01',
    isRemnant: false, batchNumber: 'BT-2025-022', receivedDate: '2025-03-03', age: 3,
    supplierId: 'SUP-004', supplierName: 'Guardian Glass', leadTimeDays: 30,
    unitCost: 1200, averageCost: 1200, sellingPrice: 1920,
    totalValue: 30000, qualityStatus: 'quarantine', status: 'active',
    notes: 'Pending quality inspection - new shipment',
    qualityCheckedBy: 'Pending', qualityCheckedDate: '2025-03-06',
    createdAt: '2025-03-03', createdBy: 'EMP-001', updatedAt: '2025-03-03', updatedBy: 'EMP-001',
  },
];

// ═══ SAMPLE STOCK MOVEMENTS ═══
export const sampleStockMovements: StockMovement[] = [
  {
    id: 'MOV-001', movementNumber: 'MOV-001', inventoryItemId: 'INV-001', itemCode: 'INV-001', itemName: 'Sliding Window 2-Panel',
    type: 'receipt', quantity: 20, unit: 'pcs', previousStock: 25, newStock: 45,
    sourceType: 'purchase_order', sourceId: 'PO-001', sourceNumber: 'PO-001',
    userId: 'EMP-001', userName: 'Abebe Tekle', date: '2025-02-01', notes: 'Received from EMAL shipment',
    createdAt: '2025-02-01',
  },
  {
    id: 'MOV-002', movementNumber: 'MOV-002', inventoryItemId: 'INV-001', itemCode: 'INV-001', itemName: 'Sliding Window 2-Panel',
    type: 'issue', quantity: -12, unit: 'pcs', previousStock: 45, newStock: 33,
    sourceType: 'project', sourceId: 'PJ-001', sourceNumber: 'PJ-001',
    projectId: 'PJ-001', projectName: 'Bole Apartments Tower A',
    userId: 'EMP-005', userName: 'Dawit Hailu', date: '2025-02-15', notes: 'Issued for Bole Apartments installation',
    createdAt: '2025-02-15',
  },
  {
    id: 'MOV-003', movementNumber: 'MOV-003', inventoryItemId: 'INV-013', itemCode: 'INV-013', itemName: 'Window Frame Profile 6063',
    type: 'receipt', quantity: 200, unit: 'meter', previousStock: 250, newStock: 450,
    sourceType: 'purchase_order', sourceId: 'PO-001', sourceNumber: 'PO-001',
    userId: 'EMP-001', userName: 'Abebe Tekle', date: '2025-02-01', notes: 'Bulk profile receipt',
    createdAt: '2025-02-01',
  },
  {
    id: 'MOV-004', movementNumber: 'MOV-004', inventoryItemId: 'INV-013', itemCode: 'INV-013', itemName: 'Window Frame Profile 6063',
    type: 'issue', quantity: -62, unit: 'meter', previousStock: 450, newStock: 388,
    sourceType: 'work_order', sourceId: 'WO-001', sourceNumber: 'WO-001',
    projectId: 'PJ-001', projectName: 'Bole Apartments Tower A',
    userId: 'EMP-003', userName: 'Sara Mengistu', date: '2025-02-10', notes: 'Profile cutting for WO-001',
    createdAt: '2025-02-10',
  },
  {
    id: 'MOV-005', movementNumber: 'MOV-005', inventoryItemId: 'INV-015', itemCode: 'INV-015', itemName: '6mm Clear Tempered Glass',
    type: 'issue', quantity: -18, unit: 'sqm', previousStock: 103, newStock: 85,
    sourceType: 'project', sourceId: 'PJ-003', sourceNumber: 'PJ-003',
    projectId: 'PJ-003', projectName: 'Megenagna Office Complex',
    userId: 'EMP-005', userName: 'Dawit Hailu', date: '2025-02-20', notes: 'Glass for curtain wall',
    createdAt: '2025-02-20',
  },
  {
    id: 'MOV-006', movementNumber: 'MOV-006', inventoryItemId: 'INV-020', itemCode: 'INV-020', itemName: 'Steel Angle 40x40mm',
    type: 'adjustment', quantity: -22, unit: 'meter', previousStock: 30, newStock: 8,
    sourceType: 'manual',
    userId: 'EMP-001', userName: 'Abebe Tekle', date: '2025-03-01', notes: 'Physical count adjustment - used in multiple projects',
    createdAt: '2025-03-01',
  },
  {
    id: 'MOV-007', movementNumber: 'MOV-007', inventoryItemId: 'INV-004', itemCode: 'INV-004', itemName: 'Sliding Door 3-Panel',
    type: 'issue', quantity: -2, unit: 'pcs', previousStock: 17, newStock: 15,
    sourceType: 'project', sourceId: 'PJ-007', sourceNumber: 'PJ-007',
    projectId: 'PJ-007', projectName: 'Addis View Penthouse',
    userId: 'EMP-003', userName: 'Sara Mengistu', date: '2025-01-10',
    createdAt: '2025-01-10',
  },
  {
    id: 'MOV-008', movementNumber: 'MOV-008', inventoryItemId: 'INV-022', itemCode: 'INV-022', itemName: '12mm DGU Glass Unit',
    type: 'receipt', quantity: 25, unit: 'sqm', previousStock: 0, newStock: 25,
    sourceType: 'purchase_order', sourceId: 'PO-003', sourceNumber: 'PO-003',
    userId: 'EMP-001', userName: 'Abebe Tekle', date: '2025-03-03', notes: 'New shipment - pending QA',
    createdAt: '2025-03-03',
  },
];

// ═══ SAMPLE RESERVATIONS ═══
export const sampleReservations: StockReservation[] = [
  {
    id: 'RES-001', reservationNumber: 'RES-001', inventoryItemId: 'INV-001', itemCode: 'INV-001', itemName: 'Sliding Window 2-Panel',
    quantity: 10, unit: 'pcs',
    reservedForType: 'project', reservedForId: 'PJ-001', reservedForNumber: 'PJ-001',
    customerId: 'CUS-001', customerName: 'Ayat Real Estate',
    reservedDate: '2025-02-01', expiresDate: '2025-04-30',
    status: 'active', reservedBy: 'EMP-001', reservedByName: 'Abebe Tekle',
    createdAt: '2025-02-01',
  },
  {
    id: 'RES-002', reservationNumber: 'RES-002', inventoryItemId: 'INV-007', itemCode: 'INV-007', itemName: 'Curtain Wall System',
    quantity: 2, unit: 'pcs',
    reservedForType: 'project', reservedForId: 'PJ-010', reservedForNumber: 'PJ-010',
    customerId: 'CUS-011', customerName: 'Unity University',
    reservedDate: '2025-02-10', expiresDate: '2025-05-30',
    status: 'active', reservedBy: 'EMP-003', reservedByName: 'Sara Mengistu',
    createdAt: '2025-02-10',
  },
  {
    id: 'RES-003', reservationNumber: 'RES-003', inventoryItemId: 'INV-001', itemCode: 'INV-001', itemName: 'Sliding Window 2-Panel',
    quantity: 2, unit: 'pcs',
    reservedForType: 'quote', reservedForId: 'QT-009', reservedForNumber: 'QT-009',
    customerId: 'CUS-009', customerName: 'Sunshine Properties',
    reservedDate: '2025-02-15', expiresDate: '2025-03-17',
    status: 'active', reservedBy: 'EMP-003', reservedByName: 'Sara Mengistu',
    createdAt: '2025-02-15',
  },
  {
    id: 'RES-004', reservationNumber: 'RES-004', inventoryItemId: 'INV-010', itemCode: 'INV-010', itemName: 'Office Partition System',
    quantity: 4, unit: 'pcs',
    reservedForType: 'project', reservedForId: 'PJ-006', reservedForNumber: 'PJ-006',
    customerId: 'CUS-006', customerName: 'Commercial Bank Ethiopia',
    reservedDate: '2025-02-12', expiresDate: '2025-05-20',
    status: 'active', reservedBy: 'EMP-001', reservedByName: 'Abebe Tekle',
    createdAt: '2025-02-12',
  },
];
