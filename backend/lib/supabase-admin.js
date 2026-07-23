import { createClient } from '@supabase/supabase-js'

let client = null

export const getSupabaseAdmin = () => {
  if (!client) {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('Missing Supabase admin environment variables.')
    }

    client = createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseServiceKey || 'placeholder-key'
    )
  }
  return client
}

// Proxy object for backward compatibility with existing code importing `supabaseAdmin`
export const supabaseAdmin = new Proxy({}, {
  get(_target, prop) {
    const instance = getSupabaseAdmin()
    const value = instance[prop]
    return typeof value === 'function' ? value.bind(instance) : value
  }
})

