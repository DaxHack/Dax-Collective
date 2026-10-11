// src/pages/Dashboard.jsx
// OPTIMIZED VERSION - Enhanced with error handling and performance

import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

// Lazy load AutomationDashboard for better performance
const AutomationDashboard = lazy(() => import('../automation/AutomationDashboard'));

// Loading component
const DashboardLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-white mb-2">Loading Dashboard...</h2>
      <p className="text-gray-400">Preparing your automation tools</p>
    </motion.div>
  </div>
);

// Error boundary component
class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-red-400 mb-2">Dashboard Error</h2>
              <p className="text-gray-300 mb-4">
                There was an issue loading the automation dashboard.
              </p>
              <p className="text-sm text-gray-400 mb-4">
                {this.state.error?.message || 'Unknown error occurred'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Reload Dashboard
              </button>
            </div>
            
            <div className="text-left bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Quick Fixes:</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Check your internet connection</li>
                <li>• Clear browser cache and cookies</li>
                <li>• Ensure all environment variables are set</li>
                <li>• Verify Firebase configuration</li>
              </ul>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard – Dax Collective Automation</title>
        <meta 
          name="description" 
          content="Manage your Dax Collective content automation, uploads, and brand management from one central dashboard." 
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <DashboardErrorBoundary>
        <Suspense fallback={<DashboardLoading />}>
          <AutomationDashboard />
        </Suspense>
      </DashboardErrorBoundary>
    </>
  );
};

export default Dashboard;

