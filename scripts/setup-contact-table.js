import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY
);

async function setupContactTable() {
  console.log('🔧 Setting up contact inquiries table...');
  
  try {
    // Create contact_inquiries table using direct SQL
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .limit(1);
    
    if (error && error.message.includes('does not exist')) {
      console.log('📋 Table does not exist, creating it now...');
      
      // Since we can't run raw SQL directly, let's create the table using Supabase Dashboard SQL editor
      // For now, let's create a simple version using the Supabase client
      console.log('\n⚠️  Please run the following SQL in your Supabase Dashboard SQL Editor:\n');
      
      const createTableSQL = `
-- Create contact_inquiries table
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

-- Enable Row Level Security
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (full access)
CREATE POLICY "Service role can manage all contact inquiries"
ON contact_inquiries
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_contact_inquiries_updated_at ON contact_inquiries;
CREATE TRIGGER update_contact_inquiries_updated_at
  BEFORE UPDATE ON contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
`;
      
      console.log(createTableSQL);
      console.log('\n✅ Copy and paste the above SQL into your Supabase Dashboard at:');
      console.log('   https://supabase.com/dashboard/project/xeeqjvjhnrdeknkwstqb/sql/new');
      
    } else if (error) {
      console.error('❌ Error checking table:', error);
    } else {
      console.log('✅ Table already exists!');
    }
    
  } catch (error) {
    console.error('❌ Setup error:', error);
  }
}

setupContactTable();