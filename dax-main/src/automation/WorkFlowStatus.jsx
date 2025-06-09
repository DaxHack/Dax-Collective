//   src/automation/WorkFlowStatus.jsx
import React, { useState } from 'react';
import { 
    
  CogIcon, 
  PlayIcon, 
  PauseIcon, 
  StopIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,

} from '@heroicons/react/24/outline';

const WorkflowStatus = ({ workflows = [] }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock workflow data for demonstration
  const mockWorkflows = [
    {
      id: '1',
      name: 'Daily Content Generation',
      description: 'Automatically generates content ideas and drafts for all brands',
      status: 'active',
      lastRun: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      nextRun: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
      successRate: 98.5,
      totalRuns: 247,
      avgDuration: 45, // seconds
      triggers: ['schedule', 'webhook'],
      actions: ['content-generation', 'firestore-save', 'notification'],
      schedule: 'Daily at 6:00 AM',
      enabled: true,
      logs: [
        { timestamp: new Date(Date.now() - 2 * 60 * 1000), status: 'success', message: 'Generated 5 content pieces successfully' },
        { timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), status: 'success', message: 'Generated 4 content pieces successfully' },
        { timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), status: 'warning', message: 'Generated 3 content pieces, 1 failed validation' }
      ]
    },
    {
      id: '2',
      name: 'Social Media Posting',
      description: 'Publishes approved content to social media platforms',
      status: 'active',
      lastRun: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      nextRun: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      successRate: 95.2,
      totalRuns: 156,
      avgDuration: 23,
      triggers: ['schedule', 'content-approved'],
      actions: ['social-post', 'analytics-track', 'notification'],
      schedule: 'Every 4 hours',
      enabled: true,
      logs: [
        { timestamp: new Date(Date.now() - 60 * 60 * 1000), status: 'success', message: 'Posted to 3 platforms successfully' },
        { timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), status: 'success', message: 'Posted to 2 platforms successfully' },
        { timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000), status: 'error', message: 'Failed to post to Instagram - API rate limit' }
      ]
    },
    {
      id: '3',
      name: 'Analytics Collection',
      description: 'Collects performance data from all platforms',
      status: 'paused',
      lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      nextRun: null,
      successRate: 100,
      totalRuns: 89,
      avgDuration: 12,
      triggers: ['schedule'],
      actions: ['data-collection', 'firestore-update', 'report-generation'],
      schedule: 'Every 6 hours',
      enabled: false,
      logs: [
        { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), status: 'success', message: 'Collected analytics from 5 platforms' },
        { timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), status: 'success', message: 'Collected analytics from 5 platforms' }
      ]
    },
    {
      id: '4',
      name: 'Content Optimization',
      description: 'Analyzes and optimizes content performance',
      status: 'error',
      lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      nextRun: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      successRate: 87.3,
      totalRuns: 67,
      avgDuration: 78,
      triggers: ['schedule', 'performance-threshold'],
      actions: ['content-analysis', 'optimization-suggestions', 'notification'],
      schedule: 'Daily at 2:00 PM',
      enabled: true,
      logs: [
        { timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), status: 'error', message: 'Failed to connect to analytics API' },
        { timestamp: new Date(Date.now() - 27 * 60 * 60 * 1000), status: 'success', message: 'Optimized 8 content pieces' }
      ]
    },
    {
      id: '5',
      name: 'Email Newsletter',
      description: 'Sends weekly newsletter with top content',
      status: 'scheduled',
      lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      successRate: 99.1,
      totalRuns: 23,
      avgDuration: 156,
      triggers: ['schedule'],
      actions: ['content-curation', 'email-send', 'analytics-track'],
      schedule: 'Weekly on Sundays at 8:00 AM',
      enabled: true,
      logs: [
        { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), status: 'success', message: 'Newsletter sent to 1,247 subscribers' }
      ]
    }
  ];
  
  const workflowData = workflows.length > 0 ? workflows : mockWorkflows;
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <PlayIcon className="h-4 w-4 text-green-400" />;
      case 'paused':
        return <PauseIcon className="h-4 w-4 text-yellow-400" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-400" />;
      case 'scheduled':
        return <ClockIcon className="h-4 w-4 text-blue-400" />;
      default:
        return <StopIcon className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-300 border-green-700';
      case 'paused':
        return 'bg-yellow-900 text-yellow-300 border-yellow-700';
      case 'error':
        return 'bg-red-900 text-red-300 border-red-700';
      case 'scheduled':
        return 'bg-blue-900 text-blue-300 border-blue-700';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };
  
  const formatRelativeTime = (date) => {
    if (!date) return 'Never';
    
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
  
  const formatNextRun = (date) => {
    if (!date) return 'Manual';
    
    const now = new Date();
    const diff = date - now;
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Starting soon';
    if (diffMinutes < 60) return `in ${diffMinutes}m`;
    if (diffHours < 24) return `in ${diffHours}h ${diffMinutes % 60}m`;
    return `in ${diffDays}d ${diffHours % 24}h`;
  };
  
  const handleViewWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWorkflow(null);
  };
  
  const handleWorkflowAction = (workflowId, action) => {
    console.log(`${action} workflow ${workflowId}`);
    // In a real implementation, this would call Firebase Functions
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <CogIcon className="h-6 w-6 mr-2 text-purple-400" />
          Workflow Status
        </h2>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-1"></div>
              <span>{workflowData.filter(w => w.status === 'active').length} Active</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-yellow-400 rounded-full mr-1"></div>
              <span>{workflowData.filter(w => w.status === 'paused').length} Paused</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-red-400 rounded-full mr-1"></div>
              <span>{workflowData.filter(w => w.status === 'error').length} Error</span>
            </div>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 text-sm font-medium flex items-center transition-colors">
            <CogIcon className="h-4 w-4 mr-1" />
            New Workflow
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {workflowData.map((workflow) => (
          <div 
            key={workflow.id}
            className="bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer group"
            onClick={() => handleViewWorkflow(workflow)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {workflow.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {workflow.description}
                  </p>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(workflow.status)}`}>
                  {getStatusIcon(workflow.status)}
                  <span className="ml-1 capitalize">{workflow.status}</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Success Rate</span>
                    <ChartBarIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-lg font-bold text-white mt-1">{workflow.successRate}%</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Total Runs</span>
                    <ArrowPathIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-lg font-bold text-white mt-1">{workflow.totalRuns}</p>
                </div>
              </div>
              
              {/* Timing */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Last run:</span>
                  <span className="text-gray-300">{formatRelativeTime(workflow.lastRun)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Next run:</span>
                  <span className="text-gray-300">{formatNextRun(workflow.nextRun)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Avg duration:</span>
                  <span className="text-gray-300">{workflow.avgDuration}s</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  {workflow.status === 'active' ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWorkflowAction(workflow.id, 'pause');
                      }}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors"
                      title="Pause workflow"
                    >
                      <PauseIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWorkflowAction(workflow.id, 'start');
                      }}
                      className="text-green-400 hover:text-green-300 transition-colors"
                      title="Start workflow"
                    >
                      <PlayIcon className="h-5 w-5" />
                    </button>
                  )}
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWorkflowAction(workflow.id, 'run');
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Run now"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewWorkflow(workflow);
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="View details"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWorkflowAction(workflow.id, 'edit');
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Edit workflow"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Workflow Detail Modal */}
      {isModalOpen && selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedWorkflow.name}</h3>
                  <p className="text-gray-400 mt-1">{selectedWorkflow.description}</p>
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
              
              {/* Status and Controls */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedWorkflow.status)}`}>
                    {getStatusIcon(selectedWorkflow.status)}
                    <span className="ml-2 capitalize">{selectedWorkflow.status}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Schedule: {selectedWorkflow.schedule}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {selectedWorkflow.status === 'active' ? (
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
                      <PauseIcon className="h-4 w-4 mr-1" />
                      Pause
                    </button>
                  ) : (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
                      <PlayIcon className="h-4 w-4 mr-1" />
                      Start
                    </button>
                  )}
                  
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                    Run Now
                  </button>
                  
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Success Rate</h4>
                  <p className="text-2xl font-bold text-green-400">{selectedWorkflow.successRate}%</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Total Runs</h4>
                  <p className="text-2xl font-bold text-white">{selectedWorkflow.totalRuns}</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Avg Duration</h4>
                  <p className="text-2xl font-bold text-white">{selectedWorkflow.avgDuration}s</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Next Run</h4>
                  <p className="text-lg font-bold text-blue-400">{formatNextRun(selectedWorkflow.nextRun)}</p>
                </div>
              </div>
              
              {/* Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3">Triggers</h4>
                  <div className="space-y-2">
                    {selectedWorkflow.triggers.map((trigger, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="h-2 w-2 bg-blue-400 rounded-full mr-2"></div>
                        <span className="text-gray-300 capitalize">{trigger.replace('-', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3">Actions</h4>
                  <div className="space-y-2">
                    {selectedWorkflow.actions.map((action, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-gray-300 capitalize">{action.replace('-', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Recent Logs */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  {selectedWorkflow.logs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg">
                      <div className={`flex-shrink-0 mt-0.5 h-2 w-2 rounded-full ${
                        log.status === 'success' ? 'bg-green-400' :
                        log.status === 'warning' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-300">{log.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {log.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <div className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'success' ? 'bg-green-900 text-green-300' :
                        log.status === 'warning' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {log.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700 mt-6">
                <button 
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Full Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowStatus;

