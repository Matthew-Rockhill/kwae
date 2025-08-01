-- Voucher System Database Migration
-- Creates the vouchers table for gift vouchers and NGO sponsorships

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vouchers table
CREATE TABLE IF NOT EXISTS vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voucher_code VARCHAR(20) UNIQUE NOT NULL,
    package_type VARCHAR(100) NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    
    -- Purchaser details
    purchaser_name VARCHAR(255) NOT NULL,
    purchaser_email VARCHAR(255) NOT NULL,
    purchaser_phone VARCHAR(50),
    
    -- Recipient details
    recipient_name VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(50),
    
    -- Additional details
    message TEXT,
    voucher_type VARCHAR(20) DEFAULT 'gift' CHECK (voucher_type IN ('gift', 'sponsorship')),
    status VARCHAR(20) DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'paid', 'redeemed', 'expired', 'cancelled')),
    
    -- Timestamps
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    redeemed_at TIMESTAMP WITH TIME ZONE NULL,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    ip_address INET
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(voucher_code);
CREATE INDEX IF NOT EXISTS idx_vouchers_status ON vouchers(status);
CREATE INDEX IF NOT EXISTS idx_vouchers_type ON vouchers(voucher_type);
CREATE INDEX IF NOT EXISTS idx_vouchers_purchaser_email ON vouchers(purchaser_email);
CREATE INDEX IF NOT EXISTS idx_vouchers_recipient_email ON vouchers(recipient_email);
CREATE INDEX IF NOT EXISTS idx_vouchers_expires_at ON vouchers(expires_at);
CREATE INDEX IF NOT EXISTS idx_vouchers_created_at ON vouchers(created_at);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_vouchers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_vouchers_updated_at_trigger
    BEFORE UPDATE ON vouchers
    FOR EACH ROW EXECUTE FUNCTION update_vouchers_updated_at();

-- Function to generate unique voucher codes
CREATE OR REPLACE FUNCTION generate_voucher_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- Generate a random 12-character code with format XXXX-XXXX-XXXX
        code := UPPER(
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4) || '-' ||
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4) || '-' ||
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)
        );
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM vouchers WHERE voucher_code = code) INTO exists_check;
        
        -- If code doesn't exist, return it
        IF NOT exists_check THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE 'plpgsql';

-- Enable Row Level Security (RLS)
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (limited)
CREATE POLICY "Allow public read access to own vouchers by code" ON vouchers
    FOR SELECT USING (
        voucher_code = current_setting('request.jwt.claims', true)::json->>'voucher_code'
    );

-- Create policies for service role (for webhook and admin operations)
CREATE POLICY "Allow service role full access to vouchers" ON vouchers
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create view for voucher stats (admin use)
CREATE OR REPLACE VIEW voucher_stats AS
SELECT 
    voucher_type,
    status,
    COUNT(*) as count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount
FROM vouchers
GROUP BY voucher_type, status;

-- Grant access to the view
GRANT SELECT ON voucher_stats TO anon, authenticated;

-- Insert sample data for testing (remove in production)
-- INSERT INTO vouchers (
--     voucher_code, package_type, package_name, amount,
--     purchaser_name, purchaser_email, purchaser_phone,
--     recipient_name, recipient_email, message,
--     voucher_type, status
-- ) VALUES (
--     'TEST-GIFT-0001', 'dust-light', 'Dust & Light - Mini Session', 1500.00,
--     'John Doe', 'john@example.com', '+27123456789',
--     'Jane Smith', 'jane@example.com', 'Happy Birthday!',
--     'gift', 'paid'
-- );