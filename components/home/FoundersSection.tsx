import Image from "next/image";
import Reveal from "../Reveal";
import RevealGroup from "../RevealGroup";
import RevealItem from "../RevealItem";

const founders = [
  {
    name: "Franco",
    role: "Director general",
    photo: "/team/franco.jpeg",
    body: "Diseña la infraestructura del programa, los estándares de formación y la metodología de negociación que aplican los alumnos.",
  },
  {
    name: "Andrés",
    role: "Director comercial",
    photo: "/team/andres.png",
    body: "Lidera el acompañamiento de los alumnos y el rendimiento en cada etapa del proceso, desde la primera clase hasta el trabajo.",
  },
];

export default function FoundersSection() {
  return (
    <section className="relative z-10 border-t border-black/10 bg-[var(--color-bg-base)] px-6 py-28 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">Quiénes lo dirigen</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-5xl">
              Detrás del método,{" "}
              <span className="font-serif-display font-normal italic text-[var(--color-accent-hover)]">personas reales.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              Más de una década formando y liderando equipos comerciales. Enseñamos lo que aplicamos todos los días.
            </p>
          </Reveal>
        </div>

        <RevealGroup stagger={0.12} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-8">
          {founders.map((f) => (
            <RevealItem key={f.name}>
              <div className="group h-full overflow-hidden rounded-[var(--radius-panel)] border border-black/10 bg-[var(--color-bg-elevated)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={f.photo}
                    alt={`${f.name}, ${f.role.toLowerCase()} del instituto`}
                    fill
                    sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">{f.name}</h3>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">{f.role}</span>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{f.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
