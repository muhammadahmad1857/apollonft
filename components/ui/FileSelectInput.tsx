"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import CustomSelect from "./CustomSelect";
import { createClient } from "@/lib/config/supabase/client";

interface FileFromDB {
  type: string;
  ipfsUrl: string;
  filename:string
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
  const [isLoading,setIsLoading] = useState(false)
  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("files")
          .select("filename, type, ipfsUrl")
          .eq("wallet_id", walletId);
        if (error) {
          console.log("Error fetching files from Supabase:", error);
          throw new Error("Failed to fetch files");
        }

        const allFiles: FileFromDB[] = data;

        let filteredFiles = allFiles;
        if (fileExtensions && fileExtensions.length > 0) {
          filteredFiles = allFiles.filter((file) =>
            fileExtensions.some((ext) => file.type === ext)
          );
        }
        setFiles(filteredFiles);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
      finally{
        setIsLoading(false)
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
    value: file.ipfsUrl,
    label: `${file.filename}`,
  }));

  return (
    <CustomSelect
      value={selectedFile}
      onChange={handleSelectChange}
      options={options}
      isLoading={isLoading}
      placeholder="Select a file..."
      className={className}
    />
  );
};

export default FileSelectInput;
