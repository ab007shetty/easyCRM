-- ============================================
-- easyCRM Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  referral_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for referral code lookups (QR code scanning)
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- ============================================
-- 2. LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  notes TEXT,
  source TEXT DEFAULT 'manual' CHECK (source IN ('qr_scan', 'manual', 'self_registered')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  linked_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  generation INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_parent_lead_id ON leads(parent_lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_linked_user_id ON leads(linked_user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- ============================================
-- 3. AUTO-CREATE PROFILE ON SIGNUP (TRIGGER)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. UPDATE TIMESTAMP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 5. RECURSIVE LEAD TREE FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION get_lead_tree(p_owner_id UUID)
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
  depth INT
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE lead_chain AS (
    -- Anchor: direct leads (1st generation)
    SELECT 
      l.id, l.owner_id, l.parent_lead_id,
      l.full_name, l.email, l.phone, l.company, l.notes,
      l.source, l.status, l.linked_user_id, l.generation,
      l.created_at, 1 AS depth
    FROM leads l
    WHERE l.owner_id = p_owner_id AND l.parent_lead_id IS NULL

    UNION ALL

    -- Recursive: leads under leads
    SELECT 
      l.id, l.owner_id, l.parent_lead_id,
      l.full_name, l.email, l.phone, l.company, l.notes,
      l.source, l.status, l.linked_user_id, l.generation,
      l.created_at, lc.depth + 1
    FROM leads l
    INNER JOIN lead_chain lc ON l.parent_lead_id = lc.id
  )
  SELECT * FROM lead_chain ORDER BY depth, lead_chain.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. LEAD STATS FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION get_lead_stats(p_owner_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH stats AS (
    SELECT
      COUNT(*) AS total_leads,
      COUNT(*) FILTER (WHERE status = 'new') AS new_leads,
      COUNT(*) FILTER (WHERE status = 'contacted') AS contacted_leads,
      COUNT(*) FILTER (WHERE status = 'qualified') AS qualified_leads,
      COUNT(*) FILTER (WHERE status = 'converted') AS converted_leads,
      COUNT(*) FILTER (WHERE status = 'lost') AS lost_leads,
      COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days') AS leads_this_week,
      COALESCE(MAX(generation), 0) AS max_depth
    FROM leads
    WHERE owner_id = p_owner_id
  )
  SELECT row_to_json(stats) INTO result FROM stats;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. GET OWNER BY REFERRAL CODE FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION get_owner_by_referral(p_referral_code TEXT)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.full_name, p.company_name, p.avatar_url
  FROM profiles p
  WHERE p.referral_code = p_referral_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Profiles: allow public read for referral lookups (limited fields via function)
CREATE POLICY "Public can view profiles for referral"
  ON profiles FOR SELECT
  USING (true);

-- Leads: owners can view their leads
CREATE POLICY "Owners can view their leads"
  ON leads FOR SELECT
  USING (auth.uid() = owner_id);

-- Leads: owners can insert leads
CREATE POLICY "Owners can insert leads"
  ON leads FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Leads: owners can update their leads
CREATE POLICY "Owners can update their leads"
  ON leads FOR UPDATE
  USING (auth.uid() = owner_id);

-- Leads: owners can delete their leads
CREATE POLICY "Owners can delete their leads"
  ON leads FOR DELETE
  USING (auth.uid() = owner_id);

-- Note: Public lead insertion (via QR scan) is handled by the
-- backend serverless function using the service_role key,
-- which bypasses RLS entirely.
