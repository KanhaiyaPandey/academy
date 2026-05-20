"use client";

import { useState, useRef } from "react";
import { Button, Spin } from "antd";
import { UploadOutlined, DeleteOutlined, CameraOutlined } from "@ant-design/icons";
import Image from "next/image";

interface ImageUploadProps {
  readonly value?: string;
  readonly onChange?: (url: string | undefined) => void;
  readonly variant?: "avatar" | "banner";
  readonly label?: string;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const FOLDER = "pahal_academy";

async function uploadToCloudinary(file: File): Promise<string> {
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: FOLDER }),
  });
  if (!signRes.ok) throw new Error("Failed to get upload signature");
  const { signature, timestamp, apiKey } = await signRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", FOLDER);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  if (!uploadRes.ok) throw new Error("Upload failed");

  const data = await uploadRes.json();
  return data.secure_url as string;
}

export default function ImageUpload({
  value,
  onChange,
  variant = "avatar",
  label = "Upload Photo",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange?.(url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  if (variant === "avatar") {
    let avatarInner: React.ReactNode;
    if (uploading) {
      avatarInner = <Spin size="default" />;
    } else if (value) {
      avatarInner = (
        <>
          <Image src={value} alt="Profile" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <CameraOutlined className="text-white text-xl" />
          </div>
        </>
      );
    } else {
      avatarInner = (
        <div className="flex flex-col items-center text-gray-400">
          <CameraOutlined style={{ fontSize: 24 }} />
          <span className="text-xs mt-1">Photo</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-2">
        <div
          role="button"
          tabIndex={0}
          className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer hover:border-primary-400 transition-colors overflow-hidden"
          onClick={() => inputRef.current?.click()}
          onKeyDown={handleKeyDown}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {avatarInner}
        </div>

        <div className="flex gap-2">
          <Button size="small" icon={<UploadOutlined />} onClick={() => inputRef.current?.click()} loading={uploading}>
            {label}
          </Button>
          {value && (
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onChange?.(undefined)} />
          )}
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          title="Upload profile photo"
          onChange={handleInputChange}
        />
      </div>
    );
  }

  // banner / thumbnail variant
  let bannerInner: React.ReactNode;
  if (uploading) {
    bannerInner = <Spin size="large" />;
  } else if (value) {
    bannerInner = (
      <>
        <Image src={value} alt="Thumbnail" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <UploadOutlined className="text-white text-2xl" />
        </div>
      </>
    );
  } else {
    bannerInner = (
      <div className="flex flex-col items-center text-gray-400 gap-1">
        <UploadOutlined style={{ fontSize: 28 }} />
        <span className="text-sm">Click or drag image here</span>
        <span className="text-xs text-gray-300">PNG, JPG up to 5 MB</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        className="relative w-full h-40 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer hover:border-primary-400 transition-colors overflow-hidden"
        onClick={() => inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {bannerInner}
      </div>

      <div className="flex gap-2">
        <Button icon={<UploadOutlined />} onClick={() => inputRef.current?.click()} loading={uploading}>
          {label}
        </Button>
        {value && (
          <Button danger icon={<DeleteOutlined />} onClick={() => onChange?.(undefined)}>
            Remove
          </Button>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        title="Upload image"
        onChange={handleInputChange}
      />
    </div>
  );
}
