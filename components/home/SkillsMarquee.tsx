const ROW_A = ["Negociación", "Discovery", "Manejo de objeciones", "Cierre", "Propuesta de valor", "Storytelling"];
const ROW_B = ["Videollamadas", "CRM", "Seguimiento", "Diagnóstico", "Persuasión", "Liderazgo comercial"];

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className={`flex shrink-0 items-center gap-10 pr-10 ${reverse ? "animate-[marquee_42s_linear_infinite_reverse]" : "animate-[marquee_36s_linear_infinite]"}`}>
        {loop.map((s, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className={i % 2 ? "font-serif-display text-4xl italic text-[var(--color-accent-hover)] sm:text-6xl" : "text-4xl font-bold tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-6xl"}>
              {s}
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-[var(--color-accent)]" aria-hidden>
              <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsMarquee() {
  return (
    <section aria-label="Lo que vas a dominar" className="relative overflow-hidden border-y border-black/10 bg-[var(--color-bg-elevated)] py-12 sm:py-16">
      <div className="flex flex-col gap-6 sm:gap-8">
        <Row items={ROW_A} />
        <Row items={ROW_B} reverse />
      </div>
    </section>
  );
}
