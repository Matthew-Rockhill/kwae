import { createClient } from '@supabase/supabase-js';

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

// Process a single file from ImageKit
async function processFile(file, dbCategory, categoryDbItems, syncReport, subcategory = null) {
  const existingItem = categoryDbItems.find(item => item.imagekit_file_id === file.fileId);
  
  if (!existingItem) {
    const subcategoryText = subcategory ? ` (${subcategory})` : '';
    console.log(`➕ Adding missing item: ${file.name}${subcategoryText}`);
    
    const baseUrl = IMAGEKIT_PUBLIC_URL + file.filePath.replace(/^\//, '');
    const urls = {
      original: baseUrl,
      // Larger premium quality thumbnails optimized for photography
      thumbnail: baseUrl + '?tr=w-700,h-700,c-maintain_ar,q-92,e-sharpen,f-webp,f-auto,pr-true',
      // Maximum quality for lightbox/full view with sharpening
      full: baseUrl + '?tr=q-95,e-sharpen,f-webp,f-auto,pr-true'
    };
    
    const altText = `${dbCategory.name} photo ${file.name.replace(/\.[^/.]+$/, '')}`;
    const sortMatch = file.name.match(/(\d+)/);
    const sortOrder = sortMatch ? parseInt(sortMatch[1]) : syncReport.itemsAdded;
    
    const { error } = await supabase
      .from('portfolio_items')
      .insert([{
        category_id: dbCategory.id,
        filename: file.name,
        imagekit_file_id: file.fileId,
        imagekit_url: urls.original,
        thumbnail_url: urls.thumbnail,
        full_url: urls.full,
        alt_text: altText,
        sort_order: sortOrder,
        subcategory: subcategory, // THIS IS THE KEY FIX
        metadata: {
          file_path: file.filePath,
          synced_at: new Date().toISOString()
        }
      }]);
    
    if (error) {
      syncReport.errors.push(`Failed to add item ${file.name}: ${error.message}`);
    } else {
      syncReport.itemsAdded++;
    }
  } else {
    // Update existing item if subcategory has changed
    if (existingItem.subcategory !== subcategory) {
      const { error } = await supabase
        .from('portfolio_items')
        .update({ subcategory: subcategory })
        .eq('id', existingItem.id);
      
      if (error) {
        syncReport.errors.push(`Failed to update subcategory for ${file.name}: ${error.message}`);
      } else {
        console.log(`✏️ Updated subcategory for ${file.name}: "${existingItem.subcategory}" → "${subcategory}"`);
        syncReport.categoriesUpdated++;
      }
    }
  }
}

// Compare ImageKit with database and find differences
async function compareAndSync() {
  console.log('🔄 Starting sync comparison...');
  
  const syncReport = {
    categoriesAdded: 0,
    categoriesUpdated: 0,
    itemsAdded: 0,
    itemsRemoved: 0,
    errors: []
  };
  
  try {
    // Get current database state
    const { data: dbCategories } = await supabase
      .from('portfolio_categories')
      .select('*')
      .eq('is_active', true);
    
    const { data: dbItems } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('is_active', true);
    
    // Get ImageKit state
    const ikFolders = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?path=/${PORTFOLIO_ROOT}&type=folder`
    );
    
    console.log(`📊 Database: ${dbCategories?.length || 0} categories, ${dbItems?.length || 0} items`);
    console.log(`📊 ImageKit: ${ikFolders.length} folders`);
    
    // Get the current max sort_order to add new categories at the end
    const maxSortOrder = Math.max(...(dbCategories || []).map(cat => cat.sort_order || 0), -1);
    
    // Process each ImageKit folder
    for (const folder of ikFolders) {
      if (folder.type !== 'folder') continue;
      
      const folderName = folder.name;
      const slug = generateSlug(folderName);
      const displayName = generateDisplayName(folderName);
      
      console.log(`🔍 Processing folder: "${folderName}" -> slug: "${slug}"`);
      
      // Check if category exists in database (case-insensitive)
      let dbCategory = dbCategories?.find(cat => 
        cat.slug.toLowerCase() === slug.toLowerCase()
      );
      
      if (!dbCategory) {
        // Create missing category
        console.log(`➕ Creating missing category: ${slug}`);
        const { data: newCategory, error } = await supabase
          .from('portfolio_categories')
          .insert([{
            name: displayName,
            slug: slug,
            folder_path: folder.filePath || `/${PORTFOLIO_ROOT}/${folderName}`,
            sort_order: maxSortOrder + 1 + syncReport.categoriesAdded
          }])
          .select()
          .single();
        
        if (error) {
          syncReport.errors.push(`Failed to create category ${slug}: ${error.message}`);
          continue;
        }
        
        dbCategory = newCategory;
        syncReport.categoriesAdded++;
      }
      
      // Get folder contents from ImageKit
      const folderContents = await fetchFromImageKit(
        `https://api.imagekit.io/v1/files?path=${dbCategory.folder_path}`
      );
      
      const ikFiles = folderContents.filter(item => item.type === 'file');
      const ikSubfolders = folderContents.filter(item => item.type === 'folder');
      const categoryDbItems = dbItems?.filter(item => item.category_id === dbCategory.id) || [];
      
      // Process files directly in the main category folder (no subcategory)
      for (const file of ikFiles) {
        await processFile(file, dbCategory, categoryDbItems, syncReport, null);
      }
      
      // Process subfolders and their files
      console.log(`📁 Found ${ikSubfolders.length} subfolders in ${dbCategory.name}:`, ikSubfolders.map(sf => sf.name));
      
      for (const subfolder of ikSubfolders) {
        console.log(`📁 Processing subfolder: ${subfolder.name} at ${subfolder.filePath}`);
        
        const subfolderContents = await fetchFromImageKit(
          `https://api.imagekit.io/v1/files?path=${subfolder.filePath}`
        );
        
        const subfolderFiles = subfolderContents.filter(item => item.type === 'file');
        const subcategoryName = subfolder.name;
        
        console.log(`📸 Found ${subfolderFiles.length} files in subfolder ${subcategoryName}:`, subfolderFiles.map(f => f.name));
        
        // Process files in this subfolder
        for (const file of subfolderFiles) {
          await processFile(file, dbCategory, categoryDbItems, syncReport, subcategoryName);
        }
      }
      
      // Check for items in database that no longer exist in ImageKit
      // Collect all file IDs from main folder and subfolders
      const allIkFiles = [...ikFiles];
      for (const subfolder of ikSubfolders) {
        const subfolderContents = await fetchFromImageKit(
          `https://api.imagekit.io/v1/files?path=${subfolder.filePath}`
        );
        const subfolderFiles = subfolderContents.filter(item => item.type === 'file');
        allIkFiles.push(...subfolderFiles);
      }
      
      const ikFileIds = new Set(allIkFiles.map(f => f.fileId));
      const orphanedItems = categoryDbItems.filter(item => !ikFileIds.has(item.imagekit_file_id));
      
      for (const orphanedItem of orphanedItems) {
        console.log(`🗑️ Removing orphaned item: ${orphanedItem.filename}`);
        
        const { error } = await supabase
          .from('portfolio_items')
          .update({ is_active: false })
          .eq('id', orphanedItem.id);
        
        if (error) {
          syncReport.errors.push(`Failed to remove item ${orphanedItem.filename}: ${error.message}`);
        } else {
          syncReport.itemsRemoved++;
        }
      }
    }
    
    // Update category image counts and featured images
    for (const category of dbCategories || []) {
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
        .order('sort_order')
        .limit(1)
        .single();
      
      await supabase
        .from('portfolio_categories')
        .update({
          image_count: count || 0,
          featured_image_url: featuredItem?.thumbnail_url || null
        })
        .eq('id', category.id);
      
      syncReport.categoriesUpdated++;
    }
    
    console.log('✅ Sync comparison completed');
    return syncReport;
    
  } catch (error) {
    console.error('❌ Sync comparison failed:', error);
    syncReport.errors.push(`Sync failed: ${error.message}`);
    return syncReport;
  }
}

