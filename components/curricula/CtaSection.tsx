import Reveal from "@/components/Reveal";

export default function CtaSection() {
  return (
    <section className="relative border-t border-[var(--color-border)] overflow-hidden px-6 py-24 md:px-10 md:py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.06] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="text-[15.5px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            Tu próxima etapa profesional
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="text-[2rem] font-bold leading-[1.2] tracking-tight text-[var(--color-text-primary)] md:text-[2.4rem]">
            Esto es lo que vas a construir si decidís avanzar.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-5">
          <p className="text-[17.5px] leading-relaxed text-[var(--color-text-secondary)]">
            Revisala con calma. Cuando quieras retomar la conversación,
            resolvemos cualquier pregunta que te haya quedado.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
