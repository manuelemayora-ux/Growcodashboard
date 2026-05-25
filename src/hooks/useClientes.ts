"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases: number;
  lastPurchase: string;
}

const STORAGE_CUSTOMERS_KEY = 'stockly_customers';

const DEFAULT_CUSTOMERS: Customer[] = [
  { id: 'c-1', name: 'Ana Gómez', email: 'ana.gomez@gmail.com', phone: '2255-8888', address: 'San Salvador, El Salvador', totalPurchases: 1540.50, lastPurchase: '2026-05-12' },
  { id: 'c-2', name: 'Roberto Carlos', email: 'roberto.c@outlook.com', phone: '2541-9999', address: 'Santa Tecla, La Libertad', totalPurchases: 320.00, lastPurchase: '2026-05-18' },
  { id: 'c-3', name: 'María Hernández', email: 'maria.h@growco.com', phone: '2233-4455', address: 'Antiguo Cuscatlán', totalPurchases: 2450.75, lastPurchase: '2026-05-24' }
];

function getLocalCustomers(): Customer[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_CUSTOMERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomers(customers: Customer[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_CUSTOMERS_KEY, JSON.stringify(customers));
}

export function useClientes() {
  const queryClient = useQueryClient();

  // 1. Fetch customers
  const customersQuery = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const stored = getLocalCustomers();
      if (stored.length === 0) {
        saveLocalCustomers(DEFAULT_CUSTOMERS);
        return DEFAULT_CUSTOMERS;
      }
      return stored;
    }
  });

  // 2. Create customer mutation
  const createCustomer = useMutation({
    mutationFn: async (variables: {
      name: string;
      email: string;
      phone: string;
      address: string;
    }) => {
      const customers = getLocalCustomers();
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: variables.name,
        email: variables.email || '',
        phone: variables.phone || '',
        address: variables.address || '',
        totalPurchases: 0,
        lastPurchase: '-'
      };
      
      customers.unshift(newCustomer);
      saveLocalCustomers(customers);
      return newCustomer;
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
      const customers = getLocalCustomers();
      const updated = customers.map(c => {
        if (c.id === variables.id) {
          return {
            ...c,
            name: variables.name,
            email: variables.email,
            phone: variables.phone,
            address: variables.address
          };
        }
        return c;
      });
      saveLocalCustomers(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  // 4. Delete customer mutation
  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      const customers = getLocalCustomers();
      const filtered = customers.filter(c => c.id !== id);
      saveLocalCustomers(filtered);
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
