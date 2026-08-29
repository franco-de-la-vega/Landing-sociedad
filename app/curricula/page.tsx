import type { Metadata } from "next";
import CurriculaHeader from "@/components/curricula/CurriculaHeader";
import CursorSpotlight from "@/components/presentation/CursorSpotlight";
import HeroSection from "@/components/curricula/HeroSection";
import WhatIsSection from "@/components/curricula/WhatIsSection";
import CapabilitiesSection from "@/components/curricula/CapabilitiesSection";
import MethodSection from "@/components/curricula/MethodSection";
import LevelsSection from "@/components/curricula/LevelsSection";
import CurriculumMapSection from "@/components/curricula/CurriculumMapSection";
import ProjectsSection from "@/components/curricula/ProjectsSection";
import PerformanceIntelligenceSection from "@/components/curricula/PerformanceIntelligenceSection";
import RemoteWorkSection from "@/components/curricula/RemoteWorkSection";
import PortfolioBrandSection from "@/components/curricula/PortfolioBrandSection";
import EmployabilityGatesSection from "@/components/curricula/EmployabilityGatesSection";
import CtaSection from "@/components/curricula/CtaSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Currícula · Closer Comercial | ILFC",
  description:
    "Malla curricular, método, proyectos, performance y empleabilidad del Instituto Latinoamericano de Formación Comercial.",
};

export default function CurriculaPage() {
  return (
    <div className="theme-light min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      <CursorSpotlight />
      <CurriculaHeader />
      <main>
        <HeroSection />
        <WhatIsSection />
        <CapabilitiesSection />
        <MethodSection />
        <LevelsSection />
        <CurriculumMapSection />
        <ProjectsSection />
        <PerformanceIntelligenceSection />
        <RemoteWorkSection />
        <PortfolioBrandSection />
        <EmployabilityGatesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
