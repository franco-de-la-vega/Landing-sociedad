import type { Metadata } from "next";
import { Check } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Gracias por tu compra — Instituto Latinoamericano de Formación Comercial",
  robots: { index: false, follow: false },
};

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg-base px-6 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.05] blur-[140px]"
      />

      <div className="relative w-full max-w-md animate-[fadeUp_0.7s_ease-out]">
        <div className="rounded-[6px] border border-white/10 bg-[#121418] px-8 py-12 text-center sm:px-12 sm:py-14">
          <Logo className="mx-auto h-10 w-10 text-accent" />

          <span className="mt-8 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-secondary">
            <Check size={13} strokeWidth={3} />
            Admisión confirmada
          </span>

          <h1 className="text-metal mt-5 text-[1.9rem] font-bold leading-[1.15] tracking-tight sm:text-[2.3rem]">
            Gracias por tu compra
          </h1>

          {plan && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/[0.08] px-4 py-1.5">
              <span className="text-[12px] font-semibold uppercase tracking-widest text-accent">
                Plan {plan}
              </span>
            </div>
          )}

          <p className="mx-auto mt-7 max-w-xs text-[15px] leading-relaxed text-zinc-400">
            En breve te llega un mail con los próximos pasos.
          </p>
        </div>
      </div>
    </main>
  );
}
