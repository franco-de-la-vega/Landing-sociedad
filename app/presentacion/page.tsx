import type { Metadata } from "next";
import PresentationHeader from "@/components/presentation/PresentationHeader";
import ROISection from "@/components/presentation/ROISection";
import MarketSection from "@/components/presentation/MarketSection";
import SimulationSection from "@/components/presentation/SimulationSection";

export const metadata: Metadata = {
  title: "VoraTrain — Presentación",
  description: "Presentación técnica para llamadas de venta en vivo.",
};

export default function PresentacionPage() {
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white">
      <PresentationHeader />
      <main>
        <ROISection />
        <MarketSection />
        <SimulationSection />
      </main>
    </div>
  );
}
