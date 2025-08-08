-- ROLLBACK MIGRATION for 008_comprehensive_database_optimization.sql
-- This migration safely reverses all changes made in the optimization migration
-- Run this ONLY if you need to rollback the comprehensive optimization

-- ==========================================
-- WARNING: ROLLBACK MIGRATION
-- ==========================================
-- This will:
-- 1. Drop the new bookings and inquiries tables (and all their data)
-- 2. Restore original indexes  
-- 3. Restore original policies
-- 4. Restore original functions
-- Only run if you need to undo the optimization!

-- ==========================================
-- PART 1: DROP NEW TABLES
-- ==========================================

-- Drop new tables (this will delete all data!)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;

-- ==========================================
-- PART 2: RESTORE REMOVED INDEXES
-- ==========================================

-- Restore indexes that were removed in optimization
CREATE INDEX IF NOT EXISTS idx_portfolio_items_subcategory ON portfolio_items(subcategory);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_sort ON portfolio_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_vouchers_recipient_email ON vouchers(recipient_email);
CREATE INDEX IF NOT EXISTS idx_vouchers_expires_at ON vouchers(expires_at);
CREATE INDEX IF NOT EXISTS idx_vouchers_created_at ON vouchers(created_at);

-- ==========================================
-- PART 3: RESTORE ORIGINAL FUNCTIONS
-- ==========================================

-- Restore original functions without search_path (as they were before)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_category_image_count()
RETURNS TRIGGER AS $$
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
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_vouchers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION generate_voucher_code()
RETURNS TEXT AS $$
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
        
        SELECT EXISTS(SELECT 1 FROM vouchers WHERE voucher_code = code) INTO exists_check;
        
        IF NOT exists_check THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE 'plpgsql';

-- ==========================================
-- PART 4: RESTORE ORIGINAL VOUCHER_STATS VIEW
-- ==========================================

-- Restore original voucher_stats view with broader access
DROP VIEW IF EXISTS voucher_stats CASCADE;

CREATE OR REPLACE VIEW voucher_stats AS
SELECT 
    voucher_type,
    status,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount
FROM vouchers
GROUP BY voucher_type, status;

-- Grant access to both anon and authenticated (as it was originally)
GRANT SELECT ON voucher_stats TO anon, authenticated;

-- ==========================================
-- PART 5: RESTORE ORIGINAL POLICIES
-- ==========================================

-- Drop optimized policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename IN ('portfolio_categories', 'portfolio_items', 'vouchers') AND schemaname = 'public' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || 
            CASE 
                WHEN r.policyname LIKE '%portfolio_categories%' THEN 'portfolio_categories'
                WHEN r.policyname LIKE '%portfolio_items%' THEN 'portfolio_items'
                WHEN r.policyname LIKE '%vouchers%' THEN 'vouchers'
            END;
    END LOOP;
END $$;

-- Restore original policies from migration 001
CREATE POLICY "Allow public read access to active categories" ON portfolio_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to active portfolio items" ON portfolio_items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow service role full access to categories" ON portfolio_categories
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role full access to portfolio items" ON portfolio_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Restore original policies from migration 002
CREATE POLICY "Allow public read access to own vouchers by code" ON vouchers
    FOR SELECT USING (
        voucher_code = current_setting('request.jwt.claims', true)::json->>'voucher_code'
    );

CREATE POLICY "Allow service role full access to vouchers" ON vouchers
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ==========================================
-- PART 6: RESTORE ORIGINAL PORTFOLIO VIEW
-- ==========================================

-- Restore original portfolio view (this may have SECURITY DEFINER again)
DROP VIEW IF EXISTS portfolio_items_with_category CASCADE;

CREATE OR REPLACE VIEW portfolio_items_with_category AS
SELECT 
    pi.*,
    pc.name as category_name,
    pc.slug as category_slug,
    pc.folder_path as category_folder_path
FROM portfolio_items pi
JOIN portfolio_categories pc ON pi.category_id = pc.id
WHERE pi.is_active = true AND pc.is_active = true;

GRANT SELECT ON portfolio_items_with_category TO anon, authenticated;

-- ==========================================
-- VERIFICATION
-- ==========================================

-- Verify rollback completed
/*
-- Check that new tables are gone
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_name IN ('bookings', 'inquiries') AND table_schema = 'public';

-- Check that original indexes are restored  
SELECT COUNT(*) FROM pg_indexes 
WHERE indexname IN ('idx_portfolio_items_subcategory', 'idx_portfolio_items_sort', 'idx_vouchers_recipient_email');

-- Check policies are restored
SELECT COUNT(*) FROM pg_policies 
WHERE policyname LIKE 'Allow public read access%' OR policyname LIKE 'Allow service role full access%';
*/

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Rollback completed successfully. All changes from 008_comprehensive_database_optimization have been reversed.';
    RAISE NOTICE 'WARNING: Any data in bookings and inquiries tables has been permanently deleted.';
END $$;