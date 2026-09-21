import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ManifestoSection from "@/components/ManifestoSection";
import LevelsSection from "@/components/LevelsSection";
import BentoSection from "@/components/BentoSection";
import FoundersSection from "@/components/FoundersSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AmbientGlow from "@/components/AmbientGlow";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative">
        <AmbientGlow />
        <Hero />
        <ManifestoSection />
        <LevelsSection />
        <BentoSection />
        <FoundersSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
