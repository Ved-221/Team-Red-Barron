"use client";

import { useState, useRef, useId, useEffect } from "react";
import Image from "next/image";
import { Upload, X, RefreshCw, Link as LinkIcon, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface ImageUploadFieldProps {
  name: string;
  defaultValue?: string | null;
  label?: string;
  className?: string;
}

export function ImageUploadField({
  name,
  defaultValue,
  label = "Upload Image",
  className = "",
}: ImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [selectedFileMeta, setSelectedFileMeta] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [directUrl, setDirectUrl] = useState(defaultValue || "");

  // Sync if defaultValue changes (e.g. navigated to another record)
  useEffect(() => {
    setPreview(defaultValue || null);
    setDirectUrl(defaultValue || "");
    setIsRemoved(false);
    setSelectedFileMeta(null);
  }, [defaultValue]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setSelectedFileMeta({
        name: file.name,
        size: formatFileSize(file.size),
      });
      setIsRemoved(false);
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
    if (url.trim()) {
      setPreview(url.trim());
      setIsRemoved(false);
      setSelectedFileMeta(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } else {
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
              PNG, JPG, WEBP, AVIF (up to 50MB)
            </span>
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

      {preview && !selectedFileMeta && defaultValue && (
        <p className="text-[11px] text-white/40 font-mono-tech truncate">
          Current: {defaultValue}
        </p>
      )}
    </div>
  );
}
