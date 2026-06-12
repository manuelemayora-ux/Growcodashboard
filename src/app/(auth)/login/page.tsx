"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message === "Invalid login credentials" ? "Correo o contraseña incorrectos" : authError.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 relative overflow-hidden" style={{ background: 'rgb(var(--bg-base))' }}>
      {/* MASSIVE Decorative background 10 */}
      <div className="absolute left-0 bottom-0 w-[1000px] h-[1000px] opacity-15 pointer-events-none transform -translate-x-1/4 translate-y-1/4 mix-blend-multiply">
        <Image src="/SaaSystem/10.png" alt="Decorative" width={1000} height={1000} className="object-contain" priority />
      </div>

      {/* Decorative 11 on the top right */}
      <div className="absolute right-0 top-0 w-[800px] h-[800px] opacity-15 pointer-events-none transform translate-x-1/4 -translate-y-1/4 mix-blend-multiply">
        <Image src="/SaaSystem/11.png" alt="Decorative" width={800} height={800} className="object-contain" priority />
      </div>

      <div className="w-full max-w-md animate-fade-up bento-card p-12 relative z-10 overflow-hidden shadow-2xl shadow-[rgba(0,51,255,0.08)] border-[3px] border-white/60 backdrop-blur-xl bg-white/80 rounded-[40px]">
        
        {/* Glow effect */}
        <div className="absolute -right-32 -top-32 w-80 h-80 bg-gradient-to-bl from-[rgb(var(--cyan-bright))] to-[rgb(var(--blue-deep))] blur-[100px] opacity-25 rounded-full"></div>

        <div className="mb-10 text-center relative z-10 flex flex-col items-center">
          {/* MASSIVE 3D GLASS G */}
          <div className="mx-auto mb-6 drop-shadow-[0_20px_40px_rgba(0,51,255,0.3)] transform hover:scale-105 transition-transform duration-500">
            <Image src="/SaaSystem/12.png" alt="Growco 3D Logo" width={160} height={160} className="object-contain" priority />
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <Image src="/SaaSystem/2.png" alt="Growco Icon" width={32} height={32} className="object-contain" priority />
            <span className="text-2xl font-black tracking-tight text-[rgb(var(--bg-dark))]">GROWCO</span>
          </div>
          
          <p className="mt-1 text-sm font-black tracking-[0.2em] uppercase text-[rgb(var(--cyan-bright))]">Stockly Demo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="stat-label mb-2 block font-bold text-[rgb(var(--text-secondary))]">Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com" className="w-full rounded-[20px] border-[2px] border-[rgb(var(--border))] bg-white/50 px-5 py-4 text-base outline-none transition-all font-semibold focus:border-[rgb(var(--cyan))] focus:shadow-[0_0_0_4px_rgba(0,209,255,0.15)] focus:bg-white" required />
          </div>
          <div>
            <label className="stat-label mb-2 block font-bold text-[rgb(var(--text-secondary))]">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" className="w-full rounded-[20px] border-[2px] border-[rgb(var(--border))] bg-white/50 px-5 py-4 text-base outline-none transition-all font-semibold focus:border-[rgb(var(--cyan))] focus:shadow-[0_0_0_4px_rgba(0,209,255,0.15)] focus:bg-white" required />
          </div>
          {error && <p className="text-center text-sm font-bold p-3 rounded-xl bg-[rgb(var(--red-dim))]" style={{ color: 'rgb(var(--red-main))' }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 mt-4 py-4 text-lg shadow-[0_8px_24px_rgba(0,209,255,0.3)] rounded-[20px]">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-10 text-center text-sm font-bold relative z-10" style={{ color: 'rgb(var(--text-secondary))' }}>
          ¿No tienes acceso?{" "}
          <Link href="/signup" className="text-[rgb(var(--cyan-bright))] hover:text-[rgb(var(--blue-deep))] transition-colors">Solicitar cuenta</Link>
        </div>
      </div>
    </div>
  );
}
