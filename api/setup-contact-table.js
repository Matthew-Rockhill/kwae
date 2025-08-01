import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  console.log('🔧 Setting up contact inquiries table...');
  
  // Set CORS headers
  const allowedOrigins = [
    'https://www.kristinmathilde.com',
    'https://kristinmathilde.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Create contact_inquiries table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        mobile VARCHAR(50) NOT NULL,
        session_type VARCHAR(50) NOT NULL,
        message TEXT,
        status VARCHAR(20) DEFAULT 'new',
        admin_notes TEXT,
        responded_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    console.log('📋 Creating contact_inquiries table...');
    const { error: createError } = await supabase.rpc('exec_sql', { 
      sql: createTableQuery 
    });
    
    if (createError) {
      console.error('❌ Error creating table:', createError);
      throw createError;
    }
    
    // Create RLS policies
    console.log('🔐 Setting up Row Level Security...');
    
    // Enable RLS
    const enableRLSQuery = `ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;`;
    const { error: rlsError } = await supabase.rpc('exec_sql', { 
      sql: enableRLSQuery 
    });
    
    if (rlsError) {
      console.error('❌ Error enabling RLS:', rlsError);
      throw rlsError;
    }
    
    // Create policy for service role (full access)
    const serviceRolePolicyQuery = `
      CREATE POLICY IF NOT EXISTS "Service role can manage all contact inquiries"
      ON contact_inquiries
      FOR ALL 
      TO service_role
      USING (true)
      WITH CHECK (true);
    `;
    
    const { error: policyError } = await supabase.rpc('exec_sql', { 
      sql: serviceRolePolicyQuery 
    });
    
    if (policyError) {
      console.error('❌ Error creating policy:', policyError);
      throw policyError;
    }
    
    // Create index for better query performance
    console.log('⚡ Creating indexes...');
    const createIndexQuery = `
      CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
      CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);
    `;
    
    const { error: indexError } = await supabase.rpc('exec_sql', { 
      sql: createIndexQuery 
    });
    
    if (indexError) {
      console.error('❌ Error creating indexes:', indexError);
      throw indexError;
    }
    
    // Create updated_at trigger function
    console.log('⏰ Setting up timestamp triggers...');
    const triggerFunctionQuery = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;
    
    const { error: functionError } = await supabase.rpc('exec_sql', { 
      sql: triggerFunctionQuery 
    });
    
    if (functionError) {
      console.error('❌ Error creating trigger function:', functionError);
      throw functionError;
    }
    
    // Create trigger
    const triggerQuery = `
      DROP TRIGGER IF EXISTS update_contact_inquiries_updated_at ON contact_inquiries;
      CREATE TRIGGER update_contact_inquiries_updated_at
        BEFORE UPDATE ON contact_inquiries
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;
    
    const { error: triggerError } = await supabase.rpc('exec_sql', { 
      sql: triggerQuery 
    });
    
    if (triggerError) {
      console.error('❌ Error creating trigger:', triggerError);
      throw triggerError;
    }
    
    console.log('✅ Contact inquiries table setup completed successfully');
    
    return res.status(200).json({
      success: true,
      message: 'Contact inquiries table created successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Setup error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}