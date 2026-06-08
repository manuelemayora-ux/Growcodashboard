"use client";

import { useMemo } from 'react';
import { useProductos } from './useProductos';
import { useInventario } from './useInventario';

export function useDashboard() {
  const { products, isLoading: productsLoading, isError, error } = useProductos();
  const { movements, isLoading: movementsLoading } = useInventario();

  const stats = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        totalProducts: 0,
        totalStock: 0,
        inventoryValue: 0,
        retailValue: 0,
        potentialProfit: 0,
        outOfStock: 0,
        lowStock: 0,
        byCategory: [],
        topExpensive: [],
        lowStockProducts: [],
        projectionsByCategory: [],
        reorderAlerts: [],
      };
    }

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const inventoryValue = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);
    const retailValue = products.reduce((sum, p) => sum + (p.salePrice * p.stock), 0);
    const potentialProfit = retailValue - inventoryValue;
    const outOfStock = products.filter(p => p.stock <= 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;

    // Stock by category
    const categoriesMap: { [key: string]: { name: string; count: number; stock: number } } = {};
    products.forEach(p => {
      const cat = p.category_name || 'General';
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = { name: cat, count: 0, stock: 0 };
      }
      categoriesMap[cat].count += 1;
      categoriesMap[cat].stock += p.stock;
    });

    const byCategory = Object.values(categoriesMap).sort((a, b) => b.count - a.count);

    // Top 5 most expensive products
    const topExpensive = [...products]
      .sort((a, b) => b.salePrice - a.salePrice)
      .slice(0, 5);

    // Products with critical stock (<= 10, excluding out of stock)
    const lowStockProducts = products
      .filter(p => p.stock > 0 && p.stock <= 10)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);

    // ---- Projections & Reorder logic ----
    const categorySales: Record<string, number> = {};
    let earliestDate = new Date();

    if (movements && movements.length > 0) {
      movements.forEach(m => {
        if (m.type === 'salida') {
          const prod = products.find(p => p.sku === m.sku);
          const cat = prod?.category_name || 'General';
          categorySales[cat] = (categorySales[cat] || 0) + m.qty;
          
          const mDate = new Date(m.date);
          if (mDate < earliestDate) {
            earliestDate = mDate;
          }
        }
      });
    }

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - earliestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let monthsElapsed = diffDays / 30;
    if (monthsElapsed < 1) monthsElapsed = 1; // Baseline for demo

    const projectionsByCategory = byCategory.map(cat => {
      const totalSold = categorySales[cat.name] || 0;
      const monthlyVelocity = totalSold / monthsElapsed;
      
      let monthsOfInventory = 12; // Cap at 12 for chart readability
      if (monthlyVelocity > 0) {
        monthsOfInventory = cat.stock / monthlyVelocity;
        if (monthsOfInventory > 12) monthsOfInventory = 12;
      } else if (cat.stock === 0) {
        monthsOfInventory = 0;
      }

      return {
        name: cat.name,
        stock: cat.stock,
        monthlyVelocity: Math.round(monthlyVelocity * 10) / 10,
        monthsOfInventory: Math.round(monthsOfInventory * 10) / 10,
      };
    }).sort((a, b) => a.monthsOfInventory - b.monthsOfInventory);

    // Alert if 3 months or less (2 months lead time + 1 month buffer)
    // Note: If monthsOfInventory is 0, it means they are out of stock. Include them in reorder alerts.
    const reorderAlerts = projectionsByCategory.filter(p => p.monthsOfInventory <= 3);

    return {
      totalProducts,
      totalStock,
      inventoryValue,
      retailValue,
      potentialProfit,
      outOfStock,
      lowStock,
      byCategory,
      topExpensive,
      lowStockProducts,
      projectionsByCategory,
      reorderAlerts,
    };
  }, [products, movements]);

  return {
    stats,
    isLoading: productsLoading || movementsLoading,
    isError,
    error,
  };
}
