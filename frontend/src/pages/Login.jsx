import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, Zap, AlertCircle, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react'

export default function Login() {
  const { signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmail(email, password)
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch font-sans antialiased text-slate-900 relative">
      
      {/* Central Switch Button (Floating on Desktop divider) */}
      <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
        <button
          type="button"
          onClick={() => navigate('/signup')}
          title="Switch to Sign Up"
          className="w-12 h-12 bg-white hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded-full flex items-center justify-center cursor-pointer shadow-lg shadow-slate-200/80 hover:scale-105 active:scale-95 transition-all group"
        >
          <RefreshCw className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180" />
        </button>
      </div>

      {/* Left Column: Sign-In Form */}
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
          <div className="flex md:hidden items-center gap-2 text-sm text-slate-600">
            <span>New here?</span>
            <Link to="/signup" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
              Sign Up
            </Link>
          </div>
        </header>

        {/* Form Container */}
        <div className="my-auto max-w-md w-full mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Welcome back! Please sign in to manage your lead network.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-sm text-rose-700 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
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

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-base mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Desktop quick navigation hint */}
          <p className="hidden md:block text-center text-xs text-slate-400 mt-8">
            Click the center floating button to switch to <strong className="text-slate-600 font-semibold">Sign Up</strong>.
          </p>

          {/* Mobile navigation toggle */}
          <div className="flex md:hidden flex-col items-center gap-2 text-center text-sm text-slate-500 mt-8 border-t border-slate-100 pt-6">
            <span>Don&apos;t have an account?</span>
            <Link to="/signup" className="w-full py-2.5 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all">
              Create an Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} easyCRM. Simple & intuitive lead management.
        </footer>
      </div>

      {/* Right Column: Professional Green marketing panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-800 to-emerald-950 p-12 lg:p-24 flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        {/* Brand Label */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/logo.png" alt="easyCRM Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <span className="text-sm font-bold tracking-wider uppercase text-emerald-300">
            Professional Sales Suite
          </span>
        </div>

        {/* Value Proposition */}
        <div className="my-auto max-w-md">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-6">
            Grow and Track Your Network Seamlessly
          </h2>
          <p className="text-emerald-100/80 mb-8 text-base leading-relaxed">
            easyCRM provides multi-level referral hierarchy tools and real-time capture forms to make managing business networks intuitive and simple.
          </p>

          {/* Features Checklist */}
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-emerald-50 text-sm font-semibold">Multi-level referral chain visualization</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-emerald-50 text-sm font-semibold">Instant lead collection via unique QR Codes</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-emerald-50 text-sm font-semibold">Detailed interaction logs and status trackers</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-emerald-50 text-sm font-semibold">Fast, secure and password-protected portal</span>
            </li>
          </ul>
        </div>

        {/* Subtitle/Quote */}
        <div className="border-t border-emerald-700/50 pt-8 flex flex-col gap-2">
          <p className="text-xs text-emerald-200/60 font-semibold uppercase tracking-wider">
            Trust & Security Guaranteed
          </p>
          <p className="text-xs text-emerald-100/70">
            Powered by Supabase secure PostgreSQL storage and standard cryptography.
          </p>
        </div>
      </div>
    </div>
  )
}
