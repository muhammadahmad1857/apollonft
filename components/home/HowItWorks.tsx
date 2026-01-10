"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, FileText, Sparkles } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Upload your Music track file and prepare it for minting",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: FileText,
    title: "Metadata",
    description: "Add metadata, title, and description to your NFT",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    icon: Sparkles,
    title: "Mint",
    description: "Mint your Music track as an NFT on the blockchain",
    gradient: "from-purple-500 to-pink-500",
  },
];

function FloatingCard({
  children,
  index,
  isInView,
}: {
  children: React.ReactNode;
  index: number;
  isInView: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [10, -10]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotateX: 0 }
          : { opacity: 0, y: 50, rotateX: -15 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
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
      {children}
    </motion.div>
  );
}

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative px-6 py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              How It Works
            </span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "200px" } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            style={{
              boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
            }}
          />
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <FloatingCard key={step.title} index={index} isInView={isInView}>
                <Card className="group h-full relative overflow-hidden backdrop-blur-sm bg-zinc-900/50 border-2 border-zinc-800/50 transition-all duration-500">
                  {/* Animated gradient border */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />

                  {/* Glow effect */}
                  <motion.div
                    className={`absolute -inset-1 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />

                  <CardHeader className="relative z-10">
                    <motion.div
                      className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} relative overflow-hidden`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      />
                      <Icon className="h-8 w-8 text-white relative z-10" />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-zinc-300 text-base leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardContent>

                  {/* Step number */}
                  <motion.div
                    className="absolute top-4 right-4 text-6xl font-black text-zinc-800/30"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0 }
                    }
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                  >
                    {index + 1}
                  </motion.div>
                </Card>
              </FloatingCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
