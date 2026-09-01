export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center">
        <span className="text-[13px] tracking-tight text-[var(--color-text-muted)]">
          Instituto Latinoamericano de Formación Comercial
        </span>

        {/* TODO: agregar razón social / número de identificación fiscal
            (PF o PJ) apenas Franco lo confirme, para cumplir el requisito
            de dLocal Go de que la info legal figure en el sitio. */}

        <a
          href="mailto:franco.dlv77@gmail.com"
          className="text-[12.5px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
        >
          franco.dlv77@gmail.com
        </a>

        <nav className="flex items-center gap-4 text-[12.5px] text-[var(--color-text-muted)]">
          <a href="/contacto" className="transition-colors hover:text-[var(--color-accent)]">
            Contacto
          </a>
          <span aria-hidden>·</span>
          <a href="/terminos" className="transition-colors hover:text-[var(--color-accent)]">
            Términos y Condiciones
          </a>
        </nav>

        <span className="text-[12px] text-[var(--color-text-muted)]/70">
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
