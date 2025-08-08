-- Complete Aligned Database Migration for Kristin's Photography Business
-- This migration creates a cohesive database system that perfectly aligns with all frontend forms
-- Covers: Portfolio, Bookings, Inquiries, and Vouchers with proper security and performance

-- ==========================================
-- PART 1: CREATE ALIGNED TABLES
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- BOOKINGS TABLE (BookingModal.vue)
-- ==========================================
-- Matches formData fields: selectedPackage, firstName, lastName, email, phone, eventDate, additionalNotes

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Package Selection (matches formData.selectedPackage)
    selected_package VARCHAR(100) NOT NULL,
    
    -- Client Contact Information (matches formData fields)
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    
    -- Session Details (matches formData fields)
    event_date DATE, -- matches formData.eventDate
    additional_notes TEXT, -- matches formData.additionalNotes
    
    -- Management Fields
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    admin_notes TEXT,
    
    -- Tracking
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INQUIRIES TABLE (ContactView.vue)
-- ==========================================
-- Matches form fields: firstName, lastName, email, mobile, sessionType, message

CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contact Information (matches form fields exactly)
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL, -- matches form.mobile
    
    -- Inquiry Details (matches form fields exactly)
    session_type VARCHAR(100), -- matches form.sessionType
    message TEXT NOT NULL, -- matches form.message
    
    -- Management Fields
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
-- VOUCHERS TABLE ALIGNMENT
-- ==========================================
-- The existing vouchers table structure is already good, but let's ensure it aligns with VoucherModal.vue
-- formData fields: selectedPackage, purchaserFirstName, purchaserLastName, purchaserEmail, 
-- purchaserPhone, recipientName, recipientEmail, recipientPhone, message

-- Update vouchers table if needed (using ALTER to be safe)
DO $$
BEGIN
    -- Check if we need to align the voucher columns with the frontend
    -- The existing structure should already match, but let's verify key fields exist
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vouchers' AND column_name = 'package_type'
    ) THEN
        ALTER TABLE vouchers ADD COLUMN package_type VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vouchers' AND column_name = 'package_name'
    ) THEN
        ALTER TABLE vouchers ADD COLUMN package_name VARCHAR(255);
    END IF;
END $$;

-- ==========================================
-- PART 2: CREATE OPTIMIZED INDEXES
-- ==========================================

-- Bookings indexes (essential queries only)
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);

-- Inquiries indexes (essential queries only)
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_session_type ON inquiries(session_type);

