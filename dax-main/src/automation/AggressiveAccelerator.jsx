// src/automation/AggressiveAccelerator.jsx
import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import RevenueTracker from './RevenueTracker';

const readinessRows = [
  'Use only verified platform, store, or provider data for revenue.',
  'Do not activate ad spend, affiliate links, sponsorship offers, or public publishing without Daniel approval.',
  'Prioritize the smallest real conversion path before scaling volume.',
];

const AggressiveAccelerator = () => (
  <div className="space-y-6">
    <div className="rounded-xl border border-yellow-700 bg-yellow-950/40 p-6 text-yellow-100">
      <div className="flex items-start gap-3">
        <ExclamationTriangleIcon className="mt-1 h-6 w-6 flex-none text-yellow-300" />
        <div>
          <h1 className="text-2xl font-bold text-white">Growth Readiness Gate</h1>
          <p className="mt-2 text-sm text-yellow-100">
            The previous aggressive accelerator used projected revenue and unverified monetization steps. This view now stays conservative until real conversion data exists.
          </p>
        </div>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-yellow-50">
        {readinessRows.map((row) => (
          <li key={row}>- {row}</li>
        ))}
      </ul>
    </div>

    <RevenueTracker />
  </div>
);

export default AggressiveAccelerator;
