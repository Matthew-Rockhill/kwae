import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

const CREATE_TABLES_SQL = `
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Portfolio categories table
CREATE TABLE IF NOT EXISTS portfolio_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    folder_path VARCHAR(500) UNIQUE NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    image_count INTEGER DEFAULT 0,
    featured_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio items table
CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES portfolio_categories(id) ON DELETE CASCADE,
    subcategory VARCHAR(255),
    filename VARCHAR(500) NOT NULL,
    imagekit_file_id VARCHAR(255) UNIQUE NOT NULL,
    imagekit_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    full_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_categories_slug ON portfolio_categories(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_categories_active ON portfolio_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_portfolio_categories_sort ON portfolio_categories(sort_order);

CREATE INDEX IF NOT EXISTS idx_portfolio_items_category ON portfolio_items(category_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_subcategory ON portfolio_items(subcategory);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_active ON portfolio_items(is_active);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_sort ON portfolio_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_imagekit_id ON portfolio_items(imagekit_file_id);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_portfolio_categories_updated_at ON portfolio_categories;
CREATE TRIGGER update_portfolio_categories_updated_at 
    BEFORE UPDATE ON portfolio_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON portfolio_items;
CREATE TRIGGER update_portfolio_items_updated_at 
    BEFORE UPDATE ON portfolio_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update image count when items are added/removed
CREATE OR REPLACE FUNCTION update_category_image_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE portfolio_categories 
        SET image_count = image_count + 1
        WHERE id = NEW.category_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE portfolio_categories 
        SET image_count = image_count - 1
        WHERE id = OLD.category_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- If category changed, update both old and new
        IF OLD.category_id != NEW.category_id THEN
            UPDATE portfolio_categories 
            SET image_count = image_count - 1
            WHERE id = OLD.category_id;
            
            UPDATE portfolio_categories 
            SET image_count = image_count + 1
            WHERE id = NEW.category_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to automatically update image counts
DROP TRIGGER IF EXISTS update_category_image_count_trigger ON portfolio_items;
CREATE TRIGGER update_category_image_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON portfolio_items
    FOR EACH ROW EXECUTE FUNCTION update_category_image_count();

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to active categories" ON portfolio_categories;
DROP POLICY IF EXISTS "Allow public read access to active portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Allow service role full access to categories" ON portfolio_categories;
DROP POLICY IF EXISTS "Allow service role full access to portfolio items" ON portfolio_items;

-- Create policies for public read access
CREATE POLICY "Allow public read access to active categories" ON portfolio_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to active portfolio items" ON portfolio_items
    FOR SELECT USING (is_active = true);

-- Create policies for service role (for webhook and admin operations)
CREATE POLICY "Allow service role full access to categories" ON portfolio_categories
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role full access to portfolio items" ON portfolio_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create view for portfolio items with category information
CREATE OR REPLACE VIEW portfolio_items_with_category AS
SELECT 
    pi.*,
    pc.name as category_name,
    pc.slug as category_slug,
    pc.folder_path as category_folder_path
FROM portfolio_items pi
JOIN portfolio_categories pc ON pi.category_id = pc.id
WHERE pi.is_active = true AND pc.is_active = true;

-- Grant access to the view
GRANT SELECT ON portfolio_items_with_category TO anon, authenticated;
`;

async function setupDatabase() {
  console.log('🗄️ Setting up portfolio database schema...');
  
  try {
    // Execute the SQL to create tables and setup
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: CREATE_TABLES_SQL 
    });
    
    if (error) {
      // If rpc doesn't work, try direct SQL execution
      console.log('⚠️ RPC failed, trying direct SQL execution...');
      
      // Split SQL into individual statements and execute them
      const statements = CREATE_TABLES_SQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      for (const statement of statements) {
        if (statement.includes('--') && !statement.includes('CREATE')) continue;
        
        try {
          const { error: stmtError } = await supabase.rpc('exec_sql', {
            sql_query: statement + ';'
          });
          
          if (stmtError) {
            console.warn(`⚠️ Statement warning: ${stmtError.message}`);
          }
        } catch (e) {
          console.warn(`⚠️ Statement execution issue: ${e.message}`);
        }
      }
    }
    
    // Verify tables were created
    const { data: tables, error: tablesError } = await supabase
      .from('portfolio_categories')
      .select('count', { count: 'exact', head: true });
    
    if (tablesError) {
      throw new Error(`Database setup verification failed: ${tablesError.message}`);
    }
    
    console.log('✅ Database schema setup completed successfully');
    
    return {
      success: true,
      message: 'Database schema created successfully',
      tables: ['portfolio_categories', 'portfolio_items', 'portfolio_items_with_category']
    };
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

// API endpoint handler
export default async function handler(req, res) {
  console.log('🔧 Database setup API called');
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Basic auth check
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.MIGRATION_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const result = await setupDatabase();
    
    res.status(200).json({
      success: true,
      message: 'Database setup completed successfully',
      ...result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Database setup API error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}