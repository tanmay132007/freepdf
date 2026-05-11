"use client";

import { useCallback, useMemo, useState } from "react";
import { UploadCloud } from "lucide-react";

type FileDropzoneProps = {
  accept: string[];
  maxSizeMB: number;
  multiple: boolean;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
};

export function FileDropzone({
  accept,
  maxSizeMB,
  multiple,
  onFilesSelected,
  disabled = false
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const acceptValue = useMemo(() => accept.join(","), [accept]);
  const fileLabel = accept.some((value) => value.startsWith("image/"))
    ? "images"
    : accept.some((value) => value.startsWith("."))
      ? "files"
      : "PDF";

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || disabled) {
        return;
      }

      const selectedFiles = Array.from(fileList);
      const files = multiple ? selectedFiles : selectedFiles.slice(0, 1);
      const maxBytes = maxSizeMB * 1024 * 1024;
      const oversizedFile = files.find((file) => file.size > maxBytes);

      if (oversizedFile) {
        setError(`Files must be ${maxSizeMB}MB or smaller.`);
        return;
      }

      setError("");
      onFilesSelected(files);
    },
    [disabled, maxSizeMB, multiple, onFilesSelected]
  );

  return (
    <label
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={`block rounded-lg border-2 border-dashed p-10 transition ${
        disabled
          ? "cursor-not-allowed border-zinc-200 bg-parchment text-zinc-400"
          : isDragging
            ? "cursor-pointer border-emerald bg-emerald/10"
            : "cursor-pointer border-gold/30 bg-white hover:border-emerald hover:bg-emerald/10"
      }`}
    >
      <input
        type="file"
        accept={acceptValue}
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => handleFiles(event.target.files)}
        className="sr-only"
      />
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald text-white">
        <UploadCloud aria-hidden="true" size={30} />
      </div>
      <p className="text-lg font-bold text-navy">Choose {fileLabel} or drag here</p>
      <p className="mt-2 text-sm text-navy/55">
        Up to {maxSizeMB}MB per file
      </p>
      {error ? <p className="mt-4 text-sm font-semibold text-rose-700">{error}</p> : null}
    </label>
  );
}
