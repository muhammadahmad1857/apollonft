"use client";
import { useEffect, useState } from "react";
import { MintForm } from "@/components/mint/MintForm";
import { BatchMintForm } from "@/components/mint/BatchMintForm";
import { AdminPanel } from "@/components/mint/AdminPanel";
import { Copy, CheckCircle2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = (process.env.VITE_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

// Replace with contract owner address for admin features
const CONTRACT_OWNER = process.env.VITE_CONTRACT_OWNER;

function App() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"mint" | "batch" | "admin">(
    "mint"
  );
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedOwner, setCopiedOwner] = useState(false);
  useEffect(() => {
    if (!isConnected) {
      toast.info("Please connect your wallet to continue");
      router.push("/");
    }
  }, [isConnected, router]);

  const copyToClipboard = (text: string, type: "address" | "owner") => {
    navigator.clipboard.writeText(text);
    if (type === "address") {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else {
      setCopiedOwner(true);
      setTimeout(() => setCopiedOwner(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
          >
            <Wallet className="h-4 w-4" />
            <span>Web3 NFT Minting Platform</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
          >
            Create Your Digital Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300"
          >
            Mint single or batch NFTs effortlessly. Set custom metadata URIs,
            manage your collection, and bring your digital art to life on the
            blockchain.
          </motion.p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10 flex justify-center"
        >
          <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <button
              onClick={() => setActiveTab("mint")}
              className={`relative rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === "mint"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              Single Mint
            </button>
            <button
              onClick={() => setActiveTab("batch")}
              className={`relative rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === "batch"
                  ? "bg-pink-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              Batch Mint
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`relative rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === "admin"
                  ? "bg-violet-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              Admin Panel
            </button>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                {activeTab === "mint" && (
                  <MintForm contractAddress={CONTRACT_ADDRESS} />
                )}
                {activeTab === "batch" && (
                  <BatchMintForm contractAddress={CONTRACT_ADDRESS} />
                )}
                {activeTab === "admin" && (
                  <AdminPanel
                    contractAddress={CONTRACT_ADDRESS}
                    contractOwner={CONTRACT_OWNER}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 dark:bg-purple-500">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Contract Information
                </h3>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Contract Address
                    </p>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        copyToClipboard(CONTRACT_ADDRESS, "address")
                      }
                      className="h-6 w-6"
                    >
                      {copiedAddress ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <p className="break-all font-mono text-xs leading-relaxed text-gray-900 dark:text-gray-100">
                    {CONTRACT_ADDRESS}
                  </p>
                </div>
                {CONTRACT_OWNER && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Owner Address
                      </p>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => copyToClipboard(CONTRACT_OWNER, "owner")}
                        className="h-6 w-6"
                      >
                        {copiedOwner ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    <p className="break-all font-mono text-xs leading-relaxed text-gray-900 dark:text-gray-100">
                      {CONTRACT_OWNER}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default App;
