// src/automation/RevenueTracker.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const revenueState = {
  verifiedRevenue: 0,
  verifiedMonthlyRevenue: 0,
  verifiedCosts: 0,
  profitEstimate: 0,
  target: 50000,
};

const brandReadiness = [
  {
    brand: 'Ani-Dax',
    revenuePath: 'YouTube monetization later, sponsorships later, original merch later',
    verifiedRevenue: 0,
    status: 'Approval package ready; no public publishing or monetized links approved.',
    nextAction: 'Approve content, narration, account mapping, and monetization links.',
  },
  {
    brand: "God's Vessel",
    revenuePath: 'Names of God apparel collection through future Printify/Shopify setup',
    verifiedRevenue: 0,
    status: 'Draft collection ready; no live checkout or product sale path verified.',
    nextAction: 'Approve theology/design/vendor/pricing and configure storefront.',
  },
  {
    brand: 'Time-Zone Travelers',
    revenuePath: 'Future travel affiliates, activities/tours, travel products, guides',
    verifiedRevenue: 0,
    status: 'Sample package ready; no active affiliate enrollment claimed.',
    nextAction: 'Approve sample, final source check, narration, and outbound attribution links.',
  },
  {
    brand: 'Dax the Traveler',
    revenuePath: 'Travel affiliates, gear, activity links, sponsorships, guides later',
    verifiedRevenue: 0,
    status: 'Support package ready; no personal-brand publishing or monetized CTA approved.',
    nextAction: 'Approve Daniel footage use, narration, and any monetized links.',
  },
];

const sourceRows = [
  { source: 'YouTube ads', verified: 0, state: 'Not verified as currently earning' },
  { source: 'Affiliates', verified: 0, state: 'No active enrollment/link approval verified' },
  { source: 'Products', verified: 0, state: 'No live checkout or paid order path verified' },
  { source: 'Sponsorships', verified: 0, state: 'No signed sponsorships verified' },
  { source: 'Digital guides/courses', verified: 0, state: 'Future path only' },
];

const formatUsd = (amount) => `$${amount.toLocaleString()}`;

const RevenueTracker = () => {
  const progressToGoal = revenueState.target
    ? (revenueState.verifiedRevenue / revenueState.target) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Revenue Readiness</h2>
          <p className="text-sm text-gray-400">
            Verified revenue only. Draft opportunities are not counted as earnings.
          </p>
        </div>
        <div className="rounded-lg border border-yellow-700 bg-yellow-950/40 px-4 py-3 text-sm text-yellow-200">
          <ExclamationTriangleIcon className="mr-2 inline h-5 w-5" />
          Public selling, affiliate links, and sponsorship claims require Daniel approval.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-gradient-to-r from-green-700 to-emerald-700 p-6 text-white"
        >
          <p className="text-sm text-green-100">Verified Revenue</p>
          <p className="mt-2 text-3xl font-bold">{formatUsd(revenueState.verifiedRevenue)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-gradient-to-r from-blue-700 to-cyan-700 p-6 text-white"
        >
          <p className="text-sm text-blue-100">Verified Monthly Revenue</p>
          <p className="mt-2 text-3xl font-bold">{formatUsd(revenueState.verifiedMonthlyRevenue)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-gradient-to-r from-purple-700 to-pink-700 p-6 text-white"
        >
          <p className="text-sm text-purple-100">Verified Costs</p>
          <p className="mt-2 text-3xl font-bold">{formatUsd(revenueState.verifiedCosts)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-gradient-to-r from-orange-700 to-red-700 p-6 text-white"
        >
          <p className="text-sm text-orange-100">Profit Estimate</p>
          <p className="mt-2 text-3xl font-bold">{formatUsd(revenueState.profitEstimate)}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl bg-gray-800 p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Progress to $50K Goal</h3>
          <span className="text-2xl font-bold text-green-400">{progressToGoal.toFixed(1)}%</span>
        </div>
        <div className="mb-4 h-4 w-full rounded-full bg-gray-700">
          <div className="h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${progressToGoal}%` }} />
        </div>
        <p className="text-gray-400">
          {formatUsd(revenueState.target - revenueState.verifiedRevenue)} remaining. This dashboard will stay at zero until revenue is actually tracked from approved channels.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl bg-gray-800 p-6"
        >
          <h3 className="mb-4 flex items-center text-xl font-bold text-white">
            <ChartBarIcon className="mr-2 h-5 w-5 text-blue-300" />
            Brand Revenue Readiness
          </h3>
          <div className="space-y-4">
            {brandReadiness.map((brand) => (
              <div key={brand.brand} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{brand.brand}</p>
                    <p className="mt-1 text-sm text-gray-400">{brand.revenuePath}</p>
                  </div>
                  <span className="font-bold text-white">{formatUsd(brand.verifiedRevenue)}</span>
                </div>
                <p className="mt-3 text-sm text-yellow-200">{brand.status}</p>
                <p className="mt-2 text-sm text-gray-300">{brand.nextAction}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl bg-gray-800 p-6"
        >
          <h3 className="mb-4 flex items-center text-xl font-bold text-white">
            <CurrencyDollarIcon className="mr-2 h-5 w-5 text-green-300" />
            Revenue Sources
          </h3>
          <div className="space-y-4">
            {sourceRows.map((source) => (
              <div key={source.source} className="flex items-start justify-between gap-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
                <div>
                  <p className="font-semibold text-white">{source.source}</p>
                  <p className="mt-1 text-sm text-gray-400">{source.state}</p>
                </div>
                <span className="font-bold text-white">{formatUsd(source.verified)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RevenueTracker;
