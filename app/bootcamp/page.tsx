import type { Metadata } from "next";
import BootcampGuide from "@/components/bootcamp/BootcampGuide";

export const metadata: Metadata = {
  title: "Guía del Bootcamp · ILFC",
  description: "Material de apoyo para estudiantes del Instituto Latinoamericano de Formación Comercial.",
  robots: { index: false, follow: false },
};

export default function BootcampPage() {
  return <BootcampGuide />;
}
