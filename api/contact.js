let resend;
let supabase;

async function initServices() {
  if (!resend) {
    try {
      const { Resend } = await import('resend');
      if (process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
      }
    } catch (e) {
      console.error('Failed to load Resend:', e);
    }
  }
  
  if (!supabase) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      supabase = createClient(
        process.env.VITE_SUPABASE_URL || '',
        process.env.VITE_SUPABASE_SERVICE_KEY || ''
      );
    } catch (e) {
      console.error('Failed to load Supabase:', e);
    }
  }
}

export default async function handler(req, res) {
  console.log('📧 Contact form API called (safe version)');
  
  // Initialize services
  await initServices();
  
  console.log('Environment check:');
  console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET');
  console.log('- VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log('- Services loaded - resend:', !!resend, 'supabase:', !!supabase);
  
  // Set CORS headers
  const allowedOrigins = [
    'https://www.kristinmathilde.com',
    'https://kristinmathilde.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
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
    
    // Save to database if available
    let savedInquiry = null;
    let dbError = null;
    
    if (supabase) {
      console.log('💾 Saving contact inquiry to database...');
      const { data, error } = await supabase
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
      
      if (error) {
        dbError = error;
        console.error('❌ Database error:', error);
      } else {
        savedInquiry = data;
        console.log('✅ Contact inquiry saved to database with ID:', data.id);
      }
    } else {
      console.log('⚠️ Supabase not available, skipping database save');
    }
    
    // Try to send emails if Resend is available
    let emailSent = false;
    
    if (resend && process.env.RESEND_API_KEY) {
      const sessionTypeLabels = {
        'family': 'Family Portrait Session',
        'wedding': 'Wedding Photography',
        'lifestyle': 'Lifestyle Photography',
        'ngo': 'NGO Storytelling',
        'branding': 'Brand Photography',
        'other': 'Other'
      };
      
      const sessionTypeLabel = sessionTypeLabels[sessionType] || sessionType;
      
      try {
        console.log('📤 Attempting to send emails with Resend...');
        
        // Send notification email to admin
        const adminEmailHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">New Contact Form Inquiry</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Mobile:</strong> <a href="tel:${mobile}">${mobile}</a></p>
              <p><strong>Interest:</strong> ${sessionTypeLabel}</p>
              ${message ? `<p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
            </div>
            <p style="color: #7f8c8d; font-size: 14px;">
              ${savedInquiry ? `Database ID: ${savedInquiry.id}` : ''}<br>
              Submitted: ${new Date().toLocaleString()}
            </p>
          </div>
        `;
        
        // Send to admin
        const adminResult = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'Kristin With An Eye <hello@kristinmathilde.com>',
          to: process.env.ADMIN_EMAIL || 'rockhill.kristin@gmail.com',
          subject: `New Contact Form Inquiry - ${sessionTypeLabel}`,
          html: adminEmailHtml
        });
        
        console.log('Admin email sent:', adminResult);
        
        // Send confirmation to customer
        const customerEmailHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2c3e50; text-align: center;">Thank You for Your Inquiry!</h1>
            <p>Hi ${firstName},</p>
            <p>Thank you for reaching out about <strong>${sessionTypeLabel}</strong>! I'm excited to learn more about your vision and how we can work together to create something beautiful.</p>
            <p>I've received your message and will get back to you within 24-48 hours with more details about the next steps.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #34495e;">What happens next?</h3>
              <ul>
                <li>I'll review your inquiry and prepare some initial ideas</li>
                <li>We'll schedule a brief call or exchange messages to discuss your vision</li>
                <li>I'll provide you with package options and availability</li>
                <li>Once booked, I'll send you a detailed planning guide</li>
              </ul>
            </div>
            
            <p>In the meantime, feel free to:</p>
            <ul>
              <li>Follow my work on <a href="https://www.instagram.com/kristin_with.an.eye/">Instagram @kristin_with.an.eye</a></li>
              <li>WhatsApp me at <a href="https://wa.me/27834025563">+27 83 402 5563</a></li>
            </ul>
            
            <p>Best regards,<br>
            <strong>Kristin Mathilde</strong><br>
            Kristin With An Eye Photography</p>
          </div>
        `;
        
        const customerResult = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'Kristin With An Eye <hello@kristinmathilde.com>',
          to: email,
          subject: `Thank you for reaching out, ${firstName}!`,
          html: customerEmailHtml
        });
        
        console.log('Customer email sent:', customerResult);
        emailSent = true;
        console.log('✅ Emails sent successfully via Resend');
      } catch (emailErr) {
        console.error('⚠️ Email sending failed:', emailErr.message);
        if (emailErr.response) {
          console.error('Resend error details:', emailErr.response);
        }
      }
    } else {
      console.log('⚠️ Resend not available or not configured');
    }
    
    // Return success if data was saved or if we at least received the form
    return res.status(200).json({
      success: true,
      message: savedInquiry 
        ? 'Thank you for your message! Your inquiry has been saved.'
        : 'Thank you for your message! We received your inquiry.',
      dataSaved: !!savedInquiry,
      emailSent: emailSent
    });
    
  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to process your request. Please try again.',
      timestamp: new Date().toISOString()
    });
  }
}