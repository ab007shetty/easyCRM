import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Zap, ArrowRight, QrCode, Users, Smartphone, 
  Sparkles, Menu, X, CheckCircle2, ShieldCheck, TrendingUp
} from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.png" alt="easyCRM Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              easyCRM
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
              Benefits
            </a>
            <div className="h-5 w-px bg-slate-200" />
            <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors">
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all transform active:scale-95"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-fade-in">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-base font-medium text-slate-700 hover:text-emerald-600"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-base font-medium text-slate-700 hover:text-emerald-600"
            >
              How It Works
            </a>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
              <Link 
                to="/login" 
                className="w-full text-center py-3 text-slate-700 font-semibold border border-slate-300 rounded-xl hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="w-full text-center py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-8">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Simple Lead & Referral CRM</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight mb-6">
          Capture leads faster & grow your <span className="text-emerald-600">referral network</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Share your personal QR code, capture leads instantly, and track multi-tier referral connections in real-time. Built for sales reps and business leaders.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 max-w-md mx-auto">
          <button
            onClick={() => navigate('/signup')}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-600/25 transition-all transform active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Start Free Today</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Sign In to App</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-8">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-left hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 text-emerald-600">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Instant QR Lead Capture</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Generate personal QR codes for events, business cards, or online sharing to capture leads in seconds.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-left hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 text-emerald-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Visual Referral Trees</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Trace multi-level referral connections clearly to know exactly who brought each new contact.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-left hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 text-emerald-600">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Mobile-First CRM</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Designed for speed on any mobile browser. Manage contacts, set follow-ups, and convert leads anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">How easyCRM Works</h2>
            <p className="text-slate-600 text-lg">Three simple steps to build your network effortlessly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Get Your Unique QR Code</h3>
              <p className="text-slate-600 text-sm">Sign up in seconds to receive your personalized lead intake QR code and referral link.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Share & Scan Anywhere</h3>
              <p className="text-slate-600 text-sm">Show your QR code to prospects at events or send your link directly via chat or email.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Track & Convert Leads</h3>
              <p className="text-slate-600 text-sm">View incoming leads immediately in your clean dashboard and follow up effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/logo.png" alt="easyCRM Logo" className="w-full h-full object-contain filter grayscale" />
            </div>
            <span className="text-white font-bold text-lg">easyCRM</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
