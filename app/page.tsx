import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            DC Pass QR System
          </h1>
          <p className="text-xl text-gray-700 mb-12">
            Securely manage and share DC Pass documents via unique QR codes.
            Fast, simple, and mobile-friendly.
          </p>

          <div className="space-y-4 mb-12">
            <Link
              href="/admin"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Admin Dashboard
            </Link>
            <p className="text-gray-600">Manage and upload DC Pass documents</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <ol className="text-left space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold mr-4 flex-shrink-0">
                  1
                </span>
                <span>Upload a PDF document to the admin panel</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold mr-4 flex-shrink-0">
                  2
                </span>
                <span>Get a unique QR code instantly</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold mr-4 flex-shrink-0">
                  3
                </span>
                <span>Share the QR code or direct link</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold mr-4 flex-shrink-0">
                  4
                </span>
                <span>Users scan or visit the link to view and download</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
