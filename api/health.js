const allowedOrigins = [
  'https://kristin-with-an-eye.vercel.app',
  'https://www.kristinmathilde.com'
];

module.exports = async (req, res) => {
  // Set CORS headers FIRST - before any other logic
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // res.setHeader('Access-Control-Allow-Credentials', 'true'); // Uncomment if needed

  // Handle preflight requests FIRST
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }
  
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}; 