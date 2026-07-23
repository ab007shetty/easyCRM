import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Lock, Eye, EyeOff, Zap, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })
      if (error) throw error

      setSuccessMsg('Your password has been reset successfully! Redirecting you...')
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to reset password. Link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch font-sans antialiased text-slate-900 relative">
      
      {/* Left Column: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-24 bg-white z-10">
        
        {/* Header/Logo */}
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              easyCRM
            </span>
          </Link>
        </header>

        {/* Form Container */}
        <div className="my-auto max-w-md w-full mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create New Password
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Enter and confirm your new secure account password.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-sm text-rose-700 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-sm text-emerald-700 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">{successMsg}</div>
            </div>
          )}

          <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-base mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} easyCRM. Simple & intuitive lead management.
        </footer>
      </div>

      {/* Right Column: Professional Green marketing panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-800 to-emerald-950 p-12 lg:p-24 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-500/25 backdrop-blur-md rounded-lg flex items-center justify-center border border-emerald-500/30">
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wider uppercase text-emerald-300">
            Security & Support
          </span>
        </div>

        <div className="my-auto max-w-md">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-6">
            Keep Your Account Safe & Secure
          </h2>
          <p className="text-emerald-100/80 mb-8 text-base leading-relaxed">
            Choose a strong, unique password consisting of at least 6 characters. Avoid reusing old passwords to protect your lead data.
          </p>

          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-emerald-50 text-sm font-semibold">Minimum of 6 characters</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-emerald-50 text-sm font-semibold">Use numbers & symbols for security</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-emerald-50 text-sm font-semibold">Never share your credentials</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-emerald-700/50 pt-8 flex flex-col gap-2">
          <p className="text-xs text-emerald-200/60 font-semibold uppercase tracking-wider">
            Protected Platform
          </p>
          <p className="text-xs text-emerald-100/70">
            We store password digests using cryptographically secure hashing functions.
          </p>
        </div>
      </div>
    </div>
  )
}
