// src/automation/AssetReview.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';

// ─── Constants ────────────────────────────────────────────────────────────────

const BRANDS = ['All Brands', "God's Vessel", 'Time-Zone Travelers', 'Dax the Traveler', 'AniDax'];

const ASSET_TYPES = [
  'Canva Export', 'Shirt Mockup', 'Sticker Design', 'Travel Photo',
  'Video Thumbnail', 'Logo', 'Background', 'Product Mockup',
  'Anime-Safe Graphic', 'Website Image', 'Other',
];

const SOURCES = ['Canva', 'Google Drive', 'Facebook Export', 'Local Upload', 'Replit Asset', 'Other'];

const INTENDED_USES = [
  'Website', 'Merch', 'Sticker', 'Social Post', 'Blog',
  'Product Page', 'Thumbnail', 'Brand Kit', 'Other',
];

const USAGE_STATUSES = ['New', 'Approved', 'Needs Review', 'Needs Redesign', 'Rejected', 'Archived'];

const VISUAL_FITS = ['Strong', 'Good', 'Maybe', 'Weak'];

const VISUAL_DECISIONS = ['Keep', 'Revert', 'Refine', 'Replace', 'Undecided'];

// ─── Style Maps ───────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  New:            'bg-gray-700 text-gray-300 ring-1 ring-gray-600',
  Approved:       'bg-green-500/15 text-green-400 ring-1 ring-green-500/30',
  'Needs Review': 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30',
  'Needs Redesign':'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30',
  Rejected:       'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  Archived:       'bg-gray-500/15 text-gray-500 ring-1 ring-gray-600',
};

const FIT_STYLES = {
  Strong: 'bg-green-500/15 text-green-400',
  Good:   'bg-blue-500/15 text-blue-400',
  Maybe:  'bg-yellow-500/15 text-yellow-400',
  Weak:   'bg-red-500/15 text-red-400',
};

const DECISION_STYLES = {
  Keep:      'bg-green-500/15 text-green-400',
  Revert:    'bg-gray-700 text-gray-300',
  Refine:    'bg-blue-500/15 text-blue-400',
  Replace:   'bg-red-500/15 text-red-400',
  Undecided: 'bg-yellow-500/15 text-yellow-400',
};

