"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'rgb(var(--bg-base))' }}>
      <div className="w-full max-w-sm animate-fade-up bento-card p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: 'rgb(var(--accent))' }}>
            <Package className="h-7 w-7" style={{ color: 'rgb(var(--text-on-accent))' }} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Stockly</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgb(var(--text-dim))' }}>Sistema de Inventario</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="stat-label mb-2 block">Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com" className="bento-input" required />
          </div>
          <div>
            <label className="stat-label mb-2 block">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" className="bento-input" required />
          </div>
          {error && <p className="text-center text-sm" style={{ color: 'rgb(var(--red-main))' }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm" style={{ color: 'rgb(var(--text-dim))' }}>
          ¿No tenés cuenta?{" "}
          <Link href="/signup" className="font-semibold" style={{ color: 'rgb(var(--text-primary))' }}>Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}
