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
async function processFile(file, dbCategory, allDbItems, syncReport, subcategory = null) {
  // Check both active and inactive items to see if this file already exists
  const existingItem = allDbItems.find(item => item.imagekit_file_id === file.fileId);
  
  if (!existingItem) {
    const subcategoryText = subcategory ? ` (${subcategory})` : '';
    console.log(`➕ Adding new item: ${file.name}${subcategoryText}`);
    
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
        subcategory: subcategory,
        is_active: true,
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
    // Check if item needs to be reactivated or updated
    let updates = {};
    
    if (!existingItem.is_active) {
      console.log(`♻️ Reactivating item: ${file.name}`);
      updates.is_active = true;
      syncReport.itemsReactivated = (syncReport.itemsReactivated || 0) + 1;
    }
    
    if (existingItem.subcategory !== subcategory) {
      console.log(`✏️ Updating subcategory for ${file.name}: "${existingItem.subcategory}" → "${subcategory}"`);
      updates.subcategory = subcategory;
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
        syncReport.errors.push(`Failed to update item ${file.name}: ${error.message}`);
      } else {
        syncReport.itemsUpdated = (syncReport.itemsUpdated || 0) + 1;
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
    itemsUpdated: 0,
    itemsReactivated: 0,
    itemsRemoved: 0,
    errors: []
  };
  
  try {
    // Get current database state
    const { data: dbCategories } = await supabase
      .from('portfolio_categories')
      .select('*')
      .eq('is_active', true);
    
    // Get ALL items (active and inactive) to properly handle reactivation
    const { data: dbItems } = await supabase
      .from('portfolio_items')
      .select('*');
    
    // Get ImageKit state - use includeFolder=true to get all folders recursively
    const allItems = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?includeFolder=true&limit=1000`
    );
    
    // Filter for top-level portfolio folders only
    const ikFolders = allItems
      .filter(item => 
        item.type === 'folder' && 
        item.folderPath && 
        item.folderPath.startsWith(`/${PORTFOLIO_ROOT}/`) &&
        item.folderPath.split('/').length === 3 // Only direct children of /portfolio/
      )
      .map(folder => ({
        ...folder,
        filePath: folder.folderPath, // Use folderPath as filePath for consistency
        name: folder.name
      }));
    
    console.log(`📊 Database: ${dbCategories?.length || 0} categories, ${dbItems?.length || 0} items`);
    console.log(`📊 ImageKit: ${ikFolders.length} folders`);
    console.log(`📁 ImageKit folders found:`, ikFolders.map(f => ({ name: f.name, path: f.filePath, type: f.type })));
    console.log(`📂 Database categories:`, dbCategories?.map(c => ({ name: c.name, slug: c.slug, folder_path: c.folder_path })));
    
    // Debug: List all items in /portfolio to see what's actually there
    console.log(`🔍 Listing ALL items in /portfolio...`);
    try {
      const allPortfolioItems = await fetchFromImageKit(
        `https://api.imagekit.io/v1/files?path=/portfolio`
      );
      console.log(`📄 Found ${allPortfolioItems.length} total items in /portfolio:`);
      allPortfolioItems.forEach(item => {
        console.log(`  - ${item.type}: ${item.name} (path: ${item.filePath})`);
      });
    } catch (error) {
      console.log(`❌ Failed to list /portfolio contents: ${error.message}`);
    }
    
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
      
      // Get folder contents from ImageKit using the folderPath from the recursive search
      const targetPath = dbCategory.folder_path || `/${PORTFOLIO_ROOT}/${folderName}`;
      console.log(`🔎 Getting contents for: ${targetPath}`);
      
      // Get all items that belong to this folder (both direct files and subfolders)
      const categoryItems = allItems.filter(item => {
        if (!item.folderPath) return false;
        
        // For files: check if they're directly in this folder
        if (item.type === 'file') {
          return item.folderPath === targetPath;
        }
        
        // For folders: check if they're subfolders of this category
        if (item.type === 'folder') {
          return item.folderPath.startsWith(targetPath + '/') && 
                 item.folderPath.split('/').length === targetPath.split('/').length + 1;
        }
        
        return false;
      });
      
      const folderContents = categoryItems;
      const successfulPath = targetPath;
      
      console.log(`📁 Found ${folderContents.length} items in ${dbCategory.name}: ${folderContents.filter(i => i.type === 'file').length} files, ${folderContents.filter(i => i.type === 'folder').length} subfolders`);
      
      if (!successfulPath && folderContents.length === 0) {
        console.log(`⚠️ No valid path found for ${dbCategory.name}, skipping`);
        continue;
      }
      
      // Update database with correct path if different
      if (successfulPath !== dbCategory.folder_path) {
        console.log(`📝 Updating folder_path for ${dbCategory.name}: "${dbCategory.folder_path}" → "${successfulPath}"`);
        await supabase
          .from('portfolio_categories')
          .update({ folder_path: successfulPath })
          .eq('id', dbCategory.id);
        dbCategory.folder_path = successfulPath; // Update local object
      }
      
      const ikFiles = folderContents.filter(item => item.type === 'file');
      const ikSubfolders = folderContents.filter(item => item.type === 'folder');
      // Get ALL items for this category (active and inactive)
      const categoryDbItems = dbItems?.filter(item => item.category_id === dbCategory.id) || [];
      
      // Process files directly in the main category folder (no subcategory)
      for (const file of ikFiles) {
        // Convert folderPath to filePath for the file
        const fileWithPath = {
          ...file,
          filePath: file.folderPath + '/' + file.name
        };
        await processFile(fileWithPath, dbCategory, categoryDbItems, syncReport, null);
      }
      
      // Process subfolders and their files
      console.log(`📁 Found ${ikSubfolders.length} subfolders in ${dbCategory.name}:`, ikSubfolders.map(sf => sf.name));
      
      for (const subfolder of ikSubfolders) {
        console.log(`📁 Processing subfolder: ${subfolder.name} at ${subfolder.folderPath}`);
        
        // Get files that belong to this subfolder from our allItems array
        const subfolderFiles = allItems.filter(item => 
          item.type === 'file' && item.folderPath === subfolder.folderPath
        );
        
        const subcategoryName = subfolder.name;
        
        console.log(`📸 Found ${subfolderFiles.length} files in subfolder ${subcategoryName}:`, subfolderFiles.slice(0, 3).map(f => f.name));
        
        // Process files in this subfolder
        for (const file of subfolderFiles) {
          // Convert folderPath to filePath for the file
          const fileWithPath = {
            ...file,
            filePath: file.folderPath + '/' + file.name
          };
          await processFile(fileWithPath, dbCategory, categoryDbItems, syncReport, subcategoryName);
        }
      }
      
      // Check for items in database that no longer exist in ImageKit
      // Collect all file IDs from main folder and subfolders
      const allIkFiles = [...ikFiles];
      for (const subfolder of ikSubfolders) {
        const subfolderFiles = allItems.filter(item => 
          item.type === 'file' && item.folderPath === subfolder.folderPath
        );
        allIkFiles.push(...subfolderFiles);
      }
      
      const ikFileIds = new Set(allIkFiles.map(f => f.fileId));
      // Only check active items for orphaned status
      const orphanedItems = categoryDbItems.filter(item => 
        item.is_active && !ikFileIds.has(item.imagekit_file_id)
      );
      
      for (const orphanedItem of orphanedItems) {
        console.log(`🗑️ Deactivating orphaned item: ${orphanedItem.filename}`);
        
        const { error } = await supabase
          .from('portfolio_items')
          .update({ is_active: false })
          .eq('id', orphanedItem.id);
        
        if (error) {
          syncReport.errors.push(`Failed to deactivate item ${orphanedItem.filename}: ${error.message}`);
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