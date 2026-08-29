import Logo from "@/components/Logo";

export default function CurriculaHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-base)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4 md:px-10">
        <Logo className="h-8 w-8 shrink-0 text-[var(--color-accent)] sm:h-9 sm:w-9" />
        <span className="text-[20.5px] font-semibold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-[22.5px]">
          Currícula · Closer Comercial
        </span>
        <span className="ml-auto hidden text-[15px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)] sm:block">
          Instituto Latinoamericano de Formación Comercial
        </span>
      </div>
    </header>
  );
}
