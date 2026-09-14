// src/automation/ContentManager.jsx
import React, { useMemo, useState } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const queueItems = [
  {
    id: 'anidax-sprint-1-sample',
    title: "Subaru's Return by Death Is Not a Power Fantasy",
    brand: 'anidax',
    brandName: 'Ani-Dax',
    status: 'ready_for_review',
    createdAt: '2026-09-13',
    owner: 'Daniel',
    type: 'approval package',
    artifactPath: 'artifacts/anidax/sprint-1-sample/',
    nextAction: 'Approve concept/script plus final voice and visual style before public publishing.',
    publishAllowed: false,
    verifiedViews: 0,
  },
  {
    id: 'gods-vessel-names-of-god',
    title: 'Names of God collection',
    brand: 'godsvessel',
    brandName: "God's Vessel",
    status: 'approval_required',
    createdAt: '2026-09-13',
    owner: 'Daniel',
    type: 'commerce handoff',
    artifactPath: 'artifacts/gods-vessel/names-of-god/',
    nextAction: 'Approve theology, vendor, pricing, storefront setup, and launch timing.',
    publishAllowed: false,
    verifiedViews: 0,
  },
  {
    id: 'tzt-2026-09-13-tokyo-seoul-night-owl',
    title: 'Tokyo vs Seoul: Which First Trip Fits Night-Owl Travelers?',
    brand: 'timezonetravelers',
    brandName: 'Time-Zone Travelers',
    status: 'ready_for_review',
    createdAt: '2026-09-13',
    owner: 'Daniel',
    type: 'source-backed travel video package',
    artifactPath: 'artifacts/timezone-travelers/sprint-3-sample/',
    nextAction: 'Approve concept/script, final source check, narration, account mapping, and links.',
    publishAllowed: false,
    verifiedViews: 0,
  },
  {
    id: 'dtt-2026-09-13-puerto-rico-repurpose',
    title: 'The Travel Moment Worth Saving',
    brand: 'daxtraveler',
    brandName: 'Dax the Traveler',
    status: 'ready_for_review',
    createdAt: '2026-09-13',
    owner: 'Daniel',
    type: 'Daniel media support package',
    artifactPath: 'artifacts/dax-the-traveler/sprint-4-support/',
    nextAction: 'Approve selected assets, repurposing angle, final narration, and publishing target.',
    publishAllowed: false,
    verifiedViews: 0,
  },
];

const statusLabels = {
  ready_for_review: 'Ready For Review',
  approval_required: 'Approval Required',
  blocked: 'Blocked',
};

const statusStyles = {
  ready_for_review: 'bg-blue-900 text-blue-300',
  approval_required: 'bg-yellow-900 text-yellow-300',
  blocked: 'bg-red-900 text-red-300',
};

const statusIcons = {
  ready_for_review: CheckCircleIcon,
  approval_required: ClockIcon,
  blocked: DocumentIcon,
};

const brands = [
  { id: 'all', name: 'All Brands' },
  { id: 'anidax', name: 'Ani-Dax' },
  { id: 'daxtraveler', name: 'Dax the Traveler' },
  { id: 'godsvessel', name: "God's Vessel" },
  { id: 'timezonetravelers', name: 'Time-Zone Travelers' },
];

const statusOptions = [
  { id: 'all', name: 'All Status' },
  { id: 'ready_for_review', name: 'Ready For Review' },
  { id: 'approval_required', name: 'Approval Required' },
  { id: 'blocked', name: 'Blocked' },
];

const ContentManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [selectedContent, setSelectedContent] = useState(null);

  const filteredContent = useMemo(() => (
    queueItems.filter((item) => {
      const matchesSearch = !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesBrand = filterBrand === 'all' || item.brand === filterBrand;
      return matchesSearch && matchesStatus && matchesBrand;
    })
  ), [searchTerm, filterStatus, filterBrand]);

  const renderStatus = (status) => {
    const Icon = statusIcons[status] || DocumentIcon;
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status] || 'bg-gray-700 text-gray-300'}`}>
        <Icon className="mr-1 h-3 w-3" />
        {statusLabels[status] || status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="flex items-center text-xl font-bold text-white">
            <DocumentIcon className="mr-2 h-6 w-6 text-blue-400" />
            Content Approval Queue
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Current durable packages only. No listed item has been published.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search queue..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="rounded-lg border border-gray-600 bg-gray-700 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>

          <select
            value={filterBrand}
            onChange={(event) => setFilterBrand(event.target.value)}
            className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Publish</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Verified Views</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredContent.map((item) => (
              <tr key={item.id} className="cursor-pointer transition-colors hover:bg-gray-700" onClick={() => setSelectedContent(item)}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-white">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.type}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{item.brandName}</td>
                <td className="whitespace-nowrap px-6 py-4">{renderStatus(item.status)}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-red-300">
                  {item.publishAllowed ? 'Allowed' : 'Blocked pending approval'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">{item.verifiedViews.toLocaleString()}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    className="text-gray-400 transition-colors hover:text-blue-400"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedContent(item);
                    }}
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredContent.length === 0 && (
        <div className="py-12 text-center">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-300">No content found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting search or filters.</p>
        </div>
      )}

      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-gray-700 bg-gray-800 shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedContent.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">{selectedContent.id}</p>
                </div>
                <button onClick={() => setSelectedContent(null)} className="text-gray-400 hover:text-white">
                  Close
                </button>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm text-gray-400">Brand</p>
                  <p className="text-white">{selectedContent.brandName}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-400">Status</p>
                  {renderStatus(selectedContent.status)}
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-400">Owner</p>
                  <p className="text-white">{selectedContent.owner}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-400">Created</p>
                  <p className="text-white">{selectedContent.createdAt}</p>
                </div>
              </div>

              <div className="mb-6 rounded-lg border border-gray-700 bg-gray-900 p-4">
                <p className="mb-1 text-sm text-gray-400">Artifact Path</p>
                <p className="font-mono text-sm text-gray-200">{selectedContent.artifactPath}</p>
              </div>

              <div className="mb-6 rounded-lg border border-gray-700 bg-gray-900 p-4">
                <p className="mb-1 text-sm text-gray-400">Next Action</p>
                <p className="text-gray-200">{selectedContent.nextAction}</p>
              </div>

              <div className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-200">
                Public publishing, affiliate links, purchases, and credential changes remain blocked until Daniel approves the specific item and account mapping is verified.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
