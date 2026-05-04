"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[rgb(var(--bg-base))] px-4">
        <div className="w-full max-w-sm animate-fade-up rounded-[14px] border bg-white p-10 shadow-card-lg text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgb(var(--green-dim))]">
            <span className="text-2xl">✉️</span>
          </div>
          <h2 className="font-display text-2xl tracking-wider">VERIFICÁ TU CORREO</h2>
          <p className="mt-3 text-sm text-[rgb(var(--text-secondary))]">
            Enviamos un enlace de confirmación a <strong>{email}</strong>. Revisá tu bandeja de entrada.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm font-medium text-[rgb(var(--blue-main))]">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(var(--bg-base))] px-4">
      <div className="w-full max-w-sm animate-fade-up rounded-[14px] border bg-white p-10 shadow-card-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[rgb(var(--blue-main))] to-[rgb(var(--purple-main))]">
            <Package className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-3xl tracking-widest">STOCKLY</h1>
          <p className="label-uppercase mt-1">Crear Cuenta</p>
          <div className="mx-auto mt-3 h-0.5 w-8 rounded bg-gradient-to-r from-[rgb(var(--blue-main))] to-[rgb(var(--red-main))]" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="label-uppercase mb-2 block">Nombre Completo</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder="Juan Pérez"
              className="w-full rounded-lg border bg-[rgb(var(--bg-input))] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[rgb(var(--blue-main))]"
              required />
          </div>
          <div>
            <label className="label-uppercase mb-2 block">Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full rounded-lg border bg-[rgb(var(--bg-input))] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[rgb(var(--blue-main))]"
              required />
          </div>
          <div>
            <label className="label-uppercase mb-2 block">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-lg border bg-[rgb(var(--bg-input))] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[rgb(var(--blue-main))]"
              required minLength={6} />
          </div>
          {error && <p className="text-center text-sm text-[rgb(var(--red-bright))]">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[rgb(var(--blue-main))] to-[rgb(var(--blue-mid))] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:from-[rgb(var(--blue-bright))] hover:to-[rgb(var(--blue-main))] hover:-translate-y-0.5 disabled:opacity-50">
            {loading ? "Creando cuenta..." : "CREAR CUENTA"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[rgb(var(--text-dim))]">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-medium text-[rgb(var(--blue-main))] hover:text-[rgb(var(--blue-bright))]">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}
