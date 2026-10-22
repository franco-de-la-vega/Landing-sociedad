import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-serif",
});

const DESCRIPTION =
  "Formación para trabajar como representante comercial remoto: desde tu casa, para empresas del exterior y cobrando en dólares.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.formlat.com"),
  title: "Instituto Latinoamericano de Formación Comercial · Carrera de Representante Comercial Remoto",
  description: DESCRIPTION,
  openGraph: {
    title: "Aprendé la habilidad que mueve el mundo",
    description: DESCRIPTION,
    siteName: "Instituto Latinoamericano de Formación Comercial",
    locale: "es_LA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aprendé la habilidad que mueve el mundo",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="theme-light font-sans antialiased bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
