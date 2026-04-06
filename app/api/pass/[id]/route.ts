import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateQRCode } from '@/lib/qrcode';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find the pass
    const pass = await prisma.pass.findUnique({
      where: { id },
    });

    if (!pass) {
      return NextResponse.json(
        { error: 'Pass not found' },
        { status: 404 }
      );
    }

    // Generate QR code for the pass URL
    const passUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pass/${id}`;
    const qrCode = await generateQRCode(passUrl);

    return NextResponse.json({
      id: pass.id,
      fileName: pass.fileName,
      fileUrl: pass.fileUrl,
      fileSize: pass.fileSize,
      passNumber: pass.passNumber,
      vehicleNumber: pass.vehicleNumber,
      date: pass.date,
      notes: pass.notes,
      createdAt: pass.createdAt,
      qrCode: qrCode,
    });
  } catch (error) {
    console.error('Error fetching pass:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch pass' },
      { status: 500 }
    );
  }
}
