import Link from "next/link";
import Image from "next/image";
import {
  Package, BarChart3, ShoppingCart, Shield, ArrowRight,
  Check, Boxes, Users, Palette,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'rgb(var(--bg-base))' }}>
      {/* MASSIVE Decorative background elements */}
      <div className="absolute top-0 right-0 w-[1200px] h-[1200px] opacity-40 pointer-events-none z-0 transform translate-x-1/4 -translate-y-1/4">
        <Image src="/11.png" alt="Decorative" width={1200} height={1200} className="w-full h-full object-contain mix-blend-multiply" priority />
      </div>
      
      {/* ---- HEADER ---- */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-[rgba(255,255,255,0.5)] shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            {/* Minimalist Logo 2.png */}
            <div className="flex items-center gap-3">
              <Image src="/2.png" alt="Growco Logo" width={36} height={36} className="object-contain" priority />
              <span className="text-2xl font-black tracking-tight text-[rgb(var(--bg-dark))]">GROWCO</span>
            </div>
            <div className="h-8 w-px bg-gray-300 mx-2 hidden sm:block"></div>
            <span className="text-sm font-extrabold tracking-[0.2em] text-[rgb(var(--cyan-bright))] uppercase hidden sm:block">Stockly</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden text-base font-semibold sm:block transition-colors hover:text-[rgb(var(--cyan-bright))]" style={{ color: 'rgb(var(--text-secondary))' }}>
              Acceder al Sistema
            </Link>
            <Link href="/login" className="btn-primary py-3 px-8 text-base shadow-lg shadow-[rgba(0,209,255,0.3)]">
              Ver Demo
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ---- HERO ---- */}
      <section className="px-6 pb-24 pt-20 md:pt-32 relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-20">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm font-bold glass-cyan text-[rgb(var(--bg-dark))] shadow-lg border border-[rgba(0,209,255,0.3)]">
                <span className="flex h-2.5 w-2.5 rounded-full animate-pulse" style={{ background: 'rgb(var(--accent))' }} />
                Sistema de inventario premium
              </div>

              <h1 className="text-5xl font-black leading-[1.1] tracking-tight md:text-[80px] text-[rgb(var(--bg-dark))] drop-shadow-sm">
                Potencia tu operación con
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--blue-deep))] to-[rgb(var(--cyan-bright))]">
                  tecnología de cristal.
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-xl leading-relaxed font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>
                Desarrollamos e implementamos un sistema completo de inventario y ventas. Con la potencia y estética de <strong className="text-[rgb(var(--bg-dark))]">Growco</strong>, 
                diseño 3D y funcionalidad a la medida.
              </p>

              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
                <Link href="/login" className="btn-primary text-lg px-10 py-4 shadow-[0_10px_40px_rgba(0,209,255,0.4)]">
                  Explorar el Sistema
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="#modulos" className="btn-dark px-10 py-4 text-lg shadow-xl">
                  Ver Módulos
                </a>
              </div>
            </div>
            
            {/* HERO IMAGE - MASSIVE 3D GLASS G */}
            <div className="relative flex justify-center lg:justify-end animate-fade-up">
              <div className="absolute inset-0 bg-gradient-to-tr from-[rgb(var(--cyan))] to-[rgb(var(--blue-deep))] opacity-30 blur-[120px] rounded-full transform scale-150"></div>
              <Image src="/12.png" alt="Growco 3D Glass Logo" width={800} height={800} className="w-full max-w-[700px] h-auto object-contain relative z-20 drop-shadow-[0_40px_80px_rgba(0,51,255,0.4)] transform hover:scale-105 transition-transform duration-700 ease-out" priority />
            </div>
          </div>
        </div>
      </section>

      {/* ---- WHAT YOU GET — Bento Grid ---- */}
      <section className="px-6 py-24 relative z-10 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-black md:text-5xl text-[rgb(var(--bg-dark))]">Esto es lo que tu empresa recibe</h2>
            <p className="mt-4 text-lg font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>
              Sistema completo, adaptado a tu giro de negocio, desplegado y funcionando
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Featured card — Cyan Glass (Massive Background) */}
            <div className="bento-cyan lg:col-span-2 flex flex-col justify-between min-h-[400px] relative overflow-hidden rounded-[40px] p-10 shadow-2xl">
              <div className="absolute -left-20 -bottom-20 w-[600px] h-[600px] bg-[rgb(var(--cyan-bright))] blur-[100px] opacity-40 rounded-full"></div>
              
              {/* Massive Decorative element 10 inside the card */}
              <div className="absolute right-0 bottom-0 w-[500px] h-[500px] opacity-50 transform translate-x-1/4 translate-y-1/4 pointer-events-none mix-blend-overlay">
                 <Image src="/10.png" alt="Decorative" fill className="object-contain" />
              </div>

              <div className="relative z-10">
                <span className="badge-pill bg-[rgb(var(--accent))] text-[rgb(var(--bg-dark))] px-4 py-1.5 text-sm mb-6">Adaptable a tu giro</span>
                <h3 className="text-4xl font-black text-white mt-4 drop-shadow-md">
                  Diseño de élite por Growco
                </h3>
                <p className="mt-6 text-white/90 max-w-xl text-lg font-medium leading-relaxed drop-shadow">
                  Colores, logo, y flujos adaptados a tu operación. 
                  Distribuidora, óptica, ferretería, boutique — 
                  cada vertical tiene sus propios campos y lógica en cristal.
                </p>
              </div>
              <div className="mt-10 flex gap-3 flex-wrap relative z-10">
                <span className="badge-pill bg-white text-[rgb(var(--blue-deep))] px-5 py-2 text-sm shadow-lg">Ópticas</span>
                <span className="badge-pill glass-cyan text-white px-5 py-2 text-sm border-white/30 backdrop-blur-xl">Llantas</span>
                <span className="badge-pill glass-cyan text-white px-5 py-2 text-sm border-white/30 backdrop-blur-xl">Ferreterías</span>
                <span className="badge-pill glass-cyan text-white px-5 py-2 text-sm border-white/30 backdrop-blur-xl">Boutiques</span>
              </div>
            </div>

            {/* Accent card */}
            <div className="bento-accent flex flex-col justify-between min-h-[400px] relative overflow-hidden rounded-[40px] p-10 shadow-xl">
               <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
              <Palette className="h-16 w-16 text-[rgb(var(--text-on-accent))] relative z-10 drop-shadow-md" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black mt-6 leading-tight">Tu marca,<br/>tu sistema</h3>
                <p className="mt-4 text-base font-bold opacity-80 leading-relaxed text-[rgb(var(--bg-dark))]">
                  No es un software genérico. Es TU herramienta con la identidad visual y calidad de Growco en 3D.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- MODULES ---- */}
      <section id="modulos" className="px-6 py-24 bg-[rgb(var(--bg-base))] border-t border-[rgb(var(--border))]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-black md:text-5xl text-[rgb(var(--bg-dark))]">Módulos incluidos</h2>
            <p className="mt-4 text-lg font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>
              Todo lo que necesitas para operar desde el día 1
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Package, title: "Inventario", desc: "Control multi-bodega con alertas de stock bajo y seguimiento en tiempo real.", tag: "Core" },
              { icon: ShoppingCart, title: "Punto de Venta", desc: "POS rápido con búsqueda por código, múltiples formas de pago y recibos.", tag: "Core" },
              { icon: BarChart3, title: "Reportes", desc: "Dashboard con métricas del día, productos top, márgenes y analíticas profundas.", tag: "Analíticas" },
              { icon: Shield, title: "Seguridad Growco", desc: "Arquitectura segura, aislamiento de datos y respaldos automáticos.", tag: "Seguridad" },
              { icon: Users, title: "Clientes", desc: "Base de datos de clientes con historial de compras y perfiles.", tag: "CRM" },
              { icon: Boxes, title: "Multi-Sucursal", desc: "Administra múltiples tiendas y bodegas con transferencias de stock.", tag: "Operaciones" },
            ].map((m, i) => (
              <div key={i} className="group p-8 rounded-[32px] border border-[rgb(var(--border))] bg-white hover:shadow-2xl transition-all hover:border-[rgb(var(--cyan-dim))]" style={{ cursor: 'default' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--cyan-dim))] text-[rgb(var(--blue-deep))]">
                    <m.icon className="h-7 w-7" />
                  </div>
                  <span className="badge-pill badge-dark px-3">{m.tag}</span>
                </div>
                <h3 className="text-xl font-bold text-[rgb(var(--bg-dark))]">{m.title}</h3>
                <p className="mt-3 text-base leading-relaxed font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- WHAT'S INCLUDED ---- */}
      <section className="px-6 py-32 relative overflow-hidden bg-white">
        {/* Massive Background decorative 10 */}
        <div className="absolute left-0 top-0 w-[1000px] h-[1000px] opacity-10 pointer-events-none transform -translate-x-1/4 -translate-y-1/4 mix-blend-multiply">
          <Image src="/10.png" alt="Decorative" width={1000} height={1000} className="object-contain" />
        </div>

        <div className="mx-auto max-w-5xl relative z-10">
          <div className="bento-dark p-12 md:p-20 relative overflow-hidden rounded-[48px] shadow-2xl border border-[rgba(255,255,255,0.1)]">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[rgb(var(--cyan))] to-transparent opacity-20 rounded-full blur-[120px] transform translate-x-1/3 -translate-y-1/3"></div>
            
            <h2 className="text-3xl font-black text-white md:text-5xl mb-12 relative z-10 drop-shadow-lg">
              ¿Qué incluye la implementación?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 relative z-10">
              {[
                "Sistema web completo y funcional",
                "Diseño premium 3D por Growco",
                "Base de datos segura en la nube",
                "Multi-usuario con roles y permisos",
                "Datos protegidos por empresa (RLS)",
                "Integraciones API listas",
                "Capacitación de uso intensiva",
                "Soporte técnico experto",
                "Panel de administración central",
                "Responsive (funciona en celular)",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[rgb(var(--accent))] shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                    <Check className="h-5 w-5 text-[rgb(var(--text-on-accent))]" />
                  </div>
                  <span className="text-lg font-bold text-white/95 drop-shadow">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="px-6 pb-32 bg-white">
        <div className="mx-auto max-w-5xl text-center">
          <div className="rounded-[48px] p-16 md:p-24 relative overflow-hidden glass-cyan border-[3px] border-[rgba(0,209,255,0.4)] shadow-[0_20px_80px_rgba(0,51,255,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--blue-deep))] to-[rgb(var(--cyan))] opacity-95"></div>
            
            {/* CTA Decorative */}
            <div className="absolute -left-20 bottom-0 w-[400px] h-[400px] opacity-40 mix-blend-overlay pointer-events-none">
                 <Image src="/11.png" alt="Decorative" fill className="object-contain" />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-black md:text-6xl text-white tracking-tight drop-shadow-xl">
                Experimenta el estándar Growco
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-xl text-white font-semibold drop-shadow-md leading-relaxed">
                Explorá el sistema con datos de demo. Todo lo que ves se puede adaptar milimétricamente a tu negocio en calidad 3D.
              </p>
              <Link href="/login" className="btn-lime mt-12 inline-flex items-center justify-center gap-3 text-xl px-12 py-5 rounded-full shadow-[0_10px_30px_rgba(204,255,0,0.5)] hover:scale-105 transition-transform duration-300">
                Explorar Demo
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="px-6 py-10 bg-white border-t border-[rgb(var(--border))] relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
             <Image src="/2.png" alt="Growco Icon" width={28} height={28} className="object-contain" />
             <span className="font-black text-[rgb(var(--bg-dark))] text-lg tracking-tight">GROWCO</span>
          </div>
          <p className="text-sm font-bold" style={{ color: 'rgb(var(--text-dim))' }}>
            © {new Date().getFullYear()} Growco AI · Innovation Labs
          </p>
        </div>
      </footer>
    </div>
  );
}
