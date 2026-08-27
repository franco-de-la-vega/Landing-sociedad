import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-11 w-11">
      <rect x="26" y="26" width="68" height="68" rx="10" stroke="var(--color-accent)" strokeWidth="2.5" />
      <circle cx="45" cy="46" r="3" fill="var(--color-accent)" />
      <path d="M45 58v22M62 80V66c0-6 5-9 10-9s10 3 10 9v14" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconCV() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-11 w-11">
      <path d="M38 22h32l16 16v58a4 4 0 01-4 4H38a4 4 0 01-4-4V26a4 4 0 014-4Z" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M70 22v14a2 2 0 002 2h14" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M44 58h32M44 68h32M44 78h20" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconPortafolio() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-11 w-11">
      <rect x="22" y="46" width="76" height="46" rx="6" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M46 46v-8a8 8 0 018-8h12a8 8 0 018 8v8" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M22 64h76" stroke="var(--color-accent)" strokeWidth="2.5" />
    </svg>
  );
}

function IconPitch() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-11 w-11">
      <rect x="48" y="20" width="24" height="40" rx="12" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M34 54a26 26 0 0052 0" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 80v14M48 94h24" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconEntrevista() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-11 w-11">
      <path d="M20 34c0-6.6 5.4-12 12-12h28c6.6 0 12 5.4 12 12v18c0 6.6-5.4 12-12 12H40l-12 11V64h0c-4.4 0-8-3.6-8-8V34Z" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M56 60c1-6 5.4-11 12-11h20c6.6 0 12 5.4 12 12v14c0 6.6-5.4 12-12 12H74l-10 9V87h0c-4.4 0-8-3.6-8-8V60Z" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconRoleplay() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-11 w-11">
      <circle cx="42" cy="42" r="16" stroke="var(--color-accent)" strokeWidth="2.5" />
      <circle cx="78" cy="52" r="12" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M18 92c0-15 10.7-24 24-24s24 9 24 24" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M64 92c0-10.5 7-17 17-17s17 6.5 17 17" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const items = [
  { icon: IconLinkedIn, title: "LinkedIn", body: "Construcción y optimización del perfil profesional." },
  { icon: IconCV, title: "Hoja de vida", body: "CV alineado al perfil de Closer." },
  { icon: IconPortafolio, title: "Portafolio", body: "Organización de evidencias de competencias." },
  { icon: IconPitch, title: "Pitch profesional", body: "Cómo presentar tu experiencia y formación." },
  { icon: IconEntrevista, title: "Entrevista", body: "Preparación para procesos de selección." },
  { icon: IconRoleplay, title: "Roleplay de selección", body: "Práctica con escenarios de reclutadores y supervisores comerciales." },
];

export default function EmployabilitySection() {
  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Preparación para el mercado
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2.4rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.3rem]">
            No solo te enseñamos a vender. Te enseñamos a presentarte como
            profesional.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[18px] leading-relaxed text-[var(--color-text-secondary)]">
            Saber vender no alcanza. También necesitás saber demostrarlo.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.06}
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((s) => (
            <RevealItem key={s.title}>
              <div className="flex h-full flex-col gap-5 border-b-2 border-transparent px-2 py-6 transition-colors duration-300 hover:border-[var(--color-accent)]">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)]/[0.07]">
                  <s.icon />
                </span>
                <div>
                  <h3 className="text-[17px] font-bold text-[var(--color-text-primary)]">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
                    {s.body}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}

          <RevealItem className="sm:col-span-2">
            <div className="flex h-full flex-col justify-between gap-8 rounded-[2rem] bg-[#0B0C0E] px-8 py-10 md:flex-row md:items-center">
              <div>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                  <svg viewBox="0 0 120 120" fill="none" className="h-8 w-8">
                    <path
                      d="M60 20c12 6 22 8 32 8v28c0 22-14 34-32 40-18-6-32-18-32-40V28c10 0 20-2 32-8Z"
                      stroke="#E8CB86"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path d="M48 60l9 9 16-18" stroke="#E8CB86" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="mt-5 text-[19px] font-bold text-white">Defensa profesional</h3>
                <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-white/50">
                  Cómo presentar y defender tus estudios y competencias como Closer.
                </p>
              </div>
              <span className="shrink-0 self-start rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60 md:self-center">
                Cierre del proceso
              </span>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
