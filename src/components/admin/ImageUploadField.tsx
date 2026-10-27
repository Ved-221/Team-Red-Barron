"use client";

import { useState, useRef, useId } from "react";
import Image from "next/image";
import { Upload, X, RefreshCw, Link as LinkIcon, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface ImageUploadFieldProps {
  name: string;
  defaultValue?: string | null;
  label?: string;
  className?: string;
  maxDimension?: number;
  maxSizeMb?: number;
}

function loadHtmlImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

async function compressImageInBrowser(file: File, maxDimension = 1920): Promise<File> {
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return file;
  }

  let imageSource: ImageBitmap | HTMLImageElement;
  let width = 0;
  let height = 0;

  if (typeof createImageBitmap === "function") {
    try {
      imageSource = await createImageBitmap(file, { imageOrientation: "from-image" });
      width = imageSource.width;
      height = imageSource.height;
    } catch {
      imageSource = await loadHtmlImage(file);
      width = imageSource.width;
      height = imageSource.height;
    }
  } else {
    imageSource = await loadHtmlImage(file);
    width = imageSource.width;
    height = imageSource.height;
  }

  let targetWidth = width;
  let targetHeight = height;

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      targetWidth = maxDimension;
      targetHeight = Math.round((height * maxDimension) / width);
    } else {
      targetHeight = maxDimension;
      targetWidth = Math.round((width * maxDimension) / height);
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    if ("close" in imageSource && typeof imageSource.close === "function") {
      imageSource.close();
    }
    return file;
  }

  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);

  if ("close" in imageSource && typeof imageSource.close === "function") {
    imageSource.close();
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.8);
  });

  if (!blob) {
    return file;
  }

  const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
  const newFileName = `${baseName}.webp`;
  const compressedFile = new File([blob], newFileName, {
    type: "image/webp",
    lastModified: Date.now(),
  });

  return compressedFile.size < file.size ? compressedFile : file;
}

