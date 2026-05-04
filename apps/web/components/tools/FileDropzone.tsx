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
          ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400"
          : isDragging
            ? "cursor-pointer border-red-500 bg-red-50"
            : "cursor-pointer border-zinc-300 bg-white hover:border-red-400 hover:bg-red-50"
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
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-red-600 text-white">
        <UploadCloud aria-hidden="true" size={30} />
      </div>
      <p className="text-lg font-bold text-navy">Choose a PDF or drag it here</p>
      <p className="mt-2 text-sm text-navy/55">
        PDF only, up to {maxSizeMB}MB
      </p>
      {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
    </label>
  );
}
