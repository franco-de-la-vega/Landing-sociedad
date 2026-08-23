import { Target, Users, PhoneCall, LineChart } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const pillars = [
  {
    icon: PhoneCall,
    title: "Simulación de llamadas reales",
    detail:
      "No es teoría de ventas. Practicás objeciones y cierres en escenarios calcados a una llamada real, antes de tomar tu primer cliente.",
  },
  {
    icon: Users,
    title: "Mentoría 1 a 1 con especialistas",
    detail:
      "Acompañamiento personalizado de cerca, con feedback puntual sobre tu propia performance, no clases masivas genéricas.",
  },
  {
    icon: LineChart,
    title: "Evaluación objetiva de desempeño",
    detail:
      "Medimos con datos, no con impresiones. Sabés exactamente en qué nivel estás y qué te falta para el siguiente.",
  },
  {
    icon: Target,
    title: "Preparación con salida al mercado",
    detail:
      "El objetivo no es el certificado: es que llegues preparado, con evidencia y portafolio, a procesos de selección reales en equipos comerciales del exterior.",
  },
];

export default function ComparisonSection() {
  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            Qué hace distinto al método
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.8rem]">
            Formación pensada para insertarte, no solo para certificarte
          </h2>
        </Reveal>

        <RevealGroup
          stagger={0.08}
          className="mt-16 flex flex-col divide-y divide-white/10 border-t border-b border-white/10"
        >
          {pillars.map((p) => (
            <RevealItem key={p.title}>
              <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-start sm:gap-8">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/[0.08]">
                  <p.icon size={18} strokeWidth={2} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-zinc-400">
                    {p.detail}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
