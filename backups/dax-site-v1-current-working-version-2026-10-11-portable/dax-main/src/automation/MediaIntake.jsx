// src/automation/MediaIntake.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FilmIcon,
  ShieldExclamationIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { approvedMedia } from '../data/approvedMedia';
import { MEDIA_LIBRARY_KEY } from '../data/mediaLibraryKey';

export { MEDIA_LIBRARY_KEY };

// ─── Constants ────────────────────────────────────────────────────────────────

const BRANDS = ['All Brands', 'Dax the Traveler', 'Time-Zone Travelers', 'AniDax', "God's Vessel", 'shared'];

const SOURCE_PLATFORMS = ['Original', 'Facebook', 'Instagram', 'Google Drive', 'Local Upload', 'Other'];

const ASSET_TYPES = ['Photo', 'Video', 'Thumbnail', 'Banner', 'Product Mockup', 'Other'];

const CONTENT_SERIES = [
  'From the Vlog',
  'Wanderlost with Dax',
  'Quick Blips',
  'Quick Jumps',
  'Seen in the Vlog',
  'Dax Travel Kit',
  'Side Quests',
  'AniDax Pulse',
  'Anime Files',
  'Character Files',
  'Zone Guides',
  'Travel Dispatches',
  'Time-Zone Tips',
  'Archive Notes',
  'Names of God: The Dictionary Series',
  'General',
  'None',
];

const USAGE_STATUSES = [
  'Needs Review',
  'Approved',
  'Rejected',
  'Needs Crop',
  'Needs Caption',
  'Published',
];

const PRIVACY_STATUSES = [
  'Public Safe',
  'Needs Review',
  'Private',
  'Sensitive',
];

const PERMISSION_STATUSES = [
  'Owned by me',
  'Approved for use',
  'Unknown',
  'Do not use',
];

// ─── Style Maps ───────────────────────────────────────────────────────────────

const USAGE_STYLES = {
  'Needs Review': 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30',
  Approved:       'bg-green-500/15 text-green-400 ring-1 ring-green-500/30',
  Rejected:       'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  'Needs Crop':   'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30',
  'Needs Caption':'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
  Published:      'bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/30',
};

const PRIVACY_STYLES = {
  'Public Safe':   'bg-green-500/15 text-green-400',
  'Needs Review':  'bg-yellow-500/15 text-yellow-400',
  'Private':       'bg-gray-500/15 text-gray-400',
  'Sensitive':     'bg-red-500/15 text-red-400',
};

const PERM_STYLES = {
  'Owned by me':     'bg-green-500/15 text-green-400',
  'Approved for use':'bg-blue-500/15 text-blue-400',
  Unknown:           'bg-yellow-500/15 text-yellow-400',
  'Do not use':      'bg-red-500/15 text-red-400',
};

const PLATFORM_DOT = {
  Original:       'bg-cyan-400',
  Facebook:       'bg-blue-500',
  Instagram:      'bg-pink-500',
  'Google Drive': 'bg-green-400',
  'Local Upload': 'bg-gray-400',
  Other:          'bg-gray-600',
};

// ─── Data Transformation ──────────────────────────────────────────────────────

function transformApprovedToIntake(asset) {
  return {
    id: asset.id,
    title: asset.title,
    brand: asset.brand === 'shared' ? 'shared' : asset.brand,
    sourcePlatform: asset.sourcePlatform || 'Original',
    sourceUrl: asset.sourceUrl || '',
    filePath: asset.filePath || '',
    assetType: asset.assetType || 'Photo',
    relatedTrip: asset.location || '',
    contentSeries: asset.relatedSeries || 'None',
    usageStatus: asset.usageStatus || 'Needs Review',
    privacyStatus: asset.privacyStatus || 'Public Safe',
    permissionStatus: 'Owned by me',
    notes: asset.notes || '',
    tags: Array.isArray(asset.tags) ? asset.tags.join(', ') : (asset.tags || ''),
  };
}

// Seed: transform approvedMedia.js into intake format
const SEED_FROM_APPROVED = approvedMedia.map(transformApprovedToIntake);

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      className="fixed bottom-6 right-6 z-50 bg-gray-800 text-gray-100 text-sm px-4 py-3 rounded-xl shadow-2xl border border-gray-700 max-w-xs"
    >
      {message}
    </motion.div>
  );
}

