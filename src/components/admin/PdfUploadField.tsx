"use client";

import { useState, useRef, useId } from "react";
import { FileText, X, CheckCircle2, AlertCircle, Upload, Link as LinkIcon } from "lucide-react";

interface PdfUploadFieldProps {
  name: string;
  defaultValue?: string | null;
  label?: string;
  className?: string;
  maxSizeMb?: number;
}

export function PdfUploadField({
  name,
  defaultValue,
  label = "Upload PDF Document",
  className = "",
  maxSizeMb = 10,
}: PdfUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFileMeta, setSelectedFileMeta] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [directUrl, setDirectUrl] = useState(defaultValue || "");

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Please select a valid PDF file (.pdf)");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setSelectedFileMeta(null);
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setErrorMessage(`File exceeds ${maxSizeMb} MB limit (${sizeMb} MB). Please select a smaller PDF.`);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setSelectedFileMeta(null);
      return;
    }

    setErrorMessage(null);
    setSelectedFileMeta({
      name: file.name,
      size: formatFileSize(file.size),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleClear = () => {
    setSelectedFileMeta(null);
    setErrorMessage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
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
          {showUrlInput ? "Hide Direct URL" : "Or Enter PDF URL"}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10">
          <input
            type="text"
            name={`${name}_direct_url`}
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            placeholder="Paste public PDF URL (e.g. /TRB_BROCHURE.pdf or https://...)"
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white font-mono focus:outline-none placeholder:text-white/30"
          />
          {directUrl && (
            <button
              type="button"
              onClick={() => setDirectUrl("")}
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
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
          isDragging
            ? "border-[#de1615] bg-[#de1615]/10"
            : "border-white/20 bg-[#12151b] hover:border-white/40"
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#de1615]/20 group-hover:text-[#de1615] text-white/50 transition-colors">
            {selectedFileMeta ? (
              <FileText className="w-6 h-6 text-[#de1615]" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          {selectedFileMeta ? (
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-white">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <span className="truncate max-w-[280px]">{selectedFileMeta.name}</span>
                <span className="text-white/40 text-xs font-mono-tech">({selectedFileMeta.size})</span>
              </div>
              <p className="text-xs text-white/50">Click or drag & drop to change file</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="mt-2 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-mono-tech"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove selected file</span>
              </button>
            </div>
          ) : (
            <div>
              <span className="text-sm font-inter text-white/80 hover:text-white font-medium block">
                Click to select or drag & drop PDF brochure
              </span>
              <span className="text-xs text-white/40 mt-1 font-mono-tech uppercase block">
                PDF only (Max {maxSizeMb} MB)
              </span>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          name={name}
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs font-mono-tech">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {defaultValue && !selectedFileMeta && (
        <p className="text-[11px] text-white/40 font-mono-tech truncate">
          Current: {defaultValue}
        </p>
      )}
    </div>
  );
}
