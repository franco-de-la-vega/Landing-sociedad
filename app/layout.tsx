import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Instituto Latinoamericano de Formación Comercial: Formación de closers y setters B2B",
  description:
    "Programa de formación y conexión laboral para closers y setters de ventas remotas B2B.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans antialiased bg-bg-base text-text-primary">
        {children}
      </body>
    </html>
  );
}
