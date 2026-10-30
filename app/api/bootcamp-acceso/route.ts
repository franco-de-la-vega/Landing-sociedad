import { NextRequest, NextResponse } from "next/server";
import { BOOTCAMP_COOKIE, bootcampToken, normalizeCode } from "@/lib/bootcampAuth";

export async function POST(req: NextRequest) {
  const token = await bootcampToken();
  const body = await req.json().catch(() => ({}));
  const code = typeof body.code === "string" ? normalizeCode(body.code) : "";

  if (!token || !code || code !== process.env.BOOTCAMP_CODE) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(BOOTCAMP_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
