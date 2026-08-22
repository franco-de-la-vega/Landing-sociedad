import { Check, X } from "lucide-react";
import Reveal from "@/components/Reveal";

const columns = ["Universidad", "Cursos Baratos", "Autodidacta", "Instituto"];

const rows = [
  { label: "Velocidad de inserción laboral", values: [false, false, false, true] },
  { label: "Mentoría 1 a 1 con especialistas", values: [false, false, false, true] },
  { label: "Simulación de llamadas reales", values: [false, false, false, true] },
  { label: "Evaluación objetiva de desempeño", values: [true, false, false, true] },
  { label: "Costo accesible", values: [false, true, true, true] },
  { label: "Conexión directa con empresas", values: [false, false, false, true] },
];

export default function ComparisonSection() {
  return (
    <section className="relative border-t border-white/10 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            Matriz comparativa de alternativas
          </span>
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className="max-w-2xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white md:text-[2.8rem]">
            Comparativa de Vías de Formación
          </h2>
        </Reveal>

        <Reveal delay={0.14} className="mt-16 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse overflow-hidden rounded-2xl border border-white/10 bg-[#121418]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-5 py-4 text-left text-[12px] font-medium uppercase tracking-widest text-zinc-500">
                  Criterio
                </th>
                {columns.map((c) => (
                  <th
                    key={c}
                    className={`px-5 py-4 text-center text-[13px] font-semibold ${
                      c === "Instituto" ? "bg-accent/[0.06] text-accent" : "text-zinc-400"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="px-5 py-4 text-[13.5px] text-zinc-300">{r.label}</td>
                  {r.values.map((v, i) => (
                    <td
                      key={i}
                      className={`px-5 py-4 text-center ${
                        columns[i] === "Instituto" ? "bg-accent/[0.04]" : ""
                      }`}
                    >
                      {v ? (
                        <Check
                          size={16}
                          strokeWidth={2.5}
                          className="mx-auto text-accent"
                        />
                      ) : (
                        <X size={15} strokeWidth={2} className="mx-auto text-zinc-600" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
