import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Antes de agendar tu llamada",
  description: "Mirá el video, respondé unas preguntas y, si es para vos, agendá tu llamada con el equipo.",
  robots: { index: false, follow: false },
};

export default function AplicarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
