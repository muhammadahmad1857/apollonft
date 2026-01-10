"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Music } from "lucide-react";

interface NFT {
  id: string;
  title: string;
  owner: string;
  audioUrl: string;
  mintedAt: string;
}

// Mock data - replace with actual NFT fetching logic
const mockNFTs: NFT[] = [
  {
    id: "1",
    title: "Ambient Dreams",
    owner: "0x1234...5678",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    mintedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Digital Waves",
    owner: "0xabcd...efgh",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    mintedAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Ethereal Sounds",
    owner: "0x9876...5432",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    mintedAt: "2024-01-13",
  },
];

export function FeaturedNFTs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setNfts(mockNFTs);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <section ref={ref} className="px-6 py-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="mb-12"
        >
          <h2 className="text-center text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Latest Minted Music track NFTs
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "100%" } : { width: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
            className="mx-auto h-0.5 w-24 bg-cyan-500"
          />
        </motion.div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {nfts.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "ease-out",
                }}
              >
                <Card className="group h-full border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-zinc-900 dark:text-zinc-100 mb-2">
                          {nft.title}
                        </CardTitle>
                        <CardDescription className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                          {nft.owner}
                        </CardDescription>
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20">
                        <div className="h-2 w-2 rounded-full bg-cyan-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-4 mb-4 flex items-center justify-center">
                      <Music className="h-12 w-12 text-cyan-500/40" />
                    </div>
                    <audio controls className="w-full h-10" src={nft.audioUrl}>
                      Your browser does not support the audio element.
                    </audio>
                    <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                      Minted {nft.mintedAt}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}