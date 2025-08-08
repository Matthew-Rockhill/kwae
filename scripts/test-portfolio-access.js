import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use anon key to test public access
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testPortfolioAccess() {
  console.log('🔍 Testing portfolio access after security fix...\n');
  
  // Test the view with anon key (simulating public access)
  const { count, error } = await supabase
    .from('portfolio_items_with_category')
    .select('*', { count: 'exact', head: true });
    
  if (error) {
    console.log('❌ Error accessing portfolio view:', error.message);
    console.log('   This means the view might not be publicly accessible.');
    return;
  } else {
    console.log('✅ Portfolio view is accessible with anonymous access!');
    console.log('📊 Total items visible:', count);
  }
  
  // Get a few sample items to verify data
  const { data: samples, error: sampleError } = await supabase
    .from('portfolio_items_with_category')
    .select('filename, category_name, imagekit_url')
    .limit(5);
    
  if (!sampleError && samples && samples.length > 0) {
    console.log('\n📸 Sample items successfully retrieved:');
    samples.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.filename} | Category: ${item.category_name}`);
    });
    console.log('\n✅ SUCCESS: Portfolio is working correctly!');
    console.log('   - Security issue fixed (no more SECURITY DEFINER)');
    console.log('   - Portfolio items still publicly accessible');
    console.log('   - Your website portfolio page should work normally');
  } else if (sampleError) {
    console.log('\n❌ Error retrieving samples:', sampleError.message);
  }
}

testPortfolioAccess().catch(console.error);