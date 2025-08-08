import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function checkBookingsTable() {
  console.log('🔍 Checking bookings table...\n');
  
  // Try to query the bookings table
  const { data, error, count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true });
    
  if (error) {
    if (error.message.includes('does not exist')) {
      console.log('ℹ️  The bookings table does not exist in your database.');
      console.log('   This might be a false positive in the security report.');
      return;
    }
    console.log('⚠️  Error accessing bookings table:', error.message);
  } else {
    console.log('📊 Bookings table exists with', count, 'records');
    
    // Get table structure
    const { data: sample, error: sampleError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);
      
    if (!sampleError && sample && sample.length > 0) {
      console.log('\n📋 Table columns:', Object.keys(sample[0]));
    }
  }
}

checkBookingsTable().catch(console.error);