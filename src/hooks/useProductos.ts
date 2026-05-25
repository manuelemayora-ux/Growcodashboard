"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useTenant } from './useTenant';

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  category_id: string | null;
  category_name?: string;
  brand: string;
  base_unit: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  tax_rate: number;
  active: boolean;
  outOfStock: boolean;
  date: string;
}

export function useProductos() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: profile } = useTenant();

  // 1. Fetch products
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // Query products, join categories and inventory
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          inventory(quantity)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(p => {
        // Calculate total stock from inventory array
        const totalStock = (p.inventory || []).reduce((acc: number, inv: { quantity: number }) => acc + (inv.quantity || 0), 0);
        return {
          id: p.id,
          sku: p.sku,
          barcode: p.barcode || '',
          name: p.name,
          description: p.description || '',
          category_id: p.category_id,
          category_name: p.categories?.name || 'General',
          brand: p.brand || '',
          base_unit: p.base_unit || 'unidad',
          costPrice: Number(p.cost_price || 0),
          salePrice: Number(p.sale_price || 0),
          stock: totalStock,
          tax_rate: Number(p.tax_rate || 0.13),
          active: p.active,
          outOfStock: totalStock <= 0,
          date: p.created_at ? p.created_at.split('T')[0] : '',
        } as Product;
      });
    },
    enabled: !!profile?.tenant_id,
  });

  // 2. Fetch categories
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      // Auto-seed default categories if empty
      if (data && data.length === 0 && profile?.tenant_id) {
        const defaultCats = ["Solar", "Oftálmico", "Blue Light", "Sport", "Lectura"];
        const inserts = defaultCats.map(name => ({
          tenant_id: profile.tenant_id,
          name,
        }));
        const { data: seeded, error: seedErr } = await supabase
          .from('categories')
          .insert(inserts)
          .select();
        if (seedErr) throw seedErr;
        return seeded || [];
      }

      return data || [];
    },
    enabled: !!profile?.tenant_id,
  });

  // 3. Create product mutation
  const createProduct = useMutation({
    mutationFn: async (variables: {
      name: string;
      sku: string;
      category_name: string;
      costPrice: number;
      salePrice: number;
      stock: number;
    }) => {
      if (!profile?.tenant_id) throw new Error('Not authenticated');

      // A. Get category ID
      let categoryId = null;
      if (variables.category_name) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('name', variables.category_name)
          .maybeSingle();

        if (cat) {
          categoryId = cat.id;
        } else {
          // Create category if it doesn't exist
          const { data: newCat } = await supabase
            .from('categories')
            .insert({ tenant_id: profile.tenant_id, name: variables.category_name })
            .select()
            .single();
          categoryId = newCat?.id || null;
        }
      }

      // B. Insert product
      const { data: product, error: pErr } = await supabase
        .from('products')
        .insert({
          tenant_id: profile.tenant_id,
          name: variables.name,
          sku: variables.sku,
          category_id: categoryId,
          cost_price: variables.costPrice,
          sale_price: variables.salePrice,
          created_by: profile.id,
        })
        .select()
        .single();

      if (pErr) throw pErr;

      // C. Seeding initial stock if stock > 0
      if (variables.stock > 0 && product) {
        // Find or create main location
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

        if (loc) {
          // Add to inventory
          const { error: invErr } = await supabase
            .from('inventory')
            .insert({
              tenant_id: profile.tenant_id,
              product_id: product.id,
              location_id: loc.id,
              quantity: variables.stock,
            });
          if (invErr) console.error("Error setting stock:", invErr.message);

          // Add movement record
          await supabase.from('inventory_movements').insert({
            tenant_id: profile.tenant_id,
            product_id: product.id,
            location_id: loc.id,
            type: 'adjustment',
            quantity: variables.stock,
            unit_cost: variables.costPrice,
            notes: 'Ajuste inicial de inventario',
            created_by: profile.id,
          });
        }
      }

      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // 4. Update product mutation
  const updateProduct = useMutation({
    mutationFn: async (variables: {
      id: string;
      name: string;
      sku: string;
      category_name: string;
      costPrice: number;
      salePrice: number;
      stock?: number;
    }) => {
      if (!profile?.tenant_id) throw new Error('Not authenticated');

      // A. Get category ID
      let categoryId = null;
      if (variables.category_name) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('name', variables.category_name)
          .maybeSingle();

        categoryId = cat?.id || null;
      }

      // B. Update product details
      const { error: pErr } = await supabase
        .from('products')
        .update({
          name: variables.name,
          sku: variables.sku,
          category_id: categoryId,
          cost_price: variables.costPrice,
          sale_price: variables.salePrice,
          updated_by: profile.id,
        })
        .eq('id', variables.id);

      if (pErr) throw pErr;

      // C. Adjust inventory stock if changed
      if (variables.stock !== undefined) {
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

        if (loc) {
          // Check current stock
          const { data: currInv } = await supabase
            .from('inventory')
            .select('quantity')
            .eq('product_id', variables.id)
            .eq('location_id', loc.id)
            .maybeSingle();

          const currentStock = currInv?.quantity || 0;
          const diff = variables.stock - currentStock;

          if (diff !== 0) {
            // Upsert inventory
            const { error: invErr } = await supabase
              .from('inventory')
              .upsert({
                tenant_id: profile.tenant_id,
                product_id: variables.id,
                location_id: loc.id,
                quantity: variables.stock,
              }, { onConflict: 'product_id,location_id' });
            if (invErr) console.error("Error setting stock:", invErr.message);

            // Record movement
            await supabase.from('inventory_movements').insert({
              tenant_id: profile.tenant_id,
              product_id: variables.id,
              location_id: loc.id,
              type: 'adjustment',
              quantity: diff,
              unit_cost: variables.costPrice,
              notes: 'Modificación manual de stock',
              created_by: profile.id,
            });
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // 5. Delete product mutation
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      // Soft-delete by setting active=false
      const { error } = await supabase
        .from('products')
        .update({ active: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products: productsQuery.data || [],
    categories: categoriesQuery.data || [],
    isLoading: productsQuery.isLoading || categoriesQuery.isLoading,
    isError: productsQuery.isError || categoriesQuery.isError,
    error: productsQuery.error || categoriesQuery.error,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
