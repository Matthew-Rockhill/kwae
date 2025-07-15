// Simple check to see what's actually in your Cloudinary
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
  
    try {
      // Parse CLOUDINARY_URL environment variable
      const cloudinaryUrl = process.env.CLOUDINARY_URL;
      if (!cloudinaryUrl) {
        return res.status(500).json({ error: 'CLOUDINARY_URL not set' });
      }
      
      const url = new URL(cloudinaryUrl);
      const CLOUD_NAME = url.hostname;
      const API_KEY = url.username;
      const API_SECRET = url.password;
      
      // Simple request to get ALL images (no folder filter)
      const timestamp = Math.round(Date.now() / 1000);
      
      const params = {
        expression: 'resource_type:image',
        max_results: 100,
        timestamp: timestamp
      };
      
      const crypto = await import('crypto');
      const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
      
      const signature = crypto
        .createHash('sha1')
        .update(sortedParams + API_SECRET)
        .digest('hex');
      
      const formData = new URLSearchParams({
        expression: params.expression,
        max_results: params.max_results,
        timestamp: params.timestamp,
        api_key: API_KEY,
        signature: signature
      });
      
      const searchUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`;
      
      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
          error: `Cloudinary error: ${response.status}`,
          details: errorText
        });
      }
  
      const result = await response.json();
      
      // Extract unique folders and organize by folder
      const folderData = {};
      
      (result.resources || []).forEach(img => {
        const folder = img.folder || '(root)';
        
        if (!folderData[folder]) {
          folderData[folder] = {
            count: 0,
            samples: []
          };
        }
        
        folderData[folder].count++;
        
        if (folderData[folder].samples.length < 3) {
          folderData[folder].samples.push({
            public_id: img.public_id,
            url: img.secure_url
          });
        }
      });
  
      res.status(200).json({
        success: true,
        totalImages: result.total_count || 0,
        cloudName: CLOUD_NAME,
        folders: Object.keys(folderData).sort(),
        folderDetails: folderData,
        lookingFor: [
          'family',
          'branding', 
          'NGO-storytelling',
          'lifestyle/rockpooling',
          'lifestyle/events',
          'lifestyle/traditional-wedding'
        ]
      });
  
    } catch (error) {
      res.status(500).json({ 
        error: error.message,
        stack: error.stack
      });
    }
  }
  