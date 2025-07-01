const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const sgMail = require('@sendgrid/mail');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Booking-specific rate limiting (stricter)
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 booking submissions per hour
  message: 'Too many booking requests. Please try again in an hour.'
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Database connected successfully');
  }
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Submit a new booking
app.post('/api/bookings', bookingLimiter, async (req, res) => {
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
      req.ip
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
});

// Get all bookings (admin only)
app.get('/api/bookings', async (req, res) => {
  try {
    // Simple authentication check (you should implement proper auth)
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const result = await pool.query(`
      SELECT 
        id, selected_package, first_name, last_name, email, phone,
        event_date, additional_notes, submitted_at, status, created_at
      FROM bookings 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      bookings: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update booking status (admin only)
app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, confirmed, completed, or cancelled'
      });
    }

    const result = await pool.query(
      'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Send test email
app.post('/api/test-email', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const msg = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: 'Test Email from Booking System',
      text: 'This is a test email from your booking system.',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from your booking system.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Server:</strong> ${process.env.NODE_ENV || 'development'}</p>
      `,
    };

    await sgMail.send(msg);

    res.json({
      success: true,
      message: 'Test email sent successfully!'
    });

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email: ' + error.message
    });
  }
});

// Function to send booking notification emails
async function sendBookingEmails(bookingData) {
  console.log('📧 sendBookingEmails function called with data:', {
    bookingId: bookingData.bookingId,
    email: bookingData.email,
    selectedPackage: bookingData.selectedPackage
  });

  const {
    bookingId,
    selectedPackage,
    firstName,
    lastName,
    email,
    phone,
    eventDate,
    additionalNotes,
    createdAt
  } = bookingData;

  // Package display names mapping
  const packageNames = {
    'dust-light': 'Dust & Light - Mini Session',
    'field-frame': 'Field & Frame - Full Session',
    'soil-sun': 'Soil & Sun - Golden Hour Session',
    'lifestyle-event': 'Lifestyle & Events',
    'wedding': 'Wedding Photography',
    'raw-thread': 'The Raw Thread - Short Story Package',
    'narrative-journey': 'The Narrative Journey - Campaigns & Reports',
    'footpath-journey': 'The Footpath Journey - Long-Term Partnership',
    'custom': 'Custom Package'
  };

  const packageDisplayName = packageNames[selectedPackage] || selectedPackage;

  // Email to Kristin (notification)
  const adminEmail = {
    to: process.env.ADMIN_EMAIL,
    from: process.env.FROM_EMAIL,
    subject: `🌟 New Booking Request #${bookingId} - ${packageDisplayName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6a994e; border-bottom: 2px solid #6a994e; padding-bottom: 10px;">
          New Booking Request
        </h2>
        
        <div style="background-color: #f7f5f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> #${bookingId}</p>
          <p><strong>Package:</strong> ${packageDisplayName}</p>
          <p><strong>Client:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
          ${eventDate ? `<p><strong>Preferred Date:</strong> ${eventDate}</p>` : ''}
          <p><strong>Submitted:</strong> ${new Date(createdAt).toLocaleString()}</p>
        </div>
        
        ${additionalNotes ? `
          <div style="background-color: #e6e3db; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #33423c;">Additional Notes:</h3>
            <p style="margin-bottom: 0;">${additionalNotes}</p>
          </div>
        ` : ''}
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Remember to respond within 24-48 hours! ✨
        </p>
      </div>
    `,
  };

  // Email to client (confirmation)
  const clientEmail = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: 'Booking Request Received - Kristin with an Eye 📸',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6a994e;">Thank you for your booking request!</h2>
        
        <p>Hi ${firstName},</p>
        
        <p>I've received your booking request for <strong>${packageDisplayName}</strong> and I'm so excited to potentially work with you!</p>
        
        <div style="background-color: #f7f5f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #33423c;">What happens next?</h3>
          <ul style="color: #33423c;">
            <li>I'll get back to you within 24-48 hours</li>
            <li>We'll discuss your vision and session details</li>
            <li>I'll send you a detailed quote and next steps</li>
          </ul>
        </div>
        
        <p>In the meantime, feel free to:</p>
        <ul>
          <li>Check out my <a href="${process.env.FRONTEND_URL}/portfolio" style="color: #6a994e;">recent work</a></li>
          <li>Follow me on <a href="https://www.instagram.com/kristin_with.an.eye/" style="color: #6a994e;">Instagram</a></li>
          <li>Email me directly at <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #6a994e;">${process.env.ADMIN_EMAIL}</a> if you have any questions</li>
        </ul>
        
        <div style="background-color: #e6e3db; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #33423c;">Your Booking Details:</h3>
          <p><strong>Package:</strong> ${packageDisplayName}</p>
          ${eventDate ? `<p><strong>Preferred Date:</strong> ${eventDate}</p>` : ''}
          <p><strong>Reference:</strong> #${bookingId}</p>
        </div>
        
        <p>Looking forward to capturing your story!</p>
        
        <p style="color: #6a994e; font-style: italic;">
          With warmth,<br>
          Kristin ✨
        </p>
        
        <hr style="border: none; height: 1px; background-color: #e6e3db; margin: 30px 0;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          Kristin with an Eye | Finding beauty in humble places
        </p>
      </div>
    `,
  };

  try {
    console.log('📤 Sending admin email to:', process.env.ADMIN_EMAIL);
    console.log('📤 Sending client email to:', email);
    console.log('🔑 Using SendGrid API key:', process.env.SENDGRID_API_KEY ? `${process.env.SENDGRID_API_KEY.substring(0, 10)}...` : 'NOT SET');
    console.log('📧 From email:', process.env.FROM_EMAIL);

    // Send both emails
    const [adminResult, clientResult] = await Promise.all([
      sgMail.send(adminEmail),
      sgMail.send(clientEmail)
    ]);
    
    console.log('✅ Admin email result:', adminResult?.[0]?.statusCode || 'Unknown');
    console.log('✅ Client email result:', clientResult?.[0]?.statusCode || 'Unknown');
    console.log(`📧 Booking emails sent successfully for booking #${bookingId}`);
  } catch (error) {
    console.error(`❌ Email sending error for booking #${bookingId}:`, error);
    console.error('SendGrid error response:', error.response?.body || 'No response body');
    console.error('SendGrid status code:', error.code || 'No status code');
    throw error;
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 SendGrid configured: ${!!process.env.SENDGRID_API_KEY}`);
  console.log(`🗄️  Database configured: ${!!process.env.DATABASE_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
}); 