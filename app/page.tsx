import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SkillsMarquee from "@/components/home/SkillsMarquee";
import ProblemSection from "@/components/home/ProblemSection";
import StandardSection from "@/components/home/StandardSection";
import CampusSection from "@/components/home/CampusSection";
import PracticeSection from "@/components/home/PracticeSection";
import CareerSection from "@/components/home/CareerSection";
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
        <SkillsMarquee />
        <ProblemSection />
        <StandardSection />
        <CampusSection />
        <PracticeSection />
        <CareerSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
