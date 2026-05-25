"use client";

import { useState } from "react";
import { useProveedores } from "@/hooks/useProveedores";
import { Search, Plus, Building2, Save, X } from "lucide-react";

export default function ProveedoresPage() {
  const { suppliers, isLoading, createSupplier } = useProveedores();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:"", contact:"", email:"", phone:"" });

  const filtered = suppliers.filter(s => 
    !search || 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.contact.toLowerCase().includes(search.toLowerCase())
  );

  const save = async () => {
    if(!form.name) return;
    try {
      await createSupplier.mutateAsync(form);
      setShowModal(false);
      setForm({ name:"", contact:"", email:"", phone:"" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert("Error al guardar proveedor: " + msg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[rgb(var(--cyan))] border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm font-semibold" style={{color:'rgb(var(--text-secondary))'}}>Cargando proveedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--bg-dark))]">Proveedores</h1>
          <p className="text-sm font-medium" style={{color:'rgb(var(--text-secondary))'}}>{suppliers.length} proveedores registrados</p>
        </div>
        <button onClick={()=>{setForm({name:"",contact:"",email:"",phone:""});setShowModal(true)}} className="btn-primary"><Plus className="h-4 w-4"/>Nuevo Proveedor</button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:'rgb(var(--text-dim))'}}/>
        <input type="text" placeholder="Buscar proveedor..." value={search} onChange={e=>setSearch(e.target.value)} className="bento-input pl-11"/>
      </div>

      <div className="bento-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{borderBottom:'1px solid rgb(var(--border))'}}>
                <th className="stat-label px-5 py-3.5 text-left">Empresa</th>
                <th className="stat-label px-5 py-3.5 text-left">Contacto</th>
                <th className="stat-label px-5 py-3.5 text-left">Email</th>
                <th className="stat-label px-5 py-3.5 text-left">Teléfono</th>
                <th className="stat-label px-5 py-3.5 text-center">Productos</th>
                <th className="stat-label px-5 py-3.5 text-center">Último Pedido</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-[rgb(var(--bg-base))] transition-colors" style={{borderBottom:'1px solid rgb(var(--border))'}}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-[rgb(var(--cyan-dim))] flex items-center justify-center text-[rgb(var(--blue-deep))] shrink-0"><Building2 className="h-4 w-4"/></div>
                      <span className="font-bold text-[rgb(var(--bg-dark))]">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[rgb(var(--text-secondary))]">{s.contact || "Sin contacto"}</td>
                  <td className="px-5 py-4 text-[rgb(var(--text-dim))]">{s.email || "Sin email"}</td>
                  <td className="px-5 py-4 text-[rgb(var(--text-secondary))]">{s.phone || "Sin teléfono"}</td>
                  <td className="px-5 py-4 text-center"><span className="badge-pill badge-dark">{s.products}</span></td>
                  <td className="px-5 py-4 text-center"><span className="badge-pill badge-cyan">{s.lastOrder}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm font-semibold" style={{color:'rgb(var(--text-dim))'}}>
                    No se encontraron proveedores
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={()=>setShowModal(false)}>
          <div className="bento-card w-full max-w-md p-8 animate-fade-up shadow-2xl rounded-[32px]" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowModal(false)} className="absolute right-6 top-6 text-[rgb(var(--text-dim))] hover:text-[rgb(var(--red-main))]"><X className="h-5 w-5"/></button>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl glass-cyan flex items-center justify-center text-white"><Building2 className="h-5 w-5"/></div>
              <h2 className="text-xl font-black text-[rgb(var(--bg-dark))]">Nuevo Proveedor</h2>
            </div>
            <div className="space-y-4">
              <div><label className="stat-label mb-1.5 block">Empresa</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="bento-input" placeholder="Nombre de la empresa"/></div>
              <div><label className="stat-label mb-1.5 block">Contacto</label><input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} className="bento-input" placeholder="Persona de contacto"/></div>
              <div><label className="stat-label mb-1.5 block">Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="bento-input" placeholder="email@empresa.com"/></div>
              <div><label className="stat-label mb-1.5 block">Teléfono</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="bento-input" placeholder="+502 0000-0000"/></div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={()=>setShowModal(false)} className="btn-dark py-2.5 px-6 text-sm">Cancelar</button>
              <button onClick={save} className="btn-primary py-2.5 px-6 text-sm"><Save className="h-4 w-4"/>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
