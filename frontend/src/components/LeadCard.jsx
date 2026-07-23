import { useNavigate } from 'react-router-dom'
import { Mail, Phone, Building2, ChevronRight, Clock } from 'lucide-react'

const statusConfig = {
  new: { label: 'New', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  contacted: { label: 'Contacted', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  qualified: { label: 'Qualified', bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  converted: { label: 'Converted', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  lost: { label: 'Lost', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
}

export default function LeadCard({ lead, compact = false }) {
  const navigate = useNavigate()
  const status = statusConfig[lead.status] || statusConfig.new

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return `${Math.floor(days / 30)}mo ago`
  }

  if (compact) {
    return (
      <div
        onClick={() => navigate(`/leads/${lead.id}`)}
        className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
      >
        <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-sm font-bold shrink-0">
          {lead.full_name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{lead.full_name}</p>
          <p className="text-xs text-slate-400 truncate">{lead.email || lead.company || 'No details'}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => navigate(`/leads/${lead.id}`)}
      className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-emerald-200 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
            {lead.full_name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
              {lead.full_name}
            </h3>
            {lead.company && (
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3" />
                {lead.company}
              </p>
            )}
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="space-y-1.5">
        {lead.email && (
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            {lead.email}
          </p>
        )}
        {lead.phone && (
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            {lead.phone}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo(lead.created_at)}
        </span>
        {lead.source && (
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium bg-slate-100 px-2 py-0.5 rounded">
            {lead.source.replace('_', ' ')}
          </span>
        )}
      </div>
    </div>
  )
}
