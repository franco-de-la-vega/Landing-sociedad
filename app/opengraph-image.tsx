import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Tarjeta que aparece al compartir formlat.com (WhatsApp, Meta, etc.)
export const alt = "Instituto Latinoamericano de Formación Comercial: aprendé la habilidad que mueve el mundo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Inter en negrita, igual que el sitio. Si Google Fonts no responde, queda la fuente por defecto.
async function loadInter(weight: number) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`)).text();
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo.svg"));
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const [bold, semibold] = await Promise.all([loadInter(800), loadInter(600)]);
  const fonts = [
    ...(bold ? [{ name: "Inter", data: bold, weight: 800 as const }] : []),
    ...(semibold ? [{ name: "Inter", data: semibold, weight: 600 as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f8f6f2",
          color: "#1c1a16",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={64} height={64} alt="" />
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.5 }}>
            Instituto Latinoamericano de Formación Comercial
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 22, fontWeight: 600, letterSpacing: 4, color: "#8a8377", textTransform: "uppercase" }}>
            Carrera de Representante Comercial Remoto
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 24, fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>
            <span>Aprendé la habilidad</span>
            <span>
              que <span style={{ color: "#8f6c30", marginLeft: 22 }}>mueve el mundo.</span>
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["Desde tu casa", "Para empresas del exterior", "En dólares"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "12px 24px",
                borderRadius: 999,
                border: "2px solid rgba(28,26,22,0.12)",
                background: "#ffffff",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
