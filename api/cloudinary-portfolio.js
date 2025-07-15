import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqhvcjoor',
  api_key: process.env.CLOUDINARY_API_KEY || '857256826466323',
  api_secret: process.env.CLOUDINARY_API_SECRET || '5v9Jr2YYlzI_2fCQLO7NpajXxR4',
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { folder = '' } = req.query;
    
    console.log(`Fetching images from Cloudinary folder: "${folder}"`);
    
    // Build the search parameters
    const searchParams = {
      type: 'upload',
      max_results: 100,
      sort_by: [['created_at', 'desc']],
      resource_type: 'image'
    };

    // Add folder prefix if specified
    if (folder && folder.trim() !== '') {
      searchParams.prefix = folder.trim();
    }

    const result = await cloudinary.api.resources(searchParams);

    console.log(`Found ${result.resources.length} images in folder "${folder}"`);

    // Transform and return the images
    const images = result.resources.map(img => ({
      url: img.secure_url,
      public_id: img.public_id,
      folder: img.folder || '',
      width: img.width,
      height: img.height,
      format: img.format,
      created_at: img.created_at
    }));

    res.status(200).json({
      success: true,
      images,
      total: images.length,
      folder: folder || 'root'
    });

  } catch (error) {
    console.error('Cloudinary API error:', error);
    
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to fetch images from Cloudinary',
      folder: req.query.folder || 'unknown'
    });
  }
}