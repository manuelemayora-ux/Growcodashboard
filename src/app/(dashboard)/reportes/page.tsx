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

      <div className="mb-6 grid grid-cols-4 gap-2 sm:gap-4">
        <div className="bento-cyan relative overflow-hidden !p-3 sm:!p-6 rounded-xl sm:rounded-[24px]">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/20 blur-2xl rounded-full"></div>
          <div className="relative z-10">
            <div className="stat-label !text-[8px] xs:!text-[9px] sm:!text-xs leading-tight text-white/80 truncate">
              <span className="hidden xs:inline">Valor Total Inventario</span>
              <span className="inline xs:hidden">Valor Inv.</span>
            </div>
            <div className="stat-value font-mono-price text-white !text-xs xs:!text-sm sm:!text-2xl lg:!text-3xl mt-2">
              <span className="hidden xs:inline">${stats.inventoryValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
              <span className="inline xs:hidden">${(stats.inventoryValue >= 1000000) ? (stats.inventoryValue / 1000000).toFixed(1).replace(/\.0$/, '') + 'M' : (stats.inventoryValue / 1000).toFixed(0) + 'k'}</span>
            </div>
          </div>
        </div>
        <div className="bento-card !p-3 sm:!p-6 rounded-xl sm:rounded-[24px]">
          <div className="stat-label !text-[8px] xs:!text-[9px] sm:!text-xs leading-tight truncate">
            <span className="hidden xs:inline">Valor de Venta</span>
            <span className="inline xs:hidden">Valor Vta.</span>
          </div>
          <div className="stat-value font-mono-price text-[rgb(var(--bg-dark))] !text-xs xs:!text-sm sm:!text-2xl lg:!text-3xl mt-2">
            <span className="hidden xs:inline">${stats.retailValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
            <span className="inline xs:hidden">${(stats.retailValue >= 1000000) ? (stats.retailValue / 1000000).toFixed(1).replace(/\.0$/, '') + 'M' : (stats.retailValue / 1000).toFixed(0) + 'k'}</span>
          </div>
        </div>
        <div className="bento-card !p-3 sm:!p-6 rounded-xl sm:rounded-[24px]">
          <div className="stat-label !text-[8px] xs:!text-[9px] sm:!text-xs leading-tight truncate">
            <span className="hidden xs:inline">Precio Promedio</span>
            <span className="inline xs:hidden">P. Prom.</span>
          </div>
          <div className="stat-value font-mono-price text-[rgb(var(--bg-dark))] !text-xs xs:!text-sm sm:!text-2xl lg:!text-3xl mt-2">
            <span className="hidden xs:inline">${avgPrice.toFixed(2)}</span>
            <span className="inline xs:hidden">${avgPrice.toFixed(0)}</span>
          </div>
        </div>
        <div className="bento-accent !p-3 sm:!p-6 rounded-xl sm:rounded-[24px]">
          <div className="stat-label !text-[8px] xs:!text-[9px] sm:!text-xs leading-tight text-[rgb(var(--text-on-accent))]/70 truncate">
            <span className="hidden xs:inline">Margen Promedio</span>
            <span className="inline xs:hidden">Margen</span>
          </div>
          <div className="stat-value font-mono-price text-[rgb(var(--text-on-accent))] !text-xs xs:!text-sm sm:!text-2xl lg:!text-3xl mt-2">
            <span className="hidden xs:inline">{avgMargin.toFixed(1)}%</span>
            <span className="inline xs:hidden">{avgMargin.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top 10 Productos */}
        <div className="bento-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-[rgb(var(--bg-dark))]">Top 10 Productos (Mayor Valor en Stock)</h2>
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
                    <div key={p.id} className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs font-black text-[rgb(var(--text-dim))]">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold truncate text-[rgb(var(--bg-dark))]">{p.name}</span>
                          <span className="font-mono-price text-xs font-bold text-[rgb(var(--cyan-bright))]">${val.toLocaleString()}</span>
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
        <div className="bento-card">
          <h2 className="font-bold text-[rgb(var(--bg-dark))] mb-4">Distribución por Categoría</h2>
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
                  <div key={cat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-[rgb(var(--bg-dark))]">{cat.name}</span>
                      <div className="flex items-center gap-3">
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
        <div className="bento-card">
          <h2 className="font-bold text-[rgb(var(--bg-dark))] mb-4">Mejores Márgenes</h2>
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
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-[rgb(var(--border))] last:border-0">
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="text-sm font-semibold text-[rgb(var(--bg-dark))] truncate">{p.name}</div>
                        <div className="text-[11px] text-[rgb(var(--text-dim))]">${p.costPrice.toFixed(2)} → ${p.salePrice.toFixed(2)}</div>
                      </div>
                      <span className="inline-flex items-center gap-0.5 font-mono-price text-sm font-black text-[rgb(var(--green-main))]">
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
