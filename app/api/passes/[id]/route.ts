import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { deleteFile } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

// Disable static generation for this route
export const dynamic = 'force-dynamic';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin auth
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Find and delete the pass
    const pass = await prisma.pass.findUnique({
      where: { id },
    });

    if (!pass) {
      return NextResponse.json(
        { error: 'Pass not found' },
        { status: 404 }
      );
    }

    // Delete file from Supabase
    try {
      await deleteFile(pass.fileUrl);
    } catch (err) {
      console.error('Error deleting file from storage:', err);
      // Continue anyway, we still want to delete the DB record
    }

    // Delete record from database
    await prisma.pass.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: 'Pass deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting pass:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete pass' },
      { status: 500 }
    );
  }
}
