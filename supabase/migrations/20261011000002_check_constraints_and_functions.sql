-- ==============================================================================
-- Migration 00002: CHECK constraints, atomic payment confirmation function
-- ==============================================================================

-- 1. Subscriptions constraints
ALTER TABLE public.subscriptions
    ADD CONSTRAINT chk_subscriptions_plan CHECK (plan IN ('free', 'pro', 'enterprise')),
    ADD CONSTRAINT chk_subscriptions_status CHECK (status IN ('active', 'inactive', 'canceled', 'canceling', 'expired', 'past_due'));

-- 2. Orders constraints
ALTER TABLE public.orders
    ADD CONSTRAINT chk_orders_plan CHECK (plan IN ('free', 'pro', 'enterprise')),
    ADD CONSTRAINT chk_orders_billing_cycle CHECK (billing_cycle IN ('monthly', 'yearly')),
    ADD CONSTRAINT chk_orders_status CHECK (status IN ('created', 'paid', 'failed', 'refunded'));

-- 3. ATS Scans score constraints (0 to 100)
ALTER TABLE public.ats_scans
    ADD CONSTRAINT chk_ats_overall_score CHECK (overall_score >= 0 AND overall_score <= 100),
    ADD CONSTRAINT chk_ats_formatting_score CHECK (formatting_score >= 0 AND formatting_score <= 100),
    ADD CONSTRAINT chk_ats_completeness_score CHECK (completeness_score >= 0 AND completeness_score <= 100),
    ADD CONSTRAINT chk_ats_keyword_score CHECK (keyword_strength_score >= 0 AND keyword_strength_score <= 100),
    ADD CONSTRAINT chk_ats_quant_score CHECK (quantification_score >= 0 AND quantification_score <= 100);

-- 4. Interview Sessions constraints
ALTER TABLE public.interview_sessions
    ADD CONSTRAINT chk_interview_status CHECK (status IN ('active', 'completed', 'archived')),
    ADD CONSTRAINT chk_interview_score CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100));

-- 5. Atomic Payment Confirmation & Pro Entitlement DB Function
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
    v_user_id UUID;
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
