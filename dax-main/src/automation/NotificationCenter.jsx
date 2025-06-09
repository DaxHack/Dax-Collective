import React, { useState } from 'react';
import { 
  BellIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const NotificationCenter = ({ notifications = [] }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock notification data for demonstration
  const mockNotifications = [
    {
      id: '1',
      type: 'success',
      title: 'Content Published Successfully',
      message: 'Your article "Top 10 Anime Series of 2025" has been published to all platforms.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      source: 'Content Manager',
      details: {
        contentId: 'content_123',
        platforms: ['Website', 'Twitter', 'Instagram'],
        engagement: { views: 245, likes: 18, shares: 3 }
      }
    },
    {
      id: '2',
      type: 'warning',
      title: 'Workflow Performance Alert',
      message: 'Social Media Posting workflow has a lower success rate (85%) than usual.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      source: 'Workflow Monitor',
      details: {
        workflowId: 'workflow_456',
        successRate: 85,
        expectedRate: 95,
        failedRuns: 3,
        totalRuns: 20
      }
    },
    {
      id: '3',
      type: 'info',
      title: 'Weekly Report Available',
      message: 'Your weekly content performance report is ready for review.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true,
      source: 'Analytics Engine',
      details: {
        reportPeriod: 'May 30 - June 5, 2025',
        totalViews: 15670,
        totalEngagement: 1245,
        topContent: 'Seasonal Anime Preview: Summer 2025'
      }
    },
    {
      id: '4',
      type: 'error',
      title: 'API Connection Failed',
      message: 'Unable to connect to Instagram API. Content posting has been paused.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      source: 'Social Media Manager',
      details: {
        apiEndpoint: 'Instagram Graph API',
        errorCode: 'RATE_LIMIT_EXCEEDED',
        retryAfter: '2025-06-06T12:00:00Z',
        affectedContent: 2
      }
    },
    {
      id: '5',
      type: 'success',
      title: 'New Content Generated',
      message: 'AI has generated 5 new content ideas for your review.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      read: true,
      source: 'Content Generator',
      details: {
        generatedCount: 5,
        brands: ['Ani-Dax', 'Dax the Traveler', 'God\'s Vessel'],
        contentTypes: ['blog', 'social', 'video'],
        qualityScore: 92
      }
    },
    {
      id: '6',
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'System maintenance is scheduled for tonight at 2:00 AM EST.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      read: true,
      source: 'System Admin',
      details: {
        maintenanceWindow: '2:00 AM - 4:00 AM EST',
        affectedServices: ['Content Generation', 'Social Posting'],
        expectedDowntime: '30 minutes'
      }
    }
  ];
  
  const notificationData = notifications.length > 0 ? notifications : mockNotifications;
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case 'info':
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
    }
  };
  
  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'error':
        return 'border-red-500 bg-red-900/20';
      case 'info':
      default:
        return 'border-blue-500 bg-blue-900/20';
    }
  };
  
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
  
  const filteredNotifications = notificationData
    .filter(notification => {
      // Filter by type
      if (filter !== 'all' && notification.type !== filter) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => b.timestamp - a.timestamp);
  
  const unreadCount = notificationData.filter(n => !n.read).length;
  
  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };
  
  const handleMarkAsRead = (notificationId) => {
    // In a real implementation, this would update Firestore
    console.log(`Mark notification ${notificationId} as read`);
  };
  
  const handleDeleteNotification = (notificationId) => {
    // In a real implementation, this would delete from Firestore
    console.log(`Delete notification ${notificationId}`);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-white flex items-center">
            <BellIcon className="h-6 w-6 mr-2 text-orange-400" />
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="ml-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="info">Info</option>
          </select>
          
          <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2 px-4 text-sm font-medium flex items-center transition-colors">
            <TrashIcon className="h-4 w-4 mr-1" />
            Clear All
          </button>
        </div>
      </div>
      
      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div 
            key={notification.id}
            className={`relative p-4 rounded-xl border-l-4 transition-all duration-200 cursor-pointer hover:bg-gray-700/50 ${
              getNotificationColor(notification.type)
            } ${!notification.read ? 'bg-gray-800' : 'bg-gray-800/50'}`}
            onClick={() => handleViewNotification(notification)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-semibold ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  
                  <p className={`text-sm ${!notification.read ? 'text-gray-300' : 'text-gray-400'} mb-2`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{notification.source}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(notification.timestamp)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleViewNotification(notification)}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        title="View details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      {!notification.read && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-gray-400 hover:text-green-400 transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete notification"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <BellIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No notifications found</h3>
          <p className="text-sm text-gray-500">
            {searchTerm || filter !== 'all' 
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : 'You\'re all caught up! New notifications will appear here.'
            }
          </p>
        </div>
      )}
      
      {/* Notification Detail Modal */}
      {isModalOpen && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(selectedNotification.type)}
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedNotification.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {selectedNotification.source} • {selectedNotification.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 leading-relaxed">{selectedNotification.message}</p>
              </div>
              
              {/* Notification Details */}
              {selectedNotification.details && (
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 mb-6">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Details</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedNotification.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-gray-300">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <div className="flex space-x-3">
                  {!selectedNotification.read && (
                    <button 
                      onClick={() => handleMarkAsRead(selectedNotification.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Mark as Read
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleDeleteNotification(selectedNotification.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
                
                <button 
                  onClick={handleCloseModal}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;

