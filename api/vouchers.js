import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
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

async function sendVoucherEmails(voucherData) {
  const { 
    voucherId, 
    voucherCode, 
    packageType, 
    voucherType, 
    purchaserName, 
    purchaserEmail, 
    recipientName, 
    recipientEmail, 
    personalMessage,
    organizationName 
  } = voucherData;
  
  // Admin notification email
  const adminEmail = {
    to: process.env.ADMIN_EMAIL || 'rockhill.kristin@gmail.com',
    from: process.env.FROM_EMAIL || 'hello@kristinmathilde.com',
    subject: `🎁 New ${voucherType === 'sponsorship' ? 'Sponsorship' : 'Gift Voucher'} Request #${voucherId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">🎁 New ${voucherType === 'sponsorship' ? 'Sponsorship' : 'Gift Voucher'} Request #${voucherId}</h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #666; margin-top: 0;">📋 ${voucherType === 'sponsorship' ? 'Sponsor' : 'Purchaser'} Details:</h3>
          <p><strong>Name:</strong> ${purchaserName}</p>
          <p><strong>Email:</strong> ${purchaserEmail}</p>
          <p><strong>Package:</strong> ${packageType}</p>
          <p><strong>Voucher Code:</strong> <code style="background: #e8f4f8; padding: 2px 6px; border-radius: 4px;">${voucherCode}</code></p>
          
          ${voucherType === 'sponsorship' 
            ? `<p><strong>Organization:</strong> ${organizationName}</p>`
            : `
              <p><strong>Recipient Name:</strong> ${recipientName}</p>
              <p><strong>Recipient Email:</strong> ${recipientEmail}</p>
            `
          }
          
          ${personalMessage ? `<p><strong>Personal Message:</strong> ${personalMessage}</p>` : ''}
        </div>
        
        <div style="background: #ffe4e1; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #d63384;"><strong>⚠️ Action Required:</strong> Send payment link to ${purchaserEmail}</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          ⏰ Submitted: ${new Date().toLocaleString()}<br>
          💳 Payment Status: Pending (Manual payment link required)
        </p>
      </div>
    `
  };
  
  // Purchaser confirmation email
  const purchaserEmail = {
    to: purchaserEmail,
    from: process.env.FROM_EMAIL || 'hello@kristinmathilde.com',
    subject: `${voucherType === 'sponsorship' ? 'Sponsorship' : 'Gift Voucher'} Request Received - Kristin with an Eye 🎁`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for your ${voucherType === 'sponsorship' ? 'sponsorship' : 'gift voucher'} request!</h2>
        
        <p>Hi ${purchaserName},</p>
        
        <p>${voucherType === 'sponsorship' 
          ? `Thank you for choosing to sponsor an organization for a ${packageType} session. Your generosity will make a meaningful impact!`
          : `Thank you for purchasing a gift voucher for ${packageType}! What a wonderful gift to give someone special.`
        }</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #666; margin-top: 0;">What happens next?</h3>
          <ul>
            <li>I'll send you a secure payment link within 24 hours</li>
            <li>Once payment is confirmed, ${voucherType === 'sponsorship' ? 'the organization will be notified of your sponsorship' : 'your voucher will be activated and ready to use'}</li>
            <li>${voucherType === 'gift' ? 'You can share the voucher details with your recipient' : 'The organization can book their session using the voucher code'}</li>
          </ul>
        </div>
        
        <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">${voucherType === 'sponsorship' ? 'Sponsorship' : 'Voucher'} Details:</h3>
          <p><strong>Package:</strong> ${packageType}</p>
          <p><strong>Code:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px; border: 1px solid #ddd;">${voucherCode}</code></p>
          ${voucherType === 'sponsorship' 
            ? `<p><strong>Organization:</strong> ${organizationName}</p>`
            : `<p><strong>Recipient:</strong> ${recipientName}</p>`
          }
          <p><strong>Reference:</strong> #${voucherId}</p>
        </div>
        
        <p>I'm excited to work with ${voucherType === 'sponsorship' ? organizationName : recipientName} to capture their story!</p>
        
        <p>With warmth,<br>
        Kristin ✨</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Kristin with an Eye<br>
          Photography & Visual Storytelling<br>
          Cape Town, South Africa
        </p>
      </div>
    `
  };
  
  try {
    await sgMail.send(adminEmail);
    await sgMail.send(purchaserEmail);
    console.log(`✅ Voucher emails sent successfully for voucher #${voucherId}`);
  } catch (error) {
    console.error('❌ Voucher email sending failed:', error);
  }
}

const allowedOrigins = [
  'https://www.kristinmathilde.com',
  'https://kristinmathilde.com',
];

const handler = async (req, res) => {
  try {
    console.log('🔍 Voucher API - Request method:', req.method);
    console.log('🔍 Voucher API - Request origin:', req.headers.origin);
    
    // Debug environment variables
    console.log('🔍 Voucher API - Environment check:', {
      VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_SERVICE_KEY: !!process.env.VITE_SUPABASE_SERVICE_KEY,
      SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY,
      FROM_EMAIL: !!process.env.FROM_EMAIL,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL
    });

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

    // Validate voucher type
    if (!['gift', 'sponsorship'].includes(voucherType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid voucher type. Must be "gift" or "sponsorship"'
      });
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(purchaserEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid purchaser email format' });
    }

    if (voucherType === 'gift' && !emailRegex.test(recipientEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid recipient email format' });
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

    // Insert new voucher
    const voucherData = {
      voucher_code: voucherCode,
      package_type: packageType,
      voucher_type: voucherType,
      purchaser_name: purchaserName,
      purchaser_email: purchaserEmail,
      recipient_name: voucherType === 'gift' ? recipientName : null,
      recipient_email: voucherType === 'gift' ? recipientEmail : null,
      organization_name: voucherType === 'sponsorship' ? organizationName : null,
      personal_message: personalMessage || null,
      status: 'pending_payment',
      created_at: new Date().toISOString(),
      ip_address: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || null
    };

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
        error: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }

    console.log(`✅ Voucher created: #${result.id} with code ${result.voucher_code}`);

    // Send emails (don't wait for completion)
    sendVoucherEmails({
      voucherId: result.id,
      voucherCode: result.voucher_code,
      packageType,
      voucherType,
      purchaserName,
      purchaserEmail,
      recipientName: voucherType === 'gift' ? recipientName : null,
      recipientEmail: voucherType === 'gift' ? recipientEmail : null,
      organizationName: voucherType === 'sponsorship' ? organizationName : null,
      personalMessage
    }).catch(err => console.error('Voucher email error:', err));

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
    console.error('❌ Voucher handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export default handler;