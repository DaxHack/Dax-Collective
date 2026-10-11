// src/automation/ContentPackages.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  RectangleStackIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
  LightBulbIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { getPackages, savePackage, deletePackage, getIdeas } from './contentStore';

const BRANDS = [
  { id: 'anidax', name: 'Ani-Dax' },
  { id: 'daxtraveler', name: 'Dax the Traveler' },
  { id: 'godsvessel', name: "God's Vessel" },
  { id: 'timezonetravelers', name: 'Timezone Travelers' },
];

const CONTENT_TYPES = ['blog', 'guide', 'article', 'video', 'short', 'infographic'];
const PLATFORMS = ['', 'youtube', 'tiktok', 'instagram', 'blog', 'twitter', 'facebook'];
const PRIORITIES = ['low', 'medium', 'high'];

const STATUSES = [
  { id: 'Researching', color: 'bg-orange-900 text-orange-300 border-orange-700' },
  { id: 'Script Needed', color: 'bg-yellow-900 text-yellow-300 border-yellow-700' },
  { id: 'In Production', color: 'bg-blue-900 text-blue-300 border-blue-700' },
  { id: 'Review', color: 'bg-purple-900 text-purple-300 border-purple-700' },
  { id: 'Done', color: 'bg-green-900 text-green-300 border-green-700' },
];

function getBrandLabel(id) {
  return BRANDS.find((b) => b.id === id)?.name || id;
}

function getBrandColor(id) {
  const map = {
    anidax: 'bg-purple-900 text-purple-300',
    daxtraveler: 'bg-blue-900 text-blue-300',
    godsvessel: 'bg-yellow-900 text-yellow-300',
    timezonetravelers: 'bg-green-900 text-green-300',
  };
  return map[id] || 'bg-gray-700 text-gray-300';
}

function getStatusStyle(status) {
  return STATUSES.find((s) => s.id === status)?.color || 'bg-gray-700 text-gray-300 border-gray-600';
}

function getPriorityColor(p) {
  return p === 'high'
    ? 'bg-red-900 text-red-300'
    : p === 'medium'
    ? 'bg-orange-900 text-orange-300'
    : 'bg-gray-700 text-gray-400';
}

export default function ContentPackages({ highlightId, onHighlightClear }) {
  const [packages, setPackages] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const [editPkg, setEditPkg] = useState(null);
  const [form, setForm] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(() => {
    setPackages(getPackages());
    setIdeas(getIdeas());
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-open highlight on mount/change
  useEffect(() => {
    if (highlightId) {
      const pkg = getPackages().find((p) => p.id === highlightId);
      if (pkg) openEdit(pkg);
      onHighlightClear && onHighlightClear();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightId]);

  const openEdit = (pkg) => {
    setEditPkg(pkg);
    setForm({
      title: pkg.title,
      brand: pkg.brand,
      contentType: pkg.contentType,
      platform: pkg.platform || '',
      priority: pkg.priority,
      status: pkg.status,
      notes: pkg.notes || '',
    });
    setSaved(false);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    savePackage({ ...form, id: editPkg.id });
    load();
    setSaved(true);
    setTimeout(() => setModalOpen(false), 800);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this content package?')) return;
    deletePackage(id);
    load();
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const getSourceIdea = (pkg) => ideas.find((i) => i.id === pkg.sourceIdeaId);

  const filtered = packages
    .filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterBrand !== 'all' && p.brand !== filterBrand) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => {
      const av = a[sortField] ?? 0;
      const bv = b[sortField] ?? 0;
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ field }) =>
    sortField === field ? (
      sortDir === 'asc' ? <ArrowUpIcon className="h-3 w-3 ml-1 inline" /> : <ArrowDownIcon className="h-3 w-3 ml-1 inline" />
    ) : null;

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <RectangleStackIcon className="h-6 w-6 text-blue-400" />
          Content Packages
          <span className="text-sm font-normal text-gray-400 ml-1">({filtered.length})</span>
        </h2>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Brands</option>
            {BRANDS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.id}</option>)}
          </select>
        </div>
      </div>

      {/* Status summary chips */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const count = packages.filter((p) => p.status === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => setFilterStatus(filterStatus === s.id ? 'all' : s.id)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-opacity ${s.color} ${filterStatus === s.id ? 'opacity-100 ring-2 ring-white/20' : 'opacity-70 hover:opacity-100'}`}
            >
              {s.id}
              <span className="ml-1 bg-black/20 rounded-full px-1.5 py-0.5 text-xs">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {[
                { label: 'Title', field: 'title' },
                { label: 'Brand', field: 'brand' },
                { label: 'Type', field: 'contentType' },
                { label: 'Status', field: 'status' },
                { label: 'Priority', field: 'priority' },
                { label: 'Created', field: 'createdAt' },
              ].map(({ label, field }) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-gray-200"
                >
                  {label}<SortIcon field={field} />
                </th>
              ))}
              <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800/40">
            {filtered.map((pkg) => {
              const sourceIdea = getSourceIdea(pkg);
              return (
                <tr key={pkg.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-white">{pkg.title}</div>
                    {sourceIdea && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <LightBulbIcon className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-gray-500">From idea: {sourceIdea.title}</span>
                      </div>
                    )}
                    {pkg.platform && (
                      <span className="text-xs text-gray-500 capitalize">{pkg.platform}</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getBrandColor(pkg.brand)}`}>
                      {getBrandLabel(pkg.brand)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-300 capitalize">{pkg.contentType}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(pkg.status)}`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(pkg.priority)}`}>
                      {pkg.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">
                    {pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(pkg)}
                        className="text-gray-400 hover:text-yellow-400 transition-colors"
                        title="Edit package"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete package"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-14">
            <RectangleStackIcon className="h-10 w-10 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">
              {packages.length === 0
                ? 'No packages yet. Create one from a Content Idea.'
                : 'No packages match your filters.'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {modalOpen && editPkg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <RectangleStackIcon className="h-5 w-5 text-blue-400" />
                  Edit Content Package
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Source idea reference */}
              {getSourceIdea(editPkg) && (
                <div className="mx-6 mt-4 flex items-center gap-2 px-3 py-2 bg-yellow-900/30 border border-yellow-800/50 rounded-lg">
                  <LightBulbIcon className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                  <span className="text-xs text-yellow-300">
                    Linked to idea: <strong>{getSourceIdea(editPkg).title}</strong>
                  </span>
                </div>
              )}

              <div className="px-6 py-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Brand */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Brand</label>
                    <select
                      value={form.brand}
                      onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {BRANDS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>

                  {/* Content Type */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Content Type</label>
                    <select
                      value={form.contentType}
                      onChange={(e) => setForm((f) => ({ ...f, contentType: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>

                  {/* Platform */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Platform</label>
                    <select
                      value={form.platform}
                      onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">— Any —</option>
                      {PLATFORMS.filter(Boolean).map((p) => (
                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setForm((f) => ({ ...f, status: s.id }))}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${s.color} ${
                          form.status === s.id ? 'ring-2 ring-white/30 opacity-100' : 'opacity-50 hover:opacity-80'
                        }`}
                      >
                        {s.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-700">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.title.trim()}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                    saved
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white'
                  }`}
                >
                  {saved && <CheckCircleIcon className="h-4 w-4" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
