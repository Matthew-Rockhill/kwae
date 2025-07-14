# Vercel Deployment Guide for Booking System

## 🚀 Quick Deploy to Vercel

Your booking system is now ready for Vercel deployment! Here's how to set it up:

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL Database**: Set up a database (recommended: Supabase, Railway, or Neon)
3. **SendGrid Account**: For email notifications

## 🗄️ Database Setup

### Option 1: Supabase (Recommended - Free)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor and run this schema:

```sql
CREATE TABLE bookings (
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
);
```

4. Copy the connection string from Settings → Database

### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. Add PostgreSQL service
3. Copy connection string

### Option 3: Neon
1. Go to [neon.tech](https://neon.tech)
2. Create project
3. Copy connection string

## 📧 SendGrid Setup

1. **Create Account**: Go to [sendgrid.com](https://sendgrid.com)
2. **Get API Key**: Settings → API Keys → Create API Key (Full Access)
3. **Verify Sender**: Settings → Sender Authentication → Verify your email

## 🚀 Deploy to Vercel

### Step 1: Connect Repository
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### Step 2: Configure Project
- **Framework Preset**: Vue.js
- **Root Directory**: `./` (root of your project)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 3: Set Environment Variables
In your Vercel project settings, add these environment variables:

```env
# Database
DATABASE_URL=postgresql://username:password@host:5432/database_name

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=hello@kristinmathilde.com
ADMIN_EMAIL=hello@kristinmathilde.com

# Frontend URL (your Vercel domain)
FRONTEND_URL=https://your-project-name.vercel.app

# Security
ADMIN_API_KEY=your-secure-admin-api-key-here

# Environment
NODE_ENV=production
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your site will be live at `https://your-project-name.vercel.app`

## 🔧 API Endpoints

Your Vercel deployment will automatically create these API endpoints:

- **Health Check**: `https://your-project-name.vercel.app/api/health`
- **Submit Booking**: `https://your-project-name.vercel.app/api/bookings` (POST)

## 🧪 Testing

### Test Health Endpoint
```bash
curl https://your-project-name.vercel.app/api/health
```

### Test Booking Submission
```bash
curl -X POST https://your-project-name.vercel.app/api/bookings \
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

## 🔄 Automatic Deployments

Vercel will automatically deploy when you push to your main branch:

```bash
git add .
git commit -m "Deploy booking system to Vercel"
git push origin main
```

## 📊 Monitoring

- **Vercel Dashboard**: Monitor deployments and performance
- **Function Logs**: View API function logs in Vercel dashboard
- **SendGrid Dashboard**: Monitor email delivery

## 🔒 Security Features

Your deployed API includes:
- ✅ Rate limiting (5 bookings/hour per IP)
- ✅ CORS protection
- ✅ Input validation
- ✅ Duplicate prevention
- ✅ SQL injection protection

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` format
   - Ensure database allows external connections
   - Verify SSL settings

2. **Email Not Sending**
   - Verify `SENDGRID_API_KEY`
   - Check sender email is verified
   - Look at SendGrid dashboard for errors

3. **CORS Errors**
   - Update `FRONTEND_URL` in environment variables
   - Check browser console for specific errors

### Debug Steps

1. **Check Function Logs**: Vercel Dashboard → Functions → View Logs
2. **Test API Directly**: Use curl or Postman to test endpoints
3. **Verify Environment Variables**: Check all are set correctly

## 📈 Next Steps

After deployment:
1. **Test the booking form** on your live site
2. **Set up monitoring** for email delivery
3. **Configure custom domain** if needed
4. **Set up admin dashboard** for viewing bookings

## 🎉 Success!

Your booking system is now live and ready to accept bookings! The system will:
- Store bookings in your PostgreSQL database
- Send notification emails to you and customers
- Provide a seamless booking experience

Let me know if you need help with any of these steps! 