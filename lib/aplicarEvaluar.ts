/**
 * SOLO SERVIDOR. Decide quién califica. El navegador nunca ve estas reglas.
 *
 * Corte duro (no califica, pase lo que pase con el resto):
 *  - busca que le consigan trabajo, o "todavía no sé"
 *  - hoy no puede invertir
 *  - quiere empezar "más adelante"
 *  - alguna respuesta de texto sin contenido real, o formulario incompleto
 * El resto suma puntos; hace falta llegar a UMBRAL.
 */

import { O, flujoCompleto, type Resp } from "@/lib/aplicarFlow";

export type Categoria = "trabajo" | "momento" | "perfil";
export type Veredicto = { califica: true; score: number } | { califica: false; categoria: Categoria; motivo: string; score: number };

const UMBRAL = 4;

export function evaluar(r: Resp): Veredicto {
  if (!flujoCompleto(r)) return { califica: false, categoria: "perfil", motivo: "formulario incompleto o con respuestas sin contenido", score: 0 };

  if (r.busca === O.busca.trabajo) return { califica: false, categoria: "trabajo", motivo: "busca que le consigan trabajo, no formarse", score: 0 };
  if (r.busca === O.busca.nose) return { califica: false, categoria: "perfil", motivo: "curioso: todavía no sabe qué busca", score: 0 };
  if (r.inversion === O.inversion.no) return { califica: false, categoria: "momento", motivo: "hoy no puede invertir", score: 0 };
  if (r.cuando === O.cuando.masAdelante) return { califica: false, categoria: "momento", motivo: "quiere empezar más adelante", score: 0 };

  let score = 0;
  score += r.inversion === O.inversion.ahora ? 3 : 1;
  score += r.cuando === O.cuando.ya ? 2 : 1;
  score += r.horas === O.horas.mas10 || r.horas === O.horas.cinco10 ? 2 : r.horas === O.horas.tres5 ? 1 : -1;
  if (r.tiempo_busca !== O.tiempoBusca.poco) score += 1;
  if (r.intento && r.intento !== O.intento.nunca) score += 1;

  if (score < UMBRAL) return { califica: false, categoria: "perfil", motivo: `puntaje bajo (${score}/${UMBRAL})`, score };
  return { califica: true, score };
}
