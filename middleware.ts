import { NextRequest, NextResponse } from "next/server";

const USER = process.env.PRESENTACION_USER || "ilfc";
const PASS = process.env.PRESENTACION_PASS || "ILFC2026equipo";
const COOKIE_NAME = "ilfc_pres_auth";

function expectedToken() {
  return Buffer.from(`${USER}:${PASS}`).toString("base64");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/presentacion/login") {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (cookie === expectedToken()) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/presentacion/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/presentacion/:path*"],
};
