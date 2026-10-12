import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  const { pathname } = useLocation();

  return (
    <>
      <Helmet>
        <title>Page Not Found — Dax Collective</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="mb-8">
            <div className="text-[120px] font-black leading-none bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent select-none">
              404
            </div>
            <h1 className="text-2xl font-bold text-white mt-2 mb-3">
              This page doesn't exist
            </h1>
            <p className="text-gray-400 leading-relaxed">
              <code className="text-blue-400 font-mono text-sm bg-gray-800 px-2 py-0.5 rounded">
                {pathname}
              </code>{' '}
              didn't match any route. It may have moved or never existed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors"
            >
              <HomeIcon className="h-4 w-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-full transition-colors border border-gray-700"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Go Back
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Dax the Traveler', to: '/dax-the-traveler' },
              { label: 'Ani-Dax', to: '/ani-dax' },
              { label: 'Timezone Travelers', to: '/timezone-travelers' },
              { label: "God's Vessel", to: '/gods-vessel' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-500 hover:text-blue-400 text-sm py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
