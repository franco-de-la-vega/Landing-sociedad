import Image from "next/image";
import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const stories = [
  {
    name: "Johana Giraldo",
    role: "Closer High-Ticket — Colombia",
    photo: "/team/johana-giraldo.jpeg",
    photoPosition: "object-[center_22%]",
    floatingBadge: "Closer High-Ticket para empresas de Colombia",
    impact: "De no confiar en sus propias capacidades a cerrar contratos high-ticket en Colombia.",
    body: "Hoy cierra contratos high-ticket con empresas de Colombia.",
    status: "Alumna ILFC · Colombia",
  },
  {
    name: "Adriana Giraldo",
    role: "Closer — Colombia",
    photo: "/team/adriana-giraldo.jpeg",
    photoPosition: "object-[center_15%]",
    floatingBadge: "Trabajando con empresas de Colombia",
    impact: "De sumarse al Instituto a trabajar activamente con empresas de Colombia.",
    body: "Hoy trabaja activamente con empresas de Colombia.",
    status: "Alumna ILFC · Colombia",
  },
];

export default function SuccessStoriesSection() {
  return (
    <section className="relative flex min-h-[85vh] flex-col justify-center border-t border-[var(--color-border)] px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Prueba social · Última camada
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-4">
          <h2 className="max-w-2xl text-[2.3rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.1rem]">
            Casos de Éxito
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-3">
          <p className="max-w-xl text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
            Alumnas reales del Instituto construyendo su carrera comercial
            internacional.
          </p>
        </Reveal>

        <RevealGroup
          stagger={0.14}
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {stories.map((s) => (
            <RevealItem key={s.name}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] md:flex-row">
                {/* imagen */}
                <div className="relative aspect-[4/3] shrink-0 md:aspect-auto md:w-[42%]">
                  {s.photo ? (
                    <Image
                      src={s.photo}
                      alt={s.name}
                      fill
                      sizes="(min-width: 768px) 26vw, 100vw"
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
                      <span className="px-4 text-center text-[13px] uppercase tracking-[0.2em] text-[var(--color-text-primary)]/30">
                        Foto pendiente
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-12">
                    <span className="block text-[12.5px] font-semibold uppercase tracking-wide text-white/90">
                      {s.floatingBadge}
                    </span>
                  </div>
                </div>

                {/* testimonio */}
                <div className="flex flex-1 flex-col justify-center p-7 md:p-8">
                  <h3 className="text-[20px] font-bold text-[var(--color-text-primary)]">
                    {s.name}
                  </h3>
                  <p className="mt-0.5 text-[14px] text-[var(--color-text-muted)]">{s.role}</p>

                  <h4 className="mt-4 text-[19px] font-bold leading-snug text-[var(--color-text-primary)]">
                    {s.impact}
                  </h4>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                    {s.body}
                  </p>

                  <span className="mt-5 inline-flex w-fit items-center rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.06] px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-widest text-[var(--color-accent)]">
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
