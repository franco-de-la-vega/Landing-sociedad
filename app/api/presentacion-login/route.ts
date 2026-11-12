import { NextRequest, NextResponse } from "next/server";

// Usuario y clave solo desde la configuración (Vercel / .env.local), nunca escritos en el código.
const USER = process.env.PRESENTACION_USER;
const PASS = process.env.PRESENTACION_PASS;
const COOKIE_NAME = "ilfc_pres_auth";

export async function POST(req: NextRequest) {
  const { user, pass } = await req.json();

  if (!USER || !PASS || user !== USER || pass !== PASS) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = Buffer.from(`${USER}:${PASS}`).toString("base64");
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
