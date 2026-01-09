"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Music } from "lucide-react";

export interface NFTCardProps {
  title: string;
  description: string;
  artist: string;
  cover?: string;
  media: string;
  owner: string;
  minted: boolean;
  tokenId: number;
}

const NFTCard = ({
  title,
  cover,
  media,
  owner,
  tokenId,
  artist,
  description,
}: NFTCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:scale-105 hover:ring-1 hover:ring-cyan-500/20 transition-transform duration-300 ease-out bg-white dark:bg-zinc-900"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5 bg-white/30 dark:bg-zinc-950/30 backdrop-blur-md text-xs px-2 py-1 rounded-full border border-white/20 dark:border-zinc-800/50">
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span className="text-zinc-800 dark:text-zinc-200">Minted</span>
      </div>

      <div className="aspect-square w-full overflow-hidden rounded-t-xl bg-zinc-100 dark:bg-zinc-800">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            width={500}
            height={500}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600">
            <Music size={48} />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{title}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 truncate">
          {description}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          By {artist} #{tokenId}
        </p>
        {/* <div className="mt-4">
          <audio controls controlsList="nodownload" className="w-full h-10">
            <source src={media} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div> */}
      </div>
    </motion.div>
  );
};

export default NFTCard;
