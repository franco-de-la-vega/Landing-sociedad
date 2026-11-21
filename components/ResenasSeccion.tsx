"use client";

import { useEffect, useState } from "react";

interface Resena {
  id: string;
  usuario: string;
  mes: string;
  estrellas: number;
  texto: string;
}

/**
 * Reseñas de alumnos (las que el equipo publicó desde el CRM). Si todavía no hay
 * ninguna publicada, o falla la carga, la sección no aparece. Usa los colores de
 * la página donde está (home o /aplicar), por eso solo variables del tema.
 */
export default function ResenasSeccion({ max = 6 }: { max?: number }) {
  const [resenas, setResenas] = useState<Resena[]>([]);

  useEffect(() => {
    let vivo = true;
    fetch("/api/resenas")
      .then((r) => (r.ok ? r.json() : { resenas: [] }))
      .then((j: { resenas?: Resena[] }) => {
        if (vivo) setResenas((j.resenas ?? []).slice(0, max));
      })
      .catch(() => undefined);
    return () => {
      vivo = false;
    };
  }, [max]);

  if (resenas.length === 0) return null;

  return (
    <section className="relative z-10 border-t border-[var(--color-border)] px-6 py-16 sm:py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">Lo que dicen nuestros alumnos</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-4xl">Formación completada, resultados reales.</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resenas.map((r) => (
            <figure key={r.id} className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <div className="text-xl tracking-[3px] text-[var(--color-accent)]" role="img" aria-label={`${r.estrellas} de 5 estrellas`}>
                {"★".repeat(r.estrellas)}
                <span className="text-[var(--color-border-strong)]">{"★".repeat(5 - r.estrellas)}</span>
              </div>
              <blockquote className="flex-1 whitespace-pre-wrap break-words text-[15.5px] leading-relaxed text-[var(--color-text-primary)]">{r.texto}</blockquote>
              <figcaption className="border-t border-[var(--color-border)] pt-3.5">
                <span className="block text-[15px] font-medium text-[var(--color-text-primary)]">{r.usuario}</span>
                <span className="mt-0.5 block text-[13px] text-[var(--color-text-muted)]">{r.mes}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
