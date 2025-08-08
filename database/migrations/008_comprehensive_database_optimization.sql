-- Comprehensive Database Optimization Migration
-- Fixes all security issues, creates missing tables, optimizes performance
-- This migration consolidates all database improvements into one clean operation

-- ==========================================
-- PART 1: CREATE MISSING TABLES
-- ==========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bookings table for photography session requests
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Package Selection (matches your booking form)
    selected_package VARCHAR(100) NOT NULL,
    
    -- Client Contact Information (matches BookingModal formData)
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    
    -- Session Details (matches BookingModal formData)
    event_date DATE, -- matches formData.eventDate
    additional_notes TEXT, -- matches formData.additionalNotes
    
    -- Booking Management
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    admin_notes TEXT, -- Admin notes
    
    -- Tracking
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiries table for general contact form submissions
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contact Information (matches ContactView form)
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL, -- matches form.mobile
    
    -- Inquiry Details (matches ContactView form)
    session_type VARCHAR(100), -- matches form.sessionType
    message TEXT NOT NULL, -- matches form.message
    
    -- Response Management
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'responded', 'in_progress', 'resolved')),
    admin_notes TEXT,
    responded_at TIMESTAMP WITH TIME ZONE NULL,
    
    -- Tracking
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps  
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- PART 2: CREATE OPTIMIZED INDEXES
-- ==========================================

-- Bookings indexes (only essential ones)
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);

-- Inquiries indexes (only essential ones)
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_session_type ON inquiries(session_type);

-- ==========================================
-- PART 3: REMOVE UNUSED INDEXES
-- ==========================================

-- Remove over-indexing from existing tables
DROP INDEX IF EXISTS idx_portfolio_items_subcategory; -- Rarely used in queries
DROP INDEX IF EXISTS idx_portfolio_items_sort; -- Not used in current forms
DROP INDEX IF EXISTS idx_vouchers_recipient_email; -- Admin queries only
DROP INDEX IF EXISTS idx_vouchers_expires_at; -- Admin queries only
DROP INDEX IF EXISTS idx_vouchers_created_at; -- Admin queries only

-- ==========================================
-- PART 4: FIX SECURITY DEFINER ISSUES
-- ==========================================

-- Fix voucher_stats view - remove SECURITY DEFINER
DROP VIEW IF EXISTS voucher_stats CASCADE;

CREATE VIEW voucher_stats AS
SELECT 
    voucher_type,
    status,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount
FROM vouchers
GROUP BY voucher_type, status;

-- Only grant to authenticated users (admin access only)
GRANT SELECT ON voucher_stats TO authenticated;

-- Add comment explaining security model
COMMENT ON VIEW voucher_stats IS 
'Voucher statistics for admin use. Uses SECURITY INVOKER (default) to respect user permissions. Access restricted to authenticated users only.';

-- ==========================================
-- PART 5: FIX FUNCTION SEARCH PATHS
-- ==========================================

-- Fix all functions to have explicit search_path and use SECURITY INVOKER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY INVOKER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_category_image_count()
RETURNS TRIGGER 
SECURITY INVOKER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE portfolio_categories 
        SET image_count = image_count + 1
        WHERE id = NEW.category_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE portfolio_categories 
        SET image_count = image_count - 1
        WHERE id = OLD.category_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.category_id != NEW.category_id THEN
            UPDATE portfolio_categories 
            SET image_count = image_count - 1
            WHERE id = OLD.category_id;
            
            UPDATE portfolio_categories 
            SET image_count = image_count + 1
            WHERE id = NEW.category_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION update_vouchers_updated_at()
RETURNS TRIGGER 
SECURITY INVOKER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION generate_voucher_code()
RETURNS TEXT 
SECURITY INVOKER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        code := UPPER(
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4) || '-' ||
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4) || '-' ||
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)
        );
        
        SELECT EXISTS(SELECT 1 FROM public.vouchers WHERE voucher_code = code) INTO exists_check;
        
        IF NOT exists_check THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$;

-- ==========================================
-- PART 6: ADD TRIGGERS FOR NEW TABLES
-- ==========================================

-- Triggers for automatic updated_at timestamps
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at 
    BEFORE UPDATE ON inquiries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- PART 7: ENABLE ROW LEVEL SECURITY
-- ==========================================

-- Enable RLS on new tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- PART 8: CLEAN UP ALL EXISTING POLICIES
-- ==========================================

-- Drop all existing policies to start clean
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on portfolio_categories
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'portfolio_categories' AND schemaname = 'public' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON portfolio_categories';
    END LOOP;
    
    -- Drop all policies on portfolio_items  
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'portfolio_items' AND schemaname = 'public' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON portfolio_items';
    END LOOP;
    
    -- Drop all policies on vouchers
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'vouchers' AND schemaname = 'public' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON vouchers';
    END LOOP;
