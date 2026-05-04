import Link from "next/link";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

/**
 * Landing page pública de Stockly
 * Diseño light mode con acentos del design system
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg-base))]">
      {/* ---- HEADER / NAVBAR ---- */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[rgb(var(--blue-main))] to-[rgb(var(--purple-main))]">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-2xl tracking-wider">STOCKLY</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-[rgb(var(--text-secondary))] transition-colors hover:text-[rgb(var(--text-primary))]">
              Funciones
            </a>
            <a href="#pricing" className="text-sm text-[rgb(var(--text-secondary))] transition-colors hover:text-[rgb(var(--text-primary))]">
              Precios
            </a>
            <Link
              href="/login"
              className="text-sm font-medium text-[rgb(var(--blue-main))] transition-colors hover:text-[rgb(var(--blue-bright))]"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[rgb(var(--blue-main))] px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-[rgb(var(--blue-bright))] hover:-translate-y-0.5"
            >
              Crear Cuenta Gratis
            </Link>
          </nav>
          {/* Botón mobile */}
          <Link
            href="/signup"
            className="rounded-lg bg-[rgb(var(--blue-main))] px-4 py-2 text-sm font-semibold text-white md:hidden"
          >
            Empezar
          </Link>
        </div>
      </header>

      {/* ---- HERO ---- */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 md:pt-24">
        {/* Gradiente decorativo de fondo */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[rgb(var(--blue-main))]/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[rgb(var(--purple-main))]/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-1.5 text-sm shadow-card">
            <span className="flex h-2 w-2 rounded-full bg-[rgb(var(--green-main))]" />
            <span className="text-[rgb(var(--text-secondary))]">Diseñado para PyMEs en El Salvador</span>
          </div>

          <h1 className="font-display text-5xl leading-none tracking-wider text-[rgb(var(--text-primary))] md:text-7xl">
            CONTROLA TU
            <br />
            <span className="bg-gradient-to-r from-[rgb(var(--blue-main))] to-[rgb(var(--purple-main))] bg-clip-text text-transparent">
              INVENTARIO
            </span>
            <br />
            Y VENTAS
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[rgb(var(--text-secondary))]">
            Sistema completo de gestión para distribuidoras, boutiques, ferreterías y más.
            Punto de venta, control de stock, facturación DTE y reportes — todo en un solo lugar.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-lg bg-[rgb(var(--blue-main))] px-8 py-3.5 text-sm font-semibold text-white shadow-card-md transition-all hover:bg-[rgb(var(--blue-bright))] hover:-translate-y-0.5 hover:shadow-card-lg"
            >
              Empezar Gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 rounded-lg border bg-white px-8 py-3.5 text-sm font-semibold text-[rgb(var(--text-primary))] shadow-card transition-all hover:border-[rgb(var(--blue-main))] hover:-translate-y-0.5"
            >
              Ver Funciones
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[rgb(var(--text-dim))]">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-[rgb(var(--green-main))]" />
              Sin tarjeta de crédito
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-[rgb(var(--green-main))]" />
              IVA 13% configurado
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <CheckCircle className="h-4 w-4 text-[rgb(var(--green-main))]" />
              DTE El Salvador
            </span>
          </div>
        </div>
      </section>

      {/* ---- FEATURES ---- */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl tracking-wider text-[rgb(var(--text-primary))] md:text-4xl">
              TODO LO QUE NECESITÁS
            </h2>
            <p className="mt-3 text-[rgb(var(--text-secondary))]">
              Herramientas profesionales sin la complejidad de los sistemas empresariales
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Package,
                title: "Inventario Inteligente",
                description: "Control de stock multi-bodega con alertas de bajo inventario y seguimiento en tiempo real.",
                color: "blue",
              },
              {
                icon: ShoppingCart,
                title: "Punto de Venta",
                description: "POS rápido con búsqueda por código de barras, múltiples formas de pago y generación de comprobantes.",
                color: "green",
              },
              {
                icon: BarChart3,
                title: "Reportes y Analíticas",
                description: "Dashboard con ventas del día, productos top, márgenes y libro de IVA para el Ministerio de Hacienda.",
                color: "purple",
              },
              {
                icon: Shield,
                title: "Facturación DTE",
                description: "Genera documentos tributarios electrónicos: Facturas, CCF, Notas de Crédito y más.",
                color: "amber",
              },
              {
                icon: Zap,
                title: "Tiempo Real",
                description: "Las ventas actualizan el inventario al instante en todas las sucursales conectadas.",
                color: "red",
              },
              {
                icon: Package,
                title: "Multi-Sucursal",
                description: "Administra múltiples tiendas y bodegas desde una sola cuenta con transferencias de inventario.",
                color: "blue",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-[14px] border bg-white p-6 shadow-card transition-all hover:border-[rgb(var(--blue-main))]/30 hover:-translate-y-1 hover:shadow-card-md"
              >
                {/* Borde superior de color */}
                <div
                  className={`absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r ${
                    feature.color === "blue"
                      ? "from-[rgb(var(--blue-main))]"
                      : feature.color === "green"
                      ? "from-[rgb(var(--green-main))]"
                      : feature.color === "purple"
                      ? "from-[rgb(var(--purple-main))]"
                      : feature.color === "amber"
                      ? "from-[rgb(var(--amber-main))]"
                      : "from-[rgb(var(--red-main))]"
                  } to-transparent`}
                />
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${
                    feature.color === "blue"
                      ? "bg-[rgb(var(--blue-dim))] text-[rgb(var(--blue-bright))]"
                      : feature.color === "green"
                      ? "bg-[rgb(var(--green-dim))] text-[rgb(var(--green-bright))]"
                      : feature.color === "purple"
                      ? "bg-[rgb(var(--purple-dim))] text-[rgb(var(--purple-bright))]"
                      : feature.color === "amber"
                      ? "bg-[rgb(var(--amber-dim))] text-[rgb(var(--amber-bright))]"
                      : "bg-[rgb(var(--red-dim))] text-[rgb(var(--red-bright))]"
                  }`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-display text-lg tracking-wider">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[rgb(var(--text-secondary))]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA FINAL ---- */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-[rgb(var(--blue-main))] to-[rgb(var(--purple-main))] p-12 text-center shadow-card-lg">
          <h2 className="font-display text-3xl tracking-wider text-white md:text-4xl">
            EMPEZÁ A CONTROLAR TU NEGOCIO HOY
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            Creá tu cuenta en menos de 2 minutos. Sin tarjeta de crédito, sin compromisos.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-[rgb(var(--blue-main))] shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-lg"
          >
            Crear Cuenta Gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="border-t px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[rgb(var(--blue-main))] to-[rgb(var(--purple-main))]">
              <Package className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display text-lg tracking-wider">STOCKLY</span>
          </div>
          <p className="text-xs text-[rgb(var(--text-dim))]">
            © 2026 Stockly. Hecho con 💙 en El Salvador.
          </p>
        </div>
      </footer>
    </div>
  );
}
