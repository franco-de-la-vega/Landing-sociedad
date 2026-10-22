import Reveal from "./Reveal";

export default function CTASection() {
  return (
    <section id="aplicar" className="relative overflow-hidden border-t border-black/10 bg-[var(--color-bg-base)] px-5 py-20 sm:py-28 sm:px-8 sm:py-40">
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
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
            Empezar es simple. Tres pasos, y en pocos minutos sabés si el
            programa es para vos.
          </p>
        </Reveal>

        <Reveal delay={0.18} className="mt-14 w-full">
          <ol className="grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
            {[
              ["Mirá el video", "Te contamos en pocos minutos cómo funciona el instituto."],
              ["Respondé unas preguntas", "Para entender dónde estás hoy y qué buscás."],
              ["Agendá tu llamada", "Elegís el horario y hablás con el equipo."],
            ].map(([t, d], i) => (
              <li key={t} className="rounded-2xl border border-black/10 bg-[var(--color-bg-elevated)] p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)]/[0.12] text-[13px] font-bold text-[var(--color-accent-hover)]">
                  {i + 1}
                </span>
                <div className="mt-4 text-[15.5px] font-semibold tracking-tight text-[var(--color-text-primary)]">{t}</div>
                <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">{d}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.24} className="mt-10 w-full">
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
