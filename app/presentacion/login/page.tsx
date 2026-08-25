"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Logo from "@/components/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/presentacion";

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/presentacion-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass }),
    });

    if (res.ok) {
      router.push(next);
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <main className="theme-light flex min-h-screen w-full items-center justify-center bg-[var(--color-bg-base)] px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-8 py-12 text-center shadow-[0_20px_45px_-24px_rgba(20,18,14,0.15)] sm:px-10">
          <Logo className="mx-auto h-10 w-10 text-[var(--color-accent)]" />

          <h1 className="mt-7 text-[1.4rem] font-bold tracking-tight text-[var(--color-text-primary)]">
            Acceso restringido
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
            Presentación interna de ventas. Ingresá tus credenciales.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 text-left">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                Usuario
              </label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoFocus
                className="w-full rounded-[6px] border border-[var(--color-border)] bg-[var(--color-bg-base)] px-3.5 py-2.5 text-[14px] text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full rounded-[6px] border border-[var(--color-border)] bg-[var(--color-bg-base)] px-3.5 py-2.5 pr-10 text-[14px] text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  {showPass ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[12.5px] font-medium text-red-600">
                Usuario o contraseña incorrectos.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-3 rounded-full bg-[var(--color-accent)] px-5 py-3 text-[12px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function PresentacionLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