const BRAND_DOT = {
  "God's Vessel":       'bg-amber-400',
  'Time-Zone Travelers':'bg-cyan-400',
  'Dax the Traveler':   'bg-emerald-400',
  'AniDax':             'bg-purple-400',
};

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const SEED_ASSETS = [
  // God's Vessel
  {
    id: 'asset-001',
    name: "Names of God Shirt Mockups",
    brand: "God's Vessel",
    assetType: 'Shirt Mockup',
    filePath: '',
    source: 'Canva',
    intendedUse: 'Merch',
    usageStatus: 'Needs Review',
    visualFit: 'Good',
    visualDecision: 'Undecided',
    notes: 'Multiple colorways. Need to confirm which names translate well to apparel.',
    nextAction: 'Review each color option and mark Keep or Replace per design.',
  },
  {
    id: 'asset-002',
    name: 'Moody Editorial Backgrounds',
    brand: "God's Vessel",
    assetType: 'Background',
    filePath: '',
    source: 'Canva',
    intendedUse: 'Website',
    usageStatus: 'New',
    visualFit: 'Strong',
    visualDecision: 'Keep',
    notes: 'Dark, textured backgrounds with subtle lighting. Fits the cream-and-dark palette.',
    nextAction: 'Export at full resolution and stage for God\'s Vessel hero sections.',
  },
  {
    id: 'asset-003',
    name: 'Neutral Apparel Mockups',
    brand: "God's Vessel",
    assetType: 'Product Mockup',
    filePath: '',
    source: 'Canva',
    intendedUse: 'Merch',
    usageStatus: 'Needs Review',
    visualFit: 'Maybe',
    visualDecision: 'Undecided',
    notes: 'Generic flat-lay mockups. May not reflect the brand mood well enough.',
    nextAction: 'Compare against lifestyle mockups. Decide if brand-specific photography is needed.',
  },
  {
    id: 'asset-004',
    name: 'Product-First Mockups',
    brand: "God's Vessel",
    assetType: 'Product Mockup',
    filePath: '',
    source: 'Canva',
    intendedUse: 'Product Page',
    usageStatus: 'New',
    visualFit: 'Good',
    visualDecision: 'Undecided',
    notes: 'Clean white-background product shots. Good for product page thumbnails.',
    nextAction: 'Assign to God\'s Vessel product page template once copy is finalized.',
  },

  // Time-Zone Travelers
  {
    id: 'asset-005',
    name: 'Travel Sticker Concepts',
    brand: 'Time-Zone Travelers',
    assetType: 'Sticker Design',
    filePath: '',
    source: 'Canva',
    intendedUse: 'Sticker',
    usageStatus: 'Needs Review',
    visualFit: 'Good',
    visualDecision: 'Undecided',
    notes: 'Multiple city/destination die-cut concepts. Needs brand consistency pass.',
    nextAction: 'Review each sticker for color accuracy and die-cut bleed margins.',
  },
  {
    id: 'asset-006',
    name: 'Chibi Travel Character Concepts',
    brand: 'Time-Zone Travelers',
    assetType: 'Anime-Safe Graphic',
    filePath: '',
    source: 'Canva',
    intendedUse: 'Merch',
    usageStatus: 'New',
    visualFit: 'Maybe',
    visualDecision: 'Undecided',
    notes: 'Early-stage chibi character sketches. Need art direction before production.',
    nextAction: 'Define character design guide before expanding this set.',
  },
  {
    id: 'asset-007',
    name: 'Destination Card Visuals',
    brand: 'Time-Zone Travelers',
    assetType: 'Canva Export',
    filePath: '',
    source: 'Canva',
    intendedUse: 'Website',
    usageStatus: 'Approved',
    visualFit: 'Strong',
    visualDecision: 'Keep',
    notes: 'City cards with time zone overlays. Clean design, matches brand typography.',
    nextAction: 'Ready to integrate into TimeZoneTravelers itinerary and destination pages.',
  },
  {
    id: 'asset-008',
    name: 'Travel Toolkit Graphics',
    brand: 'Time-Zone Travelers',
    assetType: 'Canva Export',
    filePath: '',
    source: 'Canva',
    intendedUse: 'Product Page',
    usageStatus: 'New',
    visualFit: 'Good',
    visualDecision: 'Undecided',
    notes: 'Illustrated gear and packing checklist graphics.',
    nextAction: 'Review for use in TimeZoneTravelers resource or toolkit section.',
  },

  // Dax the Traveler
  {
    id: 'asset-009',
    name: 'Approved Travel Photos',
    brand: 'Dax the Traveler',
    assetType: 'Travel Photo',
    filePath: '',
    source: 'Local Upload',
    intendedUse: 'Blog',
    usageStatus: 'Approved',
    visualFit: 'Strong',
    visualDecision: 'Keep',
    notes: 'Curated from past trips. Already sized and optimized for blog use.',
    nextAction: 'Ready to assign to blog posts as needed.',
  },
  {
    id: 'asset-010',
    name: 'Vlog Thumbnails',
    brand: 'Dax the Traveler',
    assetType: 'Video Thumbnail',
    filePath: '',
    source: 'Local Upload',
    intendedUse: 'Thumbnail',
    usageStatus: 'Needs Review',
    visualFit: 'Good',
    visualDecision: 'Undecided',
    notes: 'Mixed quality. Some thumbnails have inconsistent text treatment.',
    nextAction: 'Standardize thumbnail template and rebuild inconsistent designs.',
  },
  {
    id: 'asset-011',
    name: 'From the Vlog Images',
    brand: 'Dax the Traveler',
    assetType: 'Travel Photo',
    filePath: '',
    source: 'Facebook Export',
    intendedUse: 'Website',
    usageStatus: 'Needs Review',
    visualFit: 'Maybe',
    visualDecision: 'Refine',
    notes: 'Exported from FB — compression artifacts present. Some have good compositions.',
    nextAction: 'Identify best frames, re-export at source resolution if available.',
  },
  {
    id: 'asset-012',
    name: 'Dax Travel Kit Product Visuals',
    brand: 'Dax the Traveler',
    assetType: 'Product Mockup',
    filePath: '',
    source: 'Canva',
    intendedUse: 'Product Page',
    usageStatus: 'New',
    visualFit: 'Good',
    visualDecision: 'Undecided',
    notes: 'Flat-lay and lifestyle mockups for the travel kit product line.',
    nextAction: 'Pair with finalized product copy and stage for product page launch.',
  },

  // AniDax
  {
    id: 'asset-013',
    name: 'Anime-Safe Graphics',
    brand: 'AniDax',
    assetType: 'Anime-Safe Graphic',
    filePath: '',
    source: 'Canva',
    intendedUse: 'Website',
    usageStatus: 'Approved',
    visualFit: 'Strong',
    visualDecision: 'Keep',
    notes: 'Original-character-only graphics cleared for commercial use.',
    nextAction: 'Active and approved. Use freely across AniDax pages.',
  },
  {
    id: 'asset-014',
    name: 'Character Files Thumbnails',
    brand: 'AniDax',
    assetType: 'Video Thumbnail',
    filePath: '',
    source: 'Canva',
    intendedUse: 'Thumbnail',
    usageStatus: 'Needs Review',
    visualFit: 'Good',
    visualDecision: 'Undecided',
    notes: 'One thumbnail per character profile. Some need text sizing updates.',
    nextAction: 'Review each character thumbnail and align with Character Files template.',
  },
  {
    id: 'asset-015',
    name: 'Watch Queue Graphics',
    brand: 'AniDax',
    assetType: 'Website Image',
    filePath: '',
    source: 'Canva',
    intendedUse: 'Website',
    usageStatus: 'Approved',
    visualFit: 'Strong',
    visualDecision: 'Keep',
    notes: 'Series cover art and seasonal banners for the Watch Queue section.',
    nextAction: 'Ready for use. Update when new seasons are added.',
  },
  {
    id: 'asset-016',
    name: 'Theory Board Graphics',
    brand: 'AniDax',
    assetType: 'Website Image',
    filePath: '',
    source: 'Canva',
    intendedUse: 'Website',
    usageStatus: 'New',
    visualFit: 'Good',
    visualDecision: 'Undecided',
    notes: 'Diagram-style boards showing character connections and timeline events.',
    nextAction: 'Finalize layout format before publishing to Theory Board section.',
  },
];

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
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

