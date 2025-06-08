// src/automation/ContentManager.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  PencilIcon, 
  TrashIcon, 
  ArrowPathIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ContentManager = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedContent, setSelectedContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const brands = [
    { id: 'anidax', name: 'Ani-Dax' },
    { id: 'daxtraveler', name: 'Dax the Traveler' },
    { id: 'godsvessel', name: 'God\'s Vessel' },
    { id: 'timezonetravelers', name: 'Timezone Travelers' }
  ];
  
  const statusOptions = [
    { id: 'all', name: 'All Status', color: 'gray' },
    { id: 'draft', name: 'Draft', color: 'gray' },
    { id: 'processing', name: 'Processing', color: 'yellow' },
    { id: 'scheduled', name: 'Scheduled', color: 'blue' },
    { id: 'published', name: 'Published', color: 'green' },
    { id: 'failed', name: 'Failed', color: 'red' }
  ];

  useEffect(() => {
    // Simulate content data since we don't have actual Firestore data yet
    const mockContent = [
      {
        id: '1',
        title: 'Top 10 Anime Series of 2025',
        brand: 'anidax',
        status: 'published',
        createdAt: new Date('2025-06-01').getTime(),
        publishedAt: new Date('2025-06-03').getTime(),
        author: 'AI Assistant',
        type: 'blog',
        engagement: 1245,
        views: 8976
      },
      {
        id: '2',
        title: 'Hidden Gems in Tokyo for Travelers',
        brand: 'daxtraveler',
        status: 'scheduled',
        createdAt: new Date('2025-06-04').getTime(),
        scheduledFor: new Date('2025-06-10').getTime(),
        author: 'AI Assistant',
        type: 'guide',
        engagement: 0,
        views: 0
      },
      {
        id: '3',
        title: 'Faith in the Digital Age',
        brand: 'godsvessel',
        status: 'draft',
        createdAt: new Date('2025-06-05').getTime(),
        author: 'AI Assistant',
        type: 'article',
        engagement: 0,
        views: 0
      },
      {
        id: '4',
        title: 'Time Management Across Time Zones',
        brand: 'timezonetravelers',
        status: 'processing',
        createdAt: new Date('2025-06-05').getTime(),
        author: 'AI Assistant',
        type: 'infographic',
        engagement: 0,
        views: 0
      },
      {
        id: '5',
        title: 'Seasonal Anime Preview: Summer 2025',
        brand: 'anidax',
        status: 'published',
        createdAt: new Date('2025-05-28').getTime(),
        publishedAt: new Date('2025-05-30').getTime(),
        author: 'AI Assistant',
        type: 'video',
        engagement: 2340,
        views: 15670
      }
    ];
    
    setContent(mockContent);
    setLoading(false);
    
    // In a real implementation, we would use Firestore
    // const contentQuery = query(collection(db, 'content'), orderBy('createdAt', 'desc'), limit(50));
    // const unsubscribe = onSnapshot(contentQuery, (snapshot) => {
    //   const contentData = [];
    //   snapshot.forEach(doc => {
    //     contentData.push({ id: doc.id, ...doc.data() });
    //   });
    //   setContent(contentData);
    //   setLoading(false);
    // });
    
    // return () => unsubscribe();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const filteredContent = content
    .filter(item => {
      // Filter by search term
      if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by status
      if (filterStatus !== 'all' && item.status !== filterStatus) {
        return false;
      }
      
      // Filter by brand
      if (filterBrand !== 'all' && item.brand !== filterBrand) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (a[sortField] < b[sortField]) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
  const handleViewContent = (content) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };
  
  const getBrandName = (brandId) => {
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : brandId;
  };
  
  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(s => s.id === status);
    if (!statusOption) return null;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusOption.color}-100 text-${statusOption.color}-800`}>
        {status === 'published' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
        {status === 'scheduled' && <ClockIcon className="w-3 h-3 mr-1" />}
        {status === 'draft' && <DocumentIcon className="w-3 h-3 mr-1" />}
        {status === 'processing' && <ArrowPathIcon className="w-3 h-3 mr-1 animate-spin" />}
        {statusOption.name}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <DocumentIcon className="h-6 w-6 mr-2 text-blue-400" />
          Content Manager
        </h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
          
          {/* Brand Filter */}
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Brands</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          
          {/* Create New Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 text-sm font-medium flex items-center transition-colors">
            <PlusIcon className="h-4 w-4 mr-1" />
            New Content
          </button>
        </div>
      </div>
      
      {/* Content Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Title
                  {sortField === 'title' && (
                    sortDirection === 'asc' ? 
                    <ArrowUpIcon className="h-4 w-4 ml-1" /> : 
                    <ArrowDownIcon className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('brand')}
              >
                <div className="flex items-center">
                  Brand
                  {sortField === 'brand' && (
                    sortDirection === 'asc' ? 
                    <ArrowUpIcon className="h-4 w-4 ml-1" /> : 
                    <ArrowDownIcon className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? 
                    <ArrowUpIcon className="h-4 w-4 ml-1" /> : 
                    <ArrowDownIcon className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  Created
                  {sortField === 'createdAt' && (
                    sortDirection === 'asc' ? 
                    <ArrowUpIcon className="h-4 w-4 ml-1" /> : 
                    <ArrowDownIcon className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('views')}
              >
                <div className="flex items-center">
                  Views
                  {sortField === 'views' && (
                    sortDirection === 'asc' ? 
                    <ArrowUpIcon className="h-4 w-4 ml-1" /> : 
                    <ArrowDownIcon className="h-4 w-4 ml-1" />
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredContent.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => handleViewContent(item)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{getBrandName(item.brand)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${item.status === 'published' ? 'bg-green-900 text-green-300' : ''}
                    ${item.status === 'scheduled' ? 'bg-blue-900 text-blue-300' : ''}
                    ${item.status === 'draft' ? 'bg-gray-700 text-gray-300' : ''}
                    ${item.status === 'processing' ? 'bg-yellow-900 text-yellow-300' : ''}
                    ${item.status === 'failed' ? 'bg-red-900 text-red-300' : ''}
                  `}>
                    {item.status === 'published' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
                    {item.status === 'scheduled' && <ClockIcon className="w-3 h-3 mr-1" />}
                    {item.status === 'draft' && <DocumentIcon className="w-3 h-3 mr-1" />}
                    {item.status === 'processing' && <ArrowPathIcon className="w-3 h-3 mr-1 animate-spin" />}
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{formatDate(item.createdAt)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{item.views.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button className="text-gray-400 hover:text-blue-400 transition-colors">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-red-400 transition-colors">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <DocumentIcon className="h-12 w-12 mx-auto text-gray-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-300">No content found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
      
      {/* Content Detail Modal */}
      {isModalOpen && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{selectedContent.title}</h3>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Brand</p>
                  <p className="text-white">{getBrandName(selectedContent.brand)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${selectedContent.status === 'published' ? 'bg-green-900 text-green-300' : ''}
                    ${selectedContent.status === 'scheduled' ? 'bg-blue-900 text-blue-300' : ''}
                    ${selectedContent.status === 'draft' ? 'bg-gray-700 text-gray-300' : ''}
                    ${selectedContent.status === 'processing' ? 'bg-yellow-900 text-yellow-300' : ''}
                    ${selectedContent.status === 'failed' ? 'bg-red-900 text-red-300' : ''}
                  `}>
                    {selectedContent.status === 'published' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
                    {selectedContent.status === 'scheduled' && <ClockIcon className="w-3 h-3 mr-1" />}
                    {selectedContent.status === 'draft' && <DocumentIcon className="w-3 h-3 mr-1" />}
                    {selectedContent.status === 'processing' && <ArrowPathIcon className="w-3 h-3 mr-1 animate-spin" />}
                    {selectedContent.status.charAt(0).toUpperCase() + selectedContent.status.slice(1)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Created</p>
                  <p className="text-white">{formatDate(selectedContent.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    {selectedContent.status === 'published' ? 'Published' : 
                     selectedContent.status === 'scheduled' ? 'Scheduled For' : 'Last Updated'}
                  </p>
                  <p className="text-white">
                    {selectedContent.status === 'published' ? formatDate(selectedContent.publishedAt) : 
                     selectedContent.status === 'scheduled' ? formatDate(selectedContent.scheduledFor) : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">Content Preview</p>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-300">
                    This is a preview of the content for "{selectedContent.title}". In a real implementation, 
                    this would show the actual content body, images, and other media associated with this content piece.
                  </p>
                </div>
              </div>
              
              {selectedContent.status === 'published' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Performance</h4>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-2xl font-bold text-white">{selectedContent.views.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Views</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{selectedContent.engagement.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Engagements</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {((selectedContent.engagement / selectedContent.views) * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-400">Engagement Rate</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Distribution</h4>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 bg-blue-500 rounded-full w-1/2"></div>
                      <div className="h-2 bg-green-500 rounded-full w-1/4"></div>
                      <div className="h-2 bg-purple-500 rounded-full w-1/6"></div>
                      <div className="h-2 bg-yellow-500 rounded-full w-1/12"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>Website (50%)</span>
                      <span>Social (25%)</span>
                      <span>Email (16%)</span>
                      <span>Other (9%)</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button 
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;