END $$;

-- ==========================================
-- PART 9: CREATE OPTIMIZED RLS POLICIES
-- ==========================================

-- Portfolio Categories: Public read, service role manage
CREATE POLICY "portfolio_categories_public_read" ON portfolio_categories
    FOR SELECT 
    TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "portfolio_categories_service_manage" ON portfolio_categories
    FOR ALL 
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'role') = 'service_role');

-- Portfolio Items: Public read, service role manage  
CREATE POLICY "portfolio_items_public_read" ON portfolio_items
    FOR SELECT 
    TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "portfolio_items_service_manage" ON portfolio_items
    FOR ALL 
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'role') = 'service_role');

-- Vouchers: Code-based read, authenticated create, service role manage
CREATE POLICY "vouchers_code_read" ON vouchers
    FOR SELECT
    TO anon, authenticated
    USING (
        -- Allow if voucher_code is provided in request
        voucher_code = (SELECT current_setting('request.headers', true)::json->>'x-voucher-code')
        OR 
        -- Allow authenticated users to see vouchers they purchased
        ((SELECT auth.uid()) IS NOT NULL AND purchaser_email = (SELECT auth.jwt()->>'email'))
    );

CREATE POLICY "vouchers_authenticated_create" ON vouchers
    FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "vouchers_service_manage" ON vouchers
    FOR ALL
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'role') = 'service_role');

-- Bookings: Anonymous create, service role manage
CREATE POLICY "bookings_anonymous_create" ON bookings
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true); -- Anyone can submit booking requests

CREATE POLICY "bookings_service_manage" ON bookings
    FOR ALL
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'role') = 'service_role');

-- Inquiries: Anonymous create, service role manage
CREATE POLICY "inquiries_anonymous_create" ON inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true); -- Anyone can submit inquiries

CREATE POLICY "inquiries_service_manage" ON inquiries
    FOR ALL
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'role') = 'service_role');

-- ==========================================
-- PART 10: UPDATE VIEW FOR PORTFOLIO
-- ==========================================

-- Recreate portfolio view with correct column names and no SECURITY DEFINER
DROP VIEW IF EXISTS portfolio_items_with_category CASCADE;

CREATE VIEW portfolio_items_with_category AS
SELECT 
    pi.id,
    pi.category_id,
    pi.subcategory,
    pi.filename,
    pi.imagekit_file_id,
    pi.imagekit_url,
    pi.thumbnail_url,
    pi.full_url,
    pi.alt_text,
    pi.sort_order,
    pi.metadata,
    pi.is_active,
    pi.created_at,
    pi.updated_at,
    pc.name as category_name,
    pc.slug as category_slug,
    pc.folder_path as category_folder_path,
    pc.description as category_description,
    pc.featured_image_url as category_featured_image
FROM portfolio_items pi
JOIN portfolio_categories pc ON pi.category_id = pc.id
WHERE pi.is_active = true AND pc.is_active = true;

-- Grant access to the view
GRANT SELECT ON portfolio_items_with_category TO anon, authenticated;

-- Add comment explaining security model
COMMENT ON VIEW portfolio_items_with_category IS 
'Portfolio view with category information. Uses SECURITY INVOKER (default) to respect RLS policies on underlying tables.';

-- ==========================================
-- PART 11: ADD TABLE COMMENTS
-- ==========================================

COMMENT ON TABLE bookings IS 'Photography session booking requests from clients';
COMMENT ON TABLE inquiries IS 'General contact form submissions and inquiries';
COMMENT ON TABLE portfolio_categories IS 'Photography portfolio categories (wedding, family, NGO, etc.)';
COMMENT ON TABLE portfolio_items IS 'Individual portfolio images stored in ImageKit';
COMMENT ON TABLE vouchers IS 'Gift vouchers and NGO sponsorship vouchers for photography sessions';

-- ==========================================
-- PART 12: VERIFICATION QUERIES
-- ==========================================

-- Query to verify all policies are correct
/*
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
    AND tablename IN ('portfolio_categories', 'portfolio_items', 'vouchers', 'bookings', 'inquiries')
ORDER BY tablename, policyname;
*/

-- Query to verify all functions have search_path set
/*
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    p.prosecdef as security_definer,
    p.proconfig as config
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND p.proname IN (
        'update_updated_at_column',
        'update_category_image_count', 
        'update_vouchers_updated_at',
        'generate_voucher_code'
    )
ORDER BY p.proname;
*/

-- Test queries to verify table access
/*
-- Test portfolio public access
SELECT COUNT(*) FROM portfolio_categories WHERE is_active = true;
SELECT COUNT(*) FROM portfolio_items WHERE is_active = true;

-- Test new tables exist
SELECT COUNT(*) FROM bookings;
SELECT COUNT(*) FROM inquiries;

-- Test voucher stats view
SELECT * FROM voucher_stats;
*/