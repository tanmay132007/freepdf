
import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { tools, iconMap } from '../../lib/tools'

interface RelatedToolsProps {
  currentSlug: string
  category: string
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ currentSlug, category }) => {
  const related = tools
    .filter(t => t.category === category && t.slug !== currentSlug)
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <div className="pt-20 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-navy">You might also like</h3>
        <Link to="/tools" className="text-sm font-bold text-emerald-700 hover:underline flex items-center gap-1">
          View all tools <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map((tool) => {
          const Icon = iconMap[tool.icon]
          return (
            <Link 
              key={tool.slug} 
              to={`/tools/${tool.slug}`}
              className="group p-6 bg-white rounded-2xl border border-navy/5 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all"
            >
              <div className="h-12 w-12 flex items-center justify-center bg-emerald-50 rounded-xl text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all mb-4">
                <Icon size={24} />
              </div>
              <h4 className="font-bold text-navy mb-1">{tool.name}</h4>
              <p className="text-xs text-navy/40 line-clamp-2">{tool.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
