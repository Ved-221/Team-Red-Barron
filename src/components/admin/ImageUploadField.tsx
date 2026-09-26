"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface ImageUploadFieldProps {
  name: string;
  defaultValue?: string | null;
  label?: string;
  className?: string;
}

export function ImageUploadField({ name, defaultValue, label = "Upload Image", className = "" }: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-mono-tech text-[#e8bdb6] uppercase tracking-wider">{label}</label>}
      
      <div className="relative border-2 border-dashed border-white/20 rounded-xl overflow-hidden bg-[#12151b] hover:border-[#de1615]/50 transition-colors">
        {preview ? (
          <div className="relative aspect-video w-full bg-black">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full hover:bg-[#de1615] text-white transition-colors border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center py-12 cursor-pointer w-full h-full">
            <Upload className="w-8 h-8 text-white/40 mb-3" />
            <span className="text-sm text-white/60 font-inter">Click to select an image</span>
            <span className="text-xs text-white/40 mt-1 font-mono-tech uppercase">PNG, JPG, WEBP</span>
          </label>
        )}
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {/* Hidden input to track if we removed the existing image but didn't upload a new one */}
        {!preview && defaultValue && (
          <input type="hidden" name={`${name}_removed`} value="true" />
        )}
        {/* Hidden input to track existing URL so we can delete it from storage if it's changed */}
        {defaultValue && (
          <input type="hidden" name={`${name}_existing`} value={defaultValue} />
        )}
      </div>
    </div>
  );
}
