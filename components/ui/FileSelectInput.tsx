"use client";

import * as React from "react";
import { useState, useEffect } from "react";

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
      // This is a placeholder. We assume an API endpoint exists that returns
      // a list of files for a given walletId.
      const mockFiles: FileFromDB[] = [
        { name: "metadata1.json", ipfs_url: "ipfs://hash1/metadata1.json" },
        { name: "metadata2.json", ipfs_url: "ipfs://hash2/metadata2.json" },
        { name: "track1.mp3", ipfs_url: "ipfs://hash3/track1.mp3" },
        { name: "video1.mp4", ipfs_url: "ipfs://hash4/video1.mp4" },
      ];

      try {
        // In a real implementation, you would fetch from your API:
        // const response = await fetch(`/api/files?wallet_id=${walletId}`);
        // const data = await response.json();
        // setFiles(data);

        // Using mock data for now
        let filteredFiles = mockFiles;
        if (fileExtensions && fileExtensions.length > 0) {
          filteredFiles = mockFiles.filter((file) =>
            fileExtensions.some((ext) => file.name.endsWith(ext))
          );
        }
        setFiles(filteredFiles);
      } catch (error) {
        console.error("Failed to fetch files:", error);
        // Handle error appropriately in a real app
      }
    };

    if (walletId) {
      fetchFiles();
    }
  }, [walletId, fileExtensions]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIpfsUrl = e.target.value;
    setSelectedFile(selectedIpfsUrl);
    onChange(selectedIpfsUrl);
  };

  return (
    <select
      value={selectedFile}
      onChange={handleSelectChange}
      className={className}
    >
      <option value="" disabled>
        Select a file...
      </option>
      {files.map((file) => (
        <option key={file.ipfs_url} value={file.ipfs_url}>
          {file.name}
        </option>
      ))}
    </select>
  );
};

export default FileSelectInput;
