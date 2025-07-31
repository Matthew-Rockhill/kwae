#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

const IMAGEKIT_PUBLIC_URL = 'https://ik.imagekit.io/skbxxrf9vm/';

// Generate improved quality URLs
function generateHighQualityUrls(filePath) {
  const baseUrl = IMAGEKIT_PUBLIC_URL + filePath.replace(/^\//, '');
  
  return {
    original: baseUrl,
    // High-quality thumbnails for photography portfolio grid
    thumbnail: baseUrl + '?tr=w-400,h-400,c-at_max,q-85,f-webp,f-auto,pr-true',
    // Maximum quality for lightbox/full view
    full: baseUrl + '?tr=q-95,f-webp,f-auto,pr-true'
  };
}

async function updateImageQuality() {
  console.log('🎨 Updating image quality for all portfolio items...');
  
  try {
    // Get all portfolio items
    const { data: items, error } = await supabase
      .from('portfolio_items')
      .select('id, metadata')
      .eq('is_active', true);
    
    if (error) {
      throw error;
    }
    
    console.log(`📸 Found ${items.length} portfolio items to update`);
    
    let updated = 0;
    
    for (const item of items) {
      const filePath = item.metadata?.file_path;
      
      if (!filePath) {
        console.log(`⚠️ Skipping item ${item.id} - no file path`);
        continue;
      }
      
      const urls = generateHighQualityUrls(filePath);
      
      const { error: updateError } = await supabase
        .from('portfolio_items')
        .update({
          thumbnail_url: urls.thumbnail,
          full_url: urls.full,
          imagekit_url: urls.original
        })
        .eq('id', item.id);
      
      if (updateError) {
        console.error(`❌ Failed to update item ${item.id}:`, updateError);
        continue;
      }
      
      updated++;
      console.log(`✅ Updated item ${item.id} (${updated}/${items.length})`);
    }
    
    console.log(`\n🎉 Image quality update completed!`);
    console.log(`📈 Updated ${updated} out of ${items.length} items`);
    console.log(`\n📸 New quality settings:`);
    console.log(`   • Thumbnails: 400x400, 85% quality, WebP optimized`);
    console.log(`   • Full images: 95% quality, WebP optimized`);
    
  } catch (error) {
    console.error('❌ Image quality update failed:', error);
    process.exit(1);
  }
}

// Run the update
updateImageQuality();