import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function checkLifestyleSubcategories() {
  console.log('🔍 Checking Lifestyle category in database...\n');

  try {
    // 1. Find the lifestyle category
    const { data: categories, error: catError } = await supabase
      .from('portfolio_categories')
      .select('*')
      .ilike('slug', 'lifestyle');

    if (catError) {
      console.error('❌ Error fetching categories:', catError);
      return;
    }

    console.log('📁 Lifestyle category data:');
    console.log(JSON.stringify(categories, null, 2));
    console.log('\n');

    if (!categories || categories.length === 0) {
      console.log('❌ No lifestyle category found!');
      return;
    }

    const lifestyleCategory = categories[0];

    // 2. Get all items in lifestyle category
    const { data: items, error: itemsError } = await supabase
      .from('portfolio_items')
      .select('id, filename, subcategory, imagekit_file_id, is_active')
      .eq('category_id', lifestyleCategory.id)
      .eq('is_active', true)
      .order('subcategory', { ascending: true });

    if (itemsError) {
      console.error('❌ Error fetching items:', itemsError);
      return;
    }

    console.log(`📊 Total active items in Lifestyle: ${items.length}\n`);

    // 3. Group by subcategory
    const subcategoryGroups = {};
    let noSubcategoryCount = 0;

    items.forEach(item => {
      if (item.subcategory) {
        if (!subcategoryGroups[item.subcategory]) {
          subcategoryGroups[item.subcategory] = [];
        }
        subcategoryGroups[item.subcategory].push(item);
      } else {
        noSubcategoryCount++;
      }
    });

    console.log('📂 Subcategories found:');
    Object.keys(subcategoryGroups).forEach(subcat => {
      console.log(`  - ${subcat}: ${subcategoryGroups[subcat].length} images`);
    });
    console.log(`  - [No subcategory]: ${noSubcategoryCount} images\n`);

    // 4. Show sample items from each subcategory
    console.log('📸 Sample items by subcategory:');
    Object.keys(subcategoryGroups).forEach(subcat => {
      console.log(`\n  ${subcat}:`);
      subcategoryGroups[subcat].slice(0, 3).forEach(item => {
        console.log(`    - ${item.filename}`);
      });
      if (subcategoryGroups[subcat].length > 3) {
        console.log(`    ... and ${subcategoryGroups[subcat].length - 3} more`);
      }
    });

    // 5. Check for any inactive items with subcategories
    const { data: inactiveItems, error: inactiveError } = await supabase
      .from('portfolio_items')
      .select('id, filename, subcategory')
      .eq('category_id', lifestyleCategory.id)
      .eq('is_active', false)
      .not('subcategory', 'is', null);

    if (!inactiveError && inactiveItems.length > 0) {
      console.log(`\n⚠️  Found ${inactiveItems.length} INACTIVE items with subcategories`);
      const inactiveSubcats = [...new Set(inactiveItems.map(i => i.subcategory))];
      console.log('   Inactive subcategories:', inactiveSubcats);
    }

    // 6. Check folder_path format
    console.log('\n🔍 Checking folder path format:');
    console.log(`   Category folder_path: ${lifestyleCategory.folder_path}`);
    console.log(`   Expected format: /portfolio/lifestyle or /portfolio/Lifestyle`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }

  process.exit(0);
}

checkLifestyleSubcategories();