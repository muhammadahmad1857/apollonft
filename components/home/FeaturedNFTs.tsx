"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
import { Music, Sparkles } from "lucide-react";

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

function NFTCard3D({
  nft,
  index,
  isInView,
}: {
  nft: NFT;
  index: number;
  isInView: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [8, -8]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-8, 8]),
    springConfig
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXRelative = e.clientX - rect.left;
    const mouseYRelative = e.clientY - rect.top;
    const xPercent = mouseXRelative / width - 0.5;
    const yPercent = mouseYRelative / height - 0.5;
    mouseX.set(xPercent);
    mouseY.set(yPercent);
  };

  const gradients = [
    "from-cyan-500/20 to-blue-500/20",
    "from-blue-500/20 to-purple-500/20",
    "from-purple-500/20 to-pink-500/20",
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotateX: 0 }
          : { opacity: 0, y: 50, rotateX: -10 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      whileHover={{ scale: 1.05, z: 50 }}
    >
      <Card className="group h-full relative overflow-hidden backdrop-blur-sm bg-zinc-900/60 border-2 border-zinc-800/50 transition-all duration-500">
        {/* Animated gradient background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${
            gradients[index % gradients.length]
          } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"
          animate={{
            scale: isHovered ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/50 rounded-lg"
          animate={{
            boxShadow: isHovered
              ? [
                  "0 0 0px rgba(6, 182, 212, 0)",
                  "0 0 30px rgba(6, 182, 212, 0.5)",
                  "0 0 0px rgba(6, 182, 212, 0)",
                ]
              : "0 0 0px rgba(6, 182, 212, 0)",
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {nft.title}
              </CardTitle>
              <CardDescription className="text-xs font-mono text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {nft.owner}
              </CardDescription>
            </div>
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 relative overflow-hidden"
              whileHover={{ scale: 1.2, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/30"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <div className="h-2 w-2 rounded-full bg-white relative z-10" />
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <motion.div
            className="rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-8 mb-4 flex items-center justify-center relative overflow-hidden border border-zinc-700/50"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            >
              <Music className="h-16 w-16 text-cyan-400/60" />
            </motion.div>
            <motion.div
              className="absolute top-2 right-2"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </motion.div>
          </motion.div>
          <audio controls className="w-full h-10 rounded-lg" src={nft.audioUrl}>
            Your browser does not support the audio element.
          </audio>
          <motion.p
            className="mt-3 text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            Minted {nft.mintedAt}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

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
    <section ref={ref} className="relative px-6 py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Latest Minted Music Track NFTs
            </span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "300px" } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            style={{
              boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
            }}
          />
        </motion.div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm"
              >
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2 bg-zinc-800" />
                  <Skeleton className="h-4 w-24 bg-zinc-800" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4 bg-zinc-800" />
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {nfts.map((nft, index) => (
              <NFTCard3D
                key={nft.id}
                nft={nft}
                index={index}
                isInView={isInView}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
