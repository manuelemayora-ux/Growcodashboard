"use client";

import { useMemo } from 'react';
import { useProductos } from './useProductos';

export function useDashboard() {
  const { products, isLoading, isError, error } = useProductos();

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
    };
  }, [products]);

  return {
    stats,
    isLoading,
    isError,
    error,
  };
}
