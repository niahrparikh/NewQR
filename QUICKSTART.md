# Quick Start Guide

Get the DC Pass QR system running in 5 minutes.

## TL;DR - Quick Setup

```bash
# 1. Clone and install
npm install

# 2. Copy environment setup
cp .env.example .env.local

# 3. Update .env.local with:
#    - SUPABASE_URL and KEYS (get from Supabase Dashboard)
#    - DATABASE_URL (Supabase or local Postgres)
#    - ADMIN_SECRET_KEY (your admin password)

# 4. Setup database
npm run prisma:migrate

# 5. Create storage bucket in Supabase named "passes" (PUBLIC)

# 6. Start development
npm run dev

# Visit http://localhost:3000
```

## Environment Setup (2 minutes)

### Get Supabase Details
1. Go to [app.supabase.com](https://app.supabase.com)
2. Create project → note credentials
3. Copy to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxx...
   SUPABASE_SERVICE_KEY=eyxxx...
   DATABASE_URL=postgresql://postgres.xxx:[password]@xxx.supabase.co:5432/postgres
   ```

### Create Storage Bucket
1. In Supabase → Storage → New Bucket
2. Name: `passes`
3. Set to **PUBLIC**
4. Done!

### Set Admin Password
In `.env.local`:
```
ADMIN_SECRET_KEY=your-secure-password
```

## Run It

```bash
npm run dev
```

- Home: http://localhost:3000
- Admin: http://localhost:3000/admin (use `ADMIN_SECRET_KEY`)
- Upload: http://localhost:3000/admin/upload

## First Upload

1. Go to /admin/dashboard
2. Click "Upload New Pass"
3. Pick a PDF file
4. (Optional) Add metadata
5. Upload
6. Copy/share the pass link
7. QR code generated automatically

## What You Get

✅ Secure admin dashboard  
✅ PDF upload & storage  
✅ Automatic QR code generation  
✅ Public document viewing  
✅ Download original files  
✅ Mobile-friendly design  
✅ Production-ready code  

## Deploy to Vercel

```bash
git push origin main
```

Then on Vercel.com:
1. Import GitHub repo
2. Add environment variables
3. Click Deploy

For detailed setup, see [SETUP.md](./SETUP.md)

## Common Issues

| Issue | Fix |
|-------|-----|
| Database connection error | Verify `DATABASE_URL` |
| "Unauthorized" when uploading | Clear cookies, try again |
| PDF won't load | Ensure bucket is PUBLIC |
| Build errors | `npm install && npm run prisma:generate` |

See [SETUP.md](./SETUP.md) → Troubleshooting for more help.
