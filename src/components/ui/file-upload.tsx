"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "./button";
import { Icons } from "./icons";

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
}

export function FileUpload({
  onUpload,
  accept = ["image/*", "application/pdf"],
  maxSize = 5242880, // 5MB
  maxFiles = 1,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true);
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        onUpload(data.url);
        toast.success("File uploaded successfully");
      } catch (error) {
        toast.error("Error uploading file");
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxSize,
    maxFiles,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <div className="flex justify-center">
          {isUploading ? (
            <Icons.spinner className="h-6 w-6 animate-spin" />
          ) : (
            <Icons.upload className="h-6 w-6" />
          )}
        </div>
        {isDragActive ? (
          <p>Drop the file here</p>
        ) : (
          <>
            <p>Drag and drop a file here, or click to select</p>
            <p className="text-sm text-muted-foreground">
              Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </>
        )}
        <Button type="button" variant="outline" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Select File"}
        </Button>
      </div>
    </div>
  );
} 