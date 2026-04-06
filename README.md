# DC Pass QR Management System

A full-stack web application for managing QR-based document access. Users upload PDF files (DC Pass), and the system generates unique QR links for secure, mobile-friendly document viewing and downloading.

## ✨ Features

### Admin Dashboard
- 🔐 Secure admin authentication with password protection
- 📤 Upload PDF files with optional metadata
- 📊 Manage all uploaded documents
- 🗑️ Delete documents
- 📊 View file details (size, upload date, etc.)
- 📋 Metadata support: Pass Number, Vehicle Number, Date, Notes

### Public Access Page
- 📱 Mobile-first responsive design
- 📄 Embedded PDF viewer with full controls
- 🔗 Unique shareable links for each document
- 📥 Download original PDF file
- 🎫 Display metadata information
- 📵 Generate QR codes pointing to document link
- 🔒 UUID-based security (non-guessable IDs)

### File Management
- ☁️ Cloud storage via Supabase Storage
- 🔐 Secure file upload and storage
- ⚡ Fast file retrieval
- 📏 File size validation (50 MB limit)
- 📄 PDF-only uploads

### QR Code Generation
- 🔲 Automatic QR code generation for each document
- 📥 Download QR codes as PNG images
- 🌐 QR codes link to public document pages
- 📱 Optimized for mobile scanning

## 🏗️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Supabase Storage
- **Styling**: Tailwind CSS
- **QR Code**: qrcode npm package
- **PDF Viewer**: Native browser iframe
- **Deployment**: Vercel-ready

## 📋 Requirements

- Node.js 18+ and npm/yarn
- PostgreSQL database (Supabase recommended)
- Supabase account for file storage

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repo-url>
cd NewQR

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your settings:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/qr_documents

# App URL (for local dev)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin password (change this!)
ADMIN_SECRET_KEY=your_secure_password_here
```

### 3. Setup Database

```bash
# Run Prisma migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

### 4. Setup Supabase Storage (Required)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or use existing one
3. Go to Storage → Create new bucket
4. Name it `passes`
5. Set it to **Public** (important for file access)
6. Get your `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_KEY`

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 📖 Usage

### Admin Panel

1. **Access Admin Dashboard**: Navigate to `/admin`
2. **Login**: Enter your `ADMIN_SECRET_KEY` password
3. **Upload a Document**:
   - Click "Upload New Pass"
   - Select a PDF file
   - (Optional) Add Pass Number, Vehicle Number, Date, Notes
   - Click "Upload & Generate QR Code"
4. **View Documents**: See all uploaded documents on dashboard
5. **Share Document**: Copy the unique `/pass/[id]` link or download the QR code
6. **Delete Document**: Click delete on any document card

### Public Access

1. **View Document**: Visit `/pass/[id]` link from QR code or share link
2. **View PDF**: Use embedded PDF viewer
3. **Download File**: Click "Download Document" button
4. **Share Further**: Show/download QR code for mobile sharing
5. **View Metadata**: See Pass Number, Vehicle Number, Date, Notes (if provided)

## 🗂️ Project Structure

```
NewQR/
├── app/
│   ├── api/                    # API routes
│   │   ├── admin/
│   │   │   └── login/          # Admin authentication
│   │   ├── passes/             # List and delete passes (admin)
│   │   ├── pass/               # Get single pass (public)
│   │   └── upload/             # File upload endpoint
│   ├── admin/
│   │   ├── page.tsx            # Login page
│   │   ├── dashboard/          # Admin dashboard
│   │   └── upload/             # Upload form
│   ├── pass/[id]/              # Public document view page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── lib/
│   ├── auth.ts                 # Admin authentication utilities
│   ├── db.ts                   # Prisma client
│   ├── qrcode.ts               # QR code generation
│   └── supabase.ts             # Supabase storage utilities
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                      # Static assets
├── .env.example                # Environment variables template
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json                # Dependencies

```

## 📊 Database Schema

### Pass Model

```prisma
model Pass {
  id            String   @id @default(uuid()) @db.Uuid
  fileUrl       String   // URL to stored PDF file
  fileName      String   // Original file name
  fileSize      Int      // File size in bytes
  
  passNumber    String?  // Pass/Certificate number
  vehicleNumber String?  // Vehicle number
  date          DateTime? // Associated date
  notes         String?  // Additional notes
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## 🔐 Security Features

- ✅ **Admin Authentication**: Password-protected admin panel
- ✅ **UUID IDs**: Non-guessable, cryptographically secure document IDs
- ✅ **Public Read-Only**: Public pages can only view/download, not modify
- ✅ **Secure Cookies**: HTTPOnly, Secure, SameSite flags on auth cookies
- ✅ **CORS Ready**: Proper API security headers
- ✅ **Environment Secrets**: All sensitive data in environment variables

## 🌐 API Endpoints

### Admin Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Authenticate as admin |
| POST | `/api/upload` | Upload new PDF file |
| GET | `/api/passes` | List all passes |
| DELETE | `/api/passes/[id]` | Delete a pass |

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pass/[id]` | Get pass details (including QR code) |

## 🚀 Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Select your GitHub repository
4. Configure environment variables:
   - All variables from `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
5. Deploy!

### 3. Migrate Database on Vercel

```bash
# After deploying to Vercel
npm run prisma:migrate -- --skip-generate
```

### 4. Create Supabase Bucket

Ensure the `passes` bucket exists in your Supabase project and is set to **Public**.

## 📦 File Size Limits

- **Max PDF Size**: 50 MB (configurable in `app/api/upload/route.ts`)
- **Supabase Storage**: Default 1 GB per file (check your plan)

## ⚡ Performance Optimizations

- 💾 PDF loaded with iframe (native browser viewer)
- 🎯 Optimistic UI updates
- 📦 Next.js automatic code splitting
- 🖼️ Image optimization for QR codes
- ⏱️ Database indexing on createdAt

## 🐛 Troubleshooting

### "Unauthorized" on admin panel
- Ensure you've set correct `ADMIN_SECRET_KEY` in `.env.local`
- Clear browser cookies and try again
- Check that auth middleware is working

### PDF not loading
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Ensure Supabase bucket is **Public**
- Check file was uploaded to correct bucket (`passes`)

### Supabase storage errors
- Verify `SUPABASE_SERVICE_KEY` is from "Service Role" (not anon key)
- Check bucket exists and is public
- Review Supabase project audit logs

### Database connection error
- Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Ensure PostgreSQL is running
- Check Supabase database is active

## 🔄 Local PostgreSQL Setup (Alternative)

If not using Supabase:

```bash
# Install PostgreSQL locally
# Create database
createdb qr_documents

# Update .env.local
DATABASE_URL="postgresql://localhost/qr_documents"

# Run migrations
npm run prisma:migrate
```

## 📱 Mobile Responsiveness

- ✅ Mobile-first design
- ✅ Touch-friendly buttons
- ✅ Responsive PDF viewer
- ✅ Large QR code for easy scanning
- ✅ Optimized for portrait orientation

## 🎯 Future Enhancements

- [ ] Batch upload support
- [ ] Document expiration dates
- [ ] Usage analytics/download tracking
- [ ] Multiple file formats (not just PDF)
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Document versioning
- [ ] Watermarking support
- [ ] Custom branding options
- [ ] Two-factor admin authentication

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please follow existing code style and commit conventions.

## 📞 Support

For issues or questions, please check the troubleshooting section or create an issue on GitHub.

---

**Made with ❤️ for secure document sharing**
