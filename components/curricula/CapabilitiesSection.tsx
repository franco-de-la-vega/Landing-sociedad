import { MessageCircle, Search, Gem, ShieldCheck, Flame, Database, BrainCircuit, Briefcase } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";
import SectionNumber from "@/components/curricula/SectionNumber";

const CAPABILITIES = [
  { icon: MessageCircle, title: "Comunicar", body: "Con seguridad, estructura y escucha activa." },
  { icon: Search, title: "Diagnosticar", body: "Descubrir necesidades, problemas, objetivos y motivaciones." },
  { icon: Gem, title: "Presentar valor", body: "Conectar una solución con las necesidades reales del prospecto." },
  { icon: ShieldCheck, title: "Manejar objeciones", body: "Comprenderlas, profundizarlas y resolverlas." },
  { icon: Flame, title: "Cerrar", body: "Conducir profesionalmente una decisión." },
  { icon: Database, title: "Operar", body: "Trabajar con CRM, pipeline, seguimiento y KPIs." },
  { icon: BrainCircuit, title: "Medir", body: "Analizar tu performance comercial." },
  { icon: Briefcase, title: "Profesionalizarte", body: "Construir CV, LinkedIn, portfolio y preparación para entrevistas." },
];

export default function CapabilitiesSection() {
  return (
    <section className="overflow-hidden relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <SectionNumber n="03" />
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] sm:text-[15px] sm:tracking-[0.12em] text-[var(--color-text-secondary)]">
              ¿Qué vas a ser capaz de hacer?
            </span>
          </Reveal>
          <Reveal delay={0.08} className="mt-5">
            <h2 className="text-[1.9rem] font-bold leading-[1.2] tracking-tight text-[var(--color-text-primary)] sm:text-[2.4rem] md:text-[3.3rem]">
              Al final de tu formación podrás
            </h2>
          </Reveal>
        </div>

        <RevealGroup stagger={0.06} className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {CAPABILITIES.map((c, i) => {
            const tinted = i % 2 === 0;
            return (
              <RevealItem key={c.title}>
                <div
                  className={`group flex h-full flex-col justify-center gap-4 rounded-2xl border border-[var(--color-border)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/35 hover:shadow-[0_16px_32px_rgba(0,0,0,0.06)] ${
                    tinted ? "bg-[var(--color-accent-muted)]" : "bg-[var(--color-bg-elevated)]"
                  }`}
                >
                  <c.icon
                    size={24}
                    strokeWidth={1.8}
                    className="text-[var(--color-accent)] transition-transform duration-300 group-hover:scale-110"
                  />
                  <h3 className="text-[19.5px] font-bold text-[var(--color-text-primary)]">{c.title}</h3>
                  <p className="text-[17px] leading-relaxed text-[var(--color-text-secondary)]">{c.body}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
