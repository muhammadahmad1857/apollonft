/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWatchContractEvent } from "wagmi";
import { zeroAddress, parseAbi } from "viem";
import NFTCard, { NFTCardProps } from "./NFTCard";
import SkeletonCards from "./SkeletonCards";
import { Button } from "../ui/button";

const TRANSFER_ABI = parseAbi([
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
]);

const ERC721_ABI = parseAbi([
  "function tokenURI(uint256 tokenId) view returns (string)",
]);

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const PAGE_SIZE = 12; // just for initial skeleton count

interface MintWithMetadata extends NFTCardProps {
  tokenId: number;
  txHash?: string;
  error?: string;
}

export default function PublicMintsGrid() {
  const publicClient = usePublicClient();

  const [mints, setMints] = useState<MintWithMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Load all historical public mints once
  useEffect(() => {
    if (!publicClient) return;

    const fetchPublicMints = async () => {
      try {
        setLoading(true);
        setError(null);

        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: TRANSFER_ABI[0],
          fromBlock: "earliest",
          toBlock: "latest",
          args: { from: zeroAddress },
        });

        // Sort newest first
        const sortedLogs = [...logs].sort((a, b) =>
          Number(b.blockNumber - a.blockNumber)
        );

        const mintEvents = sortedLogs.map((log) => ({
          tokenId: Number(log.args.tokenId),
          txHash: log.transactionHash!,
        }));

        // 2. Fetch metadata for all found mints
        const mintsWithMeta = await Promise.all(
          mintEvents.map(async ({ tokenId, txHash }) => {
            try {
              const uri = (await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: ERC721_ABI,
                functionName: "tokenURI",
                args: [BigInt(tokenId)],
              })) as string;

              // Handle IPFS
              const httpUri = uri.startsWith("ipfs://")
                ? uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
                : uri;

              const res = await fetch(httpUri);
              if (!res.ok) throw new Error("Metadata fetch failed");

              const data = await res.json();
              console.log("Ran till here for token ", tokenId);
              return {
                tokenId,
                title: data.title || `Token #${tokenId}`,
                cover: (data.image || data.cover || "").replace(
                  "ipfs://",
                  "https://gateway.pinata.cloud/ipfs/"
                ),
                media: data.media?.replace(
                  "ipfs://",
                  "https://gateway.pinata.cloud/ipfs/"
                ),
                description: data.description || "",
                name: data.name || "Unknown Artist",
                minted: true,
                txHash,
              } as MintWithMetadata;
            } catch (err) {
              console.log(`Failed for token #${tokenId}:`, err);
              return {
                tokenId,
                title: `Token #${tokenId}`,
                cover: "",
                media: "",
                description: "",
                name: "Unknown",
                minted: true,
                error: "Metadata unavailable",
                txHash,
              };
            }
          })
        );

        setMints(mintsWithMeta);
      } catch (err: any) {
        console.error("Failed to load public mints:", err);
        setError("Failed to load recent mints");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicMints();
  }, [publicClient]);

  // 3. Listen for new public mints in real-time
  // useWatchContractEvent({
  //   address: CONTRACT_ADDRESS,
  //   abi: TRANSFER_ABI,
  //   eventName: "Transfer",
  //   args: { from: zeroAddress },
  //   onLogs(logs) {
  //     logs.forEach(async (log) => {
  //       const tokenId = Number(log.args.tokenId);
  //       const txHash = log.transactionHash!;
  //       if (!publicClient) return;
  //       try {
  //         const uri = (await publicClient.readContract({
  //           address: CONTRACT_ADDRESS,
  //           abi: ERC721_ABI,
  //           functionName: "tokenURI",
  //           args: [log.args.tokenId!],
  //         })) as string;

  //         const httpUri = uri.startsWith("ipfs://")
  //           ? uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
  //           : uri;

  //         const res = await fetch(httpUri);
  //         const data = await res.json();

  //         const newMint: MintWithMetadata = {
  //           tokenId,
  //           title: data.title || `Token #${tokenId}`,
  //           cover: (data.image || data.cover || "").replace(
  //             "ipfs://",
  //             "https://gateway.pinata.cloud/ipfs/"
  //           ),
  //           media: data.media.replace(
  //             "ipfs://",
  //             "https://gateway.pinata.cloud/ipfs/"
  //           ),
  //           description: data.description || "",
  //           name: data.name || "Unknown Artist",
  //           minted: true,
  //           txHash,
  //         };

  //         setMints((prev) => [newMint, ...prev]); // newest first
  //       } catch (err) {
  //         console.log(`New mint metadata failed #${tokenId}:`, err);
  //         setMints((prev) => [
  //           {
  //             tokenId,
  //             title: `Token #${tokenId} (loading metadata...)`,
  //             cover: "",
  //             media: "",
  //             description: "",
  //             name: "",
  //             minted: true,
  //             txHash,
  //           },
  //           ...prev,
  //         ]);
  //       }
  //     });
  //   },
  // });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <SkeletonCards count={PAGE_SIZE} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        {error}
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (mints.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-medium">No public mints yet</h2>
        <p className="text-zinc-500 mt-2">Be the first to mint!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Recent Public Mints ({mints.length})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mints.map((nft) => (
          <NFTCard key={nft.tokenId} {...nft} />
        ))}
      </div>
    </div>
  );
}
