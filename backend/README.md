# Kristin with an Eye - Booking System Backend

A production-ready Node.js backend for the photography booking system using PostgreSQL and SendGrid.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- PostgreSQL database (local or cloud)
- SendGrid account for emails

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/kristin_bookings

   # SendGrid Email Configuration
   SENDGRID_API_KEY=your-sendgrid-api-key
   FROM_EMAIL=hello@kristinmathilde.com
   ADMIN_EMAIL=hello@kristinmathilde.com

   # Frontend Configuration
   FRONTEND_URL=http://localhost:5173

   # Security
   ADMIN_API_KEY=your-secure-admin-api-key-here

   # Server Configuration
   PORT=3001
   NODE_ENV=development
   ```

3. **Set up the database:**
   ```bash
   npm run setup-db
   ```

4. **Start the server:**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📧 SendGrid Setup

1. **Create SendGrid Account:**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Sign up for a free account (100 emails/day)

2. **Get API Key:**
   - Go to Settings → API Keys
   - Create a new API key with "Full Access"
   - Copy the key to your `.env` file

3. **Verify Sender Identity:**
   - Go to Settings → Sender Authentication
   - Verify `hello@kristinmathilde.com` (or your email)
   - This email will be used as the "from" address

4. **Test Email Setup:**
   ```bash
   # Test the email functionality
   curl -X POST http://localhost:3001/api/test-email \
     -H "Authorization: Bearer your-admin-api-key" \
     -H "Content-Type: application/json"
   ```

## 🗄️ Database Setup

### Local PostgreSQL

1. **Install PostgreSQL:**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql

   # Ubuntu
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql

   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database:**
   ```bash
   createdb kristin_bookings
   ```

3. **Update DATABASE_URL:**
   ```env
   DATABASE_URL=postgresql://your-username:your-password@localhost:5432/kristin_bookings
   ```

### Cloud PostgreSQL (Recommended for Production)

**Option 1: Supabase (Free tier)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string to `DATABASE_URL`

**Option 2: Railway**
1. Go to [railway.app](https://railway.app)
2. Add PostgreSQL service
3. Copy connection string

**Option 3: Heroku Postgres**
1. Create Heroku app
2. Add Heroku Postgres addon
3. Copy `DATABASE_URL` from config vars

## 🔧 API Endpoints

### Public Endpoints

- `POST /api/bookings` - Submit a booking
- `GET /api/health` - Health check

### Admin Endpoints (Require Authorization)

- `GET /api/bookings` - Get all bookings
- `PATCH /api/bookings/:id/status` - Update booking status
- `POST /api/test-email` - Send test email

### Authorization

Include in headers:
```
Authorization: Bearer your-admin-api-key
```

## 📊 Database Schema

```sql
bookings (
  id SERIAL PRIMARY KEY,
  selected_package VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  event_date DATE,
  additional_notes TEXT,
  submitted_at TIMESTAMP NOT NULL,
  ip_address INET,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## 🔒 Security Features

- **Rate Limiting**: 5 bookings per hour per IP
- **Input Validation**: Email format, required fields
- **Duplicate Prevention**: Same email + package within 24h
- **CORS Protection**: Only allows your frontend domain
- **Helmet.js**: Security headers
- **Admin Authentication**: Bearer token for admin endpoints

## 📧 Email Templates

### Admin Notification
- **To**: `ADMIN_EMAIL`
- **Subject**: "🌟 New Booking Request #ID - Package"
- **Content**: All booking details, formatted for easy reading

### Customer Confirmation
- **To**: Customer email
- **Subject**: "Booking Request Received - Kristin with an Eye 📸"
- **Content**: Confirmation with next steps and links

## 🚀 Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=hello@kristinmathilde.com
ADMIN_EMAIL=hello@kristinmathilde.com
FRONTEND_URL=https://your-domain.com
ADMIN_API_KEY=very-secure-random-string
PORT=3001
```

### Deployment Options

**Option 1: Railway**
1. Connect GitHub repo
2. Set environment variables
3. Deploy automatically

**Option 2: Heroku**
1. `heroku create your-app-name`
2. `heroku config:set` for each env var
3. `git push heroku main`

**Option 3: DigitalOcean App Platform**
1. Connect repo
2. Set env vars in console
3. Deploy

### Database Migration for Production

```bash
# After deployment, run:
npm run setup-db
```

## 🧪 Testing

### Test Booking Submission

```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "selectedPackage": "dust-light",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "eventDate": "2024-03-15",
    "additionalNotes": "Test booking",
    "submittedAt": "2024-01-15T10:00:00Z"
  }'
```

### View All Bookings

```bash
curl -X GET http://localhost:3001/api/bookings \
  -H "Authorization: Bearer your-admin-api-key"
```

## 📈 Monitoring & Analytics

### View Booking Statistics

```sql
-- Total bookings
SELECT COUNT(*) FROM bookings;

-- Bookings by package
SELECT selected_package, COUNT(*) 
FROM bookings 
GROUP BY selected_package 
ORDER BY COUNT(*) DESC;

-- Bookings by status
SELECT status, COUNT(*) 
FROM bookings 
GROUP BY status;

-- Recent bookings (last 7 days)
SELECT * FROM bookings 
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` format
   - Ensure database exists
   - Check network connectivity

2. **Email Not Sending**
   - Verify `SENDGRID_API_KEY`
   - Check sender email is verified
   - Look at SendGrid dashboard for errors

3. **CORS Errors**
   - Update `FRONTEND_URL` in environment
   - Check frontend is running on correct port

4. **Rate Limiting Issues**
   - Adjust rate limits in `server.js`
   - Check IP address in logs

### Logs

The server logs important events:
- 📅 New bookings received
- 📧 Email sending status
- ❌ Errors and warnings
- 🔒 Security events

### Need Help?

Check the logs first, then:
1. Verify all environment variables
2. Test database connection
3. Test SendGrid configuration
4. Check network/firewall settings

## 📝 License

Private use for Kristin with an Eye photography business. 