import { cookies } from 'next/headers';

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'default-secret-key';
const ADMIN_COOKIE_NAME = 'admin_authenticated';

/**
 * Verify admin authentication
 */
export function verifyAdminSecret(secret: string): boolean {
  return secret === ADMIN_SECRET_KEY;
}

/**
 * Set admin authentication cookie
 */
export async function setAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Check if admin is authenticated
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(ADMIN_COOKIE_NAME);
}

/**
 * Clear admin authentication
 */
export async function clearAdminAuth(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
