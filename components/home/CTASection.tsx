"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

function FloatingSparkles() {
  const [sparkles] = useState(() => {
    return Array.from({ length: 6 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
      endY: (Math.random() - 0.5) * 50,
    }));
  });

  return (
    <>
      {sparkles.map((sparkle, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: `${sparkle.x}%`,
            y: `${sparkle.y}%`,
            opacity: 0,
          }}
          animate={{
            y: [`${sparkle.y}%`, `${sparkle.y + sparkle.endY}%`],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: sparkle.duration,
            repeat: Infinity,
            delay: sparkle.delay,
          }}
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
        </motion.div>
      ))}
    </>
  );
}

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative px-6 py-32 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 50, scale: 0.9 }
          }
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Outer glow border */}
          <motion.div
            className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-75 blur-xl"
            animate={{
              opacity: [0.5, 0.75, 0.5],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          {/* Animated border */}
          <motion.div
            className="absolute -inset-0.5 rounded-3xl"
            style={{
              background:
                "linear-gradient(45deg, #06b6d4, #3b82f6, #a855f7, #06b6d4)",
              backgroundSize: "300% 300%",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="relative rounded-3xl backdrop-blur-xl bg-zinc-900/80 border-2 border-cyan-500/30 p-12 md:p-16 text-center overflow-hidden">
            {/* Animated background pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, rgba(6,182,212,0.5) 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
              animate={{
                x: [0, 40],
                y: [0, 40],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Floating sparkles */}
            <FloatingSparkles />

            <div className="relative z-10">
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Ready to mint your Music track?
                </span>
              </motion.h2>

              <motion.p
                className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Join the future of music ownership. Transform your tracks into
                unique NFTs on the blockchain.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="relative group bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 overflow-hidden text-lg px-8 py-6"
                >
                  <Link
                    href="/mint"
                    className="relative z-10 flex items-center gap-2"
                  >
                    <span>Get Started</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </Link>
                </Button>
              </motion.div>

              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-cyan-400/50"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
