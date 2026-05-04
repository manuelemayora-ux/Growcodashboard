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
      {/* Decorative background 10 */}
      <div className="absolute left-0 bottom-0 w-full max-w-[800px] opacity-10 pointer-events-none transform -translate-x-1/4 translate-y-1/4">
        <Image src="/10.png" alt="Decorative" width={800} height={800} className="object-contain" priority />
      </div>

      <div className="w-full max-w-sm animate-fade-up bento-card p-10 relative z-10 overflow-hidden shadow-2xl shadow-[rgba(0,209,255,0.05)] border border-white">
        
        {/* Glow effect */}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-[rgb(var(--cyan))] blur-[80px] opacity-20 rounded-full"></div>

        <div className="mb-8 text-center relative z-10 flex flex-col items-center">
          <div className="mx-auto mb-5 drop-shadow-2xl">
            <Image src="/12.png" alt="Growco 3D Logo" width={80} height={80} className="object-contain" priority />
          </div>
          <Image src="/6.png" alt="Growco Full Logo" width={120} height={30} className="object-contain mb-1" priority />
          <p className="mt-1 text-xs font-bold tracking-widest uppercase text-[rgb(var(--cyan-bright))]">Stockly Demo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="stat-label mb-2 block">Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com" className="bento-input font-medium" required />
          </div>
          <div>
            <label className="stat-label mb-2 block">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" className="bento-input font-medium" required />
          </div>
          {error && <p className="text-center text-sm font-semibold" style={{ color: 'rgb(var(--red-main))' }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 mt-2">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium relative z-10" style={{ color: 'rgb(var(--text-secondary))' }}>
          ¿No tienes acceso?{" "}
          <Link href="/signup" className="font-bold text-[rgb(var(--cyan-bright))] hover:text-[rgb(var(--blue-deep))] transition-colors">Solicitar cuenta</Link>
        </div>
      </div>
    </div>
  );
}
