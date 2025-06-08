// src/pages/AutomationDashboard.jsx
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
import Dashboard from '../automation/Dashboard';
import ContentManager from '../automation/ContentManager';
import NotificationCenter from '../automation/NotificationCenter';
import WorkFlowStatus from '../automation/WorkFlowStatus';
import RevenueTracker from '../automation/RevenueTracker';
import GrowthAccelerator from '../automation/GrowthAccelerator';
import AggressiveAccelerator from '../automation/AggressiveAccelerator';
import EmergencyMonetization from '../automation/EmergencyMonetization';

const AutomationDashboard = () => {
  const [activeTab, setActiveTab] = useState('aggressive');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon, component: Dashboard },
    { id: 'aggressive', name: '$50K in 4 Months', icon: FireIcon, component: AggressiveAccelerator },
    { id: 'emergency', name: '$5K in 60 Days', icon: BoltIcon, component: EmergencyMonetization },
    { id: 'growth', name: 'Growth Accelerator', icon: PlayIcon, component: GrowthAccelerator },
    { id: 'revenue', name: 'Revenue Tracker', icon: CurrencyDollarIcon, component: RevenueTracker },
    { id: 'content', name: 'Content Manager', icon: DocumentTextIcon, component: ContentManager },
    { id: 'workflows', name: 'Workflows', icon: CogIcon, component: WorkFlowStatus },
    { id: 'notifications', name: 'Notifications', icon: BellIcon, component: NotificationCenter },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;

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
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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

