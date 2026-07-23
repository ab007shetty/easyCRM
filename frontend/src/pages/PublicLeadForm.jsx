import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  User, Mail, Phone, Building2, Zap,
  CheckCircle, AlertCircle, Loader2
} from 'lucide-react'

export default function PublicLeadForm() {
  const { referralCode } = useParams()
  const [owner, setOwner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', company: '',
  })

  useEffect(() => {
    if (referralCode) fetchOwner()
  }, [referralCode])

  async function fetchOwner() {
    try {
      const { data, error } = await supabase.rpc('get_owner_by_referral', {
        p_referral_code: referralCode,
      })

      if (error) throw error
      if (!data || data.length === 0) {
        setNotFound(true)
      } else {
        setOwner(data[0])
      }
    } catch (error) {
      console.error('Error fetching owner:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      // Use the public API endpoint to add the lead
      const backendUrl = import.meta.env.VITE_BACKEND_URL || ''
      const response = await fetch(`${backendUrl}/api/leads/public-add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referral_code: referralCode,
          full_name: formData.full_name,
          email: formData.email || null,
          phone: formData.phone || null,
          company: formData.company || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit')
      }

      setSuccess(true)
    } catch (err) {
      // Fallback: direct insert if backend not available
      try {
        // Look up owner by referral code
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', referralCode)
          .single()

        if (!profiles) throw new Error('Invalid referral code')

        const { error: insertError } = await supabase.from('leads').insert({
          owner_id: profiles.id,
          full_name: formData.full_name,
          email: formData.email || null,
          phone: formData.phone || null,
          company: formData.company || null,
          source: 'qr_scan',
          status: 'new',
          generation: 1,
        })

        if (insertError) throw insertError
        setSuccess(true)
      } catch (fallbackErr) {
        setError(fallbackErr.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Invalid Link</h2>
          <p className="text-slate-500 text-sm">
            This referral link is not valid or has expired. Please check the link and try again.
          </p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-sm animate-scale-in">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">You&apos;re in! 🎉</h2>
          <p className="text-slate-500">
            Thank you, <strong className="text-slate-700">{formData.full_name}</strong>!
            Your information has been submitted successfully.
            {owner?.full_name && (
              <> {owner.company_name || owner.full_name} will be in touch soon.</>
            )}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600">
            <div className="w-4 h-4 flex items-center justify-center">
              <img src="/logo.png" alt="easyCRM Logo" className="w-full h-full object-contain filter grayscale" />
            </div>
            <span className="text-sm font-medium">Powered by easyCRM</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <img src="/logo.png" alt="easyCRM Logo" className="w-full h-full object-contain" />
          </div>
          {owner?.company_name ? (
            <>
              <h1 className="text-2xl font-bold text-slate-800">{owner.company_name}</h1>
              <p className="text-slate-500 mt-1">Connect with {owner.full_name}</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-slate-800">
                Connect with {owner?.full_name || 'us'}
              </h1>
              <p className="text-slate-500 mt-1">Fill in your details to get started</p>
            </>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-sm text-rose-700 animate-scale-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your full name"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Company <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400 mt-4">
            By submitting, you agree to share your contact information with {owner?.company_name || owner?.full_name || 'the referrer'}.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-1.5 text-slate-400">
            <div className="w-3.5 h-3.5 flex items-center justify-center">
              <img src="/logo.png" alt="easyCRM Logo" className="w-full h-full object-contain filter grayscale opacity-60" />
            </div>
            <span className="text-xs font-medium">Powered by easyCRM</span>
          </div>
        </div>
      </div>
    </div>
  )
}
