"use client";

import { useState } from "react";
import Image from "next/image";
import { Save, Store, Globe, Shield } from "lucide-react";

export default function ConfigPage() {
  const [storeName, setStoreName] = useState("Óptica Demo");
  const [storeEmail, setStoreEmail] = useState("admin@optica.com");
  const [currency, setCurrency] = useState("GTQ");
  const [taxRate, setTaxRate] = useState("13");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000); };

  return (
    <div className="animate-fade-up max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--bg-dark))]">Configuración</h1>
        <p className="text-sm font-medium" style={{color:'rgb(var(--text-secondary))'}}>Ajusta los parámetros de tu sistema</p>
      </div>

      <div className="space-y-6">
        {/* Empresa */}
        <div className="bento-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl glass-cyan flex items-center justify-center text-white"><Store className="h-5 w-5"/></div>
            <h2 className="text-lg font-bold text-[rgb(var(--bg-dark))]">Datos de la Empresa</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="stat-label mb-1.5 block">Nombre del Negocio</label><input value={storeName} onChange={e=>setStoreName(e.target.value)} className="bento-input"/></div>
            <div><label className="stat-label mb-1.5 block">Email de Contacto</label><input type="email" value={storeEmail} onChange={e=>setStoreEmail(e.target.value)} className="bento-input"/></div>
          </div>
          <div className="mt-4">
            <label className="stat-label mb-1.5 block">Logo Actual</label>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[rgb(var(--bg-muted))]">
              <Image src="/SaaSystem/2.png" alt="Logo" width={48} height={48} className="object-contain"/>
              <div><div className="text-sm font-bold text-[rgb(var(--bg-dark))]">2.png</div><div className="text-xs text-[rgb(var(--text-dim))]">Logo minimalista Growco</div></div>
            </div>
          </div>
        </div>

        {/* Moneda & Impuestos */}
        <div className="bento-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[rgb(var(--accent))] flex items-center justify-center text-[rgb(var(--text-on-accent))]"><Globe className="h-5 w-5"/></div>
            <h2 className="text-lg font-bold text-[rgb(var(--bg-dark))]">Moneda & Impuestos</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="stat-label mb-1.5 block">Moneda</label>
              <select value={currency} onChange={e=>setCurrency(e.target.value)} className="bento-input">
                <option value="GTQ">GTQ - Quetzal</option>
                <option value="USD">USD - Dólar</option>
                <option value="MXN">MXN - Peso Mexicano</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
            <div>
              <label className="stat-label mb-1.5 block">Tasa de Impuesto (%)</label>
              <input type="number" value={taxRate} onChange={e=>setTaxRate(e.target.value)} className="bento-input font-mono-price"/>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="bento-dark relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[rgb(var(--cyan))] blur-[60px] opacity-10 rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white"><Shield className="h-5 w-5"/></div>
              <h2 className="text-lg font-bold text-white">Seguridad & Accesos</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div><div className="text-sm font-bold text-white">Autenticación</div><div className="text-xs text-white/50">Supabase Auth con Email</div></div>
                <span className="badge-pill badge-green">Activa</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div><div className="text-sm font-bold text-white">Row Level Security</div><div className="text-xs text-white/50">Aislamiento de datos por tenant</div></div>
                <span className="badge-pill badge-green">Habilitado</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div><div className="text-sm font-bold text-white">Roles de Usuario</div><div className="text-xs text-white/50">Owner, Admin, Vendedor</div></div>
                <span className="badge-pill badge-cyan">3 roles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button onClick={handleSave} className={`btn-primary text-base px-8 py-3 transition-all ${saved?"bg-[rgb(var(--green-main))]":""}`}>
            <Save className="h-4 w-4"/>
            {saved?"¡Guardado!":"Guardar Configuración"}
          </button>
        </div>
      </div>
    </div>
  );
}
