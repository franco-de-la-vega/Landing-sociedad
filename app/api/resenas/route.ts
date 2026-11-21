import { NextResponse } from "next/server";
import { resenasPublicadas } from "@/lib/resenas";

/**
 * Reseñas publicadas de los alumnos, para la home y para /aplicar.
 * Es público a propósito: solo devuelve las que el equipo marcó como publicadas.
 */

export const runtime = "nodejs";

export async function GET() {
  const resenas = await resenasPublicadas();
  return NextResponse.json({ resenas }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}
