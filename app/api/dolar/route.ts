import { NextResponse } from "next/server";

// Dólar oficial en tiempo real, para la calculadora de /presentacion.
// dolarapi.com es pública, gratuita, sin key. Se cachea 5 minutos: el
// oficial no se mueve minuto a minuto y evita golpear la API en cada
// carga de la página.
export const revalidate = 300;

export async function GET() {
  try {
    const res = await fetch("https://dolarapi.com/v1/dolares/oficial", {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("dolarapi_error");
    const data = await res.json();
    const compra = Number(data.compra);
    const venta = Number(data.venta);
    if (!Number.isFinite(compra) || !Number.isFinite(venta)) throw new Error("dolarapi_bad_data");
    const promedio = (compra + venta) / 2;
    return NextResponse.json({
      ok: true,
      compra,
      venta,
      promedio,
      fechaActualizacion: data.fechaActualizacion,
    });
  } catch (err) {
    console.error("Error obteniendo cotización del dólar:", err);
    return NextResponse.json({ ok: false, error: "dolar_unavailable" }, { status: 502 });
  }
}
