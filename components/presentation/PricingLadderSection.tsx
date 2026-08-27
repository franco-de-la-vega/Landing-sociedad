import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const stages = [
  {
    verb: "Entrar",
    name: "Closer Junior",
    duration: "2 meses",
    body: "Fundamentos comerciales, discovery y cierre. Practicás, generás tu primera evidencia y quedás operativo en ventas remotas.",
    featured: false,
  },
  {
    verb: "Especializar",
    name: "Closer Junior High Ticket",
    duration: "3 meses",
    body: "Venta consultiva, objeciones avanzadas y negociación. Subís la complejidad de las conversaciones que sabés manejar.",
    featured: false,
  },
  {
    verb: "Profesionalizar",
    name: "Carrera Completa",
    duration: "9 meses",
    body: "IA + Data, portafolio profesional, empleabilidad, gate de validación y vinculación. La ruta completa hacia una carrera comercial.",
    featured: true,
  },
];

export default function PricingLadderSection() {
  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[15px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
            Elige hasta dónde querés llevar tu profesión
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2.6rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.6rem]">
            Tres etapas. Una carrera comercial.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[19px] leading-relaxed text-[var(--color-text-secondary)]">
            No es más o menos clases: es profundidad, especialización y
            preparación para el mercado. Cada etapa te ubica en un momento
            distinto de tu desarrollo profesional.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:items-start">
          <Reveal delay={0.2}>
            <svg viewBox="0 0 220 320" className="h-auto w-full max-w-xs" aria-hidden>
              <path
                d="M40 280 C 40 220, 100 210, 110 160 S 180 90, 180 40"
                fill="none"
                stroke="var(--color-border-strong)"
                strokeWidth="2"
                strokeDasharray="1 8"
                strokeLinecap="round"
              />
              <circle cx="40" cy="280" r="6" fill="var(--color-bg-elevated)" stroke="var(--color-accent)" strokeWidth="2.5" />
              <circle cx="110" cy="160" r="6" fill="var(--color-bg-elevated)" stroke="var(--color-accent)" strokeWidth="2.5" />
              <circle cx="180" cy="40" r="8" fill="var(--color-accent)" stroke="var(--color-accent)" strokeWidth="2.5" />
              <path
                d="M168 24l14 16-16 14"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Reveal>

          <RevealGroup stagger={0.1} className="flex flex-col">
            {stages.map((s) => (
              <RevealItem key={s.name}>
                <div
                  className={`border-b border-[var(--color-border)] py-7 first:pt-0 ${
                    s.featured ? "border-b-0" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`text-[12px] font-bold uppercase tracking-widest ${
                        s.featured ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {s.verb}
                    </span>
                    <span className="rounded-full border border-[var(--color-border-strong)] bg-black/[0.03] px-3 py-0.5 text-[11px] font-semibold text-[var(--color-text-muted)]">
                      {s.duration}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-[19px] font-bold leading-tight text-[var(--color-text-primary)]">
                    {s.name}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                    {s.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
