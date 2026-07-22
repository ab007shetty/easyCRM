export default function StatsCard({ icon: Icon, label, value, trend, color = 'emerald' }) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-100',
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      border: 'border-amber-100',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      border: 'border-purple-100',
    },
    rose: {
      bg: 'bg-rose-50',
      icon: 'text-rose-600',
      border: 'border-rose-100',
    },
  }

  const colors = colorMap[color] || colorMap.emerald

  return (
    <div className={`bg-white rounded-xl border ${colors.border} p-5 hover:shadow-md transition-all duration-300 group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1.5 font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% this week
            </p>
          )}
        </div>
        <div className={`${colors.bg} p-2.5 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>
    </div>
  )
}
