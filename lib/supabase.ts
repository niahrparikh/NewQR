import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

// Lazy-initialize client to avoid build-time errors
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = {
  get client() {
    if (!supabaseInstance) {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase URL and key must be configured in environment variables');
      }
      supabaseInstance = createClient(supabaseUrl, supabaseKey);
    }
    return supabaseInstance;
  }
};

// Helper to access the client directly
export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and key must be configured in environment variables');
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseInstance;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  bucket: string = 'passes'
): Promise<string> {
  try {
    const client = getSupabaseClient();
    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '-')}`;

    const { error } = await client.storage
      .from(bucket)
      .upload(uniqueFileName, fileBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = client.storage.from(bucket).getPublicUrl(uniqueFileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(fileUrl: string, bucket: string = 'passes'): Promise<void> {
  try {
    const client = getSupabaseClient();
    // Extract filename from URL
    const fileName = fileUrl.split('/').pop();
    if (!fileName) {
      throw new Error('Invalid file URL');
    }

    const { error } = await client.storage.from(bucket).remove([fileName]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Get file from Supabase Storage
 */
export async function getFileUrl(fileName: string, bucket: string = 'passes'): Promise<string> {
  const client = getSupabaseClient();
  const {
    data: { publicUrl },
  } = client.storage.from(bucket).getPublicUrl(fileName);

  return publicUrl;
}
