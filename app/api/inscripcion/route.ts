import { NextRequest, NextResponse } from "next/server";
import { alertFailure } from "@/lib/alert";
import { isHoneypotFilled } from "@/lib/antiSpam";

const NOTION_VERSION = "2022-06-28";

// NOTA (2026-09-03): este endpoint SOLO registra la inscripción en la base
// "Inscripciones ILFC". Antes también creaba/actualizaba una fila en la base
// "Alumnos" (la planilla de señas y % de Franco/Andrés), pero eso se sacó por
// pedido explícito: "Alumnos" es 100% manual. No volver a escribir ahí desde
// acá — si aparece una fila sola en esa base, es un bug.

export async function POST(req: NextRequest) {
  const notionToken = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!notionToken || !databaseId) {
    return NextResponse.json({ ok: false, error: "missing_notion_config" }, { status: 500 });
  }

  const body = await req.json();
  const {
    nombreCompleto,
    email,
    whatsapp,
    comoSeEntero,
    nivelVentas,
    plan,
    fechaPago,
    disponibilidad,
    objetivo3Meses,
    vendedor,
    sitioWeb,
  } = body;

  if (isHoneypotFilled(sitioWeb)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          "Nombre completo": { title: [{ text: { content: nombreCompleto } }] },
          Email: { email },
          WhatsApp: { phone_number: whatsapp },
          "Como se entero": { select: { name: comoSeEntero } },
          "Nivel de ventas": { select: { name: nivelVentas } },
          Plan: { select: { name: plan } },
          "Fecha de pago": { date: { start: fechaPago } },
          Disponibilidad: { select: { name: disponibilidad } },
          "Objetivo 3 meses": { rich_text: [{ text: { content: objetivo3Meses } }] },
          Vendedor: { select: { name: vendedor } },
        },
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      await alertFailure(
        "Falló una inscripción",
        `Nombre: ${nombreCompleto}\nWhatsApp: ${whatsapp}\n\n${errorBody.slice(0, 300)}`
      );
      return NextResponse.json({ ok: false, error: errorBody }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    await alertFailure(
      "Falló una inscripción (red)",
      `Nombre: ${nombreCompleto}\nWhatsApp: ${whatsapp}`
    );
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "network_error" },
      { status: 500 }
    );
  }
}
