import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedNFTs } from "@/components/home/FeaturedNFTs";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <HeroSection />
      <HowItWorks />
      <FeaturedNFTs />
      <CTASection />
      <Footer />
    </div>
  );
}
