import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function fixSecurityDefiner() {
  console.log('🔧 Fixing SECURITY DEFINER issue on portfolio_items_with_category view...\n');
  
  // First, check current portfolio items count
  const { count: beforeCount, error: countError } = await supabase
    .from('portfolio_items_with_category')
    .select('*', { count: 'exact', head: true });
  
  if (!countError) {
    console.log(`📊 Current portfolio items visible: ${beforeCount}\n`);
  } else {
    console.log('⚠️  Could not access portfolio_items_with_category view:', countError.message);
  }
  
  // SQL to fix the security issue
  const fixSQL = `
-- Step 1: Drop and recreate the view WITHOUT SECURITY DEFINER
DROP VIEW IF EXISTS portfolio_items_with_category CASCADE;

CREATE VIEW portfolio_items_with_category AS
SELECT 
    pi.id,
    pi.title,
    pi.description,
    pi.image_url,
    pi.thumbnail_url,
    pi.file_id,
    pi.file_name,
    pi.file_path,
    pi.width,
    pi.height,
    pi.size,
    pi.category_id,
    pi.tags,
    pi.metadata,
    pi.display_order,
    pi.is_featured,
    pi.is_active,
    pi.created_at,
    pi.updated_at,
    pc.name as category_name,
    pc.slug as category_slug,
    pc.folder_path as category_folder_path
FROM portfolio_items pi
JOIN portfolio_categories pc ON pi.category_id = pc.id
WHERE pi.is_active = true AND pc.is_active = true;

-- Step 2: Re-grant necessary permissions
GRANT SELECT ON portfolio_items_with_category TO anon;
GRANT SELECT ON portfolio_items_with_category TO authenticated;

-- Step 3: Ensure RLS policies allow public read access
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "Public users can view active portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Public users can view active categories" ON portfolio_categories;

CREATE POLICY "Public users can view active portfolio items" ON portfolio_items
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Public users can view active categories" ON portfolio_categories
    FOR SELECT
    USING (is_active = true);

-- Add comment
COMMENT ON VIEW portfolio_items_with_category IS 
'View joining portfolio items with categories. Uses SECURITY INVOKER (default) to respect RLS policies.';
`;

  console.log('📝 SQL Script to fix the issue:\n');
  console.log('════════════════════════════════════════════════════════════════');
  console.log(fixSQL);
  console.log('════════════════════════════════════════════════════════════════\n');
  
  console.log('📋 To apply this fix:');
  console.log('1. Go to: https://supabase.com/dashboard/project/xeeqjvjhnrdeknkwstqb/sql/new');
  console.log('2. Copy and paste the SQL script above');
  console.log('3. Click "Run" to execute');
  console.log('4. Test your portfolio page to ensure it still works\n');
  
  // Test current access
  console.log('🔍 Testing current table access...');
  
  const { data: items, error: itemsError } = await supabase
    .from('portfolio_items')
    .select('id, title, is_active')
    .eq('is_active', true)
    .limit(3);
    
  if (itemsError) {
    console.log('❌ Error accessing portfolio_items:', itemsError.message);
  } else {
    console.log(`✅ Portfolio items table is accessible (${items.length} active items found)`);
    if (items.length > 0) {
      console.log('   Sample items:', items.map(i => i.title).join(', '));
    }
  }
  
  const { data: categories, error: catError } = await supabase
    .from('portfolio_categories')
    .select('id, name, is_active')
    .eq('is_active', true);
    
  if (catError) {
    console.log('❌ Error accessing portfolio_categories:', catError.message);
  } else {
    console.log(`✅ Portfolio categories table is accessible (${categories.length} active categories)`);
    if (categories.length > 0) {
      console.log('   Categories:', categories.map(c => c.name).join(', '));
    }
  }
}

fixSecurityDefiner().catch(console.error);