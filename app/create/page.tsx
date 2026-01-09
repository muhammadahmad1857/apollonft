"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/create/FileUpload";
import { MetadataForm } from "@/components/create/MetadataForm";
import { createClient } from "@/lib/config/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// interface FileData {
//   id?: string;
//   wallet_id: string;
//   ipfsUrl: string;
//   type: ".mp3" | ".mp4" | ".wav";
//   createdAt?: Date;
//   isMinted: boolean;
// }

export default function CreatePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedFile, setUploadedFile] = useState<{
    ipfsUrl: string;
    type: ".mp3" | ".mp4" | ".wav";
    name: string;
  } | null>(null);
  const [metadata, setMetadata] = useState<{
    name: string;
    title: string;
    description: string;
    coverImageUrl?: string;
  }>({
    name: "",
    title: "",
    description: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) {
      toast.info("Please connect your wallet to continue");
      router.push("/");
    }
  }, [isConnected, router]);

  const handleFileUpload = (
    ipfsUrl: string,
    fileType: ".mp3" | ".mp4" | ".wav",
    fileName: string
  ) => {
    setUploadedFile({ ipfsUrl, type: fileType, name: fileName });
    // Enable metadata tab after upload
    if (activeTab === "upload") {
      setTimeout(() => setActiveTab("metadata"), 500);
    }
  };

  const handleMetadataChange = (newMetadata: typeof metadata) => {
    setMetadata(newMetadata);
  };

  const saveDraft = async () => {
    if (!address || !uploadedFile) {
      toast.error("Please upload a file first");
      return;
    }

    if (!metadata.name || !metadata.title) {
      toast.error("Please fill in name and title");
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();

      // Create metadata JSON
      const metadataJSON = {
        name: metadata.name,
        title: metadata.title,
        description: metadata.description,
        cover: metadata.coverImageUrl || null,
        media: uploadedFile.ipfsUrl,
      };

      // Upload metadata to Pinata
      const jwtRes = await fetch("/api/pinata/jwt", { method: "POST" });
      if (!jwtRes.ok) {
        throw new Error("Failed to get upload token");
      }
      const { JWT } = await jwtRes.json();

      const metadataFormData = new FormData();
      metadataFormData.append(
        "pinataMetadata",
        JSON.stringify({
          name: `${metadata.name}-metadata.json`,
        })
      );
      metadataFormData.append("pinataContent", JSON.stringify(metadataJSON));

      const metadataUploadRes = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pinataMetadata: {
              name: `${metadata.name}-metadata.json`,
            },
            pinataContent: metadataJSON,
          }),
        }
      );

      if (!metadataUploadRes.ok) {
        throw new Error("Failed to upload metadata");
      }

      const metadataJson = await metadataUploadRes.json();
      const metadataIpfsUrl = `ipfs://${metadataJson.IpfsHash}`;

      // Save to Supabase
      if (draftId) {
        // Update existing draft
        const { error } = await supabase
          .from("files")
          .update({
            ipfsUrl: uploadedFile.ipfsUrl,
            type: uploadedFile.type,
            metadataUrl: metadataIpfsUrl,
          })
          .eq("id", draftId);

        if (error) throw error;
        toast.success("Draft updated!");
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from("files")
          .insert({
            wallet_id: address,
            ipfsUrl: uploadedFile.ipfsUrl,
            type: uploadedFile.type,
            metadataUrl: metadataIpfsUrl,
            isMinted: false,
          })
          .select()
          .single();

        if (error) throw error;
        setDraftId(data.id);
        toast.success("Draft saved!");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save draft"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setMetadata({ name: "", title: "", description: "" });
    setDraftId(null);
    setActiveTab("upload");
    toast.info("Form reset");
  };

  const canSaveDraft =
    uploadedFile !== null &&
    metadata.name.trim() !== "" &&
    metadata.title.trim() !== "";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Create New NFT
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Upload your audio and prepare metadata before minting
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-3 h-0.5 bg-linear-to-r from-cyan-500 to-blue-500"
          />
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-24">
          <TabsList className="grid w-full grid-cols-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-transparent p-1">
            <TabsTrigger
              value="upload"
              disabled={false}
              className="rounded-full data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
            >
              Upload File
            </TabsTrigger>
            <TabsTrigger
              value="metadata"
              disabled={!uploadedFile}
              className="rounded-full data-[state=active]:bg-cyan-500 data-[state=active]:text-white disabled:opacity-50"
            >
              Metadata
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FileUpload
                onUploadComplete={handleFileUpload}
                uploadedFile={uploadedFile}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="metadata" className="mt-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MetadataForm
                onMetadataChange={handleMetadataChange}
                initialData={metadata}
              />
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-sm z-40"
        >
          <div className="mx-auto max-w-4xl px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Reset
              </Button>
              <Button
                onClick={saveDraft}
                disabled={!canSaveDraft || isSaving}
                className="bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Draft"
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
