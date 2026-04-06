import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DC Pass QR Management',
  description: 'Secure document access via QR codes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
