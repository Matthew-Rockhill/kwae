// Fixed Cloudinary API with correct endpoint
export default async function handler(req, res) {
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
      
      console.log(`📁 Fetching images from folder: "${folder}"`);
      
      // Your Cloudinary credentials
      const CLOUD_NAME = 'dqhvcjoor';
      const API_KEY = '857256826466323';
      const API_SECRET = '5v9Jr2YYlzI_2fCQLO7NpajXxR4';
      
      // Try a different approach - use the search API instead of resources
      const timestamp = Math.round(Date.now() / 1000);
      
      // Build search expression
      let searchExpression = 'resource_type:image';
      if (folder && folder.trim() !== '') {
        searchExpression += ` AND folder:${folder.trim()}`;
      }
      
      const params = {
        expression: searchExpression,
        max_results: 100,
        sort_by: [['created_at', 'desc']],
        timestamp: timestamp
      };
      
      // Create signature for search API
      const crypto = await import('crypto');
      const sortedParams = Object.keys(params)
        .sort()
        .map(key => {
          const value = Array.isArray(params[key]) ? JSON.stringify(params[key]) : params[key];
          return `${key}=${value}`;
        })
        .join('&');
      
      const signature = crypto
        .createHash('sha1')
        .update(sortedParams + API_SECRET)
        .digest('hex');
      
      const formData = new URLSearchParams({
        expression: params.expression,
        max_results: params.max_results,
        sort_by: JSON.stringify(params.sort_by),
        timestamp: params.timestamp,
        api_key: API_KEY,
        signature: signature
      });
      
      // Use the search endpoint instead
      const searchUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`;
      
      console.log(`🔍 Using search API: ${searchUrl}`);
      console.log(`🔍 Search expression: ${searchExpression}`);
      
      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
  
      console.log(`📡 Response status: ${response.status}`);
      
      const responseText = await response.text();
      console.log(`📄 Response preview: ${responseText.substring(0, 200)}`);
  
      if (!response.ok) {
        throw new Error(`Cloudinary search API error: ${response.status} - ${responseText.substring(0, 200)}`);
      }
  
      const result = JSON.parse(responseText);
      
      console.log(`✅ Found ${result.total_count || 0} images`);
  
      // Transform search results
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
        total: result.total_count || images.length,
        folder: folder || 'all'
      });
  
    } catch (error) {
      console.error('❌ API error:', error);
      
      res.status(500).json({ 
        success: false,
        error: error.message,
        folder: req.query.folder || 'unknown'
      });
    }
  }