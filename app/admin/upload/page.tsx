'use client';

import { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UploadResponse {
  success: boolean;
  passId?: string;
  qrCode?: string;
  message?: string;
  error?: string;
}

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successResponse, setSuccessResponse] = useState<UploadResponse | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setUploadProgress(0);
    setSuccessResponse(null);

    try {
      // Validate file
      const fileInput = fileInputRef.current;
      if (!fileInput?.files || fileInput.files.length === 0) {
        setError('Please select a PDF file');
        return;
      }

      const file = fileInput.files[0];

      // Validate file type and size
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }

      const maxSize = 50 * 1024 * 1024; // 50 MB
      if (file.size > maxSize) {
        setError(`File size must be less than 50 MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
        return;
      }

      setIsLoading(true);
      setUploadProgress(10);

      // Get form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'passNumber',
        (document.getElementById('passNumber') as HTMLInputElement)?.value || ''
      );
      formData.append(
        'vehicleNumber',
        (document.getElementById('vehicleNumber') as HTMLInputElement)?.value || ''
      );
      formData.append(
        'date',
        (document.getElementById('date') as HTMLInputElement)?.value || ''
      );
      formData.append(
        'notes',
        (document.getElementById('notes') as HTMLTextAreaElement)?.value || ''
      );

      setUploadProgress(30);

      // Upload file
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(90);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data: UploadResponse = await response.json();

      if (data.success) {
        setUploadProgress(100);
        setSuccessResponse(data);

        // Reset form
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        (document.getElementById('passNumber') as HTMLInputElement).value = '';
        (document.getElementById('vehicleNumber') as HTMLInputElement).value = '';
        (document.getElementById('date') as HTMLInputElement).value = '';
        (document.getElementById('notes') as HTMLTextAreaElement).value = '';

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/admin/dashboard"
          className="text-indigo-600 hover:text-indigo-700 mb-6 inline-block"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload DC Pass</h1>
          <p className="text-gray-600 mb-8">
            Upload a PDF document to generate a shareable QR code
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {successResponse && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <p className="font-bold mb-2">✓ Upload Successful!</p>
              <p className="mb-4">Your document has been uploaded successfully.</p>
              <p className="text-sm">Redirecting to dashboard...</p>
            </div>
          )}

          {!successResponse && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF File *
                </label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    required
                    disabled={isLoading}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100
                      disabled:opacity-50"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Maximum file size: 50 MB
                </p>
              </div>

              {/* Pass Number */}
              <div>
                <label
                  htmlFor="passNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Pass Number (Optional)
                </label>
                <input
                  id="passNumber"
                  type="text"
                  placeholder="e.g., DC-2024-001"
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Vehicle Number */}
              <div>
                <label
                  htmlFor="vehicleNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Vehicle Number (Optional)
                </label>
                <input
                  id="vehicleNumber"
                  type="text"
                  placeholder="e.g., ABC-1234"
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date (Optional)
                </label>
                <input
                  id="date"
                  type="date"
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  placeholder="Add any additional notes about this document..."
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Uploading...
                    </span>
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Uploading...
                  </span>
                ) : (
                  'Upload & Generate QR Code'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
