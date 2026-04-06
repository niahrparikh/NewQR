import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadFile } from '@/lib/supabase';
import { generateQRCode, getPassPublicUrl } from '@/lib/qrcode';
import { isAdminAuthenticated } from '@/lib/auth';

// Disable static generation for this route
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export async function POST(request: NextRequest) {
  try {
    // Verify admin auth
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in as admin.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload file to Supabase
    const fileUrl = await uploadFile(buffer, file.name);
    
    // Create pass record in database
    const pass = await prisma.pass.create({
      data: {
        fileName: file.name,
        fileSize: file.size,
        fileUrl: fileUrl,
        passNumber: (formData.get('passNumber') as string) || null,
        vehicleNumber: (formData.get('vehicleNumber') as string) || null,
        date: (formData.get('date') as string) ? new Date(formData.get('date') as string) : null,
        notes: (formData.get('notes') as string) || null,
      },
    });

    // Generate QR code with actual pass URL
    const actualPassUrl = getPassPublicUrl(pass.id);
    const qrCode = await generateQRCode(actualPassUrl);

    return NextResponse.json(
      {
        success: true,
        passId: pass.id,
        qrCode: qrCode,
        message: 'File uploaded successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