function DeleteConfirm({ asset, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
      >
        <h3 className="text-lg font-semibold text-white mb-2">Delete Asset?</h3>
        <p className="text-gray-400 text-sm mb-6">
          &ldquo;<span className="text-white">{asset.name}</span>&rdquo; will be permanently removed.
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

// ─── Asset Modal ───────────────────────────────────────────────────────────────

const EMPTY_ASSET = {
  name: '',
  brand: "God's Vessel",
  assetType: 'Canva Export',
  filePath: '',
  source: 'Canva',
  intendedUse: 'Website',
  usageStatus: 'New',
  visualFit: 'Good',
  visualDecision: 'Undecided',
  notes: '',
  nextAction: '',
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500';
const selectCls = inputCls;
const textareaCls = `${inputCls} resize-none`;

function AssetModal({ initial, onSave, onClose }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(initial ? { ...initial } : { ...EMPTY_ASSET });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? `Edit: ${initial.name}` : 'New Asset'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Row 1: Name + Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Asset Name *">
              <input
                id="asset-name"
                className={inputCls}
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Homepage Hero Banner"
                required
              />
            </Field>
            <Field label="Brand">
              <select id="asset-brand" className={selectCls} value={form.brand} onChange={e => set('brand', e.target.value)}>
                {BRANDS.filter(b => b !== 'All Brands').map(b => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Row 2: Asset Type + Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Asset Type">
              <select id="asset-type" className={selectCls} value={form.assetType} onChange={e => set('assetType', e.target.value)}>
                {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Source">
              <select id="asset-source" className={selectCls} value={form.source} onChange={e => set('source', e.target.value)}>
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          {/* Row 3: Intended Use + Usage Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Intended Use">
              <select id="asset-intended-use" className={selectCls} value={form.intendedUse} onChange={e => set('intendedUse', e.target.value)}>
                {INTENDED_USES.map(u => <option key={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="Usage Status">
              <select id="asset-usage-status" className={selectCls} value={form.usageStatus} onChange={e => set('usageStatus', e.target.value)}>
                {USAGE_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          {/* Row 4: Visual Fit + Visual Decision */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Visual Fit">
              <select id="asset-visual-fit" className={selectCls} value={form.visualFit} onChange={e => set('visualFit', e.target.value)}>
                {VISUAL_FITS.map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Visual Decision">
              <select id="asset-visual-decision" className={selectCls} value={form.visualDecision} onChange={e => set('visualDecision', e.target.value)}>
                {VISUAL_DECISIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
          </div>

          {/* File Path */}
          <Field label="File Path or Link">
            <input
              className={inputCls}
              value={form.filePath}
              onChange={e => set('filePath', e.target.value)}
              placeholder="e.g. /assets/gv-shirt-mockup.png or https://..."
            />
          </Field>

          {/* Notes */}
          <Field label="Notes">
            <textarea
              className={textareaCls}
              rows={3}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Context, observations, design feedback..."
            />
          </Field>

          {/* Next Action */}
          <Field label="Next Action">
            <input
              className={inputCls}
              value={form.nextAction}
              onChange={e => set('nextAction', e.target.value)}
              placeholder="What needs to happen before this asset is used?"
            />
          </Field>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-lg text-sm text-white bg-blue-600 hover:bg-blue-700 font-medium">
              {isEdit ? 'Save Changes' : 'Create Asset'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Asset Card ───────────────────────────────────────────────────────────────

function AssetCard({ asset, onEdit, onDelete, onCopy }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
    >
      {/* Card Header Row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Brand dot */}
        <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${BRAND_DOT[asset.brand] || 'bg-gray-500'}`} />

        {/* Name */}
        <span className="flex-1 font-medium text-white text-sm truncate">{asset.name}</span>

        {/* Badges */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap justify-end">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[asset.usageStatus] || 'bg-gray-700 text-gray-300'}`}>
            {asset.usageStatus}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${FIT_STYLES[asset.visualFit] || 'bg-gray-700 text-gray-300'}`}>
            {asset.visualFit}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DECISION_STYLES[asset.visualDecision] || 'bg-gray-700 text-gray-300'}`}>
            {asset.visualDecision}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-2">
          <button onClick={() => onCopy(asset)} title="Copy as Markdown" className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <ClipboardDocumentIcon className="h-4 w-4" />
          </button>
          <button onClick={() => onEdit(asset)} title="Edit" className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(asset)} title="Delete" className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
            <TrashIcon className="h-4 w-4" />
          </button>
          <button onClick={() => setExpanded(x => !x)} title={expanded ? 'Collapse' : 'Expand'} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
            {expanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Sub-info row */}
      <div className="flex flex-wrap items-center gap-2 px-4 pb-3 text-xs text-gray-500">
        <span className="text-gray-400">{asset.brand}</span>
        <span>·</span>
        <span>{asset.assetType}</span>
        <span>·</span>
        <span>{asset.source}</span>
        <span>·</span>
        <span>{asset.intendedUse}</span>
        {asset.filePath && (
          <>
            <span>·</span>
            <span className="text-blue-400 truncate max-w-xs">{asset.filePath}</span>
          </>
        )}
      </div>

      {/* Mobile badges */}
      <div className="sm:hidden flex items-center gap-2 px-4 pb-3 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[asset.usageStatus] || 'bg-gray-700 text-gray-300'}`}>
          {asset.usageStatus}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${FIT_STYLES[asset.visualFit] || 'bg-gray-700 text-gray-300'}`}>
          {asset.visualFit}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DECISION_STYLES[asset.visualDecision] || 'bg-gray-700 text-gray-300'}`}>
          {asset.visualDecision}
        </span>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-gray-800 space-y-3">
              {asset.notes && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{asset.notes}</p>
                </div>
              )}
              {asset.nextAction && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Next Action</p>
                  <p className="text-sm text-blue-300 leading-relaxed">{asset.nextAction}</p>
                </div>
              )}
              {!asset.notes && !asset.nextAction && (
                <p className="text-sm text-gray-600 italic">No notes or next action recorded.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toMarkdown(asset) {
  return [
    `## ${asset.name}`,
    `**Brand:** ${asset.brand}`,
    `**Asset Type:** ${asset.assetType}`,
    `**Source:** ${asset.source}`,
    `**Intended Use:** ${asset.intendedUse}`,
    `**Usage Status:** ${asset.usageStatus}`,
    `**Visual Fit:** ${asset.visualFit}`,
    `**Visual Decision:** ${asset.visualDecision}`,
    asset.filePath ? `**File Path/Link:** ${asset.filePath}` : null,
    asset.notes ? `\n**Notes:**\n${asset.notes}` : null,
    asset.nextAction ? `\n**Next Action:** ${asset.nextAction}` : null,
  ].filter(Boolean).join('\n');
}

function exportBrandMarkdown(assets, brand) {
  const filtered = brand === 'All Brands' ? assets : assets.filter(a => a.brand === brand);
  const title = brand === 'All Brands' ? '# Dax Collective — Asset Review Export' : `# ${brand} — Asset Review Export`;
  const content = [title, '', ...filtered.map(a => toMarkdown(a) + '\n---')].join('\n');
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${brand.replace(/\s+/g, '-').toLowerCase()}-assets.md`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AssetReview() {
  const LS_KEY = 'dax_asset_review';

  const [assets, setAssets] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      return stored ? JSON.parse(stored) : SEED_ASSETS;
    } catch {
      return SEED_ASSETS;
    }
  });

  const [toast, setToast] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('All Brands');
  const [filterType, setFilterType] = useState('All Types');
  const [filterSource, setFilterSource] = useState('All Sources');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [filterFit, setFilterFit] = useState('All Fits');
  const [view, setView] = useState('all');
  const [exportBrand, setExportBrand] = useState('All Brands');

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(assets)); } catch (e) { /* noop */ }
  }, [assets]);

  function showToast(msg) { setToast(msg); }

  // Stats
  const total = assets.length;
  const approved = assets.filter(a => a.usageStatus === 'Approved').length;
  const needsReview = assets.filter(a => a.usageStatus === 'Needs Review').length;
  const needsRedesign = assets.filter(a => a.usageStatus === 'Needs Redesign').length;

  // Warning list
  const reviewList = useMemo(() => assets.filter(a => a.usageStatus === 'Needs Review').map(a => a.name), [assets]);

  // Filtered assets
  const filtered = useMemo(() => {
    let list = assets;
    if (view === 'review') list = list.filter(a => a.usageStatus === 'Needs Review');
    if (view === 'approved') list = list.filter(a => a.usageStatus === 'Approved');
    if (filterBrand !== 'All Brands') list = list.filter(a => a.brand === filterBrand);
    if (filterType !== 'All Types') list = list.filter(a => a.assetType === filterType);
    if (filterSource !== 'All Sources') list = list.filter(a => a.source === filterSource);
    if (filterStatus !== 'All Statuses') list = list.filter(a => a.usageStatus === filterStatus);
    if (filterFit !== 'All Fits') list = list.filter(a => a.visualFit === filterFit);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.brand.toLowerCase().includes(q) ||
        a.notes.toLowerCase().includes(q)
      );
    }
    return list;
  }, [assets, view, filterBrand, filterType, filterSource, filterStatus, filterFit, search]);

  // CRUD
  function handleCreate(form) {
    const newAsset = { ...form, id: `asset-${Date.now()}` };
    setAssets(prev => [newAsset, ...prev]);
    setCreating(false);
    showToast(`"${form.name}" created.`);
  }

  function handleEdit(form) {
    setAssets(prev => prev.map(a => a.id === form.id ? { ...form } : a));
    setEditing(null);
    showToast(`"${form.name}" updated.`);
  }

  function handleDelete() {
    const name = deleting.name;
    setAssets(prev => prev.filter(a => a.id !== deleting.id));
    setDeleting(null);
    showToast(`"${name}" deleted.`);
  }

  function handleCopy(asset) {
    navigator.clipboard.writeText(toMarkdown(asset)).catch(() => {});
    showToast(`"${asset.name}" copied as Markdown.`);
  }

  function handleExport() {
    const label = exportBrand === 'All Brands' ? 'All assets' : `${exportBrand} assets`;
    showToast(`${label} exported as Markdown.`);
    setTimeout(() => exportBrandMarkdown(assets, exportBrand), 50);
  }

  const VIEW_TABS = [
    { id: 'all', label: `All (${total})` },
    { id: 'review', label: `Needs Review (${needsReview})` },
    { id: 'approved', label: `Approved (${approved})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SwatchIcon className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Asset Review &amp; Brand Materials</h2>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Review, track, and approve Canva exports, mockups, photos, and brand graphics before publishing.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0"
        >
          <PlusIcon className="h-4 w-4" />
          New Asset
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: total, color: 'text-white' },
          { label: 'Approved', value: approved, color: 'text-green-400' },
          { label: 'Needs Review', value: needsReview, color: 'text-yellow-400' },
          { label: 'Needs Redesign', value: needsRedesign, color: 'text-orange-400' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Warning Banner */}
      {reviewList.length > 0 && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/25 rounded-xl px-4 py-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 text-sm font-medium">
              {reviewList.length} asset{reviewList.length !== 1 ? 's' : ''} awaiting review
            </p>
            <p className="text-yellow-400/70 text-xs mt-0.5">{reviewList.join(', ')}</p>
          </div>
        </div>
      )}

      {/* View Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
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
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assets…"
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-600"
          />
        </div>

        {/* Filter selects */}
        {[
          { value: filterBrand, setter: setFilterBrand, options: BRANDS, allLabel: 'All Brands' },
          { value: filterType, setter: setFilterType, options: ['All Types', ...ASSET_TYPES], allLabel: 'All Types' },
          { value: filterSource, setter: setFilterSource, options: ['All Sources', ...SOURCES], allLabel: 'All Sources' },
          { value: filterStatus, setter: setFilterStatus, options: ['All Statuses', ...USAGE_STATUSES], allLabel: 'All Statuses' },
          { value: filterFit, setter: setFilterFit, options: ['All Fits', ...VISUAL_FITS], allLabel: 'All Fits' },
        ].map((f, i) => (
          <select
            key={i}
            value={f.value}
            onChange={e => f.setter(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {f.options.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Export Row */}
      <div className="flex items-center gap-3">
        <select
          data-testid="export-brand-select"
          value={exportBrand}
          onChange={e => setExportBrand(e.target.value)}
          className="bg-gray-900 border border-gray-800 text-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {BRANDS.map(b => <option key={b}>{b}</option>)}
        </select>
        <button
          data-testid="export-btn"
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 rounded-xl text-sm transition-colors"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Export as Markdown
        </button>
        <span className="text-xs text-gray-600">
          {filtered.length} of {total} asset{total !== 1 ? 's' : ''} shown
        </span>
      </div>

      {/* Asset List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-gray-600 text-sm"
            >
              No assets match your current filters.
            </motion.div>
          ) : (
            filtered.map(asset => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onEdit={a => setEditing(a)}
                onDelete={a => setDeleting(a)}
                onCopy={handleCopy}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      {creating && <AssetModal onSave={handleCreate} onClose={() => setCreating(false)} />}
      {editing && <AssetModal initial={editing} onSave={handleEdit} onClose={() => setEditing(null)} />}
      {deleting && <DeleteConfirm asset={deleting} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
