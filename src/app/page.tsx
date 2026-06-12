"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  Package, BarChart3, ShoppingCart, Shield, ArrowRight,
  Check, Boxes, Users, Palette, Layers3,
  AlertCircle, TrendingUp
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import FloatingOrbs from "@/components/floating-orbs";
import TiltCard from "@/components/tilt-card";
import ContactModal from "@/components/contact-modal";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactType, setContactType] = useState<"llamada" | "contacto">("llamada");

  useGSAP(() => {
    // Disable animations if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // 1. Hero Page load timeline animation
    const tl = gsap.timeline();
    
    tl.from(".header-anim", {
      y: -60,
      opacity: 0,
      duration: 0.8,
      ease: "power4.out"
    })
    .from(".hero-badge", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out"
    }, "-=0.4")
    .from(".hero-title-anim", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5")
    .from(".hero-desc-anim", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6")
    .from(".hero-btn-anim", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.6")
    .from(".hero-card-anim", {
      scale: 0.92,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out"
    }, "-=0.8");

    // 2. Bento Section reveal
    gsap.from(".bento-title-anim", {
      scrollTrigger: {
        trigger: ".bento-section",
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    gsap.from(".bento-card-anim", {
      scrollTrigger: {
        trigger: ".bento-grid",
        start: "top 85%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out"
    });

    // 3. Modules Grid reveal
    gsap.from(".modules-title-anim", {
      scrollTrigger: {
        trigger: ".modules-section",
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    // 3b. Module cards — each with a unique entrance animation
    const modCardDefs = [
      { sel: ".mod-card-0", from: { y: 60, opacity: 0 } },
      { sel: ".mod-card-1", from: { y: 80, opacity: 0, rotation: -3 } },
      { sel: ".mod-card-2", from: { y: 60, opacity: 0, rotation: 3 } },
      { sel: ".mod-card-3", from: { x: -50, opacity: 0 } },
      { sel: ".mod-card-4", from: { scale: 0.85, opacity: 0 } },
      { sel: ".mod-card-5", from: { x: 50, opacity: 0 } },
    ];
    modCardDefs.forEach(({ sel, from }, i) => {
      gsap.from(sel, {
        scrollTrigger: {
          trigger: ".modules-grid",
          start: "top 85%",
        },
        ...from,
        duration: 0.75,
        delay: i * 0.08,
        ease: "power3.out",
      });
    });

    // 4. Implementation Checklist reveal
    gsap.from(".impl-title-anim", {
      scrollTrigger: {
        trigger: ".impl-section",
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    gsap.from(".impl-card-anim", {
      scrollTrigger: {
        trigger: ".impl-section",
        start: "top 85%",
      },
      y: 60,
      opacity: 0,
      scale: 0.97,
      duration: 1,
      ease: "power4.out"
    });

    gsap.from(".impl-item-anim", {
      scrollTrigger: {
        trigger: ".impl-list",
        start: "top 85%",
      },
      x: -40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: "power3.out"
    });

    // 5. CTA Slide Reveal
    gsap.from(".cta-card-anim", {
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 85%",
      },
      y: 60,
      opacity: 0,
      scale: 0.97,
      duration: 1,
      ease: "power4.out"
    });

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen relative overflow-hidden bg-[rgb(var(--bg-base))]"
    >
      {/* ---- BACKGROUND FLOATING ORBS ---- */}
      <FloatingOrbs />

      {/* ---- HEADER ---- */}
      <header className="header-anim sticky top-0 z-50 bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-sm transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/SaaSystem/2.png" alt="Growco Logo" width={36} height={36} className="object-contain" />
              <span className="text-2xl font-black tracking-tight text-[rgb(var(--bg-dark))] dark:text-white">GROWCO</span>
            </div>
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-800 mx-2 hidden sm:block"></div>
            <span className="text-sm font-extrabold tracking-[0.2em] text-[rgb(var(--cyan-bright))] uppercase hidden sm:block">Stockly</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setContactType("llamada"); setIsContactOpen(true); }}
              className="hidden text-base font-bold sm:block transition-colors hover:text-[rgb(var(--cyan-bright))] text-[rgb(var(--text-secondary))] dark:text-gray-300 cursor-pointer"
            >
              Agendar Llamada
            </button>
            <Link href="/dashboard" className="btn-primary py-3 px-8 text-base shadow-lg shadow-[rgba(0,209,255,0.3)] hover:scale-105 active:scale-95 transition-transform duration-200">
              Ver Demo
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ---- HERO ---- */}
      <section className="px-6 pb-24 pt-20 md:pt-32 relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-[1.3fr_0.7fr] sm:grid-cols-[1.1fr_0.9fr] gap-4 sm:gap-12 lg:gap-16 items-center">
            <div className="relative z-20">
              <div className="hero-badge mb-8 inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm font-bold glass-cyan text-[rgb(var(--bg-dark))] dark:text-white shadow-lg border border-[rgba(0,209,255,0.3)]">
                <span className="flex h-2.5 w-2.5 rounded-full animate-pulse" style={{ background: 'rgb(var(--accent))' }} />
                Implementación e integración llave en mano
              </div>

              <h1 className="hero-title-anim text-2xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight text-[rgb(var(--bg-dark))] dark:text-white">
                Controla tu stock
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--blue-deep))] to-[rgb(var(--cyan-bright))]">
                  y acelera tus ventas.
                </span>
              </h1>

              <p className="hero-desc-anim mt-8 max-w-xl text-[13px] sm:text-xl leading-relaxed font-medium text-[rgb(var(--text-secondary))] dark:text-gray-300">
                Desplegamos un sistema completo de inventario y facturación adaptado a tu empresa. Con la tecnología de <strong className="text-[rgb(var(--bg-dark))] dark:text-white">Growco</strong>, 
                obtén flujos de trabajo optimizados y paneles analíticos en tiempo real para tu negocio.
              </p>

              <div className="mt-10 flex flex-row flex-wrap items-center gap-3 sm:gap-4">
                <Link href="/dashboard" className="hero-btn-anim btn-primary text-sm sm:text-lg px-6 sm:px-10 py-3.5 sm:py-4 shadow-[0_10px_40px_rgba(0,209,255,0.4)] hover:scale-105 transition-transform duration-300">
                  Ingresar a la Demo
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <button 
                  onClick={() => { setContactType("llamada"); setIsContactOpen(true); }}
                  className="hero-btn-anim btn-dark px-6 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-lg shadow-xl hover:bg-slate-900/90 hover:scale-105 transition-transform duration-300 cursor-pointer flex items-center gap-2"
                >
                  Agendar Llamada
                </button>
              </div>
            </div>
            
            {/* HERO IMAGE - MASSIVE 3D TILT CARD */}
            <div className="hero-card-anim relative w-full flex items-center justify-center lg:justify-end">
              <TiltCard className="relative w-full max-w-[120px] min-[400px]:max-w-[160px] sm:max-w-[320px] md:max-w-[450px] lg:max-w-[580px] aspect-square rounded-[16px] sm:rounded-[32px] lg:rounded-[48px] p-0 glass-premium border border-white/30 dark:border-white/5 shadow-md sm:shadow-2xl flex items-center justify-center overflow-hidden glow-border-trigger" maxTilt={12} scale={1.03}>
                <div className="absolute inset-0 bg-gradient-to-tr from-[rgb(var(--cyan))]/20 via-[rgb(var(--blue-deep))]/10 to-transparent pointer-events-none blur-[40px]"></div>
                
                {/* Card 1: Stock Crítico / Alertas (Top-Left) */}
                <div className="absolute top-[8%] left-[6%] p-3 md:p-3.5 bg-white/85 dark:bg-slate-900/75 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-2xl shadow-xl animate-float hidden sm:flex items-center gap-3 z-30 pointer-events-none">
                  <div className="bg-red-50 dark:bg-red-950/40 p-2 rounded-xl text-red-500">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[9px] md:text-[10px] text-red-500 font-extrabold uppercase tracking-wider">Stock Crítico</div>
                    <div className="text-xs font-black text-gray-900 dark:text-white">5 ítems por reordenar</div>
                  </div>
                </div>

                {/* Card 2: Alta Rotación (Middle-Right) - contained inside card */}
                <div className="absolute top-[45%] right-[4%] p-3 bg-white/85 dark:bg-slate-900/75 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-2xl shadow-xl z-30 animate-float pointer-events-none hidden sm:flex items-center gap-3" style={{ animationDelay: "3s" }}>
                  <div className="bg-[rgb(var(--accent-dim))] dark:bg-lime-950/40 p-2 rounded-xl text-lime-600 dark:text-[rgb(var(--accent))]">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Alta Rotación</div>
                    <div className="text-xs font-black text-gray-900 dark:text-white">Aro Aviator Solar</div>
                  </div>
                </div>

                {/* Card 3: Multi-Bodega (Bottom-Left) */}
                <div className="absolute bottom-[10%] left-[6%] p-3 md:p-3.5 bg-white/85 dark:bg-slate-900/75 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-2xl shadow-xl z-30 animate-float pointer-events-none hidden sm:flex items-center gap-3" style={{ animationDelay: "1.5s" }}>
                  <div className="bg-[rgb(var(--cyan-dim))] dark:bg-cyan-950/40 p-2 rounded-xl text-[rgb(var(--blue-deep))] dark:text-[rgb(var(--cyan))]">
                    <Boxes className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Multi-Bodega</div>
                    <div className="text-xs font-black text-gray-900 dark:text-white">Sincronización activa</div>
                  </div>
                </div>

                {/* Primary Graphic - Enlarged G Logo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/SaaSystem/12.png"
                  alt="Growco Logo"
                  className="w-full h-full object-cover relative z-20 drop-shadow-[0_20px_50px_rgba(0,51,255,0.3)] hover:scale-105 transition-transform duration-500 ease-out"
                />
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* ---- WHAT YOU GET — Bento Grid ---- */}
      <section className="bento-section px-6 py-28 relative z-10 bg-white dark:bg-slate-950/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto max-w-7xl">
          <div className="bento-title-anim mb-16 text-center">
            <h2 className="text-4xl font-black md:text-5xl text-[rgb(var(--bg-dark))] dark:text-white">Esto es lo que tu empresa recibe</h2>
            <p className="mt-4 text-lg font-medium text-[rgb(var(--text-secondary))] dark:text-gray-300">
              Sistema completo, adaptado a tu giro de negocio, desplegado y funcionando
            </p>
          </div>

          <div className="bento-grid grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Bento Glass Card 1 - Cyan Glass */}
            <TiltCard className="bento-card-anim lg:col-span-2 flex flex-col justify-between min-h-[450px] relative overflow-hidden rounded-[40px] p-10 shadow-2xl glass-premium-cyan border border-[rgba(0,209,255,0.3)] glow-border-trigger" maxTilt={6}>
              <div className="absolute -left-20 -bottom-20 w-[500px] h-[500px] bg-[rgb(var(--cyan-bright))] blur-[120px] opacity-25 rounded-full pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 h-full">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="badge-pill bg-[rgb(var(--accent))] text-[rgb(var(--bg-dark))] px-4 py-1.5 text-sm font-bold mb-6">Adaptación Personalizada</span>
                    <h3 className="text-4xl font-black text-[rgb(var(--bg-dark))] dark:text-white mt-4 drop-shadow-sm leading-tight">
                      Alineado a tus Procesos Comerciales
                    </h3>
                    <p className="mt-6 text-[rgb(var(--text-secondary))] dark:text-slate-200 text-lg font-medium leading-relaxed">
                      Ajustamos la interfaz, los reportes y los campos del sistema según tu industria. Ya sea una óptica, distribuidora, ferretería o boutique, adaptamos la lógica para reflejar con exactitud tu flujo operativo real.
                    </p>
                  </div>
                  <div className="mt-8 flex gap-3 flex-wrap">
                    <span className="badge-pill bg-white/80 border border-gray-200/50 dark:bg-white/10 dark:border-white/10 text-[rgb(var(--blue-deep))] dark:text-white px-5 py-2 text-sm shadow-md backdrop-blur-md">Ópticas</span>
                    <span className="badge-pill bg-white/40 dark:bg-white/5 text-gray-700 dark:text-gray-300 px-5 py-2 text-sm border border-gray-200/20 backdrop-blur-xl">Distribuidoras</span>
                    <span className="badge-pill bg-white/40 dark:bg-white/5 text-gray-700 dark:text-gray-300 px-5 py-2 text-sm border border-gray-200/20 backdrop-blur-xl">Ferreterías</span>
                    <span className="badge-pill bg-white/40 dark:bg-white/5 text-gray-700 dark:text-gray-300 px-5 py-2 text-sm border border-gray-200/20 backdrop-blur-xl">Boutiques</span>
                  </div>
                </div>

                {/* Interactive Mockup widget */}
                <div className="w-full md:w-[220px] shrink-0 bg-white/70 dark:bg-slate-900/60 border border-white/50 dark:border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-4 self-center preserve-3d" style={{ transform: "rotateY(-8deg) rotateX(8deg)" }}>
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    </div>
                    <span className="text-[10px] font-mono-price text-gray-400">stockly.app</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="h-3 w-3/4 rounded-full bg-gray-200/60 dark:bg-gray-800"></div>
                    <div className="h-2 w-1/2 rounded-full bg-gray-100 dark:bg-gray-900"></div>
                  </div>
                  
                  <div className="bg-[rgb(var(--cyan-dim))] p-3.5 rounded-2xl flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Óptica Solar</span>
                      <span className="text-[10px] font-black text-[rgb(var(--blue-deep))]">120 u.</span>
                    </div>
                    <div className="w-full bg-white/60 dark:bg-slate-800 rounded-full h-1.5">
                      <div className="bg-[rgb(var(--cyan-bright))] h-1.5 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-[rgb(var(--accent-dim))] p-3.5 rounded-2xl flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Ferretería</span>
                      <span className="text-[10px] font-black text-lime-700">95 u.</span>
                    </div>
                    <div className="w-full bg-white/60 dark:bg-slate-800 rounded-full h-1.5">
                      <div className="bg-[rgb(var(--accent))] h-1.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Bento Glass Card 2 - Accent/White Glass */}
            <TiltCard className="bento-card-anim flex flex-col justify-between min-h-[450px] relative overflow-hidden rounded-[40px] p-10 shadow-xl glass-premium border border-white/40 dark:border-white/5 glow-border-trigger" maxTilt={8}>
              <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--accent))]/10 to-transparent pointer-events-none"></div>
              <div className="absolute -right-20 -top-20 w-[250px] h-[250px] bg-[rgb(var(--accent))]/20 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[rgb(var(--accent))] text-[rgb(var(--text-on-accent))] shadow-lg shadow-[rgba(204,255,0,0.3)]">
                  <Palette className="h-8 w-8 drop-shadow-sm" />
                </div>

                {/* Branding Customization Preview Widget */}
                <div className="my-6 bg-slate-50/70 dark:bg-slate-900/40 border border-gray-100 dark:border-white/5 rounded-3xl p-5 flex flex-col gap-3 shadow-inner backdrop-blur-md">
                  <div className="flex items-center gap-2 text-xs font-mono text-[rgb(var(--text-secondary))] dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="font-bold">https://tu-empresa.com</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-b border-gray-100/50 dark:border-white/5 py-2.5 my-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[rgb(var(--text-dim))]">Logotipo Corporativo</span>
                    <span className="bg-[rgb(var(--cyan-dim))] dark:bg-cyan-950/40 px-2 py-0.5 rounded-full text-[9px] font-black text-[rgb(var(--blue-deep))] dark:text-[rgb(var(--cyan))]">
                      Activo
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 w-5 rounded-full bg-[rgb(var(--cyan))] ring-2 ring-white dark:ring-slate-950 shadow-sm"></div>
                    <div className="h-5 w-5 rounded-full bg-[rgb(var(--blue-deep))] shadow-sm"></div>
                    <div className="h-5 w-5 rounded-full bg-[rgb(var(--accent))] shadow-sm"></div>
                    <div className="h-5 w-5 rounded-full bg-purple-500 shadow-sm"></div>
                    <div className="h-5 w-5 rounded-full bg-emerald-500 shadow-sm"></div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-3xl font-black text-[rgb(var(--bg-dark))] dark:text-white leading-tight">
                    Presencia de<br/>tu Identidad
                  </h3>
                  <p className="mt-3 text-base font-semibold text-[rgb(var(--text-secondary))] dark:text-gray-300 leading-relaxed">
                    No es un software genérico de marca blanca. El sistema se despliega con tu logotipo, colores corporativos y dominio propio, proyectando el máximo nivel de profesionalismo.
                  </p>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ---- MODULES ---- */}
      <section id="modulos" className="modules-section px-6 py-28 relative z-10 border-t border-[rgb(var(--border))] dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="mx-auto max-w-7xl">
          <div className="modules-title-anim mb-16 text-center">
            <h2 className="text-4xl font-black md:text-5xl text-[rgb(var(--bg-dark))] dark:text-white">Módulos incluidos</h2>
            <p className="mt-4 text-lg font-medium text-[rgb(var(--text-secondary))] dark:text-gray-300">
              Todo lo que necesitas para operar desde el día 1
            </p>
          </div>

          <div className="modules-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Each card has a unique accent color, animation direction, and icon bg */}
            {([
              {
                icon: Package, title: "Inventario", desc: "Control multi-bodega con alertas de stock bajo y seguimiento en tiempo real.", tag: "Core",
                iconBg: "bg-[rgb(var(--cyan-dim))]", iconColor: "text-[rgb(var(--blue-deep))]", tagColor: "bg-[rgb(var(--cyan-dim))] text-[rgb(var(--blue-deep))]",
                anim: "mod-card-0", animFrom: { y: 60, opacity: 0 },
              },
              {
                icon: ShoppingCart, title: "Punto de Venta", desc: "POS rápido con búsqueda por código, múltiples formas de pago y recibos.", tag: "Core",
                iconBg: "bg-[rgb(var(--bg-dark))]", iconColor: "text-white", tagColor: "bg-[rgb(var(--bg-dark))] text-white",
                anim: "mod-card-1", animFrom: { y: 80, opacity: 0, rotation: -3 },
              },
              {
                icon: BarChart3, title: "Reportes", desc: "Dashboard con métricas del día, productos top, márgenes y analíticas profundas.", tag: "Analíticas",
                iconBg: "bg-[rgb(var(--accent))]", iconColor: "text-[rgb(var(--bg-dark))]", tagColor: "bg-[rgb(var(--accent))] text-[rgb(var(--bg-dark))]",
                anim: "mod-card-2", animFrom: { y: 60, opacity: 0, rotation: 3 },
              },
              {
                icon: Shield, title: "Seguridad y Respaldo", desc: "Arquitectura en la nube robusta, aislamiento completo de base de datos y copias de seguridad automáticas diarias.", tag: "Seguridad",
                iconBg: "bg-green-50 dark:bg-green-950/40", iconColor: "text-green-600", tagColor: "bg-green-100 text-green-700",
                anim: "mod-card-3", animFrom: { x: -50, opacity: 0 },
              },
              {
                icon: Users, title: "Clientes", desc: "Base de datos de clientes con historial de compras y perfiles.", tag: "CRM",
                iconBg: "bg-purple-50 dark:bg-purple-950/40", iconColor: "text-purple-600", tagColor: "bg-purple-100 text-purple-700",
                anim: "mod-card-4", animFrom: { scale: 0.85, opacity: 0 },
              },
              {
                icon: Boxes, title: "Multi-Sucursal", desc: "Administra múltiples tiendas y bodegas con transferencias de stock.", tag: "Operaciones",
                iconBg: "bg-orange-50 dark:bg-orange-950/40", iconColor: "text-orange-500", tagColor: "bg-orange-100 text-orange-700",
                anim: "mod-card-5", animFrom: { x: 50, opacity: 0 },
              },
            ] as const).map((m, i) => (
              <TiltCard key={i} className={`module-card-anim ${m.anim} group p-8 rounded-[32px] glass-premium border border-white/50 dark:border-white/5 bg-white/70 dark:bg-slate-950/40 hover:shadow-2xl transition-all duration-300`} maxTilt={8} scale={1.03}>
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${m.iconBg} ${m.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    <m.icon className="h-7 w-7" />
                  </div>
                  <span className={`badge-pill px-3 py-1 font-bold text-[10px] ${m.tagColor}`}>{m.tag}</span>
                </div>
                <h3 className="text-xl font-bold text-[rgb(var(--bg-dark))] dark:text-white">{m.title}</h3>
                <p className="mt-3 text-base leading-relaxed font-semibold text-[rgb(var(--text-secondary))] dark:text-gray-300">{m.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ---- WHAT'S INCLUDED ---- */}
      <section className="impl-section px-6 py-32 relative overflow-hidden bg-white dark:bg-slate-950/60 backdrop-blur-md border-t border-b border-gray-100 dark:border-white/5">
        <div className="mx-auto max-w-5xl relative z-10">
          <div className="impl-card-anim glass-premium-dark p-12 md:p-20 relative overflow-hidden rounded-[48px] shadow-3xl border border-white/10">
            {/* Interactive moving gradient mesh inside the dark panel */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[rgb(var(--cyan))]/20 to-transparent opacity-40 rounded-full blur-[100px] transform translate-x-1/4 -translate-y-1/4"></div>
            
            <h2 className="impl-title-anim text-3xl font-black text-white md:text-5xl mb-12 relative z-10 drop-shadow-lg flex items-center gap-4">
              <Layers3 className="h-8 w-8 text-[rgb(var(--cyan))]" />
              ¿Qué incluye la implementación?
            </h2>
            <div className="impl-list grid gap-6 sm:grid-cols-2 relative z-10">
              {[
                "Sistema web completo llave en mano",
                "Carga e importación de tus datos de Excel",
                "Base de datos en la nube de alta velocidad",
                "Acceso multiusuario con roles jerárquicos",
                "Protección de datos y cifrado SSL",
                "Módulo de facturación rápida (POS)",
                "Capacitación de uso para tu personal",
                "Soporte técnico preferente experto",
                "Panel administrativo centralizado",
                "Plataforma responsive para celular y PC",
              ].map((item, i) => (
                <div key={i} className="impl-item-anim flex items-center gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[rgb(var(--accent))] shadow-[0_0_15px_rgba(204,255,0,0.3)]">
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
      <section className="cta-section px-6 py-32 bg-slate-50/30 dark:bg-slate-950/20">
        <div className="mx-auto max-w-5xl text-center">
          <TiltCard className="cta-card-anim rounded-[48px] p-16 md:p-24 relative overflow-hidden glass-premium border-[2px] border-[rgba(0,209,255,0.3)] shadow-[0_30px_90px_rgba(0,51,255,0.3)]" maxTilt={3}>
            {/* Background cyan gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--blue-deep))] via-[rgb(var(--cyan))] to-[rgb(var(--blue-deep))]/90 opacity-95"></div>
            {/* Moving circular mesh glow */}
            <div className="absolute top-[20%] left-[30%] w-[350px] h-[350px] bg-[rgb(var(--accent))]/20 blur-[80px] rounded-full animate-float"></div>

            <div className="relative z-10">
              <h2 className="text-4xl font-black md:text-6xl text-white tracking-tight drop-shadow-xl leading-tight">
                Lleva el control de tu empresa al siguiente nivel
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-xl text-white font-semibold drop-shadow-md leading-relaxed opacity-90">
                Explora el sistema con datos reales de prueba y comprueba su rapidez. Nos encargamos de todo el proceso de personalización e implantación técnica por ti.
              </p>
              <Link href="/dashboard" className="btn-lime mt-12 inline-flex items-center justify-center gap-3 text-xl px-12 py-5 rounded-full shadow-[0_10px_30px_rgba(204,255,0,0.4)] hover:scale-105 transition-transform duration-300">
                Explorar Demo
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="px-6 py-12 bg-white dark:bg-slate-950 border-t border-[rgb(var(--border))] dark:border-white/5 relative z-10 transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/SaaSystem/2.png" alt="Growco Icon" width={28} height={28} className="object-contain" />
             <span className="font-black text-[rgb(var(--bg-dark))] dark:text-white text-lg tracking-tight">GROWCO</span>
          </div>
          <p className="text-sm font-bold text-[rgb(var(--text-dim))]">
            © {new Date().getFullYear()} Growco AI · Innovation Labs
          </p>
        </div>
      </footer>

      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
        defaultType={contactType}
      />
    </div>
  );
}
