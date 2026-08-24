import Image from "next/image";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const stories = [
  {
    name: "Johana Giraldo",
    role: "Closer High-Ticket — Colombia",
    photo: "/team/johana-giraldo.jpeg",
    photoPosition: "object-top",
    floatingBadge: "Closer High-Ticket para empresas de Colombia",
    impact: "De no confiar en sus propias capacidades a cerrar contratos high-ticket en Colombia.",
    body: "Johana llegó al Instituto sin confiar en su propia capacidad comercial. A través del entrenamiento intensivo y la práctica constante en simulaciones reales, desarrolló la técnica y la seguridad necesarias para operar como Closer High-Ticket, cerrando contratos con empresas de Colombia.",
    status: "Alumna ILFC · Colombia",
  },
  {
    name: "Adriana Giraldo",
    role: "Colombia",
    photo: "/team/adriana-giraldo.jpeg",
    photoPosition: "object-[center_25%]",
    floatingBadge: "Trabajando con empresas de Colombia",
    impact: "De sumarse al Instituto a trabajar activamente con empresas de Colombia.",
    body: "Adriana forma parte de la comunidad de alumnas del Instituto y hoy aplica lo desarrollado durante la formación trabajando activamente con empresas de Colombia.",
    status: "Alumna ILFC · Colombia",
  },
];

export default function SuccessStoriesSection() {
  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            Prueba social · Última camada
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.8rem]">
            Casos de Éxito
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Alumnas reales del Instituto construyendo su carrera comercial
            internacional.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.14}
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {stories.map((s) => (
            <RevealItem key={s.name}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121418]">
                {/* imagen */}
                <div className="relative aspect-[5/4]">
                  {s.photo ? (
                    <Image
                      src={s.photo}
                      alt={s.name}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className={`object-cover ${s.photoPosition}`}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(160deg, var(--color-bg-elevated-2) 0%, var(--color-bg-elevated) 60%, #000 100%)",
                      }}
                    >
                      <span className="px-4 text-center text-[11px] uppercase tracking-[0.2em] text-white/30">
                        Foto pendiente
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-14">
                    <span className="block rounded-md bg-emerald-500 px-3 py-1.5 text-center text-[12px] font-bold uppercase tracking-wide text-[#062018] shadow-lg">
                      {s.floatingBadge}
                    </span>
                  </div>
                </div>

                {/* testimonio */}
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <span className="text-[10.5px] font-semibold uppercase tracking-widest text-emerald-500">
                    Caso de éxito · Última camada
                  </span>
                  <h3 className="mt-2 text-[18px] font-bold text-white">
                    {s.name}
                  </h3>
                  <p className="mt-0.5 text-[13px] text-zinc-500">{s.role}</p>

                  <h4 className="mt-4 text-[17px] font-bold leading-snug text-white">
                    {s.impact}
                  </h4>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-zinc-400">
                    {s.body}
                  </p>

                  <span className="mt-5 inline-flex w-fit items-center rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-300">
                    {s.status}
                  </span>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
