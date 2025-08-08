-- Fix RLS security issue on bookings table
-- This enables Row Level Security to protect booking data

-- Step 1: Enable RLS on the bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Step 2: Create RLS policies for the bookings table

-- Policy 1: Service role has full access (for your backend/admin)
CREATE POLICY "Service role has full access to bookings" ON bookings
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy 2: Authenticated users can only view their own bookings (based on email)
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'email' = email);

-- Policy 3: Anonymous users can INSERT new bookings (for the booking form)
-- But cannot view any existing bookings
CREATE POLICY "Anonymous users can create bookings" ON bookings
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy 4: Prevent anonymous users from viewing bookings
-- This is implicit when RLS is enabled and no SELECT policy exists for anon

-- Add comment explaining the security model
COMMENT ON TABLE bookings IS 
'Bookings table with RLS enabled. Anonymous users can submit bookings but cannot view them. Authenticated users can only see their own bookings. Service role has full access for admin purposes.';

-- Verify RLS is properly configured
DO $$
BEGIN
    -- Check if RLS is enabled
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_tables 
        WHERE tablename = 'bookings' 
        AND schemaname = 'public'
        AND rowsecurity = true
    ) THEN
        RAISE NOTICE 'Warning: RLS may not be properly enabled on bookings table';
    ELSE
        RAISE NOTICE 'Success: RLS is enabled on bookings table';
    END IF;
END $$;