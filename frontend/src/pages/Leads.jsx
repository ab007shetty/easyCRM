import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import LeadCard from '../components/LeadCard'
import {
  Search, Plus, Filter, X, Users, UserPlus,
  Mail, Phone, Building2, FileText, AlertCircle, CheckCircle
} from 'lucide-react'

export default function Leads() {
  const { user } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', company: '', notes: '',
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState(false)

  useEffect(() => {
    if (user) fetchLeads()
  }, [user])

  async function fetchLeads() {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddLead(e) {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    try {
      const { error } = await supabase.from('leads').insert({
        owner_id: user.id,
        full_name: formData.full_name,
        email: formData.email || null,
        phone: formData.phone || null,
        company: formData.company || null,
        notes: formData.notes || null,
        source: 'manual',
        status: 'new',
        generation: 1,
      })

      if (error) throw error

      setFormSuccess(true)
      setFormData({ full_name: '', email: '', phone: '', company: '', notes: '' })
      fetchLeads()
      setTimeout(() => {
        setFormSuccess(false)
        setShowAddForm(false)
      }, 1500)
    } catch (error) {
      setFormError(error.message)
    } finally {
      setFormLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchQuery ||
      lead.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
    lost: leads.filter(l => l.status === 'lost').length,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Leads</h1>
          <p className="text-sm text-slate-500">{leads.length} total leads in your network</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email, or company..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'new', 'contacted', 'qualified', 'converted', 'lost'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status} ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Lead Grid */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">
            {searchQuery || statusFilter !== 'all' ? 'No leads match your filters' : 'No leads yet'}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Add a lead manually or share your QR code'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLeads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Add New Lead</h3>
              </div>
              <button
                onClick={() => { setShowAddForm(false); setFormError(''); setFormSuccess(false) }}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-sm text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-sm text-emerald-700">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Lead added successfully!
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    placeholder="Lead's full name"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company name"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setFormError('') }}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 disabled:opacity-60 transition-colors"
                >
                  {formLoading ? 'Adding...' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
