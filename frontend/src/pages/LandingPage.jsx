import { useState, useRef, useLayoutEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles, ArrowRight, QrCode, Network, Smartphone,
  Menu, X, UserPlus, Share2, Rocket, TrendingUp
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance — one calm sequence, nothing bouncy
      gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 } })
        .from('.hero-badge', { y: 16, opacity: 0 })
        .from('.hero-title', { y: 24, opacity: 0 }, '-=0.45')
        .from('.hero-copy', { y: 16, opacity: 0 }, '-=0.45')
        .from('.hero-cta', { y: 16, opacity: 0, stagger: 0.08 }, '-=0.4')
        .from('.hero-avatars', { y: 16, opacity: 0 }, '-=0.35')
        .from('.hero-visual', { x: 32, opacity: 0, duration: 0.9 }, '-=0.55')
        .from('.hero-bar', { scaleY: 0, transformOrigin: 'bottom', stagger: 0.06, duration: 0.6, ease: 'power2.out' }, '-=0.4')

      // Floating stat card — subtle ambient drift, not a bounce
      gsap.to('.stat-float', { y: -8, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' })

      // Scroll-triggered reveals for everything below the fold
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.6,
          delay: parseFloat(el.dataset.delay || '0'),
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
        })
      })

      // Nav underline-free hover lift on the primary CTA
      gsap.utils.toArray('.magnetic-btn').forEach((btn) => {
        const onEnter = () => gsap.to(btn, { y: -2, duration: 0.25, ease: 'power2.out' })
        const onLeave = () => gsap.to(btn, { y: 0, duration: 0.25, ease: 'power2.out' })
        btn.addEventListener('mouseenter', onEnter)
        btn.addEventListener('mouseleave', onLeave)
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <style>{`
        .glass-card { background: rgba(255,255,255,0.75); backdrop-filter: blur(10px); border: 1px solid rgba(226,232,240,0.6); }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="./public/logo.png" alt="logo" className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-sm" />
            <span className="text-lg font-bold tracking-tight text-slate-900">easyCRM</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="hidden md:block px-4 py-2 font-semibold text-sm text-emerald-700 hover:bg-emerald-50 transition-all rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:brightness-95 active:scale-95 transition-all shadow-sm"
            >
              Get Started
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-slate-700">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-slate-700">How It Works</a>
            <a href="#benefits" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-slate-700">Benefits</a>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
              <Link to="/login" className="w-full text-center py-3 text-slate-700 font-semibold border border-slate-300 rounded-lg">Sign In</Link>
              <Link to="/signup" className="w-full text-center py-3 bg-emerald-600 text-white font-bold rounded-lg">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 px-4 md:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="hero-badge inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
                <Sparkles className="w-4 h-4" />
                Simple Lead &amp; Referral CRM
              </span>

              <h1 className="hero-title text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 max-w-xl leading-tight">
                Capture leads faster &amp; grow your <span className="text-emerald-600">referral network</span>
              </h1>

              <p className="hero-copy text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                Share your personal QR code, capture leads instantly, and track multi-tier referral connections in real-time. Built for sales reps and business leaders.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/signup')}
                  className="hero-cta magnetic-btn h-[44px] px-8 bg-emerald-600 text-white font-semibold rounded-lg hover:brightness-95 active:scale-95 transition-all shadow-lg flex items-center justify-center"
                >
                  Start Free Today
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="hero-cta h-[44px] px-8 border border-slate-300 text-slate-800 font-semibold rounded-lg hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center"
                >
                  Sign In to App
                </button>
              </div>

              <div className="hero-avatars mt-8 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['S', 'M', 'J'].map((initial, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-emerald-500 text-white font-bold flex items-center justify-center text-sm"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-bold text-slate-900">500+</span> agents growing weekly
                </p>
              </div>
            </div>

            {/* Right side visual — dashboard mockup (built in CSS, no stock photo) */}
            <div className="hero-visual relative">
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-200/30 blur-[100px] rounded-full" />
              <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xl bg-white p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Dashboard</p>
                    <p className="text-lg font-bold text-slate-900">Leads Overview</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="flex items-end gap-2 h-32 mb-5">
                  {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
                    <div key={i} className="hero-bar flex-1 bg-emerald-500/80 rounded-t-md" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="space-y-3">
                  {['Sarah Jenkins', 'Mike Ross', 'Jessica Pearson'].map((name) => (
                    <div key={name} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                      <div className="w-8 h-8 rounded-full bg-slate-300" />
                      <span className="text-sm font-medium text-slate-700">{name}</span>
                      <span className="ml-auto text-xs font-semibold text-emerald-600">New</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="stat-float absolute -bottom-6 -left-6 hidden md:block p-4 glass-card rounded-xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">New Leads</p>
                    <p className="text-xl font-bold text-slate-900">+124%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24 bg-white border-y border-slate-200 px-4 md:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Designed for High-Performance Growth</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Powerful features that turn every interaction into a potential conversion and referral opportunity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Feature 1 */}
              <div className="md:col-span-8 group bg-slate-50 p-8 rounded-xl border border-slate-200 hover:border-emerald-400 transition-all duration-300 reveal">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Instant QR Lead Capture</h3>
                  <p className="text-slate-600 mb-6 flex-grow">
                    Generate personal QR codes for events, business cards, or online sharing. One scan captures all prospect info directly into your CRM.
                  </p>
                  <div className="h-48 rounded-lg border border-slate-200 bg-white flex items-center justify-center">
                    <div className="grid grid-cols-6 gap-1 p-4">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3.5 h-3.5 rounded-[2px] ${
                            [0, 1, 2, 6, 12, 5, 11, 17, 30, 31, 32, 24, 25, 35, 29, 23, 15, 16, 21, 22].includes(i)
                              ? 'bg-emerald-600'
                              : 'bg-slate-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="md:col-span-4 group bg-slate-50 p-8 rounded-xl border border-slate-200 hover:border-emerald-400 transition-all duration-300 reveal" data-delay="0.1">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Network className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Visual Referral Trees</h3>
                  <p className="text-slate-600 mb-6 flex-grow">
                    Trace multi-level referral connections clearly and reward your network for growth.
                  </p>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col gap-2">
                    <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded shadow-sm border-l-4 border-emerald-600">
                      <div className="w-6 h-6 rounded-full bg-slate-300" />
                      <span className="text-xs font-semibold text-slate-700">Sarah Jenkins</span>
                    </div>
                    <div className="ml-4 border-l border-slate-200 pl-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-slate-300" />
                        <span className="text-xs font-medium text-slate-600">Mike Ross</span>
                      </div>
                      <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-slate-300" />
                        <span className="text-xs font-medium text-slate-600">Jessica Pearson</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="md:col-span-12 group bg-slate-900 text-white p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center reveal" data-delay="0.15">
                <div className="md:w-1/2">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-lg flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Mobile-First CRM</h3>
                  <p className="text-lg text-slate-300 mb-6">
                    Designed for speed on any mobile browser. No app download required for you or your prospects. Manage your network on the go with a native-like experience.
                  </p>
                  <button className="flex items-center gap-1.5 font-semibold text-emerald-400 hover:underline">
                    Learn more about mobile capture <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-48 h-96 border-8 border-slate-700 rounded-[32px] overflow-hidden relative shadow-2xl bg-slate-800">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-700 rounded-b-xl z-10" />
                    <div className="p-4 pt-10 space-y-3">
                      <div className="h-16 rounded-lg bg-emerald-500/20 flex items-end gap-1 p-2">
                        {[30, 55, 40, 70, 50].map((h, i) => (
                          <div key={i} className="flex-1 bg-emerald-400 rounded-sm" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-8 rounded-md bg-slate-700 flex items-center px-2 gap-2">
                          <div className="w-4 h-4 rounded-full bg-emerald-400" />
                          <div className="h-1.5 w-16 bg-slate-500 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl font-bold text-slate-900">3 Simple Steps to Accelerated Sales</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-[2px] bg-slate-200 -z-10" />

              {[
                { icon: UserPlus, num: 1, title: 'Get Your Unique QR Code', desc: 'Sign up in seconds to receive your personalized code linked to your account.' },
                { icon: Share2, num: 2, title: 'Share & Scan Anywhere', desc: 'Show your QR code to prospects at events, meetings, or on your business card.' },
                { icon: Rocket, num: 3, title: 'Track & Convert Leads', desc: 'View incoming leads immediately in your dashboard and start following up.' },
              ].map((step, idx) => (
                <div key={step.num} className="text-center reveal" data-delay={idx * 0.1}>
                  <div className="w-16 h-16 bg-white border-2 border-emerald-600 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold relative">
                    {step.num}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                      <step.icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-24 text-center reveal">
              <div className="bg-emerald-50 p-10 rounded-2xl border border-emerald-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to supercharge your network?</h3>
                <button
                  onClick={() => navigate('/signup')}
                  className="h-[56px] px-8 bg-emerald-600 text-white font-semibold rounded-lg hover:brightness-95 active:scale-95 transition-all shadow-xl text-lg inline-flex items-center gap-2"
                >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="mt-4 text-sm text-slate-600">No credit card required. Cancel anytime.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 bg-white border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xs">e</div>
              <span className="font-bold text-slate-900">easyCRM</span>
            </div>
            <p className="text-sm text-slate-600">
              Empowering high-growth sales teams through seamless digital connections and referral tracking.
            </p>
            <p className="text-sm text-slate-500 mt-2">&copy; {new Date().getFullYear()} easyCRM. All rights reserved.</p>
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="font-semibold text-slate-900 text-sm">Product</h5>
            <nav className="flex flex-col gap-1.5">
              <a className="text-sm text-slate-600 hover:text-emerald-600 hover:underline transition-all" href="#">Documentation</a>
              <a className="text-sm text-slate-600 hover:text-emerald-600 hover:underline transition-all" href="#">Pricing</a>
              <a className="text-sm text-slate-600 hover:text-emerald-600 hover:underline transition-all" href="#">Security</a>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="font-semibold text-slate-900 text-sm">Support</h5>
            <nav className="flex flex-col gap-1.5">
              <a className="text-sm text-slate-600 hover:text-emerald-600 hover:underline transition-all" href="#">Privacy Policy</a>
              <a className="text-sm text-slate-600 hover:text-emerald-600 hover:underline transition-all" href="#">Terms of Service</a>
              <a className="text-sm text-slate-600 hover:text-emerald-600 hover:underline transition-all" href="#">Contact Us</a>
              <a className="text-sm text-slate-600 hover:text-emerald-600 hover:underline transition-all" href="#">Support</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
