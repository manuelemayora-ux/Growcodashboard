"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useProductos } from './useProductos';

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  maxStock: number;
}

export interface Sale {
  id: string;
  date: string;
  items: CartItem[];
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
  subtotal: number;
  taxes: number;
  total: number;
}

const STORAGE_SALES_KEY = 'stockly_sales';
const STORAGE_MOVEMENTS_KEY = 'stockly_movements_v6';

function getLocalSales(): Sale[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_SALES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalSales(sales: Sale[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_SALES_KEY, JSON.stringify(sales));
}

function getLocalMovements() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_MOVEMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

interface LocalMovement {
  id: string;
  sku: string;
  product: string;
  type: 'entrada' | 'salida' | 'ajuste';
  qty: number;
  date: string;
  note: string;
}

function saveLocalMovements(movs: LocalMovement[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_MOVEMENTS_KEY, JSON.stringify(movs));
}

export function useVentas() {
  const queryClient = useQueryClient();
  const { products, updateProduct } = useProductos();

  // Create checkout mutation (local mode)
  const checkoutSale = useMutation({
    mutationFn: async (variables: {
      cart: CartItem[];
      paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
      subtotal: number;
      taxes: number;
      total: number;
    }) => {
      const saleId = `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const saleDate = new Date().toISOString();

      // 1. Process each item in cart and deduct stock
      for (const item of variables.cart) {
        const prod = products.find(p => p.sku === item.sku);
        if (!prod) {
          console.error(`Product not found for SKU: ${item.sku}`);
          continue;
        }

        const currentStock = prod.stock || 0;
        const newStock = Math.max(0, currentStock - item.quantity);

        // A. Update product stock in products hook (writes to local storage edits)
        await updateProduct.mutateAsync({
          id: prod.sku,
          sku: prod.sku,
          name: prod.name,
          category_name: prod.category_name || 'General',
          costPrice: prod.costPrice,
          salePrice: prod.salePrice,
          stock: newStock
        });

        // B. Add inventory movement
        const localMovs = getLocalMovements();
        const newMovement = {
          id: `mov-sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          sku: prod.sku,
          product: prod.name,
          type: 'salida' as const,
          qty: item.quantity,
          date: saleDate.split('T')[0],
          note: `Venta POS ${saleId.slice(-6).toUpperCase()}`
        };
        localMovs.unshift(newMovement);
        saveLocalMovements(localMovs);
      }

      // 2. Save sale record to local sales history
      const localSales = getLocalSales();
      const newSale: Sale = {
        id: saleId,
        date: saleDate,
        items: variables.cart,
        paymentMethod: variables.paymentMethod,
        subtotal: variables.subtotal,
        taxes: variables.taxes,
        total: variables.total
      };
      localSales.unshift(newSale);
      saveLocalSales(localSales);

      return newSale;
    },
    onSuccess: () => {
      // Invalidate queries so UI components refresh
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['stock-summary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['sales-history'] });
    },
  });

  return {
    checkoutSale,
    sales: getLocalSales()
  };
}
