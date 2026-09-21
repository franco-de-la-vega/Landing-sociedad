import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

function IconEntrada() {
  return (
    <svg viewBox="0 0 160 160" fill="none" className="h-11 w-11">
      <rect x="40" y="30" width="60" height="100" rx="6" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M92 80h38M116 66l16 14-16 14" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="52" cy="80" r="2.4" fill="var(--color-accent)" />
    </svg>
  );
}

function IconMotorIA() {
  return (
    <svg viewBox="0 0 220 180" fill="none" className="h-11 w-14">
      <circle cx="110" cy="90" r="34" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M110 66v10M110 104v10M86 90h10M124 90h10" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="110" cy="90" r="8" stroke="var(--color-accent)" strokeWidth="2.5" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 110 + 66 * Math.cos(rad);
        const y = 90 + 66 * Math.sin(rad);
        return (
          <g key={deg}>
            <line x1={110 + 34 * Math.cos(rad)} y1={90 + 34 * Math.sin(rad)} x2={x} y2={y} stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3 4" />
            <circle cx={x} cy={y} r="4" fill="var(--color-accent)" />
          </g>
        );
      })}
    </svg>
  );
}

function IconEvidencia() {
  return (
    <svg viewBox="0 0 160 160" fill="none" className="h-11 w-11">
      <rect x="34" y="26" width="92" height="108" rx="6" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M50 96l16-18 14 12 24-28" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="80" cy="112" r="18" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M74 112l4 4 9-10" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSalida() {
  return (
    <svg viewBox="0 0 220 180" fill="none" className="h-11 w-14">
      <rect x="70" y="80" width="80" height="56" rx="6" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M92 80v-14a18 18 0 0136 0v14" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M40 108c26 0 40-40 66-40s40 40 66 40" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3 5" />
      <path d="M150 60l16-16M158 44h10v10" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const stages = [
  {
    icon: IconEntrada,
    title: "Entrada",
    detail: "Te sumás al Instituto y arrancás tu diagnóstico inicial.",
  },
  {
    icon: IconMotorIA,
    title: "Simulación e IA",
    detail: "Simulador con IA, profesor en vivo, role play, ejercicios y exámenes.",
  },
  {
    icon: IconEvidencia,
    title: "Evidencia",
    detail: "Cada sesión queda registrada: armás tu evidencia real de desempeño.",
  },
  {
    icon: IconSalida,
    title: "Salida a mercado",
    detail: "Salís con conexión directa a las empresas.",
  },
];

function StepArrow() {
  return (
    <svg viewBox="0 0 60 24" fill="none" className="mt-12 hidden h-6 w-14 shrink-0 md:block" aria-hidden>
      <path d="M2 12h48M40 4l10 8-10 8" stroke="var(--color-border-strong)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SystemStatementSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center border-t border-[var(--color-border)] px-6 py-14 md:px-10 md:py-16">
      <div className="mx-auto w-full max-w-6xl text-center">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            ILFC
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="mx-auto max-w-3xl text-[2.1rem] font-bold leading-[1.2] tracking-tight text-[var(--color-text-primary)] md:text-[2.7rem]">
            De tu primer día en el Instituto a tu conexión directa con
            empresas reales.
          </h2>
        </Reveal>

        <RevealGroup stagger={0.1} className="mt-24 flex flex-col items-stretch gap-10 md:flex-row md:items-start md:justify-between md:gap-0">
          {stages.map((s, i) => (
            <RevealItem key={s.title} className="flex flex-1 flex-col items-center md:flex-row">
              <div className="flex flex-1 flex-col items-center gap-4 px-2">
                <span className="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-sm">
                  <s.icon />
                </span>
                <span className="text-[12px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                  Paso {i + 1}
                </span>
                <h3 className="text-[19px] font-bold text-[var(--color-text-primary)]">{s.title}</h3>
                <p className="max-w-[200px] text-[14.5px] leading-relaxed text-[var(--color-text-muted)]">
                  {s.detail}
                </p>
              </div>
              {i < stages.length - 1 && <StepArrow />}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
