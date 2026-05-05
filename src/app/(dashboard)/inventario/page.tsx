"use client";

import { useState } from "react";
import { demoProducts, CATEGORIES } from "@/lib/demo-data";
import { Search, Package, ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";

interface Movement { id:string; sku:string; product:string; type:"entrada"|"salida"|"ajuste"; qty:number; date:string; note:string; }

const demoMovements:Movement[] = [
  { id:"1", sku:"SKU-737498-M", product:"AeroLens PR-891", type:"entrada", qty:20, date:"2025-08-01", note:"Compra proveedor" },
  { id:"2", sku:"SKU-914414-Y", product:"ClearVue NV-321", type:"salida", qty:5, date:"2025-08-02", note:"Venta #1024" },
  { id:"3", sku:"SKU-881599-D", product:"PrismCraft OF-52", type:"ajuste", qty:-2, date:"2025-08-03", note:"Inventario físico" },
  { id:"4", sku:"SKU-608931-U", product:"FocusLine VX-911", type:"entrada", qty:50, date:"2025-08-03", note:"Reposición" },
  { id:"5", sku:"SKU-822398-F", product:"LuxSight AX-3842", type:"salida", qty:3, date:"2025-08-04", note:"Venta #1025" },
  { id:"6", sku:"SKU-338820-G", product:"FrameLab AX-88", type:"salida", qty:4, date:"2025-08-04", note:"Venta #1026" },
  { id:"7", sku:"SKU-777374-B", product:"OptiZen AX-4323", type:"entrada", qty:30, date:"2025-08-05", note:"Compra proveedor" },
  { id:"8", sku:"SKU-919331-A", product:"LuxSight PR-1149", type:"ajuste", qty:0, date:"2025-08-05", note:"Producto agotado confirmado" },
];

export default function InventarioPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");

  const lowStock = demoProducts.filter(p=>p.stock>0&&p.stock<=10);
  const outStock = demoProducts.filter(p=>p.outOfStock);
  const totalUnits = demoProducts.reduce((s,p)=>s+p.stock,0);

  const filteredMov = demoMovements.filter(m =>
    (!search || m.product.toLowerCase().includes(search.toLowerCase()) || m.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--bg-dark))]">Inventario</h1>
        <p className="text-sm font-medium" style={{color:'rgb(var(--text-secondary))'}}>Control de stock y movimientos</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="bento-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[rgb(var(--cyan-dim))] flex items-center justify-center text-[rgb(var(--blue-deep))]"><Package className="h-6 w-6"/></div>
          <div><div className="stat-value text-[rgb(var(--bg-dark))]">{totalUnits.toLocaleString()}</div><div className="stat-label">Unidades totales</div></div>
        </div>
        <div className="bento-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[rgb(var(--amber-dim))] flex items-center justify-center text-[rgb(var(--amber-main))]"><AlertTriangle className="h-6 w-6"/></div>
          <div><div className="stat-value text-[rgb(var(--amber-main))]">{lowStock.length}</div><div className="stat-label">Stock bajo (≤10)</div></div>
        </div>
        <div className="bento-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[rgb(var(--red-dim))] flex items-center justify-center text-[rgb(var(--red-main))]"><Package className="h-6 w-6"/></div>
          <div><div className="stat-value text-[rgb(var(--red-main))]">{outStock.length}</div><div className="stat-label">Agotados</div></div>
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
              {lowStock.length===0?<p className="text-white/40 text-sm py-4 text-center">Todo en orden ✅</p>:
                lowStock.map(p=>(
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
              {CATEGORIES.slice(0,6).map(cat => {
                const units = demoProducts.filter(p=>p.category===cat).reduce((s,p)=>s+p.stock,0);
                const pct = totalUnits>0?(units/totalUnits*100):0;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="w-24 text-xs font-medium text-[rgb(var(--text-secondary))] truncate">{cat}</span>
                    <div className="flex-1 h-6 rounded-lg overflow-hidden bg-[rgb(var(--bg-input))]">
                      <div className="h-full rounded-lg bg-[rgb(var(--bg-dark))] flex items-center justify-end pr-2" style={{width:`${Math.max(pct,8)}%`}}>
                        <span className="text-[10px] font-bold text-white">{units}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
