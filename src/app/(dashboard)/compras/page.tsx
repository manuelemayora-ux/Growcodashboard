"use client";

import { useState } from "react";
import { Search, Plus, FileText, Calendar, DollarSign, Truck, Save, X } from "lucide-react";

interface PurchaseOrder { id:string; supplier:string; date:string; items:number; total:number; status:"pendiente"|"recibida"|"parcial"; }

const demoOrders:PurchaseOrder[] = [
  { id:"OC-001", supplier:"Distribuidora Óptica GT", date:"2025-08-01", items:5, total:8500, status:"recibida" },
  { id:"OC-002", supplier:"LensWorld International", date:"2025-07-25", items:12, total:22300, status:"recibida" },
  { id:"OC-003", supplier:"AeroLens Factory", date:"2025-08-03", items:3, total:4200, status:"pendiente" },
  { id:"OC-004", supplier:"SportVision Supply", date:"2025-08-04", items:8, total:11900, status:"parcial" },
  { id:"OC-005", supplier:"Clear Optics MFG", date:"2025-07-18", items:15, total:31500, status:"recibida" },
  { id:"OC-006", supplier:"Distribuidora Óptica GT", date:"2025-08-05", items:6, total:7800, status:"pendiente" },
];

export default function ComprasPage() {
  const [orders] = useState(demoOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all"|"pendiente"|"recibida"|"parcial">("all");

  const filtered = orders.filter(o => {
    const s = !search || o.supplier.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const st = statusFilter==="all" || o.status===statusFilter;
    return s&&st;
  });

  const totalPending = orders.filter(o=>o.status==="pendiente").reduce((s,o)=>s+o.total,0);
  const totalReceived = orders.filter(o=>o.status==="recibida").reduce((s,o)=>s+o.total,0);

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--bg-dark))]">Órdenes de Compra</h1>
          <p className="text-sm font-medium" style={{color:'rgb(var(--text-secondary))'}}>{orders.length} órdenes registradas</p>
        </div>
        <button className="btn-primary"><Plus className="h-4 w-4"/>Nueva Orden</button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="bento-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[rgb(var(--cyan-dim))] flex items-center justify-center text-[rgb(var(--blue-deep))]"><FileText className="h-6 w-6"/></div>
          <div><div className="stat-value text-[rgb(var(--bg-dark))]">{orders.length}</div><div className="stat-label">Total Órdenes</div></div>
        </div>
        <div className="bento-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[rgb(var(--amber-dim))] flex items-center justify-center text-[rgb(var(--amber-main))]"><Truck className="h-6 w-6"/></div>
          <div><div className="stat-value font-mono-price text-[rgb(var(--amber-main))]">${totalPending.toLocaleString()}</div><div className="stat-label">Pendiente</div></div>
        </div>
        <div className="bento-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[rgb(var(--green-dim))] flex items-center justify-center text-[rgb(var(--green-main))]"><DollarSign className="h-6 w-6"/></div>
          <div><div className="stat-value font-mono-price text-[rgb(var(--green-main))]">${totalReceived.toLocaleString()}</div><div className="stat-label">Recibido</div></div>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:'rgb(var(--text-dim))'}}/>
          <input type="text" placeholder="Buscar por proveedor o # orden..." value={search} onChange={e=>setSearch(e.target.value)} className="bento-input pl-11"/>
        </div>
        <div className="flex gap-1">
          {([["all","Todas"],["pendiente","Pendientes"],["recibida","Recibidas"],["parcial","Parciales"]] as const).map(([v,l])=>(
            <button key={v} onClick={()=>setStatusFilter(v)} className={`pill-tab text-xs ${statusFilter===v?"active":""}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="bento-card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{borderBottom:'1px solid rgb(var(--border))'}}>
              <th className="stat-label px-5 py-3.5 text-left"># Orden</th>
              <th className="stat-label px-5 py-3.5 text-left">Proveedor</th>
              <th className="stat-label px-5 py-3.5 text-center">Fecha</th>
              <th className="stat-label px-5 py-3.5 text-center">Items</th>
              <th className="stat-label px-5 py-3.5 text-right">Total</th>
              <th className="stat-label px-5 py-3.5 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="hover:bg-[rgb(var(--bg-base))] transition-colors cursor-pointer" style={{borderBottom:'1px solid rgb(var(--border))'}}>
                <td className="px-5 py-4 font-mono-price font-bold text-[rgb(var(--cyan-bright))]">{o.id}</td>
                <td className="px-5 py-4 font-semibold text-[rgb(var(--bg-dark))]">{o.supplier}</td>
                <td className="px-5 py-4 text-center text-[rgb(var(--text-secondary))]">{o.date}</td>
                <td className="px-5 py-4 text-center"><span className="badge-pill badge-dark">{o.items}</span></td>
                <td className="px-5 py-4 font-mono-price text-right font-bold text-[rgb(var(--bg-dark))]">${o.total.toLocaleString()}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`badge-pill ${o.status==="recibida"?"badge-green":o.status==="pendiente"?"badge-amber":"badge-blue"}`}>
                    {o.status.charAt(0).toUpperCase()+o.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
