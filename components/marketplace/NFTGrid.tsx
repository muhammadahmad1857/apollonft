// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState, useMemo, useCallback } from "react";
// import { useAccount, usePublicClient } from "wagmi";
// import NFTCard, { NFTCardProps } from "./NFTCard";
// import SkeletonCards from "./SkeletonCards";
// import { Button } from "../ui/button";
// import Link from "next/link";
// import { NFT_ABI } from "@/lib/config/abi.config";

// // ← CHANGE THIS!
// const CONTRACT_ADDRESS = process.env
//   .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// // Recommended: limit how many we load per page
// const PAGE_SIZE = 12;

// const NFTGrid = () => {
//   const publicClient = usePublicClient();

//   const [allNfts, setAllNfts] = useState<NFTCardProps[]>([]);
//   const [totalSupply, setTotalSupply] = useState<number>(0);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const { address } = useAccount();
//   const hasMore = useMemo(
//     () => totalSupply > 0 && allNfts.length < totalSupply,
//     [allNfts.length, totalSupply]
//   );

//   // const loadPage = async (page: number, count: number = 0) => {
//   //   if (!publicClient) return;

//   //   const start = page * PAGE_SIZE;
//   //   const end = Math.min(start + PAGE_SIZE, totalSupply);
//   //   console.log(start >= end, start, end);
//   //   // if (start >= end) return;
//   //   const realCountThisPage = Math.min(PAGE_SIZE, count - start);
//   //   console.log("Real count page", realCountThisPage);
//   //   console.log("current page from params", page);

//   //   if (realCountThisPage <= 0) return;
//   //   setLoadingMore(true);

//   //   try {
//   //     // Multicall tokenByIndex → tokenURI
//   //     console.log("test");
//   //     const calls = Array.from({ length: realCountThisPage }, (_, i) => {
//   //       const globalIndex = start + i;
//   //       return [
//   //         {
//   //           address: CONTRACT_ADDRESS,
//   //           abi: NFT_ABI,
//   //           functionName: "tokenByIndex",
//   //           args: [BigInt(globalIndex)],
//   //         } as const,
//   //         {
//   //           address: CONTRACT_ADDRESS,
//   //           abi: NFT_ABI,
//   //           functionName: "tokenURI",
//   //           args: [BigInt(globalIndex)], // we'll need tokenId later
//   //         } as const,
//   //       ];
//   //     }).flat();
//   //     console.log("calls", calls);
//   //     const results = await publicClient.multicall({ contracts: calls });
//   //     console.log("results", results);
//   //     const newNfts: NFTCardProps[] = [];

//   //     for (let i = 0; i < results.length; i += 2) {
//   //       const tokenIdResult = results[i];
//   //       const uriResult = results[i + 1];

//   //       if (tokenIdResult.error || uriResult.error || !tokenIdResult.result)
//   //         continue;

//   //       const tokenId = Number(tokenIdResult.result);
//   //       const uri = uriResult.result as string;

//   //       try {
//   //         // Normalize IPFS
//   //         const httpUri = uri.startsWith("ipfs://")
//   //           ? uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
//   //           : uri;

//   //         const res = await fetch(httpUri);
//   //         if (!res.ok) throw new Error("Metadata fetch failed");

//   //         const metadata = await res.json();

//   //         newNfts.push({
//   //           title: metadata.name || `NFT #${tokenId}`,
//   //           cover:
//   //             metadata.image?.replace(
//   //               "ipfs://",
//   //               "https://gateway.pinata.cloud/ipfs/"
//   //             ) || "",
//   //           media: metadata.animation_url, // for audio/video NFTs
//   //           owner: "?", // optional: can add ownerOf(tokenId) if you want
//   //           minted: true,
//   //           tokenId,
//   //         });
//   //       } catch (e) {
//   //         console.warn(`Failed metadata for #${tokenId}`, e);
//   //         // You can still show placeholder
//   //         newNfts.push({
//   //           title: `NFT #${tokenId}`,
//   //           cover: "",
//   //           media: "",
//   //           owner: "",
//   //           minted: true,
//   //           tokenId,
//   //         });
//   //       }
//   //     }

