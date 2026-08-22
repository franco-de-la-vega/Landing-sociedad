export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 text-center">
        <span className="text-[13px] tracking-tight text-text-muted">
          Instituto Latinoamericano de Formación Comercial
        </span>
        <span className="text-[12px] text-text-muted/70">
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
