"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ThreeDBackground } from "./ThreeDBackground";

function FloatingParticles() {
  const [particles] = useState(() => {
    return Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      endY: Math.random() * 100,
    }));
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: 0,
          }}
          animate={{
            y: [`${particle.y}%`, `${particle.endY}%`],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(useTransform(mouseX, [0, 1], [-20, 20]), springConfig);
  const y = useSpring(useTransform(mouseY, [0, 1], [-20, 20]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseXRelative = e.clientX - rect.left;
      const mouseYRelative = e.clientY - rect.top;
      const xPercent = mouseXRelative / width;
      const yPercent = mouseYRelative / height;
      mouseX.set(xPercent);
      mouseY.set(yPercent);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center px-6 py-20 overflow-hidden"
    >
      <ThreeDBackground />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl text-center z-10">
        {/* Glowing text effect */}
        <motion.div style={{ x, y }} className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight relative"
          >
            <span className="relative inline-block">
              <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-50" />
              <span className="relative bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
                Mint Your Music
              </span>
            </span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative inline-block mt-2"
            >
              <span className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 opacity-40" />
              <span className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                Track as NFTs
              </span>
            </motion.span>
          </motion.h1>

          {/* Animated underline */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="mx-auto mt-4 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            style={{
              boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
            }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-8 max-w-2xl text-lg md:text-xl text-zinc-300/90 backdrop-blur-sm"
        >
          Transform your Music Track creations into unique NFTs. Upload, mint,
          and share your sound on the blockchain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              size="lg"
              className="relative group bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 overflow-hidden"
            >
              <Link href="/mint" className="relative z-10">
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  <span>Create Music Track NFT</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="relative group backdrop-blur-sm bg-white/5 border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
            >
              <Link href="/marketplace" className="relative z-10">
                Explore Marketplace
                <motion.span
                  className="absolute inset-0 border-2 border-cyan-400 rounded-md opacity-0 group-hover:opacity-100"
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(6, 182, 212, 0)",
                      "0 0 20px rgba(6, 182, 212, 0.5)",
                      "0 0 0px rgba(6, 182, 212, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating particles effect */}
        <FloatingParticles />
      </div>
    </section>
  );
}