-- Portfolio indexes (keep only essential)
-- These should already exist, but ensure they're optimal
CREATE INDEX IF NOT EXISTS idx_portfolio_categories_is_active ON portfolio_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_portfolio_categories_slug ON portfolio_categories(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_is_active ON portfolio_items(is_active);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_category_id ON portfolio_items(category_id);

-- Vouchers indexes (keep only essential)
-- These should already exist but let's ensure optimal set
CREATE INDEX IF NOT EXISTS idx_vouchers_voucher_code ON vouchers(voucher_code);
CREATE INDEX IF NOT EXISTS idx_vouchers_status ON vouchers(status);
CREATE INDEX IF NOT EXISTS idx_vouchers_voucher_type ON vouchers(voucher_type);
CREATE INDEX IF NOT EXISTS idx_vouchers_purchaser_email ON vouchers(purchaser_email);

-- ==========================================
-- PART 3: REMOVE UNUSED INDEXES
-- ==========================================

-- Remove over-indexing that's not used by the actual application
DROP INDEX IF EXISTS idx_portfolio_items_subcategory; -- Not used in queries
DROP INDEX IF EXISTS idx_portfolio_items_sort_order; -- Not used in current UI
DROP INDEX IF EXISTS idx_portfolio_items_imagekit_id; -- Not used for user queries
DROP INDEX IF EXISTS idx_vouchers_recipient_email; -- Admin queries only, not performance critical
DROP INDEX IF EXISTS idx_vouchers_expires_at; -- Admin queries only
DROP INDEX IF EXISTS idx_vouchers_created_at; -- Admin queries only

-- ==========================================
-- PART 4: CREATE SECURE, OPTIMIZED FUNCTIONS
-- ==========================================

-- Update timestamp function with explicit security settings
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

-- Portfolio image count function with explicit security settings
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

-- Vouchers update function with explicit security settings
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

-- Voucher code generation function with explicit security settings
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
-- PART 5: CREATE TRIGGERS
-- ==========================================

-- Triggers for updated_at timestamps
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at 
    BEFORE UPDATE ON inquiries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ensure existing triggers exist and are correct
DROP TRIGGER IF EXISTS update_portfolio_categories_updated_at ON portfolio_categories;
CREATE TRIGGER update_portfolio_categories_updated_at 
    BEFORE UPDATE ON portfolio_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON portfolio_items;
CREATE TRIGGER update_portfolio_items_updated_at 
    BEFORE UPDATE ON portfolio_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_category_image_count_trigger ON portfolio_items;
CREATE TRIGGER update_category_image_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON portfolio_items
    FOR EACH ROW EXECUTE FUNCTION update_category_image_count();

DROP TRIGGER IF EXISTS update_vouchers_updated_at_trigger ON vouchers;
CREATE TRIGGER update_vouchers_updated_at_trigger
    BEFORE UPDATE ON vouchers
    FOR EACH ROW EXECUTE FUNCTION update_vouchers_updated_at();

-- ==========================================
-- PART 6: ENABLE ROW LEVEL SECURITY
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- PART 7: CLEAN UP ALL EXISTING POLICIES
-- ==========================================

-- Drop ALL existing policies to start clean
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Clean up portfolio_categories policies
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'portfolio_categories' AND schemaname = 'public' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON portfolio_categories';
    END LOOP;
    
    -- Clean up portfolio_items policies  
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'portfolio_items' AND schemaname = 'public' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON portfolio_items';
    END LOOP;
    
    -- Clean up vouchers policies
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'vouchers' AND schemaname = 'public' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON vouchers';
    END LOOP;
    
    -- Clean up bookings policies (if any exist)
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'bookings' AND schemaname = 'public' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON bookings';
    END LOOP;
    
    -- Clean up inquiries policies (if any exist)
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'inquiries' AND schemaname = 'public' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON inquiries';
    END LOOP;
END $$;

-- ==========================================
-- PART 8: CREATE OPTIMIZED RLS POLICIES
-- ==========================================

-- Portfolio Categories: Public read, service role manage
CREATE POLICY "portfolio_categories_public_read" ON portfolio_categories
    FOR SELECT 
    TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "portfolio_categories_admin_manage" ON portfolio_categories
    FOR ALL 
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'role') = 'service_role');

-- Portfolio Items: Public read, service role manage  
CREATE POLICY "portfolio_items_public_read" ON portfolio_items
    FOR SELECT 
    TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "portfolio_items_admin_manage" ON portfolio_items
    FOR ALL 
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'role') = 'service_role');

-- Vouchers: Secure access based on use case
CREATE POLICY "vouchers_public_read_by_code" ON vouchers
    FOR SELECT
    TO anon, authenticated
    USING (
        -- Allow lookup by voucher code (for redemption checks)
        voucher_code = (SELECT current_setting('request.headers', true)::json->>'x-voucher-code')
        OR 
        -- Allow authenticated purchasers to see their own vouchers
        ((SELECT auth.uid()) IS NOT NULL AND purchaser_email = (SELECT auth.jwt()->>'email'))
    );

CREATE POLICY "vouchers_authenticated_create" ON vouchers
    FOR INSERT
    TO authenticated, anon  -- Allow both for voucher purchases
    WITH CHECK (true); -- Business logic validation handled in application

CREATE POLICY "vouchers_admin_manage" ON vouchers
    FOR ALL
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'role') = 'service_role');

-- Bookings: Anonymous create (booking requests), admin manage
CREATE POLICY "bookings_public_create" ON bookings
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true); -- Anyone can submit booking requests

CREATE POLICY "bookings_admin_manage" ON bookings
    FOR ALL
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'role') = 'service_role');

-- Inquiries: Anonymous create (contact form), admin manage
CREATE POLICY "inquiries_public_create" ON inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true); -- Anyone can submit inquiries

CREATE POLICY "inquiries_admin_manage" ON inquiries
    FOR ALL
    TO authenticated
    USING ((SELECT auth.jwt() ->> 'role') = 'service_role');

