import { Check, Minus } from "lucide-react";
import Reveal from "@/components/Reveal";

type Cell = true | false | string;

const rows: { label: string; junior: Cell; ht: Cell; carrera: Cell }[] = [
  { label: "Fundamentos", junior: true, ht: true, carrera: true },
  { label: "Discovery", junior: true, ht: true, carrera: true },
  { label: "CRM", junior: true, ht: true, carrera: true },
  { label: "Objeciones", junior: true, ht: "Avanzado", carrera: "Avanzado" },
  { label: "High Ticket", junior: false, ht: true, carrera: true },
  { label: "Performance", junior: true, ht: "Avanzado", carrera: "Avanzado" },
  { label: "Portafolio", junior: "Básico", ht: "Comercial", carrera: "Profesional" },
  { label: "Empleabilidad", junior: "Intro", ht: "Parcial", carrera: "Completa" },
  { label: "Gate profesional", junior: false, ht: false, carrera: true },
  { label: "Vinculación", junior: "Condicional", ht: true, carrera: true },
];

function CellValue({ value, strong }: { value: Cell; strong?: boolean }) {
  if (value === true)
    return (
      <Check
        size={strong ? 18 : 16}
        strokeWidth={2.5}
        className={`mx-auto ${strong ? "text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"}`}
      />
    );
  if (value === false)
    return <Minus size={14} strokeWidth={2} className="mx-auto text-[var(--color-text-muted)]/40" />;
  return (
    <span
      className={`text-[13px] leading-snug ${
        strong ? "font-bold text-[var(--color-accent)]" : "font-medium text-[var(--color-text-secondary)]"
      }`}
    >
      {value}
    </span>
  );
}

export default function PlanComparisonSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center border-t border-[var(--color-border)] px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Niveles de formación
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-4">
          <h2 className="max-w-2xl text-[1.9rem] font-bold leading-[1.15] tracking-tight text-[var(--color-text-primary)] md:text-[2.4rem]">
            ¿Qué diferencia hay entre los niveles?
          </h2>
        </Reveal>

        <Reveal delay={0.16} className="mt-9">
          <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                    &nbsp;
                  </th>
                  <th className="px-4 py-4 text-center text-[13.5px] font-bold text-[var(--color-text-secondary)]">
                    Comercial Junior
                  </th>
                  <th className="relative px-4 py-4 text-center text-[13.5px] font-bold text-[var(--color-text-primary)]">
                    Comercial High Ticket
                  </th>
                  <th className="relative px-4 py-4 text-center text-[14px] font-black text-[var(--color-accent)]">
                    Carrera Completa
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={r.label}
                    className={i !== rows.length - 1 ? "border-b border-[var(--color-border)]" : ""}
                  >
                    <td className="px-5 py-3.5 text-[13.5px] font-medium text-[var(--color-text-primary)]">
                      {r.label}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <CellValue value={r.junior} />
                    </td>
                    <td className="relative bg-[var(--color-accent)]/[0.025] px-4 py-3.5 text-center">
                      <CellValue value={r.ht} />
                    </td>
                    <td className="relative bg-[var(--color-accent)]/[0.06] px-4 py-3.5 text-center">
                      <CellValue value={r.carrera} strong />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
