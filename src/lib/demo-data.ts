/**
 * Datos de demo extraídos del spreadsheet del usuario
 * Inventario de óptica con ~200 productos
 */

export interface ProductData {
  name: string;
  category: string;
  sku: string;
  salePrice: number;
  date: string;
  stock: number;
  costPrice: number;
  outOfStock: boolean;
}

export const CATEGORIES = [
  "Solar", "Oftálmico", "Blue Light", "Sport", "Lectura",
  "Natación", "Goggles", "Seguridad", "Fotocromático",
  "Ciclismo", "Clip-On"
];

export const BRANDS = [
  "AeroLens", "ClearVue", "FocusLine", "FrameLab", "LuxSight",
  "NovaOptic", "OptiZen", "PrismCraft", "UrbanFrame", "Visionary"
];

export const demoProducts: ProductData[] = [
  { name: "AeroLens PR-891", category: "Solar", sku: "SKU-737498-M", salePrice: 129.95, date: "2025-06-13", stock: 68, costPrice: 76.82, outOfStock: false },
  { name: "ClearVue NV-321", category: "Goggles", sku: "SKU-914414-Y", salePrice: 71.74, date: "2025-01-28", stock: 46, costPrice: 51.24, outOfStock: false },
  { name: "FocusLine VX-911", category: "Oftálmico", sku: "SKU-608931-U", salePrice: 141.75, date: "2024-11-15", stock: 114, costPrice: 105.00, outOfStock: false },
  { name: "FrameLab AX-88", category: "Sport", sku: "SKU-338820-G", salePrice: 62.76, date: "2024-10-27", stock: 11, costPrice: 36.70, outOfStock: false },
  { name: "LuxSight PR-1149", category: "Lectura", sku: "SKU-919331-A", salePrice: 127.69, date: "2024-12-19", stock: 0, costPrice: 59.39, outOfStock: true },
  { name: "NovaOptic FL-259", category: "Seguridad", sku: "SKU-161642-T", salePrice: 55.54, date: "2025-08-07", stock: 54, costPrice: 45.90, outOfStock: false },
  { name: "OptiZen AX-4323", category: "Sport", sku: "SKU-777374-B", salePrice: 95.94, date: "2025-05-15", stock: 29, costPrice: 60.34, outOfStock: false },
  { name: "PrismCraft VX-90", category: "Natación", sku: "SKU-575274-A", salePrice: 221.13, date: "2025-05-27", stock: 82, costPrice: 119.53, outOfStock: false },
  { name: "UrbanFrame OF-12", category: "Blue Light", sku: "SKU-602765-R", salePrice: 194.16, date: "2025-02-22", stock: 104, costPrice: 98.06, outOfStock: false },
  { name: "Visionary VX-242", category: "Goggles", sku: "SKU-501228-S", salePrice: 18.19, date: "2025-04-20", stock: 108, costPrice: 11.30, outOfStock: false },
  { name: "LuxSight NV-1551", category: "Lectura", sku: "SKU-897598-T", salePrice: 243.20, date: "2024-11-27", stock: 62, costPrice: 114.18, outOfStock: false },
  { name: "FrameLab FL-584", category: "Goggles", sku: "SKU-895146-B", salePrice: 145.75, date: "2024-10-18", stock: 114, costPrice: 110.42, outOfStock: false },
  { name: "FocusLine AX-110", category: "Sport", sku: "SKU-167778-J", salePrice: 181.20, date: "2025-08-28", stock: 84, costPrice: 116.90, outOfStock: false },
  { name: "ClearVue OF-690", category: "Seguridad", sku: "SKU-784990-L", salePrice: 175.32, date: "2025-03-05", stock: 118, costPrice: 100.18, outOfStock: false },
  { name: "PrismCraft OF-52", category: "Fotocromático", sku: "SKU-881599-D", salePrice: 210.18, date: "2024-09-14", stock: 6, costPrice: 106.69, outOfStock: false },
  { name: "OptiZen OF-5259", category: "Solar", sku: "SKU-824412-R", salePrice: 200.67, date: "2025-01-27", stock: 71, costPrice: 103.44, outOfStock: false },
  { name: "UrbanFrame PR-9", category: "Lectura", sku: "SKU-157525-P", salePrice: 151.37, date: "2024-10-17", stock: 114, costPrice: 108.90, outOfStock: false },
  { name: "Visionary PR-609", category: "Blue Light", sku: "SKU-781531-A", salePrice: 147.67, date: "2025-08-25", stock: 18, costPrice: 105.48, outOfStock: false },
  { name: "LuxSight RBX-797", category: "Lectura", sku: "SKU-898076-E", salePrice: 174.92, date: "2024-11-18", stock: 21, costPrice: 87.46, outOfStock: false },
  { name: "FocusLine PR-652", category: "Solar", sku: "SKU-771373-D", salePrice: 120.01, date: "2024-12-27", stock: 37, costPrice: 91.61, outOfStock: false },
  { name: "NovaOptic FL-87", category: "Lectura", sku: "SKU-549408-V", salePrice: 131.07, date: "2024-10-14", stock: 29, costPrice: 100.82, outOfStock: false },
  { name: "ClearVue NV-791", category: "Fotocromático", sku: "SKU-886531-M", salePrice: 114.40, date: "2025-01-19", stock: 30, costPrice: 84.12, outOfStock: false },
  { name: "FrameLab VX-793", category: "Goggles", sku: "SKU-579957-S", salePrice: 27.93, date: "2025-03-27", stock: 49, costPrice: 12.99, outOfStock: false },
  { name: "PrismCraft NV-62", category: "Goggles", sku: "SKU-666309-X", salePrice: 33.60, date: "2025-06-27", stock: 84, costPrice: 18.26, outOfStock: false },
  { name: "OptiZen NV-3661", category: "Goggles", sku: "SKU-522562-M", salePrice: 87.94, date: "2024-12-19", stock: 53, costPrice: 53.62, outOfStock: false },
  { name: "LuxSight RBX-475", category: "Blue Light", sku: "SKU-447109-G", salePrice: 138.16, date: "2024-11-29", stock: 46, costPrice: 75.50, outOfStock: false },
  { name: "Visionary RBX-84", category: "Lectura", sku: "SKU-918155-P", salePrice: 18.10, date: "2024-11-03", stock: 118, costPrice: 9.63, outOfStock: false },
  { name: "PrismCraft NV-37", category: "Fotocromático", sku: "SKU-204161-S", salePrice: 71.08, date: "2024-09-26", stock: 103, costPrice: 42.06, outOfStock: false },
  { name: "AeroLens AX-484", category: "Sport", sku: "SKU-214956-C", salePrice: 75.69, date: "2024-11-02", stock: 113, costPrice: 39.42, outOfStock: false },
  { name: "FocusLine VX-81", category: "Solar", sku: "SKU-319241-L", salePrice: 17.20, date: "2024-09-28", stock: 45, costPrice: 10.55, outOfStock: false },
  { name: "LuxSight AX-3842", category: "Sport", sku: "SKU-822398-F", salePrice: 37.47, date: "2024-09-14", stock: 9, costPrice: 19.93, outOfStock: false },
  { name: "UrbanFrame NV-11", category: "Fotocromático", sku: "SKU-962960-Y", salePrice: 232.63, date: "2025-06-29", stock: 102, costPrice: 117.49, outOfStock: false },
  { name: "NovaOptic FL-520", category: "Goggles", sku: "SKU-125208-Z", salePrice: 158.86, date: "2025-05-12", stock: 80, costPrice: 72.54, outOfStock: false },
  { name: "ClearVue FL-6756", category: "Oftálmico", sku: "SKU-795934-T", salePrice: 181.88, date: "2025-01-22", stock: 13, costPrice: 98.85, outOfStock: false },
  { name: "FrameLab AX-188", category: "Seguridad", sku: "SKU-655102-N", salePrice: 45.55, date: "2025-02-09", stock: 24, costPrice: 35.31, outOfStock: false },
  { name: "OptiZen RBX-819", category: "Oftálmico", sku: "SKU-964791-U", salePrice: 201.78, date: "2025-03-02", stock: 86, costPrice: 109.07, outOfStock: false },
  { name: "PrismCraft RBX-8", category: "Natación", sku: "SKU-449029-D", salePrice: 196.22, date: "2025-04-04", stock: 75, costPrice: 114.75, outOfStock: false },
  { name: "Visionary OF-670", category: "Clip-On", sku: "SKU-766490-J", salePrice: 79.32, date: "2025-05-21", stock: 119, costPrice: 59.64, outOfStock: false },
  { name: "LuxSight FL-8631", category: "Lectura", sku: "SKU-386776-H", salePrice: 37.06, date: "2025-03-20", stock: 93, costPrice: 21.93, outOfStock: false },
  { name: "FocusLine NV-32", category: "Blue Light", sku: "SKU-186790-F", salePrice: 114.95, date: "2025-02-01", stock: 85, costPrice: 65.31, outOfStock: false },
  { name: "ClearVue OF-230", category: "Seguridad", sku: "SKU-847412-B", salePrice: 23.94, date: "2024-10-15", stock: 96, costPrice: 12.34, outOfStock: false },
  { name: "NovaOptic VX-63", category: "Oftálmico", sku: "SKU-772639-Z", salePrice: 138.60, date: "2025-04-21", stock: 28, costPrice: 67.28, outOfStock: false },
  { name: "FrameLab VX-709", category: "Blue Light", sku: "SKU-487205-C", salePrice: 86.14, date: "2024-04-20", stock: 16, costPrice: 43.07, outOfStock: false },
  { name: "OptiZen VX-3995", category: "Clip-On", sku: "SKU-510887-M", salePrice: 236.80, date: "2025-06-13", stock: 44, costPrice: 115.51, outOfStock: false },
  { name: "PrismCraft AX-48", category: "Ciclismo", sku: "SKU-301971-W", salePrice: 41.38, date: "2025-01-15", stock: 77, costPrice: 29.77, outOfStock: false },
  { name: "LuxSight PR-9388", category: "Sport", sku: "SKU-651747-T", salePrice: 196.70, date: "2025-03-30", stock: 53, costPrice: 91.49, outOfStock: false },
  { name: "AeroLens PR-654", category: "Blue Light", sku: "SKU-491852-B", salePrice: 116.28, date: "2025-01-07", stock: 64, costPrice: 54.59, outOfStock: false },
  { name: "UrbanFrame VX-8", category: "Lectura", sku: "SKU-741965-K", salePrice: 103.38, date: "2025-01-02", stock: 110, costPrice: 65.02, outOfStock: false },
  { name: "ClearVue VX-508", category: "Lectura", sku: "SKU-655269-P", salePrice: 34.90, date: "2025-07-14", stock: 0, costPrice: 17.90, outOfStock: true },
  { name: "NovaOptic OF-12", category: "Fotocromático", sku: "SKU-664721-W", salePrice: 19.84, date: "2024-10-14", stock: 0, costPrice: 16.13, outOfStock: true },
];

