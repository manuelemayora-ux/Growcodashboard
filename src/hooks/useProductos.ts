"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

export interface Category {
  id: string;
  name: string;
  color?: string;
}

const BRANDS = [
  'Gucci', 'Vogue Eyewear', 'Vogue', 'Dolce & Gabbana', 'Dolce', 'Fendi', 
  'Carrera', 'Prada', 'Tom Ford', 'Armani Exchange', 'Armani', 'Tiffany & Co.', 
  'Tiffany', 'Balenciaga', 'Maui Jim', 'Burberry', 'Michael Kors', 'Ray-Ban', 
  'Coach', 'Versace', 'Persol', 'Hugo Boss', 'Saint Laurent', 'Oakley'
];

function detectBrand(name: string): string {
  for (const brand of BRANDS) {
    if (name.toLowerCase().startsWith(brand.toLowerCase())) {
      return brand;
    }
  }
  return name.split(' ')[0] || 'Genérico';
}

// LocalStorage helpers
const STORAGE_MODS_KEY = 'stockly_products_modifications';
const STORAGE_NEW_KEY = 'stockly_new_products';

function getLocalModifications(): Record<string, Partial<Product> & { deleted?: boolean }> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_MODS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveLocalModifications(mods: Record<string, Partial<Product> & { deleted?: boolean }>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_MODS_KEY, JSON.stringify(mods));
}

function getLocalNewProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_NEW_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalNewProducts(products: Product[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_NEW_KEY, JSON.stringify(products));
}

export function useProductos() {
  const queryClient = useQueryClient();

  // 1. Fetch & Merge Products
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      let remoteProducts: Product[] = [];

      try {
        const res = await fetch('/SaaSystem/api/products-sheet');
        if (!res.ok) throw new Error('Failed to fetch from sheet API');
        remoteProducts = await res.json();
      } catch (err) {
        console.error("Error fetching Google Sheet via API, using empty baseline:", err);
      }

      // Merge with localStorage updates
      const modifications = getLocalModifications();
      const newProducts = getLocalNewProducts();

      // Apply modifications to remote products
      const mergedProducts = remoteProducts.map(p => {
        const mod = modifications[p.sku];
        if (mod) {
          if (mod.deleted) return null; // Filter out deleted ones later
          return { ...p, ...mod } as Product;
        }
        return p;
      }).filter(Boolean) as Product[];

      // Append new products
      const finalProducts = [...newProducts, ...mergedProducts];

      // Update outOfStock status dynamically
      return finalProducts.map(p => ({
        ...p,
        outOfStock: p.stock <= 0
      }));
    }
  });

  // 2. Derive Categories from active products
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const prods = productsQuery.data || [];
      const catsSet = new Set<string>();
      const catsList: Category[] = [];

      prods.forEach(p => {
        if (p.category_name) catsSet.add(p.category_name);
      });

      catsSet.forEach(name => {
        catsList.push({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name: name,
          color: '#00D1FF' // Signature Cyan Accent
        });
      });

      if (catsList.length === 0) {
        return [
          { id: 'solar', name: 'Solar' },
          { id: 'oftalmico', name: 'Oftálmico' },
          { id: 'blue-light', name: 'Blue Light' },
          { id: 'sport', name: 'Sport' },
          { id: 'lectura', name: 'Lectura' }
        ];
      }

      return catsList;
    },
    enabled: !!productsQuery.data
  });

  // 3. Create Product
  const createProduct = useMutation({
    mutationFn: async (variables: {
      name: string;
      sku: string;
      category_name: string;
      costPrice: number;
      salePrice: number;
      stock: number;
    }) => {
      const newProds = getLocalNewProducts();
      
      const newProd: Product = {
        id: variables.sku,
        sku: variables.sku,
        barcode: variables.sku,
        name: variables.name,
        description: 'Producto registrado localmente.',
        category_id: variables.category_name.toLowerCase().replace(/\s+/g, '-'),
        category_name: variables.category_name,
        brand: detectBrand(variables.name),
        base_unit: 'unidad',
        costPrice: Number(variables.costPrice || 0),
        salePrice: Number(variables.salePrice || 0),
        stock: Number(variables.stock || 0),
        tax_rate: 0.13,
        active: true,
        outOfStock: variables.stock <= 0,
        date: new Date().toISOString().split('T')[0]
      };

      newProds.unshift(newProd);
      saveLocalNewProducts(newProds);
      return newProd;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  // 4. Update Product
  const updateProduct = useMutation({
    mutationFn: async (variables: {
      id: string; // SKU
      name: string;
      sku: string;
      category_name: string;
      costPrice: number;
      salePrice: number;
      stock?: number;
    }) => {
      const newProds = getLocalNewProducts();
      const isNew = newProds.some(p => p.sku === variables.id);

      if (isNew) {
        // Edit in new products list
        const updated = newProds.map(p => {
          if (p.sku === variables.id) {
            return {
              ...p,
              name: variables.name,
              sku: variables.sku,
              category_id: variables.category_name.toLowerCase().replace(/\s+/g, '-'),
              category_name: variables.category_name,
              costPrice: Number(variables.costPrice || 0),
              salePrice: Number(variables.salePrice || 0),
              stock: variables.stock !== undefined ? Number(variables.stock) : p.stock,
              brand: detectBrand(variables.name)
            } as Product;
          }
          return p;
        });
        saveLocalNewProducts(updated);
      } else {
        // Save to modifications list
        const mods = getLocalModifications();
        mods[variables.id] = {
          name: variables.name,
          sku: variables.sku,
          category_id: variables.category_name.toLowerCase().replace(/\s+/g, '-'),
          category_name: variables.category_name,
          costPrice: Number(variables.costPrice || 0),
          salePrice: Number(variables.salePrice || 0),
          brand: detectBrand(variables.name)
        };
        if (variables.stock !== undefined) {
          mods[variables.id].stock = Number(variables.stock);
        }
        saveLocalModifications(mods);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  // 5. Delete Product
  const deleteProduct = useMutation({
    mutationFn: async (sku: string) => {
      const newProds = getLocalNewProducts();
      const isNew = newProds.some(p => p.sku === sku);

      if (isNew) {
        // Remove from new products
        const filtered = newProds.filter(p => p.sku !== sku);
        saveLocalNewProducts(filtered);
      } else {
        // Set deleted = true in modifications
        const mods = getLocalModifications();
        mods[sku] = { ...mods[sku], deleted: true };
        saveLocalModifications(mods);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  return {
    products: productsQuery.data || [],
    categories: categoriesQuery.data || [],
    isLoading: productsQuery.isLoading || categoriesQuery.isLoading,
    isError: productsQuery.isError || categoriesQuery.isError,
    error: productsQuery.error || categoriesQuery.error,
    createProduct,
    updateProduct,
    deleteProduct
  };
}
