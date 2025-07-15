const allowedOrigins = [
  'https://www.kristinmathilde.com',
  'https://kristinmathilde.com',
  'https://kristin-with-an-eye.vercel.app'
];

module.exports = async (req, res) => {
  // Set CORS headers
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Test environment variables
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY,
      FROM_EMAIL: !!process.env.FROM_EMAIL,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      NODE_ENV: process.env.NODE_ENV
    };

    // Test database connection if DATABASE_URL exists
    let dbStatus = 'not_configured';
    if (process.env.DATABASE_URL) {
      try {
        const { Pool } = require('pg');
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
        
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        await pool.end();
        dbStatus = 'connected';
      } catch (dbError) {
        console.error('Database connection test failed:', dbError);
        dbStatus = 'connection_failed';
      }
    }

    res.json({
      success: true,
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: dbStatus,
      request: {
        method: req.method,
        origin: origin,
        userAgent: req.headers['user-agent']
      }
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Test endpoint error',
      error: error.message
    });
  }
}; 