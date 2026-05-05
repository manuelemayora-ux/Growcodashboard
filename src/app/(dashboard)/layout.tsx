"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck,
  BarChart3, Settings, LogOut, Boxes, FileText, Search,
} from "lucide-react";

const navSections = [
  {
    label: "Principal",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/ventas", icon: ShoppingCart, label: "Nueva Venta" },
    ],
  },
  {
    label: "Inventario",
    items: [
      { href: "/productos", icon: Package, label: "Productos" },
      { href: "/inventario", icon: Boxes, label: "Inventario" },
    ],
  },
  {
    label: "Operaciones",
    items: [
      { href: "/clientes", icon: Users, label: "Clientes" },
      { href: "/compras", icon: Truck, label: "Compras" },
      { href: "/proveedores", icon: FileText, label: "Proveedores" },
    ],
  },
  {
    label: "Análisis",
    items: [
      { href: "/reportes", icon: BarChart3, label: "Reportes" },
      { href: "/configuracion", icon: Settings, label: "Config" },
    ],
  },
];

const bottomTabs = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Inicio" },
  { href: "/productos", icon: Package, label: "Productos" },
  { href: "/ventas", icon: ShoppingCart, label: "Venta" },
  { href: "/clientes", icon: Users, label: "Clientes" },
  { href: "/reportes", icon: BarChart3, label: "Reportes" },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] flex-col bg-white md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]" style={{ borderRight: '1px solid rgb(var(--border))' }}>
      {/* Minimalist Logo 2.png */}
      <div className="flex items-center gap-4 px-6 py-8">
        <Image src="/2.png" alt="Growco Logo" width={48} height={48} className="object-contain" priority />
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight leading-none text-[rgb(var(--bg-dark))]">GROWCO</span>
          <span className="text-[10px] font-bold tracking-widest text-[rgb(var(--cyan-bright))] uppercase mt-0.5">Stockly</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'rgb(var(--text-dim))' }} />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full rounded-[16px] border bg-[rgb(var(--bg-input))] px-4 py-3 pl-11 text-sm outline-none transition-all font-medium focus:border-[rgb(var(--cyan))] focus:shadow-[0_0_0_3px_rgba(0,209,255,0.12)]"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-2">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            <div className="px-4 pb-2 pt-2 text-[11px] font-black uppercase tracking-[0.15em]" style={{ color: 'rgb(var(--text-dim))' }}>
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all cursor-pointer select-none mb-1 ${
                    isActive 
                      ? "bg-[rgb(var(--bg-dark))] text-[rgb(var(--text-on-dark))] shadow-lg shadow-[rgba(12,15,30,0.2)]" 
                      : "text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-muted))] hover:text-[rgb(var(--text-primary))]"
                  }`}>
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-6">
        <div className="flex items-center gap-3 rounded-2xl p-4 bg-[rgb(var(--bg-input))] border border-[rgb(var(--border))] hover:border-[rgb(var(--cyan-dim))] transition-colors cursor-pointer">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[14px] text-base font-black glass-cyan text-white shadow-md">
            A
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-[rgb(var(--bg-dark))]">Administrador</div>
            <div className="text-[11px] font-semibold tracking-wide uppercase text-[rgb(var(--cyan-bright))]">Owner</div>
          </div>
          <button style={{ color: 'rgb(var(--text-dim))' }} className="transition-colors hover:text-[rgb(var(--red-main))]">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function BottomTabs() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur-md md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex items-stretch px-2 py-1">
        {bottomTabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link key={tab.href} href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-bold transition-all ${
                isActive ? "text-[rgb(var(--bg-dark))]" : "text-[rgb(var(--text-dim))]"
              }`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${
                isActive ? "glass-cyan text-white shadow-[0_4px_12px_rgba(0,209,255,0.3)]" : "hover:bg-[rgb(var(--bg-muted))]"
              }`}>
                <tab.icon className="h-5 w-5" />
              </div>
              <span className="mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'rgb(var(--bg-base))' }}>
      <Sidebar />
      <main className="min-h-screen pb-24 transition-all md:ml-[280px] md:pb-0">
        {/* Mobile Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[rgb(var(--border))] md:hidden sticky top-0 z-30 shadow-sm">
           <div className="flex items-center gap-2">
             <Image src="/2.png" alt="Growco Logo" width={28} height={28} className="object-contain" />
             <span className="font-black text-[rgb(var(--bg-dark))]">GROWCO</span>
           </div>
           <div className="flex h-8 w-8 items-center justify-center rounded-xl glass-cyan text-white text-xs font-bold">A</div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8 md:px-10 md:py-10">
          {children}
        </div>
      </main>
      <BottomTabs />
    </div>
  );
}
