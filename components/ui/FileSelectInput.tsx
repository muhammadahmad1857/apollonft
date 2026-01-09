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
      try {
        const response = await fetch(`/api/files?walletId=${walletId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }
        const allFiles: FileFromDB[] = await response.json();

        let filteredFiles = allFiles;
        if (fileExtensions && fileExtensions.length > 0) {
          filteredFiles = allFiles.filter((file) =>
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
