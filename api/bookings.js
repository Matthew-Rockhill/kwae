const { Pool } = require('pg');
const sgMail = require('@sendgrid/mail');

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Rate limiting helper (simple in-memory store for serverless)
const rateLimitStore = new Map();

function checkRateLimit(ip, limit = 5, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  
  const requests = rateLimitStore.get(ip).filter(time => time > windowStart);
  rateLimitStore.set(ip, requests);
  
  if (requests.length >= limit) {
    return false;
  }
  
  requests.push(now);
  return true;
}

async function sendBookingEmails(bookingData) {
  const { bookingId, selectedPackage, firstName, lastName, email, phone, eventDate, additionalNotes } = bookingData;
  
  // Admin notification email
  const adminEmail = {
    to: process.env.ADMIN_EMAIL || 'hello@kristinmathilde.com',
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
  
  // Customer confirmation email
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
    throw error;
  }
}

const allowedOrigins = [
  'https://kristin-with-an-eye.vercel.app',
  'https://www.kristinmathilde.com'
];

module.exports = async (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // res.setHeader('Access-Control-Allow-Credentials', 'true'); // Uncomment if needed

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }
  
  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({
      success: false,
      message: 'Too many booking requests. Please try again in an hour.'
    });
  }
  
  const client = await pool.connect();
  
  try {
    const {
      selectedPackage,
      firstName,
      lastName,
      email,
      phone,
      eventDate,
      additionalNotes,
      submittedAt
    } = req.body;

    // Validate required fields
    if (!selectedPackage || !firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: selectedPackage, firstName, lastName, email, phone'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check for duplicate bookings (same email + package within 24 hours)
    const duplicateCheck = await client.query(`
      SELECT id FROM bookings 
      WHERE email = $1 AND selected_package = $2 
      AND created_at > NOW() - INTERVAL '24 hours'
    `, [email, selectedPackage]);

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A booking with this email and package already exists within the last 24 hours.'
      });
    }

    // Insert booking into database
    const insertQuery = `
      INSERT INTO bookings (
        selected_package, first_name, last_name, email, phone, 
        event_date, additional_notes, submitted_at, ip_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, created_at
    `;

    const values = [
      selectedPackage,
      firstName,
      lastName,
      email,
      phone,
      eventDate || null,
      additionalNotes || null,
      submittedAt,
      clientIP
    ];

    const result = await client.query(insertQuery, values);
    const bookingId = result.rows[0].id;
    const createdAt = result.rows[0].created_at;

    console.log(`📅 New booking received: #${bookingId} from ${firstName} ${lastName}`);

    // Send emails asynchronously (don't wait for completion)
    console.log('🔄 Starting email sending process...');
    sendBookingEmails({
      bookingId,
      selectedPackage,
      firstName,
      lastName,
      email,
      phone,
      eventDate,
      additionalNotes,
      createdAt
    }).catch(error => {
      console.error('❌ Email sending failed:', error);
      console.error('Error details:', error.response?.body || error.message);
    });

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully!',
      bookingId: bookingId.toString()
    });

  } catch (error) {
    console.error('Booking submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  } finally {
    client.release();
  }
}; 