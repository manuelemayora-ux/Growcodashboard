"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'rgb(var(--bg-base))' }}>
      <div className="w-full max-w-sm animate-fade-up bento-card p-10 relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-[rgb(var(--cyan))] blur-[80px] opacity-20 rounded-full"></div>

        <div className="mb-8 text-center relative z-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl glass-cyan">
            <span className="text-white font-extrabold text-2xl tracking-tighter">G</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--bg-dark))]">Growco</h1>
          <p className="mt-1 text-xs font-bold tracking-widest uppercase text-[rgb(var(--cyan-bright))]">Stockly Demo</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5 relative z-10">
          <div>
            <label className="stat-label mb-2 block">Nombre de tu empresa</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Empresa S.A." className="bento-input font-medium" required />
          </div>
          <div>
            <label className="stat-label mb-2 block">Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@empresa.com" className="bento-input font-medium" required />
          </div>
          <div>
            <label className="stat-label mb-2 block">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" className="bento-input font-medium" required minLength={6} />
          </div>
          {error && <p className="text-center text-sm font-semibold" style={{ color: 'rgb(var(--red-main))' }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 mt-2">
            {loading ? "Creando entorno..." : "Solicitar Demo"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium relative z-10" style={{ color: 'rgb(var(--text-secondary))' }}>
          ¿Ya eres cliente?{" "}
          <Link href="/login" className="font-bold text-[rgb(var(--cyan-bright))] hover:text-[rgb(var(--blue-deep))] transition-colors">Ingresar al sistema</Link>
        </div>
      </div>
    </div>
  );
}
