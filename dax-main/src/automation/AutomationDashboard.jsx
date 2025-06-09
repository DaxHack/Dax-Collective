// src/automation/AutomationDashboard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CogIcon, 
  DocumentTextIcon,
  BellIcon,
  PlayIcon,
  HomeIcon,
  CurrencyDollarIcon,
  BoltIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import AdminAuth from '../components/AdminAuth';

// Import automation components
import ContentManager from './ContentManager';
import NotificationCenter from './NotificationCenter';
import WorkFlowStatus from './WorkFlowStatus';
import RevenueTracker from './RevenueTracker';
import GrowthAccelerator from './GrowthAccelerator';
import AggressiveAccelerator from './AggressiveAccelerator';
import EmergencyMonetization from './EmergencyMonetization';

// Simple Dashboard Overview Component
const DashboardOverview = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl">
        <h3 className="text-white text-lg font-semibold">Total Revenue</h3>
        <p className="text-3xl font-bold text-white mt-2">$12,847</p>
        <p className="text-blue-200 text-sm">+15% this month</p>
      </div>
      <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl">
        <h3 className="text-white text-lg font-semibold">Active Workflows</h3>
        <p className="text-3xl font-bold text-white mt-2">8</p>
        <p className="text-green-200 text-sm">All running smoothly</p>
      </div>
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl">
        <h3 className="text-white text-lg font-semibold">Content Published</h3>
        <p className="text-3xl font-bold text-white mt-2">156</p>
        <p className="text-purple-200 text-sm">This month</p>
      </div>
      <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 rounded-xl">
        <h3 className="text-white text-lg font-semibold">Engagement Rate</h3>
        <p className="text-3xl font-bold text-white mt-2">8.4%</p>
        <p className="text-yellow-200 text-sm">Above average</p>
      </div>
    </div>
    
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors">
          <FireIcon className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm">Start $50K Plan</span>
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors">
          <BoltIcon className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm">Emergency Mode</span>
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors">
          <DocumentTextIcon className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm">Create Content</span>
        </button>
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg transition-colors">
          <ChartBarIcon className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm">View Analytics</span>
        </button>
      </div>
    </div>
  </div>
);

const AutomationDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Overview', icon: ChartBarIcon, component: DashboardOverview },
    { id: 'aggressive', name: '$50K in 4 Months', icon: FireIcon, component: AggressiveAccelerator },
    { id: 'emergency', name: '$5K in 60 Days', icon: BoltIcon, component: EmergencyMonetization },
    { id: 'growth', name: 'Growth Accelerator', icon: PlayIcon, component: GrowthAccelerator },
    { id: 'revenue', name: 'Revenue Tracker', icon: CurrencyDollarIcon, component: RevenueTracker },
    { id: 'content', name: 'Content Manager', icon: DocumentTextIcon, component: ContentManager },
    { id: 'workflows', name: 'Workflows', icon: CogIcon, component: WorkFlowStatus },
    { id: 'notifications', name: 'Notifications', icon: BellIcon, component: NotificationCenter },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || DashboardOverview;

  return (
    <AdminAuth>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <HomeIcon className="w-5 h-5" />
                  <span>Back to Site</span>
                </Link>
                <div className="w-px h-6 bg-gray-700"></div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Automation Hub
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-900/30 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveComponent />
          </motion.div>
        </div>
      </div>
    </AdminAuth>
  );
};

export default AutomationDashboard;

