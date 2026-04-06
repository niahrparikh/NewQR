'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface PassData {
  id: string;
  fileName: string;
  fileUrl: string;
  passNumber?: string;
  vehicleNumber?: string;
  date?: string;
  notes?: string;
  createdAt: string;
  qrCode?: string;
}

export default function PassPage() {
  const params = useParams();
  const passId = params.id as string;
  
  const [pass, setPass] = useState<PassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  const fetchPass = useCallback(async () => {
    try {
      const response = await fetch(`/api/pass/${passId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Pass not found');
        }
        throw new Error('Failed to load document');
      }
      const data = await response.json();
      setPass(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [passId]);

  useEffect(() => {
    fetchPass();
  }, [fetchPass]);

  async function downloadFile() {
    if (!pass) return;

    try {
      const response = await fetch(pass.fileUrl);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pass.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to download');
    }
  }

  async function downloadQR() {
    if (!pass?.qrCode) return;

    try {
      const response = await fetch(pass.qrCode);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${pass.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to download QR code');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error}
          </h1>
          <p className="text-gray-600 mb-6">
            The document you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!pass) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-700 text-sm"
          >
            ← Home
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PDF Viewer Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <iframe
              src={`${pass.fileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-full min-h-[600px]"
              title="PDF Viewer"
            />
          </div>
        </div>

        {/* Document Info */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {pass.fileName}
              </h1>

              {(pass.passNumber || pass.vehicleNumber || pass.date || pass.notes) && (
                <div className="space-y-4 pt-4 border-t">
                  {pass.passNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Pass Number</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {pass.passNumber}
                      </p>
                    </div>
                  )}
                  {pass.vehicleNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Vehicle Number</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {pass.vehicleNumber}
                      </p>
                    </div>
                  )}
                  {pass.date && (
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(pass.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                  {pass.notes && (
                    <div>
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="text-gray-900">{pass.notes}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 pt-6 border-t text-xs text-gray-600">
                <p>Uploaded: {new Date(pass.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Actions and QR */}
          <div className="space-y-6">
            {/* Download Button */}
            <button
              onClick={downloadFile}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>📥</span>
              <span>Download Document</span>
            </button>

            {/* QR Code Section */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Share This Document
              </h3>

              <button
                onClick={() => setShowQR(!showQR)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition mb-4"
              >
                {showQR ? '▼ Hide QR Code' : '▶ Show QR Code'}
              </button>

              {showQR && pass.qrCode && (
                <div className="space-y-4">
                  <div className="flex justify-center bg-white p-4 rounded border-2 border-dashed border-gray-300">
                    <Image
                      src={pass.qrCode}
                      alt="QR Code"
                      width={200}
                      height={200}
                      priority
                    />
                  </div>

                  <button
                    onClick={downloadQR}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Download QR Code
                  </button>

                  <div>
                    <p className="text-xs text-gray-600 mb-2">
                      Direct Link:
                    </p>
                    <input
                      type="text"
                      value={typeof window !== 'undefined' ? `${window.location.origin}/pass/${pass.id}` : `/pass/${pass.id}`}
                      readOnly
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-gray-50 text-center cursor-pointer"
                      onClick={(e) => {
                        (e.target as HTMLInputElement).select();
                        navigator.clipboard.writeText((e.target as HTMLInputElement).value);
                      }}
                      title="Click to copy"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Document Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="text-blue-900">
                <strong>Document ID:</strong>
              </p>
              <p className="text-blue-800 font-mono text-xs break-all mt-2">
                {pass.id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 text-sm">
          <p>DC Pass QR System • Secure Document Access</p>
        </div>
      </div>
    </div>
  );
}
