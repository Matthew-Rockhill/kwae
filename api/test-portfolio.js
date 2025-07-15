// Simple test API handler
export default function handler(req, res) {
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
  
    const { folder = '' } = req.query;
  
    // Return test data
    const testImages = [
      {
        url: 'https://via.placeholder.com/800x600/ff7f7f/333333?text=Test+Image+1',
        public_id: `${folder}/test-image-1`,
        folder: folder,
        width: 800,
        height: 600,
        format: 'jpg'
      },
      {
        url: 'https://via.placeholder.com/800x600/7f7fff/333333?text=Test+Image+2',
        public_id: `${folder}/test-image-2`,
        folder: folder,
        width: 800,
        height: 600,
        format: 'jpg'
      },
      {
        url: 'https://via.placeholder.com/800x600/7fff7f/333333?text=Test+Image+3',
        public_id: `${folder}/test-image-3`,
        folder: folder,
        width: 800,
        height: 600,
        format: 'jpg'
      }
    ];
  
    res.status(200).json({
      success: true,
      images: testImages,
      total: testImages.length,
      folder: folder || 'root'
    });
  }