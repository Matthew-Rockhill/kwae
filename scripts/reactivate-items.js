import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function reactivateAllItems() {
  console.log('🔄 Reactivating all inactive portfolio items...');
  
  try {
    // First, get count of inactive items
    const { data: inactiveItems, error: countError } = await supabase
      .from('portfolio_items')
      .select('id, filename, category_id, subcategory')
      .eq('is_active', false);
    
    if (countError) {
      console.error('❌ Error fetching inactive items:', countError);
      return;
    }
    
    console.log(`📊 Found ${inactiveItems.length} inactive items`);
    
    if (inactiveItems.length === 0) {
      console.log('✅ No inactive items to reactivate');
      return;
    }
    
    // Group by category for better logging
    const itemsByCategory = {};
    inactiveItems.forEach(item => {
      if (!itemsByCategory[item.category_id]) {
        itemsByCategory[item.category_id] = [];
      }
      itemsByCategory[item.category_id].push(item);
    });
    
    console.log('📁 Inactive items by category:');
    for (const [categoryId, items] of Object.entries(itemsByCategory)) {
      console.log(`  - Category ${categoryId}: ${items.length} items`);
      const subcategories = [...new Set(items.map(i => i.subcategory).filter(Boolean))];
      if (subcategories.length > 0) {
        console.log(`    Subcategories: ${subcategories.join(', ')}`);
      }
    }
    
    // Reactivate all items
    const { data: updatedItems, error: updateError } = await supabase
      .from('portfolio_items')
      .update({ 
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('is_active', false)
      .select('id');
    
    if (updateError) {
      console.error('❌ Error reactivating items:', updateError);
      return;
    }
    
    console.log(`✅ Successfully reactivated ${updatedItems.length} items`);
    
    // Verify the changes
    const { data: remainingInactive, error: verifyError } = await supabase
      .from('portfolio_items')
      .select('id', { count: 'exact' })
      .eq('is_active', false);
    
    if (!verifyError) {
      console.log(`📊 Remaining inactive items: ${remainingInactive.length}`);
    }
    
  } catch (error) {
    console.error('❌ Failed to reactivate items:', error);
  }
}

// Run the reactivation
reactivateAllItems();