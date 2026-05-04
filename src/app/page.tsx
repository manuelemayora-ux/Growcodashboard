import Link from "next/link";
import Image from "next/image";
import {
  Package, BarChart3, ShoppingCart, Shield, ArrowRight,
  Check, Boxes, Users, Palette,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'rgb(var(--bg-base))' }}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-full max-w-3xl opacity-20 pointer-events-none z-0">
        <Image src="/11.png" alt="Decorative" width={1000} height={1000} className="w-full h-auto object-cover" priority />
      </div>
      
      {/* ---- HEADER ---- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md" style={{ borderBottom: '1px solid rgb(var(--border))' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image src="/6.png" alt="Growco Full Logo" width={140} height={40} className="object-contain h-8 w-auto" />
            <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>
            <span className="text-xs font-bold tracking-widest text-[rgb(var(--cyan-bright))] uppercase hidden sm:block">Stockly</span>
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
      <section className="px-6 pb-16 pt-16 md:pt-24 relative z-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium glass-cyan text-[rgb(var(--bg-dark))] shadow-md border border-[rgba(0,209,255,0.2)]">
                <span className="flex h-2 w-2 rounded-full" style={{ background: 'rgb(var(--accent))' }} />
                Sistema de inventario premium
              </div>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl text-[rgb(var(--bg-dark))]">
                Potencia tu operación con
                <br />
                <span style={{ color: 'rgb(var(--cyan-bright))' }}>tecnología de clase mundial.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg" style={{ color: 'rgb(var(--text-secondary))' }}>
                Desarrollamos e implementamos un sistema completo de inventario y ventas 
                adaptado a las necesidades específicas de tu negocio. Con la potencia de <strong className="text-[rgb(var(--bg-dark))]">Growco</strong>, 
                diseño y funcionalidad a la medida.
              </p>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row">
                <Link href="/login" className="btn-primary text-base px-8 py-3.5">
                  Explorar el Sistema
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#modulos" className="btn-dark px-8 py-3.5 text-base">
                  Ver Módulos
                </a>
              </div>
            </div>
            
            {/* Hero Image - 3D Glass G */}
            <div className="relative flex justify-center lg:justify-end animate-fade-up">
              <div className="absolute inset-0 bg-gradient-to-tr from-[rgb(var(--cyan))] to-transparent opacity-20 blur-[100px] rounded-full"></div>
              <Image src="/12.png" alt="Growco 3D Glass Logo" width={500} height={500} className="w-full max-w-md h-auto object-contain relative z-10 drop-shadow-2xl" priority />
            </div>
          </div>
        </div>
      </section>

      {/* ---- WHAT YOU GET — Bento Grid ---- */}
      <section className="px-6 py-16 relative z-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold md:text-3xl text-[rgb(var(--bg-dark))]">Esto es lo que tu empresa recibe</h2>
            <p className="mt-2" style={{ color: 'rgb(var(--text-secondary))' }}>
              Sistema completo, adaptado a tu giro de negocio, desplegado y funcionando
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Featured card — Cyan Glass */}
            <div className="bento-cyan lg:col-span-2 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[rgb(var(--cyan-bright))] blur-3xl opacity-30 rounded-full"></div>
              
              {/* Decorative element 10 inside the card */}
              <div className="absolute right-0 bottom-0 w-64 h-64 opacity-30 transform translate-x-1/4 translate-y-1/4 pointer-events-none">
                 <Image src="/10.png" alt="Decorative" fill className="object-contain" />
              </div>

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
            <div className="bento-accent flex flex-col justify-between min-h-[260px] relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
              <Palette className="h-8 w-8 text-[rgb(var(--text-on-accent))] relative z-10" />
              <div className="relative z-10">
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
      <section id="modulos" className="px-6 py-16 bg-white border-y border-[rgb(var(--border))]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold md:text-3xl text-[rgb(var(--bg-dark))]">Módulos incluidos</h2>
            <p className="mt-2" style={{ color: 'rgb(var(--text-secondary))' }}>
              Todo lo que necesitas para operar desde el día 1
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Package, title: "Inventario", desc: "Control multi-bodega con alertas de stock bajo y seguimiento en tiempo real.", tag: "Core" },
              { icon: ShoppingCart, title: "Punto de Venta", desc: "POS rápido con búsqueda por código, múltiples formas de pago y recibos.", tag: "Core" },
              { icon: BarChart3, title: "Reportes", desc: "Dashboard con métricas del día, productos top, márgenes y analíticas profundas.", tag: "Analíticas" },
              { icon: Shield, title: "Seguridad Growco", desc: "Arquitectura segura, aislamiento de datos y respaldos automáticos.", tag: "Seguridad" },
              { icon: Users, title: "Clientes", desc: "Base de datos de clientes con historial de compras y perfiles.", tag: "CRM" },
              { icon: Boxes, title: "Multi-Sucursal", desc: "Administra múltiples tiendas y bodegas con transferencias de stock.", tag: "Operaciones" },
            ].map((m, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg-base))] hover:bg-white hover:shadow-xl transition-all hover:border-[rgb(var(--cyan-dim))]" style={{ cursor: 'default' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--cyan-dim))] text-[rgb(var(--blue-deep))]">
                    <m.icon className="h-6 w-6" />
                  </div>
                  <span className="badge-pill badge-dark">{m.tag}</span>
                </div>
                <h3 className="text-lg font-bold text-[rgb(var(--bg-dark))]">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgb(var(--text-secondary))' }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- WHAT'S INCLUDED ---- */}
      <section className="px-6 py-24 relative overflow-hidden">
        {/* Background decorative 10 */}
        <div className="absolute left-0 bottom-0 w-full max-w-2xl opacity-10 pointer-events-none transform -translate-x-1/4 translate-y-1/4">
          <Image src="/10.png" alt="Decorative" width={800} height={800} className="object-contain" />
        </div>

        <div className="mx-auto max-w-4xl relative z-10">
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
      <section className="px-6 pb-24">
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
              <Link href="/login" className="btn-lime mt-8 inline-flex items-center justify-center gap-2 text-base px-8 py-4 shadow-lg w-full sm:w-auto">
                Explorar Demo
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="px-6 py-8 bg-white border-t border-[rgb(var(--border))] relative z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
             <Image src="/2.png" alt="Growco Icon" width={24} height={24} className="object-contain" />
            <span className="font-extrabold text-[rgb(var(--bg-dark))] text-sm">Growco</span>
          </div>
          <p className="text-xs font-medium" style={{ color: 'rgb(var(--text-dim))' }}>
            © {new Date().getFullYear()} Growco AI · Innovation Labs
          </p>
        </div>
      </footer>
    </div>
  );
}
