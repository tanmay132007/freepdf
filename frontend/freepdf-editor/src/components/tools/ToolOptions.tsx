
'use client'
import React, { useState, useEffect } from 'react'
import { 
  RotateCw, ZoomIn, Lock, Eye, EyeOff, Layout, ListOrdered, 
  Settings, Type, Languages, Sparkles 
} from 'lucide-react'

interface ToolOptionsProps {
  slug: string
  onChange: (options: any) => void
}

export const ToolOptions: React.FC<ToolOptionsProps> = ({ slug, onChange }) => {
  const [options, setOptions] = useState<any>({})

  const updateOption = (key: string, value: any) => {
    const newOptions = { ...options, [key]: value }
    setOptions(newOptions)
    onChange(newOptions)
  }

  // Initial options based on slug
  useEffect(() => {
    let initial: any = {}
    if (slug === 'compress-pdf') initial = { level: 'medium' }
    if (slug === 'rotate-pdf') initial = { rotation: 90 }
    if (slug === 'watermark-pdf') initial = { text: 'CONFIDENTIAL', opacity: 30, position: 'center' }
    if (slug === 'split-pdf') initial = { mode: 'all' }
    if (slug === 'translate-pdf') initial = { target: 'Spanish' }
    
    setOptions(initial)
    onChange(initial)
  }, [slug])

  if (slug === 'compress-pdf') {
    return (
      <div className="space-y-4 p-6 bg-white rounded-2xl border border-navy/5 shadow-sm">
        <label className="text-sm font-bold text-navy uppercase tracking-wider">Compression Level</label>
        <div className="grid grid-cols-3 gap-3">
          {['low', 'medium', 'high'].map((level) => (
            <button
              key={level}
              onClick={() => updateOption('level', level)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                options.level === level 
                ? 'border-emerald-700 bg-emerald-50 text-emerald-700' 
                : 'border-navy/10 hover:border-navy/20 text-navy/60'
              }`}
            >
              <span className="capitalize font-bold">{level}</span>
              <span className="text-[10px] opacity-70">
                {level === 'low' && 'Best quality'}
                {level === 'medium' && 'Balanced'}
                {level === 'high' && 'Smallest size'}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (slug === 'rotate-pdf') {
    return (
      <div className="space-y-4 p-6 bg-white rounded-2xl border border-navy/5 shadow-sm">
        <label className="text-sm font-bold text-navy uppercase tracking-wider">Rotation Angle</label>
        <div className="grid grid-cols-3 gap-3">
          {[90, 180, 270].map((angle) => (
            <button
              key={angle}
              onClick={() => updateOption('rotation', angle)}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                options.rotation === angle 
                ? 'border-emerald-700 bg-emerald-50 text-emerald-700' 
                : 'border-navy/10 hover:border-navy/20 text-navy/60'
              }`}
            >
              <RotateCw className="h-5 w-5" style={{ transform: `rotate(${angle}deg)` }} />
              <span className="font-bold">{angle}°</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (slug === 'watermark-pdf') {
    return (
      <div className="space-y-6 p-6 bg-white rounded-2xl border border-navy/5 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-bold text-navy uppercase tracking-wider">Watermark Text</label>
          <input
            type="text"
            value={options.text || ''}
            onChange={(e) => updateOption('text', e.target.value)}
            placeholder="CONFIDENTIAL"
            className="w-full p-4 rounded-xl border border-navy/10 focus:border-emerald-600 outline-none transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-navy uppercase tracking-wider">Opacity ({options.opacity}%)</label>
          <input
            type="range"
            min="10"
            max="100"
            step="10"
            value={options.opacity || 30}
            onChange={(e) => updateOption('opacity', parseInt(e.target.value))}
            className="w-full accent-emerald-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-navy uppercase tracking-wider">Position</label>
          <select
            value={options.position || 'center'}
            onChange={(e) => updateOption('position', e.target.value)}
            className="w-full p-4 rounded-xl border border-navy/10 focus:border-emerald-600 outline-none transition-all appearance-none"
          >
            <option value="center">Center</option>
            <option value="top-left">Top-left</option>
            <option value="top-right">Top-right</option>
            <option value="bottom-left">Bottom-left</option>
            <option value="bottom-right">Bottom-right</option>
          </select>
        </div>
      </div>
    )
  }

  if (slug === 'protect-pdf') {
    const [showPass, setShowPass] = useState(false)
    return (
      <div className="space-y-6 p-6 bg-white rounded-2xl border border-navy/5 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-bold text-navy uppercase tracking-wider">Set Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={options.password || ''}
              onChange={(e) => updateOption('password', e.target.value)}
              className="w-full p-4 rounded-xl border border-navy/10 focus:border-emerald-600 outline-none"
            />
            <button 
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
            >
              {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="h-5 w-5 accent-emerald-700 rounded" 
              onChange={(e) => updateOption('allowPrinting', e.target.checked)}
            />
            <span className="text-sm font-medium text-navy/70">Allow printing</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="h-5 w-5 accent-emerald-700 rounded" 
              onChange={(e) => updateOption('allowCopying', e.target.checked)}
            />
            <span className="text-sm font-medium text-navy/70">Allow copying content</span>
          </label>
        </div>
      </div>
    )
  }

  if (slug === 'unlock-pdf') {
    return (
      <div className="space-y-4 p-6 bg-white rounded-2xl border border-navy/5 shadow-sm">
        <label className="text-sm font-bold text-navy uppercase tracking-wider">Enter Password</label>
        <input
          type="password"
          value={options.password || ''}
          onChange={(e) => updateOption('password', e.target.value)}
          className="w-full p-4 rounded-xl border border-navy/10 focus:border-emerald-600 outline-none"
        />
        <p className="text-xs text-navy/40">Enter the current PDF password to remove protection</p>
      </div>
    )
  }

  if (slug === 'split-pdf') {
    return (
      <div className="space-y-6 p-6 bg-white rounded-2xl border border-navy/5 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateOption('mode', 'all')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              options.mode === 'all' 
              ? 'border-emerald-700 bg-emerald-50 text-emerald-700' 
              : 'border-navy/10 text-navy/60'
            }`}
          >
            <Layout className="h-5 w-5" />
            <span className="font-bold">Split every page</span>
          </button>
          <button
            onClick={() => updateOption('mode', 'custom')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              options.mode === 'custom' 
              ? 'border-emerald-700 bg-emerald-50 text-emerald-700' 
              : 'border-navy/10 text-navy/60'
            }`}
          >
            <ListOrdered className="h-5 w-5" />
            <span className="font-bold">Custom ranges</span>
          </button>
        </div>

        {options.mode === 'custom' && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-bold text-navy/60">Page Ranges</label>
            <input
              type="text"
              placeholder="e.g. 1-3, 5, 7-9"
              className="w-full p-4 rounded-xl border border-navy/10 focus:border-emerald-600 outline-none"
              onChange={(e) => updateOption('ranges', e.target.value)}
            />
          </div>
        )}
      </div>
    )
  }

  if (slug === 'translate-pdf') {
    const languages = [
      'Spanish', 'French', 'Hindi', 'Arabic', 'German', 
      'Chinese', 'Japanese', 'Portuguese', 'Russian', 'Italian'
    ]
    return (
      <div className="space-y-4 p-6 bg-white rounded-2xl border border-navy/5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-navy uppercase tracking-wider">
          <Languages className="h-4 w-4 text-emerald-600" />
          Target Language
        </div>
        <select
          value={options.target || 'Spanish'}
          onChange={(e) => updateOption('target', e.target.value)}
          className="w-full p-4 rounded-xl border border-navy/10 focus:border-emerald-600 outline-none appearance-none"
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
    )
  }

  if (slug === 'ai-summarizer') {
    return (
      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4">
        <div className="h-12 w-12 shrink-0 bg-white rounded-xl flex items-center justify-center text-emerald-700 shadow-sm">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-bold text-emerald-950">AI Intelligent Summary</h4>
          <p className="text-sm text-emerald-900/70 leading-relaxed">
            AI will extract and summarize the key points from your PDF using Gemini AI. 
            Perfect for long research papers, legal documents, or complex reports.
          </p>
        </div>
      </div>
    )
  }

  return null
}
