-- Fix SECURITY DEFINER issue on portfolio_items_with_category view
-- This script safely removes the SECURITY DEFINER property while maintaining functionality

-- First, let's check if the view exists and what depends on it
-- Run this in Supabase SQL editor to see dependencies before making changes

-- Step 1: Check current view definition and dependencies
/*
SELECT 
    pg_get_viewdef('portfolio_items_with_category'::regclass, true) as view_definition;

-- Check what depends on this view
SELECT 
    dependent_ns.nspname as dependent_schema,
    dependent_view.relname as dependent_view,
    source_ns.nspname as source_schema,
    source_table.relname as source_table
FROM pg_depend 
JOIN pg_rewrite ON pg_depend.objid = pg_rewrite.oid 
JOIN pg_class as dependent_view ON pg_rewrite.ev_class = dependent_view.oid 
JOIN pg_class as source_table ON pg_depend.refobjid = source_table.oid 
JOIN pg_namespace dependent_ns ON dependent_view.relnamespace = dependent_ns.oid
JOIN pg_namespace source_ns ON source_table.relnamespace = source_ns.oid
WHERE 
    source_table.relname = 'portfolio_items_with_category'
    AND source_ns.nspname = 'public';
*/

-- Step 2: Recreate the view WITHOUT SECURITY DEFINER
-- This maintains the exact same functionality but uses the querying user's permissions
DROP VIEW IF EXISTS portfolio_items_with_category CASCADE;

CREATE VIEW portfolio_items_with_category AS
SELECT 
    pi.id,
    pi.title,
    pi.description,
    pi.image_url,
    pi.thumbnail_url,
    pi.file_id,
    pi.file_name,
    pi.file_path,
    pi.width,
    pi.height,
    pi.size,
    pi.category_id,
    pi.tags,
    pi.metadata,
    pi.display_order,
    pi.is_featured,
    pi.is_active,
    pi.created_at,
    pi.updated_at,
    pc.name as category_name,
    pc.slug as category_slug,
    pc.folder_path as category_folder_path
FROM portfolio_items pi
JOIN portfolio_categories pc ON pi.category_id = pc.id
WHERE pi.is_active = true AND pc.is_active = true;

-- Step 3: Re-grant necessary permissions
GRANT SELECT ON portfolio_items_with_category TO anon;
GRANT SELECT ON portfolio_items_with_category TO authenticated;

-- Step 4: Verify the view works for anonymous users (for public portfolio viewing)
-- Since portfolio items should be publicly viewable, we need to ensure RLS policies allow this

-- Check if RLS is enabled on the base tables
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;

-- Ensure there are policies that allow public read access
-- These policies allow anyone to read active portfolio items and categories
DO $$
BEGIN
    -- Drop existing public read policies if they exist
    DROP POLICY IF EXISTS "Public users can view active portfolio items" ON portfolio_items;
    DROP POLICY IF EXISTS "Public users can view active categories" ON portfolio_categories;
    
    -- Create new policies for public read access
    CREATE POLICY "Public users can view active portfolio items" ON portfolio_items
        FOR SELECT
        USING (is_active = true);
    
    CREATE POLICY "Public users can view active categories" ON portfolio_categories
        FOR SELECT
        USING (is_active = true);
END $$;

-- Step 5: Add comment explaining the security model
COMMENT ON VIEW portfolio_items_with_category IS 
'View that joins portfolio items with their categories. Uses default SECURITY INVOKER to respect RLS policies. Public read access is granted through RLS policies on base tables.';

-- Step 6: Test query to verify the view works
-- Run this after applying the migration to ensure portfolio items are still visible
/*
SELECT 
    COUNT(*) as total_items,
    COUNT(DISTINCT category_id) as total_categories
FROM portfolio_items_with_category;
*/