/**
 * SERVIDOR. Reseñas que los alumnos dejan en el campus y el equipo marca como
 * publicadas (tabla `resenas` del CRM). Se leen con la misma service-role key
 * que el resto de la landing (ver agendaCrm.ts) y solo se devuelven las
 * publicadas, ya listas para mostrar: sin ids de alumno ni datos de contacto.
 */

import { agendaCrmConfigurado, getJson } from "@/lib/agendaCrm";

export interface ResenaPublica {
  id: string;
  /** "@nombreyapellido": solo letras y números, sin tildes ni espacios. */
  usuario: string;
  /** "noviembre 2026". */
  mes: string;
  estrellas: number;
  texto: string;
}

interface Fila {
  id: string;
  nombre: string;
  estrellas: number;
  texto: string;
  creado_en: string;
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function usuarioDe(nombre: string): string {
  const limpio = nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return `@${limpio || "alumno"}`;
}

function mesDe(creadoEn: string): string {
  const f = new Date(creadoEn);
  if (Number.isNaN(f.getTime())) return "";
  return `${MESES[f.getMonth()]} ${f.getFullYear()}`;
}

/** Las últimas reseñas publicadas. Si algo falla o no está configurado, devuelve [] y la sección no se muestra. */
export async function resenasPublicadas(limite = 12): Promise<ResenaPublica[]> {
  if (!agendaCrmConfigurado) return [];
  try {
    const filas = await getJson<Fila[]>(`resenas?publicada=eq.true&select=id,nombre,estrellas,texto,creado_en&order=creado_en.desc&limit=${limite}`);
    return filas.map((f) => ({ id: f.id, usuario: usuarioDe(f.nombre), mes: mesDe(f.creado_en), estrellas: f.estrellas, texto: f.texto }));
  } catch {
    return [];
  }
}
