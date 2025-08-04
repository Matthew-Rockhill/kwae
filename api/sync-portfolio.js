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
    
    // Get ALL ImageKit files and folders in one call using proper API
    console.log('🔍 Fetching all portfolio items from ImageKit...');
    const allImageKitItems = await fetchFromImageKit(
      `https://api.imagekit.io/v1/files?limit=1000&searchQuery=path:"/portfolio/"`
    );
    
    console.log(`📊 Database: ${dbCategories?.length || 0} categories, ${dbItems?.length || 0} items`);
    console.log(`📊 ImageKit: ${allImageKitItems.length} total items`);
    
    // Separate folders and files
    const ikFolders = allImageKitItems.filter(item => item.type === 'folder');
    const ikFiles = allImageKitItems.filter(item => item.type === 'file');
    
    console.log(`📁 Found ${ikFolders.length} folders, ${ikFiles.length} files`);
    
    // Group items by category folders (direct children of /portfolio/)
    const categoryFolders = ikFolders.filter(folder => {
      const pathParts = folder.filePath.split('/').filter(Boolean);
      return pathParts.length === 2 && pathParts[0] === 'portfolio';
    });
    
    console.log(`📂 Found ${categoryFolders.length} category folders:`, categoryFolders.map(f => f.name));
    
    // Process each category folder from ImageKit
    for (const categoryFolder of categoryFolders) {
      const folderName = categoryFolder.name;
      const slug = generateSlug(folderName);
      const displayName = generateDisplayName(folderName);
      
      console.log(`🔍 Processing category: "${folderName}" -> slug: "${slug}"`);
      
      // Check if category exists in database
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
            folder_path: categoryFolder.filePath,
            sort_order: dbCategories.length + syncReport.categoriesAdded
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
      
      // Get all files for this category from our ImageKit data
      const categoryFiles = ikFiles.filter(file => {
        const pathParts = file.filePath.split('/').filter(Boolean);
        // Check if file is in this category folder (at least 3 parts: portfolio/category/file)
        return pathParts.length >= 3 && 
               pathParts[0] === 'portfolio' && 
               pathParts[1] === folderName;
      });
      
      console.log(`📸 Found ${categoryFiles.length} files in category ${folderName}`);
      
      // Get database items for this category
      const categoryDbItems = dbItems?.filter(item => item.category_id === dbCategory.id) || [];
      
      // Process each file
      for (const file of categoryFiles) {
        const pathParts = file.filePath.split('/').filter(Boolean);
        
        // Determine subcategory: if file path has more than 3 parts, it's in a subfolder
        let subcategory = null;
        if (pathParts.length > 3) {
          // File is in subfolder: /portfolio/Category/Subfolder/file.jpg
          subcategory = pathParts[2];
        }
        
        console.log(`📄 Processing file: ${file.name} (subcategory: ${subcategory || 'none'})`);
        await processFile(file, dbCategory, categoryDbItems, syncReport, subcategory);
      }
      
      // Check for orphaned items in database
      const ikFileIds = new Set(categoryFiles.map(f => f.fileId));
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