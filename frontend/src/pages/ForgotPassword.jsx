import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Mail, Zap, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleResetRequest = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setSuccessMsg('Password reset link has been sent to your email address.')
      setEmail('')
    } catch (err) {
      setError(err.message || 'Failed to send reset link')
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
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.png" alt="easyCRM Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              easyCRM
            </span>
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </header>

        {/* Form Container */}
        <div className="my-auto max-w-md w-full mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Enter your email and we will send you a link to reset your password.
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

          <form onSubmit={handleResetRequest} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  style={{ paddingLeft: '3rem', paddingRight: '1rem' }}
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
                  <span>Sending Link...</span>
                </div>
              ) : (
                <>
                  <span>Send Reset Link</span>
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
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/logo.png" alt="easyCRM Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <span className="text-sm font-bold tracking-wider uppercase text-emerald-300">
            Security & Support
          </span>
        </div>

        <div className="my-auto max-w-md">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-6">
            Recover Your Password Securely
          </h2>
          <p className="text-emerald-100/80 mb-8 text-base leading-relaxed">
            easyCRM integrates with Supabase Authentication to guarantee secure token-based link recovery. Enter your registered email address and follow the link inside the message.
          </p>

          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-emerald-50 text-sm font-semibold">Encrypted email links</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-emerald-50 text-sm font-semibold">One-time token validation</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-emerald-50 text-sm font-semibold">Direct account recovery</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-emerald-700/50 pt-8 flex flex-col gap-2">
          <p className="text-xs text-emerald-200/60 font-semibold uppercase tracking-wider">
            Need help?
          </p>
          <p className="text-xs text-emerald-100/70">
            Contact your company administrator if you have lost access to your corporate email.
          </p>
        </div>
      </div>
    </div>
  )
}
