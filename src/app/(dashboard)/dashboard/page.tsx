"use client";

import { demoProducts, getDashboardStats } from "@/lib/demo-data";
import { Package, TrendingUp, AlertTriangle, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function DashboardPage() {
  const stats = getDashboardStats(demoProducts);

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>Resumen general del inventario</p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button className="pill-tab active">Hoy</button>
          <button className="pill-tab">7 días</button>
          <button className="pill-tab">30 días</button>
        </div>
      </div>

      {/* Bento Grid — Row 1: 4 stat cards */}
      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Productos — Dark block */}
        <div className="bento-dark flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="stat-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Total Productos</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Package className="h-4 w-4 text-white/70" />
            </div>
          </div>
          <div className="mt-3">
            <div className="stat-value text-white">{stats.totalProducts}</div>
            <div className="mt-1 text-xs text-white/40">{stats.totalStock.toLocaleString()} unidades en stock</div>
          </div>
        </div>

        {/* Valor Inventario — Accent lime */}
        <div className="bento-accent flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="stat-label" style={{ color: 'rgba(0,0,0,0.5)' }}>Valor Inventario</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: 'rgba(0,0,0,0.1)' }}>
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="stat-value font-mono-price">${stats.inventoryValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <div className="mt-1 text-xs opacity-60">Costo total</div>
          </div>
        </div>

        {/* Utilidad Potencial — White */}
        <div className="bento-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="stat-label">Utilidad Potencial</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: 'rgb(var(--green-dim))' }}>
              <TrendingUp className="h-4 w-4" style={{ color: 'rgb(var(--green-main))' }} />
            </div>
          </div>
          <div className="mt-3">
            <div className="stat-value font-mono-price" style={{ color: 'rgb(var(--green-main))' }}>
              ${stats.potentialProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs" style={{ color: 'rgb(var(--green-main))' }}>
              <ArrowUpRight className="h-3 w-3" /> Venta − Costo
            </div>
          </div>
        </div>

        {/* Alertas — Muted */}
        <div className="bento-muted flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="stat-label">Alertas</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white">
              <AlertTriangle className="h-4 w-4" style={{ color: 'rgb(var(--amber-main))' }} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-4">
            <div>
              <span className="stat-value" style={{ color: 'rgb(var(--red-main))' }}>{stats.outOfStock}</span>
              <span className="ml-1.5 text-xs" style={{ color: 'rgb(var(--text-dim))' }}>agotados</span>
            </div>
            <div>
              <span className="stat-value" style={{ color: 'rgb(var(--amber-main))' }}>{stats.lowStock}</span>
              <span className="ml-1.5 text-xs" style={{ color: 'rgb(var(--text-dim))' }}>bajo stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid — Row 2: Categories + Low Stock */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        {/* Categorías — White card */}
        <div className="bento-card">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-bold">Productos por Categoría</h2>
            <span className="badge-pill badge-dark">{stats.byCategory.length} categorías</span>
          </div>
          <div className="space-y-3">
            {stats.byCategory.map((cat) => {
              const maxCount = stats.byCategory[0].count;
              const pct = (cat.count / maxCount) * 100;
              return (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="w-28 text-sm font-medium truncate">{cat.name}</span>
                  <div className="flex-1 h-8 rounded-xl overflow-hidden" style={{ background: 'rgb(var(--bg-base))' }}>
                    <div
                      className="h-full rounded-xl transition-all flex items-center justify-end pr-3"
                      style={{ width: `${Math.max(pct, 15)}%`, background: pct === 100 ? 'rgb(var(--bg-dark))' : 'rgb(var(--accent))' }}
                    >
                      <span className="text-xs font-bold" style={{ color: pct === 100 ? 'white' : 'rgb(var(--text-on-accent))' }}>{cat.count}</span>
                    </div>
                  </div>
                  <span className="font-mono-price text-xs w-14 text-right" style={{ color: 'rgb(var(--text-dim))' }}>{cat.stock} uds</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stock Bajo — Dark card */}
        <div className="bento-dark">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" style={{ color: 'rgb(var(--accent))' }} />
            <h2 className="text-base font-bold text-white">Stock Bajo</h2>
          </div>
          <div className="space-y-2">
            {stats.lowStockProducts.length === 0 ? (
              <p className="py-8 text-center text-sm text-white/40">✅ Todo el stock está bien</p>
            ) : (
              stats.lowStockProducts.map((p) => (
                <div key={p.sku} className="flex items-center justify-between rounded-2xl p-3 transition-colors" style={{ background: 'rgb(var(--bg-dark-card))' }}>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{p.name}</div>
                    <div className="text-xs text-white/40">{p.category}</div>
                  </div>
                  <div className={`badge-pill ${p.stock <= 5 ? "badge-red" : "badge-amber"}`}>
                    {p.stock} uds
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bento Grid — Row 3: Top Productos */}
      <div className="mt-4 bento-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold">Top Productos por Precio</h2>
          <button className="btn-primary py-2 px-4 text-xs">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgb(var(--border))' }}>
                <th className="stat-label py-3 text-left">Producto</th>
                <th className="stat-label py-3 text-left">Categoría</th>
                <th className="stat-label py-3 text-left">SKU</th>
                <th className="stat-label py-3 text-right">Costo</th>
                <th className="stat-label py-3 text-right">Precio</th>
                <th className="stat-label py-3 text-right">Margen</th>
                <th className="stat-label py-3 text-right">Stock</th>
              </tr>
            </thead>
            <tbody>
              {stats.topExpensive.map((p) => {
                const margin = ((p.salePrice - p.costPrice) / p.salePrice * 100);
                return (
                  <tr key={p.sku} className="transition-colors hover:bg-[rgb(var(--bg-base))]" style={{ borderBottom: '1px solid rgb(var(--border))' }}>
                    <td className="py-3.5 font-semibold">{p.name}</td>
                    <td><span className="badge-pill badge-lime">{p.category}</span></td>
                    <td className="font-mono-price text-xs" style={{ color: 'rgb(var(--text-dim))' }}>{p.sku}</td>
                    <td className="font-mono-price text-right">${p.costPrice.toFixed(2)}</td>
                    <td className="font-mono-price text-right font-bold">${p.salePrice.toFixed(2)}</td>
                    <td className="text-right">
                      <span className="inline-flex items-center gap-0.5 font-mono-price text-xs font-bold" style={{ color: 'rgb(var(--green-main))' }}>
                        <ArrowUpRight className="h-3 w-3" />{margin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="font-mono-price text-right font-medium">{p.stock}</td>
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
