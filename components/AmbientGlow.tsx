export default function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 z-0 h-[350px] w-[800px] -translate-x-1/2 bg-gradient-to-tr from-cyan-500/10 via-emerald-500/5 to-transparent blur-[120px]"
    />
  );
}
