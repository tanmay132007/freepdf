
import React from 'react'
import { Copy, Sparkles, Check } from 'lucide-react'

interface SummaryResultProps {
  summary: string
}

export const SummaryResult: React.FC<SummaryResultProps> = ({ summary }) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Split summary by bullet points if they exist
  const parts = summary.split('\n').filter(p => p.trim() !== '')

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-bold">AI Summary Results</h3>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        
        <div className="p-8 space-y-6 bg-slate-50/50">
          <div className="prose prose-slate max-w-none">
            <ul className="space-y-4">
              {parts.map((part, idx) => (
                <li key={idx} className="flex gap-4 group">
                  <div className="h-6 w-6 shrink-0 rounded-full bg-white border border-slate-200 text-emerald-700 flex items-center justify-center text-[10px] font-black shadow-sm mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-900 transition-colors font-medium">
                    {part.replace(/^[•\-\d.\s]*/, '')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
