import { useState } from 'react'
import { ChevronDown, ChevronRight, User, Users, Building2, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const statusColors = {
  new: 'bg-blue-500',
  contacted: 'bg-amber-500',
  qualified: 'bg-purple-500',
  converted: 'bg-emerald-500',
  lost: 'bg-rose-500',
}

function TreeNode({ lead, allLeads, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 2)
  const navigate = useNavigate()

  const children = allLeads.filter(l => l.parent_lead_id === lead.id)
  const hasChildren = children.length > 0

  return (
    <div className="animate-fade-in" style={{ animationDelay: `${depth * 50}ms` }}>
      <div
        className={`
          flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer
          hover:bg-emerald-50/50 transition-all duration-200 group
          ${depth === 0 ? 'bg-white shadow-sm border border-slate-200 mb-2' : ''}
        `}
      >
        {/* Expand/Collapse */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(!expanded)
          }}
          className={`p-0.5 rounded transition-colors shrink-0 ${
            hasChildren ? 'hover:bg-emerald-100 text-slate-500' : 'text-transparent cursor-default'
          }`}
          disabled={!hasChildren}
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Avatar */}
        <div
          onClick={() => navigate(`/leads/${lead.id}`)}
          className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold shrink-0"
        >
          {lead.full_name?.charAt(0)?.toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0" onClick={() => navigate(`/leads/${lead.id}`)}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
              {lead.full_name}
            </span>
            <span className={`w-2 h-2 rounded-full shrink-0 ${statusColors[lead.status] || statusColors.new}`} />
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            {lead.company && (
              <span className="flex items-center gap-0.5">
                <Building2 className="w-3 h-3" /> {lead.company}
              </span>
            )}
            {lead.email && (
              <span className="flex items-center gap-0.5">
                <Mail className="w-3 h-3" /> {lead.email}
              </span>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 shrink-0">
          {hasChildren && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
              <Users className="w-3 h-3" />
              {children.length}
            </span>
          )}
          <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded font-medium">
            Gen {lead.generation || depth + 1}
          </span>
        </div>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="ml-6 pl-4 border-l-2 border-emerald-200/50 space-y-0.5">
          {children.map(child => (
            <TreeNode
              key={child.id}
              lead={child}
              allLeads={allLeads}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function NetworkTree({ leads }) {
  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">No leads in your network yet</p>
        <p className="text-sm text-slate-400 mt-1">Share your QR code to start building your network</p>
      </div>
    )
  }

  const rootLeads = leads.filter(l => !l.parent_lead_id)

  return (
    <div className="space-y-1">
      {rootLeads.map(lead => (
        <TreeNode
          key={lead.id}
          lead={lead}
          allLeads={leads}
          depth={0}
        />
      ))}
    </div>
  )
}
