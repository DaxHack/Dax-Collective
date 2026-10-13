// src/automation/ContentIdeas.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  LightBulbIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import {
  getIdeas,
  saveIdea,
  deleteIdea,
  getPackageByIdeaId,
  savePackage,
  linkIdeaToPackage,
  derivePackageStatus,
  seedIfEmpty,
} from './contentStore';

const BRANDS = [
  { id: 'anidax', name: 'Ani-Dax', color: 'purple' },
  { id: 'daxtraveler', name: 'Dax the Traveler', color: 'blue' },
  { id: 'godsvessel', name: "God's Vessel", color: 'yellow' },
  { id: 'timezonetravelers', name: 'Timezone Travelers', color: 'green' },
];

const CONTENT_TYPES = ['blog', 'guide', 'article', 'video', 'short', 'infographic'];
const PLATFORMS = ['', 'youtube', 'tiktok', 'instagram', 'blog', 'twitter', 'facebook'];
const PRIORITIES = ['low', 'medium', 'high'];

const EMPTY_IDEA = {
  title: '',
  brand: 'anidax',
  contentType: 'video',
  platform: '',
  priority: 'medium',
  notes: '',
};

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

function getPriorityColor(p) {
  return p === 'high'
    ? 'bg-red-900 text-red-300'
    : p === 'medium'
    ? 'bg-orange-900 text-orange-300'
    : 'bg-gray-700 text-gray-400';
}

