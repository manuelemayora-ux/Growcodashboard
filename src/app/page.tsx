import Link from "next/link";
import {
  Package, BarChart3, ShoppingCart, Shield, Zap, ArrowRight,
  Check, Boxes, Users, FileText, Settings, Palette,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'rgb(var(--bg-base))' }}>
      {/* ---- HEADER ---- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md" style={{ borderBottom: '1px solid rgb(var(--border))' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl glass-cyan">
              <div className="text-white font-extrabold text-sm tracking-tighter">G</div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight leading-none text-[rgb(var(--bg-dark))]">GROWCO</span>
              <span className="text-[9px] font-bold tracking-widest text-[rgb(var(--cyan-bright))] uppercase mt-0.5">Stockly</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-medium sm:block transition-colors hover:text-[rgb(var(--cyan-bright))]" style={{ color: 'rgb(var(--text-secondary))' }}>
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
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium glass-cyan text-white shadow-md">
            <span className="flex h-2 w-2 rounded-full" style={{ background: 'rgb(var(--accent))' }} />
            Sistema de inventario premium
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl text-[rgb(var(--bg-dark))]">
            Potencia tu operación con
            <br />
            <span style={{ color: 'rgb(var(--text-dim))' }}>tecnología de clase mundial.</span>
            <br />
            <span className="inline-block rounded-2xl px-5 py-2 mt-2 bg-[rgb(var(--accent))] text-[rgb(var(--text-on-accent))] shadow-lg">
              Listo para implementar.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg" style={{ color: 'rgb(var(--text-secondary))' }}>
            Desarrollamos e implementamos un sistema completo de inventario y ventas 
            adaptado a las necesidades específicas de tu negocio. Con la potencia de <strong className="text-[rgb(var(--bg-dark))]">Growco</strong>, 
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
            <h2 className="text-2xl font-extrabold md:text-3xl text-[rgb(var(--bg-dark))]">Esto es lo que tu empresa recibe</h2>
            <p className="mt-2" style={{ color: 'rgb(var(--text-secondary))' }}>
              Sistema completo, adaptado a tu giro de negocio, desplegado y funcionando
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Featured card — Cyan Glass */}
            <div className="bento-cyan lg:col-span-2 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[rgb(var(--cyan-bright))] blur-3xl opacity-30 rounded-full"></div>
              <div className="relative z-10">
                <span className="badge-pill badge-lime mb-4">Adaptable a tu giro</span>
                <h3 className="text-2xl font-extrabold text-white mt-2">
                  Diseño de élite por Growco
                </h3>
                <p className="mt-3 text-white/80 max-w-lg font-medium leading-relaxed">
                  Colores, logo, y flujos adaptados a tu operación. 
                  Distribuidora, óptica, ferretería, boutique — 
                  cada vertical tiene sus propios campos y lógica.
                </p>
              </div>
              <div className="mt-6 flex gap-2 flex-wrap relative z-10">
                <span className="badge-pill bg-white text-[rgb(var(--blue-deep))]">Ópticas</span>
                <span className="badge-pill glass-cyan">Llantas</span>
                <span className="badge-pill glass-cyan">Ferreterías</span>
                <span className="badge-pill glass-cyan">Boutiques</span>
              </div>
            </div>

            {/* Accent card */}
            <div className="bento-accent flex flex-col justify-between min-h-[220px]">
              <Palette className="h-8 w-8 text-[rgb(var(--text-on-accent))]" />
              <div>
                <h3 className="text-xl font-extrabold mt-4">Tu marca, tu sistema</h3>
                <p className="mt-2 text-sm font-medium opacity-80">
                  No es un software genérico. Es TU herramienta con la identidad visual y calidad de Growco.
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
            <h2 className="text-2xl font-extrabold md:text-3xl text-[rgb(var(--bg-dark))]">Módulos incluidos</h2>
            <p className="mt-2" style={{ color: 'rgb(var(--text-secondary))' }}>
              Todo lo que necesitas para operar desde el día 1
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Package, title: "Inventario", desc: "Control multi-bodega con alertas de stock bajo y seguimiento en tiempo real.", tag: "Core" },
              { icon: ShoppingCart, title: "Punto de Venta", desc: "POS rápido con búsqueda por código, múltiples formas de pago y recibos.", tag: "Core" },
              { icon: BarChart3, title: "Reportes", desc: "Dashboard con métricas del día, productos top, márgenes y analíticas profundas.", tag: "Analíticas" },
              { icon: Shield, title: "Seguridad Growco", desc: "Arquitectura segura, aislamiento de datos y respaldos automáticos.", tag: "Seguridad" },
              { icon: Users, title: "Clientes", desc: "Base de datos de clientes con historial de compras y perfiles.", tag: "CRM" },
              { icon: Boxes, title: "Multi-Sucursal", desc: "Administra múltiples tiendas y bodegas con transferencias de stock.", tag: "Operaciones" },
            ].map((m, i) => (
              <div key={i} className="bento-card group transition-all hover:shadow-md hover:border-[rgb(var(--cyan-dim))]" style={{ cursor: 'default' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--cyan-dim))] text-[rgb(var(--blue-deep))]">
                    <m.icon className="h-5 w-5" />
                  </div>
                  <span className="badge-pill badge-dark">{m.tag}</span>
                </div>
                <h3 className="text-base font-bold text-[rgb(var(--bg-dark))]">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgb(var(--text-secondary))' }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- WHAT'S INCLUDED ---- */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="bento-dark p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[rgb(var(--cyan))] to-transparent opacity-10 rounded-full blur-3xl"></div>
            <h2 className="text-2xl font-extrabold text-white md:text-3xl mb-8 relative z-10">
              ¿Qué incluye la implementación?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 relative z-10">
              {[
                "Sistema web completo y funcional",
                "Diseño premium por Growco",
                "Base de datos segura en la nube",
                "Multi-usuario con roles y permisos",
                "Datos protegidos por empresa (RLS)",
                "Integraciones API listas",
                "Capacitación de uso intensiva",
                "Soporte técnico experto",
                "Panel de administración central",
                "Responsive (funciona en celular)",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--accent))]">
                    <Check className="h-4 w-4 text-[rgb(var(--text-on-accent))]" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="px-6 py-16 mb-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-[32px] p-12 relative overflow-hidden glass-cyan border border-[rgba(0,209,255,0.3)] shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--blue-deep))] to-[rgb(var(--cyan))] opacity-90"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold md:text-4xl text-white tracking-tight">
                Experimenta el estándar Growco
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base text-white/90 font-medium">
                Explorá el sistema con datos de demo. Todo lo que ves se puede adaptar milimétricamente a tu negocio.
              </p>
              <Link href="/login" className="btn-lime mt-8 inline-flex text-base px-8 py-4 shadow-lg">
                Explorar Demo
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="px-6 py-8 bg-white border-t border-[rgb(var(--border))]">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg glass-cyan">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            <span className="font-extrabold text-[rgb(var(--bg-dark))]">Growco</span>
          </div>
          <p className="text-xs font-medium" style={{ color: 'rgb(var(--text-dim))' }}>
            © {new Date().getFullYear()} Growco AI · Innovation Labs
          </p>
        </div>
      </footer>
    </div>
  );
}