//   //     setAllNfts((prev) => [...prev, ...newNfts]);
//   //   } catch (err: any) {
//   //     console.error(err);
//   //     setError("Failed to load more NFTs...");
//   //   } finally {
//   //     setLoadingMore(false);
//   //   }
//   // };
//   const loadPage = useCallback(
//     async (page: number, count: number = 9) => {
//       if (!publicClient) return;

//       const start = page * PAGE_SIZE;
//       const realCountThisPage = Math.min(PAGE_SIZE, count - start);

//       console.log("Loading page", page);
//       console.log("Start index:", start);
//       console.log("Items to load this page:", realCountThisPage);
//       console.log("Total supply:", totalSupply);

//       if (realCountThisPage <= 0) {
//         console.log("Nothing more to load");
//         return;
//       }

//       setLoadingMore(true);

//       try {
//         const newNfts: NFTCardProps[] = [];

//         // Sequential loading - safe for small collections (4-50 items)
//         for (let i = 0; i < realCountThisPage; i++) {
//           const globalIndex = start + i;

//           try {
//             console.log(`Fetching token at global index ${globalIndex}...`);

//             // 1. Get actual tokenId from enumeration
//             const tokenIdResult = await publicClient.readContract({
//               address: CONTRACT_ADDRESS,
//               abi: NFT_ABI,
//               functionName: "tokenByIndex",
//               args: [BigInt(globalIndex)],
//             });

//             const tokenId = Number(tokenIdResult);

//             console.log(`→ Token ID #${tokenId} found at index ${globalIndex}`);

//             // 2. Get tokenURI using the REAL tokenId
//             const uriResult = await publicClient.readContract({
//               address: CONTRACT_ADDRESS,
//               abi: NFT_ABI,
//               functionName: "tokenURI",
//               args: [BigInt(tokenId)], // ← IMPORTANT: use tokenId, not globalIndex!
//             });

//             const uri = uriResult as string;
//             console.log(`→ URI for #${tokenId}:`, uri);

//             // Normalize IPFS
//             const httpUri = uri.startsWith("ipfs://")
//               ? uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
//               : uri;

//             // 3. Fetch metadata
//             try {
//               const res = await fetch(httpUri, { cache: "no-store" });
//               console.log(
//                 `Metadata fetch status for #${tokenId}: ${res.status}`
//               );
//               if (!res.ok) {
//                 throw new Error(`Metadata HTTP ${res.status}`);
//               }

//               const metadata = await res.json();
//               console.log(metadata);
//               newNfts.push({
//                 title: metadata.title || `Track #${tokenId}`,
//                 artist: metadata.name || "Unknown Artist",
//                 description: metadata.description || "",
//                 cover:
//                   metadata.cover?.replace(
//                     "ipfs://",
//                     "https://gateway.pinata.cloud/ipfs/"
//                   ) || "",
//                 media: metadata.media,
//                 owner: "address", // can add ownerOf later if needed
//                 minted: true,
//                 tokenId,
//               });

//               console.log(`Successfully loaded NFT #${tokenId}`);
//             } catch (metaErr) {
//               console.warn(`Metadata fetch failed for #${tokenId}:`, metaErr);
//               // Fallback placeholder
//               newNfts.push({
//                 title: `NFT #${tokenId} (metadata unavailable)`,
//                 artist: "Unknown Artist",
//                 description: "",
//                 cover: "",
//                 media: "",
//                 owner: "",
//                 minted: true,
//                 tokenId,
//               });
//             }
//           } catch (indexErr) {
//             console.warn(
//               `Failed to load token at index ${globalIndex}:`,
//               indexErr
//             );
//             // Optional: continue or add placeholder
//           }
//         }

//         if (newNfts.length > 0) {
//           setAllNfts((prev) => [...prev, ...newNfts]);
//           console.log(`Added ${newNfts.length} new NFTs`);
//         } else {
//           console.log("No valid NFTs loaded this page");
//         }
//       } catch (err: any) {
//         console.error("Page load failed:", err);
//         setError("Failed to load NFTs. Check console for details.");
//       } finally {
//         setLoadingMore(false);
//       }
//     },
//     [publicClient, totalSupply]
//   );
//   useEffect(() => {
//     if (!publicClient) return;

