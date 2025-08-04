import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function fixSubcategories() {
  console.log('🔧 Fixing subcategories for existing portfolio items...\n');
  
  try {
    // Get all portfolio items that have file paths indicating they're in subfolders
    const { data: items, error } = await supabase
      .from('portfolio_items')
      .select('id, filename, imagekit_url, subcategory')
      .eq('is_active', true);
    
    if (error) {
      console.error('❌ Error fetching items:', error);
      return;
    }
    
    console.log(`📊 Found ${items.length} active portfolio items`);
    
    let updatedCount = 0;
    
    for (const item of items) {
      // Extract path from imagekit_url to determine subcategory
      const url = new URL(item.imagekit_url);
      const path = url.pathname;
      
      // Parse the path: /portfolio/Category/Subfolder/file.ext
      const pathParts = path.split('/').filter(Boolean);
      
      let expectedSubcategory = null;
      if (pathParts.length >= 4) {
        // File is in a subfolder
        expectedSubcategory = pathParts[2]; // The subfolder name
      }
      
      // Only update if subcategory has changed
      if (expectedSubcategory !== item.subcategory) {
        console.log(`📝 Updating ${item.filename}:`);
        console.log(`    Path: ${path}`);
        console.log(`    Current subcategory: ${item.subcategory || 'null'}`);  
        console.log(`    New subcategory: ${expectedSubcategory || 'null'}`);
        
        const { error: updateError } = await supabase
          .from('portfolio_items')
          .update({ subcategory: expectedSubcategory })
          .eq('id', item.id);
        
        if (updateError) {
          console.error(`❌ Failed to update ${item.filename}:`, updateError);
        } else {
          updatedCount++;
        }
      }
    }
    
    console.log(`\n✅ Updated ${updatedCount} items with correct subcategories`);
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

fixSubcategories();