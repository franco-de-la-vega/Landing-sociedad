import { Check, Minus } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const columns = [
  {
    name: "Universidad",
    sub: "3–4 años",
    body: "Lenta, costosa, cero enfoque en ejecución real remoto.",
    featured: false,
  },
  {
    name: "Cursos en Línea",
    sub: "Autoservicio",
    body: "Baratos, pasivos, sin mentoría ni simulaciones de alta presión.",
    featured: false,
  },
  {
    name: "Autodidacta",
    sub: "Sin guía",
    body: "Desestructurado, sin validación de mercado ni red de contactos.",
    featured: false,
  },
  {
    name: "VoraTrain",
    sub: "Sistema estructurado",
    body: "Simulación intensiva, mentoría 1 a 1, evaluación objetiva e inserción en empresas.",
    featured: true,
  },
];

export default function ComparisonSection() {
  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Matriz comparativa de alternativas
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.8rem]">
            Comparativa de Vías de Formación
          </h2>
        </Reveal>

        <RevealGroup
          stagger={0.1}
          className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          {columns.map((c) => (
            <RevealItem key={c.name}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-6 ${
                  c.featured
                    ? "border-cyan-400/40 bg-[#151a1c] shadow-[0_0_50px_-14px_rgba(0,242,254,0.4)]"
                    : "border-white/10 bg-[#121418]"
                }`}
              >
                {c.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-cyan-400 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0B0C0E]">
                    Destacado
                  </span>
                )}

                <span
                  className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                    c.featured
                      ? "bg-cyan-400/15 text-cyan-300"
                      : "bg-white/5 text-zinc-500"
                  }`}
                >
                  {c.featured ? (
                    <Check size={15} strokeWidth={2.5} />
                  ) : (
                    <Minus size={15} strokeWidth={2.5} />
                  )}
                </span>

                <h3
                  className={`mt-4 text-[16px] font-bold ${
                    c.featured ? "text-cyan-300" : "text-white"
                  }`}
                >
                  {c.name}
                </h3>
                <span className="mt-1 text-[11px] uppercase tracking-widest text-zinc-500">
                  {c.sub}
                </span>
                <p className="mt-4 text-[13.5px] leading-relaxed text-zinc-400">
                  {c.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