//     const fetchTotalSupply = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setAllNfts([]); // Reset NFTs on initialization

//         const supply = await publicClient.readContract({
//           address: CONTRACT_ADDRESS,
//           abi: NFT_ABI,
//           functionName: "totalSupply",
//         });

//         const count = Number(supply);
//         setTotalSupply(count);

//         if (count === 0) {
//           setLoading(false);
//         }
//       } catch (err: any) {
//         console.error(err);
//         setError("Couldn't read total supply...");
//         setLoading(false);
//       }
//     };

//     fetchTotalSupply();
//   }, [publicClient]);

//   useEffect(() => {
//     if (totalSupply > 0 && allNfts.length === 0) {
//       const loadInitialPage = async () => {
//         await loadPage(0, totalSupply);
//         setCurrentPage(1);
//         setLoading(false);
//       };
//       loadInitialPage();
//     }
//   }, [totalSupply, allNfts.length, loadPage]);
//   // Auto-load more when user clicks "Load More"
//   const handleLoadMore = () => {
//     loadPage(currentPage);
//     setCurrentPage((p) => p + 1);
//   };

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         <SkeletonCards count={PAGE_SIZE} />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-center py-16 text-red-500">{error}</div>;
//   }

//   if (totalSupply === 0) {
//     return (
//       <div className="text-center py-16">
//         <h2 className="text-xl font-medium">No NFTs minted yet.</h2>
//         <p className="text-zinc-500 mt-2">Be the first!</p>
//         <Button asChild className="mt-6">
//           <Link href="/create">Create NFT</Link>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {allNfts.map((nft) => (
//           <NFTCard key={nft.tokenId} {...nft} />
//         ))}
//       </div>

//       {hasMore && (
//         <div className="text-center mt-12">
//           <Button
//             onClick={handleLoadMore}
//             disabled={loadingMore}
//             variant="outline"
//             size="lg"
//           >
//             {loadingMore ? "Loading..." : "Load More"}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NFTGrid;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { usePublicClient, useWatchContractEvent } from "wagmi";
import { zeroAddress, parseAbi, type Log } from "viem";
import NFTCard, { NFTCardProps } from "./NFTCard"; // ← your reusable card component
import SkeletonCards from "./SkeletonCards"; // ← your skeleton loader
import { Button } from "../ui/button";

const TRANSFER_ABI = parseAbi([
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
]);

const ERC721_ABI = parseAbi([
  "function totalSupply() view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
]);

// CHANGE THIS if needed (but keep using env var)
const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const PAGE_SIZE = 12; // Adjust as needed

interface MintWithMetadata extends NFTCardProps {
  tokenId: number;
  txHash?: string; // optional: show in card if you want
  mintedAt?: string; // optional: can add block timestamp later
  error?: string;
}

