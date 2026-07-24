import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import QRCodeDisplay from '../components/QRCodeDisplay'
import {
  User, Mail, Phone, Building2, Edit3, Save, X,
  QrCode, AlertCircle, CheckCircle, Share2
} from 'lucide-react'

export default function Profile() {
  const { profile, updateProfile, user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    full_name: profile?.full_name || '',
    company_name: profile?.company_name || '',
    phone: profile?.phone || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      await updateProfile(editData)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-sm text-emerald-700 animate-scale-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Profile Information</h2>
            {editing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(false)
                    setEditData({
                      full_name: profile?.full_name || '',
                      company_name: profile?.company_name || '',
                      phone: profile?.phone || '',
                    })
                    setError('')
                  }}
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
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-sm text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Avatar + Basic info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-2xl font-bold shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                profile?.full_name?.charAt(0)?.toUpperCase() || '?'
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{profile?.full_name || 'User'}</h3>
              <p className="text-sm text-slate-500">{profile?.email}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Member since {new Date(profile?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-1.5">Full Name</label>
              {editing ? (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={editData.full_name}
                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-700 flex items-center gap-2 py-2.5">
                  <User className="w-4 h-4 text-slate-400" />
                  {profile?.full_name || '—'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-1.5">Email</label>
              <p className="text-sm text-slate-700 flex items-center gap-2 py-2.5">
                <Mail className="w-4 h-4 text-slate-400" />
                {profile?.email}
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Cannot change</span>
              </p>
            </div>

            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-1.5">Company</label>
              {editing ? (
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={editData.company_name}
                    onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
                    placeholder="Your company name"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-700 flex items-center gap-2 py-2.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {profile?.company_name || '—'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider font-medium mb-1.5">Phone</label>
              {editing ? (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="Your phone number"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-700 flex items-center gap-2 py-2.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {profile?.phone || '—'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-slate-800">Your QR Code</h3>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Share this QR code to let people add themselves as leads in your network.
          </p>

          {profile?.referral_code ? (
            <QRCodeDisplay referralCode={profile.referral_code} userFullName={profile.full_name} userEmail={profile.email} size={180} />
          ) : (
            <div className="text-center py-8">
              <Share2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">QR code generating...</p>
            </div>
          )}

          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              Your referral code: <code className="text-slate-600 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{profile?.referral_code}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
