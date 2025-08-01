import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

async function sendBookingEmails(bookingData) {
  const { bookingId, selectedPackage, firstName, lastName, email, phone, eventDate, additionalNotes } = bookingData;
  
  const adminEmail = {
    to: process.env.ADMIN_EMAIL || 'rockhill.kristin@gmail.com',
    from: process.env.FROM_EMAIL || 'hello@kristinmathilde.com',
    subject: `🌟 New Booking Request #${bookingId} - ${selectedPackage}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">🌟 New Booking Request #${bookingId}</h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #666; margin-top: 0;">📋 Client Details:</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Package:</strong> ${selectedPackage}</p>
          ${eventDate ? `<p><strong>Preferred Date:</strong> ${eventDate}</p>` : ''}
          ${additionalNotes ? `<p><strong>Additional Notes:</strong> ${additionalNotes}</p>` : ''}
        </div>
        
        <p style="color: #666; font-size: 14px;">
          ⏰ Submitted: ${new Date().toLocaleString()}<br>
          Remember to respond within 24-48 hours! ✨
        </p>
      </div>
    `
  };
  
  const customerEmail = {
    to: email,
    from: process.env.FROM_EMAIL || 'hello@kristinmathilde.com',
    subject: 'Booking Request Received - Kristin with an Eye 📸',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for your booking request!</h2>
        
        <p>Hi ${firstName},</p>
        
        <p>I've received your booking request for <strong>${selectedPackage}</strong> and I'm so excited to potentially work with you!</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #666; margin-top: 0;">What happens next?</h3>
          <ul>
            <li>I'll get back to you within 24-48 hours</li>
            <li>We'll discuss your vision and session details</li>
            <li>I'll send you a detailed quote and next steps</li>
          </ul>
        </div>
        
        <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Your Booking Details:</h3>
          <p><strong>Package:</strong> ${selectedPackage}</p>
          ${eventDate ? `<p><strong>Preferred Date:</strong> ${eventDate}</p>` : ''}
          <p><strong>Reference:</strong> #${bookingId}</p>
        </div>
        
        <p>Looking forward to capturing your story!</p>
        
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
    await sgMail.send(customerEmail);
    console.log(`✅ Emails sent successfully for booking #${bookingId}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
}

const allowedOrigins = [
  'https://www.kristinmathilde.com',
  'https://kristinmathilde.com',
];

const handler = async (req, res) => {
  try {
    console.log('🔍 Request method:', req.method);
    console.log('🔍 Request origin:', req.headers.origin);
    
    // Debug environment variables
    console.log('🔍 Environment check:', {
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

    const { selectedPackage, firstName, lastName, email, phone, eventDate, additionalNotes } = data || {};

    // Validate required fields
    if (!selectedPackage || !firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Check for duplicates (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: duplicates } = await supabase
      .from('bookings')
      .select('id')
      .eq('email', email)
      .eq('selected_package', selectedPackage)
      .gte('created_at', yesterday);

    if (duplicates && duplicates.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A booking with this email and package already exists within the last 24 hours.'
      });
    }

    // Insert new booking
    const bookingData = {
      selected_package: selectedPackage,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      event_date: eventDate || null,
      additional_notes: additionalNotes || null,
      submitted_at: new Date().toISOString(),
      ip_address: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || null
    };

    const { data: result, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select('id, created_at')
      .single();

    if (error) {
      console.error('❌ Insert error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to save booking',
        error: process.env.NODE_ENV !== 'production' ? error.message : undefined
      });
    }

    console.log(`✅ Booking created: #${result.id}`);

    // Send emails (don't wait for completion)
    sendBookingEmails({
      bookingId: result.id,
      selectedPackage,
      firstName,
      lastName,
      email,
      phone,
      eventDate,
      additionalNotes
    }).catch(err => console.error('Email error:', err));

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully!',
      bookingId: result.id.toString()
    });

  } catch (error) {
    console.error('❌ Handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export default handler;