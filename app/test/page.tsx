import { usePublicClient, useWatchContractEvent } from "wagmi";
import { zeroAddress, parseAbi, type Log } from "viem";
import { useState, useEffect } from "react";

const TRANSFER_ABI = parseAbi([
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
]);

interface DecodedLog extends Log {
  args: {
    from: `0x${string}`;
    to: `0x${string}`;
    tokenId: bigint;
  };
}

export default function MintList() {
  const publicClient = usePublicClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mints, setMints] = useState<any[]>([]);
  const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    zeroAddress) as `0x${string}`;
  // Fetch historical mints (run once or on mount/refresh)
  useEffect(() => {
    async function fetchHistoricalMints() {
      if (!publicClient) return;

      try {
        const logs = await publicClient.getLogs({
          address: contractAddress,
          event: TRANSFER_ABI[0],
          fromBlock: "earliest", // or your deployment block for efficiency
          toBlock: "latest",
          args: { from: zeroAddress },
        });
        setMints(
          (logs as DecodedLog[]).map((log) => ({
            tokenId: log.args.tokenId?.toString(),
            to: log.args.to,
            txHash: log.transactionHash,
            blockNumber: log.blockNumber?.toString() ?? "0",
          }))
        );
      } catch (err) {
        console.error("Failed to fetch mints:", err);
      }
    }
    fetchHistoricalMints();
  }, [publicClient, contractAddress]);

  // Real-time new mints
  useWatchContractEvent({
    address: contractAddress,
    abi: TRANSFER_ABI,
    eventName: "Transfer",
    args: { from: zeroAddress },
    onLogs(logs) {
      setMints((prev) => [
        ...(logs as DecodedLog[]).map((log) => ({
          tokenId: log.args.tokenId?.toString(),
          to: log.args.to,
          txHash: log.transactionHash,
          blockNumber: log.blockNumber?.toString() ?? "0",
        })),
        ...prev,
      ]);
    },
  });

  return (
    <div>
      <h2>Public Mints ({mints.length})</h2>
      <ul>
        {mints.map((mint, i) => (
          <li key={i}>
            Token #{mint.tokenId} minted to {mint.to.slice(0, 6)}... by tx{" "}
            {mint.txHash.slice(0, 8)}
          </li>
        ))}
      </ul>
    </div>
  );
}
