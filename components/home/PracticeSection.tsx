import Image from "next/image";
import { BadgeCheck, Dumbbell, Radio, Users, Zap } from "lucide-react";
import Reveal from "../Reveal";

const items = [
  { icon: Radio, title: "En vivo y en directo", body: "Clases con formadores reales. Preguntás y te responden en el momento." },
  { icon: Dumbbell, title: "Práctica en cada clase", body: "Simulaciones reales en cada encuentro, hasta que la técnica sale natural." },
  { icon: Users, title: "Acompañamiento constante", body: "Nunca avanzás solo: seguimiento y feedback de principio a fin." },
  { icon: Zap, title: "Formación completa, a corto plazo", body: "Todo lo que necesitás para trabajar, en meses y no en años." },
  { icon: BadgeCheck, title: "Certificación y conexión laboral", body: "Terminás certificado y con un puente directo hacia empresas." },
];

export default function PracticeSection() {
  return (
    <section className="relative z-10 border-t border-black/10 bg-[var(--color-bg-base)] px-6 py-20 sm:py-28 md:px-12 md:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-[var(--radius-panel)] border border-black/10 bg-[#0A0B0D] p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[14px]">
              <Image
                src="/home/simulacion-coach.jpg"
                alt="Formadora en una videollamada de simulación"
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover"
              />
              <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                Simulación en vivo
              </span>
              <div className="absolute bottom-4 right-4 w-[34%] overflow-hidden rounded-xl border-2 border-white/80 shadow-xl">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/home/simulacion-alumno.jpg"
                    alt="Alumno participando de la simulación"
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">El formato</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[3.2rem]">
              Todo, en un{" "}
              <span className="font-serif-display font-normal italic text-[var(--color-accent-hover)]">bootcamp.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Un formato intensivo, pensado para que llegues lejos en poco tiempo. Así funciona:
            </p>
          </Reveal>
          <div className="mt-8 flex flex-col gap-3">
            {items.map((it, i) => (
              <Reveal key={it.title} delay={0.14 + i * 0.06}>
                <div className="group flex items-start gap-4 rounded-2xl border border-black/10 bg-[var(--color-bg-elevated)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)]/40 sm:p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/[0.1] text-[var(--color-accent-hover)] transition-colors duration-300 group-hover:bg-[var(--color-accent)] group-hover:text-white">
                    <it.icon size={18} strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-[16.5px] font-semibold tracking-tight text-[var(--color-text-primary)]">{it.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">{it.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
