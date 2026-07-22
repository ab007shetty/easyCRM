import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import {
  Settings as SettingsIcon, Lock, Shield, Trash2,
  AlertCircle, CheckCircle, Eye, EyeOff
} from 'lucide-react'

export default function Settings() {
  const { user, signOut } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const isOAuthUser = user?.app_metadata?.provider !== 'email'

  async function handlePasswordChange(e) {
    e.preventDefault()
    setPasswordError('')

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setPasswordLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err) {
      setPasswordError(err.message)
    } finally {
      setPasswordLoading(false)
    }
  }

  async function handleDeleteAccount() {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This will permanently delete all your data including leads and network. This cannot be undone.'
    )
    if (!confirmed) return

    const doubleConfirm = confirm(
      'This is your last chance. Type "DELETE" in the next prompt to confirm.'
    )
    if (!doubleConfirm) return

    try {
      // Delete profile data (cascades to leads)
      await supabase.from('profiles').delete().eq('id', user.id)
      await signOut()
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account. Please contact support.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-emerald-500" />
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account settings</p>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-800">Change Password</h3>
        </div>

        {isOAuthUser ? (
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
            <Shield className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-sm text-slate-600 font-medium">Signed in with Google</p>
              <p className="text-xs text-slate-400">Password management is handled by Google. Visit your Google account settings to change your password.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-sm text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Password changed successfully!
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 disabled:opacity-60 transition-colors"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-800">Account Information</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-slate-500">Email</span>
            <span className="text-sm text-slate-800 font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-slate-100">
            <span className="text-sm text-slate-500">Auth Provider</span>
            <span className="text-sm text-slate-800 font-medium capitalize">
              {user?.app_metadata?.provider || 'email'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-t border-slate-100">
            <span className="text-sm text-slate-500">User ID</span>
            <span className="text-xs text-slate-400 font-mono">{user?.id?.slice(0, 12)}...</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-rose-200 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="w-5 h-5 text-rose-500" />
          <h3 className="font-semibold text-rose-700">Danger Zone</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 border border-rose-300 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-50 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}
