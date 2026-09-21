import Reveal from "@/components/Reveal";
import RevealGroup from "@/components/RevealGroup";
import RevealItem from "@/components/RevealItem";

const items = [
  {
    label: "Call Recording · Diagnóstico",
    badge: "Evaluado",
    live: true,
    content: (
      <>
        <div className="mt-6 flex h-14 items-center gap-[3px]">
          {[6, 14, 22, 12, 28, 18, 9, 24, 15, 20, 8, 16, 26, 11, 19].map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-[var(--color-accent)]"
              style={{ height: `${h}px`, opacity: 0.35 + (i % 5) * 0.13 }}
            />
          ))}
        </div>
      </>
    ),
  },
  {
    label: "WhatsApp · Follow-up",
    content: (
      <div className="mt-6 flex flex-col gap-2">
        <div className="ml-auto w-[75%] rounded-xl rounded-tr-sm bg-[var(--color-accent)]/15 px-3 py-2 text-[12.5px] text-[var(--color-text-secondary)]">
          Quedamos en retomar el jueves
        </div>
        <div className="w-[65%] rounded-xl rounded-tl-sm bg-[var(--color-border)]/60 px-3 py-2 text-[12.5px] text-[var(--color-text-secondary)]">
          Perfecto, ahí estoy
        </div>
      </div>
    ),
  },
  {
    label: "Performance Report",
    content: (
      <div className="mt-6 flex items-end gap-2.5">
        {[38, 62, 48, 74, 56].map((h, i) => (
          <span key={i} className="w-5 rounded-sm bg-[var(--color-accent)]/30" style={{ height: `${h}px` }} />
        ))}
      </div>
    ),
  },
];

export default function SupportSection() {
  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Portafolio de evidencia
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2.4rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.3rem]">
            Tu formación deja huella.
          </h2>
        </Reveal>
        <Reveal delay={0.14} className="mt-4">
          <p className="max-w-xl text-[18px] leading-relaxed text-[var(--color-text-secondary)]">
            Esto es lo que la empresa ve cuando llegás a la etapa de{" "}
            <span className="font-semibold text-[var(--color-text-primary)]">salida a mercado</span>:
            no un CV genérico,{" "}
            <span className="font-semibold text-[var(--color-accent)]">evidencia real</span> de cómo{" "}
            <span className="font-semibold text-[var(--color-accent)]">ejecutás</span>.
          </p>
        </Reveal>

        <RevealGroup stagger={0.08} className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {items.map((it) => (
            <RevealItem key={it.label}>
              <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[0_16px_40px_-24px_rgba(20,18,14,0.2)]">
                <div className="flex items-center gap-2">
                  {it.live && <span className="h-2 w-2 rounded-full bg-red-400" />}
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                    {it.label}
                  </span>
                </div>
                {it.content}
                {it.badge && (
                  <span className="mt-6 inline-flex w-fit items-center rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/8 px-3 py-1 text-[11px] uppercase tracking-widest text-[var(--color-accent)]">
                    {it.badge}
                  </span>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-10">
          <p className="max-w-2xl text-[17px] leading-relaxed text-[var(--color-text-muted)]">
            La vinculación con empresas es posterior a la formación y está
            condicionada a tu desempeño evaluado y a la disponibilidad de
            oportunidades en cada momento. La contratación final depende
            también del proceso de selección de cada empresa.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
