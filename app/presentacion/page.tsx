import type { Metadata } from "next";
import PresentationHeader from "@/components/presentation/PresentationHeader";
import ROISection from "@/components/presentation/ROISection";
import AdmissionCriteriaSection from "@/components/presentation/AdmissionCriteriaSection";
import MarketSection from "@/components/presentation/MarketSection";
import SimulationSection from "@/components/presentation/SimulationSection";
import CurriculumSection from "@/components/presentation/CurriculumSection";
import SupportSection from "@/components/presentation/SupportSection";
import TimelineSection from "@/components/presentation/TimelineSection";
import ComparisonSection from "@/components/presentation/ComparisonSection";
import SuccessStoriesSection from "@/components/presentation/SuccessStoriesSection";
import PricingSection from "@/components/presentation/PricingSection";

export const metadata: Metadata = {
  title: "Instituto Latinoamericano de Formación Comercial — Presentación",
  description: "Presentación técnica para llamadas de venta en vivo.",
};

export default function PresentacionPage() {
  return (
    <div className="theme-light min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      <PresentationHeader />
      <main>
        <ROISection />
        <AdmissionCriteriaSection />
        <MarketSection />
        <SimulationSection />
        <CurriculumSection />
        <SupportSection />
        <TimelineSection />
        <ComparisonSection />
        <SuccessStoriesSection />
        <PricingSection />
      </main>
    </div>
  );
}
