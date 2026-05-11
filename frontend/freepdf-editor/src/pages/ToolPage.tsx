
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tools } from '../lib/tools'
import { useUpload } from '../hooks/useUpload'
import { setMetadata } from '../lib/metadata'
import { ToolHeader } from '../components/tools/ToolHeader'
import { FileDropzone } from '../components/tools/FileDropzone'
import { ToolOptions } from '../components/tools/ToolOptions'
import { ProgressBar } from '../components/tools/ProgressBar'
import { DownloadButton } from '../components/tools/DownloadButton'
import { SummaryResult } from '../components/tools/SummaryResult'
import { ErrorCard } from '../components/tools/ErrorCard'
import { RelatedTools } from '../components/tools/RelatedTools'
import { ArrowLeft, Play } from 'lucide-react'

export const ToolPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const tool = tools.find(t => t.slug === slug)
  
  const { 
    status, progress, downloadUrl, error, summary, files,
    setFiles, startUpload, reset 
  } = useUpload()

  const [options, setOptions] = useState<any>({})

  // Reset upload state when changing tools
  useEffect(() => {
    reset()
    if (tool) {
      setMetadata(
        `${tool.name} — Free Online PDF Tool`,
        `${tool.description}. No installation required. Files deleted after 1 hour.`
      )
    }
  }, [slug, reset, tool])

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-navy mb-4">Tool Not Found</h1>
        <Link to="/" className="text-emerald-700 font-bold hover:underline">Go back home</Link>
      </div>
    )
  }

  const handleStart = () => {
    if (files.length > 0) {
      startUpload(files, tool.slug, options)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 md:py-16">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        <ToolHeader 
          title={tool.name} 
          description={tool.description} 
          icon={tool.icon} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200">
              {status === 'idle' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <FileDropzone 
                    accept={tool.acceptedFiles.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {})}
                    multiple={tool.multiple}
                    onFilesSelected={setFiles}
                  />
                  
                  {files.length > 0 && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                      <ToolOptions slug={tool.slug} onChange={setOptions} />
                      
                      <button 
                        onClick={handleStart}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold py-4 px-8 shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                      >
                        <span>Process {tool.name} with AI</span>
                        <Play className="h-5 w-5 fill-current" />
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {(status === 'uploading' || status === 'processing') && (
                <ProgressBar progress={progress} status={status} />
              )}
              
              {status === 'completed' && tool.slug === 'ai-summarizer' && (
                <div className="space-y-8">
                  <SummaryResult summary={summary || ''} />
                  <div className="flex justify-center">
                    <button 
                      onClick={reset}
                      className="text-slate-400 font-bold hover:text-slate-600 flex items-center gap-2 transition-colors text-sm"
                    >
                      <ArrowLeft size={16} />
                      Process another file
                    </button>
                  </div>
                </div>
              )}
              
              {status === 'completed' && tool.slug !== 'ai-summarizer' && (
                <DownloadButton 
                  downloadUrl={downloadUrl || ''} 
                  filename={`savepdf-${tool.slug}.pdf`} 
                />
              )}
              
              {status === 'failed' && (
                <ErrorCard error={error} onRetry={reset} />
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                  <Play size={14} className="fill-current" />
                </div>
                <span className="font-bold text-slate-800 text-sm">How it works</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Our AI models will read your document, identify key themes, and provide a high-quality result. This tool is optimized for the best balance of speed and precision.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AI Engine</span>
                <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono font-bold">Fast-Stream 2.0</span>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 text-white overflow-hidden relative group">
              <div className="relative z-10">
                <span className="text-[10px] bg-emerald-700 px-2.5 py-1 rounded-full mb-3 inline-block font-black tracking-widest leading-none">PRO FEATURE</span>
                <h4 className="text-xl font-bold mb-1">Unlock Unlimited Power</h4>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed font-medium">Summarize documents up to 500MB and unlimited pages with Pro.</p>
                <Link to="/pricing" className="block w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-bold text-center hover:bg-slate-100 transition-colors">Upgrade to Pro</Link>
              </div>
              {/* Decorative circles */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-700 opacity-20 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-700 opacity-10 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
            </div>
          </div>
        </div>
        
        <RelatedTools currentSlug={tool.slug} category={tool.category} />
      </div>
    </main>
  )
}
