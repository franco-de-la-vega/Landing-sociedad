import Image from "next/image";
import RevealGroup from "./RevealGroup";
import RevealItem from "./RevealItem";
import TiltCard from "./TiltCard";

const founders = [
  {
    name: "Natalia",
    role: "CBO",
    photo: "/team/natalia.jpg",
    body: "Co-fundadora y directora de vinculación institucional (B2B). Gestora del canal corporativo y alianzas internacionales para conectar a los closers con las mejores vacantes del mercado.",
  },
  {
    name: "Andrés",
    role: "CRO",
    photo: "/team/andres.png",
    body: "Co-fundador y director comercial (B2C). Lidera la estrategia de ventas directas, el acompañamiento continuo de los alumnos y la optimización del rendimiento en cada etapa del proceso.",
  },
  {
    name: "Franco",
    role: "CEO & Founder",
    photo: "/team/franco.jpeg",
    body: "Director general de visión y arquitectura de sistemas. Diseña la infraestructura operativa del programa, los estándares técnicos y la metodología de negociación que aplican los alumnos.",
  },
];

export default function FoundersSection() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl border-t border-white/10 px-6 py-24 md:px-12">
      <h2 className="mb-16 text-left text-3xl font-bold text-white md:text-4xl">
        La estructura detrás del método.
      </h2>

      <RevealGroup
        stagger={0.14}
        className="grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-3"
      >
        {founders.map((f) => (
          <RevealItem key={f.name}>
            <TiltCard className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              {f.photo ? (
                <Image
                  src={f.photo}
                  alt={f.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="team-photo object-cover object-top transition-all duration-700 ease-out"
                />
              ) : (
                <div
                  className="absolute inset-0 transition-[filter] duration-700 ease-out"
                  style={{
                    background:
                      "linear-gradient(160deg, var(--color-bg-elevated-2) 0%, var(--color-bg-elevated) 60%, #000 100%)",
                    filter: "grayscale(1) contrast(1.05) saturate(1)",
                  }}
                />
              )}

              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(120% 90% at 30% 100%, color-mix(in srgb, var(--color-accent) 20%, transparent) 0%, transparent 60%)",
                }}
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/35 to-transparent" />

              {!f.photo && (
                <span className="absolute left-1/2 top-[42%] z-10 -translate-x-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.2em] text-white/30">
                  Foto próximamente
                </span>
              )}
            </TiltCard>

            {/* el nombre irrumpe fuera del marco, sobre el borde inferior */}
            <div className="relative z-20 -mt-8 pl-2 text-left">
              <h3 className="text-2xl font-semibold leading-none tracking-tight text-white">
                {f.name}
              </h3>
              <span className="text-accent mt-2 block text-[1.5rem] font-bold uppercase leading-none tracking-tight">
                {f.role}
              </span>
            </div>

            <p className="mt-5 pl-2 text-sm leading-relaxed text-zinc-400">
              {f.body}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
