
import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorCardProps {
  error: string | null
  onRetry: () => void
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ error, onRetry }) => {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-6 animate-in shake duration-500">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-700">
        <AlertCircle size={32} />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-800">Processing Failed</h3>
        <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed text-sm">
          {error || "An unexpected error occurred while processing your file. Please try again."}
        </p>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-emerald-200 text-sm"
      >
        <RefreshCw size={16} />
        Try Again
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-in.shake {
          animation: shake 0.5s ease-in-out;
        }
      `}} />
    </div>
  )
}
