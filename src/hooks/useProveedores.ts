"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useTenant } from './useTenant';

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  products: number;
  lastOrder: string;
}

export function useProveedores() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: profile } = useTenant();

  // 1. Fetch suppliers and calculate aggregates
  const suppliersQuery = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      // Query suppliers and join purchases
      const { data, error } = await supabase
        .from('suppliers')
        .select(`
          *,
          purchases(created_at, total)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(s => {
        const purchases = s.purchases || [];
        let lastOrder = '-';
        if (purchases.length > 0) {
          const sorted = [...purchases].sort((a: { created_at: string }, b: { created_at: string }) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          lastOrder = sorted[0].created_at ? sorted[0].created_at.split('T')[0] : '-';
        }

        return {
          id: s.id,
          name: s.name,
          contact: s.contact_name || '',
          email: s.email || '',
          phone: s.phone || '',
          products: purchases.length, // Display number of purchase orders as proxy
          lastOrder,
        } as Supplier;
      });
    },
    enabled: !!profile?.tenant_id,
  });

  // 2. Create supplier mutation
  const createSupplier = useMutation({
    mutationFn: async (variables: {
      name: string;
      contact: string;
      email: string;
      phone: string;
    }) => {
      if (!profile?.tenant_id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('suppliers')
        .insert({
          tenant_id: profile.tenant_id,
          name: variables.name,
          contact_name: variables.contact,
          email: variables.email,
          phone: variables.phone,
          created_by: profile.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });

  // 3. Update supplier mutation
  const updateSupplier = useMutation({
    mutationFn: async (variables: {
      id: string;
      name: string;
      contact: string;
      email: string;
      phone: string;
    }) => {
      if (!profile?.tenant_id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('suppliers')
        .update({
          name: variables.name,
          contact_name: variables.contact,
          email: variables.email,
          phone: variables.phone,
          updated_by: profile.id,
        })
        .eq('id', variables.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });

  // 4. Delete supplier mutation (soft delete)
  const deleteSupplier = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('suppliers')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });

  return {
    suppliers: suppliersQuery.data || [],
    isLoading: suppliersQuery.isLoading,
    isError: suppliersQuery.isError,
    error: suppliersQuery.error,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
}
