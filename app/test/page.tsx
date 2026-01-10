/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { usePublicClient, useWatchContractEvent } from "wagmi";
import { zeroAddress, parseAbi, type Log } from "viem";
import { useState, useEffect } from "react";

const TRANSFER_ABI = parseAbi([
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
]);

const ERC721_ABI = parseAbi([
  "function tokenURI(uint256 tokenId) external view returns (string)",
]);

interface MintEvent {
  tokenId: string;
  to: `0x${string}`;
  txHash: `0x${string}`;
  blockNumber: string;
}

interface MintWithMetadata extends MintEvent {
  name?: string;
  description?: string;
  image?: string;
  attributes?: any[];
  loading?: boolean;
  error?: string;
}

export default function MintList() {
  const publicClient = usePublicClient();
  const [rawMints, setRawMints] = useState<MintEvent[]>([]);
  const [mints, setMints] = useState<MintWithMetadata[]>([]);
  const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    zeroAddress) as `0x${string}`;

  // 1. Fetch historical mint events
  useEffect(() => {
    async function fetchHistoricalMints() {
      if (!publicClient) return;

      try {
        const logs = await publicClient.getLogs({
          address: contractAddress,
          event: TRANSFER_ABI[0],
          fromBlock: "earliest", // Change to your deployment block for speed
          toBlock: "latest",
          args: { from: zeroAddress },
        });

        const newMints = (logs as any[]).map((log) => ({
          tokenId: log.args.tokenId?.toString() ?? "0",
          to: log.args.to as `0x${string}`,
          txHash: log.transactionHash as `0x${string}`,
          blockNumber: log.blockNumber?.toString() ?? "0",
        }));

        setRawMints(newMints);
      } catch (err) {
        console.error("Failed to fetch mints:", err);
      }
    }
    fetchHistoricalMints();
  }, [publicClient, contractAddress]);

  // 2. Real-time new mints
  useWatchContractEvent({
    address: contractAddress,
    abi: TRANSFER_ABI,
    eventName: "Transfer",
    args: { from: zeroAddress },
    onLogs(logs) {
      const newEvents = (logs as any[]).map((log) => ({
        tokenId: log.args.tokenId?.toString() ?? "0",
        to: log.args.to as `0x${string}`,
        txHash: log.transactionHash as `0x${string}`,
        blockNumber: log.blockNumber?.toString() ?? "0",
      }));

      setRawMints((prev) => [...newEvents, ...prev]);
    },
  });

  // 3. Fetch metadata for each mint (runs when rawMints change)
  useEffect(() => {
    async function fetchMetadata() {
      if (!publicClient || rawMints.length === 0) return;

      const updated = await Promise.all(
        rawMints.map(async (mint) => {
          try {
            const uri = await publicClient.readContract({
              address: contractAddress,
              abi: ERC721_ABI,
              functionName: "tokenURI",
              args: [BigInt(mint.tokenId)],
            }) as string;

            // Fetch JSON metadata (IPFS/http/arweave/etc.)
            const response = await fetch(uri);
            if (!response.ok) throw new Error("Metadata fetch failed");
            const data = await response.json();

            return {
              ...mint,
              name: data.name,
              description: data.description,
              image: data.image,
              attributes: data.attributes,
            };
          } catch (err) {
            console.error(`Metadata error for #${mint.tokenId}:`, err);
            return {
              ...mint,
              error: "Failed to load metadata",
            };
          }
        })
      );

      setMints(updated);
    }

    fetchMetadata();
  }, [rawMints, publicClient, contractAddress]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Public Mints ({mints.length})
      </h2>

      {mints.length === 0 && <p>Loading mints...</p>}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mints.map((mint) => (
          <li
            key={mint.tokenId}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold">
              Token #{mint.tokenId}
            </h3>
            <p className="text-sm text-gray-600">
              Minted to {mint.to.slice(0, 6)}...{mint.to.slice(-4)}
            </p>
            <p className="text-xs text-gray-500">
              Tx: {mint.txHash.slice(0, 10)}...
            </p>

            {mint.loading ? (
              <p>Loading metadata...</p>
            ) : mint.error ? (
              <p className="text-red-500">{mint.error}</p>
            ) : (
              <>
                {mint.image && (
                  <img
                    src={mint.image}
                    alt={mint.name || `Token ${mint.tokenId}`}
                    className="w-full h-48 object-cover rounded mt-2"
                    onError={(e) => {
                      e.currentTarget.src = "/fallback-nft.png"; // optional fallback
                    }}
                  />
                )}
                <p className="font-medium mt-2">{mint.name || "Unnamed"}</p>
                {mint.description && (
                  <p className="text-sm text-gray-700 mt-1 line-clamp-3">
                    {mint.description}
                  </p>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}