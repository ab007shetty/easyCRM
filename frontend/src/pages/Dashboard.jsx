import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import StatsCard from '../components/StatsCard'
import LeadCard from '../components/LeadCard'
import {
  Users, UserPlus, Network, TrendingUp, QrCode,
  ArrowRight, Plus, Share2
} from 'lucide-react'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  async function fetchDashboardData() {
    try {
      // Fetch stats
      const { data: statsData } = await supabase.rpc('get_lead_stats', {
        p_owner_id: user.id,
      })
      setStats(statsData)

      // Fetch recent leads
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentLeads(leads || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-emerald-100 mb-4">
            Here&apos;s what&apos;s happening with your lead network today.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              View QR Code
            </button>
            <button
              onClick={() => navigate('/leads')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Users}
          label="Total Leads"
          value={stats?.total_leads || 0}
          color="emerald"
        />
        <StatsCard
          icon={UserPlus}
          label="This Week"
          value={stats?.leads_this_week || 0}
          color="blue"
        />
        <StatsCard
          icon={TrendingUp}
          label="Converted"
          value={stats?.converted_leads || 0}
          color="purple"
        />
        <StatsCard
          icon={Network}
          label="Network Depth"
          value={stats?.max_depth || 0}
          color="amber"
        />
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Pipeline */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Lead Pipeline</h3>
          <div className="space-y-3">
            {[
              { label: 'New', value: stats?.new_leads || 0, color: 'bg-blue-500', bg: 'bg-blue-50' },
              { label: 'Contacted', value: stats?.contacted_leads || 0, color: 'bg-amber-500', bg: 'bg-amber-50' },
              { label: 'Qualified', value: stats?.qualified_leads || 0, color: 'bg-purple-500', bg: 'bg-purple-50' },
              { label: 'Converted', value: stats?.converted_leads || 0, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
              { label: 'Lost', value: stats?.lost_leads || 0, color: 'bg-rose-500', bg: 'bg-rose-50' },
            ].map((item) => {
              const total = stats?.total_leads || 1
              const pct = Math.round((item.value / total) * 100) || 0
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-20 font-medium">{item.label}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 font-bold w-6 text-right">{item.value}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Recent Leads</h3>
            <button
              onClick={() => navigate('/leads')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentLeads.length === 0 ? (
            <div className="text-center py-8">
              <Share2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm font-medium">No leads yet</p>
              <p className="text-slate-400 text-xs mt-1">Share your QR code to start capturing leads</p>
              <button
                onClick={() => navigate('/profile')}
                className="mt-3 text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
              >
                Get your QR code →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
