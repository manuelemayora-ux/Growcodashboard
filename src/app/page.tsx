import Link from "next/link";
import {
  Package, BarChart3, ShoppingCart, Shield, Zap, ArrowRight,
  Check, Boxes, Users, FileText, Settings, Palette,
} from "lucide-react";

/**
 * Landing page — Presentación del servicio
 * Tono: "Esto es lo que podemos implementar para tu empresa"
 * NO es una página de suscripción, es un demo/portafolio
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'rgb(var(--bg-base))' }}>
      {/* ---- HEADER ---- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md" style={{ borderBottom: '1px solid rgb(var(--border))' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgb(var(--accent))' }}>
              <Package className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Stockly</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-medium sm:block" style={{ color: 'rgb(var(--text-secondary))' }}>
              Acceder al Sistema
            </Link>
            <Link href="/login" className="btn-primary py-2 px-5 text-sm">
              Ver Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ---- HERO ---- */}
      <section className="px-6 pb-16 pt-16 md:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium" style={{ background: 'rgb(var(--bg-dark))', color: 'rgb(var(--text-on-dark))' }}>
            <span className="flex h-2 w-2 rounded-full" style={{ background: 'rgb(var(--accent))' }} />
            Sistema listo para implementar
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Tu sistema de inventario
            <br />
            <span style={{ color: 'rgb(var(--text-dim))' }}>personalizado y profesional,</span>
            <br />
            <span className="inline-block rounded-2xl px-4 py-1 mt-1" style={{ background: 'rgb(var(--accent))', color: 'rgb(var(--text-on-accent))' }}>
              listo para operar.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg" style={{ color: 'rgb(var(--text-secondary))' }}>
            Desarrollamos e implementamos un sistema completo de inventario y ventas 
            adaptado a las necesidades específicas de tu negocio. Sin plantillas genéricas — 
            diseño y funcionalidad a la medida.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/login" className="btn-primary text-base px-8 py-3.5">
              Explorar el Sistema
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#modulos" className="btn-dark px-8 py-3.5 text-base">
              Ver Módulos
            </a>
          </div>
        </div>
      </section>

      {/* ---- WHAT YOU GET — Bento Grid ---- */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold md:text-3xl">Esto es lo que tu empresa recibe</h2>
            <p className="mt-2" style={{ color: 'rgb(var(--text-secondary))' }}>
              Sistema completo, adaptado a tu giro de negocio, desplegado y funcionando
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Featured card — Dark */}
            <div className="bento-dark lg:col-span-2 flex flex-col justify-between min-h-[200px]">
              <div>
                <span className="badge-pill badge-lime mb-4">Adaptable a tu giro</span>
                <h3 className="text-2xl font-extrabold text-white mt-2">
                  Diseño personalizado para tu marca
                </h3>
                <p className="mt-3 text-white/60 max-w-lg">
                  Colores, logo, y flujos adaptados a tu operación. 
                  Distribuidora de llantas, óptica, ferretería, boutique — 
                  cada vertical tiene sus propios campos y lógica.
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <span className="badge-pill badge-lime">Ópticas</span>
                <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Llantas</span>
                <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Ferreterías</span>
                <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Boutiques</span>
              </div>
            </div>

            {/* Accent card */}
            <div className="bento-accent flex flex-col justify-between min-h-[200px]">
              <Palette className="h-8 w-8" />
              <div>
                <h3 className="text-xl font-extrabold mt-4">Tu marca, tu sistema</h3>
                <p className="mt-2 text-sm opacity-70">
                  No es un software genérico. Es TU herramienta con TU identidad visual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- MODULES ---- */}
      <section id="modulos" className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold md:text-3xl">Módulos incluidos</h2>
            <p className="mt-2" style={{ color: 'rgb(var(--text-secondary))' }}>
              Todo lo que necesitas para operar desde el día 1
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Package, title: "Inventario", desc: "Control multi-bodega con alertas de stock bajo y seguimiento en tiempo real.", tag: "Core" },
              { icon: ShoppingCart, title: "Punto de Venta", desc: "POS rápido con búsqueda por código, múltiples formas de pago y recibos.", tag: "Core" },
              { icon: BarChart3, title: "Reportes", desc: "Dashboard con métricas del día, productos top, márgenes y libro de IVA.", tag: "Analíticas" },
              { icon: Shield, title: "Facturación DTE", desc: "Documentos tributarios electrónicos para El Salvador: Facturas, CCF, NC.", tag: "Fiscal" },
              { icon: Users, title: "Clientes", desc: "Base de datos de clientes con historial de compras y crédito.", tag: "CRM" },
              { icon: Boxes, title: "Multi-Sucursal", desc: "Administra múltiples tiendas y bodegas con transferencias de stock.", tag: "Operaciones" },
            ].map((m, i) => (
              <div key={i} className="bento-card group transition-all hover:-translate-y-1" style={{ cursor: 'default' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgb(var(--bg-base))' }}>
                    <m.icon className="h-5 w-5" style={{ color: 'rgb(var(--text-primary))' }} />
                  </div>
                  <span className="badge-pill badge-dark">{m.tag}</span>
                </div>
                <h3 className="text-base font-bold">{m.title}</h3>
                <p className="mt-2 text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- WHAT'S INCLUDED ---- */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="bento-dark p-10 md:p-14">
            <h2 className="text-2xl font-extrabold text-white md:text-3xl mb-8">
              ¿Qué incluye la implementación?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Sistema web completo y funcional",
                "Diseño personalizado a tu marca",
                "Base de datos segura en la nube",
                "Multi-usuario con roles y permisos",
                "Datos protegidos por empresa (RLS)",
                "Configuración fiscal salvadoreña",
                "Capacitación de uso",
                "Soporte técnico post-implementación",
                "Panel de administración",
                "Responsive (funciona en celular)",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: 'rgb(var(--accent))' }}>
                    <Check className="h-3.5 w-3.5" style={{ color: 'rgb(var(--text-on-accent))' }} />
                  </div>
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-[32px] p-12" style={{ background: 'rgb(var(--accent))' }}>
            <h2 className="text-2xl font-extrabold md:text-3xl" style={{ color: 'rgb(var(--text-on-accent))' }}>
              ¿Listo para ver cómo funciona?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: 'rgba(0,0,0,0.6)' }}>
              Explorá el sistema con datos de demo. Todo lo que ves se puede adaptar a tu negocio.
            </p>
            <Link href="/login" className="btn-dark mt-8 inline-flex text-base px-8 py-3.5">
              Explorar Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="px-6 py-8" style={{ borderTop: '1px solid rgb(var(--border))' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgb(var(--accent))' }}>
              <Package className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold">Stockly</span>
          </div>
          <p className="text-xs" style={{ color: 'rgb(var(--text-dim))' }}>
            Desarrollado a medida · El Salvador
          </p>
        </div>
      </footer>
    </div>
  );
}
