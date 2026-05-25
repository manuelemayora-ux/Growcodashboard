"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { useProductos } from "@/hooks/useProductos";
import { ArrowUpRight, Download } from "lucide-react";

export default function ReportesPage() {
  const { stats, isLoading: statsLoading } = useDashboard();
  const { products, isLoading: productsLoading } = useProductos();

  const isLoading = statsLoading || productsLoading;

  const avgPrice = products.length > 0 
    ? products.reduce((s, p) => s + p.salePrice, 0) / products.length 
    : 0;

  const avgMargin = products.length > 0 
    ? products.reduce((s, p) => s + (p.salePrice > 0 ? ((p.salePrice - p.costPrice) / p.salePrice * 100) : 0), 0) / products.length 
    : 0;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[rgb(var(--cyan))] border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm font-semibold" style={{color:'rgb(var(--text-secondary))'}}>Cargando analíticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--bg-dark))]">Reportes</h1>
          <p className="text-sm font-medium" style={{color:'rgb(var(--text-secondary))'}}>Analíticas y métricas del inventario</p>
        </div>
        <button className="btn-dark text-sm"><Download className="h-4 w-4"/>Exportar</button>
      </div>

      <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bento-cyan relative overflow-hidden p-4 sm:p-6 rounded-2xl sm:rounded-[24px]">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/20 blur-2xl rounded-full"></div>
          <div className="relative z-10">
            <div className="stat-label text-white/80">Valor Total Inventario</div>
            <div className="stat-value font-mono-price text-white text-xl sm:text-2xl lg:text-3xl mt-2">
              ${stats.inventoryValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        <div className="bento-card p-4 sm:p-6 rounded-2xl sm:rounded-[24px]">
          <div className="stat-label">Valor de Venta</div>
          <div className="stat-value font-mono-price text-[rgb(var(--bg-dark))] text-xl sm:text-2xl lg:text-3xl mt-2">
            ${stats.retailValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bento-card p-4 sm:p-6 rounded-2xl sm:rounded-[24px]">
          <div className="stat-label">Precio Promedio</div>
          <div className="stat-value font-mono-price text-[rgb(var(--bg-dark))] text-xl sm:text-2xl lg:text-3xl mt-2">
            ${avgPrice.toFixed(2)}
          </div>
        </div>
        <div className="bento-accent p-4 sm:p-6 rounded-2xl sm:rounded-[24px]">
          <div className="stat-label text-[rgb(var(--text-on-accent))]/70">Margen Promedio</div>
          <div className="stat-value font-mono-price text-[rgb(var(--text-on-accent))] text-xl sm:text-2xl lg:text-3xl mt-2">
            {avgMargin.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Top 10 Productos */}
        <div className="bento-card p-4 sm:p-6 rounded-2xl sm:rounded-[24px] min-w-0 w-full">
          <div className="mb-4 flex items-center justify-between min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-[rgb(var(--bg-dark))] truncate flex-1 min-w-0">Top 10 Productos (Mayor Valor)</h2>
          </div>
          <div className="space-y-3">
            {products.length === 0 ? (
              <p className="text-center py-6 text-xs font-semibold" style={{color:'rgb(var(--text-dim))'}}>Sin productos registrados</p>
            ) : (
              [...products]
                .sort((a, b) => (b.salePrice * b.stock) - (a.salePrice * a.stock))
                .slice(0, 10)
                .map((p, i) => {
                  const val = p.salePrice * p.stock;
                  const max = products.reduce((m, x) => Math.max(m, x.salePrice * x.stock), 1);
                  return (
                    <div key={p.id} className="flex items-center gap-3 min-w-0">
                      <span className="w-6 text-center text-xs font-black text-[rgb(var(--text-dim))] flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-2 min-w-0">
                          <span className="text-sm font-semibold truncate text-[rgb(var(--bg-dark))] flex-1 min-w-0">{p.name}</span>
                          <span className="font-mono-price text-xs font-bold text-[rgb(var(--cyan-bright))] flex-shrink-0">${val.toLocaleString()}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[rgb(var(--bg-input))] overflow-hidden">
                          <div className="h-full rounded-full bg-[rgb(var(--bg-dark))]" style={{ width: `${(val / max) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Por Categoría */}
        <div className="bento-card p-4 sm:p-6 rounded-2xl sm:rounded-[24px] min-w-0 w-full">
          <h2 className="text-sm sm:text-base font-bold text-[rgb(var(--bg-dark))] mb-4 truncate">Distribución por Categoría</h2>
          <div className="space-y-4">
            {stats.byCategory.length === 0 ? (
              <p className="text-center py-6 text-xs font-semibold" style={{color:'rgb(var(--text-dim))'}}>Sin datos de categorías</p>
            ) : (
              stats.byCategory.map((cat) => {
                const maxStock = stats.totalStock || 1;
                const pct = (cat.stock / maxStock) * 100;
                const val = products
                  .filter(p => p.category_name === cat.name)
                  .reduce((s, p) => s + (p.salePrice * p.stock), 0);
                return (
                  <div key={cat.name} className="min-w-0">
                    <div className="flex justify-between items-center mb-1 gap-2 min-w-0">
                      <span className="text-sm font-semibold text-[rgb(var(--bg-dark))] truncate flex-1 min-w-0">{cat.name}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-bold text-[rgb(var(--text-dim))]">{cat.count} prod</span>
                        <span className="font-mono-price text-xs font-bold text-[rgb(var(--cyan-bright))]">${val.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-3 rounded-full bg-[rgb(var(--bg-input))] overflow-hidden">
                      <div className="h-full rounded-full glass-cyan" style={{ width: `${Math.max(pct, 3)}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Márgenes */}
        <div className="bento-card p-4 sm:p-6 rounded-2xl sm:rounded-[24px] min-w-0 w-full">
          <h2 className="text-sm sm:text-base font-bold text-[rgb(var(--bg-dark))] mb-4 truncate">Mejores Márgenes</h2>
          <div className="space-y-2">
            {products.length === 0 ? (
              <p className="text-center py-6 text-xs font-semibold" style={{color:'rgb(var(--text-dim))'}}>Sin productos registrados</p>
            ) : (
              [...products]
                .sort((a, b) => {
                  const marginA = a.salePrice > 0 ? (a.salePrice - a.costPrice) / a.salePrice : 0;
                  const marginB = b.salePrice > 0 ? (b.salePrice - b.costPrice) / b.salePrice : 0;
                  return marginB - marginA;
                })
                .slice(0, 8)
                .map(p => {
                  const m = p.salePrice > 0 ? ((p.salePrice - p.costPrice) / p.salePrice * 100) : 0;
                  return (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-[rgb(var(--border))] last:border-0 gap-2 min-w-0">
                      <div className="min-w-0 flex-1 pr-1">
                        <div className="text-sm font-semibold text-[rgb(var(--bg-dark))] truncate">{p.name}</div>
                        <div className="text-[11px] text-[rgb(var(--text-dim))]">${p.costPrice.toFixed(2)} → ${p.salePrice.toFixed(2)}</div>
                      </div>
                      <span className="inline-flex items-center gap-0.5 font-mono-price text-sm font-black text-[rgb(var(--green-main))] flex-shrink-0">
                        <ArrowUpRight className="h-3 w-3" />{m.toFixed(1)}%
                      </span>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
