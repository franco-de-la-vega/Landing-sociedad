import { NextRequest, NextResponse } from "next/server";
import { alertFailure, notify } from "@/lib/alert";
import { isHoneypotFilled } from "@/lib/antiSpam";

export async function POST(req: NextRequest) {
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
    await notify(
      "Nuevo mensaje de contacto",
      `Nombre: ${nombre.trim()}\nEmail: ${email.trim()}\n\nMensaje:\n${mensaje.trim()}`
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando mensaje de contacto:", err);
    await alertFailure("Falló un mensaje de contacto", `Nombre: ${nombre}\nEmail: ${email}`);
    return NextResponse.json({ ok: false, error: "network_error" }, { status: 502 });
  }
}
