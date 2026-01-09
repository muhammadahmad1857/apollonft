/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { usePublicClient } from "wagmi";
import NFTCard, { NFTCardProps } from "./NFTCard";
import SkeletonCards from "./SkeletonCards";
import { Button } from "../ui/button";
import Link from "next/link";
import { NFT_ABI } from "@/lib/config/abi.config";

// ← CHANGE THIS!
const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// Recommended: limit how many we load per page
const PAGE_SIZE = 12;

const NFTGrid = () => {
  const publicClient = usePublicClient();

  const [allNfts, setAllNfts] = useState<NFTCardProps[]>([]);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const hasMore = useMemo(
    () => totalSupply > 0 && allNfts.length < totalSupply,
    [allNfts.length, totalSupply]
  );

  // const loadPage = async (page: number, count: number = 0) => {
  //   if (!publicClient) return;

  //   const start = page * PAGE_SIZE;
  //   const end = Math.min(start + PAGE_SIZE, totalSupply);
  //   console.log(start >= end, start, end);
  //   // if (start >= end) return;
  //   const realCountThisPage = Math.min(PAGE_SIZE, count - start);
  //   console.log("Real count page", realCountThisPage);
  //   console.log("current page from params", page);

  //   if (realCountThisPage <= 0) return;
  //   setLoadingMore(true);

  //   try {
  //     // Multicall tokenByIndex → tokenURI
  //     console.log("test");
  //     const calls = Array.from({ length: realCountThisPage }, (_, i) => {
  //       const globalIndex = start + i;
  //       return [
  //         {
  //           address: CONTRACT_ADDRESS,
  //           abi: NFT_ABI,
  //           functionName: "tokenByIndex",
  //           args: [BigInt(globalIndex)],
  //         } as const,
  //         {
  //           address: CONTRACT_ADDRESS,
  //           abi: NFT_ABI,
  //           functionName: "tokenURI",
  //           args: [BigInt(globalIndex)], // we'll need tokenId later
  //         } as const,
  //       ];
  //     }).flat();
  //     console.log("calls", calls);
  //     const results = await publicClient.multicall({ contracts: calls });
  //     console.log("results", results);
  //     const newNfts: NFTCardProps[] = [];

  //     for (let i = 0; i < results.length; i += 2) {
  //       const tokenIdResult = results[i];
  //       const uriResult = results[i + 1];

  //       if (tokenIdResult.error || uriResult.error || !tokenIdResult.result)
  //         continue;

  //       const tokenId = Number(tokenIdResult.result);
  //       const uri = uriResult.result as string;

  //       try {
  //         // Normalize IPFS
  //         const httpUri = uri.startsWith("ipfs://")
  //           ? uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
  //           : uri;

  //         const res = await fetch(httpUri);
  //         if (!res.ok) throw new Error("Metadata fetch failed");

  //         const metadata = await res.json();

  //         newNfts.push({
  //           title: metadata.name || `NFT #${tokenId}`,
  //           cover:
  //             metadata.image?.replace(
  //               "ipfs://",
  //               "https://gateway.pinata.cloud/ipfs/"
  //             ) || "",
  //           media: metadata.animation_url, // for audio/video NFTs
  //           owner: "?", // optional: can add ownerOf(tokenId) if you want
  //           minted: true,
  //           tokenId,
  //         });
  //       } catch (e) {
  //         console.warn(`Failed metadata for #${tokenId}`, e);
  //         // You can still show placeholder
  //         newNfts.push({
  //           title: `NFT #${tokenId}`,
  //           cover: "",
  //           media: "",
  //           owner: "",
  //           minted: true,
  //           tokenId,
  //         });
  //       }
  //     }

  //     setAllNfts((prev) => [...prev, ...newNfts]);
  //   } catch (err: any) {
  //     console.error(err);
  //     setError("Failed to load more NFTs...");
  //   } finally {
  //     setLoadingMore(false);
  //   }
  // };
  const loadPage = useCallback(
    async (page: number, count: number = 9) => {
      if (!publicClient) return;

      const start = page * PAGE_SIZE;
      const realCountThisPage = Math.min(PAGE_SIZE, count - start);

      console.log("Loading page", page);
      console.log("Start index:", start);
      console.log("Items to load this page:", realCountThisPage);
      console.log("Total supply:", totalSupply);

      if (realCountThisPage <= 0) {
        console.log("Nothing more to load");
        return;
      }

      setLoadingMore(true);

      try {
        const newNfts: NFTCardProps[] = [];

        // Sequential loading - safe for small collections (4-50 items)
        for (let i = 0; i < realCountThisPage; i++) {
          const globalIndex = start + i;

          try {
            console.log(`Fetching token at global index ${globalIndex}...`);

            // 1. Get actual tokenId from enumeration
            const tokenIdResult = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: NFT_ABI,
              functionName: "tokenByIndex",
              args: [BigInt(globalIndex)],
            });

            const tokenId = Number(tokenIdResult);

            console.log(`→ Token ID #${tokenId} found at index ${globalIndex}`);

            // 2. Get tokenURI using the REAL tokenId
            const uriResult = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: NFT_ABI,
              functionName: "tokenURI",
              args: [BigInt(tokenId)], // ← IMPORTANT: use tokenId, not globalIndex!
            });

            const uri = uriResult as string;
            console.log(`→ URI for #${tokenId}:`, uri);

            // Normalize IPFS
            const httpUri = uri.startsWith("ipfs://")
              ? uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
              : uri;

            // 3. Fetch metadata
            try {
              const res = await fetch(httpUri, { cache: "no-store" });
              console.log(
                `Metadata fetch status for #${tokenId}: ${res.status}`
              );

              if (!res.ok) {
                throw new Error(`Metadata HTTP ${res.status}`);
              }

              const metadata = await res.json();

              newNfts.push({
                title: metadata.title || `Track #${tokenId}`,
                artist: metadata.name || "Unknown Artist",
                description: metadata.description || "",
                cover:
                  metadata.image?.replace(
                    "ipfs://",
                    "https://gateway.pinata.cloud/ipfs/"
                  ) || "",
                media: metadata.animation_url,
                owner: "?", // can add ownerOf later if needed
                minted: true,
                tokenId,
              });

              console.log(`Successfully loaded NFT #${tokenId}`);
            } catch (metaErr) {
              console.warn(`Metadata fetch failed for #${tokenId}:`, metaErr);
              // Fallback placeholder
              newNfts.push({
                title: `NFT #${tokenId} (metadata unavailable)`,
                artist: "Unknown Artist",
                description: "",
                cover: "",
                media: "",
                owner: "",
                minted: true,
                tokenId,
              });
            }
          } catch (indexErr) {
            console.warn(
              `Failed to load token at index ${globalIndex}:`,
              indexErr
            );
            // Optional: continue or add placeholder
          }
        }

        if (newNfts.length > 0) {
          setAllNfts((prev) => [...prev, ...newNfts]);
          console.log(`Added ${newNfts.length} new NFTs`);
        } else {
          console.log("No valid NFTs loaded this page");
        }
      } catch (err: any) {
        console.error("Page load failed:", err);
        setError("Failed to load NFTs. Check console for details.");
      } finally {
        setLoadingMore(false);
      }
    },
    [publicClient, totalSupply]
  );
  useEffect(() => {
    if (!publicClient) return;

    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        const supply = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: NFT_ABI,
          functionName: "totalSupply",
        });

        console.log("supply", supply);
        const count = Number(supply);
        console.log("count", count);

        // Set state for UI/rendering
        setTotalSupply(count);

        if (count === 0) {
          setAllNfts([]);
          setLoading(false);
          return;
        }

        // IMPORTANT: Use the fresh 'count' variable here, NOT the state!
        await loadPage(0, count); // ← pass count explicitly

        setCurrentPage(1);
      } catch (err: any) {
        console.error(err);
        setError("Couldn't read total supply...");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [publicClient, loadPage]);
  // Auto-load more when user clicks "Load More"
  const handleLoadMore = () => {
    loadPage(currentPage);
    setCurrentPage((p) => p + 1);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <SkeletonCards count={PAGE_SIZE} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  if (totalSupply === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-medium">No NFTs minted yet.</h2>
        <p className="text-zinc-500 mt-2">Be the first!</p>
        <Button asChild className="mt-6">
          <Link href="/create">Create NFT</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allNfts.map((nft) => (
          <NFTCard key={nft.tokenId} {...nft} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-12">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NFTGrid;
