"use client";

import { useState, useMemo } from "react";
import { demoProducts, CATEGORIES } from "@/lib/demo-data";
import { Search, Plus, ArrowUpRight } from "lucide-react";

export default function ProductosPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");

  const filtered = useMemo(() => {
    return demoProducts.filter((p) => {
      const matchesSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCat = !categoryFilter || p.category === categoryFilter;
      const matchesStock = stockFilter === "all" ||
        (stockFilter === "out" && p.outOfStock) ||
        (stockFilter === "low" && p.stock > 0 && p.stock <= 10);
      return matchesSearch && matchesCat && matchesStock;
    });
  }, [search, categoryFilter, stockFilter]);

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Productos</h1>
          <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>{demoProducts.length} productos registrados</p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'rgb(var(--text-dim))' }} />
          <input type="text" placeholder="Buscar por nombre o SKU..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="bento-input pl-11" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="bento-input w-auto min-w-[160px]">
          <option value="">Todas las categorías</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1">
          {[
            { v: "all" as const, l: "Todos" },
            { v: "low" as const, l: "Stock bajo" },
            { v: "out" as const, l: "Agotados" },
          ].map(f => (
            <button key={f.v} onClick={() => setStockFilter(f.v)}
              className={`pill-tab text-xs ${stockFilter === f.v ? "active" : ""}`}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bento-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgb(var(--border))' }}>
                <th className="stat-label px-5 py-3.5 text-left">Producto</th>
                <th className="stat-label px-5 py-3.5 text-left">Categoría</th>
                <th className="stat-label px-5 py-3.5 text-left">SKU</th>
                <th className="stat-label px-5 py-3.5 text-right">Costo</th>
                <th className="stat-label px-5 py-3.5 text-right">Precio</th>
                <th className="stat-label px-5 py-3.5 text-right">Margen</th>
                <th className="stat-label px-5 py-3.5 text-right">Stock</th>
                <th className="stat-label px-5 py-3.5 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const margin = ((p.salePrice - p.costPrice) / p.salePrice * 100);
                return (
                  <tr key={p.sku} className="cursor-pointer transition-colors hover:bg-[rgb(var(--bg-base))]" style={{ borderBottom: '1px solid rgb(var(--border))' }}>
                    <td className="px-5 py-3.5 font-semibold">{p.name}</td>
                    <td className="px-5 py-3.5"><span className="badge-pill badge-blue">{p.category}</span></td>
                    <td className="px-5 py-3.5 font-mono-price text-xs" style={{ color: 'rgb(var(--text-dim))' }}>{p.sku}</td>
                    <td className="px-5 py-3.5 font-mono-price text-right">${p.costPrice.toFixed(2)}</td>
                    <td className="px-5 py-3.5 font-mono-price text-right font-bold">${p.salePrice.toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-0.5 font-mono-price text-xs font-bold" style={{ color: 'rgb(var(--green-main))' }}>
                        <ArrowUpRight className="h-3 w-3" />{margin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono-price text-right">{p.stock}</td>
                    <td className="px-5 py-3.5 text-center">
                      {p.outOfStock ? (
                        <span className="badge-pill badge-red">Agotado</span>
                      ) : p.stock <= 10 ? (
                        <span className="badge-pill badge-amber">Bajo</span>
                      ) : (
                        <span className="badge-pill badge-green">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
