"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Music, Play, X } from "lucide-react";

export interface NFTCardProps {
  title: string;
  description: string;
  name: string;
  cover?: string;      // HTTP URL from Pinata (image)
  media: string;       // HTTP URL from Pinata (audio or video)
  minted: boolean;
  tokenId: number;
}

const NFTCard = ({
  title,
  cover,
  media,
  tokenId,
  name,
  description,
}: NFTCardProps) => {
  const [mediaType, setMediaType] = useState<"audio" | "video" | "unknown">("unknown");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Determine media type using HEAD request (most reliable for HTTP URLs)
  useEffect(() => {
    const detectMediaType = async () => {
      console.log("Detecting media type for media ",media)
      if (!media) return;

      try {
        const response = await fetch(media, { method: "HEAD" });
        if (!response.ok) return;

        const contentType = response.headers.get("content-type")?.toLowerCase() || "";
        console.log("contentType",contentType)
        if (contentType.startsWith("audio/")) {
          setMediaType("audio");
        } else if (contentType.startsWith("video/")) {
          setMediaType("video");
        } else {
          // Fallback: extension check
          const ext = media.split(".").pop()?.toLowerCase();
          if (["mp3", "wav", "ogg", "m4a", "aac"].includes(ext || "")) {
            setMediaType("audio");
          } else if (["mp4", "webm", "ogg", "mov"].includes(ext || "")) {
            setMediaType("video");
          }
        }
      } catch (err) {
        console.warn("Could not detect media type:", err);
        // Fallback to extension only
        const ext = media.split(".").pop()?.toLowerCase();
        if (["mp3", "wav", "ogg", "m4a", "aac"].includes(ext || "")) {
          setMediaType("audio");
        } else if (["mp4", "webm", "ogg", "mov"].includes(ext || "")) {
          setMediaType("video");
        }
      }
    };

    detectMediaType();
  }, [media]);

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      <motion.div
        className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:scale-105 hover:ring-1 hover:ring-cyan-500/20 transition-all duration-300 ease-out bg-white dark:bg-zinc-900 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        {/* Minted badge */}
        <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md text-xs px-2.5 py-1 rounded-full border border-white/30 dark:border-zinc-700/50">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-zinc-900 dark:text-zinc-100 font-medium">Minted</span>
        </div>

        {/* Cover Image / Placeholder */}
        <div className="aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {cover ? (
            <Image
              src={cover}
              alt={title}
              width={500}
              height={500}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              priority={tokenId <= 12} // optional: preload first few cards
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600">
              <Music size={64} strokeWidth={1.2} />
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5">
          <h3 className="font-semibold text-lg truncate">{title}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 line-clamp-2">
            {description}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            By {name} · #{tokenId}
          </p>

          {/* Media Controls */}
          <div className="mt-5">
            {mediaType === "audio" && media ? (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                <audio
                  controls
                  controlsList="nodownload"
                  className="w-full h-10"
                >
                  <source src={media} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : mediaType === "video" && media ? (
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 hover:from-cyan-500/20 hover:to-cyan-600/20 text-cyan-600 dark:text-cyan-400 font-medium rounded-lg flex items-center justify-center gap-2.5 transition-all duration-300 border border-cyan-500/20 hover:border-cyan-500/40"
              >
                <Play size={20} fill="currentColor" />
                Play Video
              </button>
            ) : (
              <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 italic">
                No playable media available
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Full-screen Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && mediaType === "video" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-6xl mx-4 bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                aria-label="Close video"
              >
                <X size={28} />
              </button>

              <video
                controls
                autoPlay
                className="w-full max-h-[85vh] object-contain"
              >
                <source src={media} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NFTCard;