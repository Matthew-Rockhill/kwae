import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

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

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function syncImageKitToDatabase() {
  console.log('🔄 Starting ImageKit to Database sync...\n');
  
  try {
    // Step 1: Get ALL files from ImageKit
    console.log('📥 Fetching all files from ImageKit...');
    const allItems = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?limit=1000&searchQuery=path:"/portfolio/"`
    );
    
    // Filter only files (not folders)
    const ikFiles = allItems.filter(item => item.type === 'file');
    console.log(`Found ${ikFiles.length} files in ImageKit\n`);
    
    // Step 2: Get current database state
    console.log('📊 Fetching current database state...');
    const { data: dbCategories } = await supabase
      .from('portfolio_categories')
      .select('*');
    
    const { data: dbItems } = await supabase
      .from('portfolio_items')
      .select('*');
    
    console.log(`Database has ${dbCategories?.length || 0} categories and ${dbItems?.length || 0} items\n`);
    
    // Step 3: Process each file
    const categoryMap = new Map();
    const processedFileIds = new Set();
    
    console.log('🔍 Processing files...');
    console.log('='.repeat(80));
    
    for (const file of ikFiles) {
      const pathParts = file.filePath.split('/').filter(Boolean);
      
      // Validate path structure
      if (pathParts.length < 3 || pathParts[0] !== 'portfolio') {
        console.log(`⚠️ Skipping invalid path: ${file.filePath}`);
        continue;
      }
      
      const categoryName = pathParts[1];
      const subcategory = pathParts.length > 3 ? pathParts[2] : null;
      const categorySlug = generateSlug(categoryName);
      
      // Track this file as processed
      processedFileIds.add(file.fileId);
      
      // Find or create category
      let category = categoryMap.get(categorySlug);
      if (!category) {
        category = dbCategories?.find(c => c.slug === categorySlug);
        
        if (!category) {
          console.log(`\n➕ Creating new category: ${categoryName}`);
          const { data: newCat, error } = await supabase
            .from('portfolio_categories')
            .insert({
              name: categoryName,
              slug: categorySlug,
              folder_path: `/portfolio/${categoryName}`,
              sort_order: categoryMap.size,
              is_active: true
            })
            .select()
            .single();
          
          if (error) {
            console.error(`❌ Failed to create category: ${error.message}`);
            continue;
          }
          
          category = newCat;
          dbCategories.push(category);
        }
        
        categoryMap.set(categorySlug, category);
      }
      
      // Check if item exists
      const existingItem = dbItems?.find(item => item.imagekit_file_id === file.fileId);
      
      if (!existingItem) {
        // Create new item
        console.log(`➕ Adding: ${file.name} → ${categoryName}${subcategory ? `/${subcategory}` : ''}`);
        
        const baseUrl = IMAGEKIT_PUBLIC_URL + file.filePath.replace(/^\//, '');
        
        const { error } = await supabase
          .from('portfolio_items')
          .insert({
            category_id: category.id,
            filename: file.name,
            imagekit_file_id: file.fileId,
            imagekit_url: baseUrl,
            thumbnail_url: baseUrl + '?tr=w-700,h-700,c-maintain_ar,q-92,f-webp',
            full_url: baseUrl + '?tr=q-95,f-webp',
            alt_text: `${categoryName} photo ${file.name.replace(/\.[^/.]+$/, '')}`,
            sort_order: 0,
            subcategory: subcategory,
            is_active: true,
            metadata: {
              file_path: file.filePath,
              synced_at: new Date().toISOString()
            }
          });
        
        if (error) {
          console.error(`❌ Failed to add item: ${error.message}`);
        }
      } else if (existingItem.subcategory !== subcategory || !existingItem.is_active) {
        // Update existing item
        const updates = {};
        
        if (existingItem.subcategory !== subcategory) {
          console.log(`✏️ Updating subcategory for ${file.name}: "${existingItem.subcategory}" → "${subcategory}"`);
          updates.subcategory = subcategory;
        }
        
        if (!existingItem.is_active) {
          console.log(`♻️ Reactivating: ${file.name}`);
          updates.is_active = true;
        }
        
        if (Object.keys(updates).length > 0) {
          updates.metadata = {
            ...existingItem.metadata,
            synced_at: new Date().toISOString()
          };
          
          const { error } = await supabase
            .from('portfolio_items')
            .update(updates)
            .eq('id', existingItem.id);
          
          if (error) {
            console.error(`❌ Failed to update item: ${error.message}`);
          }
        }
      }
    }
    
    console.log('\n' + '='.repeat(80));
    
    // Step 4: Deactivate orphaned items
    const orphanedItems = dbItems?.filter(item => 
      item.is_active && !processedFileIds.has(item.imagekit_file_id)
    ) || [];
    
    if (orphanedItems.length > 0) {
      console.log(`\n🗑️ Deactivating ${orphanedItems.length} orphaned items...`);
      
      for (const item of orphanedItems) {
        console.log(`  - ${item.filename}`);
        await supabase
          .from('portfolio_items')
          .update({ is_active: false })
          .eq('id', item.id);
      }
    }
    
    // Step 5: Update category counts
    console.log('\n📊 Updating category counts...');
    
    for (const [slug, category] of categoryMap) {
      const { count } = await supabase
        .from('portfolio_items')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('is_active', true);
      
      const { data: featuredItem } = await supabase
        .from('portfolio_items')
        .select('thumbnail_url')
        .eq('category_id', category.id)
        .eq('is_active', true)
        .limit(1)
        .single();
      
      await supabase
        .from('portfolio_categories')
        .update({
          image_count: count || 0,
          featured_image_url: featuredItem?.thumbnail_url || null
        })
        .eq('id', category.id);
      
      console.log(`  ${category.name}: ${count} images`);
    }
    
    console.log('\n✅ Sync completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Sync failed:', error);
  }
}

// Run the sync
syncImageKitToDatabase();