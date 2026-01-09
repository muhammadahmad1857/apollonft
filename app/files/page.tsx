"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createClient } from "@/lib/config/supabase/client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/utils";
import PageHeading from "@/components/marketplace/PageHeading";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FileData {
  id: string;
  created_at: string;
  wallet_id: string;
  ipfsUrl: string;
  type: string;
  isMinted: boolean;
}

export default function FilesPage() {
  const { address, isConnected } = useAccount();
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("wallet_id", address)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching files:", error);
        setFiles([]);
      } else if (data) {
        setFiles(data);
      }
      setLoading(false);
    };

    if (isConnected) {
      fetchFiles();
    }
  }, [address, isConnected]);

  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <PageHeading
          title="My Files"
          description="Browse and manage your uploaded files."
        />

        {!isConnected ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-2xl font-bold mb-4">
                Please connect your wallet to see your files.
              </p>
              <ConnectButton />
            </div>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-center h-96 flex flex-col items-center justify-center">
            <p className="text-xl">You haven&apos;t uploaded any files yet.</p>
          </div>
        ) : (
          <motion.div
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            initial="hidden"
            animate="show"
            transition={{
              delay: 0.1,
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>IPFS URL</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">
                      {truncate(file.id, 20)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{file.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${file.ipfsUrl.replace(
                          "ipfs://",
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-500 hover:underline"
                      >
                        {truncate(file.ipfsUrl, 40)}
                      </a>
                    </TableCell>
                    <TableCell>
                      {new Date(file.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {file.isMinted ? (
                        <Badge>Minted</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </div>
    </div>
  );
}
