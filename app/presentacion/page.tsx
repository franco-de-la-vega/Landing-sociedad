import type { Metadata } from "next";
import PresentationHeader from "@/components/presentation/PresentationHeader";
import CursorSpotlight from "@/components/presentation/CursorSpotlight";
import SectionNav from "@/components/presentation/SectionNav";
import HeroSection from "@/components/presentation/HeroSection";
import SystemStatementSection from "@/components/presentation/SystemStatementSection";
import MarketSection from "@/components/presentation/MarketSection";
import ROISection from "@/components/presentation/ROISection";
import MarketNeedsSection from "@/components/presentation/MarketNeedsSection";
import AdmissionCriteriaSection from "@/components/presentation/AdmissionCriteriaSection";
import SimulationSection from "@/components/presentation/SimulationSection";
import CurriculumSection from "@/components/presentation/CurriculumSection";
import PerformanceSystemSection from "@/components/presentation/PerformanceSystemSection";
import SupportSection from "@/components/presentation/SupportSection";
import EmployabilitySection from "@/components/presentation/EmployabilitySection";
import TimelineSection from "@/components/presentation/TimelineSection";
import SuccessStoriesSection from "@/components/presentation/SuccessStoriesSection";
import FAQSection from "@/components/presentation/FAQSection";
import PricingLadderSection from "@/components/presentation/PricingLadderSection";
import PlanComparisonSection from "@/components/presentation/PlanComparisonSection";
import PricingSection from "@/components/presentation/PricingSection";

export const metadata: Metadata = {
  title: "Instituto Latinoamericano de Formación Comercial — Presentación",
  description: "Presentación técnica para llamadas de venta en vivo.",
};

export default function PresentacionPage() {
  return (
    <div className="theme-light min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      <CursorSpotlight />
      <PresentationHeader />
      <SectionNav />
      <main>
        <HeroSection />
        <MarketSection />
        <ROISection />
        <MarketNeedsSection />
        <SystemStatementSection />
        <AdmissionCriteriaSection />
        <SimulationSection />
        <CurriculumSection />
        <PerformanceSystemSection />
        <SupportSection />
        <EmployabilitySection />
        <TimelineSection />
        <SuccessStoriesSection />
        <PricingLadderSection />
        <PlanComparisonSection />
        <FAQSection />
        <PricingSection />
      </main>
    </div>
  );
}
