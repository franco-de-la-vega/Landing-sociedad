import { Check, Minus } from "lucide-react";
import Reveal from "@/components/Reveal";
import CohortCountdown from "./CohortCountdown";

type Cell = true | false | string;

const rows: { label: string; junior: Cell; ht: Cell; carrera: Cell }[] = [
  { label: "Fundamentos", junior: true, ht: true, carrera: true },
  { label: "Discovery", junior: true, ht: true, carrera: true },
  { label: "CRM", junior: true, ht: true, carrera: true },
  { label: "Objeciones", junior: true, ht: "Avanzado", carrera: "Avanzado" },
  { label: "High Ticket", junior: false, ht: true, carrera: true },
  { label: "Performance", junior: true, ht: "Avanzado", carrera: "Avanzado" },
  { label: "IA + Data", junior: "Intro", ht: true, carrera: true },
  { label: "Portafolio", junior: "Básico", ht: "Comercial", carrera: "Profesional" },
  { label: "Empleabilidad", junior: "Intro", ht: "Parcial", carrera: "Completa" },
  { label: "Gate profesional", junior: false, ht: false, carrera: true },
  { label: "Vinculación", junior: "Condicional", ht: true, carrera: true },
];

function CellValue({ value }: { value: Cell }) {
  if (value === true)
    return <Check size={16} strokeWidth={2.5} className="mx-auto text-[var(--color-accent)]" />;
  if (value === false)
    return <Minus size={14} strokeWidth={2} className="mx-auto text-[var(--color-text-muted)]/40" />;
  return <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">{value}</span>;
}

export default function PlanComparisonSection() {
  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Niveles de formación
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2.2rem] font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] md:text-[2.8rem]">
            ¿Qué diferencia hay entre los niveles?
          </h2>
        </Reveal>

        <Reveal delay={0.16} className="mt-12">
          <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                  <th className="px-5 py-4 text-[13px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                    &nbsp;
                  </th>
                  <th className="px-4 py-4 text-center text-[14px] font-bold text-[var(--color-text-primary)]">
                    Comercial Junior
                  </th>
                  <th className="px-4 py-4 text-center text-[14px] font-bold text-[var(--color-text-primary)]">
                    Comercial High Ticket
                  </th>
                  <th className="px-4 py-4 text-center text-[14px] font-bold text-[var(--color-accent)]">
                    Carrera
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={r.label}
                    className={i % 2 === 0 ? "bg-[var(--color-bg-elevated)]" : "bg-[var(--color-bg-base)]"}
                  >
                    <td className="px-5 py-3.5 text-[14px] font-medium text-[var(--color-text-primary)]">
                      {r.label}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <CellValue value={r.junior} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <CellValue value={r.ht} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <CellValue value={r.carrera} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <div className="mt-20 mb-4">
          <CohortCountdown />
        </div>
      </div>
    </section>
  );
}
