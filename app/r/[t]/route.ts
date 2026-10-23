import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Link corto para confirmar/cancelar una llamada: formlat.com/r/<código>.
 * Redirige a la página del CRM donde la persona elige (el código es el mismo, lo valida el CRM).
 */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ t: string }> }) {
  const { t } = await ctx.params;
  const limpio = encodeURIComponent(decodeURIComponent(t).slice(0, 200));
  return NextResponse.redirect(`https://campus.formlat.com/reunion?t=${limpio}`, 307);
}
