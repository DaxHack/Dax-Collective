//   src/automation/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CogIcon,
  BellIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ShareIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [contentStats, setContentStats] = useState({
    total: 0,
    published: 0,
    scheduled: 0,
    draft: 0,
    processing: 0
  });

  const [workflows, setWorkflows] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [realtimeStats, setRealtimeStats] = useState({
    views: 12847,
    engagement: 8.4,
    followers: 15623,
    revenue: 2847.50
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setContentStats({
        total: 156,
        published: 89,
        scheduled: 23,
        draft: 31,
        processing: 13
      });
      
      setWorkflows([
        { id: 1, name: 'Daily Content Push', status: 'active', lastRun: '2 hours ago' },
        { id: 2, name: 'Social Media Sync', status: 'paused', lastRun: '1 day ago' },
        { id: 3, name: 'Analytics Report', status: 'active', lastRun: '30 minutes ago' }
      ]);
      
      setNotifications([
        { id: 1, type: 'success', message: 'Content published successfully', time: '5 min ago' },
        { id: 2, type: 'warning', message: 'API rate limit approaching', time: '15 min ago' },
        { id: 3, type: 'info', message: 'New follower milestone reached', time: '1 hour ago' }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-lg border border-gray-700/50 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className="text-green-400 text-sm mt-1 flex items-center">
              <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
              +{change}%
            </p>
          )}
        </div>
        <Icon className="w-8 h-8 text-white/80" />
      </div>
    </motion.div>
  );

  const WorkflowCard = ({ workflow }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">{workflow.name}</h3>
          <p className="text-gray-400 text-sm">Last run: {workflow.lastRun}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            workflow.status === 'active' 
              ? 'bg-green-600/30 text-green-300' 
              : 'bg-yellow-600/30 text-yellow-300'
          }`}>
            {workflow.status}
          </span>
          <button className="text-gray-400 hover:text-white">
            {workflow.status === 'active' ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading automation dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Automation Dashboard
          </h1>
          <p className="text-gray-400">Manage your content empire from one central hub</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Content"
            value={contentStats.total}
            icon={ChartBarIcon}
            color="from-blue-600 to-blue-800"
            change={12}
          />
          <StatCard
            title="Published"
            value={contentStats.published}
            icon={CheckCircleIcon}
            color="from-green-600 to-green-800"
            change={8}
          />
          <StatCard
            title="Scheduled"
            value={contentStats.scheduled}
            icon={ClockIcon}
            color="from-yellow-600 to-yellow-800"
            change={15}
          />
          <StatCard
            title="Processing"
            value={contentStats.processing}
            icon={CogIcon}
            color="from-purple-600 to-purple-800"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800/30 backdrop-blur-sm rounded-lg p-1 mb-6 border border-gray-700">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'workflows', label: 'Workflows' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'settings', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              {/* Real-time Stats */}
              <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Real-time Performance</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <EyeIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{realtimeStats.views.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">Views</div>
                  </div>
                  <div className="text-center">
                    <HeartIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{realtimeStats.engagement}%</div>
                    <div className="text-gray-400 text-sm">Engagement</div>
                  </div>
                  <div className="text-center">
                    <ShareIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{realtimeStats.followers.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">Followers</div>
                  </div>
                  <div className="text-center">
                    <ChartBarIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">${realtimeStats.revenue}</div>
                    <div className="text-gray-400 text-sm">Revenue</div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <BellIcon className="w-5 h-5 mr-2" />
                  Notifications
                </h2>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'success' ? 'bg-green-400' :
                        notification.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{notification.message}</p>
                        <p className="text-gray-400 text-xs">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'workflows' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Active Workflows</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  Create Workflow
                </button>
              </div>
              
              <div className="grid gap-4">
                {workflows.map((workflow) => (
                  <WorkflowCard key={workflow.id} workflow={workflow} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Analytics Dashboard</h2>
              <p className="text-gray-400">Detailed analytics and reporting features coming soon...</p>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Automation Settings</h2>
              <p className="text-gray-400">Configuration and settings panel coming soon...</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

