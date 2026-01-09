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
import { Shield, Loader2, Link, AlertCircle, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { NFT_ABI } from "../config/abi.config.ts";
import type { BaseError } from "viem";

interface AdminPanelProps {
  contractAddress: `0x${string}`;
  contractOwner?: string;
}

export function AdminPanel({
  contractAddress,
  contractOwner,
}: AdminPanelProps) {
  const { address, isConnected } = useAccount();
  const [baseURI, setBaseURI] = useState("");

  const toastIdRef = useRef<string | number | null>(null);

  const isOwner =
    isConnected &&
    address &&
    contractOwner &&
    address.toLowerCase() === contractOwner.toLowerCase();

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
  } = useWaitForTransactionReceipt({ hash });

  // ---------------- HANDLER ----------------
  const handleSetBaseURI = (e: React.FormEvent) => {
    e.preventDefault();

    if (!baseURI.trim()) {
      toast.error("Please enter a base URI");
      return;
    }

    if (!isOwner) {
      toast.error("Only the contract owner can set the base URI");
      return;
    }

    writeContract({
      address: contractAddress,
      abi: NFT_ABI,
      functionName: "baseURI", // ← Most common name; change if yours is different (e.g. "baseURI", "_setBaseURI")
      args: [baseURI],
    });
  };

  // ---------------- EFFECTS ----------------

  // Wallet-level errors (reject, insufficient gas, etc.)
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

  // Start loading toast when confirming
  useEffect(() => {
    if (isConfirming && !toastIdRef.current) {
      toastIdRef.current = toast.loading("Setting base URI...");
    }
  }, [isConfirming]);

  // Success
  useEffect(() => {
    if (isSuccess && toastIdRef.current) {
      toast.success("Base URI updated successfully! 🔧", {
        id: toastIdRef.current,
      });
      toastIdRef.current = null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBaseURI("");
    }
  }, [isSuccess]);

  // On-chain revert
  useEffect(() => {
    if (txError && toastIdRef.current) {
      const errorMessage =
        (txReceiptError as BaseError)?.shortMessage ||
        txReceiptError?.message ||
        "Transaction reverted";
      toast.error(errorMessage, { id: toastIdRef.current });
      toastIdRef.current = null;
    }
  }, [txError, txReceiptError]);

  // ---------------- UI STATES ----------------
  const isBusy = isPreparing || isConfirming;

  // Not connected
  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden border-amber-200 bg-amber-50 shadow-lg dark:border-amber-900 dark:bg-amber-950/20">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
              <Wallet className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Wallet Not Connected
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Please connect your wallet to access admin features
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Connected but not owner
  if (!isOwner) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden border-red-200 bg-red-50 shadow-lg dark:border-red-900 dark:bg-red-950/20">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/50">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Access Restricted
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Admin features are restricted to the contract owner only
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Owner view
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-violet-200 shadow-lg dark:border-violet-800">
        <CardHeader className="border-b border-violet-200 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/10">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600 dark:bg-violet-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </CardTitle>
              <CardDescription className="mt-1 text-sm">
                Manage contract settings and base URI configuration
              </CardDescription>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSetBaseURI} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-2"
            >
              <Label
                htmlFor="baseURI"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Base URI
              </Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="baseURI"
                  placeholder="https://api.example.com/metadata/"
                  value={baseURI}
                  onChange={(e) => setBaseURI(e.target.value)}
                  disabled={isBusy}
                  className="pl-10 transition-all focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This base URI will be prepended to token IDs for auto-generated
                metadata URIs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button
                type="submit"
                disabled={isBusy}
                className="w-full bg-violet-600 text-white shadow-md transition-all hover:bg-violet-700 hover:shadow-lg disabled:opacity-50"
                size="lg"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isConfirming
                      ? "Processing Transaction..."
                      : "Preparing Update..."}
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Set Base URI
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
