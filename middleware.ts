import { NextRequest, NextResponse } from "next/server";

const USER = process.env.PRESENTACION_USER || "ilfc";
const PASS = process.env.PRESENTACION_PASS || "ILFC2026equipo";

export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const [user, pass] = atob(encoded).split(":");
      if (user === USER && pass === PASS) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Acceso restringido", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Presentación ILFC"',
    },
  });
}

export const config = {
  matcher: ["/presentacion/:path*"],
};
