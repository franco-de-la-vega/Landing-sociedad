/**
 * SOLO SERVIDOR. Decide quién califica. El navegador nunca ve estas reglas.
 *
 * ÚNICO corte (Franco, 2026-10-20): responde "No estoy dispuesto a invertir".
 * Todo lo demás califica: querer un trabajo es justo lo que busca el público del programa,
 * y "más adelante"/"todavía no sé" no descartan (el closer lo ve en las respuestas).
 */

import { O, flujoCompleto, type Resp } from "@/lib/aplicarFlow";

export type Categoria = "trabajo" | "momento" | "perfil";
export type Veredicto = { califica: true; score: number } | { califica: false; categoria: Categoria; motivo: string; score: number };

export function evaluar(r: Resp): Veredicto {
  if (!flujoCompleto(r)) return { califica: false, categoria: "perfil", motivo: "formulario incompleto o con respuestas sin contenido", score: 0 };

  if (r.inversion === O.inversion.no) return { califica: false, categoria: "momento", motivo: "no está dispuesto a invertir", score: 0 };

  // Sin puntaje: solo descartan los "no" claros de arriba. El resto pasa y llega al closer con todas sus respuestas.
  const score = 0;
  return { califica: true, score };
}
