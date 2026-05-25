"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  products: number;
  lastOrder: string;
}

const STORAGE_SUPPLIERS_KEY = 'stockly_suppliers';

const DEFAULT_SUPPLIERS: Supplier[] = [
  { id: 's-1', name: 'Distribuidora Global', contact: 'Juan Pérez', email: 'contacto@distglobal.com', phone: '2244-1111', products: 12, lastOrder: '2026-05-10' },
  { id: 's-2', name: 'Ópticas Asociadas Mayoristas', contact: 'Sofía López', email: 'ventas@opticasasoc.com', phone: '2511-2222', products: 8, lastOrder: '2026-05-15' },
  { id: 's-3', name: 'Importaciones Lux', contact: 'Carlos Ramos', email: 'cramos@importlux.com', phone: '2288-7777', products: 24, lastOrder: '2026-05-22' }
];

function getLocalSuppliers(): Supplier[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_SUPPLIERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalSuppliers(suppliers: Supplier[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_SUPPLIERS_KEY, JSON.stringify(suppliers));
}

export function useProveedores() {
  const queryClient = useQueryClient();

  // 1. Fetch suppliers
  const suppliersQuery = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const stored = getLocalSuppliers();
      if (stored.length === 0) {
        saveLocalSuppliers(DEFAULT_SUPPLIERS);
        return DEFAULT_SUPPLIERS;
      }
      return stored;
    }
  });

  // 2. Create supplier mutation
  const createSupplier = useMutation({
    mutationFn: async (variables: {
      name: string;
      contact: string;
      email: string;
      phone: string;
    }) => {
      const suppliers = getLocalSuppliers();
      const newSupplier: Supplier = {
        id: `supp-${Date.now()}`,
        name: variables.name,
        contact: variables.contact || '',
        email: variables.email || '',
        phone: variables.phone || '',
        products: 0,
        lastOrder: '-'
      };
      
      suppliers.unshift(newSupplier);
      saveLocalSuppliers(suppliers);
      return newSupplier;
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
      const suppliers = getLocalSuppliers();
      const updated = suppliers.map(s => {
        if (s.id === variables.id) {
          return {
            ...s,
            name: variables.name,
            contact: variables.contact,
            email: variables.email,
            phone: variables.phone
          };
        }
        return s;
      });
      saveLocalSuppliers(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });

  // 4. Delete supplier mutation
  const deleteSupplier = useMutation({
    mutationFn: async (id: string) => {
      const suppliers = getLocalSuppliers();
      const filtered = suppliers.filter(s => s.id !== id);
      saveLocalSuppliers(filtered);
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
