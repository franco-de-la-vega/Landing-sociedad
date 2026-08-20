export default function Watermark({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute left-1/2 z-0 -translate-x-1/2 whitespace-nowrap text-[15vw] font-black uppercase leading-none text-white/[0.02] ${className ?? ""}`}
    >
      {text}
    </span>
  );
}