// Health check function
async function healthCheck() {
  const health = {
    database: false,
    imagekit: false,
    categories: 0,
    items: 0,
    lastSync: null,
    errors: []
  };
  
  try {
    // Test database connection
    const { data: categories, error: dbError } = await supabase
      .from('portfolio_categories')
      .select('id', { count: 'exact' })
      .eq('is_active', true);
    
    if (dbError) {
      health.errors.push(`Database error: ${dbError.message}`);
    } else {
      health.database = true;
      health.categories = categories?.length || 0;
    }
    
    const { data: items, error: itemsError } = await supabase
      .from('portfolio_items')
      .select('id', { count: 'exact' })
      .eq('is_active', true);
    
    if (!itemsError) {
      health.items = items?.length || 0;
    }
    
    // Test ImageKit connection
    if (IMAGEKIT_PRIVATE_KEY) {
      await fetchFromImageKit(`https://api.imagekit.io/v1/files?path=/${PORTFOLIO_ROOT}&limit=1`);
      health.imagekit = true;
    }
    
    return health;
    
  } catch (error) {
    health.errors.push(`Health check failed: ${error.message}`);
    return health;
  }
}

// Main API handler
export default async function handler(req, res) {
  console.log('🔧 Portfolio sync API called');
  
  // Only allow GET and POST requests
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Basic auth check
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.SYNC_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const { action } = req.query;
    
    if (action === 'health' || req.method === 'GET') {
      const health = await healthCheck();
      return res.status(200).json({
        success: true,
        health,
        timestamp: new Date().toISOString()
      });
    }
    
    if (action === 'sync' || req.method === 'POST') {
      const startTime = Date.now();
      const syncReport = await compareAndSync();
      const duration = (Date.now() - startTime) / 1000;
      
      return res.status(200).json({
        success: syncReport.errors.length === 0,
        syncReport: {
          ...syncReport,
          duration: `${duration}s`
        },
        timestamp: new Date().toISOString()
      });
    }
    
    return res.status(400).json({
      error: 'Invalid action. Use ?action=health or ?action=sync'
    });
    
  } catch (error) {
    console.error('❌ Sync API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}