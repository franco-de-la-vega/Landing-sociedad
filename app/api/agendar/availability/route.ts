import { NextRequest, NextResponse } from "next/server";

const NOTION_VERSION = "2022-06-28";
const LEADS_DATABASE_ID = "3c63d284-28ee-81ae-991a-f362c63f3857"; // "Base de datos leads"
const VENDEDORES = ["Franco", "Natalia", "Andres"];

export async function GET(req: NextRequest) {
  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    return NextResponse.json({ ok: false, error: "missing_notion_config" }, { status: 500 });
  }

  const date = req.nextUrl.searchParams.get("date"); // "YYYY-MM-DD"
  const vendedor = req.nextUrl.searchParams.get("vendedor"); // opcional: link personal

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: "invalid_date" }, { status: 400 });
  }

  const dayStart = `${date}T00:00:00-03:00`;
  const dayEnd = `${date}T23:59:59-03:00`;

  const dueñoFilter = vendedor
    ? { property: "Dueño", select: { equals: vendedor } }
    : { or: VENDEDORES.map((v) => ({ property: "Dueño", select: { equals: v } })) };

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${LEADS_DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          and: [
            dueñoFilter,
            { property: "Fecha y hora de llamada", date: { on_or_after: dayStart } },
            { property: "Fecha y hora de llamada", date: { on_or_before: dayEnd } },
          ],
        },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "notion_error" }, { status: 502 });
    }

    const data = await res.json();
    type Row = { properties?: Record<string, { date?: { start?: string }; select?: { name?: string } }> };

    // Por cada hora, qué vendedores ya tienen ese horario ocupado.
    const takenByHour = new Map<number, Set<string>>();
    for (const page of (data.results || []) as Row[]) {
      const iso = page.properties?.["Fecha y hora de llamada"]?.date?.start;
      const dueño = page.properties?.["Dueño"]?.select?.name;
      if (!iso || !dueño) continue;
      const match = iso.match(/T(\d{2}):/);
      if (!match) continue;
      const hour = parseInt(match[1], 10);
      if (!takenByHour.has(hour)) takenByHour.set(hour, new Set());
      takenByHour.get(hour)!.add(dueño);
    }

    // En modo "link personal" (vendedor fijo), la hora está ocupada apenas
    // ese vendedor la tiene tomada. En modo pool, solo si los 3 la tienen
    // tomada (todavía hay alguien disponible).
    const totalVendedores = vendedor ? 1 : VENDEDORES.length;
    const bookedHours = Array.from(takenByHour.entries())
      .filter(([, vendedores]) => vendedores.size >= totalVendedores)
      .map(([hour]) => hour);

    return NextResponse.json({ ok: true, bookedHours });
  } catch {
    return NextResponse.json({ ok: false, error: "network_error" }, { status: 502 });
  }
}
