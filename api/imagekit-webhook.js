import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

const IMAGEKIT_PUBLIC_URL = 'https://ik.imagekit.io/skbxxrf9vm/';
const PORTFOLIO_ROOT = 'portfolio';

// Verify ImageKit webhook signature for security
function verifyWebhookSignature(payload, signature, secret) {
  if (!secret || !signature) return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Generate category slug from folder name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Generate display name from folder name
function generateDisplayName(folderName) {
  return folderName
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Extract category and subcategory from file path
function parseFolderPath(filePath) {
  // Remove leading slash and portfolio root
  const cleanPath = filePath.replace(/^\//, '').replace(`${PORTFOLIO_ROOT}/`, '');
  const parts = cleanPath.split('/');
  
  return {
    category: parts[0] || null,
    subcategory: parts[1] || null,
    isPortfolioFile: filePath.includes(`/${PORTFOLIO_ROOT}/`)
  };
}

// Generate optimized ImageKit URLs
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

// Create or update category
async function ensureCategory(categoryName, folderPath) {
  const slug = generateSlug(categoryName);
  const displayName = generateDisplayName(categoryName);
  
  console.log(`📁 Ensuring category exists: ${categoryName} -> ${slug}`);
  
  // Check if category exists
  const { data: existingCategory } = await supabase
    .from('portfolio_categories')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (existingCategory) {
    console.log(`✅ Category ${slug} already exists`);
    return existingCategory;
  }
  
  // Create new category
  const { data: newCategory, error } = await supabase
    .from('portfolio_categories')
    .insert([{
      name: displayName,
      slug: slug,
      folder_path: folderPath,
      sort_order: 0
    }])
    .select()
    .single();
  
  if (error) {
    console.error(`❌ Error creating category ${slug}:`, error);
    throw error;
  }
  
  console.log(`✅ Created new category: ${slug}`);
  return newCategory;
}

// Handle file upload event
async function handleFileUpload(eventData) {
  const { file } = eventData;
  const { filePath, name: filename, fileId } = file;
  
  console.log(`📷 Processing file upload: ${filename}`);
  
  const pathInfo = parseFolderPath(filePath);
  
  // Only process portfolio files
  if (!pathInfo.isPortfolioFile || !pathInfo.category) {
    console.log(`⏭️ Skipping non-portfolio file: ${filePath}`);
    return;
  }
  
  try {
    // Ensure category exists
    const category = await ensureCategory(
      pathInfo.category, 
      `/${PORTFOLIO_ROOT}/${pathInfo.category}`
    );
    
    // Generate image URLs
    const urls = generateImageUrls(filePath);
    
    // Generate alt text
    const altText = `${category.name} photo ${filename.replace(/\.[^/.]+$/, '')}`;
    
    // Extract sort order from filename if available
    const sortMatch = filename.match(/(\d+)/);
    const sortOrder = sortMatch ? parseInt(sortMatch[1]) : 0;
    
    // Insert portfolio item
    const { data: portfolioItem, error } = await supabase
      .from('portfolio_items')
      .insert([{
        category_id: category.id,
        subcategory: pathInfo.subcategory,
        filename: filename,
        imagekit_file_id: fileId,
        imagekit_url: urls.original,
        thumbnail_url: urls.thumbnail,
        full_url: urls.full,
        alt_text: altText,
        sort_order: sortOrder,
        metadata: {
          file_path: filePath,
          processed_at: new Date().toISOString()
        }
      }])
      .select()
      .single();
    
    if (error) {
      console.error(`❌ Error inserting portfolio item:`, error);
      throw error;
    }
    
    console.log(`✅ Added portfolio item: ${filename} to ${category.name}`);
    
    // Update featured image if this is the first image or has a lower sort order
    if (!category.featured_image_url || sortOrder < 10) {
      await supabase
        .from('portfolio_categories')
        .update({ featured_image_url: urls.thumbnail })
        .eq('id', category.id);
    }
    
  } catch (error) {
    console.error(`❌ Error processing file upload:`, error);
    throw error;
  }
}

// Handle file deletion event
async function handleFileDelete(eventData) {
  const { file } = eventData;
  const { fileId } = file;
  
  console.log(`🗑️ Processing file deletion: ${fileId}`);
  
  try {
    // Find and delete the portfolio item
    const { data: deletedItem, error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('imagekit_file_id', fileId)
      .select()
      .single();
    
    if (error && error.code !== 'PGRST116') { // Ignore "not found" errors
      console.error(`❌ Error deleting portfolio item:`, error);
      throw error;
    }
    
    if (deletedItem) {
      console.log(`✅ Deleted portfolio item: ${deletedItem.filename}`);
      
      // Update featured image if this was the featured image
      const { data: category } = await supabase
        .from('portfolio_categories')
        .select('*')
        .eq('id', deletedItem.category_id)
        .single();
      
      if (category && category.featured_image_url === deletedItem.thumbnail_url) {
        // Find a new featured image
        const { data: newFeatured } = await supabase
          .from('portfolio_items')
          .select('thumbnail_url')
          .eq('category_id', deletedItem.category_id)
          .order('sort_order')
          .limit(1)
          .single();
        
        await supabase
          .from('portfolio_categories')
          .update({ featured_image_url: newFeatured?.thumbnail_url || null })
          .eq('id', deletedItem.category_id);
      }
    }
    
  } catch (error) {
    console.error(`❌ Error processing file deletion:`, error);
    throw error;
  }
}

// Handle folder operations (create/delete/rename)
async function handleFolderOperation(eventData, eventType) {
  const { folder } = eventData;
  const { folderPath, name: folderName } = folder;
  
  console.log(`📁 Processing folder ${eventType}: ${folderPath}`);
  
  const pathInfo = parseFolderPath(folderPath);
  
  // Only process portfolio folders
  if (!pathInfo.isPortfolioFile) {
    console.log(`⏭️ Skipping non-portfolio folder: ${folderPath}`);
    return;
  }
  
  try {
    if (eventType === 'folder.create') {
      await ensureCategory(folderName, folderPath);
    } else if (eventType === 'folder.delete') {
      // Deactivate category instead of deleting to preserve data
      const slug = generateSlug(folderName);
      await supabase
        .from('portfolio_categories')
        .update({ is_active: false })
        .eq('slug', slug);
      
      console.log(`✅ Deactivated category: ${slug}`);
    }
  } catch (error) {
    console.error(`❌ Error processing folder operation:`, error);
    throw error;
  }
}

// Main webhook handler
export default async function handler(req, res) {
  console.log('🎣 ImageKit webhook received');
  
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.IMAGEKIT_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers['x-ik-signature'];
      const payload = JSON.stringify(req.body);
      
      if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }
    
    const { type: eventType, data: eventData } = req.body;
    
    console.log(`📨 Processing event: ${eventType}`);
    
    // Process different event types
    switch (eventType) {
      case 'upload.complete':
      case 'video.upload.complete':
        await handleFileUpload(eventData);
        break;
        
      case 'file.delete':
        await handleFileDelete(eventData);
        break;
        
      case 'folder.create':
      case 'folder.delete':
        await handleFolderOperation(eventData, eventType);
        break;
        
      default:
        console.log(`⏭️ Unhandled event type: ${eventType}`);
    }
    
    res.status(200).json({ 
      success: true, 
      message: `Event ${eventType} processed successfully` 
    });
    
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
}