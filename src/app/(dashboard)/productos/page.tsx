"use client";

import { useState, useMemo } from "react";
import { demoProducts, CATEGORIES, ProductData } from "@/lib/demo-data";
import { Search, Plus, ArrowUpRight, Edit3, Trash2, X, Save, Package } from "lucide-react";

export default function ProductosPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState<"all"|"low"|"out">("all");
  const [products, setProducts] = useState<ProductData[]>(demoProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingSku, setEditingSku] = useState<string|null>(null);
  const [form, setForm] = useState({ name:"", category:CATEGORIES[0], sku:"", cost:"", price:"", stock:"" });

  const filtered = useMemo(() => products.filter(p => {
    const s = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const c = !categoryFilter || p.category === categoryFilter;
    const st = stockFilter==="all" || (stockFilter==="out"&&p.outOfStock) || (stockFilter==="low"&&p.stock>0&&p.stock<=10);
    return s&&c&&st;
  }), [search, categoryFilter, stockFilter, products]);

  const openNew = () => { setEditingSku(null); setForm({ name:"", category:CATEGORIES[0], sku:`SKU-${Date.now().toString().slice(-6)}`, cost:"", price:"", stock:"" }); setShowModal(true); };
  const openEdit = (p:ProductData) => { setEditingSku(p.sku); setForm({ name:p.name, category:p.category, sku:p.sku, cost:String(p.costPrice), price:String(p.salePrice), stock:String(p.stock) }); setShowModal(true); };

  const save = () => {
    const c=parseFloat(form.cost), pr=parseFloat(form.price), s=parseInt(form.stock);
    if(!form.name||isNaN(c)||isNaN(pr)||isNaN(s)) return;
    const np:ProductData = { name:form.name, category:form.category, sku:form.sku, costPrice:c, salePrice:pr, stock:s, date:new Date().toISOString().split("T")[0], outOfStock:s===0 };
    setProducts(prev => editingSku ? prev.map(p=>p.sku===editingSku?np:p) : [np,...prev]);
    setShowModal(false);
  };

  const del = (sku:string) => { if(confirm("¿Eliminar producto?")) setProducts(p=>p.filter(x=>x.sku!==sku)); };

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--bg-dark))]">Productos</h1>
          <p className="text-sm font-medium" style={{color:'rgb(var(--text-secondary))'}}>{products.length} productos registrados</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus className="h-4 w-4"/>Nuevo Producto</button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:'rgb(var(--text-dim))'}}/>
          <input type="text" placeholder="Buscar por nombre o SKU..." value={search} onChange={e=>setSearch(e.target.value)} className="bento-input pl-11"/>
        </div>
        <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="bento-input w-auto min-w-[160px]">
          <option value="">Todas las categorías</option>
          {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1">
          {([["all","Todos"],["low","Stock bajo"],["out","Agotados"]] as const).map(([v,l])=>(
            <button key={v} onClick={()=>setStockFilter(v)} className={`pill-tab text-xs ${stockFilter===v?"active":""}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="bento-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{borderBottom:'1px solid rgb(var(--border))'}}>
                <th className="stat-label px-5 py-3.5 text-left">Producto</th>
                <th className="stat-label px-5 py-3.5 text-left">Categoría</th>
                <th className="stat-label px-5 py-3.5 text-left">SKU</th>
                <th className="stat-label px-5 py-3.5 text-right">Costo</th>
                <th className="stat-label px-5 py-3.5 text-right">Precio</th>
                <th className="stat-label px-5 py-3.5 text-right">Margen</th>
                <th className="stat-label px-5 py-3.5 text-right">Stock</th>
                <th className="stat-label px-5 py-3.5 text-center">Estado</th>
                <th className="stat-label px-5 py-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const m = ((p.salePrice-p.costPrice)/p.salePrice*100);
                return (
                  <tr key={p.sku} className="transition-colors hover:bg-[rgb(var(--bg-base))]" style={{borderBottom:'1px solid rgb(var(--border))'}}>
                    <td className="px-5 py-3.5 font-semibold text-[rgb(var(--bg-dark))]">{p.name}</td>
                    <td className="px-5 py-3.5"><span className="badge-pill badge-blue">{p.category}</span></td>
                    <td className="px-5 py-3.5 font-mono-price text-xs" style={{color:'rgb(var(--text-dim))'}}>{p.sku}</td>
                    <td className="px-5 py-3.5 font-mono-price text-right">${p.costPrice.toFixed(2)}</td>
                    <td className="px-5 py-3.5 font-mono-price text-right font-bold">${p.salePrice.toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-0.5 font-mono-price text-xs font-bold" style={{color:'rgb(var(--green-main))'}}><ArrowUpRight className="h-3 w-3"/>{m.toFixed(1)}%</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono-price text-right">{p.stock}</td>
                    <td className="px-5 py-3.5 text-center">
                      {p.outOfStock?<span className="badge-pill badge-red">Agotado</span>:p.stock<=10?<span className="badge-pill badge-amber">Bajo</span>:<span className="badge-pill badge-green">OK</span>}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={()=>openEdit(p)} className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-[rgb(var(--bg-muted))] text-[rgb(var(--text-dim))] hover:text-[rgb(var(--cyan-bright))] transition-colors"><Edit3 className="h-4 w-4"/></button>
                        <button onClick={()=>del(p.sku)} className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-[rgb(var(--red-dim))] text-[rgb(var(--text-dim))] hover:text-[rgb(var(--red-main))] transition-colors"><Trash2 className="h-4 w-4"/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={()=>setShowModal(false)}>
          <div className="bento-card w-full max-w-lg p-8 animate-fade-up shadow-2xl rounded-[32px]" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowModal(false)} className="absolute right-6 top-6 text-[rgb(var(--text-dim))] hover:text-[rgb(var(--red-main))]"><X className="h-5 w-5"/></button>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl glass-cyan flex items-center justify-center text-white"><Package className="h-5 w-5"/></div>
              <h2 className="text-xl font-black text-[rgb(var(--bg-dark))]">{editingSku?"Editar Producto":"Nuevo Producto"}</h2>
            </div>
            <div className="space-y-4">
              <div><label className="stat-label mb-1.5 block">Nombre</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="bento-input" placeholder="ej: AeroLens PR-891"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="stat-label mb-1.5 block">Categoría</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="bento-input">{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label className="stat-label mb-1.5 block">SKU</label><input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} className="bento-input font-mono-price"/></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="stat-label mb-1.5 block">Costo ($)</label><input type="number" step="0.01" value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} className="bento-input font-mono-price" placeholder="0.00"/></div>
                <div><label className="stat-label mb-1.5 block">Precio ($)</label><input type="number" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="bento-input font-mono-price" placeholder="0.00"/></div>
                <div><label className="stat-label mb-1.5 block">Stock</label><input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="bento-input font-mono-price" placeholder="0"/></div>
              </div>
              {form.cost&&form.price&&parseFloat(form.price)>0&&(
                <div className="rounded-2xl bg-[rgb(var(--bg-muted))] p-4 flex justify-between">
                  <span className="text-sm font-bold text-[rgb(var(--text-secondary))]">Margen</span>
                  <span className="font-mono-price font-bold text-[rgb(var(--green-main))]">{(((parseFloat(form.price)-parseFloat(form.cost))/parseFloat(form.price))*100).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={()=>setShowModal(false)} className="btn-dark py-2.5 px-6 text-sm">Cancelar</button>
              <button onClick={save} className="btn-primary py-2.5 px-6 text-sm"><Save className="h-4 w-4"/>{editingSku?"Guardar":"Crear"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
