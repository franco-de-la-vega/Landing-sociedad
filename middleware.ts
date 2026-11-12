import { NextRequest, NextResponse } from "next/server";
import { BOOTCAMP_COOKIE, bootcampToken } from "@/lib/bootcampAuth";

// Usuario y clave solo desde la configuración (Vercel / .env.local), nunca escritos en el código.
// Si faltan, la presentación queda cerrada.
const USER = process.env.PRESENTACION_USER;
const PASS = process.env.PRESENTACION_PASS;
const COOKIE_NAME = "ilfc_pres_auth";

function expectedToken() {
  return Buffer.from(`${USER}:${PASS}`).toString("base64");
}

async function guardBootcamp(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/interno/bootcamp/acceso") {
    return NextResponse.next();
  }

  const token = await bootcampToken();
  if (token && req.cookies.get(BOOTCAMP_COOKIE)?.value === token) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/interno/bootcamp/acceso", req.url));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/interno/bootcamp" || pathname.startsWith("/interno/bootcamp/")) {
    return guardBootcamp(req);
  }

  if (pathname === "/presentacion/login") {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (USER && PASS && cookie === expectedToken()) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/presentacion/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/presentacion/:path*", "/presentacion2.1.1", "/interno/bootcamp", "/interno/bootcamp/:path*"],
};