// ─── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteConfirm({ item, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
      >
        <h3 className="text-lg font-semibold text-white mb-2">Delete Asset?</h3>
        <p className="text-gray-400 text-sm mb-6">
          &ldquo;<span className="text-white">{item.title}</span>&rdquo; will be permanently removed from intake.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm text-white bg-red-600 hover:bg-red-700 font-medium">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Quick Status Buttons ─────────────────────────────────────────────────────

function QuickStatusButtons({ item, onUpdate }) {
  const isApproved = item.usageStatus === 'Approved';
  const isRejected = item.usageStatus === 'Rejected';
  const isReview   = item.usageStatus === 'Needs Review';
  const isPublicSafe = item.privacyStatus === 'Public Safe';

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <button
        onClick={() => onUpdate(item.id, { usageStatus: 'Approved' })}
        title="Approve"
        className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
          isApproved
            ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/40'
            : 'bg-gray-800 text-gray-500 hover:bg-green-500/10 hover:text-green-400'
        }`}
      >
        ✓ Approved
      </button>
      <button
        onClick={() => onUpdate(item.id, { usageStatus: 'Needs Review' })}
        title="Mark as Needs Review"
        className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
          isReview
            ? 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/40'
            : 'bg-gray-800 text-gray-500 hover:bg-yellow-500/10 hover:text-yellow-400'
        }`}
      >
        ? Review
      </button>
      <button
        onClick={() => onUpdate(item.id, { usageStatus: 'Rejected' })}
        title="Reject"
        className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
          isRejected
            ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/40'
            : 'bg-gray-800 text-gray-500 hover:bg-red-500/10 hover:text-red-400'
        }`}
      >
        ✕ Rejected
      </button>
      <button
        onClick={() => onUpdate(item.id, { privacyStatus: isPublicSafe ? 'Private' : 'Public Safe' })}
        title={isPublicSafe ? 'Make Private' : 'Mark as Public Safe'}
        className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
          isPublicSafe
            ? 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40'
            : 'bg-gray-800 text-gray-500 hover:bg-cyan-500/10 hover:text-cyan-400'
        }`}
      >
        {isPublicSafe
          ? <><CheckCircleIcon className="h-3 w-3" />Public</>
          : <><EyeSlashIcon className="h-3 w-3" />Private</>
        }
      </button>
    </div>
  );
}

// ─── Media Modal ───────────────────────────────────────────────────────────────

const EMPTY_ITEM = {
  title: '',
  brand: 'Dax the Traveler',
  sourcePlatform: 'Original',
  sourceUrl: '',
  filePath: '',
  assetType: 'Photo',
  relatedTrip: '',
  contentSeries: 'None',
  usageStatus: 'Needs Review',
  privacyStatus: 'Public Safe',
  permissionStatus: 'Owned by me',
  notes: '',
  tags: '',
};

const inp = 'w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500';
const sel = inp;
const ta  = `${inp} resize-none`;

function LabeledField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

