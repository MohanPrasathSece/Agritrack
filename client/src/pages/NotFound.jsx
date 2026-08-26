import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full text-center py-12 px-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
          >
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full py-3 px-4 bg-white text-gray-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
