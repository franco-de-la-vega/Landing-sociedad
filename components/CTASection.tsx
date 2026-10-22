import Reveal from "./Reveal";

export default function CTASection() {
  return (
    <section id="aplicar" className="relative overflow-hidden border-t border-black/10 bg-[var(--color-bg-base)] px-5 py-28 sm:px-8 sm:py-40">
      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <Reveal>
          <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Conocenos
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-7">
          <h2 className="text-[2.1rem] font-bold tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[3.2rem]">
            El primer paso es conocerte a vos.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-lg text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-[16.5px]">
            Mirá el video, respondé unas preguntas y, si el programa es para vos,
            elegí el horario de tu llamada con el equipo.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-12 w-full">
          <a
            href="/aplicar"
            className="mx-auto inline-flex items-center justify-center rounded-full bg-[var(--color-text-primary)] px-8 py-4 text-[16px] font-semibold text-[var(--color-bg-base)] transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            Quiero saber más
          </a>
        </Reveal>
      </div>
    </section>
  );
}
