import { supabaseAdmin } from '../../lib/supabase-admin.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { owner_id } = req.query

  if (!owner_id) {
    return res.status(400).json({ error: 'owner_id is required' })
  }

  try {
    const { data, error } = await supabaseAdmin.rpc('get_lead_tree', {
      p_owner_id: owner_id
    })

    if (error) throw error

    return res.status(200).json({ tree: data || [] })
  } catch (err) {
    console.error('Error fetching lead tree:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
