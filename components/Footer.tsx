import Logo from "./Logo";

const columns = [
  {
    title: "Instituto",
    links: [
      { label: "Cómo funciona", href: "/#metodo" },
      { label: "Aplicar", href: "/aplicar" },
    ],
  },
  {
    title: "Contacto",
    links: [
      { label: "Escribinos", href: "/contacto" },
      { label: "ilfcformacion@gmail.com", href: "mailto:ilfcformacion@gmail.com" },
    ],
  },
  {
    title: "Legal",
    links: [{ label: "Términos y Condiciones", href: "/terminos" }],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--color-text-primary)] text-white">
      <div className="mx-auto max-w-7xl px-6 pt-20 md:px-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="h-10 w-10 text-[var(--color-accent)]" />
            <p className="mt-6 max-w-sm text-2xl font-semibold leading-snug tracking-tight">
              Formamos profesionales comerciales para trabajar{" "}
              <span className="font-serif-display font-normal italic text-[var(--color-accent)]">sin fronteras.</span>
            </p>
            <a
              href="/aplicar"
              className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
            >
              Quiero empezar
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {columns.map((c) => (
              <div key={c.title}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">{c.title}</div>
                <ul className="mt-5 flex flex-col gap-3">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="break-all text-[14px] text-white/75 transition-colors hover:text-white">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          aria-hidden
          className="mt-20 select-none whitespace-nowrap text-center text-[22vw] font-black leading-[0.8] tracking-[-0.06em] text-white/[0.06] lg:text-[16rem]"
        >
          ILFC
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-7 text-[12px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Instituto Latinoamericano de Formación Comercial</span>
          <span>Andres Felipe Herrera · NIT 1110510711-7 (Colombia)</span>
        </div>
      </div>
    </footer>
  );
}
