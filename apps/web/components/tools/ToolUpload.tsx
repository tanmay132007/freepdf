"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import type { Tool } from "@/lib/tools";

type ToolUploadProps = {
  tool: Tool;
};

export function ToolUpload({ tool }: ToolUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  return (
    <div>
      <FileDropzone
        accept={tool.acceptedFiles}
        maxSizeMB={25}
        multiple={tool.multiple}
        onFilesSelected={setSelectedFiles}
      />
      {selectedFiles.length > 0 ? (
        <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-4 text-left">
          <p className="font-semibold text-red-700">
            {selectedFiles.length} file{selectedFiles.length === 1 ? "" : "s"} ready
            for {tool.name}
          </p>
          <p className="mt-1 text-sm text-red-700/70">
            Processing will connect to the PDF service in the next backend step.
          </p>
        </div>
      ) : null}
    </div>
  );
}
