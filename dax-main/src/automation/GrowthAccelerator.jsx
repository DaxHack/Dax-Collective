// src/automation/GrowthAccelerator.jsx
import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import RevenueTracker from './RevenueTracker';

const milestones = [
  'First verified click or lead from an approved CTA.',
  'First verified sale, affiliate commission, sponsorship payment, or platform payout.',
  'Repeatable cost and profit tracking for the winning offer.',
  'Only then scale content volume, automation, and spend.',
];

const GrowthAccelerator = () => (
  <div className="space-y-6">
    <div className="rounded-xl border border-blue-800 bg-blue-950/40 p-6 text-blue-100">
      <div className="flex items-start gap-3">
        <ChartBarIcon className="mt-1 h-6 w-6 flex-none text-blue-300" />
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue Readiness Roadmap</h1>
          <p className="mt-2 text-sm text-blue-100">
            Growth projections have been removed until the company has verified conversion data. The next milestone is a real, approved first-dollar path.
          </p>
        </div>
      </div>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-blue-50">
        {milestones.map((milestone) => (
          <li key={milestone}>{milestone}</li>
        ))}
      </ol>
    </div>

    <RevenueTracker />
  </div>
);

export default GrowthAccelerator;
