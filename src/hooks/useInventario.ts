"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useTenant } from './useTenant';

export interface Movement {
  id: string;
  sku: string;
  product: string;
  type: 'entrada' | 'salida' | 'ajuste';
  qty: number;
  date: string;
  note: string;
}

export function useInventario() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: profile } = useTenant();

  // 1. Fetch inventory movements
  const movementsQuery = useQuery({
    queryKey: ['movements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select(`
          id,
          type,
          quantity,
          created_at,
          notes,
          products(sku, name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(m => {
        // Map database movement type to UI types: 'purchase'/'return' -> 'entrada', 'sale' -> 'salida', 'adjustment' -> 'ajuste'
        let uiType: 'entrada' | 'salida' | 'ajuste' = 'ajuste';
        if (m.type === 'purchase' || (m.type === 'return' && m.quantity > 0)) {
          uiType = 'entrada';
        } else if (m.type === 'sale' || (m.type === 'return' && m.quantity < 0)) {
          uiType = 'salida';
        } else if (m.type === 'adjustment') {
          uiType = 'ajuste';
        }

        const prod = m.products as unknown as { sku: string; name: string } | { sku: string; name: string }[] | null;
        const prodObj = Array.isArray(prod) ? prod[0] : prod;

        return {
          id: m.id,
          sku: prodObj?.sku || '',
          product: prodObj?.name || 'Producto Desconocido',
          type: uiType,
          qty: m.quantity,
          date: m.created_at ? m.created_at.split('T')[0] : '',
          note: m.notes || '',
        } as Movement;
      });
    },
    enabled: !!profile?.tenant_id,
  });

  // 2. Fetch inventory stock counts (totals, low stock, out of stock)
  const stockSummaryQuery = useQuery({
    queryKey: ['stock-summary'],
    queryFn: async () => {
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          sku,
          categories(name),
          inventory(quantity)
        `)
        .eq('active', true);

      if (error) throw error;

      let totalUnits = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;
      const lowStockProducts: { sku: string; name: string; category: string; stock: number }[] = [];
      const stockByCategory: { [key: string]: number } = {};

      (products || []).forEach(p => {
        const stock = (p.inventory || []).reduce((acc: number, inv: { quantity: number }) => acc + (inv.quantity || 0), 0);
        totalUnits += stock;

        const cat = p.categories as unknown as { name: string } | { name: string }[] | null;
        const catObj = Array.isArray(cat) ? cat[0] : cat;
        const catName = catObj?.name || 'General';

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
    enabled: !!profile?.tenant_id,
  });

  // 3. Manual stock adjustment mutation
  const adjustStock = useMutation({
    mutationFn: async (variables: {
      productId: string;
      quantity: number;
      type: 'entrada' | 'salida' | 'ajuste';
      notes: string;
    }) => {
      if (!profile?.tenant_id) throw new Error('Not authenticated');

      // A. Get main location
      let { data: loc } = await supabase
        .from('locations')
        .select('id')
        .eq('is_main', true)
        .maybeSingle();

      if (!loc) {
        const { data: newLoc } = await supabase
          .from('locations')
          .insert({ tenant_id: profile.tenant_id, name: 'Tienda Principal', is_main: true })
          .select()
          .single();
        loc = newLoc;
      }

      if (!loc) throw new Error('Could not resolve location');

      // B. Fetch current inventory stock
      const { data: currInv } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('product_id', variables.productId)
        .eq('location_id', loc.id)
        .maybeSingle();

      const currentStock = currInv?.quantity || 0;
      let newStock = currentStock;
      let diff = variables.quantity;

      if (variables.type === 'entrada') {
        newStock = currentStock + variables.quantity;
      } else if (variables.type === 'salida') {
        newStock = currentStock - variables.quantity;
        diff = -variables.quantity;
      } else { // ajuste directo
        newStock = variables.quantity;
        diff = variables.quantity - currentStock;
      }

      // C. Update inventory
      const { error: invErr } = await supabase
        .from('inventory')
        .upsert({
          tenant_id: profile.tenant_id,
          product_id: variables.productId,
          location_id: loc.id,
          quantity: newStock,
        }, { onConflict: 'product_id,location_id' });

      if (invErr) throw invErr;

      // D. Record movement
      const { error: movErr } = await supabase
        .from('inventory_movements')
        .insert({
          tenant_id: profile.tenant_id,
          product_id: variables.productId,
          location_id: loc.id,
          type: 'adjustment',
          quantity: diff,
          notes: variables.notes,
          created_by: profile.id,
        });

      if (movErr) throw movErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['stock-summary'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    movements: movementsQuery.data || [],
    summary: stockSummaryQuery.data || { totalUnits: 0, lowStockCount: 0, outOfStockCount: 0, lowStockProducts: [], stockByCategory: [] },
    isLoading: movementsQuery.isLoading || stockSummaryQuery.isLoading,
    isError: movementsQuery.isError || stockSummaryQuery.isError,
    error: movementsQuery.error || stockSummaryQuery.error,
    adjustStock,
  };
}
