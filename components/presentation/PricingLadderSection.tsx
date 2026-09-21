import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

function IconEntrar() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-6 w-6">
      <circle cx="60" cy="60" r="34" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M50 44l20 16-20 16" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEspecializar() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-6 w-6">
      <path d="M60 24l30 14v22c0 20-13 33-30 36-17-3-30-16-30-36V38l30-14Z" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M48 60l9 9 16-18" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconProfesionalizar() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-6 w-6">
      <path d="M60 22l9 20 22 3-16 15 4 22-19-11-19 11 4-22-16-15 22-3 9-20Z" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M40 90h40" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const stages = [
  {
    verb: "Entrar",
    icon: IconEntrar,
    name: "Comercial Junior",
    duration: "2 meses",
    meaning: "Pasás de la teoría a vender de verdad, con evidencia real.",
  },
  {
    verb: "Especializar",
    icon: IconEspecializar,
    name: "Comercial High Ticket",
    duration: "3 meses",
    meaning: "Subís de categoría: negociás con decisores más exigentes.",
  },
  {
    verb: "Profesionalizar",
    icon: IconProfesionalizar,
    name: "Carrera Completa",
    duration: "5 meses",
    meaning: "La ruta completa hasta la vinculación con empresas.",
    featured: true,
  },
];

export default function PricingLadderSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center border-t border-[var(--color-border)] px-6 py-10 md:px-10 md:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Antes de elegir, entendé qué significa cada etapa
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-3">
          <h2 className="max-w-2xl text-[1.9rem] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)] md:text-[2.4rem]">
            Tres etapas. Una carrera comercial.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-2.5">
          <p className="max-w-xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            No es más o menos clases: es profundidad y especialización.
          </p>
        </Reveal>

        <RevealGroup stagger={0.1} className="mt-8 flex flex-col">
          {stages.map((s, i) => (
            <RevealItem key={s.name}>
              <div
                className={`flex flex-col gap-3 rounded-2xl px-4 py-6 sm:flex-row sm:items-center sm:gap-7 ${
                  s.featured ? "bg-[var(--color-accent)]/[0.05]" : ""
                } ${i > 0 ? "mt-1" : ""}`}
              >
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
                    s.featured ? "bg-[var(--color-accent)]/[0.12]" : "bg-[var(--color-accent)]/[0.07]"
                  }`}
                >
                  <s.icon />
                </span>

                <div className="sm:w-56 sm:shrink-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[12px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                      {s.verb}
                    </span>
                    <span className="rounded-full border border-[var(--color-border-strong)] bg-black/[0.03] px-2.5 py-0.5 text-[10.5px] font-semibold text-[var(--color-text-muted)]">
                      {s.duration}
                    </span>
                  </div>
                  <h3 className="mt-1 text-[21px] font-bold leading-tight text-[var(--color-text-primary)]">
                    {s.name}
                  </h3>
                </div>

                <p className="text-[16px] leading-relaxed text-[var(--color-text-secondary)]">
                  {s.meaning}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
