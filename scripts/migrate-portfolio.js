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

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IMAGEKIT_PUBLIC_URL = 'https://ik.imagekit.io/skbxxrf9vm/';
const PORTFOLIO_ROOT = 'portfolio';

// Helper functions
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

function generateDisplayName(folderName) {
  return folderName
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function generateImageUrls(filePath) {
  const baseUrl = IMAGEKIT_PUBLIC_URL + filePath.replace(/^\//, '');
  
  return {
    original: baseUrl,
    // Premium quality thumbnails optimized for photography
    thumbnail: baseUrl + '?tr=w-500,h-500,c-maintain_ar,q-90,e-sharpen,f-webp,f-auto,pr-true',
    // Maximum quality for lightbox/full view with sharpening
    full: baseUrl + '?tr=q-95,e-sharpen,f-webp,f-auto,pr-true'
  };
}

// Fetch data from ImageKit API
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

// Migrate categories from ImageKit folders
async function migrateCategories() {
  console.log('📁 Migrating categories from ImageKit...');
  
  const folders = await fetchFromImageKit(
    `https://api.imagekit.io/v1/files?path=/${PORTFOLIO_ROOT}&type=folder`
  );
  
  const categories = [];
  
  for (const folder of folders) {
    if (folder.type !== 'folder') continue;
    
    const folderName = folder.name;
    const displayName = generateDisplayName(folderName);
    const slug = generateSlug(folderName);
    const folderPath = folder.filePath || `/${PORTFOLIO_ROOT}/${folderName}`;
    
    console.log(`📂 Processing category: ${folderName} -> ${slug}`);
    
    // Check if category already exists
    const { data: existingCategory } = await supabase
      .from('portfolio_categories')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (existingCategory) {
      console.log(`⏭️ Category ${slug} already exists, skipping`);
      categories.push({ ...existingCategory, slug, name: displayName, folderPath });
      continue;
    }
    
    // Create category
    const { data: newCategory, error } = await supabase
      .from('portfolio_categories')
      .insert([{
        name: displayName,
        slug: slug,
        folder_path: folderPath,
        sort_order: categories.length
      }])
      .select()
      .single();
    
    if (error) {
      console.error(`❌ Error creating category ${slug}:`, error);
      continue;
    }
    
    console.log(`✅ Created category: ${slug}`);
    categories.push({ ...newCategory, folderPath });
  }
  
  return categories;
}

// Migrate portfolio items for a category
async function migrateCategoryItems(category) {
  console.log(`🖼️ Migrating items for category: ${category.slug}`);
  
  try {
    const folderContents = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?path=${category.folderPath}`
    );
    
    let itemCount = 0;
    let featuredImageUrl = null;
    
    // Process all files in the category
    const files = folderContents.filter(item => item.type === 'file');
    
    for (const file of files) {
      const { name: filename, fileId, filePath } = file;
      
      // Check if item already exists
      const { data: existingItem } = await supabase
        .from('portfolio_items')
        .select('id')
        .eq('imagekit_file_id', fileId)
        .single();
      
      if (existingItem) {
        console.log(`⏭️ Item ${filename} already exists, skipping`);
        itemCount++;
        continue;
      }
      
      // Generate URLs and metadata
      const urls = generateImageUrls(filePath);
      const altText = `${category.name} photo ${filename.replace(/\.[^/.]+$/, '')}`;
      
      // Extract sort order from filename
      const sortMatch = filename.match(/(\d+)/);
      const sortOrder = sortMatch ? parseInt(sortMatch[1]) : itemCount;
      
      // Determine subcategory from file path
      const pathParts = filePath.replace(/^\//, '').split('/');
      const subcategory = pathParts.length > 2 ? pathParts[2] : null;
      
      // Insert portfolio item
      const { data: portfolioItem, error } = await supabase
        .from('portfolio_items')
        .insert([{
          category_id: category.id,
          subcategory: subcategory,
          filename: filename,
          imagekit_file_id: fileId,
          imagekit_url: urls.original,
          thumbnail_url: urls.thumbnail,
          full_url: urls.full,
          alt_text: altText,
          sort_order: sortOrder,
          metadata: {
            file_path: filePath,
            migrated_at: new Date().toISOString(),
            original_folder: category.folderPath
          }
        }])
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error inserting ${filename}:`, error);
        continue;
      }
      
      itemCount++;
      
      // Set first image as featured image
      if (!featuredImageUrl) {
        featuredImageUrl = urls.thumbnail;
      }
      
      console.log(`✅ Added ${filename} (${itemCount})`);
    }
    
    // Update category with image count and featured image
    if (itemCount > 0) {
      await supabase
        .from('portfolio_categories')
        .update({
          image_count: itemCount,
          featured_image_url: featuredImageUrl
        })
        .eq('id', category.id);
    }
    
    console.log(`✅ Migrated ${itemCount} items for ${category.slug}`);
    return itemCount;
    
  } catch (error) {
    console.error(`❌ Error migrating items for ${category.slug}:`, error);
    return 0;
  }
}

// Main migration function
async function runMigration() {
  console.log('🚀 Starting portfolio migration from ImageKit to database...');
  console.log('📊 This will sync all existing portfolio data');
  
  if (!IMAGEKIT_PRIVATE_KEY) {
    throw new Error('IMAGEKIT_PRIVATE_KEY environment variable is required');
  }
  
  const startTime = Date.now();
  let totalImages = 0;
  
  try {
    // Step 1: Migrate categories
    console.log('\n📁 Step 1: Migrating categories...');
    const categories = await migrateCategories();
    console.log(`✅ Migrated ${categories.length} categories`);
    
    // Step 2: Migrate items for each category
    console.log('\n🖼️ Step 2: Migrating portfolio items...');
    for (const category of categories) {
      const itemCount = await migrateCategoryItems(category);
      totalImages += itemCount;
    }
    
    // Step 3: Update statistics
    console.log('\n📊 Step 3: Finalizing migration...');
    
    const duration = (Date.now() - startTime) / 1000;
    
    console.log('\n🎉 Migration completed successfully!');
    console.log(`📁 Categories: ${categories.length}`);
    console.log(`🖼️ Images: ${totalImages}`);
    console.log(`⏱️ Duration: ${duration}s`);
    
    return {
      success: true,
      categories: categories.length,
      images: totalImages,
      duration: duration
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
runMigration().catch(console.error);