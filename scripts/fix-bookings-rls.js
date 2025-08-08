import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize clients with different permission levels
const serviceClient = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

const anonClient = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fixBookingsRLS() {
  console.log('🔐 Fixing RLS security issue on bookings table...\n');
  
  // SQL to fix the RLS issue
  const fixSQL = `
-- Fix RLS security issue on bookings table
-- This enables Row Level Security to protect booking data

-- Step 1: Enable RLS on the bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Step 2: Create RLS policies for the bookings table

-- Policy 1: Service role has full access (for your backend/admin)
DROP POLICY IF EXISTS "Service role has full access to bookings" ON bookings;
CREATE POLICY "Service role has full access to bookings" ON bookings
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy 2: Authenticated users can only view their own bookings (based on email)
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'email' = email);

-- Policy 3: Anonymous users can INSERT new bookings (for the booking form)
DROP POLICY IF EXISTS "Anonymous users can create bookings" ON bookings;
CREATE POLICY "Anonymous users can create bookings" ON bookings
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Add comment explaining the security model
COMMENT ON TABLE bookings IS 
'Bookings table with RLS enabled. Anonymous users can submit bookings but cannot view them. Authenticated users can only see their own bookings. Service role has full access for admin purposes.';
`;

  console.log('📝 SQL Script to fix the RLS issue:\n');
  console.log('════════════════════════════════════════════════════════════════');
  console.log(fixSQL);
  console.log('════════════════════════════════════════════════════════════════\n');
  
  console.log('🧪 Testing current access levels...\n');
  
  // Test 1: Service role access (should work)
  const { count: serviceCount, error: serviceError } = await serviceClient
    .from('bookings')
    .select('*', { count: 'exact', head: true });
    
  if (!serviceError) {
    console.log('✅ Service role can access bookings (', serviceCount, 'records )');
  } else {
    console.log('❌ Service role error:', serviceError.message);
  }
  
  // Test 2: Anonymous access (should fail after RLS is enabled)
  const { data: anonData, error: anonError } = await anonClient
    .from('bookings')
    .select('*')
    .limit(1);
    
  if (anonError || !anonData || anonData.length === 0) {
    console.log('✅ Anonymous users cannot view bookings (good - this is secure)');
  } else {
    console.log('⚠️  WARNING: Anonymous users CAN view bookings - RLS needs to be enabled!');
    console.log('   This is a security issue that needs to be fixed.');
  }
  
  // Test 3: Anonymous insert capability (should work even with RLS)
  console.log('\n🧪 Testing if anonymous users can still submit bookings...');
  const testBooking = {
    selected_package: 'test-package',
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    phone: '0000000000',
    event_date: new Date().toISOString(),
    additional_notes: 'RLS test booking - can be deleted',
    status: 'pending'
  };
  
  const { error: insertError } = await anonClient
    .from('bookings')
    .insert(testBooking);
    
  if (!insertError) {
    console.log('✅ Anonymous users can still submit new bookings (form will work)');
    
    // Clean up test booking
    await serviceClient
      .from('bookings')
      .delete()
      .eq('email', 'test@example.com')
      .eq('additional_notes', 'RLS test booking - can be deleted');
  } else {
    console.log('ℹ️  Anonymous insert test:', insertError.message);
  }
  
  console.log('\n📋 To apply this fix:');
  console.log('1. Go to: https://supabase.com/dashboard/project/xeeqjvjhnrdeknkwstqb/sql/new');
  console.log('2. Copy and paste the SQL script above');
  console.log('3. Click "Run" to execute');
  console.log('4. Your booking form will still work, but bookings will be properly secured');
}

fixBookingsRLS().catch(console.error);