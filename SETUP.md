# 🚀 DC Pass QR System - Complete Setup Guide

This guide walks you through setting up the DC Pass QR document management system from scratch.

## Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** (check with `node --version`)
- **npm or yarn** (included with Node.js)
- **Git** (for version control)
- **PostgreSQL** (via Supabase or local installation)
- **Supabase Account** (free tier is sufficient)

## 📋 Table of Contents

1. [Clone & Initial Setup](#clone--initial-setup)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Supabase Setup (File Storage)](#supabase-setup-file-storage)
5. [Local Development](#local-development)
6. [First Time Usage](#first-time-usage)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Clone & Initial Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd NewQR
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js 14
- React 18
- Prisma ORM
- Tailwind CSS
- Supabase client
- QR Code generator

**Note**: The installation should complete without errors. If you see dependency warnings, they can be safely ignored for development.

---

## Environment Configuration

### Create .env.local

The project comes with a `.env.local` file with default values for local development.

#### For Local PostgreSQL Development:

```env
# Supabase (optional for local dev, needed for production)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxx...
SUPABASE_SERVICE_KEY=eyxx...

# Local PostgreSQL Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/qr_documents

# App Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Authentication
ADMIN_SECRET_KEY=your-secure-admin-password
```

#### For Supabase Cloud Development:

```env
# Get these from Supabase Dashboard → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxx...
SUPABASE_SERVICE_KEY=eyxx... (from Service Role Keys)

# Supabase PostgreSQL
DATABASE_URL=postgresql://postgres.xxxx:[password]@xxxx.supabase.co:5432/postgres

# App Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Authentication
ADMIN_SECRET_KEY=your-secure-admin-password
```

**⚠️ IMPORTANT**: Never commit `.env.local` to Git. It contains sensitive information.

---

## Database Setup

### Option A: Using Supabase (Recommended)

#### 1. Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: `qr-documents` (or similar)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose your region
4. Wait for project to initialize (2-5 minutes)

#### 2. Get Database Connection String

1. In Supabase, go to **Settings → Database**
2. Look for "Connection string" section
3. Copy the PostgreSQL URL
4. Replace `[YOUR-PASSWORD]` with your database password
5. Add to `.env.local`:
   ```
   DATABASE_URL=postgresql://postgres.xxx:[password]@xxx.supabase.co:5432/postgres
   ```

#### 3. Get Supabase API Keys

1. Go to **Settings → API**
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY`
3. Update `.env.local` with these values

#### 4. Run Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

This creates the database tables.

### Option B: Using Local PostgreSQL

#### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

#### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE qr_documents;

# Create user (optional, for security)
CREATE USER qruser WITH PASSWORD 'secure-password-here';
GRANT ALL PRIVILEGES ON DATABASE qr_documents TO qruser;

# Exit psql
\q
```

#### 3. Update .env.local

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/qr_documents
```

#### 4. Run Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

---

## Supabase Setup (File Storage)

This is **required** for uploading and storing PDF files.

### 1. Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Name it: `passes`
4. **IMPORTANT**: Set privacy to **Public** (not private)
5. Click "Create bucket"

### 2. Configure Bucket Policy

The bucket is already public, but ensure files are downloadable:

1. Go to Bucket → `passes` → Policies
2. Verify "Public Access" policy exists
3. It should allow `SELECT` for public access

### 3. Verify Storage Works

Files uploaded to this bucket will be accessible at:
```
https://[your-supabase-url]/storage/v1/object/public/passes/[filename]
```

---

## Local Development

### Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`

### Access the Application

- **Home Page**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin
  - Password: Use value from `ADMIN_SECRET_KEY` in `.env.local`
- **Dashboard** (after login): http://localhost:3000/admin/dashboard
- **Upload Form**: http://localhost:3000/admin/upload

### View Database (Optional)

Open Prisma Studio to browse your database:

```bash
npm run prisma:studio
```

This opens a visual database editor at `http://localhost:5555`

### Build for Production

```bash
npm run build
```

This checks for TypeScript errors and optimizes the code.

---

## First Time Usage

### 1. Upload Your First Document

1. Navigate to http://localhost:3000/admin
2. Enter your admin password
3. Click "Upload New Pass"
4. Select a PDF file
5. (Optional) Fill in:
   - Pass Number (e.g., "DC-2024-001")
   - Vehicle Number (e.g., "ABC-1234")
   - Date (when this pass was issued)
   - Notes (any additional info)
6. Click "Upload & Generate QR Code"
7. You'll be redirected to dashboard showing your uploaded file

### 2. View Your Document

1. On the dashboard, click "View" on any document
2. You'll see:
   - Embedded PDF viewer
   - Metadata (if provided)
   - Download button
   - QR code generator

### 3. Generate & Share QR Code

1. On the document view page, click "Show QR Code"
2. A QR code appears that links to just this document
3. Click "Download QR Code" to save as PNG image
4. Share the QR code or direct link

### 4. Test Download

1. Click "Download Document" to download the original PDF file
2. File saves with original name

---

## Deployment

### Deploy to Vercel (Recommended)

#### 1. Push Code to GitHub

```bash
git add .
git commit -m "Initial commit: DC Pass QR system"
git push origin main
```

#### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js configuration
5. Click "Deploy"

#### 3. Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
SUPABASE_SERVICE_KEY = your_service_key
DATABASE_URL = your_database_url
NEXT_PUBLIC_APP_URL = https://your-vercel-url.vercel.app
ADMIN_SECRET_KEY = your-secure-password
NODE_ENV = production
```

#### 4. Deploy

Click "Deploy" and wait for build to complete.

#### 5. Run Database Migrations on Vercel

After first deployment:

```bash
# In your local terminal
vercel env pull  # pulls environment variables
npm run prisma:migrate -- --skip-generate
vercel deploy --prod  # redeploy after migrations
```

### Deploy to Other Platforms

The application works on any platform supporting Node.js 18+:

- **Railway.app** (simple Postgres + hosting)
- **Render.com** (free tier available)
- **Heroku** (paid tier required now)
- **AWS** (more complex setup)
- **DigitalOcean** (App Platform)

All require:
1. GitHub repository
2. Environment variables configuration
3. Database setup (Postgres)
4. Supabase Storage bucket

---

## Troubleshooting

### "Cannot find module 'next'" or similar npm errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Unauthorized" when accessing admin

**Causes:**
- Wrong password entered
- Cookies expired
- Cookie storage disabled in browser

**Solutions:**
1. Clear browser cookies:
   - DevTools → Application → Cookies → Delete admin_authenticated
   - Try again
2. Ensure `ADMIN_SECRET_KEY` matches what you're entering
3. Try incognito/private browser window

### "NEXT_PUBLIC_SUPABASE_URL is undefined"

**Cause:** Environment variables not loaded

**Solutions:**
1. Check `.env.local` file exists
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Verify variable names are exactly as required (case-sensitive)

### "Failed to connect to Database"

**Causes:**
- PostgreSQL not running
- Wrong connection string
- Database doesn't exist

**Solutions:**

For Local PostgreSQL:
```bash
# Check if running
psql postgres

# Restart if needed
sudo systemctl restart postgresql  # Linux
brew services restart postgresql  # macOS
```

For Supabase:
- Verify `DATABASE_URL` includes `[YOUR-PASSWORD]` replaced
- Check Supabase project is active
- Visit Supabase dashboard to confirm database status

### "File upload fails - Access Denied"

**Cause:** Supabase bucket is private or configuration wrong

**Solutions:**
1. Check bucket `passes` exists
2. Verify bucket is **Public** (not Private)
3. Verify `SUPABASE_SERVICE_KEY` is correct
4. In Supabase, check Storage Policies allow public access

### "PDF viewer shows blank"

**Cause:** File URL not accessible or wrong bucket

**Solutions:**
1. Verify bucket is Public
2. Test file URL directly in browser
3. Check file was uploaded to correct bucket
4. Check Supabase Storage quotas

### "npm run prisma:migrate" hangs or errors

**Cause:** Database connection issue

**Solutions:**
```bash
# Check connection
npm run prisma:studio  # This tests the connection

# If that fails, verify DATABASE_URL
echo $DATABASE_URL  # Should show connection string

# Try reset (caution: deletes all data)
npm run prisma:migrate -- --reset
```

### "Build fails on Vercel"

**Common Cause:** Missing environment variables

**Solution:**
1. Add all variables to Vercel project settings
2. Check variable names match exactly
3. Redeploy after adding variables

### Port 3000 already in use

**Solution:**
```bash
# Use different port
npm run dev -- -p 3001

# Or kill process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### Prisma errors

Sometimes Prisma client needs regeneration:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

---

## Next Steps

After successful setup:

1. **Customize Admin Password**: Change `ADMIN_SECRET_KEY` in `.env.local` and production
2. **Upload Test Documents**: Add several test PDCs to verify system
3. **Test QR Codes**: Scan them with mobile device
4. **Set Up Domain**: Point your domain to Vercel deployment
5. **Enable Analytics**: Consider adding analytics for usage tracking
6. **Backup Strategy**: Set up database backups (Supabase has built-in backups)
7. **Security Audit**: Review `.env.local` security and access controls

## Performance Tips

1. **Optimize PDFs**: Compress large PDFs before uploading
2. **Monitor Storage**: Check Supabase storage usage regularly
3. **Database Backups**: Supabase auto-backs up (check retention)
4. **Cache Strategy**: QR codes are cached by browser

## Security Best Practices

1. ✅ Use strong `ADMIN_SECRET_KEY`
2. ✅ Keep `.env.local` out of Git
3. ✅ Use HTTPS in production
4. ✅ Regularly update dependencies: `npm audit fix`
5. ✅ Monitor Supabase for suspicious access
6. ✅ Limit database access to your app only
7. ✅ Regular security audits

## Getting Help

- Check the [main README.md](./README.md) for feature documentation
- Review [Prisma docs](https://www.prisma.io/docs/) for database questions
- Check [Supabase docs](https://supabase.com/docs) for storage/database issues
- Browse [Next.js docs](https://nextjs.org/docs) for framework questions

---

**Happy uploading!** 🎉
