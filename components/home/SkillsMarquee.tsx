const SKILLS = [
  "Negociación",
  "Discovery",
  "Manejo de objeciones",
  "Cierre",
  "Propuesta de valor",
  "Storytelling",
  "Videollamadas",
  "CRM",
  "Seguimiento",
  "Persuasión",
];

export default function SkillsMarquee() {
  const loop = [...SKILLS, ...SKILLS];
  return (
    <section aria-label="Lo que vas a dominar" className="relative overflow-hidden border-y border-black/10 bg-[var(--color-bg-elevated)] py-7 sm:py-9">
      <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
        <div className="flex shrink-0 animate-[marquee_48s_linear_infinite] items-center gap-8 pr-8">
          {loop.map((s, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-text-secondary)] sm:text-2xl">{s}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" className="text-[var(--color-accent)]" aria-hidden>
                <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="currentColor" />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
