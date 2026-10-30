"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import Logo from "@/components/Logo";

export default function BootcampAccesoPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Acceso · Guía del Bootcamp";
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/bootcamp-acceso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (res.ok) {
      router.push("/interno/bootcamp");
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <main className="bootcamp relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bc-black)] px-6 py-16 text-white">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-0 h-[26rem] w-[26rem] rounded-full bg-[var(--bc-gold)]/20 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[var(--bc-brown)] blur-[120px]" />

      <div className="relative w-full max-w-sm rounded-[24px] border border-white/10 bg-[#14110e] px-8 py-12 text-center sm:px-10">
        <Logo className="mx-auto h-11 w-11 text-[var(--bc-gold)]" />
        <h1 className="mt-7 text-2xl font-bold tracking-tight">Acceso restringido</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-white/60">Material interno para estudiantes. Ingresá el código de acceso.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 text-left">
          <label htmlFor="code" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--bc-gold)]">
            Código de acceso
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              id="code"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              autoComplete="off"
              className="w-full rounded-full border border-white/15 bg-black/40 py-3 pl-11 pr-4 text-[15px] text-white outline-none transition-colors focus:border-[var(--bc-gold)]"
            />
          </div>

          {error && <p className="text-[13px] font-medium text-red-400">Código incorrecto.</p>}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--bc-gold)] px-5 py-3 text-[13px] font-semibold text-[var(--bc-black)] transition-colors hover:bg-[var(--bc-gold-soft)] disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </main>
  );
}
