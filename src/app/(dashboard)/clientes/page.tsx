"use client";

import { useState } from "react";
import { useClientes } from "@/hooks/useClientes";
import { Search, Plus, Phone, MapPin, MoreHorizontal, Save, User, X } from "lucide-react";

export default function ClientesPage() {
  const { customers, isLoading, createCustomer } = useClientes();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", phone:"", address:"" });

  const filtered = customers.filter(c => 
    !search || 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const save = async () => {
    if(!form.name) return;
    try {
      await createCustomer.mutateAsync(form);
      setShowModal(false);
      setForm({ name:"", email:"", phone:"", address:"" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert("Error al guardar cliente: " + msg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[rgb(var(--cyan))] border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm font-semibold" style={{color:'rgb(var(--text-secondary))'}}>Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--bg-dark))]">Clientes</h1>
          <p className="text-sm font-medium" style={{color:'rgb(var(--text-secondary))'}}>{customers.length} clientes registrados</p>
        </div>
        <button onClick={()=>{setForm({name:"",email:"",phone:"",address:""});setShowModal(true)}} className="btn-primary"><Plus className="h-4 w-4"/>Nuevo Cliente</button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:'rgb(var(--text-dim))'}}/>
        <input type="text" placeholder="Buscar por nombre o email..." value={search} onChange={e=>setSearch(e.target.value)} className="bento-input pl-11"/>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(c => (
          <div key={c.id} className="bento-card hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[rgb(var(--bg-dark))] flex items-center justify-center text-white font-bold text-sm shrink-0">{c.name.charAt(0)}</div>
                <div><div className="font-bold text-[rgb(var(--bg-dark))]">{c.name}</div><div className="text-xs text-[rgb(var(--text-dim))]">{c.email}</div></div>
              </div>
              <button className="text-[rgb(var(--text-dim))] hover:text-[rgb(var(--bg-dark))] opacity-0 group-hover:opacity-100 transition-all"><MoreHorizontal className="h-5 w-5"/></button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-[rgb(var(--text-secondary))]"><Phone className="h-3.5 w-3.5 shrink-0"/>{c.phone || "Sin teléfono"}</div>
              <div className="flex items-center gap-2 text-[rgb(var(--text-secondary))]"><MapPin className="h-3.5 w-3.5 shrink-0"/>{c.address || "Sin dirección"}</div>
            </div>
            <div className="mt-4 pt-4 flex items-center justify-between" style={{borderTop:'1px solid rgb(var(--border))'}}>
              <div><div className="font-mono-price font-bold text-[rgb(var(--bg-dark))]">${c.totalPurchases.toLocaleString()}</div><div className="text-[10px] text-[rgb(var(--text-dim))] font-bold uppercase">Total compras</div></div>
              <span className="badge-pill badge-cyan">{c.lastPurchase}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3 text-center py-10 text-sm font-semibold" style={{color:'rgb(var(--text-dim))'}}>
            No se encontraron clientes
          </div>
        )}
      </div>

      {showModal&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={()=>setShowModal(false)}>
          <div className="bento-card w-full max-w-md p-8 animate-fade-up shadow-2xl rounded-[32px]" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowModal(false)} className="absolute right-6 top-6 text-[rgb(var(--text-dim))] hover:text-[rgb(var(--red-main))]"><X className="h-5 w-5"/></button>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl glass-cyan flex items-center justify-center text-white"><User className="h-5 w-5"/></div>
              <h2 className="text-xl font-black text-[rgb(var(--bg-dark))]">Nuevo Cliente</h2>
            </div>
            <div className="space-y-4">
              <div><label className="stat-label mb-1.5 block">Nombre</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="bento-input" placeholder="Empresa o persona"/></div>
              <div><label className="stat-label mb-1.5 block">Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="bento-input" placeholder="correo@ejemplo.com"/></div>
              <div><label className="stat-label mb-1.5 block">Teléfono</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="bento-input" placeholder="+502 0000-0000"/></div>
              <div><label className="stat-label mb-1.5 block">Dirección</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="bento-input" placeholder="Ciudad, País"/></div>
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
