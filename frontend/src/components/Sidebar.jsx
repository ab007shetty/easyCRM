import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard,
  Users,
  Network,
  UserCircle,
  Settings,
  LogOut,
  X,
  Zap,
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/leads', label: 'Leads', icon: Users },
  { path: '/network', label: 'Network', icon: Network },
  { path: '/profile', label: 'Profile', icon: UserCircle },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ isOpen, onClose }) {
  const { signOut, profile } = useAuth()
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">easyCRM</h1>
              <p className="text-[10px] text-slate-400 -mt-0.5 font-medium uppercase tracking-wider">Lead Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path))

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-xs font-bold">
              {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {profile?.email}
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
