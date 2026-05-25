"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useTenant } from './useTenant';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases: number;
  lastPurchase: string;
}

export function useClientes() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: profile } = useTenant();

  // 1. Fetch customers and calculate sales aggregates
  const customersQuery = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      // Query customers and aggregate sales
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          sales(total, created_at)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(c => {
        const sales = c.sales || [];
        const totalPurchases = sales.reduce((acc: number, sale: { total: number }) => acc + Number(sale.total || 0), 0);
        let lastPurchase = '-';
        if (sales.length > 0) {
          // Sort sales by date desc
          const sorted = [...sales].sort((a: { created_at: string }, b: { created_at: string }) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          lastPurchase = sorted[0].created_at ? sorted[0].created_at.split('T')[0] : '-';
        }

        return {
          id: c.id,
          name: c.name,
          email: c.email || '',
          phone: c.phone || '',
          address: c.address || '',
          totalPurchases,
          lastPurchase,
        } as Customer;
      });
    },
    enabled: !!profile?.tenant_id,
  });

  // 2. Create customer mutation
  const createCustomer = useMutation({
    mutationFn: async (variables: {
      name: string;
      email: string;
      phone: string;
      address: string;
    }) => {
      if (!profile?.tenant_id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('customers')
        .insert({
          tenant_id: profile.tenant_id,
          name: variables.name,
          email: variables.email,
          phone: variables.phone,
          address: variables.address,
          created_by: profile.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  // 3. Update customer mutation
  const updateCustomer = useMutation({
    mutationFn: async (variables: {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
    }) => {
      if (!profile?.tenant_id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('customers')
        .update({
          name: variables.name,
          email: variables.email,
          phone: variables.phone,
          address: variables.address,
          updated_by: profile.id,
        })
        .eq('id', variables.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  // 4. Delete customer mutation (soft delete)
  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  return {
    customers: customersQuery.data || [],
    isLoading: customersQuery.isLoading,
    isError: customersQuery.isError,
    error: customersQuery.error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
