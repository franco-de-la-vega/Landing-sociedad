import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const features = [
  {
    tag: "Arbitraje Geográfico",
    body: "Facturación directa en USD sin límites de economía local.",
  },
  {
    tag: "Blindaje Profesional",
    body: "Dominio de habilidades comerciales duras alineadas a demanda global.",
  },
  {
    tag: "Posicionamiento Temprano",
    body: "Entrada prioritaria a la cima de la curva de adopción.",
  },
];

export default function MarketSection() {
  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              La inevitabilidad del mercado
            </span>
            <h2 className="mt-6 text-[1.9rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.6rem]">
              El mercado no espera a la adaptación tardía.
            </h2>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-zinc-400">
              El trabajo remoto comercial no es una tendencia: es el
              estándar de eficiencia. Mantenerse en estructuras locales
              tradicionales genera una brecha de ingresos e{" "}
              <span className="font-semibold text-cyan-300">
                irreversibilidad profesional en menos de 36 meses
              </span>
              .
            </p>
          </div>
        </Reveal>

        <RevealGroup
          stagger={0.12}
          className="flex flex-col divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#121418]/70 backdrop-blur-md"
        >
          {features.map((f) => (
            <RevealItem key={f.tag}>
              <div className="p-7">
                <span className="inline-block rounded border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                  {`[ ${f.tag} ]`}
                </span>
                <p className="mt-4 text-[14.5px] leading-relaxed text-zinc-300">
                  {f.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
