-- ==============================================================================
-- RESUMEBMH AI BUILDER — COMPLETE SUPABASE POSTGRESQL SCHEMA (HARDENED & FAIL-CLOSED)
-- Execute this script in your Supabase SQL Editor to initialize all tables,
-- foreign keys, indexes, and secure owner-only Row Level Security (RLS) policies.
-- Compatible with Clerk user IDs (text), Supabase Auth (UUID), and local sessions.
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Master Career Profile per user)
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT DEFAULT '',
    location TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    portfolio_url TEXT DEFAULT '',
    summary TEXT DEFAULT '',
    is_fresher_mode BOOLEAN DEFAULT FALSE,
    education JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '{"technical":[],"frameworks":[],"tools":[],"soft":[]}'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    current_ctc TEXT DEFAULT '',
    expected_ctc TEXT DEFAULT '',
    notice_period TEXT DEFAULT '',
    preferred_location TEXT DEFAULT '',
    work_mode TEXT DEFAULT 'Remote',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Resumes Table
CREATE TABLE IF NOT EXISTS public.resumes (
    id TEXT PRIMARY KEY DEFAULT ('res-' || uuid_generate_v4()::text),
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    target_role TEXT NOT NULL,
    template_id TEXT NOT NULL DEFAULT 'modern-clean',
    content JSONB NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);

-- 3. Resume Versions Table (Unique version number per resume)
CREATE TABLE IF NOT EXISTS public.resume_versions (
    id TEXT PRIMARY KEY DEFAULT ('ver-' || uuid_generate_v4()::text),
    resume_id TEXT NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    version_number INT NOT NULL,
    version_label TEXT NOT NULL,
    change_summary TEXT,
    snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_resume_version UNIQUE(resume_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_resume_versions_resume_id ON public.resume_versions(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_versions_user_id ON public.resume_versions(user_id);

-- 4. Cover Letters Table
CREATE TABLE IF NOT EXISTS public.cover_letters (
    id TEXT PRIMARY KEY DEFAULT ('cov-' || uuid_generate_v4()::text),
    user_id TEXT NOT NULL,
    resume_id TEXT REFERENCES public.resumes(id) ON DELETE SET NULL,
    company_name TEXT NOT NULL,
    target_role TEXT NOT NULL,
    tone TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON public.cover_letters(user_id);

-- 5. Interview Sessions Table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
    id TEXT PRIMARY KEY DEFAULT ('int-' || uuid_generate_v4()::text),
    user_id TEXT NOT NULL,
    target_role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    overall_score INT,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_interview_status CHECK (status IN ('active', 'completed', 'archived')),
    CONSTRAINT chk_interview_score CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100))
);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON public.interview_sessions(user_id);

-- 6. ATS Scans Table
CREATE TABLE IF NOT EXISTS public.ats_scans (
    id TEXT PRIMARY KEY DEFAULT ('scan-' || uuid_generate_v4()::text),
    user_id TEXT NOT NULL,
    resume_id TEXT REFERENCES public.resumes(id) ON DELETE SET NULL,
    resume_name TEXT NOT NULL,
    overall_score INT NOT NULL,
    formatting_score INT NOT NULL,
    completeness_score INT NOT NULL,
    keyword_strength_score INT NOT NULL,
    quantification_score INT NOT NULL,
    strengths JSONB DEFAULT '[]'::jsonb,
    issues JSONB DEFAULT '[]'::jsonb,
    actionable_fixes JSONB DEFAULT '[]'::jsonb,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_ats_overall_score CHECK (overall_score >= 0 AND overall_score <= 100),
    CONSTRAINT chk_ats_formatting_score CHECK (formatting_score >= 0 AND formatting_score <= 100),
    CONSTRAINT chk_ats_completeness_score CHECK (completeness_score >= 0 AND completeness_score <= 100),
    CONSTRAINT chk_ats_keyword_score CHECK (keyword_strength_score >= 0 AND keyword_strength_score <= 100),
    CONSTRAINT chk_ats_quant_score CHECK (quantification_score >= 0 AND quantification_score <= 100)
);

CREATE INDEX IF NOT EXISTS idx_ats_scans_user_id ON public.ats_scans(user_id);

-- 7. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id TEXT PRIMARY KEY DEFAULT ('sub-' || uuid_generate_v4()::text),
    user_id TEXT NOT NULL UNIQUE,
    plan TEXT NOT NULL DEFAULT 'free',
    status TEXT NOT NULL DEFAULT 'active',
    billing_cycle TEXT,
    payment_id TEXT,
    order_id TEXT,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_subscriptions_plan CHECK (plan IN ('free', 'pro', 'enterprise')),
    CONSTRAINT chk_subscriptions_status CHECK (status IN ('active', 'inactive', 'canceled', 'canceling', 'expired', 'past_due'))
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

-- 8. Orders Table (Server-side Razorpay order audit & replay prevention)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan TEXT NOT NULL,
    billing_cycle TEXT NOT NULL,
    amount INT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created',
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_orders_plan CHECK (plan IN ('free', 'pro', 'enterprise')),
    CONSTRAINT chk_orders_billing_cycle CHECK (billing_cycle IN ('monthly', 'yearly')),
    CONSTRAINT chk_orders_status CHECK (status IN ('created', 'paid', 'failed', 'refunded'))
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);

