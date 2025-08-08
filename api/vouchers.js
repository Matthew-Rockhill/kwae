import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_SERVICE_KEY || ''
);

// Generate a unique voucher code
function generateVoucherCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const allowedOrigins = [
  'https://www.kristinmathilde.com',
  'https://kristinmathilde.com',
  'http://localhost:5173',
  'http://localhost:5174', 
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:3000'
];

export default async function handler(req, res) {
  try {
    console.log('🔍 Working Voucher API - Request method:', req.method);
    
    // Set CORS headers
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Parse request body
    let data = req.body;
    if (!data || typeof data !== 'object') {
      try {
        data = JSON.parse(req.body);
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid JSON' });
      }
    }

    const { 
      packageType, 
      voucherType, 
      purchaserName, 
      purchaserEmail, 
      recipientName, 
      recipientEmail, 
      personalMessage,
      organizationName 
    } = data || {};

    console.log('📝 Processing voucher request:', { packageType, voucherType, purchaserName });

    // Validate required fields
    if (!packageType || !voucherType || !purchaserName || !purchaserEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: packageType, voucherType, purchaserName, purchaserEmail'
      });
    }

    // Validate voucher type specific fields
    if (voucherType === 'gift' && (!recipientName || !recipientEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Gift vouchers require recipientName and recipientEmail'
      });
    }

    if (voucherType === 'sponsorship' && !organizationName) {
      return res.status(400).json({
        success: false,
        message: 'Sponsorship vouchers require organizationName'
      });
    }

    // Generate unique voucher code
    let voucherCode;
    let codeExists = true;
    let attempts = 0;
    const maxAttempts = 10;

    while (codeExists && attempts < maxAttempts) {
      voucherCode = generateVoucherCode();
      const { data: existing } = await supabase
        .from('vouchers')
        .select('id')
        .eq('voucher_code', voucherCode);
      
      codeExists = existing && existing.length > 0;
      attempts++;
    }

    if (codeExists) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate unique voucher code'
      });
    }

    // Package pricing
    const packagePricing = {
      'Family Portrait Session': { name: 'Family Portrait Session', price: 2500.00 },
      'Wedding Photography': { name: 'Wedding Photography', price: 15000.00 },
      'Lifestyle Photography': { name: 'Lifestyle Photography', price: 3500.00 },
      'NGO Storytelling': { name: 'NGO Storytelling', price: 2000.00 },
      'Brand Photography': { name: 'Brand Photography', price: 4000.00 }
    };
    
    const packageInfo = packagePricing[packageType] || { name: packageType, price: 2500.00 };

    // Insert new voucher
    const voucherData = {
      voucher_code: voucherCode,
      package_type: packageType,
      package_name: packageInfo.name,
      amount: packageInfo.price,
      voucher_type: voucherType,
      purchaser_name: purchaserName,
      purchaser_email: purchaserEmail,
      // For gift vouchers: use recipientName, for sponsorship: use organizationName
      recipient_name: voucherType === 'gift' ? recipientName : organizationName,
      recipient_email: voucherType === 'gift' ? recipientEmail : null,
      message: personalMessage || null,
      status: 'pending_payment',
      created_at: new Date().toISOString(),
      ip_address: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || null
    };

    console.log('💾 Inserting voucher data:', { voucherCode, packageType, voucherType });

    const { data: result, error } = await supabase
      .from('vouchers')
      .insert([voucherData])
      .select('id, voucher_code, created_at')
      .single();

    if (error) {
      console.error('❌ Voucher insert error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create voucher',
        error: error.message
      });
    }

    console.log(`✅ Voucher created: #${result.id} with code ${result.voucher_code}`);

    res.status(201).json({
      success: true,
      message: `${voucherType === 'sponsorship' ? 'Sponsorship' : 'Gift voucher'} created successfully!`,
      voucher: {
        id: result.id.toString(),
        voucherCode: result.voucher_code,
        packageType,
        voucherType,
        status: 'pending_payment'
      }
    });

  } catch (error) {
    console.error('❌ Working voucher handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}