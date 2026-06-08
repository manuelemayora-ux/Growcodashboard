"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProductos } from './useProductos';

export interface Movement {
  id: string;
  sku: string;
  product: string;
  type: 'entrada' | 'salida' | 'ajuste';
  qty: number;
  date: string;
  note: string;
}

const STORAGE_MOVEMENTS_KEY = 'stockly_movements_v6';

function getLocalMovements(): Movement[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_MOVEMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalMovements(movements: Movement[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_MOVEMENTS_KEY, JSON.stringify(movements));
  } catch (e) {
    console.error("Failed to save movements to localStorage:", e);
  }
}

export function useInventario() {
  const queryClient = useQueryClient();
  const { products, updateProduct, isLoading: productsLoading } = useProductos();

  // 1. Fetch inventory movements
  const movementsQuery = useQuery({
    queryKey: ['movements'],
    queryFn: async () => {
      const localMovs = getLocalMovements();
      const hasSeed = localMovs.some(m => m.id.startsWith('seed-'));

      if (!hasSeed && products.length > 0) {
        const seeded: Movement[] = [];
        const now = new Date();
        let isEarliestSetted = false;

        const targetMonthsByCategory: Record<string, number> = {
          'Lectura': 1.5,
          'Ciclismo': 2.5,
          'Goggles': 3.5,
          'Seguridad': 4.8,
          'Clip-On': 6.2,
          'Blue Light': 8.0,
          'Sport': 2.0,
          'Solar': 10.5,
          'Natación': 1.8,
          'Oftálmico': 12.0
        };

        const getTargetMonths = (categoryName: string | undefined): number => {
          if (!categoryName) return 5.0;
          const name = categoryName.trim();
          for (const [key, value] of Object.entries(targetMonthsByCategory)) {
            if (key.toLowerCase() === name.toLowerCase()) {
              return value;
            }
          }
          return 5.0;
        };
        
        products.forEach((p, idx) => {
          // 6.7% of products (every 15th product) are obsolete (no sales)
          const isObsolete = idx % 15 === 0;

          let totalQtySold = 0;
          if (!isObsolete && p.stock > 0) {
            const T = getTargetMonths(p.category_name);
            totalQtySold = Math.round((p.stock / T) * 3);
            if (totalQtySold === 0) totalQtySold = 1;
          }

          // Generate a few initial entrada movements for UI realism (about 50 entries)
          if (idx % 60 === 0) {
            seeded.push({
              id: `seed-in-${p.sku}-${idx}`,
              sku: p.sku,
              product: p.name,
              type: 'entrada',
              qty: (p.stock || 0) + 100,
              date: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              note: 'Inventario inicial demo'
            });
          }

          if (totalQtySold > 0) {
            let daysAgo = Math.floor(Math.random() * 89) + 1; // 1 to 89 days ago
            if (!isEarliestSetted) {
              daysAgo = 90; // Ensure at least one sale is exactly 90 days ago for math calibration
              isEarliestSetted = true;
            }
            const saleDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

            seeded.push({
              id: `seed-out-${p.sku}-${idx}`,
              sku: p.sku,
              product: p.name,
              type: 'salida',
              qty: totalQtySold,
              date: saleDate.toISOString().split('T')[0],
              note: 'Venta simulada demo'
            });
          }
        });
        
        const combined = [...localMovs, ...seeded];
        combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        saveLocalMovements(combined);
        return combined;
      }

      return localMovs;
    },
    enabled: products.length > 0
  });

  // 2. Fetch inventory stock counts (totals, low stock, out of stock) dynamically from products hook
  const stockSummaryQuery = useQuery({
    queryKey: ['stock-summary'],
    queryFn: async () => {
      let totalUnits = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;
      const lowStockProducts: { sku: string; name: string; category: string; stock: number }[] = [];
      const stockByCategory: { [key: string]: number } = {};

      products.forEach(p => {
        const stock = p.stock || 0;
        totalUnits += stock;

        const catName = p.category_name || 'General';

        if (stock === 0) {
          outOfStockCount++;
        } else if (stock <= 10) {
          lowStockCount++;
          lowStockProducts.push({
            sku: p.sku,
            name: p.name,
            category: catName,
            stock,
          });
        }

        stockByCategory[catName] = (stockByCategory[catName] || 0) + stock;
      });

      return {
        totalUnits,
        lowStockCount,
        outOfStockCount,
        lowStockProducts,
        stockByCategory: Object.entries(stockByCategory).map(([name, stock]) => ({ name, stock })),
      };
    },
    enabled: products.length > 0
  });

  // 3. Manual stock adjustment mutation
  const adjustStock = useMutation({
    mutationFn: async (variables: {
      productId: string; // SKU
      quantity: number;
      type: 'entrada' | 'salida' | 'ajuste';
      notes: string;
    }) => {
      const prod = products.find(p => p.sku === variables.productId);
      if (!prod) throw new Error('Product not found');

      const currentStock = prod.stock || 0;
      let newStock = currentStock;
      let diff = variables.quantity;

      if (variables.type === 'entrada') {
        newStock = currentStock + variables.quantity;
        diff = variables.quantity;
      } else if (variables.type === 'salida') {
        newStock = Math.max(0, currentStock - variables.quantity);
        diff = -variables.quantity;
      } else { // ajuste directo
        newStock = variables.quantity;
        diff = variables.quantity - currentStock;
      }

      // A. Update stock in products hook (saves to localStorage/modifications)
      await updateProduct.mutateAsync({
        id: prod.sku,
        sku: prod.sku,
        name: prod.name,
        category_name: prod.category_name || 'General',
        costPrice: prod.costPrice,
        salePrice: prod.salePrice,
        stock: newStock
      });

      // B. Save movement record
      const localMovs = getLocalMovements();
      const newMovement: Movement = {
        id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sku: prod.sku,
        product: prod.name,
        type: variables.type,
        qty: Math.abs(diff),
        date: new Date().toISOString().split('T')[0],
        note: variables.notes || 'Ajuste manual de stock'
      };

      localMovs.unshift(newMovement);
      saveLocalMovements(localMovs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['stock-summary'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const isLoading = productsLoading || movementsQuery.isLoading || stockSummaryQuery.isLoading;

  return {
    movements: movementsQuery.data || [],
    summary: stockSummaryQuery.data || { totalUnits: 0, lowStockCount: 0, outOfStockCount: 0, lowStockProducts: [], stockByCategory: [] },
    isLoading: isLoading,
    isError: movementsQuery.isError || stockSummaryQuery.isError,
    error: movementsQuery.error || stockSummaryQuery.error,
    adjustStock,
  };
}
