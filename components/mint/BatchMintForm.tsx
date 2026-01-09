/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Label } from "./ui/label";
import { NFT_ABI } from "../config/abi.config";
import { Image, Loader2, Layers, Hash } from "lucide-react";
import { motion } from "framer-motion";
import type { BaseError } from "viem";

interface BatchMintFormProps {
  contractAddress: `0x${string}`;
}

export function BatchMintForm({ contractAddress }: BatchMintFormProps) {
  const { isConnected } = useAccount();
  const [tokenURI, setTokenURI] = useState("");
  const [quantity, setQuantity] = useState("1");

  const toastIdRef = useRef<string | number | null>(null);

  // ---------------- CONTRACT WRITE ----------------
  const {
    writeContract,
    data: hash,
    error: writeError,
    isPending: isPreparing,
  } = useWriteContract();

  // ---------------- TX RECEIPT ----------------
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: txError,
    error: txReceiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // ---------------- HANDLER ----------------
  const handleBatchMint = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenURI.trim()) {
      toast.error("Please enter a token URI");
      return;
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (qty > 100) {
      toast.error("Maximum 100 NFTs per batch");
      return;
    }

    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    writeContract({
      address: contractAddress,
      abi: NFT_ABI,
      functionName: "batchMint",
      args: [tokenURI, BigInt(qty)],
    });
  };

  // ---------------- EFFECTS ----------------

  // Write errors (user reject, insufficient gas, etc.)
  useEffect(() => {
    if (writeError) {
      const errorMessage =
        (writeError as BaseError).shortMessage || writeError.message;
      toast.error(
        errorMessage.includes("insufficient funds")
          ? "You don’t have enough ETH for gas ⛽"
          : errorMessage
      );
    }
  }, [writeError]);

  // Start loading toast when transaction is confirming
  useEffect(() => {
    if (isConfirming && !toastIdRef.current) {
      toastIdRef.current = toast.loading(`Minting ${quantity} NFTs...`);
    }
  }, [isConfirming, quantity]);

  // Success
  useEffect(() => {
    if (isSuccess && toastIdRef.current) {
      toast.success(`Successfully minted ${quantity} NFTs! 🎉`, {
        id: toastIdRef.current,
      });
      toastIdRef.current = null;
      setTokenURI("");
      setQuantity("1");
    }
  }, [isSuccess, quantity]);

  // On-chain failure (revert)
  useEffect(() => {
    if (txError && toastIdRef.current) {
      const errorMessage =
        (txReceiptError as BaseError)?.shortMessage ||
        txReceiptError?.message ||
        "Transaction reverted";
      toast.error(errorMessage, {
        id: toastIdRef.current,
      });
      toastIdRef.current = null;
    }
  }, [txError, txReceiptError]);

  // ---------------- UI ----------------
  const isBusy = isPreparing || isConfirming;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-gray-200 shadow-lg dark:border-gray-800">
        <CardHeader className="border-b border-gray-200 bg-pink-50/50 dark:border-gray-800 dark:bg-pink-950/10">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-600 dark:bg-pink-500">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Batch Mint NFTs
              </CardTitle>
              <CardDescription className="mt-1 text-sm">
                Create multiple NFTs efficiently in one transaction
              </CardDescription>
            </div>
          </motion.div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleBatchMint} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-2"
            >
              <Label
                htmlFor="batchTokenURI"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Metadata URI
              </Label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="batchTokenURI"
                  placeholder="https://example.com/metadata.json"
                  value={tokenURI}
                  onChange={(e) => setTokenURI(e.target.value)}
                  disabled={isBusy}
                  className="pl-10 transition-all focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                All NFTs in this batch will use the same metadata URI
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="space-y-2"
            >
              <Label
                htmlFor="quantity"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Quantity
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  disabled={isBusy}
                  className="pl-10 transition-all focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Maximum 100 NFTs per batch transaction
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button
                type="submit"
                disabled={!isConnected || isBusy}
                className="w-full bg-pink-600 text-white shadow-md transition-all hover:bg-pink-700 hover:shadow-lg disabled:opacity-50"
                size="lg"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isConfirming
                      ? "Processing Transaction..."
                      : "Preparing Batch..."}
                  </>
                ) : (
                  <>
                    <Layers className="mr-2 h-4 w-4" />
                    Mint {quantity} {parseInt(quantity) === 1 ? "NFT" : "NFTs"}
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
