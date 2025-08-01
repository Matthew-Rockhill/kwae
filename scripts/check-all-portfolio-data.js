import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function checkAllPortfolioData() {
  console.log('🔍 Checking all portfolio data in database...\n');

  try {
    // 1. Get all categories
    const { data: categories, error: catError } = await supabase
      .from('portfolio_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (catError) {
      console.error('❌ Error fetching categories:', catError);
      return;
    }

    console.log('📁 All categories:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug})`);
      console.log(`    Path: ${cat.folder_path}`);
      console.log(`    Active: ${cat.is_active}, Images: ${cat.image_count}`);
      console.log('');
    });

    // 2. Check all items grouped by category
    for (const category of categories) {
      console.log(`\n📂 Category: ${category.name}`);
      console.log('─'.repeat(50));

      // Get ALL items (active and inactive)
      const { data: allItems, error: itemsError } = await supabase
        .from('portfolio_items')
        .select('id, filename, subcategory, is_active, imagekit_file_id')
        .eq('category_id', category.id)
        .order('is_active', { ascending: false })
        .order('subcategory', { ascending: true });

      if (itemsError) {
        console.error(`❌ Error fetching items for ${category.name}:`, itemsError);
        continue;
      }

      const activeItems = allItems.filter(item => item.is_active);
      const inactiveItems = allItems.filter(item => !item.is_active);

      console.log(`  Total: ${allItems.length} items (${activeItems.length} active, ${inactiveItems.length} inactive)`);

      // Group by subcategory
      const subcategoryGroups = {};
      activeItems.forEach(item => {
        const subcat = item.subcategory || '[No subcategory]';
        if (!subcategoryGroups[subcat]) {
          subcategoryGroups[subcat] = 0;
        }
        subcategoryGroups[subcat]++;
      });

      console.log(`  Active items by subcategory:`);
      Object.keys(subcategoryGroups).sort().forEach(subcat => {
        console.log(`    - ${subcat}: ${subcategoryGroups[subcat]} images`);
      });

      if (inactiveItems.length > 0) {
        const inactiveSubcats = {};
        inactiveItems.forEach(item => {
          const subcat = item.subcategory || '[No subcategory]';
          if (!inactiveSubcats[subcat]) {
            inactiveSubcats[subcat] = 0;
          }
          inactiveSubcats[subcat]++;
        });
        
        console.log(`  ⚠️  Inactive items by subcategory:`);
        Object.keys(inactiveSubcats).sort().forEach(subcat => {
          console.log(`    - ${subcat}: ${inactiveSubcats[subcat]} images`);
        });
      }
    }

    // 3. Check for any orphaned items
    const { data: orphanedItems, error: orphanError } = await supabase
      .from('portfolio_items')
      .select('id, filename, category_id')
      .not('category_id', 'in', `(${categories.map(c => `'${c.id}'`).join(',')})`);

    if (!orphanError && orphanedItems && orphanedItems.length > 0) {
      console.log(`\n❌ Found ${orphanedItems.length} orphaned items with invalid category_id!`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }

  process.exit(0);
}

checkAllPortfolioData();