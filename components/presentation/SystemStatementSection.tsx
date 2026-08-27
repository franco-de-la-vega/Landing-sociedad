import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

function IconEntrada() {
  return (
    <svg viewBox="0 0 160 160" fill="none" className="h-28 w-28 md:h-32 md:w-32">
      <rect x="40" y="30" width="60" height="100" rx="6" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M92 80h38M116 66l16 14-16 14" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="52" cy="80" r="2.4" fill="var(--color-accent)" />
    </svg>
  );
}

function IconMotorIA() {
  return (
    <svg viewBox="0 0 220 180" fill="none" className="h-36 w-44 md:h-44 md:w-52">
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
    <svg viewBox="0 0 160 160" fill="none" className="h-28 w-28 md:h-32 md:w-32">
      <rect x="34" y="26" width="92" height="108" rx="6" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M50 96l16-18 14 12 24-28" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="80" cy="112" r="18" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M74 112l4 4 9-10" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSalida() {
  return (
    <svg viewBox="0 0 220 180" fill="none" className="h-36 w-44 md:h-44 md:w-52">
      <rect x="70" y="80" width="80" height="56" rx="6" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M92 80v-14a18 18 0 0136 0v14" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path d="M40 108c26 0 40-40 66-40s40 40 66 40" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="3 5" />
      <path d="M150 60l16-16M158 44h10v10" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const stages = [
  { icon: IconEntrada, title: "Entrada", tint: "color-mix(in srgb, var(--color-accent) 5%, var(--color-bg-elevated))" },
  {
    icon: IconMotorIA,
    title: "Motor de Simulación e IA",
    tint: "color-mix(in srgb, var(--color-accent) 9%, var(--color-bg-elevated))",
    span: "sm:col-span-2",
  },
  { icon: IconEvidencia, title: "Evidencia y Performance", tint: "color-mix(in srgb, var(--color-accent) 5%, var(--color-bg-elevated))" },
  {
    icon: IconSalida,
    title: "Salida a Mercado",
    tint: "color-mix(in srgb, var(--color-accent) 9%, var(--color-bg-elevated))",
    span: "sm:col-span-2",
  },
];

export default function SystemStatementSection() {
  return (
    <section className="relative border-t border-[var(--color-border)] px-6 pb-24 pt-14 md:px-10 md:pb-32 md:pt-20">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            ILFC
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="mx-auto max-w-2xl text-[2rem] font-bold leading-[1.2] tracking-tight text-[var(--color-text-primary)] md:text-[2.5rem]">
            No mires todo lo que te enseñamos. Mirá el sistema que usamos
            para convertirte en un profesional comercial.
          </h2>
        </Reveal>

        <RevealGroup stagger={0.1} className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {stages.map((s) => (
            <RevealItem key={s.title}>
              <div
                className={`flex h-full flex-col items-center justify-center gap-6 rounded-3xl border border-[var(--color-border)] px-8 py-16 ${s.span ?? ""}`}
                style={{ background: s.tint }}
              >
                <s.icon />
                <h3 className="text-[19px] font-bold text-[var(--color-text-primary)]">{s.title}</h3>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
