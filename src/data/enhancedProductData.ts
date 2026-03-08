// ══════════════════════════════════════════
// ENHANCED PRODUCT DATA MODEL & SAMPLE DATA
// ══════════════════════════════════════════

export type ProductCategory = 'Windows' | 'Doors' | 'Curtain Walls' | 'Handrails' | 'Louvers' | 'Partitions' | 'Sheet' | 'Plate' | 'Bar/Rod' | 'Tube/Pipe' | 'Angle' | 'Channel' | 'Beam' | 'Profile' | 'Coil' | 'Custom';
export type ProductType = 'Raw Material' | 'Fabricated' | 'System' | 'Custom';
export type ProductStatus = 'Active' | 'Inactive' | 'Discontinued' | 'Draft';

export interface BOMComponent {
  id: string;
  type: 'Profile' | 'Hardware' | 'Glass' | 'Accessory' | 'Other';
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  total: number;
  inventoryItemId?: string;
}

export interface PriceHistoryEntry {
  date: string;
  sellingPrice: number;
  costPrice: number;
  changedBy: string;
  reason?: string;
}

export interface QualityStandard {
  parameter: string;
  specification: string;
  tolerance: string;
  testMethod?: string;
}

export interface EnhancedProduct {
  id: string;
  code: string;
  name: string;
  nameAm: string;
  category: ProductCategory;
  subcategory: string;
  productType: ProductType;
  status: ProductStatus;

  // Specifications
  profile: string;
  glass: string;
  colors: string[];
  alloyType?: string;
  temper?: string;
  form?: string;

  // Dimensions
  width?: number;
  length?: number;
  height?: number;
  thickness?: number;
  diameter?: number;
  wallThickness?: number;
  weightPerMeter?: number;
  weightPerPiece?: number;

  // Labor
  laborHrs: number;
  unit: string;

  // Cost breakdown
  profileCost: number;
  glassCost: number;
  hardwareCost: number;
  accessoriesCost: number;
  fabLaborCost: number;
  installLaborCost: number;
  overheadPercent: number;
  materialCost: number; // total cost computed

  // Pricing
  sellingPrice: number;
  purchasePrice?: number;
  markupPercent?: number;

  // Stock
  currentStock: number;
  minStock: number;
  maxStock: number;
  reservedStock: number;
  warehouseLocation?: string;

  // Supplier links
  supplierId?: string;
  supplierName?: string;
  leadTimeDays?: number;
  moq?: number;

  // BOM
  bom?: BOMComponent[];

  // Quality
  qualityStandards?: QualityStandard[];
  inspectionRequired: boolean;
  defectRate?: number; // percentage

  // Cross-module links
  linkedProjectIds?: string[];
  linkedOrderIds?: string[];
  linkedWorkOrderIds?: string[];
  linkedQuoteIds?: string[];

  // Price history
  priceHistory?: PriceHistoryEntry[];

  // Versioning
  version: string;
  effectiveDate?: string;

  // Batch/Traceability
  batchNumber?: string;
  millCertificate?: boolean;
  dateReceived?: string;

  // Tags
  tags?: string[];
  notes?: string;

  // Audit
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

// ═══ STATS ═══
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockCount: number;
  criticalStockCount: number;
  totalInventoryValue: number;
  totalRevenuePotential: number;
  avgMargin: number;
  byType: Record<string, { count: number; margin: number }>;
  byCategory: Record<string, number>;
  topMarginProducts: { name: string; margin: number }[];
  lowMarginProducts: { name: string; margin: number }[];
}

export function calcTotalCost(p: EnhancedProduct): number {
  const sub = p.profileCost + p.glassCost + p.hardwareCost + p.accessoriesCost + p.fabLaborCost + p.installLaborCost;
  const tc = sub + (sub * (p.overheadPercent / 100));
  return tc > 0 ? tc : p.materialCost;
}

export function calcMargin(p: EnhancedProduct): number {
  const cost = calcTotalCost(p);
  return p.sellingPrice > 0 ? ((p.sellingPrice - cost) / p.sellingPrice) * 100 : 0;
}

export function formatETB(amount: number): string {
  return `ETB ${amount.toLocaleString()}`;
}

