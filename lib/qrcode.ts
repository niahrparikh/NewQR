import QRCode from 'qrcode';

/**
 * Generate QR code as data URL
 */
export async function generateQRCode(text: string): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        light: '#ffffff',
        dark: '#000000',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Generate QR code as PNG buffer
 */
export async function generateQRCodePNG(text: string): Promise<Buffer> {
  try {
    const png = await QRCode.toBuffer(text, {
      width: 300,
      margin: 2,
      color: {
        light: '#ffffff',
        dark: '#000000',
      },
    });
    return png;
  } catch (error) {
    console.error('Error generating QR code PNG:', error);
    throw error;
  }
}

/**
 * Get public URL for a pass
 */
export function getPassPublicUrl(passId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/pass/${passId}`;
}
