import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    // Verify admin auth
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all passes with newest first
    const passes = await prisma.pass.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        passNumber: true,
        vehicleNumber: true,
        date: true,
        createdAt: true,
      },
    });

    return NextResponse.json(passes);
  } catch (error) {
    console.error('Error fetching passes:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch passes' },
      { status: 500 }
    );
  }
}