export function ImageUploadField({
  name,
  defaultValue,
  label = "Upload Image",
  className = "",
  maxDimension = 1920,
  maxSizeMb = 5,
}: ImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [selectedFileMeta, setSelectedFileMeta] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [directUrl, setDirectUrl] = useState(defaultValue || "");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);
  if (defaultValue !== prevDefaultValue) {
    setPrevDefaultValue(defaultValue);
    setPreview(defaultValue || null);
    setDirectUrl(defaultValue || "");
    setIsRemoved(false);
    setSelectedFileMeta(null);
    setErrorMessage(null);
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");

    if (isHeic) {
      setErrorMessage(
        "HEIC/HEIF images are not supported directly in the browser. Please convert to JPEG, PNG, or WebP before uploading."
      );
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setPreview(null);
      setSelectedFileMeta(null);
      return;
    }

    const RAW_MAX_BYTES = 25 * 1024 * 1024;
    if (file.size > RAW_MAX_BYTES) {
      const rawMb = (file.size / (1024 * 1024)).toFixed(1);
      setErrorMessage(`Selected file is too large (${rawMb} MB). Please select an image under 25 MB.`);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setPreview(null);
      setSelectedFileMeta(null);
      return;
    }

    setErrorMessage(null);
    setIsOptimizing(true);

    const form = inputRef.current?.closest("form");
    const submitButtons = form?.querySelectorAll<HTMLButtonElement>("button[type='submit']");
    submitButtons?.forEach((btn) => {
      btn.disabled = true;
    });

    try {
      let finalFile: File = file;
      try {
        finalFile = await compressImageInBrowser(file, maxDimension);
      } catch (err) {
        console.warn("Browser compression failed, using original file:", err);
        finalFile = file;
      }

      if (finalFile.size > maxSizeMb * 1024 * 1024) {
        const sizeMb = (finalFile.size / (1024 * 1024)).toFixed(1);
        setErrorMessage(`File exceeds ${maxSizeMb} MB limit (${sizeMb} MB). Please select a smaller file.`);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setPreview(null);
        setSelectedFileMeta(null);
        return;
      }

      if (inputRef.current && typeof DataTransfer !== "undefined") {
        const dt = new DataTransfer();
        dt.items.add(finalFile);
        inputRef.current.files = dt.files;
      }

      const url = URL.createObjectURL(finalFile);
      setPreview(url);
      setSelectedFileMeta({
        name: finalFile.name,
        size: formatFileSize(finalFile.size),
      });
      setIsRemoved(false);
    } finally {
      setIsOptimizing(false);
      submitButtons?.forEach((btn) => {
        btn.disabled = false;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setPreview(null);
    setSelectedFileMeta(null);
    setIsRemoved(true);
    setDirectUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleTriggerBrowse = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (inputRef.current) {
        inputRef.current.files = e.dataTransfer.files;
      }
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDirectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setDirectUrl(url);
    const trimmed = url.trim();
    if (/^https?:\/\/\S+$/i.test(trimmed)) {
      setPreview(trimmed);
      setIsRemoved(false);
      setSelectedFileMeta(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } else if (!trimmed) {
      setPreview(null);
      setIsRemoved(true);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider cursor-pointer"
          >
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-mono-tech text-white/50 hover:text-[#de1615] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? "Hide Direct URL" : "Enter Image URL"}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10">
          <input
            type="url"
            name={`${name}_direct_url`}
            value={directUrl}
            onChange={handleDirectUrlChange}
            placeholder="Paste public image URL (e.g. https://...)"
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white font-mono focus:outline-none placeholder:text-white/30"
          />
          {directUrl && (
            <button
              type="button"
              onClick={() => {
                setDirectUrl("");
                setPreview(null);
                setIsRemoved(true);
              }}
              className="p-1 hover:text-[#de1615] text-white/40 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all ${
          isDragging
            ? "border-[#de1615] bg-[#de1615]/10"
            : "border-white/20 bg-[#12151b] hover:border-white/40"
        }`}
      >
        {preview ? (
          <div className="relative aspect-video w-full bg-black/80 flex items-center justify-center group overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized
            />

            {/* Hover / Overlay Controls */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
              <button
                type="button"
                onClick={handleTriggerBrowse}
                className="flex items-center gap-2 bg-[#de1615] hover:bg-[#b81211] text-white px-4 py-2 rounded-lg font-sora font-semibold text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Change Photo
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-2 bg-white/10 hover:bg-red-500/80 text-white px-3 py-1.5 rounded-lg font-inter text-xs transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Remove Photo
              </button>
            </div>

            {/* Always visible quick action buttons in top-right */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
              <button
                type="button"
                onClick={handleTriggerBrowse}
                title="Change image"
                className="bg-black/70 hover:bg-[#de1615] text-white p-2 rounded-lg transition-colors border border-white/20 shadow-md cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                title="Remove image"
                className="bg-black/70 hover:bg-red-600 text-white p-2 rounded-lg transition-colors border border-white/20 shadow-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Status badge when a local file is picked */}
            {selectedFileMeta && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#de1615]/40 flex items-center justify-between text-xs font-mono-tech text-white/90">
                <span className="flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span className="truncate">{selectedFileMeta.name}</span>
                </span>
                <span className="text-white/50 shrink-0 ml-2">{selectedFileMeta.size}</span>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={handleTriggerBrowse}
            className="flex flex-col items-center justify-center py-12 px-4 cursor-pointer w-full h-full group"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#de1615]/20 group-hover:text-[#de1615] text-white/50 transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-inter text-white/80 group-hover:text-white font-medium">
              Click to select or drag & drop image
            </span>
            <span className="text-xs text-white/40 mt-1 font-mono-tech uppercase">
              PNG, JPG, WEBP, AVIF (Max {maxSizeMb} MB • Auto-optimized)
            </span>
          </div>
        )}

        {/* Optimizing Overlay */}
        {isOptimizing && (
          <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#de1615] animate-spin" />
            <div className="text-center">
              <span className="font-sora font-semibold text-sm text-white block">
                Optimizing...
              </span>
              <span className="font-mono-tech text-xs text-white/50 mt-0.5 block">
                Resizing and compressing to WebP
              </span>
            </div>
          </div>
        )}

        {/* The actual HTML file input */}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          name={name}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Hidden inputs to inform Server Action of removals and existing URLs */}
        {isRemoved && defaultValue && (
          <input type="hidden" name={`${name}_removed`} value="true" />
        )}
        {defaultValue && (
          <input type="hidden" name={`${name}_existing`} value={defaultValue} />
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs font-mono-tech">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {preview && !selectedFileMeta && defaultValue && (
        <p className="text-[11px] text-white/40 font-mono-tech truncate">
          Current: {defaultValue}
        </p>
      )}
    </div>
  );
}
