import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedNFTs } from "@/components/home/FeaturedNFTs";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <HeroSection />
      <HowItWorks />
      <FeaturedNFTs />
      <CTASection />
      {/* <Footer /> */}
    </div>
  );
}
