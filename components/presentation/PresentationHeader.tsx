export default function PresentationHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0C0E]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        <span className="text-[12px] font-semibold leading-tight tracking-tight text-white sm:text-[14px]">
          Instituto Latinoamericano de Formación Comercial
        </span>
        <span className="hidden shrink-0 text-[11px] uppercase tracking-[0.2em] text-zinc-500 sm:block">
          Presentación en vivo
        </span>
      </div>
    </header>
  );
}
