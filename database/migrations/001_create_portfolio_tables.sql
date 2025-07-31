-- Portfolio Database Schema Migration
-- This creates the tables needed for the database-first portfolio system

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
CREATE TRIGGER update_portfolio_categories_updated_at 
    BEFORE UPDATE ON portfolio_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
CREATE TRIGGER update_category_image_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON portfolio_items
    FOR EACH ROW EXECUTE FUNCTION update_category_image_count();

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

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
GRANT SELECT ON portfolio_items_with_category TO anon, authenticated;do it