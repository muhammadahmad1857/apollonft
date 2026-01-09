"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import CustomSelect from "./CustomSelect";

interface FileFromDB {
  name: string;
  ipfs_url: string;
}

interface FileSelectInputProps {
  walletId: string;
  fileExtensions?: string[];
  onChange: (ipfsUrl: string) => void;
  className?: string;
}

const FileSelectInput = ({
  walletId,
  fileExtensions,
  onChange,
  className,
}: FileSelectInputProps) => {
  const [files, setFiles] = useState<FileFromDB[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");

  useEffect(() => {
    const fetchFiles = async () => {
      // TODO: Replace with actual API endpoint
      const mockFiles: FileFromDB[] = [
        { name: "metadata1.json", ipfs_url: "ipfs://hash1/metadata1.json" },
        { name: "metadata2.json", ipfs_url: "ipfs://hash2/metadata2.json" },
        { name: "track1.mp3", ipfs_url: "ipfs://hash3/track1.mp3" },
        { name: "video1.mp4", ipfs_url: "ipfs://hash4/video1.mp4" },
      ];

      try {
        let filteredFiles = mockFiles;
        if (fileExtensions && fileExtensions.length > 0) {
          filteredFiles = mockFiles.filter((file) =>
            fileExtensions.some((ext) => file.name.endsWith(ext))
          );
        }
        setFiles(filteredFiles);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    };

    if (walletId) {
      fetchFiles();
    }
  }, [walletId, fileExtensions]);

  const handleSelectChange = (value: string) => {
    setSelectedFile(value);
    onChange(value);
  };

  const options = files.map((file) => ({
    value: file.ipfs_url,
    label: file.name,
  }));

  return (
    <CustomSelect
      value={selectedFile}
      onChange={handleSelectChange}
      options={options}
      placeholder="Select a file..."
      className={className}
    />
  );
};

export default FileSelectInput;