-- ------------------------------------------------------------------------------
-- 8b. Atomic Payment Confirmation & Pro Entitlement DB Function
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.confirm_payment_and_upgrade_pro(
    p_order_id TEXT,
    p_payment_id TEXT,
    p_billing_cycle TEXT,
    p_period_end TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id TEXT;
BEGIN
    -- 1. Atomically lock and mark order as paid
    UPDATE public.orders
    SET status = 'paid',
        razorpay_payment_id = p_payment_id,
        updated_at = NOW()
    WHERE razorpay_order_id = p_order_id
    RETURNING user_id INTO v_user_id;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Order with Razorpay order ID % not found', p_order_id;
    END IF;

    -- 2. Atomically upsert subscription to Pro
    INSERT INTO public.subscriptions (
        id, user_id, plan, status, billing_cycle, payment_id, order_id, current_period_end, updated_at
    ) VALUES (
        'sub-' || p_order_id, v_user_id, 'pro', 'active', p_billing_cycle, p_payment_id, p_order_id, p_period_end, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        plan = 'pro',
        status = 'active',
        billing_cycle = p_billing_cycle,
        payment_id = p_payment_id,
        order_id = p_order_id,
        current_period_end = p_period_end,
        updated_at = NOW();

    RETURN jsonb_build_object('success', true, 'userId', v_user_id, 'orderId', p_order_id);
END;
$$;

-- ------------------------------------------------------------------------------
-- 9. Enable Row Level Security (RLS) on all tables
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 10. Drop insecure legacy policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can manage own resume versions" ON public.resume_versions;
DROP POLICY IF EXISTS "Users can manage own cover letters" ON public.cover_letters;
DROP POLICY IF EXISTS "Users can manage own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can manage own ATS scans" ON public.ats_scans;
DROP POLICY IF EXISTS "Users can manage own subscription" ON public.subscriptions;

DROP POLICY IF EXISTS "profiles_owner" ON public.profiles;
DROP POLICY IF EXISTS "resumes_owner" ON public.resumes;
DROP POLICY IF EXISTS "resume_versions_owner" ON public.resume_versions;
DROP POLICY IF EXISTS "cover_letters_owner" ON public.cover_letters;
DROP POLICY IF EXISTS "interview_sessions_owner" ON public.interview_sessions;
DROP POLICY IF EXISTS "ats_scans_owner" ON public.ats_scans;
DROP POLICY IF EXISTS "subscriptions_owner_read" ON public.subscriptions;
DROP POLICY IF EXISTS "orders_owner_read" ON public.orders;

-- ------------------------------------------------------------------------------
-- 11. Strict Owner-Only RLS Policies (Supports both Clerk text IDs and Supabase UUIDs)
-- Note: Supabase service_role automatically bypasses RLS for trusted backend operations.
-- ------------------------------------------------------------------------------

-- Profiles: Authenticated users manage only their own profile
CREATE POLICY "profiles_owner" ON public.profiles
    FOR ALL TO authenticated
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Resumes: Authenticated users manage only their own resumes
CREATE POLICY "resumes_owner" ON public.resumes
    FOR ALL TO authenticated
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Resume Versions: Authenticated users manage only their own resume versions
CREATE POLICY "resume_versions_owner" ON public.resume_versions
    FOR ALL TO authenticated
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Cover Letters: Authenticated users manage only their own cover letters
CREATE POLICY "cover_letters_owner" ON public.cover_letters
    FOR ALL TO authenticated
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Interview Sessions: Authenticated users manage only their own interview sessions
CREATE POLICY "interview_sessions_owner" ON public.interview_sessions
    FOR ALL TO authenticated
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- ATS Scans: Authenticated users manage only their own ATS scans
CREATE POLICY "ats_scans_owner" ON public.ats_scans
    FOR ALL TO authenticated
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Subscriptions: Authenticated users can READ their own subscription only.
CREATE POLICY "subscriptions_owner_read" ON public.subscriptions
    FOR SELECT TO authenticated
    USING (auth.uid()::text = user_id);

-- Orders: Authenticated users can READ their own orders only.
CREATE POLICY "orders_owner_read" ON public.orders
    FOR SELECT TO authenticated
    USING (auth.uid()::text = user_id);
