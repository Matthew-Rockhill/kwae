-- Fix RLS performance issues by replacing direct auth function calls with subqueries
-- This prevents re-evaluation of auth functions for each row, improving query performance at scale

-- ==========================================
-- Portfolio Categories Policies
-- ==========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow service role full access to categories" ON portfolio_categories;
DROP POLICY IF EXISTS "Public users can view active categories" ON portfolio_categories;

-- Recreate policies with performance optimizations
CREATE POLICY "Allow service role full access to categories" ON portfolio_categories
    FOR ALL 
    USING ((SELECT auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Public users can view active categories" ON portfolio_categories
    FOR SELECT
    USING (is_active = true);

-- ==========================================
-- Portfolio Items Policies
-- ==========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow service role full access to portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Public users can view active portfolio items" ON portfolio_items;

-- Recreate policies with performance optimizations
CREATE POLICY "Allow service role full access to portfolio items" ON portfolio_items
    FOR ALL 
    USING ((SELECT auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Public users can view active portfolio items" ON portfolio_items
    FOR SELECT
    USING (is_active = true);

-- ==========================================
-- Vouchers Policies
-- ==========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to own vouchers by code" ON vouchers;
DROP POLICY IF EXISTS "Allow service role full access to vouchers" ON vouchers;
DROP POLICY IF EXISTS "Users can view vouchers by code" ON vouchers;
DROP POLICY IF EXISTS "Service role full access to vouchers" ON vouchers;
DROP POLICY IF EXISTS "Authenticated users can create vouchers" ON vouchers;
DROP POLICY IF EXISTS "Allow webhook updates with service role" ON vouchers;

-- Recreate policies with performance optimizations
CREATE POLICY "Users can view vouchers by code" ON vouchers
    FOR SELECT
    USING (
        -- Allow if voucher_code is provided in headers (cached once per query)
        voucher_code = (SELECT current_setting('request.headers', true)::json->>'x-voucher-code')
        OR 
        -- Allow authenticated users to see vouchers they purchased (cached once per query)
        ((SELECT auth.uid()) IS NOT NULL AND purchaser_email = (SELECT auth.jwt()->>'email'))
    );

CREATE POLICY "Service role full access to vouchers" ON vouchers
    FOR ALL
    USING (
        (SELECT auth.jwt()->>'role') = 'service_role'
        OR
        -- Admin users can access vouchers (cached once per query)
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE (SELECT auth.uid()) = id
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Authenticated users can create vouchers" ON vouchers
    FOR INSERT
    WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Allow webhook updates with service role" ON vouchers
    FOR UPDATE
    USING ((SELECT auth.jwt()->>'role') = 'service_role');

-- ==========================================
-- Bookings Policies (if they exist)
-- ==========================================

-- Drop existing bookings policies if they exist
DO $$
BEGIN
    -- Drop policies that might exist from migration 004
    DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
    DROP POLICY IF EXISTS "Anonymous users can insert bookings" ON bookings;
    DROP POLICY IF EXISTS "Service role can manage all bookings" ON bookings;
EXCEPTION
    WHEN undefined_table THEN
        -- Bookings table doesn't exist, skip
        NULL;
END $$;

-- Recreate bookings policies with performance optimizations if table exists
DO $$
BEGIN
    -- Check if bookings table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') THEN
        
        -- Policy for users to view their own bookings
        EXECUTE 'CREATE POLICY "Users can view own bookings" ON bookings
            FOR SELECT
            TO authenticated
            USING ((SELECT auth.jwt() ->> ''email'') = email)';
        
        -- Policy for anonymous booking creation
        EXECUTE 'CREATE POLICY "Anonymous users can insert bookings" ON bookings
            FOR INSERT
            TO anon
            WITH CHECK (true)';
        
        -- Policy for service role management
        EXECUTE 'CREATE POLICY "Service role can manage all bookings" ON bookings
            FOR ALL
            TO authenticated
            USING ((SELECT auth.jwt() ->> ''role'') = ''service_role'')';
            
    END IF;
END $$;

-- ==========================================
-- Performance Verification
-- ==========================================

-- Add comments explaining the optimizations
COMMENT ON POLICY "Allow service role full access to categories" ON portfolio_categories IS 
'Optimized RLS policy using subquery (SELECT auth.jwt() ->> ''role'') to prevent re-evaluation per row';

COMMENT ON POLICY "Allow service role full access to portfolio items" ON portfolio_items IS 
'Optimized RLS policy using subquery (SELECT auth.jwt() ->> ''role'') to prevent re-evaluation per row';

COMMENT ON POLICY "Service role full access to vouchers" ON vouchers IS 
'Optimized RLS policy using subqueries for auth functions to prevent re-evaluation per row';

-- Verification query to check policy definitions
/*
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
    AND tablename IN ('portfolio_categories', 'portfolio_items', 'vouchers', 'bookings')
ORDER BY tablename, policyname;
*/

-- Performance testing query examples:
/*
-- Test portfolio categories performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT COUNT(*) FROM portfolio_categories WHERE is_active = true;

-- Test voucher lookup performance  
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM vouchers WHERE voucher_code = 'TEST-CODE-123';

-- Test portfolio items performance
EXPLAIN (ANALYZE, BUFFERS)
SELECT COUNT(*) FROM portfolio_items WHERE is_active = true;
*/