export default function ContentIdeas({ onViewPackage }) {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const [modalOpen, setModalOpen] = useState(false);
  const [editIdea, setEditIdea] = useState(null);
  const [form, setForm] = useState(EMPTY_IDEA);

  const [toast, setToast] = useState(null); // { type: 'success'|'warning'|'error', message, packageId? }
  const [creatingFor, setCreatingFor] = useState(null); // ideaId being processed

  const load = useCallback(() => {
    seedIfEmpty();
    setIdeas(getIdeas());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const showToast = (type, message, packageId = null) => {
    setToast({ type, message, packageId });
    setTimeout(() => setToast(null), 6000);
  };

  const openCreate = () => {
    setEditIdea(null);
    setForm(EMPTY_IDEA);
    setModalOpen(true);
  };

  const openEdit = (idea) => {
    setEditIdea(idea);
    setForm({
      title: idea.title,
      brand: idea.brand,
      contentType: idea.contentType,
      platform: idea.platform || '',
      priority: idea.priority,
      notes: idea.notes || '',
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    saveIdea(editIdea ? { ...form, id: editIdea.id } : form);
    setModalOpen(false);
    load();
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this idea?')) return;
    deleteIdea(id);
    load();
  };

  const handleCreatePackage = (idea) => {
    const existing = getPackageByIdeaId(idea.id);
    if (existing) {
      showToast(
        'warning',
        `A Content Package already exists for this idea: "${existing.title}"`,
        existing.id
      );
      return;
    }

    setCreatingFor(idea.id);

    const status = derivePackageStatus(idea.notes);
    const pkg = {
      title: idea.title,
      brand: idea.brand,
      contentType: idea.contentType,
      platform: idea.platform || '',
      priority: idea.priority,
      status,
      notes: idea.notes || '',
      sourceIdeaId: idea.id,
    };

    const updated = savePackage(pkg);
    const newPkg = updated[0]; // savePackage prepends

    linkIdeaToPackage(idea.id, newPkg.id);
    load();

    setCreatingFor(null);
    showToast(
      'success',
      `Package created with status "${status}": ${newPkg.title}`,
      newPkg.id
    );
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const filtered = ideas
    .filter((i) => {
      if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterBrand !== 'all' && i.brand !== filterBrand) return false;
      if (filterPriority !== 'all' && i.priority !== filterPriority) return false;
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
      sortDir === 'asc' ? (
        <ArrowUpIcon className="h-3 w-3 ml-1 inline" />
      ) : (
        <ArrowDownIcon className="h-3 w-3 ml-1 inline" />
      )
    ) : null;

  return (
    <div className="p-6 space-y-4">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed top-6 right-6 z-50 max-w-sm rounded-xl shadow-xl border px-5 py-4 flex items-start gap-3 ${
              toast.type === 'success'
                ? 'bg-green-900 border-green-700 text-green-100'
                : toast.type === 'warning'
                ? 'bg-yellow-900 border-yellow-700 text-yellow-100'
                : 'bg-red-900 border-red-700 text-red-100'
            }`}
          >
            <div className="flex-1">
              {toast.type === 'success' ? (
                <CheckCircleIcon className="h-5 w-5 inline mr-1 text-green-400" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 inline mr-1 text-yellow-400" />
              )}
              <span className="text-sm">{toast.message}</span>
              {toast.packageId && (
                <button
                  onClick={() => {
                    setToast(null);
                    onViewPackage && onViewPackage(toast.packageId);
                  }}
                  className="block mt-1 text-xs underline opacity-80 hover:opacity-100"
                >
                  View Content Package →
                </button>
              )}
            </div>
            <button onClick={() => setToast(null)}>
              <XMarkIcon className="h-4 w-4 opacity-60 hover:opacity-100" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <LightBulbIcon className="h-6 w-6 text-yellow-400" />
          Content Ideas
          <span className="text-sm font-normal text-gray-400 ml-1">({filtered.length})</span>
        </h2>

        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Brand filter */}
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Brands</option>
            {BRANDS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>

          <button
            onClick={openCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            New Idea
          </button>
        </div>
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
                { label: 'Priority', field: 'priority' },
                { label: 'Added', field: 'createdAt' },
              ].map(({ label, field }) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-gray-200"
                >
                  {label}
                  <SortIcon field={field} />
                </th>
              ))}
              <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800/40">
            {filtered.map((idea) => {
              const hasPackage = !!idea.packageId;
              return (
                <tr key={idea.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-white">{idea.title}</div>
                    {idea.notes && (
                      <div className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">
                        {idea.notes}
                      </div>
                    )}
                    {idea.platform && (
                      <span className="text-xs text-gray-500 mt-0.5 capitalize">
                        {idea.platform}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBrandColor(idea.brand)}`}>
                      {getBrandLabel(idea.brand)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-300 capitalize">{idea.contentType}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(idea.priority)}`}>
                      {idea.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">
                    {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {/* Create Package button */}
                      <button
                        onClick={() => handleCreatePackage(idea)}
                        disabled={creatingFor === idea.id}
                        title={hasPackage ? 'Package already exists — click to see warning' : 'Create Content Package from this idea'}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          hasPackage
                            ? 'bg-green-900/60 text-green-400 border border-green-700 hover:bg-green-900'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <RectangleStackIcon className="h-3.5 w-3.5" />
                        {hasPackage ? 'Has Package' : creatingFor === idea.id ? 'Creating…' : 'Create Package'}
                      </button>

                      <button
                        onClick={() => openEdit(idea)}
                        className="text-gray-400 hover:text-yellow-400 transition-colors"
                        title="Edit idea"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(idea.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete idea"
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
            <LightBulbIcon className="h-10 w-10 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">No ideas found. Add your first idea!</p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
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
                  <LightBulbIcon className="h-5 w-5 text-yellow-400" />
                  {editIdea ? 'Edit Idea' : 'New Content Idea'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Content idea title…"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Notes / Source Detail
                    <span className="ml-1 text-gray-600">
                      (≥60 chars → &quot;Script Needed&quot; status when creating package)
                    </span>
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    placeholder="Describe the idea, angles, references…"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="text-right text-xs text-gray-500 mt-0.5">
                    {form.notes.trim().length} chars — status will be:{' '}
                    <span className={form.notes.trim().length >= 60 ? 'text-blue-400' : 'text-orange-400'}>
                      {form.notes.trim().length >= 60 ? 'Script Needed' : 'Researching'}
                    </span>
                  </div>
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {editIdea ? 'Save Changes' : 'Add Idea'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
