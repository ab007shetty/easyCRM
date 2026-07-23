import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Menu, Bell } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/leads': 'Lead Management',
  '/network': 'Network View',
  '/profile': 'Profile',
  '/settings': 'Settings',
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { profile } = useAuth()

  const currentTitle = Object.entries(pageTitles).find(
    ([path]) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path))
  )?.[1] || 'easyCRM'

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{currentTitle}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold ml-1">
              {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