function MediaModal({ initial, onSave, onClose }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(initial ? { ...initial } : { ...EMPTY_ITEM });
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? `Edit: ${initial.title}` : 'New Media Asset'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title + Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LabeledField label="Asset Title *">
              <input
                className={inp}
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="e.g. Old San Juan Cobblestone"
                required
              />
            </LabeledField>
            <LabeledField label="Brand">
              <select className={sel} value={form.brand} onChange={e => set('brand', e.target.value)}>
                {BRANDS.filter(b => b !== 'All Brands').map(b => <option key={b}>{b}</option>)}
              </select>
            </LabeledField>
          </div>

          {/* Source Platform + Asset Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LabeledField label="Source Platform">
              <select className={sel} value={form.sourcePlatform} onChange={e => set('sourcePlatform', e.target.value)}>
                {SOURCE_PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </LabeledField>
            <LabeledField label="Asset Type">
              <select className={sel} value={form.assetType} onChange={e => set('assetType', e.target.value)}>
                {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </LabeledField>
          </div>

          {/* Source URL + File Path */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LabeledField label="Source URL (Facebook post, Drive link, etc.)">
              <input
                className={inp}
                value={form.sourceUrl}
                onChange={e => set('sourceUrl', e.target.value)}
                placeholder="https://..."
              />
            </LabeledField>
            <LabeledField label="Local File Path or Hosted URL">
              <input
                className={inp}
                value={form.filePath}
                onChange={e => set('filePath', e.target.value)}
                placeholder="/assets/photo.jpg or https://..."
              />
            </LabeledField>
          </div>

          {/* Related Trip + Content Series */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LabeledField label="Related Trip / Location">
              <input
                className={inp}
                value={form.relatedTrip}
                onChange={e => set('relatedTrip', e.target.value)}
                placeholder="e.g. Puerto Rico, Cuba, General"
              />
            </LabeledField>
            <LabeledField label="Related Content Series">
              <select className={sel} value={form.contentSeries} onChange={e => set('contentSeries', e.target.value)}>
                {CONTENT_SERIES.map(s => <option key={s}>{s}</option>)}
              </select>
            </LabeledField>
          </div>

          {/* Usage Status + Privacy Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LabeledField label="Usage Status">
              <select className={sel} value={form.usageStatus} onChange={e => set('usageStatus', e.target.value)}>
                {USAGE_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </LabeledField>
            <LabeledField label="Privacy Status">
              <select className={sel} value={form.privacyStatus} onChange={e => set('privacyStatus', e.target.value)}>
                {PRIVACY_STATUSES.map(p => <option key={p}>{p}</option>)}
              </select>
            </LabeledField>
          </div>

          {/* Permission Status */}
          <LabeledField label="Permission / Ownership">
            <select className={sel} value={form.permissionStatus} onChange={e => set('permissionStatus', e.target.value)}>
              {PERMISSION_STATUSES.map(p => <option key={p}>{p}</option>)}
            </select>
          </LabeledField>

          {/* Privacy hint */}
          <div className="flex items-start gap-2 bg-cyan-500/5 border border-cyan-500/15 rounded-lg px-3 py-2">
            <InformationCircleIcon className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-cyan-300/80">
              Only records with <strong>Usage Status = Approved</strong> and <strong>Privacy Status = Public Safe</strong> appear on the public brand pages.
            </p>
          </div>

          {/* Notes */}
          <LabeledField label="Notes">
            <textarea
              className={ta}
              rows={3}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Context, crop instructions, approval notes..."
            />
          </LabeledField>

          {/* Tags */}
          <LabeledField label="Tags (comma-separated)">
            <input
              className={inp}
              value={form.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder="e.g. puerto rico, solo travel, street photo"
            />
          </LabeledField>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-lg text-sm text-white bg-cyan-600 hover:bg-cyan-700 font-medium">
              {isEdit ? 'Save Changes' : 'Add Asset'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Facebook Setup Panel ─────────────────────────────────────────────────────

function FacebookSetupPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-blue-950/40 border border-blue-500/25 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(x => !x)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-gray-500" title="Not connected" />
          <span className="text-sm font-medium text-blue-300">Facebook Connection Setup</span>
          <span className="text-xs text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">Not Active</span>
        </div>
        {open ? <ChevronUpIcon className="h-4 w-4 text-blue-400" /> : <ChevronDownIcon className="h-4 w-4 text-blue-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-1 border-t border-blue-500/15 space-y-4">
              <div className="flex items-start gap-2 mt-3">
                <InformationCircleIcon className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-200">
                  No live Facebook connection is active. All assets are entered manually and reviewed before use.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    step: '1',
                    title: 'Meta Developer App',
                    desc: 'A future connection will require a registered Meta Developer App with the correct product permissions (Pages API, Instagram Graph API).',
                  },
                  {
                    step: '2',
                    title: 'Page Permissions',
                    desc: 'The app will need pages_read_engagement and pages_media_read permissions scoped to the Facebook Page.',
                  },
                  {
                    step: '3',
                    title: 'OAuth Login Flow',
                    desc: 'A secure OAuth 2.0 flow will authorize the connection — no passwords stored, no scraping, no unofficial tools.',
                  },
                  {
                    step: '4',
                    title: 'Manual Approval Gate',
                    desc: 'Even after API connection, all imported assets must be manually set to Approved before they appear anywhere on the website.',
                  },
                ].map(item => (
                  <div key={item.step} className="bg-blue-900/20 border border-blue-500/15 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/15 rounded-full h-5 w-5 flex items-center justify-center">
                        {item.step}
                      </span>
                      <span className="text-xs font-semibold text-blue-200">{item.title}</span>
                    </div>
                    <p className="text-xs text-blue-300/70 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <ShieldExclamationIcon className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300 leading-relaxed">
                  This system does not scrape Facebook, does not use unofficial tools, and does not auto-publish anything.
                  All media intake is controlled and manually reviewed. Connection will use the official Meta Graph API when activated.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Media Card ───────────────────────────────────────────────────────────────

function MediaCard({ item, onEdit, onDelete, onCopy, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const tagList = item.tags ? item.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const isLive = item.usageStatus === 'Approved' && item.privacyStatus === 'Public Safe' && !!item.filePath;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
    >
      {/* Header Row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span
          className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${PLATFORM_DOT[item.sourcePlatform] || 'bg-gray-500'}`}
          title={item.sourcePlatform}
        />

        <span className="flex-1 font-medium text-white text-sm truncate">{item.title}</span>

        {/* Live indicator */}
        {isLive && (
          <span className="hidden sm:flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full ring-1 ring-green-500/25 flex-shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Live
          </span>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1 ml-2">
          <button onClick={() => onCopy(item)} title="Copy brief as Markdown" className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <ClipboardDocumentIcon className="h-4 w-4" />
          </button>
          <button onClick={() => onEdit(item)} title="Edit" className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(item)} title="Delete" className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
            <TrashIcon className="h-4 w-4" />
          </button>
          <button onClick={() => setExpanded(x => !x)} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            {expanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Sub-info row */}
      <div className="flex flex-wrap items-center gap-2 px-4 pb-2 text-xs text-gray-500">
        <span className="text-gray-400">{item.brand}</span>
        <span>·</span>
        <span>{item.sourcePlatform}</span>
        <span>·</span>
        <span>{item.assetType}</span>
        {item.contentSeries && item.contentSeries !== 'None' && (
          <>
            <span>·</span>
            <span className="text-cyan-500">{item.contentSeries}</span>
          </>
        )}
        {item.relatedTrip && (
          <>
            <span>·</span>
            <span>{item.relatedTrip}</span>
          </>
        )}
      </div>

      {/* Quick Status Buttons */}
      <div className="px-4 pb-3">
        <QuickStatusButtons item={item} onUpdate={onUpdate} />
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap items-center gap-2 px-4 pb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${USAGE_STYLES[item.usageStatus] || 'bg-gray-700 text-gray-300'}`}>
          {item.usageStatus}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIVACY_STYLES[item.privacyStatus] || 'bg-gray-700 text-gray-300'}`}>
          {item.privacyStatus || 'Unknown Privacy'}
        </span>
        {item.permissionStatus && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PERM_STYLES[item.permissionStatus] || 'bg-gray-700 text-gray-300'}`}>
            {item.permissionStatus}
          </span>
        )}
      </div>

      {/* Expanded Detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-gray-800 space-y-3">
              {item.notes && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{item.notes}</p>
                </div>
              )}
              {(item.sourceUrl || item.filePath) && (
                <div className="space-y-1">
                  {item.sourceUrl && (
                    <div>
                      <span className="text-xs text-gray-500">Source URL: </span>
                      <span className="text-xs text-cyan-400 break-all">{item.sourceUrl}</span>
                    </div>
                  )}
                  {item.filePath && (
                    <div>
                      <span className="text-xs text-gray-500">File path: </span>
                      <span className="text-xs text-cyan-400 break-all">{item.filePath}</span>
                    </div>
                  )}
                </div>
              )}
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tagList.map(tag => (
                    <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              {!item.notes && !item.sourceUrl && !item.filePath && tagList.length === 0 && (
                <p className="text-sm text-gray-600 italic">No additional details recorded.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Markdown Helper ──────────────────────────────────────────────────────────

function toMarkdown(item) {
  return [
    `## ${item.title}`,
    `**Brand:** ${item.brand}`,
    `**Source Platform:** ${item.sourcePlatform}`,
    `**Asset Type:** ${item.assetType}`,
    item.contentSeries !== 'None' ? `**Content Series:** ${item.contentSeries}` : null,
    item.relatedTrip ? `**Related Trip:** ${item.relatedTrip}` : null,
    `**Usage Status:** ${item.usageStatus}`,
    `**Privacy Status:** ${item.privacyStatus || 'Not set'}`,
    `**Permission Status:** ${item.permissionStatus}`,
    item.sourceUrl ? `**Source URL:** ${item.sourceUrl}` : null,
    item.filePath ? `**File Path:** ${item.filePath}` : null,
    item.notes ? `\n**Notes:**\n${item.notes}` : null,
    item.tags ? `**Tags:** ${item.tags}` : null,
  ].filter(Boolean).join('\n');
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MediaIntake() {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(MEDIA_LIBRARY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { /* noop */ }
    return SEED_FROM_APPROVED;
  });

  const [toast, setToast] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('All Brands');
  const [filterPlatform, setFilterPlatform] = useState('All Platforms');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [filterPrivacy, setFilterPrivacy] = useState('All Privacy');
  const [filterTrip, setFilterTrip] = useState('All Trips');
  const [view, setView] = useState('all');

  useEffect(() => {
    try { localStorage.setItem(MEDIA_LIBRARY_KEY, JSON.stringify(items)); } catch (e) { /* noop */ }
  }, [items]);

  function showToast(msg) { setToast(msg); }

  // Unique trips for filter
  const uniqueTrips = useMemo(() => {
    const trips = [...new Set(items.map(i => i.relatedTrip).filter(Boolean))].sort();
    return ['All Trips', ...trips];
  }, [items]);

  // Stats
  const total = items.length;
  const approved = items.filter(i => i.usageStatus === 'Approved').length;
  const needsReview = items.filter(i => i.usageStatus === 'Needs Review').length;
  const liveOnSite = items.filter(i =>
    i.usageStatus === 'Approved' && i.privacyStatus === 'Public Safe' && i.filePath
  ).length;

  // Warnings: unknown or do-not-use permission
  const permWarnings = useMemo(() =>
    items.filter(i => i.permissionStatus === 'Unknown' || i.permissionStatus === 'Do not use').map(i => i.title),
    [items]
  );

  // Filtered list
  const filtered = useMemo(() => {
    let list = items;
    if (view === 'approved') list = list.filter(i => i.usageStatus === 'Approved');
    if (view === 'review')   list = list.filter(i => i.usageStatus === 'Needs Review');
    if (view === 'live')     list = list.filter(i => i.usageStatus === 'Approved' && i.privacyStatus === 'Public Safe');
    if (filterBrand !== 'All Brands') list = list.filter(i => i.brand === filterBrand);
    if (filterPlatform !== 'All Platforms') list = list.filter(i => i.sourcePlatform === filterPlatform);
    if (filterType !== 'All Types') list = list.filter(i => i.assetType === filterType);
    if (filterStatus !== 'All Statuses') list = list.filter(i => i.usageStatus === filterStatus);
    if (filterPrivacy !== 'All Privacy') list = list.filter(i => i.privacyStatus === filterPrivacy);
    if (filterTrip !== 'All Trips') list = list.filter(i => i.relatedTrip === filterTrip);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.notes || '').toLowerCase().includes(q) ||
        (i.tags || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, view, filterBrand, filterPlatform, filterType, filterStatus, filterPrivacy, filterTrip, search]);

  // CRUD
  function handleCreate(form) {
    setItems(prev => [{ ...form, id: `mi-${Date.now()}` }, ...prev]);
    setCreating(false);
    showToast(`"${form.title}" added to intake.`);
  }

  function handleEdit(form) {
    setItems(prev => prev.map(i => i.id === form.id ? { ...form } : i));
    setEditing(null);
    showToast(`"${form.title}" updated.`);
  }

  function handleDelete() {
    const title = deleting.title;
    setItems(prev => prev.filter(i => i.id !== deleting.id));
    setDeleting(null);
    showToast(`"${title}" removed from intake.`);
  }

  function handleCopy(item) {
    navigator.clipboard.writeText(toMarkdown(item)).catch(() => {});
    showToast(`"${item.title}" copied as Markdown.`);
  }

  // Quick status update (approve/reject/privacy toggle)
  function handleQuickUpdate(id, patch) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
    const item = items.find(i => i.id === id);
    if (item) {
      if (patch.usageStatus) showToast(`"${item.title}" → ${patch.usageStatus}`);
      if (patch.privacyStatus) showToast(`"${item.title}" privacy → ${patch.privacyStatus}`);
    }
  }

  const VIEW_TABS = [
    { id: 'all',      label: `All (${total})` },
    { id: 'approved', label: `Approved (${approved})` },
    { id: 'review',   label: `Needs Review (${needsReview})` },
    { id: 'live',     label: `Live on Site (${liveOnSite})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FilmIcon className="h-6 w-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Media Intake &amp; Approved Assets</h2>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Review, approve, or reject media before it appears on brand pages. Privacy status is enforced site-wide.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0"
        >
          <PlusIcon className="h-4 w-4" />
          Add Asset
        </button>
      </div>

      {/* Approval Gate Info */}
      <div className="flex items-start gap-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl px-4 py-3">
        <CheckCircleIcon className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p className="text-cyan-200/80 text-sm">
          Records appear on public brand pages only when <strong>Usage Status = Approved</strong> and <strong>Privacy Status = Public Safe</strong>. Changes take effect immediately on navigation.
        </p>
      </div>

      {/* Facebook Setup Panel */}
      <FacebookSetupPanel />

      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',        value: total,       color: 'text-white' },
          { label: 'Approved',     value: approved,    color: 'text-green-400' },
          { label: 'Needs Review', value: needsReview, color: 'text-yellow-400' },
          { label: 'Live on Site', value: liveOnSite,  color: 'text-cyan-400' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Permission Warning Banner */}
      {permWarnings.length > 0 && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
          <ShieldExclamationIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 text-sm font-medium">
              {permWarnings.length} asset{permWarnings.length !== 1 ? 's' : ''} with unresolved permission status
            </p>
            <p className="text-red-400/70 text-xs mt-0.5">{permWarnings.join(', ')}</p>
          </div>
        </div>
      )}

      {/* View Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
        {VIEW_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              view === t.id
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assets, notes, tags…"
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-gray-600"
          />
        </div>
        {[
          { value: filterBrand,    setter: setFilterBrand,    options: BRANDS },
          { value: filterPlatform, setter: setFilterPlatform, options: ['All Platforms', ...SOURCE_PLATFORMS] },
          { value: filterType,     setter: setFilterType,     options: ['All Types', ...ASSET_TYPES] },
          { value: filterStatus,   setter: setFilterStatus,   options: ['All Statuses', ...USAGE_STATUSES] },
          { value: filterPrivacy,  setter: setFilterPrivacy,  options: ['All Privacy', ...PRIVACY_STATUSES] },
          { value: filterTrip,     setter: setFilterTrip,     options: uniqueTrips },
        ].map((f, i) => (
          <select
            key={i}
            value={f.value}
            onChange={e => f.setter(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            {f.options.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Result count */}
      <div className="text-xs text-gray-600">
        {filtered.length} of {total} asset{total !== 1 ? 's' : ''} shown
      </div>

      {/* Asset List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-16 text-gray-600 text-sm"
            >
              No assets match your current filters.
            </motion.div>
          ) : (
            filtered.map(item => (
              <MediaCard
                key={item.id}
                item={item}
                onEdit={i => setEditing(i)}
                onDelete={i => setDeleting(i)}
                onCopy={handleCopy}
                onUpdate={handleQuickUpdate}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      {creating && <MediaModal onSave={handleCreate} onClose={() => setCreating(false)} />}
      {editing  && <MediaModal initial={editing} onSave={handleEdit} onClose={() => setEditing(null)} />}
      {deleting && <DeleteConfirm item={deleting} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
