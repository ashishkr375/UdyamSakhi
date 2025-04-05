"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onUpload: (url: string, public_id: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, onUpload }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'avatar');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      onUpload(data.url, data.public_id);
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      toast.error('Error uploading avatar');
      console.error('Avatar upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentAvatarUrl} />
        <AvatarFallback>
          {isUploading ? (
            <Icons.spinner className="h-8 w-8 animate-spin" />
          ) : (
            <Icons.user className="h-8 w-8" />
          )}
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => document.getElementById('avatar-upload')?.click()}
        >
          {isUploading ? 'Uploading...' : 'Change Avatar'}
        </Button>
        {currentAvatarUrl && (
          <Button
            variant="destructive"
            size="sm"
            disabled={isUploading}
            onClick={() => onUpload('', '')}
          >
            Remove
          </Button>
        )}
      </div>

      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
} 