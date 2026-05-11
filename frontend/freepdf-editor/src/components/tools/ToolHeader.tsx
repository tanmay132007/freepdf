
import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Shield, Clock, Zap } from 'lucide-react'
import { iconMap } from '../../lib/tools'

interface ToolHeaderProps {
  title: string
  description: string
  icon: string
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ title, description, icon }) => {
  const IconComponent = iconMap[icon] || Shield

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <nav className="flex items-center space-x-2 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
        <Link to="/" className="hover:text-emerald-700 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/tools" className="hover:text-emerald-700 transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-emerald-700">{title}</span>
      </nav>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 shadow-sm flex-shrink-0">
          <IconComponent size={32} strokeWidth={2} />
        </div>
        
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl font-bold text-slate-800 leading-tight">
            {title}
          </h1>
          <p className="text-slate-500 max-w-lg leading-relaxed">
            {description}
          </p>
        </div>

        <div className="hidden md:flex space-x-4">
          <div className="flex flex-col items-center opacity-50">
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm"><Shield size={16} className="text-slate-600" /></div>
            <span className="text-[10px] mt-1 uppercase font-bold text-slate-500 tracking-wider">Secure</span>
          </div>
          <div className="flex flex-col items-center opacity-50">
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm"><Zap size={16} className="text-slate-600" /></div>
            <span className="text-[10px] mt-1 uppercase font-bold text-slate-500 tracking-wider">Fast</span>
          </div>
        </div>
      </div>
    </div>
  )
}
