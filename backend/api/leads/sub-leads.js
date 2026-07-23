import { supabaseAdmin } from '../../lib/supabase-admin.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { lead_id } = req.query

  if (!lead_id) {
    return res.status(400).json({ error: 'lead_id is required' })
  }

  try {
    // 1. Fetch current lead
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .single()

    if (leadError || !lead) {
      return res.status(404).json({ error: 'Lead not found' })
    }

    let linkedUserId = lead.linked_user_id

    // 2. If not linked yet, check profiles by email
    if (!linkedUserId && lead.email) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .ilike('email', lead.email.trim())
        .maybeSingle()

      if (profile) {
        linkedUserId = profile.id
        // Auto-link lead to user profile
        await supabaseAdmin
          .from('leads')
          .update({ linked_user_id: linkedUserId })
          .eq('id', lead_id)
      }
    }

    // 3. Query sub-leads: parent_lead_id = lead_id OR owner_id = linkedUserId
    let query = supabaseAdmin.from('leads').select('*')

    if (linkedUserId) {
      query = query.or(`parent_lead_id.eq.${lead_id},and(owner_id.eq.${linkedUserId},id.neq.${lead_id})`)
    } else {
      query = query.eq('parent_lead_id', lead_id)
    }

    const { data: subLeads, error: subLeadsError } = await query.order('created_at', { ascending: false })

    if (subLeadsError) {
      throw subLeadsError
    }

    return res.status(200).json({
      subLeads: subLeads || [],
      linkedUserId
    })
  } catch (err) {
    console.error('Error fetching sub-leads:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
