import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function checkSubcategories() {
  console.log('🔍 Checking current subcategories in database...\n');
  
  try {
    // Get all active portfolio items with their subcategories
    const { data: items, error } = await supabase
      .from('portfolio_items')
      .select('filename, subcategory, category_id')
      .eq('is_active', true)
      .order('category_id');
    
    if (error) {
      console.error('❌ Error fetching items:', error);
      return;
    }
    
    // Get categories too
    const { data: categories, error: catError } = await supabase
      .from('portfolio_categories')
      .select('id, name')
      .eq('is_active', true);
    
    if (catError) {
      console.error('❌ Error fetching categories:', catError);
      return;
    }
    
    // Group by category
    const catMap = {};
    categories.forEach(cat => {
      catMap[cat.id] = cat.name;
    });
    
    const subcategoryStats = {};
    
    items.forEach(item => {
      const catName = catMap[item.category_id];
      if (!subcategoryStats[catName]) {
        subcategoryStats[catName] = {};
      }
      
      const subcat = item.subcategory || 'no-subcategory';
      if (!subcategoryStats[catName][subcat]) {
        subcategoryStats[catName][subcat] = 0;
      }
      subcategoryStats[catName][subcat]++;
    });
    
    console.log('📊 Current subcategory breakdown:');
    console.log('='.repeat(60));
    
    Object.keys(subcategoryStats).forEach(catName => {
      console.log(`\n${catName}:`);
      Object.keys(subcategoryStats[catName]).forEach(subcat => {
        const count = subcategoryStats[catName][subcat];
        console.log(`  ${subcat}: ${count} files`);
      });
    });
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

checkSubcategories();