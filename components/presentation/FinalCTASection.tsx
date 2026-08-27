import Reveal from "@/components/Reveal";

export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[56rem] -translate-x-1/2 opacity-[0.06] blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-[2.2rem] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)] md:text-[2.9rem]">
            Encontrá la ruta de formación adecuada para vos
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-5">
          <p className="mx-auto max-w-xl text-[18px] leading-relaxed text-[var(--color-text-secondary)]">
            Contanos dónde estás profesionalmente, qué querés conseguir y te
            ayudamos a identificar el nivel de formación que mejor se adapta
            a tu objetivo.
          </p>
        </Reveal>
        <Reveal delay={0.18} className="mt-8">
          <span className="inline-flex items-center rounded-full bg-[var(--color-accent)] px-6 py-3 text-[14px] font-semibold uppercase tracking-widest text-[#0B0C0E]">
            Quiero conocer mi ruta
          </span>
        </Reveal>
      </div>
    </section>
  );
}
