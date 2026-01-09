"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => (prev === 1 ? 0.95 : 1));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative rounded-2xl bg-linear-to-r from-cyan-500 to-blue-500 p-[2px]"
        >
          <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-12 text-center">
            <h2 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Ready to mint your audio?
            </h2>
            <motion.div
              animate={{ opacity: pulse }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <Button
                asChild
                size="lg"
                className="mt-6 bg-cyan-500 text-white hover:bg-cyan-600 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              >
                <Link href="/mint">Get Started</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
