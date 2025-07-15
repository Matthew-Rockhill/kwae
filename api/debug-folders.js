// Debug API to see your Cloudinary folder structure
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
  
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    try {
      // Cloudinary credentials
      const CLOUD_NAME = 'dqhvcjoor';
      const API_KEY = '857256826466323';
      const API_SECRET = '5v9Jr2YYlzI_2fCQLO7NpajXxR4';
      
      const timestamp = Math.round(Date.now() / 1000);
      
      // Get ALL images to see folder structure
      const params = {
        type: 'upload',
        max_results: 500, // Get more to see all folders
        timestamp: timestamp
      };
      
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
      
      const formData = new URLSearchParams({
        ...params,
        api_key: API_KEY,
        signature: signature
      });
      
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`;
      
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
  
      if (!response.ok) {
        throw new Error(`Cloudinary API error: ${response.status}`);
      }
  
      const result = await response.json();
      
      // Extract unique folders
      const folders = new Set();
      const sampleImages = {};
      
      result.resources.forEach(img => {
        if (img.folder) {
          folders.add(img.folder);
          if (!sampleImages[img.folder]) {
            sampleImages[img.folder] = [];
          }
          if (sampleImages[img.folder].length < 3) {
            sampleImages[img.folder].push({
              public_id: img.public_id,
              url: img.secure_url
            });
          }
        } else {
          folders.add('root');
          if (!sampleImages['root']) {
            sampleImages['root'] = [];
          }
          if (sampleImages['root'].length < 3) {
            sampleImages['root'].push({
              public_id: img.public_id,
              url: img.secure_url
            });
          }
        }
      });
  
      const folderList = Array.from(folders).sort();
      
      res.status(200).json({
        success: true,
        totalImages: result.resources.length,
        folders: folderList,
        sampleImages: sampleImages,
        message: `Found ${folderList.length} folders with ${result.resources.length} total images`
      });
  
    } catch (error) {
      console.error('Debug API error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }