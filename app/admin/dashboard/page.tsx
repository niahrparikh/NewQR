'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Pass {
  id: string;
  fileName: string;
  fileSize: number;
  passNumber?: string;
  vehicleNumber?: string;
  date?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchPasses = useCallback(async () => {
    try {
      const response = await fetch('/api/passes');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin');
          return;
        }
        throw new Error('Failed to fetch passes');
      }
      const data = await response.json();
      setPasses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchPasses();
  }, [fetchPasses]);

  async function deletePass(id: string) {
    if (!confirm('Are you sure you want to delete this pass?')) return;

    try {
      const response = await fetch(`/api/passes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete pass');
      }

      setPasses(passes.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading passes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your DC Pass documents</p>
          </div>
          <div className="space-x-4">
            <Link
              href="/admin/upload"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Upload New Pass
            </Link>
            <Link
              href="/"
              className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-6 rounded-lg transition"
            >
              Home
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {passes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">No passes uploaded yet</p>
            <Link
              href="/admin/upload"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Upload Your First Pass
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {passes.map((pass) => (
              <div
                key={pass.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {pass.fileName}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {pass.id}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/pass/${pass.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition text-sm"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => deletePass(pass.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">File Size</p>
                    <p className="font-semibold text-gray-900">
                      {formatFileSize(pass.fileSize)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Uploaded</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(pass.createdAt)}
                    </p>
                  </div>
                  {pass.passNumber && (
                    <div>
                      <p className="text-gray-600">Pass Number</p>
                      <p className="font-semibold text-gray-900">
                        {pass.passNumber}
                      </p>
                    </div>
                  )}
                  {pass.vehicleNumber && (
                    <div>
                      <p className="text-gray-600">Vehicle Number</p>
                      <p className="font-semibold text-gray-900">
                        {pass.vehicleNumber}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-600">QR Link:</p>
                  <p className="text-sm font-mono text-blue-600 break-all">
                    {typeof window !== 'undefined'
                      ? `${window.location.origin}/pass/${pass.id}`
                      : `/pass/${pass.id}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
