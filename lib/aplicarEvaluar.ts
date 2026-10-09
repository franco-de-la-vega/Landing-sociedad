/**
 * SOLO SERVIDOR. Decide quién califica. El navegador nunca ve estas reglas.
 *
 * Corte duro (no califica, pase lo que pase con el resto):
 *  - busca que le consigan trabajo ("todavía no sé qué busco" NO descarta: casi nadie llega sabiéndolo)
 *  - hoy no puede invertir
 *  - quiere empezar "más adelante"
 *  - alguna respuesta de texto sin contenido real, o formulario incompleto
 * Todo lo demás califica (sin puntaje: Franco prefiere poca fricción).
 */

import { O, flujoCompleto, type Resp } from "@/lib/aplicarFlow";

export type Categoria = "trabajo" | "momento" | "perfil";
export type Veredicto = { califica: true; score: number } | { califica: false; categoria: Categoria; motivo: string; score: number };

export function evaluar(r: Resp): Veredicto {
  if (!flujoCompleto(r)) return { califica: false, categoria: "perfil", motivo: "formulario incompleto o con respuestas sin contenido", score: 0 };

  if (r.busca === O.busca.trabajo) return { califica: false, categoria: "trabajo", motivo: "busca que le consigan trabajo, no formarse", score: 0 };
  if (r.inversion === O.inversion.no) return { califica: false, categoria: "momento", motivo: "hoy no puede invertir", score: 0 };
  if (r.cuando === O.cuando.masAdelante) return { califica: false, categoria: "momento", motivo: "quiere empezar más adelante", score: 0 };

  // Sin puntaje: solo descartan los "no" claros de arriba. El resto pasa y llega al closer con todas sus respuestas.
  const score = 0;
  return { califica: true, score };
}
