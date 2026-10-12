// src/pages/Dashboard.jsx
// OPTIMIZED VERSION - Enhanced with error handling and performance

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import driveApiService from '../services/enhanced-driveApi';

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

// Plain, minimal state shown while the backend admin-access check is
// in flight, or when access isn't granted. No upload/Drive/automation
// controls are ever rendered alongside this — the gate is all-or-nothing.
const AdminGateMessage = ({ title, message }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-6">
    <div className="text-center max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-gray-400">{message}</p>
    </div>
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

// Access is decided entirely by the backend (GET /api/admin/access, which
// runs through requireAuth + requireAdmin). This component never makes its
// own authorization decision from a UID, email, or any other client-side
// value — it only renders whatever the backend says. That keeps the real
// security boundary on the server; this gate exists purely so a non-admin
// visitor sees a clean message instead of a flash of upload controls.
const useAdminAccess = (user, authLoading) => {
  const [state, setState] = useState('checking'); // checking | signed-out | forbidden | not-configured | authorized | error

  useEffect(() => {
    let cancelled = false;

    if (authLoading) {
      setState('checking');
      return undefined;
    }

    if (!user) {
      setState('signed-out');
      return undefined;
    }

    setState('checking');
    driveApiService.checkAdminAccess().then((result) => {
      if (cancelled) return;
      if (result.authorized) {
        setState('authorized');
        return;
      }
      switch (result.reason) {
        case 'forbidden':
        case 'unauthenticated':
          setState('forbidden');
          break;
        case 'not_configured':
        case 'unreachable':
        case 'error':
        default:
          setState('not-configured');
          break;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return state;
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const accessState = useAdminAccess(user, authLoading);

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
        {accessState === 'checking' && <DashboardLoading />}

        {accessState === 'signed-out' && (
          <AdminGateMessage
            title="Sign in required"
            message="Sign in with an authorized account to access this dashboard."
          />
        )}

        {accessState === 'forbidden' && (
          <AdminGateMessage
            title="Admin access required"
            message="Your account is signed in but is not authorized to view this dashboard."
          />
        )}

        {accessState === 'not-configured' && (
          <AdminGateMessage
            title="Admin services are not configured"
            message="Admin features are currently disabled on this deployment."
          />
        )}

        {accessState === 'authorized' && (
          <Suspense fallback={<DashboardLoading />}>
            <AutomationDashboard />
          </Suspense>
        )}
      </DashboardErrorBoundary>
    </>
  );
};

export default Dashboard;
