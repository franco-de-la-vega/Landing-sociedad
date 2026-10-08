/** SOLO SERVIDOR. Firma/verifica el token que habilita agendar y la cookie de bloqueo. */

import { createHmac, timingSafeEqual } from "node:crypto";

function secreto(): string {
  const s = process.env.APLICAR_SECRET || process.env.LANDING_AGENDA_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV !== "production") return "dev-secreto-aplicar-local";
  throw new Error("falta APLICAR_SECRET (o LANDING_AGENDA_SECRET) en el entorno");
}

const b64 = (b: Buffer | string) => Buffer.from(b).toString("base64url");

export function firmar<T extends object>(payload: T, vigenciaMs: number): string {
  const cuerpo = b64(JSON.stringify({ ...payload, exp: Date.now() + vigenciaMs }));
  const firma = createHmac("sha256", secreto()).update(cuerpo).digest("base64url");
  return `${cuerpo}.${firma}`;
}

export function verificar<T extends object>(token: string | undefined | null): (T & { exp: number }) | null {
  if (!token) return null;
  const [cuerpo, firma] = token.split(".");
  if (!cuerpo || !firma) return null;
  try {
    const esperada = createHmac("sha256", secreto()).update(cuerpo).digest("base64url");
    const a = Buffer.from(firma);
    const b = Buffer.from(esperada);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const data = JSON.parse(Buffer.from(cuerpo, "base64url").toString()) as T & { exp: number };
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export const COOKIE = "apl";
export const DIAS_BLOQUEO = 30;
export const MS_DIA = 86_400_000;
