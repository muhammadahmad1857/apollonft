"use client";

import { Moon, Sun } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Logo from "./Logo";
import Link from "next/link";

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-transparent backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center"
          >
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
          </motion.div>

          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              asChild
              className="transition-all hover:scale-[1.03] hover:text-cyan-500"
            >
              <Link href="/mint">Mint</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="transition-all hover:scale-[1.03] hover:text-cyan-500"
            >
              <Link href="/files">Files</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="transition-all hover:scale-[1.03] hover:text-cyan-500"
            >
              <Link href="/create">Create</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="transition-all hover:scale-[1.03] hover:text-cyan-500"
            >
              <Link href="/marketplace">Marketplace</Link>
            </Button>
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="rounded-lg transition-all"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <ConnectButton showBalance  />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
