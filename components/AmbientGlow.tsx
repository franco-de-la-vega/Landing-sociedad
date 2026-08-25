export default function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 z-0 h-[350px] w-[min(800px,100vw)] -translate-x-1/2 bg-[var(--color-accent)]/[0.06] blur-[120px]"
    />
  );
}
