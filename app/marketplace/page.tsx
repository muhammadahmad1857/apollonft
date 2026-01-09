import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import PageHeading from "@/components/marketplace/PageHeading";
import NFTGrid from "@/components/marketplace/NFTGrid";

const MarketplacePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <Header />
      <main className="py-24 space-y-16">
        <PageHeading />
        <NFTGrid />
      </main>
      <Footer />
    </div>
  );
};

export default MarketplacePage;
