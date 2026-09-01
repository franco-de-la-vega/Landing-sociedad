import { NextRequest, NextResponse } from "next/server";
import { alertFailure } from "@/lib/alert";
import { isHoneypotFilled } from "@/lib/antiSpam";

const NOTION_VERSION = "2022-06-28";
const CONTACTO_DATABASE_ID = "3ce3d284-28ee-8185-9395-ecf99dcbc821"; // "Mensajes de Contacto (formlat.com)"

export async function POST(req: NextRequest) {
  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    return NextResponse.json({ ok: false, error: "missing_notion_config" }, { status: 500 });
  }

  const body = await req.json();
  const { nombre, email, mensaje, sitioWeb } = body as {
    nombre: string;
    email: string;
    mensaje: string;
    sitioWeb?: string; // honeypot
  };

  if (isHoneypotFilled(sitioWeb)) {
    return NextResponse.json({ ok: true });
  }

  if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
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
        parent: { database_id: CONTACTO_DATABASE_ID },
        properties: {
          Nombre: { title: [{ text: { content: nombre.trim() } }] },
          Email: { email: email.trim() },
          Mensaje: { rich_text: [{ text: { content: mensaje.trim() } }] },
          Estado: { select: { name: "Sin leer" } },
        },
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Error creando mensaje de contacto en Notion:", errorBody);
      await alertFailure("Falló un mensaje de contacto", `Nombre: ${nombre}\nEmail: ${email}\n\n${errorBody.slice(0, 300)}`);
      return NextResponse.json({ ok: false, error: "notion_error" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error de red enviando mensaje de contacto:", err);
    await alertFailure("Falló un mensaje de contacto (red)", `Nombre: ${nombre}\nEmail: ${email}`);
    return NextResponse.json({ ok: false, error: "network_error" }, { status: 502 });
  }
}
