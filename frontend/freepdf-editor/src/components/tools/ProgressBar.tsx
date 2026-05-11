
import React from 'react'
import { UploadStatus } from '../../hooks/useUpload'

interface ProgressBarProps {
  progress: number
  status: UploadStatus
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status }) => {
  const getStatusText = () => {
    switch (status) {
      case 'uploading': return '⬆️ Uploading your file...'
      case 'processing': return '⚙️ Processing your PDF...'
      case 'completed': return '✅ Done! Your file is ready.'
      case 'failed': return '❌ Something went wrong.'
      default: return ''
    }
  }

  const isProcessing = status === 'uploading' || status === 'processing'

  return (
    <div className="w-full space-y-3 py-6">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-800">{getStatusText()}</span>
        <span className="text-slate-400">{progress}%</span>
      </div>
      
      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
        <div 
          className={`h-full transition-all duration-700 rounded-full shadow-lg ${
            status === 'completed' ? 'bg-green-500 shadow-green-200' : 'bg-emerald-700 shadow-emerald-200'
          }`}
          style={{ width: `${progress}%` }}
        />
        {isProcessing && (
          <div 
            className="absolute inset-0 w-full h-full animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              backgroundSize: '200% 100%'
            }}
          />
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }
      `}} />
    </div>
  )
}
