import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import NetworkTree from '../components/NetworkTree'
import { Network as NetworkIcon, RefreshCw, Users, Layers } from 'lucide-react'

export default function Network() {
  const { user } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (user) fetchLeadTree()
  }, [user])

  async function fetchLeadTree() {
    try {
      const { data, error } = await supabase.rpc('get_lead_tree', {
        p_owner_id: user.id,
      })

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching lead tree:', error)
      // Fallback: fetch flat list
      const { data } = await supabase
        .from('leads')
        .select('*')
        .eq('owner_id', user.id)
        .order('generation', { ascending: true })
        .order('created_at', { ascending: true })

      setLeads(data || [])
    } finally {
      setLoading(false)
    }
  }

  async function handleRefresh() {
    setRefreshing(true)
    await fetchLeadTree()
    setRefreshing(false)
  }

  // Compute stats
  const totalLeads = leads.length
  const generations = [...new Set(leads.map(l => l.generation || 1))]
  const maxGen = Math.max(...generations, 0)
  const directLeads = leads.filter(l => !l.parent_lead_id).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <NetworkIcon className="w-6 h-6 text-emerald-500" />
            Network View
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Visualize your entire lead referral chain
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <Users className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-800">{totalLeads}</p>
          <p className="text-xs text-slate-500">Total in Network</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <Layers className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-800">{maxGen}</p>
          <p className="text-xs text-slate-500">Generations Deep</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <Users className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-800">{directLeads}</p>
          <p className="text-xs text-slate-500">Direct Leads</p>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-wrap items-center gap-4 text-xs">
        <span className="text-slate-500 font-medium">Status:</span>
        {[
          { label: 'New', color: 'bg-blue-500' },
          { label: 'Contacted', color: 'bg-amber-500' },
          { label: 'Qualified', color: 'bg-purple-500' },
          { label: 'Converted', color: 'bg-emerald-500' },
          { label: 'Lost', color: 'bg-rose-500' },
        ].map(s => (
          <span key={s.label} className="flex items-center gap-1.5 text-slate-600">
            <span className={`w-2 h-2 rounded-full ${s.color}`} />
            {s.label}
          </span>
        ))}
      </div>

      {/* Tree */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <NetworkTree leads={leads} />
      </div>
    </div>
  )
}
