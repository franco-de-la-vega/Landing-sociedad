import Logo from "@/components/Logo";

export default function PresentationHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-base)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4 md:px-10">
        <Logo className="h-8 w-8 shrink-0 text-[var(--color-accent)] sm:h-9 sm:w-9" />
        <span className="text-[17px] font-semibold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-[19px]">
          Instituto Latinoamericano de Formación Comercial
        </span>
      </div>
    </header>
  );
}
