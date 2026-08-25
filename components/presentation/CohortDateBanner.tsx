import { Calendar } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function CohortDateBanner() {
  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-[var(--color-accent)]/40 bg-[var(--color-accent-muted)] px-8 py-14 text-center md:px-16 md:py-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-bg-elevated)] px-4 py-1.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
              <Calendar size={14} strokeWidth={2.5} />
              Próxima camada
            </span>

            <h2 className="max-w-2xl text-[2.4rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[3.2rem]">
              Arrancamos el 18 de septiembre.
            </h2>

            <p className="max-w-xl text-[18px] leading-relaxed text-[var(--color-text-secondary)]">
              Los cupos son limitados y se cierran antes de esa fecha. Una vez
              que arranca la camada, el próximo ingreso queda para la
              siguiente.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
