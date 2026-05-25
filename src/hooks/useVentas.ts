"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useTenant } from './useTenant';

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  maxStock: number;
}

export function useVentas() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: profile } = useTenant();

  // Create checkout mutation
  const checkoutSale = useMutation({
    mutationFn: async (variables: {
      cart: CartItem[];
      paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
      subtotal: number;
      taxes: number;
      total: number;
    }) => {
      if (!profile?.tenant_id) throw new Error('Not authenticated');

      // 1. Get main location
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

      // 2. Insert sale record
      const { data: sale, error: saleErr } = await supabase
        .from('sales')
        .insert({
          tenant_id: profile.tenant_id,
          document_type: 'factura',
          location_id: loc.id,
          status: 'paid',
          subtotal: variables.subtotal,
          iva_amount: variables.taxes,
          total: variables.total,
          paid_amount: variables.total,
          payment_method: variables.paymentMethod,
          created_by: profile.id,
          paid_at: new Date().toISOString(),
          confirmed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (saleErr) throw saleErr;

      // 3. Process each item in cart
      for (const item of variables.cart) {
        // A. Resolve product ID from SKU
        const { data: product } = await supabase
          .from('products')
          .select('id')
          .eq('sku', item.sku)
          .single();

        if (!product) {
          console.error(`Product not found for SKU: ${item.sku}`);
          continue;
        }

        // B. Insert sale item line
        const { error: itemErr } = await supabase
          .from('sale_items')
          .insert({
            sale_id: sale.id,
            product_id: product.id,
            quantity: item.quantity,
            unit_price: item.price,
            line_total: item.price * item.quantity,
          });

        if (itemErr) throw itemErr;

        // C. Fetch current stock to decrement
        const { data: currInv } = await supabase
          .from('inventory')
          .select('quantity')
          .eq('product_id', product.id)
          .eq('location_id', loc.id)
          .maybeSingle();

        const currentStock = currInv?.quantity || 0;
        const newStock = Math.max(0, currentStock - item.quantity);

        // D. Update inventory stock
        const { error: invErr } = await supabase
          .from('inventory')
          .upsert({
            tenant_id: profile.tenant_id,
            product_id: product.id,
            location_id: loc.id,
            quantity: newStock,
          }, { onConflict: 'product_id,location_id' });

        if (invErr) throw invErr;

        // E. Record inventory movement as sale
        await supabase.from('inventory_movements').insert({
          tenant_id: profile.tenant_id,
          product_id: product.id,
          location_id: loc.id,
          type: 'sale',
          quantity: -item.quantity,
          unit_cost: item.price,
          notes: `Venta POS POS-${sale.id.slice(-6).toUpperCase()}`,
          created_by: profile.id,
        });
      }

      return sale;
    },
    onSuccess: () => {
      // Invalidate queries so that dashboard, products, and movements are re-fetched
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['stock-summary'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  return {
    checkoutSale,
  };
}
