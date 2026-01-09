"use client";

import { useState } from "react";
import Link from "next/link";

export function Footer() {
  const [showCredit, setShowCredit] = useState(false);

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            © 2026 All rights reserved
          </p>
          <Link
            href="#"
            onMouseEnter={() => setShowCredit(true)}
            onMouseLeave={() => setShowCredit(false)}
            className="text-xs text-zinc-400 transition-colors hover:text-cyan-500 cursor-pointer"
          >
            {showCredit
              ? "crafted with care · developed by Ahmad"
              : "crafted with care"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
