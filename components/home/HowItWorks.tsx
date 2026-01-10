"use client";

import { motion } from "framer-motion";
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
  },
  {
    icon: FileText,
    title: "Metadata",
    description: "Add metadata, title, and description to your NFT",
  },
  {
    icon: Sparkles,
    title: "Mint",
    description: "Mint your Music track as an NFT on the blockchain",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="text-center text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mb-12"
        >
          How It Works
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
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
                <Card className="group h-full border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40">
                  <CardHeader>
                    <motion.div
                      className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <CardTitle className="text-zinc-900 dark:text-zinc-100">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-zinc-600 dark:text-zinc-400">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}