import Reveal from "@/components/Reveal";

// Valores ilustrativos: el dashboard real está en desarrollo, esto no es data de un alumno.
const rings = [
  { label: "Discovery", value: 84, color: "#E8CB86" },
  { label: "Comunicación", value: 91, color: "#D4AF6A" },
  { label: "Objeciones", value: 76, color: "#C9A24B" },
  { label: "Propuesta de valor", value: 88, color: "#B8935A" },
  { label: "Cierre", value: 79, color: "#8A6A2F" },
];

const SIZE = 280;
const STROKE = 13;
const GAP = 4;

function Ring({ value, color, index }: { value: number; color: string; index: number }) {
  const radius = SIZE / 2 - STROKE / 2 - index * (STROKE + GAP);
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return (
    <circle
      cx={SIZE / 2}
      cy={SIZE / 2}
      r={radius}
      fill="none"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeDasharray={circumference}
      strokeDashoffset={offset}
      transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
    />
  );
}

export default function PerformanceSystemSection() {
  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            ILFC Performance System
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="mx-auto max-w-2xl text-[2.4rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.3rem]">
            ¿Y si pudieras ver cómo estás vendiendo?
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="mx-auto max-w-xl text-[18px] leading-relaxed text-[var(--color-text-secondary)]">
            Estamos desarrollando un sistema propio de IA + Data para
            convertir tu ejecución comercial en información accionable.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-12 rounded-[2.5rem] bg-[#0B0C0E] px-8 py-16 md:flex-row md:items-center md:gap-16 md:px-16">
            <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
              <svg width={SIZE} height={SIZE}>
                {rings.map((r, i) => (
                  <circle
                    key={r.label + "-track"}
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={SIZE / 2 - STROKE / 2 - i * (STROKE + GAP)}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={STROKE}
                  />
                ))}
                {rings.map((r, i) => (
                  <Ring key={r.label} value={r.value} color={r.color} index={i} />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[3rem] font-black leading-none tracking-tight text-white">82.4</span>
                <span className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
                  Performance Score
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-left">
              {rings.map((r) => (
                <div key={r.label} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: r.color }} />
                  <span className="text-[15px] text-white/60">{r.label}</span>
                  <span className="ml-auto font-mono text-[15px] font-bold text-white">{r.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.26} className="mt-8">
          <p className="text-[15px] italic text-[var(--color-text-muted)]">
            Tu próxima sesión de entrenamiento nace de tu performance. Mockup
            conceptual — sistema en desarrollo.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
