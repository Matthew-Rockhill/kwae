-- Add organization_name column to vouchers table
-- This supports the sponsorship voucher functionality where organizations need a separate field

-- Add the organization_name column
ALTER TABLE vouchers 
ADD COLUMN IF NOT EXISTS organization_name VARCHAR(255);

-- Add index for organization_name for better query performance
CREATE INDEX IF NOT EXISTS idx_vouchers_organization_name ON vouchers(organization_name);

-- Add comment to clarify the field usage
COMMENT ON COLUMN vouchers.organization_name IS 'Organization name for sponsorship vouchers (separate from recipient_name)';

-- Success notification
DO $$
BEGIN
    RAISE NOTICE '✅ Added organization_name column to vouchers table';
    RAISE NOTICE '🏢 Sponsorship vouchers now have dedicated organization_name field';
    RAISE NOTICE '🔍 Added index for better query performance';
END $$;