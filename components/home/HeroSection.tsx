"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6 py-20">
      <div className="mx-auto max-w-7xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl"
        >
          <span className="bg-linear-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Mint Your Audio as NFTs
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "ease-out" }}
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400"
        >
          Transform your audio creations into unique NFTs. Upload, mint, and
          share your sound on the blockchain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "ease-out" }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="bg-cyan-500 text-white hover:bg-cyan-600 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          >
            <Link href="/mint">Create Audio NFT</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-zinc-300 dark:border-zinc-700 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300"
          >
            <Link href="/marketplace">Explore Marketplace</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
