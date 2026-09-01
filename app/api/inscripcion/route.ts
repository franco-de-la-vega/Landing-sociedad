import { NextRequest, NextResponse } from "next/server";
import { alertFailure } from "@/lib/alert";
import { isHoneypotFilled } from "@/lib/antiSpam";

const NOTION_VERSION = "2022-06-28";
const ALUMNOS_DATABASE_ID = "3ca3d284-28ee-81e3-8343-f71a7bea47b5";

function normalizeNombre(n: string) {
  return n.trim().toLowerCase().replace(/\s+/g, " ");
}

// La API de Notion no permite filtrar "title equals" ignorando mayúsculas
// ni espacios extra, así que traemos todas las filas y comparamos acá con
// el nombre normalizado. Evita que "Cintia orlandi" (ya cargada a mano) y
// "Cintia Orlandi" (un reenvío del form) se traten como personas distintas
// y terminen duplicadas.
async function findAlumnoPorNombre(
  notionToken: string,
  nombreCompleto: string
): Promise<string | null> {
  const target = normalizeNombre(nombreCompleto);
  const headers = {
    Authorization: `Bearer ${notionToken}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };

  let cursor: string | undefined;
  do {
    const queryRes = await fetch(
      `https://api.notion.com/v1/databases/${ALUMNOS_DATABASE_ID}/query`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          page_size: 100,
          ...(cursor ? { start_cursor: cursor } : {}),
        }),
      }
    );

    if (!queryRes.ok) {
      throw new Error(`alumnos_query_failed: ${await queryRes.text()}`);
    }

    const queryData = await queryRes.json();
    for (const page of queryData.results || []) {
      const title = page.properties?.Nombre?.title?.[0]?.plain_text ?? "";
      if (normalizeNombre(title) === target) return page.id;
    }

    cursor = queryData.has_more ? queryData.next_cursor : undefined;
  } while (cursor);

  return null;
}

async function syncAlumno(
  notionToken: string,
  nombreCompleto: string,
  whatsapp: string,
  email: string,
  vendedor: string
) {
  const contacto = `${whatsapp} / ${email}`;
  const headers = {
    Authorization: `Bearer ${notionToken}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };

  const existingPageId = await findAlumnoPorNombre(notionToken, nombreCompleto);

  if (existingPageId) {
    const patchRes = await fetch(`https://api.notion.com/v1/pages/${existingPageId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        properties: {
          Contacto: { rich_text: [{ text: { content: contacto } }] },
          Vendedor: { select: { name: vendedor } },
        },
      }),
    });

    if (!patchRes.ok) {
      throw new Error(`alumnos_patch_failed: ${await patchRes.text()}`);
    }
    return;
  }

  const createRes = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers,
    body: JSON.stringify({
      parent: { database_id: ALUMNOS_DATABASE_ID },
      properties: {
        Nombre: { title: [{ text: { content: nombreCompleto } }] },
        Contacto: { rich_text: [{ text: { content: contacto } }] },
        Vendedor: { select: { name: vendedor } },
      },
    }),
  });

  if (!createRes.ok) {
    throw new Error(`alumnos_create_failed: ${await createRes.text()}`);
  }
}

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

    // Sincroniza (o crea) la fila correspondiente en la base "Alumnos".
    // Un fallo acá no debe romper la respuesta al formulario: la inscripción
    // ya quedó registrada en "Inscripciones ILFC", que es lo crítico.
    // Reintenta una vez antes de rendirse (la mayoría de los fallos son
    // hiccups transitorios de red/rate-limit, no errores permanentes).
    try {
      await syncAlumno(notionToken, nombreCompleto, whatsapp, email, vendedor);
    } catch (firstErr) {
      console.error("Error sincronizando con base 'Alumnos' (intento 1):", firstErr);
      try {
        await new Promise((r) => setTimeout(r, 1200));
        await syncAlumno(notionToken, nombreCompleto, whatsapp, email, vendedor);
        console.error(`Sync 'Alumnos' recuperado en el reintento para: ${nombreCompleto}`);
      } catch (secondErr) {
        console.error(
          `SYNC_ALUMNOS_FALLO_DEFINITIVO para "${nombreCompleto}" (revisar manualmente en Alumnos):`,
          secondErr
        );
        await alertFailure(
          "No se pudo sincronizar con Alumnos",
          `"${nombreCompleto}" quedó bien en Inscripciones ILFC, pero falló al copiarse a Alumnos. Agregala a mano.\nContacto: ${whatsapp} / ${email}`
        );
      }
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
