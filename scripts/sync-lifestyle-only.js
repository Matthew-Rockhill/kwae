import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IMAGEKIT_PUBLIC_URL = 'https://ik.imagekit.io/skbxxrf9vm/';

async function fetchFromImageKit(url) {
  const auth = Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64');
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ImageKit API error: ${response.status} ${error}`);
  }
  
  return response.json();
}

async function syncLifestyleOnly() {
  console.log('🔍 Running sync for Lifestyle category only...\n');
  
  try {
    // Get Lifestyle category from database
    const { data: categories, error: catError } = await supabase
      .from('portfolio_categories')
      .select('*')
      .eq('slug', 'lifestyle')
      .single();
      
    if (catError || !categories) {
      console.error('❌ Error fetching Lifestyle category:', catError);
      return;
    }
    
    const lifestyleCategory = categories;
    console.log('📁 Found Lifestyle category:', {
      id: lifestyleCategory.id,
      name: lifestyleCategory.name,
      folder_path: lifestyleCategory.folder_path
    });
    
    // Use the known subfolders directly
    console.log('\n🔍 Checking known Lifestyle subfolders...');
    const knownSubfolders = ['Events', 'Traditional Wedding', 'Rockpooling'];
    let totalImagesAdded = 0;
    
    for (const subfolderName of knownSubfolders) {
      const subfolderPath = `/portfolio/Lifestyle/${subfolderName}`;
      console.log(`\n📁 Processing subfolder: ${subfolderName}`);
      console.log(`   Path: ${subfolderPath}`);
      
      try {
        const subfolderContents = await fetchFromImageKit(
          `https://api.imagekit.io/v1/files?path=${encodeURIComponent(subfolderPath)}`
        );
        
        const files = subfolderContents.filter(item => item.type === 'file');
        console.log(`   Found ${files.length} files`);
        
        // Check existing items in database for this subcategory
        const { data: existingItems } = await supabase
          .from('portfolio_items')
          .select('imagekit_file_id')
          .eq('category_id', lifestyleCategory.id)
          .eq('subcategory', subfolderName)
          .eq('is_active', true);
        
        const existingFileIds = new Set((existingItems || []).map(item => item.imagekit_file_id));
        
        // Process each file
        let addedCount = 0;
        for (const file of files) {
          if (!existingFileIds.has(file.fileId)) {
            const baseUrl = IMAGEKIT_PUBLIC_URL + file.filePath.replace(/^\//, '');
            const urls = {
              original: baseUrl,
              thumbnail: baseUrl + '?tr=w-700,h-700,c-maintain_ar,q-92,e-sharpen,f-webp,f-auto,pr-true',
              full: baseUrl + '?tr=q-95,e-sharpen,f-webp,f-auto,pr-true'
            };
            
            const altText = `Lifestyle ${subfolderName} photo ${file.name.replace(/\.[^/.]+$/, '')}`;
            const sortMatch = file.name.match(/(\d+)/);
            const sortOrder = sortMatch ? parseInt(sortMatch[1]) : addedCount;
            
            const { error } = await supabase
              .from('portfolio_items')
              .insert([{
                category_id: lifestyleCategory.id,
                filename: file.name,
                imagekit_file_id: file.fileId,
                imagekit_url: urls.original,
                thumbnail_url: urls.thumbnail,
                full_url: urls.full,
                alt_text: altText,
                sort_order: sortOrder,
                subcategory: subfolderName,
                metadata: {
                  file_path: file.filePath,
                  synced_at: new Date().toISOString()
                }
              }]);
            
            if (error) {
              console.error(`   ❌ Failed to add ${file.name}: ${error.message}`);
            } else {
              addedCount++;
              console.log(`   ✅ Added: ${file.name}`);
            }
          }
        }
        
        console.log(`   Summary: ${addedCount} new images added, ${existingFileIds.size} already existed`);
        totalImagesAdded += addedCount;
        
      } catch (error) {
        console.error(`   ❌ Error processing subfolder ${subfolderName}:`, error.message);
      }
    }
    
    // Update category image count and featured image
    const { count } = await supabase
      .from('portfolio_items')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', lifestyleCategory.id)
      .eq('is_active', true);
    
    const { data: featuredItem } = await supabase
      .from('portfolio_items')
      .select('thumbnail_url')
      .eq('category_id', lifestyleCategory.id)
      .eq('is_active', true)
      .order('sort_order')
      .limit(1)
      .single();
    
    await supabase
      .from('portfolio_categories')
      .update({
        image_count: count || 0,
        featured_image_url: featuredItem?.thumbnail_url || null
      })
      .eq('id', lifestyleCategory.id);
    
    console.log(`\n✅ Sync complete!`);
    console.log(`   Total images added: ${totalImagesAdded}`);
    console.log(`   Total images in Lifestyle: ${count || 0}`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
  
  process.exit(0);
}

syncLifestyleOnly();