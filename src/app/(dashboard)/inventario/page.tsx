"use client";

import { useState } from "react";
import { useInventario } from "@/hooks/useInventario";
import { Search, Package, ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";

export default function InventarioPage() {
  const { movements, summary, isLoading } = useInventario();
  const [search, setSearch] = useState("");

  const filteredMov = movements.filter(m =>
    !search || 
    m.product.toLowerCase().includes(search.toLowerCase()) || 
    m.sku.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[rgb(var(--cyan))] border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm font-semibold" style={{color:'rgb(var(--text-secondary))'}}>Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--bg-dark))]">Inventario</h1>
        <p className="text-sm font-medium" style={{color:'rgb(var(--text-secondary))'}}>Control de stock y movimientos</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="bento-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[rgb(var(--cyan-dim))] flex items-center justify-center text-[rgb(var(--blue-deep))]"><Package className="h-6 w-6"/></div>
          <div><div className="stat-value text-[rgb(var(--bg-dark))]">{summary.totalUnits.toLocaleString()}</div><div className="stat-label">Unidades totales</div></div>
        </div>
        <div className="bento-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[rgb(var(--amber-dim))] flex items-center justify-center text-[rgb(var(--amber-main))]"><AlertTriangle className="h-6 w-6"/></div>
          <div><div className="stat-value text-[rgb(var(--amber-main))]">{summary.lowStockCount}</div><div className="stat-label">Stock bajo (≤10)</div></div>
        </div>
        <div className="bento-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[rgb(var(--red-dim))] flex items-center justify-center text-[rgb(var(--red-main))]"><Package className="h-6 w-6"/></div>
          <div><div className="stat-value text-[rgb(var(--red-main))]">{summary.outOfStockCount}</div><div className="stat-label">Agotados</div></div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:'rgb(var(--text-dim))'}}/>
              <input type="text" placeholder="Buscar movimiento..." value={search} onChange={e=>setSearch(e.target.value)} className="bento-input pl-11"/>
            </div>
          </div>

          <div className="bento-card p-0 overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{borderBottom:'1px solid rgb(var(--border))'}}>
              <h2 className="font-bold text-[rgb(var(--bg-dark))]">Movimientos Recientes</h2>
              <span className="badge-pill badge-dark">{filteredMov.length}</span>
            </div>
            <div className="divide-y divide-[rgb(var(--border))]">
              {filteredMov.map(m => (
                <div key={m.id} className="px-5 py-4 flex items-center gap-4 hover:bg-[rgb(var(--bg-base))] transition-colors">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    m.type==="entrada"?"bg-[rgb(var(--green-dim))] text-[rgb(var(--green-main))]":
                    m.type==="salida"?"bg-[rgb(var(--red-dim))] text-[rgb(var(--red-main))]":
                    "bg-[rgb(var(--amber-dim))] text-[rgb(var(--amber-main))]"
                  }`}>
                    {m.type==="entrada"?<ArrowDown className="h-5 w-5"/>:m.type==="salida"?<ArrowUp className="h-5 w-5"/>:<ArrowUpDown className="h-5 w-5"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[rgb(var(--bg-dark))] truncate">{m.product}</div>
                    <div className="text-xs font-medium text-[rgb(var(--text-dim))]">{m.note} · {m.date}</div>
                  </div>
                  <div className={`font-mono-price font-bold text-sm ${m.type==="entrada"?"text-[rgb(var(--green-main))]":m.type==="salida"?"text-[rgb(var(--red-main))]":"text-[rgb(var(--amber-main))]"}`}>
                    {m.type==="entrada"?"+":m.qty<0?"":"−"}{Math.abs(m.qty)} uds
                  </div>
                </div>
              ))}
              {filteredMov.length === 0 && (
                <div className="px-5 py-10 text-center text-sm font-semibold" style={{color:'rgb(var(--text-dim))'}}>
                  No hay movimientos registrados
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bento-dark relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[rgb(var(--accent))] blur-[60px] opacity-10 rounded-full"></div>
            <div className="relative z-10">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[rgb(var(--accent))] animate-pulse"></div> Stock Crítico
              </h3>
              {summary.lowStockProducts.length===0?<p className="text-white/40 text-sm py-4 text-center">Todo en orden ✅</p>:
                summary.lowStockProducts.map(p=>(
                  <div key={p.sku} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                    <div className="min-w-0 flex-1 pr-2"><div className="truncate text-sm font-semibold text-white">{p.name}</div><div className="text-[11px] text-white/40">{p.category}</div></div>
                    <span className={`badge-pill ${p.stock<=5?"badge-red":"badge-amber"}`}>{p.stock}</span>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="bento-card">
            <h3 className="text-base font-bold text-[rgb(var(--bg-dark))] mb-4">Stock por Categoría</h3>
            <div className="space-y-3">
              {summary.stockByCategory.length === 0 ? (
                <p className="text-center text-xs font-semibold py-4" style={{color:'rgb(var(--text-dim))'}}>Sin productos en stock</p>
              ) : (
                summary.stockByCategory.slice(0,6).map(cat => {
                  const pct = summary.totalUnits>0?(cat.stock/summary.totalUnits*100):0;
                  return (
                    <div key={cat.name} className="flex items-center gap-3">
                      <span className="w-24 text-xs font-medium text-[rgb(var(--text-secondary))] truncate">{cat.name}</span>
                      <div className="flex-1 h-6 rounded-lg overflow-hidden bg-[rgb(var(--bg-input))]">
                        <div className="h-full rounded-lg bg-[rgb(var(--bg-dark))] flex items-center justify-end pr-2" style={{width:`${Math.max(pct,8)}%`}}>
                          <span className="text-[10px] font-bold text-white">{cat.stock}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
