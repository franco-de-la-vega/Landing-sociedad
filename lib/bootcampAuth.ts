// Acceso a /bootcamp con un código único para todos los alumnos.
// El código vive solo en la variable de entorno BOOTCAMP_CODE; sin ella nadie entra.
export const BOOTCAMP_COOKIE = "ilfc_bootcamp_auth";

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

// La cookie guarda un hash del código, nunca el código en sí.
export async function bootcampToken(): Promise<string | null> {
  const code = process.env.BOOTCAMP_CODE;
  if (!code) return null;
  return sha256(`ilfc-bootcamp:${code}`);
}

export function normalizeCode(value: string) {
  return value.trim();
}
