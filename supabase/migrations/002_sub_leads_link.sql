-- ============================================
-- easyCRM Migration: Sub-Leads RPC & User Linking
-- Run this in Supabase SQL Editor
-- ============================================

-- Function to get sub-leads for a given lead ID
CREATE OR REPLACE FUNCTION get_sub_leads(p_lead_id UUID)
RETURNS TABLE (
  id UUID,
  owner_id UUID,
  parent_lead_id UUID,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  notes TEXT,
  source TEXT,
  status TEXT,
  linked_user_id UUID,
  generation INT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
DECLARE
  v_lead_email TEXT;
  v_linked_user_id UUID;
BEGIN
  -- Get lead details
  SELECT l.email, l.linked_user_id INTO v_lead_email, v_linked_user_id
  FROM leads l WHERE l.id = p_lead_id;

  -- Match email to user profile if not linked
  IF v_linked_user_id IS NULL AND v_lead_email IS NOT NULL AND v_lead_email <> '' THEN
    SELECT p.id INTO v_linked_user_id
    FROM profiles p
    WHERE LOWER(p.email) = LOWER(v_lead_email)
    LIMIT 1;

    IF v_linked_user_id IS NOT NULL THEN
      UPDATE leads SET linked_user_id = v_linked_user_id WHERE id = p_lead_id;
    END IF;
  END IF;

  RETURN QUERY
  SELECT l.id, l.owner_id, l.parent_lead_id, l.full_name, l.email, l.phone, l.company, l.notes, l.source, l.status, l.linked_user_id, l.generation, l.created_at, l.updated_at
  FROM leads l
  WHERE l.parent_lead_id = p_lead_id
     OR (v_linked_user_id IS NOT NULL AND l.owner_id = v_linked_user_id AND l.id <> p_lead_id)
  ORDER BY l.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
