// src/automation/RevenueTracker.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
  PhotoIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CloudIcon,
  FolderIcon,
  PlusIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  XMarkIcon,        
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const RevenueTracker = () => {
  const [revenueData, setRevenueData] = useState({
    total: 0,
    monthly: 0,
    daily: 0,
    goal: 50000,
    brands: {
      'dax-traveler': { revenue: 0, growth: 0 },
      'ani-dax': { revenue: 0, growth: 0 },
      'timezone-travelers': { revenue: 0, growth: 0 },
      'gods-vessel': { revenue: 0, growth: 0 }
    },
    sources: {
      youtube: 0,
      affiliates: 0,
      sponsorships: 0,
      products: 0,
      courses: 0
    }
  });

  const [timeframe, setTimeframe] = useState('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading revenue data
    setTimeout(() => {
      setRevenueData({
        total: 2847,
        monthly: 1250,
        daily: 42,
        goal: 50000,
        brands: {
          'dax-traveler': { revenue: 1200, growth: 15.2 },
          'ani-dax': { revenue: 650, growth: 8.7 },
          'timezone-travelers': { revenue: 800, growth: 22.1 },
          'gods-vessel': { revenue: 197, growth: 5.3 }
        },
        sources: {
          youtube: 1200,
          affiliates: 850,
          sponsorships: 500,
          products: 200,
          courses: 97
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  const progressToGoal = (revenueData.total / revenueData.goal) * 100;
  const monthsToGoal = Math.ceil((revenueData.goal - revenueData.total) / (revenueData.monthly || 1));

  const brandNames = {
    'dax-traveler': 'Dax the Traveler',
    'ani-dax': 'Ani-Dax',
    'timezone-travelers': 'Timezone Travelers',
    'gods-vessel': "God's Vessel"
  };

  const brandColors = {
    'dax-traveler': 'from-blue-500 to-green-500',
    'ani-dax': 'from-purple-500 to-pink-500',
    'timezone-travelers': 'from-orange-500 to-red-500',
    'gods-vessel': 'from-indigo-500 to-purple-500'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Revenue Tracker</h2>
        <div className="flex space-x-2">
          {['daily', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeframe === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold">${revenueData.total.toLocaleString()}</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Monthly Revenue</p>
              <p className="text-3xl font-bold">${revenueData.monthly.toLocaleString()}</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Daily Average</p>
              <p className="text-3xl font-bold">${revenueData.daily}</p>
            </div>
            <CalendarIcon className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Months to $50K</p>
              <p className="text-3xl font-bold">{monthsToGoal}</p>
            </div>
            <ArrowTrendingUpIcon className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Goal Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Progress to $50K Goal</h3>
          <span className="text-2xl font-bold text-green-400">{progressToGoal.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressToGoal}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full"
          />
        </div>
        <p className="text-gray-400">
          ${(revenueData.goal - revenueData.total).toLocaleString()} remaining to reach your goal
        </p>
      </motion.div>

      {/* Brand Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Revenue by Brand</h3>
          <div className="space-y-4">
            {Object.entries(revenueData.brands).map(([brand, data]) => (
              <div key={brand} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${brandColors[brand]}`} />
                  <span className="text-white font-medium">{brandNames[brand]}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold">${data.revenue}</span>
                  <div className={`flex items-center ${data.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.growth >= 0 ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                    <span className="text-sm">{Math.abs(data.growth)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Revenue Sources</h3>
          <div className="space-y-4">
            {Object.entries(revenueData.sources).map(([source, amount]) => (
              <div key={source} className="flex items-center justify-between">
                <span className="text-gray-300 capitalize">{source}</span>
                <span className="text-white font-bold">${amount}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Add Revenue
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
            Export Data
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
            Set Goals
          </button>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
            View Analytics
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RevenueTracker;

