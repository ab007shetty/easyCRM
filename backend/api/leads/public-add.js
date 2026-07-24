import { supabaseAdmin } from '../../lib/supabase-admin.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { referral_code, full_name, email, phone, company, notes } = req.body

  if (!referral_code || !full_name) {
    return res.status(400).json({ error: 'Referral code and full name are required' })
  }

  try {
    // 1. Get profile owner by referral code
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('referral_code', referral_code)
      .single()

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Invalid referral code' })
    }

    // 2. Insert lead under owner using service-role bypass
    const { data: newLead, error: insertError } = await supabaseAdmin
      .from('leads')
      .insert({
        owner_id: profile.id,
        full_name,
        email: email || null,
        phone: phone || null,
        company: company || null,
        notes: notes || null,
        source: 'qr_scan',
        status: 'new',
        generation: 1
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    return res.status(201).json({
      message: 'Lead registered successfully',
      lead: newLead
    })
  } catch (err) {
    console.error('Error in public-add lead:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
