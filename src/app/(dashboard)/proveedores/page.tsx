"use client";

import { useState } from "react";
import { Search, Plus, Building2, Mail, Phone, Package, Save, X } from "lucide-react";

interface Supplier { id:string; name:string; contact:string; email:string; phone:string; products:number; lastOrder:string; }

const demoSuppliers:Supplier[] = [
  { id:"1", name:"Distribuidora Óptica GT", contact:"Carlos Méndez", email:"ventas@opticagt.com", phone:"+502 2222-1111", products:15, lastOrder:"2025-08-01" },
  { id:"2", name:"LensWorld International", contact:"Ana Rivera", email:"orders@lensworld.com", phone:"+1 555-0199", products:22, lastOrder:"2025-07-25" },
  { id:"3", name:"AeroLens Factory", contact:"Roberto Sánchez", email:"b2b@aerolens.com", phone:"+52 55-1234-5678", products:8, lastOrder:"2025-07-30" },
  { id:"4", name:"SportVision Supply", contact:"Laura Torres", email:"supply@sportvision.co", phone:"+502 3333-4444", products:12, lastOrder:"2025-08-02" },
  { id:"5", name:"Clear Optics MFG", contact:"David Kim", email:"wholesale@clearoptics.kr", phone:"+82 2-555-0100", products:18, lastOrder:"2025-07-18" },
];

export default function ProveedoresPage() {
  const [suppliers, setSuppliers] = useState(demoSuppliers);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:"", contact:"", email:"", phone:"" });

  const filtered = suppliers.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.contact.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    if(!form.name) return;
    setSuppliers(prev => [{ id:String(Date.now()), ...form, products:0, lastOrder:"-" }, ...prev]);
    setShowModal(false);
    setForm({ name:"", contact:"", email:"", phone:"" });
  };

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
                <td className="px-5 py-4 text-[rgb(var(--text-secondary))]">{s.contact}</td>
                <td className="px-5 py-4 text-[rgb(var(--text-dim))]">{s.email}</td>
                <td className="px-5 py-4 text-[rgb(var(--text-secondary))]">{s.phone}</td>
                <td className="px-5 py-4 text-center"><span className="badge-pill badge-dark">{s.products}</span></td>
                <td className="px-5 py-4 text-center"><span className="badge-pill badge-cyan">{s.lastOrder}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={()=>setShowModal(false)}>
          <div className="bento-card w-full max-w-md p-8 animate-fade-up shadow-2xl rounded-[32px]" onClick={e=>e.stopPropagation()}>
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
