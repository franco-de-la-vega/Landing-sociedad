import { Mic, Video } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const panelists = [
  {
    name: "Valentina",
    role: "Coach Técnico",
    body: "Evaluación de habilidades duras y resolución de objeciones en vivo.",
    gradient: "from-cyan-400/30 via-cyan-500/10 to-transparent",
    ring: "ring-cyan-400/30",
    monogram: "V",
  },
  {
    name: "Julio",
    role: "Evaluador de Criterio",
    body: "Simulación de llamadas de alta presión y estructura narrativa de venta.",
    gradient: "from-emerald-400/30 via-emerald-500/10 to-transparent",
    ring: "ring-emerald-400/30",
    monogram: "J",
  },
];

export default function SimulationSection() {
  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Simulación de evaluación y preparación real
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.8rem]">
            Entorno de Entrenamiento y Simulación Comercial
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Preparación intensiva mediante casos reales y validación de
            estándares.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-16">
          <div className="rounded-2xl border border-white/10 bg-[#121418] p-3 shadow-2xl md:p-4">
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/40 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] uppercase tracking-widest text-zinc-500">
                  Sesión en vivo
                </span>
              </div>
              <div className="flex items-center gap-3 text-zinc-600">
                <Mic size={13} strokeWidth={2} />
                <Video size={13} strokeWidth={2} />
              </div>
            </div>

            <RevealGroup
              stagger={0.14}
              className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {panelists.map((p) => (
                <RevealItem key={p.name}>
                  <div className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-6">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`}
                    />
                    <div
                      className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-[#0B0C0E] text-[20px] font-semibold text-white ring-1 ${p.ring}`}
                    >
                      {p.monogram}
                    </div>
                    <p className="relative mt-4 text-[14px] font-semibold text-white">
                      {p.name}
                    </p>
                    <span className="relative mt-1 text-[10px] uppercase tracking-widest text-zinc-500">
                      {p.role}
                    </span>
                    <p className="relative mt-3 max-w-[220px] text-center text-[12.5px] leading-relaxed text-zinc-400">
                      {p.body}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <p className="max-w-lg text-[13.5px] leading-relaxed text-zinc-500">
            Cero teoría inerte. Medición objetiva de capacidad operativa
            antes de la salida al mercado.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