export default function PublicMintsGrid() {
  const publicClient = usePublicClient();

  const [rawMints, setRawMints] = useState<
    { tokenId: bigint; txHash: `0x${string}`; blockNumber: bigint }[]
  >([]);
  const [mints, setMints] = useState<MintWithMetadata[]>([]);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const hasMore = useMemo(
    () => totalSupply > 0 && mints.length < totalSupply,
    [mints.length, totalSupply]
  );

  // 1. Get totalSupply once
  useEffect(() => {
    if (!publicClient) return;

    const fetchTotal = async () => {
      try {
        setLoading(true);
        setError(null);

        const supply = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: ERC721_ABI,
          functionName: "totalSupply",
        });

        const count = Number(supply);
        setTotalSupply(count);

        if (count === 0) setLoading(false);
      } catch (err: any) {
        console.error("Failed to read totalSupply:", err);
        setError("Failed to load collection info");
        setLoading(false);
      }
    };

    fetchTotal();
  }, [publicClient]);

  // 2. Fetch historical public mints (Transfer from 0x0)
  useEffect(() => {
    if (!publicClient || totalSupply === 0) return;

    const fetchHistoricalMints = async () => {
      try {
        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: TRANSFER_ABI[0],
          fromBlock: "earliest", // optimize later with deployment block
          toBlock: "latest",
          args: { from: zeroAddress },
        });

        // Sort descending (newest first)
        const sortedLogs = [...logs].sort((a, b) =>
          b.blockNumber > a.blockNumber ? 1 : -1
        );

        const events = sortedLogs.map((log) => ({
          tokenId: log.args.tokenId!,
          txHash: log.transactionHash!,
          blockNumber: log.blockNumber!,
        }));

        setRawMints(events);
      } catch (err: any) {
        console.error("Failed to fetch mint events:", err);
        setError("Could not load mint history");
      }
    };

    fetchHistoricalMints();
  }, [publicClient, totalSupply]);

  // 3. Real-time new public mints
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: TRANSFER_ABI,
    eventName: "Transfer",
    args: { from: zeroAddress },
    onLogs(logs) {
      const newEvents = logs.map((log) => ({
        tokenId: log.args.tokenId!,
        txHash: log.transactionHash!,
        blockNumber: log.blockNumber!,
      }));

      setRawMints((prev) => [...newEvents, ...prev]); // newest on top
    },
  });

  // 4. Paginated metadata loading (load PAGE_SIZE at a time)
  const loadMetadataPage = useCallback(async () => {
    if (!publicClient || rawMints.length === 0) return;

    const start = currentPage * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, rawMints.length);
    if (start >= end) return;

    setLoadingMore(true);

    const pageEvents = rawMints.slice(start, end);

    const newMints: MintWithMetadata[] = [];

    for (const event of pageEvents) {
      const tokenIdStr =Number(event.tokenId)

      try {
        const uri = (await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: ERC721_ABI,
          functionName: "tokenURI",
          args: [event.tokenId],
        })) as string;

        // Normalize IPFS → public gateway
        const httpUri = uri.startsWith("ipfs://")
          ? uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
          : uri;

        const res = await fetch(httpUri, { cache: "no-store" });
        if (!res.ok) throw new Error(`Metadata ${res.status}`);

        const data = await res.json();

        newMints.push({
          tokenId: tokenIdStr,
          title: data.name || data.title || `Token #${tokenIdStr}`,
          cover:
            data.image || data.cover
              ? (data.image || data.cover).replace(
                  "ipfs://",
                  "https://gateway.pinata.cloud/ipfs/"
                )
              : "",
          media: data.animation_url || data.media,
          description: data.description || "",
          artist: data.artist || "Unknown",
          minted: true,
          txHash: event.txHash,
          owner:data.name
          // mintedAt: can add timestamp later via getBlock
        });
      } catch (err) {
        console.warn(`Metadata fail #${tokenIdStr}:`, err);
        newMints.push({
          tokenId: tokenIdStr,
          title: `Token #${tokenIdStr} (metadata unavailable)`,
          cover: "",
          media: "",
          description: "",
          artist: "",
          minted: true,
          error: "Metadata unavailable",
          txHash: event.txHash,
          owner:"unknown"
        });
      }
    }

    setMints((prev) => [...prev, ...newMints]);
    setCurrentPage((p) => p + 1);
    setLoadingMore(false);
  }, [publicClient, rawMints, currentPage]);

  // Auto-load first page of metadata once raw mints are ready
  useEffect(() => {
    if (rawMints.length > 0 && mints.length === 0 && !loading) {
      loadMetadataPage();
    }
  }, [rawMints, mints.length, loading, loadMetadataPage]);

  const handleLoadMore = () => {
    loadMetadataPage();
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

  if (totalSupply === 0 || mints.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-medium">No public mints yet.</h2>
        <p className="text-zinc-500 mt-2">Be the first to mint!</p>
        {/* Optional: link to mint page */}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Public Mints ({mints.length} shown)
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mints.map((nft) => (
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
            {loadingMore ? "Loading more..." : "Load More Mints"}
          </Button>
        </div>
      )}
    </div>
  );
}