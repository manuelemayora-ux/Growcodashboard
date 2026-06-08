"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { Package, TrendingUp, AlertTriangle, DollarSign, ArrowUpRight, ShoppingCart, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

export default function DashboardPage() {
  const { stats, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[rgb(var(--cyan))] border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm font-semibold" style={{color:'rgb(var(--text-secondary))'}}>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--bg-dark))]">Dashboard</h1>
          <p className="text-sm font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>Resumen general del inventario</p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button className="pill-tab active">Hoy</button>
          <button className="pill-tab">7 días</button>
          <button className="pill-tab">30 días</button>
        </div>
      </div>

      {/* Bento Grid — Row 1: 5 stat cards */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Productos — Dark block */}
        <div className="bento-dark flex flex-col justify-between hover:shadow-lg transition-all p-4 sm:p-6 rounded-2xl sm:rounded-[24px]">
          <div className="flex items-center justify-between">
            <span className="stat-label opacity-60">Total Productos</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
              <Package className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="stat-value text-white text-xl sm:text-2xl lg:text-3xl">{stats.totalProducts}</div>
            <div className="mt-1 text-xs font-medium text-white/50 truncate">{stats.totalStock.toLocaleString()} uds</div>
          </div>
        </div>

        {/* Valor Inventario — Growco Cyan Glass */}
        <div className="bento-cyan flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,209,255,0.3)] p-4 sm:p-6 rounded-2xl sm:rounded-[24px]">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[rgb(var(--cyan-bright))] blur-2xl opacity-40 rounded-full"></div>
          <div className="flex items-center justify-between relative z-10">
            <span className="stat-label text-white/80">Valor Inventario</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <div className="stat-value font-mono-price text-white text-xl sm:text-2xl lg:text-3xl">${stats.inventoryValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
            <div className="mt-1 text-xs font-medium text-white/70 truncate">Costo invertido</div>
          </div>
        </div>

        {/* Utilidad Potencial — White block with Lime */}
        <div className="bento-card flex flex-col justify-between hover:shadow-md transition-all p-4 sm:p-6 rounded-2xl sm:rounded-[24px]">
          <div className="flex items-center justify-between">
            <span className="stat-label">Utilidad Potencial</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[rgb(var(--accent-dim))]">
              <TrendingUp className="h-4 w-4 text-[rgb(var(--green-main))]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="stat-value font-mono-price text-[rgb(var(--bg-dark))] text-xl sm:text-2xl lg:text-3xl">
              ${stats.potentialProfit.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs font-bold text-[rgb(var(--green-main))] truncate">
              <ArrowUpRight className="h-3 w-3 shrink-0" /> Venta − Costo
            </div>
          </div>
        </div>

        {/* Obsolescencia — White block with Purple/Gray */}
        <div className="bento-card flex flex-col justify-between hover:shadow-md transition-all p-4 sm:p-6 rounded-2xl sm:rounded-[24px]">
          <div className="flex items-center justify-between">
            <span className="stat-label text-[rgb(var(--text-secondary))]">Obsolescencia</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[rgb(var(--bg-input))]">
              <Clock className="h-4 w-4 text-[rgb(var(--text-secondary))]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="stat-value text-[rgb(var(--bg-dark))] text-xl sm:text-2xl lg:text-3xl">{stats.obsoleteCount}</div>
            <div className="mt-1 flex items-center gap-1 text-xs font-medium text-[rgb(var(--text-dim))] truncate">
              Sin ventas {'>'} 90 días
            </div>
          </div>
        </div>

        {/* Alertas — Muted */}
        <div className="bento-muted flex flex-col justify-between hover:shadow-md transition-all p-4 sm:p-6 rounded-2xl sm:rounded-[24px]">
          <div className="flex items-center justify-between">
            <span className="stat-label">Alertas Stock</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm">
              <AlertTriangle className="h-4 w-4 text-[rgb(var(--amber-main))]" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-4">
            <div>
              <span className="stat-value text-[rgb(var(--red-main))] text-xl sm:text-2xl lg:text-3xl">{stats.outOfStock}</span>
              <span className="ml-1 text-xs font-medium text-[rgb(var(--text-secondary))]">agots.</span>
            </div>
            <div>
              <span className="stat-value text-[rgb(var(--amber-main))] text-xl sm:text-2xl lg:text-3xl">{stats.lowStock}</span>
              <span className="ml-1 text-xs font-medium text-[rgb(var(--text-secondary))]">bajos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid — Row 2: Proyecciones & Reabastecimiento */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        {/* Proyección Inventario (Meses) */}
        <div className="bento-card">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-bold text-[rgb(var(--bg-dark))]">Proyección de Inventario (Meses)</h2>
            <span className="badge-pill badge-cyan">Por Categoría</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.projectionsByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'rgb(var(--text-secondary))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'rgb(var(--text-secondary))' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="monthsOfInventory" name="Meses de Stock" radius={[4, 4, 0, 0]}>
                  {stats.projectionsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.monthsOfInventory <= 3 ? 'rgb(var(--amber-main))' : 'rgb(var(--cyan))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alertas de Reorden */}
        <div className="bento-card border-[rgb(var(--amber-main))] border overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[rgb(var(--amber-main))] opacity-10 blur-2xl rounded-full"></div>
          <div className="mb-5 flex items-center gap-2 relative z-10">
            <ShoppingCart className="h-5 w-5 text-[rgb(var(--amber-main))]" />
            <h2 className="text-base font-bold text-[rgb(var(--bg-dark))]">Stock bajo Generar orden de compra</h2>
          </div>
          <p className="text-xs font-medium text-[rgb(var(--text-secondary))] mb-4 relative z-10">
            Volumen para 3 meses (Lead time + stock seguro).
          </p>
          <div className="space-y-3 relative z-10 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {stats.reorderAlerts.length === 0 ? (
              <p className="py-6 text-center text-sm font-medium text-[rgb(var(--text-dim))]">Sin alertas de reorden por ahora.</p>
            ) : (
              stats.reorderAlerts.map((alert) => (
                <div key={alert.name} className="flex items-center justify-between p-3 rounded-xl bg-[rgb(var(--bg-input))]">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="truncate text-sm font-bold text-[rgb(var(--bg-dark))]">{alert.name}</div>
                    <div className="text-xs font-medium text-[rgb(var(--text-secondary))] mt-0.5">Dura: {alert.monthsOfInventory} meses</div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="text-sm font-black text-[rgb(var(--bg-dark))]">Comprar: {alert.suggestedOrderQty}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bento Grid — Row 3: Categories + Low Stock */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr] mt-4">
        {/* Categorías — White card */}
        <div className="bento-card">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-bold text-[rgb(var(--bg-dark))]">Productos por Categoría</h2>
            <span className="badge-pill badge-dark">{stats.byCategory.length} categorías</span>
          </div>
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {stats.byCategory.length === 0 ? (
              <div className="text-center py-10 text-sm font-semibold" style={{color:'rgb(var(--text-dim))'}}>
                Aún no hay categorías con stock registrado
              </div>
            ) : (
              stats.byCategory.map((cat) => {
                const maxCount = stats.byCategory[0]?.count || 1;
                const pct = (cat.count / maxCount) * 100;
                return (
                  <div key={cat.name} className="flex items-center gap-4">
                    <span className="w-28 text-sm font-medium text-[rgb(var(--text-secondary))] truncate">{cat.name}</span>
                    <div className="flex-1 h-8 rounded-xl overflow-hidden bg-[rgb(var(--bg-input))]">
                      <div
                        className={`h-full rounded-xl transition-all flex items-center justify-end pr-3 ${pct === 100 ? 'glass-cyan' : 'bg-[rgb(var(--bg-dark))]'}`}
                        style={{ width: `${Math.max(pct, 15)}%` }}
                      >
                        <span className="text-xs font-bold text-white">{cat.count}</span>
                      </div>
                    </div>
                    <span className="font-mono-price text-xs font-medium w-14 text-right text-[rgb(var(--text-dim))]">{cat.stock} uds</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Stock Bajo — Dark card */}
        <div className="bento-dark relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[rgb(var(--accent))] blur-[60px] opacity-10 rounded-full"></div>
          <div className="relative z-10">
            <div className="mb-5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[rgb(var(--accent))] animate-pulse"></div>
              <h2 className="text-base font-bold text-white">Stock Crítico</h2>
            </div>
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {stats.lowStockProducts.length === 0 ? (
                <p className="py-8 text-center text-sm font-medium text-white/50">✅ Inventario saludable</p>
              ) : (
                stats.lowStockProducts.map((p) => (
                  <div key={p.sku} className="flex items-center justify-between rounded-2xl p-3.5 transition-colors bg-[rgb(var(--bg-dark-card))] border border-[rgb(var(--border-dark))]">
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="truncate text-sm font-semibold text-white">{p.name}</div>
                      <div className="text-xs font-medium text-white/50 mt-0.5">{p.category_name}</div>
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
      </div>

      {/* Bento Grid — Row 4: Top Productos */}
      <div className="mt-4 bento-card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-[rgb(var(--bg-dark))]">Top Productos por Precio</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgb(var(--border))]">
                <th className="stat-label py-3 px-2 text-left">Producto</th>
                <th className="stat-label py-3 px-2 text-left">Categoría</th>
                <th className="stat-label py-3 px-2 text-left">SKU</th>
                <th className="stat-label py-3 px-2 text-right">Costo</th>
                <th className="stat-label py-3 px-2 text-right">Precio</th>
                <th className="stat-label py-3 px-2 text-right">Margen</th>
                <th className="stat-label py-3 px-2 text-right">Stock</th>
              </tr>
            </thead>
            <tbody>
              {stats.topExpensive.map((p) => {
                const margin = p.salePrice > 0 ? ((p.salePrice - p.costPrice) / p.salePrice * 100) : 0;
                return (
                  <tr key={p.id} className="transition-colors hover:bg-[rgb(var(--bg-input))] border-b border-[rgb(var(--border))] last:border-0">
                    <td className="py-4 px-2 font-semibold text-[rgb(var(--bg-dark))]">{p.name}</td>
                    <td className="py-4 px-2"><span className="badge-pill badge-cyan">{p.category_name}</span></td>
                    <td className="py-4 px-2 font-mono-price text-xs font-medium text-[rgb(var(--text-secondary))]">{p.sku}</td>
                    <td className="py-4 px-2 font-mono-price text-right font-medium">${p.costPrice.toFixed(2)}</td>
                    <td className="py-4 px-2 font-mono-price text-right font-extrabold text-[rgb(var(--bg-dark))]">${p.salePrice.toFixed(2)}</td>
                    <td className="py-4 px-2 text-right">
                      <span className="inline-flex items-center gap-0.5 font-mono-price text-xs font-bold text-[rgb(var(--cyan-bright))]">
                        <ArrowUpRight className="h-3 w-3" />{margin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-2 font-mono-price text-right font-semibold text-[rgb(var(--bg-dark))]">{p.stock}</td>
                  </tr>
                );
              })}
              {stats.topExpensive.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm font-semibold" style={{color:'rgb(var(--text-dim))'}}>
                    No hay productos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
