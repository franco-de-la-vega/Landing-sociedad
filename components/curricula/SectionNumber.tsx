export default function SectionNumber({ n }: { n: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none text-[9rem] font-bold leading-none text-[var(--color-accent)] opacity-[0.05] sm:left-6 sm:translate-x-0 md:text-[12rem]"
    >
      {n}
    </span>
  );
}
