import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with anon key for public read access
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

function getCacheKey(action, params) {
  return `${action}_${JSON.stringify(params)}`;
}

function getFromCache(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
  
  // Clean old cache entries periodically
  if (cache.size > 100) {
    const now = Date.now();
    for (const [k, v] of cache.entries()) {
      if (now - v.timestamp > CACHE_DURATION) {
        cache.delete(k);
      }
    }
  }
}

// Get all active portfolio categories
async function getCategories() {
  console.log('📁 Fetching categories from database');
  
  const cacheKey = getCacheKey('categories', {});
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log('⚡ Returning cached categories');
    return cached;
  }
  
  const { data: categories, error } = await supabase
    .from('portfolio_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  
  if (error) {
    console.error('❌ Error fetching categories:', error);
    throw error;
  }
  
  // Transform to match frontend expectations
  const transformedCategories = categories.map(category => ({
    id: category.slug,
    name: category.name,
    path: category.folder_path,
    folderName: category.name,
    imageCount: category.image_count,
    featuredImage: category.featured_image_url
  }));
  
  setCache(cacheKey, transformedCategories);
  console.log(`✅ Found ${transformedCategories.length} categories`);
  
  return transformedCategories;
}

// Get portfolio items for a specific category
async function getCategoryItems(categorySlug, subcategory = null, limit = 50, offset = 0) {
  console.log(`🖼️ Fetching items for category: ${categorySlug}${subcategory ? `, subcategory: ${subcategory}` : ''}`);
  
  const cacheKey = getCacheKey('items', { categorySlug, subcategory, limit, offset });
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log('⚡ Returning cached items');
    return cached;
  }
  
  // First, check if this category has any subfolders
  const { data: subfoldersCheck } = await supabase
    .from('portfolio_items_with_category')
    .select('subcategory')
    .eq('category_slug', categorySlug)
    .eq('is_active', true)
    .not('subcategory', 'is', null)
    .limit(1);
  
  const hasSubfolders = subfoldersCheck && subfoldersCheck.length > 0;
  
  let query = supabase
    .from('portfolio_items_with_category')
    .select('*')
    .eq('category_slug', categorySlug)
    .eq('is_active', true);
  
  if (subcategory) {
    // If specific subcategory requested, filter to that subcategory
    query = query.eq('subcategory', subcategory);
  } else if (!hasSubfolders) {
    // If no subfolders exist, only show items without subcategory
    query = query.is('subcategory', null);
  }
  // If no subcategory specified but subfolders exist, show all images (no additional filter)
  
  const { data: items, error } = await query
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error(`❌ Error fetching items for ${categorySlug}:`, error);
    throw error;
  }
  
  // Transform to match frontend expectations
  const transformedItems = items.map(item => ({
    thumbnailUrl: item.thumbnail_url,
    fullUrl: item.full_url,
    alt: item.alt_text,
    fileName: item.filename,
    filePath: item.metadata?.file_path || '',
    category: item.category_name,
    subcategory: item.subcategory,
    sortOrder: item.sort_order
  }));
  
  // Get unique subfolders/subcategories for this category
  const { data: subfolders, error: subfoldersError } = await supabase
    .from('portfolio_items_with_category')
    .select('subcategory')
    .eq('category_slug', categorySlug)
    .eq('is_active', true)
    .not('subcategory', 'is', null);
  
  if (subfoldersError) {
    console.error(`❌ Error fetching subfolders:`, subfoldersError);
  }
  
  // Only show subfolders if they represent actual folder structures, not individual files
  const validSubfolders = [...new Set(subfolders?.map(s => s.subcategory).filter(Boolean) || [])]
    .filter(subcatName => {
      // Only include if it looks like a folder name, not a filename
      return subcatName && !subcatName.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    })
    .map(subcatName => ({
      id: subcatName, // Use original name as ID for API filtering
      name: subcatName,
      path: `/${categorySlug}/${subcatName}`
    }));
  
  const result = {
    images: transformedItems,
    subfolders: validSubfolders.length > 0 ? validSubfolders : null,
    category: categorySlug,
    total: transformedItems.length
  };
  
  setCache(cacheKey, result);
  console.log(`✅ Found ${transformedItems.length} items, ${validSubfolders.length} subfolders`);
  
  return result;
}

// Get portfolio statistics
async function getPortfolioStats() {
  console.log('📊 Fetching portfolio statistics');
  
  const cacheKey = getCacheKey('stats', {});
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log('⚡ Returning cached stats');
    return cached;
  }
  
  const { data: stats, error } = await supabase
    .rpc('get_portfolio_stats');
  
  if (error) {
    console.error('❌ Error fetching stats:', error);
    // Return basic stats if function doesn't exist
    const { data: categoryCount } = await supabase
      .from('portfolio_categories')
      .select('id', { count: 'exact' })
      .eq('is_active', true);
    
    const { data: itemCount } = await supabase
      .from('portfolio_items')
      .select('id', { count: 'exact' })
      .eq('is_active', true);
    
    const basicStats = {
      totalCategories: categoryCount?.length || 0,
      totalImages: itemCount?.length || 0,
      lastUpdated: new Date().toISOString()
    };
    
    setCache(cacheKey, basicStats);
    return basicStats;
  }
  
  setCache(cacheKey, stats);
  return stats;
}

// Main API handler
export default async function handler(req, res) {
  console.log('🚀 Portfolio API called with query:', req.query);
  
  // Set CORS headers
  const allowedOrigins = [
    'https://www.kristinmathilde.com',
    'https://kristinmathilde.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { action, category, subcategory, limit = '50', offset = '0' } = req.query;
    
    // Route to appropriate handler
    if (action === 'categories') {
      const categories = await getCategories();
      return res.status(200).json({ 
        success: true,
        categories,
        cached: true // Indicate this is from optimized database
      });
    }
    
    if (action === 'stats') {
      const stats = await getPortfolioStats();
      return res.status(200).json({
        success: true,
        stats
      });
    }
    
    if (category) {
      const result = await getCategoryItems(
        category, 
        subcategory, 
        parseInt(limit), 
        parseInt(offset)
      );
      
      return res.status(200).json({
        success: true,
        ...result
      });
    }
    
    // Default: return categories
    const categories = await getCategories();
    return res.status(200).json({
      success: true,
      categories
    });
    
  } catch (error) {
    console.error('❌ Portfolio API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}