// ---- Cálculos derivados para el dashboard ----
export function getDashboardStats(products: ProductData[]) {
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const inventoryValue = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);
  const retailValue = products.reduce((sum, p) => sum + (p.salePrice * p.stock), 0);
  const potentialProfit = retailValue - inventoryValue;
  const outOfStock = products.filter(p => p.outOfStock).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;

  // Productos por categoría
  const byCategory = CATEGORIES.map(cat => ({
    name: cat,
    count: products.filter(p => p.category === cat).length,
    stock: products.filter(p => p.category === cat).reduce((s, p) => s + p.stock, 0),
  })).sort((a, b) => b.count - a.count);

  // Productos por marca
  const byBrand = BRANDS.map(brand => ({
    name: brand,
    count: products.filter(p => p.name.startsWith(brand)).length,
  })).sort((a, b) => b.count - a.count);

  // Top 5 más caros
  const topExpensive = [...products].sort((a, b) => b.salePrice - a.salePrice).slice(0, 5);

  // Productos con stock bajo (<=10, excluyendo agotados)
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10)
    .sort((a, b) => a.stock - b.stock);

  return {
    totalProducts,
    totalStock,
    inventoryValue,
    retailValue,
    potentialProfit,
    outOfStock,
    lowStock,
    byCategory,
    byBrand,
    topExpensive,
    lowStockProducts,
  };
}
