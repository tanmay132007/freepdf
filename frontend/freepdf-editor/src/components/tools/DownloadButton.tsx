
'use client'
import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Download, RefreshCw, Check } from 'lucide-react'
import { useUpload } from '../../hooks/useUpload'

interface DownloadButtonProps {
  downloadUrl: string
  filename: string
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ downloadUrl, filename }) => {
  const { reset } = useUpload()

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF0000', '#000000', '#FFFFFF']
    })

    // Auto trigger download
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [downloadUrl, filename])

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-slate-800">Success!</h3>
        <p className="text-slate-500 font-medium">Your processed file is ready for download.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <a
          href={downloadUrl}
          download={filename}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-emerald-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download className="h-5 w-5" />
          Download PDF
        </a>
        
        <button
          onClick={reset}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-4 px-8 rounded-2xl transition-all border border-slate-200"
        >
          <RefreshCw className="h-5 w-5" />
          Another
        </button>
      </div>

      <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
        <Check className="h-4 w-4" />
        <span>File will be deleted in 1 hour</span>
      </div>
    </div>
  )
}
