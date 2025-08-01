import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  console.log('📧 Contact form API called');
  
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
    const { firstName, lastName, email, mobile, sessionType, message } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !mobile || !sessionType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }
    
    console.log('📝 Processing contact form submission:', { firstName, lastName, email, sessionType });
    
    // Save to database first
    console.log('💾 Saving contact inquiry to database...');
    const { data: savedInquiry, error: dbError } = await supabase
      .from('contact_inquiries')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        mobile: mobile,
        session_type: sessionType,
        message: message || null,
        status: 'new'
      })
      .select()
      .single();
    
    if (dbError) {
      console.error('❌ Database error:', dbError);
      // Continue with email sending even if database fails
      console.log('⚠️ Continuing with email sending despite database error');
    } else {
      console.log('✅ Contact inquiry saved to database with ID:', savedInquiry.id);
    }
    
    // Prepare email content
    const sessionTypeLabels = {
      'family': 'Family Portrait Session',
      'wedding': 'Wedding Photography',
      'lifestyle': 'Lifestyle Photography',
      'ngo': 'NGO Storytelling',
      'branding': 'Brand Photography',
      'other': 'Other'
    };
    
    const sessionTypeLabel = sessionTypeLabels[sessionType] || sessionType;
    
    // Email to Kristin (notification)
    const adminEmail = {
      to: process.env.ADMIN_EMAIL || 'rockhill.kristin@gmail.com',
      from: {
        email: process.env.FROM_EMAIL || 'hello@kristinmathilde.com',
        name: 'Kristin With An Eye Website'
      },
      subject: `New Contact Form Inquiry - ${sessionTypeLabel}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafafa;">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin-bottom: 10px; font-size: 24px;">New Contact Form Inquiry</h1>
              <div style="width: 60px; height: 3px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0 auto;"></div>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h2 style="color: #34495e; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #ecf0f1; padding-bottom: 8px;">Contact Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #7f8c8d; font-weight: 600; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #2c3e50;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #7f8c8d; font-weight: 600;">Email:</td>
                  <td style="padding: 8px 0; color: #2c3e50;"><a href="mailto:${email}" style="color: #3498db; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #7f8c8d; font-weight: 600;">Mobile:</td>
                  <td style="padding: 8px 0; color: #2c3e50;"><a href="tel:${mobile}" style="color: #3498db; text-decoration: none;">${mobile}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #7f8c8d; font-weight: 600;">Interest:</td>
                  <td style="padding: 8px 0; color: #2c3e50;">${sessionTypeLabel}</td>
                </tr>
              </table>
            </div>
            
            ${message ? `
            <div style="margin-bottom: 25px;">
              <h2 style="color: #34495e; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #ecf0f1; padding-bottom: 8px;">Message</h2>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; color: #2c3e50; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
              <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
                This inquiry was submitted through your website contact form.<br>
                <strong>Response Time Goal:</strong> 24-48 hours<br>
                ${savedInquiry ? `<strong>Database ID:</strong> ${savedInquiry.id}` : '<strong>Note:</strong> Database save failed - email only'}
              </p>
            </div>
          </div>
        </div>
      `
    };
    
    // Auto-reply email to the customer
    const customerEmail = {
      to: email,
      from: {
        email: process.env.FROM_EMAIL || 'hello@kristinmathilde.com',
        name: 'Kristin Mathilde'
      },
      subject: `Thank you for reaching out, ${firstName}!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fafafa;">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin-bottom: 10px; font-size: 24px;">Thank You for Your Inquiry!</h1>
              <div style="width: 60px; height: 3px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0 auto;"></div>
            </div>
            
            <div style="margin-bottom: 25px;">
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hi ${firstName},
              </p>
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Thank you for reaching out about <strong>${sessionTypeLabel}</strong>! I'm excited to learn more about your vision and how we can work together to create something beautiful.
              </p>
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                I've received your message and will get back to you within 24-48 hours with more details about the next steps. In the meantime, feel free to check out my recent work on Instagram or browse through my portfolio.
              </p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #667eea;">
              <h3 style="color: #34495e; font-size: 16px; margin-bottom: 10px;">What happens next?</h3>
              <ul style="color: #2c3e50; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>I'll review your inquiry and prepare some initial ideas</li>
                <li>We'll schedule a brief call or exchange messages to discuss your vision</li>
                <li>I'll provide you with package options and availability</li>
                <li>Once booked, I'll send you a detailed planning guide</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-bottom: 25px;">
              <p style="color: #7f8c8d; font-size: 14px; margin-bottom: 15px;">In the meantime, connect with me:</p>
              <div style="display: inline-block;">
                <a href="https://www.instagram.com/kristin_with.an.eye/" style="display: inline-block; margin: 0 10px; padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; font-size: 14px;">
                  Follow on Instagram
                </a>
                <a href="https://wa.me/27834025563" style="display: inline-block; margin: 0 10px; padding: 10px 20px; background: #25D366; color: white; text-decoration: none; border-radius: 25px; font-size: 14px;">
                  WhatsApp Me
                </a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
              <p style="color: #7f8c8d; font-size: 12px; margin: 0;">
                Best regards,<br>
                <strong>Kristin Mathilde</strong><br>
                Kristin With An Eye Photography<br>
                <a href="mailto:rockhill.kristin@gmail.com" style="color: #3498db;">rockhill.kristin@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      `
    };
    
    // Send both emails
    console.log('📤 Sending emails...');
    await Promise.all([
      sgMail.send(adminEmail),
      sgMail.send(customerEmail)
    ]);
    
    console.log('✅ Contact form emails sent successfully');
    
    return res.status(200).json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you within 24-48 hours.'
    });
    
  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    // Handle SendGrid specific errors
    if (error.response && error.response.body) {
      console.error('SendGrid error details:', error.response.body);
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again or contact me directly.',
      timestamp: new Date().toISOString()
    });
  }
}