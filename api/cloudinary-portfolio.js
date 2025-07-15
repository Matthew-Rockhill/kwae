// Working Cloudinary API for Vercel
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
  
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { folder = '' } = req.query;
      
      console.log(`📁 Fetching images from Cloudinary folder: "${folder}"`);
      
      // Cloudinary credentials
      const CLOUD_NAME = 'dqhvcjoor';
      const API_KEY = '857256826466323';
      const API_SECRET = '5v9Jr2YYlzI_2fCQLO7NpajXxR4';
      
      // Create timestamp for signature
      const timestamp = Math.round(Date.now() / 1000);
      
      // Prepare parameters
      const params = {
        type: 'upload',
        max_results: 100,
        timestamp: timestamp
      };
      
      // Add folder prefix if specified
      if (folder && folder.trim() !== '') {
        params.prefix = folder.trim();
      }
      
      // Create signature
      const crypto = await import('crypto');
      const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
      
      const signature = crypto
        .createHash('sha1')
        .update(sortedParams + API_SECRET)
        .digest('hex');
      
      // Build form data
      const formData = new URLSearchParams({
        ...params,
        api_key: API_KEY,
        signature: signature
      });
      
      // Make request to Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`;
      
      console.log(`🌐 Making request to: ${cloudinaryUrl}`);
      
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Cloudinary API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Cloudinary API error: ${response.status} ${response.statusText}`);
      }
  
      const result = await response.json();
      
      console.log(`✅ Found ${result.resources?.length || 0} images in folder "${folder}"`);
  
      // Transform and return the images
      const images = (result.resources || []).map(img => ({
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
      console.error('❌ API error:', error);
      
      res.status(500).json({ 
        success: false,
        error: error.message || 'Failed to fetch images from Cloudinary',
        folder: req.query.folder || 'unknown'
      });
    }
  }