export function formatETBShort(amount: number): string {
  if (amount >= 1_000_000) return `ETB ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `ETB ${(amount / 1_000).toFixed(0)}K`;
  return `ETB ${amount}`;
}

export function calculateProductStats(products: EnhancedProduct[]): ProductStats {
  const active = products.filter(p => p.status === 'Active');
  const lowStock = products.filter(p => p.currentStock <= p.minStock && p.currentStock > 0);
  const criticalStock = products.filter(p => p.currentStock <= p.minStock * 0.5);

  const byType: Record<string, { count: number; margin: number }> = {};
  const byCategory: Record<string, number> = {};

  for (const p of products) {
    // By type
    if (!byType[p.productType]) byType[p.productType] = { count: 0, margin: 0 };
    byType[p.productType].count++;
    byType[p.productType].margin += calcMargin(p);

    // By category
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  }

  // Average margins per type
  for (const key of Object.keys(byType)) {
    if (byType[key].count > 0) byType[key].margin /= byType[key].count;
  }

  const margins = products.map(p => ({ name: p.name, margin: calcMargin(p) })).sort((a, b) => b.margin - a.margin);

  return {
    totalProducts: products.length,
    activeProducts: active.length,
    inactiveProducts: products.length - active.length,
    lowStockCount: lowStock.length,
    criticalStockCount: criticalStock.length,
    totalInventoryValue: products.reduce((s, p) => s + calcTotalCost(p) * p.currentStock, 0),
    totalRevenuePotential: products.reduce((s, p) => s + p.sellingPrice * p.currentStock, 0),
    avgMargin: products.length > 0 ? products.reduce((s, p) => s + calcMargin(p), 0) / products.length : 0,
    byType,
    byCategory,
    topMarginProducts: margins.slice(0, 5),
    lowMarginProducts: margins.slice(-5).reverse(),
  };
}

// ═══ SAMPLE DATA ═══
export const enhancedSampleProducts: EnhancedProduct[] = [
  {
    id: 'PRD-001', code: 'SW-6063-S1', name: 'Sliding Window 2-Panel', nameAm: 'ተንሸራታች መስኮት 2-ፓነል',
    category: 'Windows', subcategory: 'Sliding', productType: 'Fabricated', status: 'Active',
    profile: '6063-T5', glass: '6mm Clear Tempered', colors: ['White', 'Bronze', 'Black'],
    alloyType: '6063', temper: 'T5', form: 'Profile',
    width: 1200, length: 1500, laborHrs: 3.5, unit: 'pcs',
    profileCost: 2500, glassCost: 1200, hardwareCost: 850, accessoriesCost: 420,
    fabLaborCost: 800, installLaborCost: 600, overheadPercent: 20, materialCost: 4500,
    sellingPrice: 7200, purchasePrice: 4200, markupPercent: 60,
    currentStock: 45, minStock: 10, maxStock: 100, reservedStock: 8,
    warehouseLocation: 'A-1-1', supplierId: 'SUP-001', supplierName: 'China Aluminum Corp',
    leadTimeDays: 14, moq: 10, inspectionRequired: true, defectRate: 1.2,
    version: '1.0', effectiveDate: '2024-03-15',
    linkedProjectIds: ['PJ-001', 'PJ-002'], linkedOrderIds: ['ORD-001'], linkedWorkOrderIds: ['WO-001'],
    linkedQuoteIds: ['QT-001'],
    tags: ['bestseller', 'residential'],
    qualityStandards: [
      { parameter: 'Frame Straightness', specification: '±2mm per meter', tolerance: '±2mm', testMethod: 'Straight edge' },
      { parameter: 'Glass Seal', specification: 'No visible gaps', tolerance: '0mm', testMethod: 'Visual inspection' },
    ],
    bom: [
      { id: 'BOM-001', type: 'Profile', name: 'Frame 40x40', quantity: 6.2, unit: 'm', unitCost: 80, total: 496 },
      { id: 'BOM-002', type: 'Hardware', name: 'Handle Set', quantity: 2, unit: 'set', unitCost: 225, total: 450 },
      { id: 'BOM-003', type: 'Glass', name: '6mm Clear Tempered', quantity: 1.8, unit: 'm²', unitCost: 450, total: 810 },
      { id: 'BOM-004', type: 'Accessory', name: 'EPDM Gasket', quantity: 12, unit: 'm', unitCost: 10, total: 120 },
    ],
    priceHistory: [
      { date: '2024-03-15', sellingPrice: 6800, costPrice: 4200, changedBy: 'Admin', reason: 'Initial pricing' },
      { date: '2024-09-01', sellingPrice: 7200, costPrice: 4500, changedBy: 'Admin', reason: 'Material cost increase' },
    ],
    createdAt: '2024-03-15', createdBy: 'Admin', updatedAt: '2025-01-10', updatedBy: 'Admin',
  },
  {
    id: 'PRD-002', code: 'CW-6063-S2', name: 'Casement Window Single', nameAm: 'ካዝመንት መስኮት ነጠላ',
    category: 'Windows', subcategory: 'Casement', productType: 'Fabricated', status: 'Active',
    profile: '6063-T5', glass: '5mm Clear Float', colors: ['White', 'Silver'],
    alloyType: '6063', temper: 'T5', form: 'Profile',
    width: 600, length: 1200, laborHrs: 2.5, unit: 'pcs',
    profileCost: 1800, glassCost: 800, hardwareCost: 600, accessoriesCost: 0,
    fabLaborCost: 500, installLaborCost: 0, overheadPercent: 18, materialCost: 3200,
    sellingPrice: 5100, purchasePrice: 3000, markupPercent: 59,
    currentStock: 32, minStock: 8, maxStock: 80, reservedStock: 5,
    warehouseLocation: 'A-1-2', supplierId: 'SUP-001', supplierName: 'China Aluminum Corp',
    inspectionRequired: true, defectRate: 0.8,
    version: '1.0', tags: ['residential'],
    linkedProjectIds: ['PJ-002'], linkedQuoteIds: ['QT-002'],
    createdAt: '2024-03-15', createdBy: 'Admin', updatedAt: '2025-01-10', updatedBy: 'Admin',
  },
  {
    id: 'PRD-003', code: 'FW-6063-S3', name: 'Fixed Window Large', nameAm: 'ቋሚ መስኮት ትልቅ',
    category: 'Windows', subcategory: 'Fixed', productType: 'Fabricated', status: 'Active',
    profile: '6063-T5', glass: '8mm Tinted Tempered', colors: ['White', 'Bronze', 'Grey'],
    alloyType: '6063', temper: 'T5', form: 'Profile',
    width: 1500, length: 1800, laborHrs: 2.0, unit: 'pcs',
    profileCost: 2000, glassCost: 1200, hardwareCost: 200, accessoriesCost: 0,
    fabLaborCost: 400, installLaborCost: 0, overheadPercent: 15, materialCost: 3800,
    sellingPrice: 6000,
    currentStock: 28, minStock: 5, maxStock: 60, reservedStock: 3,
    warehouseLocation: 'A-2-1', inspectionRequired: true,
    version: '1.0', tags: ['commercial'],
    linkedProjectIds: ['PJ-001', 'PJ-003'],
    createdAt: '2024-04-01', createdBy: 'Admin', updatedAt: '2025-01-10', updatedBy: 'Admin',
  },
  {
    id: 'PRD-004', code: 'SD-6063-D1', name: 'Sliding Door 3-Panel', nameAm: 'ተንሸራታች በር 3-ፓነል',
    category: 'Doors', subcategory: 'Sliding', productType: 'Fabricated', status: 'Active',
    profile: '6063-T6', glass: '10mm Clear Tempered', colors: ['White', 'Black', 'Bronze'],
    alloyType: '6063', temper: 'T6', form: 'Profile',
    width: 3000, length: 2400, laborHrs: 6.0, unit: 'pcs',
    profileCost: 5500, glassCost: 3200, hardwareCost: 2000, accessoriesCost: 800,
    fabLaborCost: 1200, installLaborCost: 800, overheadPercent: 20, materialCost: 12000,
    sellingPrice: 19500, purchasePrice: 11000, markupPercent: 63,
    currentStock: 15, minStock: 3, maxStock: 40, reservedStock: 4,
    warehouseLocation: 'B-1-1', supplierId: 'SUP-002', supplierName: 'Gulf Aluminum',
    leadTimeDays: 21, inspectionRequired: true, defectRate: 1.5,
    version: '1.0', tags: ['bestseller', 'commercial'],
    linkedProjectIds: ['PJ-001', 'PJ-003'], linkedWorkOrderIds: ['WO-002'],
    bom: [
      { id: 'BOM-D1', type: 'Profile', name: 'Heavy Frame 60x40', quantity: 12, unit: 'm', unitCost: 120, total: 1440 },
      { id: 'BOM-D2', type: 'Glass', name: '10mm Clear Tempered', quantity: 5.4, unit: 'm²', unitCost: 600, total: 3240 },
      { id: 'BOM-D3', type: 'Hardware', name: 'Sliding Track System', quantity: 1, unit: 'set', unitCost: 2000, total: 2000 },
    ],
    createdAt: '2024-03-20', createdBy: 'Admin', updatedAt: '2025-02-01', updatedBy: 'Admin',
  },
  {
    id: 'PRD-005', code: 'HD-6063-D2', name: 'Hinged Door Double', nameAm: 'የሚከፈት በር ድርብ',
    category: 'Doors', subcategory: 'Hinged', productType: 'Fabricated', status: 'Active',
    profile: '6063-T6', glass: '8mm Frosted Tempered', colors: ['White', 'Bronze'],
    alloyType: '6063', temper: 'T6', form: 'Profile',
    width: 1600, length: 2200, laborHrs: 5.0, unit: 'pcs',
    profileCost: 4500, glassCost: 2500, hardwareCost: 1500, accessoriesCost: 0,
    fabLaborCost: 1000, installLaborCost: 0, overheadPercent: 18, materialCost: 9500,
    sellingPrice: 15200,
    currentStock: 12, minStock: 3, maxStock: 30, reservedStock: 2,
    warehouseLocation: 'B-1-2', inspectionRequired: true,
    version: '1.0', tags: ['residential', 'commercial'],
    linkedProjectIds: ['PJ-002'],
    createdAt: '2024-04-01', createdBy: 'Admin', updatedAt: '2025-01-15', updatedBy: 'Admin',
  },
  {
    id: 'PRD-006', code: 'FD-6063-D3', name: 'Folding Door 4-Panel', nameAm: 'ተጣጣፊ በር 4-ፓነል',
    category: 'Doors', subcategory: 'Folding', productType: 'Fabricated', status: 'Active',
    profile: '6063-T6', glass: '10mm Clear Tempered', colors: ['Black', 'Grey'],
    alloyType: '6063', temper: 'T6', form: 'Profile',
    width: 4000, length: 2400, laborHrs: 8.0, unit: 'pcs',
    profileCost: 8000, glassCost: 5000, hardwareCost: 3000, accessoriesCost: 1200,
    fabLaborCost: 1500, installLaborCost: 1000, overheadPercent: 22, materialCost: 18000,
    sellingPrice: 29000,
    currentStock: 8, minStock: 2, maxStock: 20, reservedStock: 1,
    warehouseLocation: 'B-2-1', inspectionRequired: true, defectRate: 2.0,
    version: '1.0', tags: ['premium', 'commercial'],
    linkedProjectIds: ['PJ-003'],
    createdAt: '2024-05-01', createdBy: 'Admin', updatedAt: '2025-01-20', updatedBy: 'Admin',
  },
  {
    id: 'PRD-007', code: 'CW-6060-C1', name: 'Curtain Wall System', nameAm: 'ከርተን ወል ሲስተም',
    category: 'Curtain Walls', subcategory: 'Stick System', productType: 'System', status: 'Active',
    profile: '6060-T5', glass: '12mm DGU', colors: ['Silver'],
    alloyType: '6060', temper: 'T5', form: 'Profile',
    laborHrs: 12.0, unit: 'sqm',
    profileCost: 15000, glassCost: 12000, hardwareCost: 5000, accessoriesCost: 2000,
    fabLaborCost: 3000, installLaborCost: 2000, overheadPercent: 25, materialCost: 35000,
    sellingPrice: 55000,
    currentStock: 5, minStock: 2, maxStock: 15, reservedStock: 2,
    warehouseLocation: 'C-1-1', supplierId: 'SUP-003', supplierName: 'India Extrusions Ltd',
    inspectionRequired: true, defectRate: 0.5,
    version: '2.0', tags: ['premium', 'high-rise'],
    linkedProjectIds: ['PJ-003'],
    createdAt: '2024-02-01', createdBy: 'Admin', updatedAt: '2025-02-01', updatedBy: 'Admin',
  },
  {
    id: 'PRD-008', code: 'HR-6063-H1', name: 'Glass Handrail System', nameAm: 'የመስታወት ዘንግ ስርዓት',
    category: 'Handrails', subcategory: 'Glass', productType: 'Fabricated', status: 'Active',
    profile: '6063-T6', glass: '12mm Clear Tempered', colors: ['Silver', 'Black'],
    alloyType: '6063', temper: 'T6', form: 'Profile',
    laborHrs: 4.0, unit: 'lm',
    profileCost: 3500, glassCost: 3000, hardwareCost: 1500, accessoriesCost: 0,
    fabLaborCost: 800, installLaborCost: 0, overheadPercent: 15, materialCost: 8500,
    sellingPrice: 13500,
    currentStock: 18, minStock: 5, maxStock: 40, reservedStock: 3,
    warehouseLocation: 'C-2-1', inspectionRequired: true,
    version: '1.0', tags: ['commercial', 'residential'],
    linkedProjectIds: ['PJ-001'],
    createdAt: '2024-03-15', createdBy: 'Admin', updatedAt: '2025-01-10', updatedBy: 'Admin',
  },
  {
    id: 'PRD-009', code: 'LV-6063-L1', name: 'Aluminum Louver Window', nameAm: 'አልሚኒየም ላውቨር መስኮት',
    category: 'Louvers', subcategory: 'Adjustable', productType: 'Fabricated', status: 'Active',
    profile: '6063-T5', glass: '5mm Frosted', colors: ['White', 'Silver'],
    alloyType: '6063', temper: 'T5', form: 'Profile',
    laborHrs: 3.0, unit: 'pcs',
    profileCost: 1800, glassCost: 800, hardwareCost: 500, accessoriesCost: 0,
    fabLaborCost: 600, installLaborCost: 0, overheadPercent: 15, materialCost: 3500,
    sellingPrice: 5600,
    currentStock: 22, minStock: 5, maxStock: 50, reservedStock: 0,
    warehouseLocation: 'A-3-1', inspectionRequired: false,
    version: '1.0', tags: ['residential'],
    createdAt: '2024-04-15', createdBy: 'Admin', updatedAt: '2025-01-10', updatedBy: 'Admin',
  },
  {
    id: 'PRD-010', code: 'PT-6063-P1', name: 'Office Partition System', nameAm: 'የቢሮ ክፋፍል ስርዓት',
    category: 'Partitions', subcategory: 'Full Height', productType: 'Custom', status: 'Active',
    profile: '6063-T5', glass: '10mm Clear Tempered', colors: ['Silver', 'White'],
    alloyType: '6063', temper: 'T5', form: 'Profile',
    laborHrs: 5.0, unit: 'sqm',
    profileCost: 3500, glassCost: 2200, hardwareCost: 800, accessoriesCost: 0,
    fabLaborCost: 700, installLaborCost: 0, overheadPercent: 18, materialCost: 7200,
    sellingPrice: 11500,
    currentStock: 10, minStock: 3, maxStock: 25, reservedStock: 2,
    warehouseLocation: 'D-1-1', inspectionRequired: true,
    version: '1.0', tags: ['commercial', 'office'],
    linkedProjectIds: ['PJ-003'],
    createdAt: '2024-05-01', createdBy: 'Admin', updatedAt: '2025-01-15', updatedBy: 'Admin',
  },
  {
    id: 'PRD-011', code: 'SH-6061-01', name: '6061 Aluminum Sheet 4x8', nameAm: '6061 አልሚኒየም ሉህ 4x8',
    category: 'Sheet', subcategory: 'Standard', productType: 'Raw Material', status: 'Active',
    profile: '6061-T6', glass: '', colors: [],
    alloyType: '6061', temper: 'T6', form: 'Sheet',
    length: 2440, width: 1220, thickness: 3, laborHrs: 0, unit: 'pcs',
    profileCost: 0, glassCost: 0, hardwareCost: 0, accessoriesCost: 0,
    fabLaborCost: 0, installLaborCost: 0, overheadPercent: 0, materialCost: 2800,
    sellingPrice: 4200, purchasePrice: 2500, markupPercent: 50,
    currentStock: 50, minStock: 15, maxStock: 100, reservedStock: 10,
    warehouseLocation: 'E-1-1', supplierId: 'SUP-001', supplierName: 'China Aluminum Corp',
    leadTimeDays: 30, moq: 20, inspectionRequired: true, millCertificate: true,
    batchNumber: 'BATCH-2025-001', dateReceived: '2025-01-05',
    version: '1.0', tags: ['raw', 'high-volume'],
    createdAt: '2024-01-15', createdBy: 'Admin', updatedAt: '2025-01-05', updatedBy: 'Admin',
  },
  {
    id: 'PRD-012', code: 'TB-6063-01', name: '6063 Round Tube 50mm', nameAm: '6063 ክብ ቱቦ 50ሚሜ',
    category: 'Tube/Pipe', subcategory: 'Round', productType: 'Raw Material', status: 'Active',
    profile: '6063-T5', glass: '', colors: [],
    alloyType: '6063', temper: 'T5', form: 'Tube/Pipe',
    diameter: 50, wallThickness: 2, weightPerMeter: 0.82, laborHrs: 0, unit: 'm',
    profileCost: 0, glassCost: 0, hardwareCost: 0, accessoriesCost: 0,
    fabLaborCost: 0, installLaborCost: 0, overheadPercent: 0, materialCost: 850,
    sellingPrice: 1350, purchasePrice: 750, markupPercent: 59,
    currentStock: 200, minStock: 50, maxStock: 500, reservedStock: 30,
    warehouseLocation: 'E-2-1', supplierId: 'SUP-001', supplierName: 'China Aluminum Corp',
    leadTimeDays: 30, moq: 100, inspectionRequired: false,
    version: '1.0', tags: ['raw', 'high-volume'],
    createdAt: '2024-01-15', createdBy: 'Admin', updatedAt: '2025-01-05', updatedBy: 'Admin',
  },
  {
    id: 'PRD-013', code: 'AW-6063-A1', name: 'Awning Window Single', nameAm: 'አዊኒንግ መስኮት ነጠላ',
    category: 'Windows', subcategory: 'Awning', productType: 'Fabricated', status: 'Active',
    profile: '6063-T5', glass: '5mm Clear Float', colors: ['White', 'Bronze'],
    alloyType: '6063', temper: 'T5', form: 'Profile',
    width: 800, length: 600, laborHrs: 2.0, unit: 'pcs',
    profileCost: 1400, glassCost: 600, hardwareCost: 450, accessoriesCost: 200,
    fabLaborCost: 400, installLaborCost: 300, overheadPercent: 18, materialCost: 2800,
    sellingPrice: 4500,
    currentStock: 25, minStock: 8, maxStock: 60, reservedStock: 2,
    warehouseLocation: 'A-3-2', inspectionRequired: true,
    version: '1.0', tags: ['residential'],
    createdAt: '2024-06-01', createdBy: 'Admin', updatedAt: '2025-01-10', updatedBy: 'Admin',
  },
  {
    id: 'PRD-014', code: 'SP-6063-S1', name: 'Shower Partition Glass', nameAm: 'የሻወር ክፋፍል መስታወት',
    category: 'Partitions', subcategory: 'Shower', productType: 'Custom', status: 'Active',
    profile: '6063-T6', glass: '10mm Clear Tempered', colors: ['Chrome', 'Black'],
    alloyType: '6063', temper: 'T6', form: 'Profile',
    laborHrs: 3.5, unit: 'pcs',
    profileCost: 2000, glassCost: 2800, hardwareCost: 1200, accessoriesCost: 500,
    fabLaborCost: 600, installLaborCost: 500, overheadPercent: 20, materialCost: 6500,
    sellingPrice: 10800,
    currentStock: 14, minStock: 4, maxStock: 30, reservedStock: 1,
    warehouseLocation: 'D-2-1', inspectionRequired: true,
    version: '1.0', tags: ['residential', 'custom'],
    createdAt: '2024-06-15', createdBy: 'Admin', updatedAt: '2025-02-01', updatedBy: 'Admin',
  },
  {
    id: 'PRD-015', code: 'PF-6063-01', name: '6063 Extrusion Profile 40x40', nameAm: '6063 ኤክስትሩዥን ፕሮፋይል 40x40',
    category: 'Profile', subcategory: 'Standard', productType: 'Raw Material', status: 'Active',
    profile: '6063-T5', glass: '', colors: [],
    alloyType: '6063', temper: 'T5', form: 'Profile',
    width: 40, length: 6000, thickness: 2, weightPerMeter: 0.65, laborHrs: 0, unit: 'm',
    profileCost: 0, glassCost: 0, hardwareCost: 0, accessoriesCost: 0,
    fabLaborCost: 0, installLaborCost: 0, overheadPercent: 0, materialCost: 450,
    sellingPrice: 720, purchasePrice: 400, markupPercent: 55,
    currentStock: 350, minStock: 100, maxStock: 800, reservedStock: 50,
    warehouseLocation: 'E-3-1', supplierId: 'SUP-003', supplierName: 'India Extrusions Ltd',
    leadTimeDays: 25, moq: 200, inspectionRequired: true, millCertificate: true,
    batchNumber: 'BATCH-2025-003', dateReceived: '2025-01-12',
    version: '1.0', tags: ['raw', 'core-material'],
    createdAt: '2024-01-01', createdBy: 'Admin', updatedAt: '2025-01-12', updatedBy: 'Admin',
  },
];
