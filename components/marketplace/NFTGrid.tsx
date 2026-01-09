"use client";

import { useEffect, useState } from "react";
import NFTCard, { NFTCardProps } from "./NFTCard";
import SkeletonCards from "./SkeletonCards";
import { Button } from "../ui/button";
import Link from "next/link";

// Mock data - replace with actual blockchain data fetching
const mockNFTs: NFTCardProps[] = [
  {
    title: "Celestial Echoes",
    cover: "https://placehold.co/500x500/000000/FFFFFF/png?text=CE",
    media: "/path/to/audio1.mp3",
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    minted: true,
  },
  {
    title: "Midnight Sonnet",
    cover: "https://placehold.co/500x500/1a1a1a/FFFFFF/png?text=MS",
    media: "/path/to/audio2.mp3",
    owner: "0xabcdef1234567890abcdef1234567890abcdef12",
    minted: true,
  },
  {
    title: "Rhythmic Dreams",
    cover: "https://placehold.co/500x500/333333/FFFFFF/png?text=RD",
    media: "/path/to/audio3.mp3",
    owner: "0x9876543210fedcba9876543210fedcba98765432",
    minted: true,
  },
  {
    title: "Synthwave Serenity",
    cover: "https://placehold.co/500x500/4d4d4d/FFFFFF/png?text=SS",
    media: "/path/to/audio4.mp3",
    owner: "0xfedcba9876543210fedcba9876543210fedcba98",
    minted: true,
  },
];

const NFTGrid = () => {
  const [nfts, setNfts] = useState<NFTCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from the blockchain
    const fetchData = async () => {
      setLoading(true);
      // Replace this with your `totalSupply` and `tokenURI` logic
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setNfts(mockNFTs);
      // setNfts([]); // To test empty state
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Optional Filter Placeholder */}
      <div className="h-10 mb-8">{/* Future filter bar */}</div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <SkeletonCards count={8} />
        </div>
      ) : nfts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.map((nft, index) => (
            <NFTCard key={index} {...nft} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-medium text-zinc-700 dark:text-zinc-300">
            No NFTs minted yet.
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Be the first to create one!
          </p>
          <Button asChild className="mt-6">
            <Link href="/create">Create NFT</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default NFTGrid;
