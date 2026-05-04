"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck,
  BarChart3, Settings, LogOut, Boxes, FileText, Search,
} from "lucide-react";
import { useState } from "react";

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
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[240px] flex-col bg-white md:flex" style={{ borderRight: '1px solid rgb(var(--border))' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: 'rgb(var(--accent))' }}>
          <Package className="h-5 w-5" style={{ color: 'rgb(var(--text-on-accent))' }} />
        </div>
        <span className="text-xl font-extrabold tracking-tight">Stockly</span>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'rgb(var(--text-dim))' }} />
          <input
            type="text"
            placeholder="Buscar..."
            className="bento-input py-2 pl-9 pr-3 text-xs"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-1">
        {navSections.map((section) => (
          <div key={section.label} className="mb-2">
            <div className="px-4 pb-1 pt-4 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgb(var(--text-dim))' }}>
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href}
                  className={`nav-item mb-0.5 ${isActive ? "active" : ""}`}>
                  <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-2xl p-3" style={{ background: 'rgb(var(--bg-base))' }}>
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold" style={{ background: 'rgb(var(--accent))', color: 'rgb(var(--text-on-accent))' }}>
            A
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">Admin</div>
            <div className="text-[11px]" style={{ color: 'rgb(var(--text-dim))' }}>Owner</div>
          </div>
          <button style={{ color: 'rgb(var(--text-dim))' }} className="transition-colors hover:text-red-500">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function BottomTabs() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur-md md:hidden">
      <div className="flex items-stretch">
        {bottomTabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link key={tab.href} href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? "font-bold" : ""
              }`}
              style={{ color: isActive ? 'rgb(var(--text-primary))' : 'rgb(var(--text-dim))' }}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${isActive ? "" : ""}`}
                style={isActive ? { background: 'rgb(var(--accent))' } : {}}>
                <tab.icon className="h-4 w-4" style={isActive ? { color: 'rgb(var(--text-on-accent))' } : {}} />
              </div>
              <span>{tab.label}</span>
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
      <main className="min-h-screen pb-24 transition-all md:ml-[240px] md:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
      <BottomTabs />
    </div>
  );
}
