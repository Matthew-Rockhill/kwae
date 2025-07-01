// Backend Server Example - backend-example.js
// This is an example of how to set up your backend server
// You can adapt this to your preferred backend framework

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const sgMail = require('@sendgrid/mail');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Initialize SQLite database
const db = new sqlite3.Database('bookings.db');

// Create bookings table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      selected_package TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      event_date TEXT,
      additional_notes TEXT,
      submitted_at TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Routes

// Submit a new booking
app.post('/api/bookings', async (req, res) => {
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
        message: 'Missing required fields'
      });
    }

    // Insert booking into database
    const stmt = db.prepare(`
      INSERT INTO bookings (
        selected_package, first_name, last_name, email, phone, 
        event_date, additional_notes, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      selectedPackage,
      firstName,
      lastName,
      email,
      phone,
      eventDate || '',
      additionalNotes || '',
      submittedAt
    ], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to save booking'
        });
      }

      const bookingId = this.lastID;

      // Send emails
      sendBookingEmails({
        bookingId,
        selectedPackage,
        firstName,
        lastName,
        email,
        phone,
        eventDate,
        additionalNotes
      });

      res.json({
        success: true,
        message: 'Booking submitted successfully!',
        bookingId: bookingId.toString()
      });
    });

    stmt.finalize();

  } catch (error) {
    console.error('Booking submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all bookings (for admin)
app.get('/api/bookings', async (req, res) => {
  try {
    // In a real app, you'd check authentication here
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    db.all('SELECT * FROM bookings ORDER BY created_at DESC', (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch bookings'
        });
      }

      res.json(rows);
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Send test email
app.post('/api/test-email', async (req, res) => {
  try {
    const msg = {
      to: 'hello@kristinmathilde.com',
      from: 'noreply@kristinmathilde.com', // Use your verified sender
      subject: 'Test Email from Booking System',
      text: 'This is a test email from your booking system.',
      html: '<p>This is a test email from your booking system.</p>',
    };

    await sgMail.send(msg);

    res.json({
      success: true,
      message: 'Test email sent successfully!'
    });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email'
    });
  }
});

// Function to send booking notification emails
async function sendBookingEmails(bookingData) {
  const {
    bookingId,
    selectedPackage,
    firstName,
    lastName,
    email,
    phone,
    eventDate,
    additionalNotes
  } = bookingData;

  // Email to Kristin (notification)
  const adminEmail = {
    to: 'hello@kristinmathilde.com',
    from: 'noreply@kristinmathilde.com', // Use your verified sender
    subject: `New Booking Request #${bookingId} - ${selectedPackage}`,
    html: `
      <h2>New Booking Request</h2>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
      <p><strong>Package:</strong> ${selectedPackage}</p>
      <p><strong>Client:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${eventDate ? `<p><strong>Preferred Date:</strong> ${eventDate}</p>` : ''}
      ${additionalNotes ? `<p><strong>Notes:</strong> ${additionalNotes}</p>` : ''}
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `,
  };

  // Email to client (confirmation)
  const clientEmail = {
    to: email,
    from: 'hello@kristinmathilde.com', // Use your verified sender
    subject: 'Booking Request Received - Kristin with an Eye',
    html: `
      <h2>Thank you for your booking request!</h2>
      <p>Hi ${firstName},</p>
      <p>I've received your booking request for <strong>${selectedPackage}</strong>.</p>
      <p>I'll get back to you within 24-48 hours to discuss your session and next steps.</p>
      <p>In the meantime, feel free to reach out if you have any questions at hello@kristinmathilde.com</p>
      <p>Looking forward to working with you!</p>
      <p>Best regards,<br>Kristin</p>
      
      <hr>
      <h3>Your Booking Details:</h3>
      <p><strong>Package:</strong> ${selectedPackage}</p>
      ${eventDate ? `<p><strong>Preferred Date:</strong> ${eventDate}</p>` : ''}
      ${additionalNotes ? `<p><strong>Your Notes:</strong> ${additionalNotes}</p>` : ''}
    `,
  };

  try {
    // Send both emails
    await Promise.all([
      sgMail.send(adminEmail),
      sgMail.send(clientEmail)
    ]);
    
    console.log('📧 Booking emails sent successfully');
  } catch (error) {
    console.error('📧 Email sending error:', error);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📧 Make sure to set SENDGRID_API_KEY environment variable');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});

/*
SETUP INSTRUCTIONS:

1. Install dependencies:
   npm init -y
   npm install express cors sqlite3 @sendgrid/mail

2. Set up SendGrid:
   - Sign up at sendgrid.com
   - Get your API key
   - Verify your sender email address
   - Set environment variable: SENDGRID_API_KEY=your-api-key

3. Create .env file:
   SENDGRID_API_KEY=your-sendgrid-api-key
   PORT=3001

4. Run the server:
   node backend-example.js

5. Update your frontend environment:
   Create .env file in your Vue app:
   VITE_API_BASE_URL=http://localhost:3001/api

Alternative Database Options:
- PostgreSQL with pg package
- MongoDB with mongoose
- Supabase (includes database + auth)
- Firebase Firestore
- Prisma ORM for type-safe database access

Alternative Email Services:
- Nodemailer with Gmail
- Amazon SES
- Mailgun
- Postmark

For production deployment:
- Use environment variables for all sensitive data
- Add proper authentication/authorization
- Use a production database
- Add rate limiting
- Add request validation
- Use HTTPS
- Add logging and monitoring
*/ 