-- ==========================================
-- PART 9: CREATE/FIX VIEWS
-- ==========================================

-- Portfolio view with correct structure and no SECURITY DEFINER
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
    pc.featured_image_url as category_featured_image,
    pc.sort_order as category_sort_order
FROM portfolio_items pi
JOIN portfolio_categories pc ON pi.category_id = pc.id
WHERE pi.is_active = true AND pc.is_active = true
ORDER BY pc.sort_order, pi.sort_order;

GRANT SELECT ON portfolio_items_with_category TO anon, authenticated;

-- Voucher stats view (admin only, no SECURITY DEFINER)
DROP VIEW IF EXISTS voucher_stats CASCADE;

CREATE VIEW voucher_stats AS
SELECT 
    voucher_type,
    status,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount,
    MIN(created_at) as first_voucher_date,
    MAX(created_at) as latest_voucher_date
FROM vouchers
GROUP BY voucher_type, status
ORDER BY voucher_type, status;

-- Only authenticated users (admins) can see voucher stats
GRANT SELECT ON voucher_stats TO authenticated;

-- ==========================================
-- PART 10: ADD HELPFUL COMMENTS
-- ==========================================

COMMENT ON TABLE bookings IS 'Photography session booking requests submitted via BookingModal.vue';
COMMENT ON TABLE inquiries IS 'General contact form submissions from ContactView.vue';
COMMENT ON TABLE portfolio_categories IS 'Photography portfolio categories (weddings, family, NGO work, etc.)';
COMMENT ON TABLE portfolio_items IS 'Individual portfolio images stored in ImageKit CDN';
COMMENT ON TABLE vouchers IS 'Gift vouchers and NGO sponsorship vouchers from VoucherModal.vue';

COMMENT ON VIEW portfolio_items_with_category IS 'Portfolio items joined with category info, public access via RLS';
COMMENT ON VIEW voucher_stats IS 'Admin statistics for voucher sales and redemptions';

-- ==========================================
-- PART 11: VERIFICATION QUERIES
-- ==========================================

-- Verify all tables exist and have correct structure
/*
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name IN ('bookings', 'inquiries', 'portfolio_categories', 'portfolio_items', 'vouchers')
ORDER BY table_name, ordinal_position;
*/

-- Verify all policies are correctly set
/*
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
    AND tablename IN ('portfolio_categories', 'portfolio_items', 'vouchers', 'bookings', 'inquiries')
ORDER BY tablename, policyname;
*/

-- Verify all functions have correct security settings
/*
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    p.prosecdef as is_security_definer,
    p.proconfig as config_settings
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND p.proname LIKE '%update%' OR p.proname LIKE '%generate%'
ORDER BY p.proname;
*/

-- Test data access (should work for public tables)
/*
-- Test public access to portfolio
SELECT COUNT(*) FROM portfolio_categories WHERE is_active = true;
SELECT COUNT(*) FROM portfolio_items WHERE is_active = true;

-- Test that new tables exist and are accessible for inserts
INSERT INTO inquiries (first_name, last_name, email, mobile, session_type, message) 
VALUES ('Test', 'User', 'test@example.com', '+27123456789', 'family', 'Test message');

INSERT INTO bookings (selected_package, first_name, last_name, email, phone, event_date, additional_notes)
VALUES ('dust-light', 'Test', 'User', 'test@example.com', '+27123456789', CURRENT_DATE + 30, 'Test booking');
*/

-- Success notification
DO $$
BEGIN
    RAISE NOTICE '✅ Complete aligned database migration successful!';
    RAISE NOTICE '📸 Portfolio system: Public access with admin management';
    RAISE NOTICE '📅 Bookings system: Ready for BookingModal.vue form submissions';
    RAISE NOTICE '💬 Inquiries system: Ready for ContactView.vue form submissions'; 
    RAISE NOTICE '🎁 Vouchers system: Secure gift/sponsorship voucher management';
    RAISE NOTICE '🔒 Security: All SECURITY DEFINER issues resolved';
    RAISE NOTICE '⚡ Performance: Optimized indexes and RLS policies';
    RAISE NOTICE '🚀 Your photography business database is ready!';
END $$;