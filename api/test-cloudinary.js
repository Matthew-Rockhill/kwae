// Simple test to check Cloudinary connection
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
      // Test credentials
      const CLOUD_NAME = 'dqhvcjoor';
      console.log('Testing with cloud name:', CLOUD_NAME);
      
      // First, try the simplest possible request - just get any images without authentication
      const simpleUrl = `https://res.cloudinary.com/dqhvcjoor/image/list/sample.json`;
      
      console.log('Trying simple URL:', simpleUrl);
      
      const simpleResponse = await fetch(simpleUrl);
      console.log('Simple response status:', simpleResponse.status);
      
      if (simpleResponse.ok) {
        const data = await simpleResponse.json();
        return res.status(200).json({
          success: true,
          method: 'simple_list',
          message: 'Basic Cloudinary connection works',
          sampleData: data
        });
      }
      
      // If that fails, try the admin API
      const API_KEY = '857256826466323';
      const API_SECRET = '5v9Jr2YYlzI_2fCQLO7NpajXxR4';
      
      const timestamp = Math.round(Date.now() / 1000);
      
      // Minimal params for testing
      const params = {
        timestamp: timestamp,
        max_results: 10
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
      
      console.log('Generated signature for params:', sortedParams);
      
      const formData = new URLSearchParams({
        ...params,
        api_key: API_KEY,
        signature: signature
      });
      
      const adminUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`;
      console.log('Trying admin URL:', adminUrl);
      
      const adminResponse = await fetch(adminUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
      
      console.log('Admin response status:', adminResponse.status);
      const responseText = await adminResponse.text();
      console.log('Admin response text:', responseText.substring(0, 500));
      
      if (adminResponse.ok) {
        const data = JSON.parse(responseText);
        return res.status(200).json({
          success: true,
          method: 'admin_api',
          message: 'Admin API connection works',
          totalImages: data.resources?.length || 0,
          firstFewImages: data.resources?.slice(0, 3)?.map(img => ({
            public_id: img.public_id,
            folder: img.folder,
            url: img.secure_url
          })) || []
        });
      }
      
      // If both fail, return debug info
      return res.status(500).json({
        success: false,
        error: 'Both simple and admin API failed',
        simpleStatus: simpleResponse.status,
        adminStatus: adminResponse.status,
        adminResponsePreview: responseText.substring(0, 200)
      });
  
    } catch (error) {
      console.error('Test error:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message,
        stack: error.stack
      });
    }
  }