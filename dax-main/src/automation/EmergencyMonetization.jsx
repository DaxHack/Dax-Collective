// src/automation/EmergencyMonetization.jsx
import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import RevenueTracker from './RevenueTracker';

const allowedActions = [
  'Prepare draft offers and tracking fields.',
  'Use non-affiliate official or resource links while enrollment is unverified.',
  'Record costs, clicks, conversions, and revenue as zero until real data exists.',
  'Ask Daniel before affiliate enrollment, product launch, sponsorship outreach, purchases, or ad spend.',
];

const EmergencyMonetization = () => (
  <div className="space-y-6">
    <div className="rounded-xl border border-red-800 bg-red-950/40 p-6 text-red-100">
      <div className="flex items-start gap-3">
        <ExclamationTriangleIcon className="mt-1 h-6 w-6 flex-none text-red-300" />
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue Safety Gate</h1>
          <p className="mt-2 text-sm text-red-100">
            Emergency monetization is limited to reversible preparation work. No live earning claim, enrollment, public offer, or paid action is verified from this repository state.
          </p>
        </div>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-red-50">
        {allowedActions.map((action) => (
          <li key={action}>- {action}</li>
        ))}
      </ul>
    </div>

    <RevenueTracker />
  </div>
);

export default EmergencyMonetization;
