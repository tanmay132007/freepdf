
'use client'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudUpload, X, CheckCircle, AlertCircle } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface FileDropzoneProps {
  accept?: Record<string, string[]>
  maxSizeMB?: number
  multiple?: boolean
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  accept,
  maxSizeMB = 25,
  multiple = false,
  onFilesSelected,
  disabled = false
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      const firstError = fileRejections[0].errors[0]
      if (firstError.code === 'file-too-large') {
        setError(`File too large. Max size is ${maxSizeMB}MB`)
      } else {
        setError(firstError.message)
      }
      return
    }

    setError(null)
    const validFiles = acceptedFiles.filter(file => file.size <= maxSizeMB * 1024 * 1024)
    
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles)
      onFilesSelected(validFiles)
    }
  }, [maxSizeMB, onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop as any,
    accept: accept as any,
    multiple,
    maxSize: maxSizeMB * 1024 * 1024,
    disabled
  } as any)

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)
    onFilesSelected(newFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0)

  return (
    <div className="w-full space-y-4">
      {selectedFiles.length === 0 ? (
        <div
          {...getRootProps()}
          className={cn(
            "relative group cursor-pointer transition-all duration-300 rounded-[2rem] border-2 border-dashed p-12 text-center",
            isDragActive 
              ? "border-emerald-700 bg-emerald-50/50" 
              : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30",
            error && "border-emerald-600 bg-emerald-50"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={cn(
              "w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center transition-colors duration-200",
              isDragActive ? "bg-emerald-100" : "group-hover:bg-emerald-100"
            )}>
              <CloudUpload 
                className={cn(
                  "h-10 w-10 transition-colors duration-200",
                  isDragActive ? "text-emerald-700" : "text-slate-300 group-hover:text-emerald-600"
                )} 
              />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-slate-700">
                {isDragActive ? 'Drop it!' : 'Drop your PDF here or click to browse'}
              </p>
              <p className="text-sm text-slate-400 font-medium">
                Max file size: {maxSizeMB}MB • Files deleted after 1 hour
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 truncate max-w-[200px]">
                  {file.name}
                </span>
                <span className="text-xs text-green-600">({formatFileSize(file.size)})</span>
                <button
                  onClick={() => removeFile(idx)}
                  className="p-1 hover:bg-green-100 rounded-full text-emerald-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          {multiple && selectedFiles.length > 1 && (
            <p className="text-sm text-navy/60">
               Total size: {formatFileSize(totalSize)}
            </p>
          )}

          <button
            onClick={() => {
              setSelectedFiles([])
              onFilesSelected([])
            }}
            className="text-sm text-primary font-medium hover:underline"
          >
            Change file
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-sm font-bold bg-white px-3 py-1 rounded-lg shadow-sm border border-emerald-100"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
