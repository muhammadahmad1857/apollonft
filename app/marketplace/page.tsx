import  NFTGrid  from "@/components/marketplace/NFTGrid";
import PageHeading from "@/components/marketplace/PageHeading";

const MarketplacePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <main className="py-24 space-y-16">
        <PageHeading />
        <NFTGrid />
      </main>
    </div>
  );
};

export default MarketplacePage;
