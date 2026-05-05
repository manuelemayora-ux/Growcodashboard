"use client";

import { demoProducts, getDashboardStats, CATEGORIES, BRANDS } from "@/lib/demo-data";
import { BarChart3, TrendingUp, Package, DollarSign, ArrowUpRight, Download } from "lucide-react";

export default function ReportesPage() {
  const stats = getDashboardStats(demoProducts);
  const avgPrice = demoProducts.reduce((s,p)=>s+p.salePrice,0)/demoProducts.length;
  const avgMargin = demoProducts.reduce((s,p)=>s+((p.salePrice-p.costPrice)/p.salePrice*100),0)/demoProducts.length;

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--bg-dark))]">Reportes</h1>
          <p className="text-sm font-medium" style={{color:'rgb(var(--text-secondary))'}}>Analíticas y métricas del inventario</p>
        </div>
        <button className="btn-dark text-sm"><Download className="h-4 w-4"/>Exportar</button>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bento-cyan relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/20 blur-2xl rounded-full"></div>
          <div className="relative z-10"><div className="stat-label text-white/80">Valor Total Inventario</div><div className="stat-value font-mono-price text-white mt-2">${stats.inventoryValue.toLocaleString("en-US",{minimumFractionDigits:2})}</div></div>
        </div>
        <div className="bento-card">
          <div className="stat-label">Valor de Venta</div>
          <div className="stat-value font-mono-price text-[rgb(var(--bg-dark))] mt-2">${stats.retailValue.toLocaleString("en-US",{minimumFractionDigits:2})}</div>
        </div>
        <div className="bento-card">
          <div className="stat-label">Precio Promedio</div>
          <div className="stat-value font-mono-price text-[rgb(var(--bg-dark))] mt-2">${avgPrice.toFixed(2)}</div>
        </div>
        <div className="bento-accent">
          <div className="stat-label text-[rgb(var(--text-on-accent))]/70">Margen Promedio</div>
          <div className="stat-value font-mono-price text-[rgb(var(--text-on-accent))] mt-2">{avgMargin.toFixed(1)}%</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top 10 Productos */}
        <div className="bento-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-[rgb(var(--bg-dark))]">Top 10 Productos (Mayor Valor en Stock)</h2>
          </div>
          <div className="space-y-3">
            {[...demoProducts].sort((a,b)=>(b.salePrice*b.stock)-(a.salePrice*a.stock)).slice(0,10).map((p,i)=>{
              const val = p.salePrice*p.stock;
              const max = demoProducts.reduce((m,x)=>Math.max(m,x.salePrice*x.stock),0);
              return (
                <div key={p.sku} className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-black text-[rgb(var(--text-dim))]">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1"><span className="text-sm font-semibold truncate text-[rgb(var(--bg-dark))]">{p.name}</span><span className="font-mono-price text-xs font-bold text-[rgb(var(--cyan-bright))]">${val.toLocaleString()}</span></div>
                    <div className="h-2 rounded-full bg-[rgb(var(--bg-input))] overflow-hidden"><div className="h-full rounded-full bg-[rgb(var(--bg-dark))]" style={{width:`${(val/max)*100}%`}}/></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Por Categoría */}
        <div className="bento-card">
          <h2 className="font-bold text-[rgb(var(--bg-dark))] mb-4">Distribución por Categoría</h2>
          <div className="space-y-4">
            {stats.byCategory.map(cat => {
              const pct = stats.totalStock>0?(cat.stock/stats.totalStock*100):0;
              const val = demoProducts.filter(p=>p.category===cat.name).reduce((s,p)=>s+(p.salePrice*p.stock),0);
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
                    <div className="h-full rounded-full glass-cyan" style={{width:`${Math.max(pct,3)}%`}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Por Marca */}
        <div className="bento-dark relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[rgb(var(--cyan))] blur-[60px] opacity-10 rounded-full"></div>
          <div className="relative z-10">
            <h2 className="font-bold text-white mb-4">Productos por Marca</h2>
            <div className="grid grid-cols-2 gap-3">
              {stats.byBrand.map(b => (
                <div key={b.name} className="flex items-center justify-between bg-white/5 rounded-2xl p-3 border border-white/5">
                  <span className="text-sm font-semibold text-white">{b.name}</span>
                  <span className="badge-pill badge-lime">{b.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Márgenes */}
        <div className="bento-card">
          <h2 className="font-bold text-[rgb(var(--bg-dark))] mb-4">Mejores Márgenes</h2>
          <div className="space-y-2">
            {[...demoProducts].sort((a,b)=>((b.salePrice-b.costPrice)/b.salePrice)-((a.salePrice-a.costPrice)/a.salePrice)).slice(0,8).map(p=>{
              const m = ((p.salePrice-p.costPrice)/p.salePrice*100);
              return (
                <div key={p.sku} className="flex items-center justify-between py-2 border-b border-[rgb(var(--border))] last:border-0">
                  <div className="min-w-0 flex-1 pr-3"><div className="text-sm font-semibold text-[rgb(var(--bg-dark))] truncate">{p.name}</div><div className="text-[11px] text-[rgb(var(--text-dim))]">${p.costPrice.toFixed(2)} → ${p.salePrice.toFixed(2)}</div></div>
                  <span className="inline-flex items-center gap-0.5 font-mono-price text-sm font-black text-[rgb(var(--green-main))]"><ArrowUpRight className="h-3 w-3"/>{m.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
