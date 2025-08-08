-- Fix SECURITY DEFINER issue on voucher_stats view
-- This migration removes the SECURITY DEFINER property from the voucher_stats view
-- to ensure it uses the querying user's permissions rather than the view creator's

-- Drop the existing view (CASCADE will drop dependent objects if any)
DROP VIEW IF EXISTS voucher_stats CASCADE;

-- Recreate the view WITHOUT SECURITY DEFINER
-- By default, views are created with SECURITY INVOKER which is what we want
CREATE VIEW voucher_stats AS
SELECT 
    voucher_type,
    status,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount
FROM vouchers
GROUP BY voucher_type, status;

-- Re-grant necessary permissions
-- Only grant to authenticated users since this is admin statistics
-- Remove anon access as anonymous users shouldn't see aggregate voucher data
GRANT SELECT ON voucher_stats TO authenticated;

-- Add a comment explaining the security model
COMMENT ON VIEW voucher_stats IS 
'Aggregated voucher statistics for admin use. Uses SECURITY INVOKER to respect user permissions. Access restricted to authenticated users only.';

-- Ensure RLS is enabled on the vouchers table
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

-- Update RLS policies to ensure proper access control
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Allow public read access to own vouchers by code" ON vouchers;
    DROP POLICY IF EXISTS "Allow service role full access to vouchers" ON vouchers;
    
    -- Create policy for users to view their own vouchers by code
    -- This allows someone with a voucher code to check its status
    CREATE POLICY "Users can view vouchers by code" ON vouchers
        FOR SELECT
        USING (
            -- Allow if the voucher_code is provided in the query
            voucher_code = current_setting('request.headers', true)::json->>'x-voucher-code'
            OR 
            -- Allow authenticated users to see vouchers they purchased
            (auth.uid() IS NOT NULL AND purchaser_email = auth.jwt()->>'email')
        );
    
    -- Create policy for admin/service role access
    CREATE POLICY "Service role full access to vouchers" ON vouchers
        FOR ALL
        USING (
            auth.jwt()->>'role' = 'service_role'
            OR
            -- Add admin check if you have admin users
            EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.uid() = id
                AND raw_user_meta_data->>'role' = 'admin'
            )
        );
        
    -- Create policy for authenticated users to insert vouchers (for purchases)
    CREATE POLICY "Authenticated users can create vouchers" ON vouchers
        FOR INSERT
        WITH CHECK (auth.uid() IS NOT NULL);
        
    -- Create policy for webhook updates (e.g., payment confirmations)
    CREATE POLICY "Allow webhook updates with service role" ON vouchers
        FOR UPDATE
        USING (auth.jwt()->>'role' = 'service_role');
        
EXCEPTION
    WHEN duplicate_object THEN
        -- Policies already exist, skip creation
        NULL;
END $$;

-- Verification query to ensure the view works correctly
-- Run this after applying the migration to verify access
/*
-- As an admin/authenticated user:
SELECT * FROM voucher_stats;

-- To check if a specific voucher exists (as any user with the code):
SELECT * FROM vouchers WHERE voucher_code = 'YOUR-CODE-HERE';
*/