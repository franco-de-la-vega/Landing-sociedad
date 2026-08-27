import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

function IconComunicacion() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-12 w-12 md:h-14 md:w-14">
      <path
        d="M24 34c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v28c0 6.6-5.4 12-12 12H52l-16 14V74h-0c-6.6 0-12-5.4-12-12V34Z"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
      />
      <path d="M40 42h40M40 54h26" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconDiscovery() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-12 w-12 md:h-14 md:w-14">
      <circle cx="52" cy="52" r="26" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M70 70L94 94" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 52h20M52 42v20" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconObjeciones() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-12 w-12 md:h-14 md:w-14">
      <path
        d="M60 20c12 6 22 8 32 8v28c0 22-14 34-32 40-18-6-32-18-32-40V28c10 0 20-2 32-8Z"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M48 60l9 9 16-18" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCierre() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-12 w-12 md:h-14 md:w-14">
      <circle cx="60" cy="60" r="34" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M44 61l11 11 22-24" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPerformance() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-12 w-12 md:h-14 md:w-14">
      <path d="M26 88h68" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="34" y="62" width="12" height="26" rx="2" stroke="var(--color-accent)" strokeWidth="2.5" />
      <rect x="54" y="46" width="12" height="42" rx="2" stroke="var(--color-accent)" strokeWidth="2.5" />
      <rect x="74" y="32" width="12" height="56" rx="2" stroke="var(--color-accent)" strokeWidth="2.5" />
    </svg>
  );
}

function IconHerramientas() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-12 w-12 md:h-14 md:w-14">
      <rect x="24" y="34" width="72" height="46" rx="4" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M24 46h72" stroke="var(--color-accent)" strokeWidth="2.5" />
      <circle cx="34" cy="40" r="1.6" fill="var(--color-accent)" />
      <circle cx="41" cy="40" r="1.6" fill="var(--color-accent)" />
      <path d="M36 60h20M36 68h32" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 80v10M80 80v10M30 90h60" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const cards = [
  { icon: IconComunicacion, title: "Comunicación" },
  { icon: IconDiscovery, title: "Discovery" },
  { icon: IconObjeciones, title: "Manejo de objeciones" },
  { icon: IconCierre, title: "Cierre" },
  { icon: IconPerformance, title: "Gestión y performance" },
  {
    icon: IconHerramientas,
    title: "Herramientas digitales",
    detail: "CRM · WhatsApp · Videollamadas · Seguimiento",
  },
];

export default function MarketNeedsSection() {
  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Qué busca el mercado
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="mx-auto max-w-2xl text-[2.2rem] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)] md:text-[2.9rem]">
            No buscan solo vendedores. Buscan profesionales que puedan
            ejecutar.
          </h2>
        </Reveal>

        <RevealGroup stagger={0.06} className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {cards.map((c) => (
            <RevealItem key={c.title}>
              <div className="group flex h-full flex-col items-center gap-5 border-b-2 border-transparent px-6 py-12 transition-colors duration-300 hover:border-[var(--color-accent)]">
                <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-accent)]/[0.06] transition-colors duration-300 group-hover:bg-[var(--color-accent)]/[0.1] md:h-28 md:w-28">
                  <c.icon />
                </span>
                <div>
                  <h3 className="text-[19px] font-bold text-[var(--color-text-primary)]">{c.title}</h3>
                  {c.detail && (
                    <p className="mt-2 text-[13px] text-[var(--color-text-muted)]">{c.detail}</p>
                  )}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
