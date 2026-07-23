import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession()
      if (error) {
        console.error('Auth callback error:', error)
        navigate('/login', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Completing sign in...</p>
      </div>
    </div>
  )
}
