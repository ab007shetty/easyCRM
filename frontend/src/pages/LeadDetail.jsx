import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import LeadCard from '../components/LeadCard'
import {
  ArrowLeft, Mail, Phone, Building2, Clock, Tag,
  Edit3, Trash2, Save, X, AlertCircle, Users, FileText
} from 'lucide-react'

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-blue-500' },
  { value: 'contacted', label: 'Contacted', color: 'bg-amber-500' },
  { value: 'qualified', label: 'Qualified', color: 'bg-purple-500' },
  { value: 'converted', label: 'Converted', color: 'bg-emerald-500' },
  { value: 'lost', label: 'Lost', color: 'bg-rose-500' },
]

export default function LeadDetail() {
  const { leadId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [lead, setLead] = useState(null)
  const [subLeads, setSubLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user && leadId) fetchLead()
  }, [user, leadId])

  async function fetchLead() {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()

      if (error) throw error
      setLead(data)
      setEditData(data)

      // Fetch sub-leads
      let loadedSubLeads = []

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
        const res = await fetch(`${apiUrl}/api/leads/sub-leads?lead_id=${leadId}`)
        if (res.ok) {
          const json = await res.json()
          loadedSubLeads = json.subLeads || []
        } else {
          throw new Error('API request failed')
        }
      } catch {
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_sub_leads', { p_lead_id: leadId })
        if (!rpcError && rpcData) {
          loadedSubLeads = rpcData
        } else {
          const { data: children } = await supabase
            .from('leads')
            .select('*')
            .eq('parent_lead_id', leadId)
            .order('created_at', { ascending: false })
          loadedSubLeads = children || []
        }
      }

      setSubLeads(loadedSubLeads)
    } catch (error) {
      console.error('Error fetching lead:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          full_name: editData.full_name,
          email: editData.email,
          phone: editData.phone,
          company: editData.company,
          notes: editData.notes,
          status: editData.status,
        })
        .eq('id', leadId)

      if (error) throw error
      setLead({ ...lead, ...editData })
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this lead? This cannot be undone.')) return
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId)

      if (error) throw error
      navigate('/leads')
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
  }

  async function handleStatusChange(newStatus) {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId)

      if (error) throw error
      setLead({ ...lead, status: newStatus })
      setEditData({ ...editData, status: newStatus })
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Lead not found</p>
        <button
          onClick={() => navigate('/leads')}
          className="mt-3 text-emerald-600 font-medium text-sm hover:text-emerald-700"
        >
          ← Back to Leads
        </button>
      </div>
    )
  }

  const createdDate = new Date(lead.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate('/leads')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Leads
      </button>

      {/* Lead Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xl font-bold">
              {lead.full_name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              {editing ? (
                <input
                  type="text"
                  value={editData.full_name}
                  onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                  className="text-xl font-bold text-slate-800 border-b-2 border-emerald-500 focus:outline-none bg-transparent"
                />
              ) : (
                <h1 className="text-xl font-bold text-slate-800">{lead.full_name}</h1>
              )}
              <p className="text-sm text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                Added {createdDate}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => { setEditing(false); setEditData(lead) }}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 disabled:opacity-60 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-sm text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Status */}
        <div className="mb-6">
          <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">Status</label>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  lead.status === opt.value
                    ? `${opt.color} text-white shadow-sm`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${lead.status === opt.value ? 'bg-white' : opt.color}`} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Email</label>
              {editing ? (
                <input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <p className="text-sm text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {lead.email || '—'}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Phone</label>
              {editing ? (
                <input
                  type="tel"
                  value={editData.phone || ''}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <p className="text-sm text-slate-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {lead.phone || '—'}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Company</label>
              {editing ? (
                <input
                  type="text"
                  value={editData.company || ''}
                  onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <p className="text-sm text-slate-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {lead.company || '—'}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Source</label>
              <p className="text-sm text-slate-700 flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                <span className="capitalize">{lead.source?.replace('_', ' ') || '—'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">Notes</label>
          {editing ? (
            <textarea
              value={editData.notes || ''}
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 resize-none"
            />
          ) : (
            <p className="text-sm text-slate-700 flex items-start gap-2">
              <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              {lead.notes || 'No notes added'}
            </p>
          )}
        </div>
      </div>

      {/* Sub-Leads */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-slate-800">Sub-Leads ({subLeads.length})</h3>
        </div>
        {subLeads.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No sub-leads under this lead</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subLeads.map(sub => (
              <LeadCard key={sub.id} lead={sub} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
