// src/components/AdminAuth.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const AdminAuth = ({ children, onAuthenticated }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already authenticated on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('dax_admin_auth');
    const authTime = localStorage.getItem('dax_admin_auth_time');
    
    if (authStatus === 'true' && authTime) {
      const timeDiff = Date.now() - parseInt(authTime);
      // Session expires after 24 hours
      if (timeDiff < 24 * 60 * 60 * 1000) {
        setIsAuthenticated(true);
        onAuthenticated?.(true);
      } else {
        localStorage.removeItem('dax_admin_auth');
        localStorage.removeItem('dax_admin_auth_time');
      }
    }
  }, [onAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Admin password (in production, this would be handled securely)
    const adminPasswords = [
      'DaxCollective2025!',
      'ScaleTo50K!',
      'AutomationHub!',
      'GrowthHacker!'
    ];

    if (adminPasswords.includes(password)) {
      setIsAuthenticated(true);
      localStorage.setItem('dax_admin_auth', 'true');
      localStorage.setItem('dax_admin_auth_time', Date.now().toString());
      onAuthenticated?.(true);
    } else {
      setError('Invalid admin credentials. Access denied.');
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('dax_admin_auth');
    localStorage.removeItem('dax_admin_auth_time');
    onAuthenticated?.(false);
  };

  if (isAuthenticated) {
    return (
      <div className="relative">
        {/* Admin Header */}
        <div className="fixed top-0 right-0 z-50 p-4">
          <div className="bg-red-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <ShieldCheckIcon className="w-4 h-4" />
            <span className="text-sm font-medium">ADMIN MODE</span>
            <button
              onClick={handleLogout}
              className="text-xs bg-red-700 hover:bg-red-800 px-2 py-1 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-red-600/20 border border-red-500/50 rounded-lg p-4 mb-6 text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <LockClosedIcon className="w-6 h-6 text-red-400" />
            <span className="text-red-400 font-bold">RESTRICTED ACCESS</span>
          </div>
          <p className="text-red-300 text-sm">
            This is a private admin dashboard for Dax Collective growth automation.
            Unauthorized access is prohibited.
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Authentication</h1>
            <p className="text-gray-400">Enter admin credentials to access growth dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-600/20 border border-red-500/50 rounded-lg p-3"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Access Admin Dashboard'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Session expires after 24 hours for security
            </p>
          </div>
        </motion.div>

        {/* Development Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-600">
            🔒 Secure admin access for Dax Collective growth automation system
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminAuth;

