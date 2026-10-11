// src/automation/AIDepartmentCenter.jsx
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
  ShieldExclamationIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_BRANDS = ['All Brands', 'Dax the Traveler', 'Time-Zone Travelers', 'Ani-Dax', "God's Vessel"];
const STATUSES = ['Planned', 'Drafted', 'Testing', 'Active', 'Paused'];
const RISK_LEVELS = ['Low', 'Medium', 'High'];

const RISK_STYLES = {
  Low:    'bg-green-500/15 text-green-400 ring-1 ring-green-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30',
  High:   'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
};

const STATUS_STYLES = {
  Planned:  'bg-gray-700 text-gray-300',
  Drafted:  'bg-blue-500/15 text-blue-400',
  Testing:  'bg-purple-500/15 text-purple-400',
  Active:   'bg-green-500/15 text-green-400',
  Paused:   'bg-yellow-500/15 text-yellow-400',
};

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const SEED_DEPARTMENTS = [
  {
    id: 'dept-001',
    name: 'Strategy Desk',
    purpose: 'Sets the long-term direction of each brand, defines content pillars, and prioritizes what gets built next.',
    supportedBrands: ['All Brands'],
    responsibilities: [
      'Define quarterly brand objectives',
      'Maintain the content calendar framework',
      'Identify gaps between audience needs and current output',
      'Prioritize new section and product ideas',
      'Produce brand strategy briefs',
    ],
    inputsAccepted: [
      'Metrics reports from Metrics Desk',
      'Audience feedback and comments',
      'Competitor analysis',
      'Founder vision notes',
    ],
    outputsProduced: [
      'Quarterly brand briefs',
      'Content pillar definitions',
      'Prioritized idea backlog',
      'Decision memos',
    ],
    connectedWorkflows: ['Metrics Desk → Strategy Desk (quarterly)', 'Strategy Desk → Content Studio (brief handoff)', 'Strategy Desk → Research Desk (topic requests)'],
    humanApprovalPoint: 'Founder must approve all quarterly briefs and any change to brand pillars before distribution.',
    riskLevel: 'Medium',
    status: 'Planned',
    mustNeverDo: [
      'Autonomously change brand voice or visual identity',
      'Approve content for publishing',
      'Set revenue targets without founder input',
    ],
    notes: 'This desk is the nerve center. Nothing moves without a strategy brief originating here.',
    nextAction: 'Draft the Q3 brand briefs for all four brands using the existing content pillars.',
  },
  {
    id: 'dept-002',
    name: 'Research Desk',
    purpose: 'Sources facts, destinations, anime lore, scripture references, and market data to support content accuracy.',
    supportedBrands: ['All Brands'],
    responsibilities: [
      'Research destination facts and logistics for travel content',
      'Verify anime canon, lore, and character data',
      'Cross-reference scripture and Hebrew name etymology',
      'Compile destination budget data and cost-of-living estimates',
      'Summarize trending topics per brand niche',
    ],
    inputsAccepted: [
      'Topic briefs from Strategy Desk',
      'Content requests from Content Studio',
      'Fact-check requests from Compliance Desk',
    ],
    outputsProduced: [
      'Research packages (structured markdown notes)',
      'Source-cited fact sheets',
      'Scripture and etymology summaries for God\'s Vessel',
      'Destination data briefs for travel content',
    ],
    connectedWorkflows: ['Strategy Desk → Research Desk (topic request)', 'Research Desk → Content Studio (research package)'],
    humanApprovalPoint: 'Human reviews all scripture references and Hebrew etymology before they enter any God\'s Vessel content.',
    riskLevel: 'Low',
    status: 'Planned',
    mustNeverDo: [
      'Fabricate citations or scripture references',
      'Make theological claims beyond factual description',
      'Present speculation as confirmed canon for anime content',
    ],
    notes: 'Output must always include source provenance. No unsourced claims enter the content pipeline.',
    nextAction: 'Build the research request template so Content Studio can submit structured requests.',
  },
  {
    id: 'dept-003',
    name: 'Content Studio',
    purpose: 'Drafts long-form blog posts, product descriptions, section copy, and brand editorial content.',
    supportedBrands: ['Dax the Traveler', 'Time-Zone Travelers', 'Ani-Dax', "God's Vessel"],
    responsibilities: [
      'Write blog posts from approved research packages',
      'Draft product copy for God\'s Vessel archive entries',
      'Write section copy for new brand page sections',
      'Produce content outlines for Video Room',
      'Maintain voice consistency across all four brands',
    ],
    inputsAccepted: [
      'Research packages from Research Desk',
      'Brand briefs from Strategy Desk',
      'Video scripts for blog companion pieces',
    ],
    outputsProduced: [
      'Draft blog posts (markdown)',
      'Product description copy',
      'Section copy (hero text, eyebrow labels, body text)',
      'Content outlines for video',
    ],
    connectedWorkflows: ['Research Desk → Content Studio (research package)', 'Content Studio → Compliance Desk (pre-publish review)', 'Content Studio → Publishing Desk (approved drafts)'],
    humanApprovalPoint: 'Every draft must be reviewed and approved by founder before it goes to Compliance Desk.',
    riskLevel: 'Medium',
    status: 'Planned',
    mustNeverDo: [
      'Publish anything without founder approval',
      'Write in first person without explicit brand voice permission',
      'Mix brand voices (e.g., use Ani-Dax tone in God\'s Vessel copy)',
      'Use banned terminology (e.g., "Journey Logs" for Dax Traveler)',
    ],
    notes: 'Each brand has a distinct voice. Content Studio must maintain a voice guide per brand. Never blend.',
    nextAction: 'Build the brand voice guide for all four brands as a reference document.',
  },
  {
    id: 'dept-004',
    name: 'Video Room',
    purpose: 'Plans, scripts, and structures video content for YouTube, TikTok, and Reels across all brands.',
    supportedBrands: ['Dax the Traveler', 'Time-Zone Travelers', 'Ani-Dax'],
    responsibilities: [
      'Generate video concepts from content briefs',
      'Write scripts and shot lists',
      'Create YouTube title and description drafts',
      'Produce short-form content angle breakdowns (Reels/TikTok)',
      'Link video topics to blog companion pieces',
    ],
    inputsAccepted: [
      'Content outlines from Content Studio',
      'Brand briefs from Strategy Desk',
      'Published blog posts for repurposing',
    ],
    outputsProduced: [
      'Video scripts (structured markdown)',
      'Shot lists',
      'YouTube metadata drafts (title, description, tags)',
      'Short-form angle breakdowns',
    ],
    connectedWorkflows: ['Content Studio → Video Room (outlines)', 'Video Room → Compliance Desk (script review)', 'Video Room → Publishing Desk (metadata)'],
    humanApprovalPoint: 'Founder approves all scripts before filming. No shot list is finalized without sign-off.',
    riskLevel: 'Medium',
    status: 'Planned',
    mustNeverDo: [
      'Script content that requires live location access or personal safety exposure without planning',
      'Use copyrighted music recommendations without license reference',
      'Auto-schedule or publish video descriptions',
    ],
    notes: 'God\'s Vessel is intentionally excluded — video strategy for that brand is undecided.',
    nextAction: 'Create a video script template for each supported brand and store it in the Content Packages system.',
  },
  {
    id: 'dept-005',
    name: 'Brand & Design Desk',
    purpose: 'Maintains visual consistency, generates design briefs, and manages asset requests for all four brands.',
    supportedBrands: ['All Brands'],
    responsibilities: [
      'Maintain per-brand design system documentation',
      'Generate Canva asset request briefs',
      'Review new page designs for brand consistency',
      'Define component styles for new sections',
      'Manage the Canva asset manifest',
    ],
    inputsAccepted: [
      'New section requests from Content Studio',
      'Product mockup requests from God\'s Vessel team',
      'Social asset requests from Publishing Desk',
    ],
    outputsProduced: [
      'Design briefs (what to create, dimensions, tone, color)',
      'Brand system reference docs',
      'Canva asset manifests',
      'Component style specs for dev handoff',
    ],
    connectedWorkflows: ['Content Studio → Brand & Design Desk (new section design requests)', 'Brand & Design Desk → Publishing Desk (approved assets)'],
    humanApprovalPoint: 'Founder approves all design briefs before assets are created. No new visual direction is set without review.',
    riskLevel: 'Low',
    status: 'Planned',
    mustNeverDo: [
      'Change brand color palettes without explicit founder approval',
      'Redesign God\'s Vessel without a specific "cream to dark" decision from founder',
      'Generate real images or AI art without a brief review',
    ],
    notes: 'God\'s Vessel uses cream (#F5F1E8) palette. Pending decision on dark mode — do not assume approval.',
    nextAction: 'Write the brand design system doc for each of the four brands, including fonts, colors, and tone.',
  },
  {
    id: 'dept-006',
    name: 'Compliance Desk',
    purpose: 'Reviews all content for affiliate disclosures, fair use compliance, accuracy, and brand policy adherence.',
    supportedBrands: ['All Brands'],
    responsibilities: [
      'Check affiliate link disclosures on all blog posts',
      'Verify fair use compliance for AniDax content (anime analysis)',
      'Flag banned terminology before publish',
      'Check scripture and theological claims for accuracy',
      'Review legal pages (Privacy, Disclosure) for completeness',
    ],
    inputsAccepted: [
      'Draft blog posts from Content Studio',
      'Video scripts from Video Room',
      'Product copy from Content Studio',
      'New legal page drafts',
    ],
    outputsProduced: [
      'Compliance review checklists',
      'Flagged issues reports',
      'Cleared-for-publish sign-offs',
      'Disclosure insertion recommendations',
    ],
    connectedWorkflows: ['Content Studio → Compliance Desk (draft review)', 'Video Room → Compliance Desk (script review)', 'Compliance Desk → Publishing Desk (cleared drafts)'],
    humanApprovalPoint: 'Founder receives all compliance flags. Nothing with a High-severity flag proceeds without explicit clearance.',
    riskLevel: 'High',
    status: 'Planned',
    mustNeverDo: [
      'Clear content with unresolved High-severity flags',
      'Override legal disclosure requirements for any reason',
      'Approve theological claims it cannot independently verify',
      'Mark content compliant without checking all brands\' specific policies',
    ],
    notes: 'This is the highest-risk desk because errors here carry legal and reputational consequences. Every workflow must pass through this desk before publishing.',
    nextAction: 'Build the compliance checklist template for each brand type (travel, anime, faith, lifestyle).',
  },
  {
    id: 'dept-007',
    name: 'Publishing Desk',
    purpose: 'Manages the final publication workflow: formatting, metadata, SEO, and scheduling — but never publishes without approval.',
    supportedBrands: ['All Brands'],
    responsibilities: [
      'Format approved content for production (blog, page sections)',
      'Write and optimize SEO metadata (title, description, slug)',
      'Update sitemap.xml with new post slugs',
      'Stage content in the Content Packages system',
      'Prepare social share copy for each piece',
    ],
    inputsAccepted: [
      'Cleared drafts from Compliance Desk',
      'Approved assets from Brand & Design Desk',
      'YouTube metadata from Video Room',
    ],
    outputsProduced: [
      'Production-ready markdown / JSX content',
      'SEO metadata packages',
      'Sitemap update files',
      'Social share copy',
    ],
    connectedWorkflows: ['Compliance Desk → Publishing Desk (cleared content)', 'Publishing Desk → (founder publish action)'],
    humanApprovalPoint: 'Founder is the only person who triggers the final publish action. Publishing Desk prepares — it never ships.',
    riskLevel: 'High',
    status: 'Planned',
    mustNeverDo: [
      'Autonomously publish or deploy content to production',
      'Modify routes, credentials, or private investor pages',
      'Update sitemap without a corresponding page being published',
      'Skip the Compliance Desk clearance step',
    ],
    notes: 'This desk is the final checkpoint before content goes live. Its job is preparation, not execution.',
    nextAction: 'Build the pre-publish checklist that the founder reviews before each publish action.',
  },
  {
    id: 'dept-008',
    name: 'Metrics Desk',
    purpose: 'Tracks content performance, audience signals, and platform analytics to inform Strategy Desk decisions.',
    supportedBrands: ['All Brands'],
    responsibilities: [
      'Monitor blog traffic and page performance',
      'Track YouTube and social video metrics',
      'Identify top-performing content per brand',
      'Summarize monthly performance into reports',
      'Flag underperforming content for review',
    ],
    inputsAccepted: [
      'Analytics data (Google Analytics, YouTube Studio)',
      'Published content inventory',
      'Historical performance benchmarks',
    ],
    outputsProduced: [
      'Monthly performance reports (per brand)',
      'Top-content summaries',
      'Underperformance flags',
      'Audience growth signals',
    ],
    connectedWorkflows: ['Metrics Desk → Strategy Desk (monthly report)', 'Metrics Desk → Content Studio (top-content signals)'],
    humanApprovalPoint: 'Reports are reviewed by founder before any strategy change is triggered.',
    riskLevel: 'Low',
    status: 'Planned',
    mustNeverDo: [
      'Change content or strategy based on metrics without founder review',
      'Correlate personal user data beyond aggregate analytics',
      'Make public-facing claims about audience size without verification',
    ],
    notes: 'This desk informs — it does not decide. All decisions based on its output must be made by the Strategy Desk or founder.',
    nextAction: 'Set up the monthly performance report template linked to the four brands.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateId = () => `dept-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const toMarkdown = (dept) => `# ${dept.name}

**Status:** ${dept.status}  
**Risk Level:** ${dept.riskLevel}  
**Supported Brands:** ${dept.supportedBrands.join(', ')}

## Purpose
${dept.purpose}

## Main Responsibilities
${dept.responsibilities.map((r) => `- ${r}`).join('\n')}

## Inputs Accepted
${dept.inputsAccepted.map((i) => `- ${i}`).join('\n')}

## Outputs Produced
${dept.outputsProduced.map((o) => `- ${o}`).join('\n')}

## Connected Workflows
${dept.connectedWorkflows.map((w) => `- ${w}`).join('\n')}

## Human Approval Point
${dept.humanApprovalPoint}

## Must Never Do
${dept.mustNeverDo.map((n) => `- ${n}`).join('\n')}

## Notes
${dept.notes}

## Next Action
${dept.nextAction}
`;

const exportAllMarkdown = (departments) =>
  departments.map((d) => toMarkdown(d)).join('\n\n---\n\n');

const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
};

const downloadFile = (content, filename) => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Empty form ───────────────────────────────────────────────────────────────

const emptyForm = () => ({
  name: '',
  purpose: '',
  supportedBrands: [],
  responsibilities: [''],
  inputsAccepted: [''],
  outputsProduced: [''],
  connectedWorkflows: [''],
  humanApprovalPoint: '',
  riskLevel: 'Low',
  status: 'Planned',
  mustNeverDo: [''],
  notes: '',
  nextAction: '',
});

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-800 border border-gray-600 text-white px-5 py-3 rounded-xl shadow-2xl"
  >
    <CheckCircleIcon className="h-5 w-5 text-green-400 shrink-0" />
    <span className="text-sm">{message}</span>
    <button onClick={onClose} className="text-gray-400 hover:text-white ml-2">
      <XMarkIcon className="h-4 w-4" />
    </button>
  </motion.div>
);

// ─── List field editor (responsibilities, inputs, etc.) ───────────────────────

const ListEditor = ({ label, values, onChange }) => {
  const handleChange = (i, val) => {
    const next = [...values];
    next[i] = val;
    onChange(next);
  };
  const handleAdd = () => onChange([...values, '']);
  const handleRemove = (i) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={v}
              onChange={(e) => handleChange(i, e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder={`Enter ${label.toLowerCase()} item...`}
            />
            {values.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
      >
        <PlusIcon className="h-3.5 w-3.5" />
        Add item
      </button>
    </div>
  );
};

// ─── Department Modal (Create/Edit) ───────────────────────────────────────────

const DepartmentModal = ({ dept, onSave, onClose }) => {
  const [form, setForm] = useState(dept ? { ...dept } : emptyForm());

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const toggleBrand = (brand) => {
    const current = form.supportedBrands;
    if (brand === 'All Brands') {
      set('supportedBrands', current.includes('All Brands') ? [] : ['All Brands']);
    } else {
      const withoutAll = current.filter((b) => b !== 'All Brands');
      const next = withoutAll.includes(brand)
        ? withoutAll.filter((b) => b !== brand)
        : [...withoutAll, brand];
      set('supportedBrands', next);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      ...form,
      id: form.id || generateId(),
      responsibilities: form.responsibilities.filter(Boolean),
      inputsAccepted: form.inputsAccepted.filter(Boolean),
      outputsProduced: form.outputsProduced.filter(Boolean),
      connectedWorkflows: form.connectedWorkflows.filter(Boolean),
      mustNeverDo: form.mustNeverDo.filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl my-8"
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">
            {dept ? `Edit: ${dept.name}` : 'New Department'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Name + Status + Risk */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Department Name *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Content Studio"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Risk Level</label>
              <select
                value={form.riskLevel}
                onChange={(e) => set('riskLevel', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
              >
                {RISK_LEVELS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Supported Brands</label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {ALL_BRANDS.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => toggleBrand(brand)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                      form.supportedBrands.includes(brand)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Purpose</label>
            <textarea
              value={form.purpose}
              onChange={(e) => set('purpose', e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="What is this department's core purpose?"
            />
          </div>

          {/* List editors */}
          <ListEditor label="Main Responsibilities" values={form.responsibilities} onChange={(v) => set('responsibilities', v)} />
          <ListEditor label="Inputs Accepted" values={form.inputsAccepted} onChange={(v) => set('inputsAccepted', v)} />
          <ListEditor label="Outputs Produced" values={form.outputsProduced} onChange={(v) => set('outputsProduced', v)} />
          <ListEditor label="Connected Workflows" values={form.connectedWorkflows} onChange={(v) => set('connectedWorkflows', v)} />

          {/* Approval point */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Human Approval Point</label>
            <textarea
              value={form.humanApprovalPoint}
              onChange={(e) => set('humanApprovalPoint', e.target.value)}
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="When does a human need to approve or review this department's output?"
            />
          </div>

          <ListEditor label="Must Never Do" values={form.mustNeverDo} onChange={(v) => set('mustNeverDo', v)} />

          {/* Notes + Next Action */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Next Action</label>
              <textarea
                value={form.nextAction}
                onChange={(e) => set('nextAction', e.target.value)}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
            >
              {dept ? 'Save Changes' : 'Create Department'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Delete confirmation ──────────────────────────────────────────────────────

const DeleteConfirm = ({ dept, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md bg-gray-900 border border-red-500/40 rounded-2xl shadow-2xl p-8 text-center"
    >
      <TrashIcon className="h-10 w-10 text-red-400 mx-auto mb-4" />
      <h3 className="text-white font-bold text-lg mb-2">Delete "{dept.name}"?</h3>
      <p className="text-gray-400 text-sm mb-6">
        This department record will be permanently deleted. This cannot be undone.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-sm text-gray-400 border border-gray-700 rounded-xl hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2.5 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors"
        >
          Delete
        </button>
      </div>
    </motion.div>
  </div>
);

// ─── Department Card ──────────────────────────────────────────────────────────

const DepartmentCard = ({ dept, onEdit, onDelete, onCopy, index }) => {
  const [expanded, setExpanded] = useState(false);
  const missingApproval = !dept.humanApprovalPoint?.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className={`bg-gray-800/50 border rounded-2xl overflow-hidden transition-colors ${
        dept.riskLevel === 'High'
          ? 'border-red-500/30 hover:border-red-500/50'
          : missingApproval
          ? 'border-yellow-500/30 hover:border-yellow-500/50'
          : 'border-gray-700 hover:border-gray-600'
      }`}
    >
      {/* Header row */}
      <div className="px-6 py-5 flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-white font-semibold text-base">{dept.name}</h3>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[dept.status]}`}>
              {dept.status}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${RISK_STYLES[dept.riskLevel]}`}>
              {dept.riskLevel} Risk
            </span>
            {missingApproval && (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30 flex items-center gap-1">
                <ExclamationTriangleIcon className="h-3 w-3" />
                No Approval Gate
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">{dept.purpose}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {dept.supportedBrands.map((b) => (
              <span key={b} className="text-[10px] bg-gray-700/60 text-gray-300 px-2 py-0.5 rounded-full">
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onCopy(dept)}
            title="Copy as Markdown"
            className="p-2 text-gray-500 hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-700/50"
          >
            <ClipboardDocumentIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(dept)}
            title="Edit"
            className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(dept)}
            title="Delete"
            className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-700/50"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? 'Collapse' : 'Expand'}
            className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
          >
            {expanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
        </div>
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
            <div className="border-t border-gray-700/60 px-6 py-5 grid sm:grid-cols-2 gap-6 text-sm">
              {[
                { label: 'Main Responsibilities', items: dept.responsibilities },
                { label: 'Inputs Accepted', items: dept.inputsAccepted },
                { label: 'Outputs Produced', items: dept.outputsProduced },
                { label: 'Connected Workflows', items: dept.connectedWorkflows },
              ].map(({ label, items }) => (
                <div key={label}>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">{label}</div>
                  <ul className="space-y-1">
                    {items.map((item, i) => (
                      <li key={i} className="text-gray-300 text-xs flex items-start gap-1.5">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="sm:col-span-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Human Approval Point</div>
                <p className="text-gray-300 text-xs bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3">
                  {dept.humanApprovalPoint || <span className="text-yellow-400 flex items-center gap-1.5"><ExclamationTriangleIcon className="h-3.5 w-3.5" /> Not defined — add an approval gate.</span>}
                </p>
              </div>

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-red-400 mb-2">Must Never Do</div>
                <ul className="space-y-1">
                  {dept.mustNeverDo.map((item, i) => (
                    <li key={i} className="text-gray-300 text-xs flex items-start gap-1.5">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                {dept.notes && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Notes</div>
                    <p className="text-gray-400 text-xs">{dept.notes}</p>
                  </div>
                )}
                {dept.nextAction && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Next Action</div>
                    <p className="text-gray-300 text-xs bg-gray-700/40 border border-gray-600 rounded-lg px-3 py-2">{dept.nextAction}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const STORAGE_KEY = 'dax_ai_departments';

const AIDepartmentCenter = () => {
  const [departments, setDepartments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : SEED_DEPARTMENTS;
    } catch {
      return SEED_DEPARTMENTS;
    }
  });

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');
  const [activeView, setActiveView] = useState('all');

  const [modalMode, setModalMode] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [deletingDept, setDeletingDept] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
    } catch { /* storage quota or read-only mode */ }
  }, [departments]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (data) => {
    if (editingDept) {
      setDepartments((prev) => prev.map((d) => (d.id === data.id ? data : d)));
      showToast('Department updated.');
    } else {
      setDepartments((prev) => [...prev, data]);
      showToast('Department created.');
    }
    setModalMode(null);
    setEditingDept(null);
  };

  const handleDelete = () => {
    setDepartments((prev) => prev.filter((d) => d.id !== deletingDept.id));
    showToast(`"${deletingDept.name}" deleted.`);
    setDeletingDept(null);
  };

  const handleCopy = (dept) => {
    copyToClipboard(toMarkdown(dept));
    showToast(`"${dept.name}" copied as Markdown.`);
  };

  const handleExportAll = () => {
    const md = exportAllMarkdown(departments);
    downloadFile(md, 'ai-departments.md');
    showToast('All departments exported as Markdown.');
  };

  const highRisk = departments.filter((d) => d.riskLevel === 'High');
  const missingApproval = departments.filter((d) => !d.humanApprovalPoint?.trim());

  const filtered = useMemo(() => {
    return departments.filter((d) => {
      if (activeView === 'high-risk') return d.riskLevel === 'High';
      if (activeView === 'missing-approval') return !d.humanApprovalPoint?.trim();
      if (filterStatus !== 'All' && d.status !== filterStatus) return false;
      if (filterBrand !== 'All' && !d.supportedBrands.includes(filterBrand) && !d.supportedBrands.includes('All Brands')) return false;
      if (filterRisk !== 'All' && d.riskLevel !== filterRisk) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.purpose.toLowerCase().includes(q) ||
          d.notes.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [departments, search, filterStatus, filterBrand, filterRisk, activeView]);

  const views = [
    { id: 'all', label: `All (${departments.length})` },
    { id: 'high-risk', label: `High Risk (${highRisk.length})`, warn: highRisk.length > 0 },
    { id: 'missing-approval', label: `Missing Approval (${missingApproval.length})`, warn: missingApproval.length > 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Department Command Center</h2>
          <p className="text-gray-400 text-sm mt-1">
            Plan and control your AI agent departments. No live agents — this is your blueprint.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleExportAll}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Export All
          </button>
          <button
            onClick={() => { setEditingDept(null); setModalMode('create'); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            New Department
          </button>
        </div>
      </div>

      {/* Warning banners */}
      {highRisk.length > 0 && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4">
          <ShieldExclamationIcon className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="text-red-400 font-semibold">High-Risk Departments:</span>{' '}
            <span className="text-gray-300">{highRisk.map((d) => d.name).join(', ')} — review approval gates and constraints carefully.</span>
          </div>
        </div>
      )}
      {missingApproval.length > 0 && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-5 py-4">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="text-yellow-400 font-semibold">Missing Approval Gates:</span>{' '}
            <span className="text-gray-300">{missingApproval.map((d) => d.name).join(', ')} — these departments have no human approval point defined.</span>
          </div>
        </div>
      )}

      {/* View switcher + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* View tabs */}
        <div className="flex gap-1 p-1 bg-gray-800/60 border border-gray-700 rounded-xl shrink-0">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeView === v.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {v.warn && <span className="h-1.5 w-1.5 rounded-full bg-red-400" />}
              {v.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search departments..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status filter */}
        {activeView === 'all' && (
          <>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Risk</option>
              {RISK_LEVELS.map((r) => <option key={r}>{r}</option>)}
            </select>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Brands</option>
              {ALL_BRANDS.filter(b => b !== 'All Brands').map((b) => <option key={b}>{b}</option>)}
            </select>
          </>
        )}
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: departments.length, color: 'text-white' },
          { label: 'Active', value: departments.filter(d => d.status === 'Active').length, color: 'text-green-400' },
          { label: 'High Risk', value: highRisk.length, color: 'text-red-400' },
          { label: 'No Approval Gate', value: missingApproval.length, color: 'text-yellow-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-800/40 border border-gray-700 rounded-xl px-4 py-3">
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Department list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <MagnifyingGlassIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No departments match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((dept, i) => (
            <DepartmentCard
              key={dept.id}
              dept={dept}
              index={i}
              onEdit={(d) => { setEditingDept(d); setModalMode('edit'); }}
              onDelete={(d) => setDeletingDept(d)}
              onCopy={handleCopy}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modalMode && (
          <DepartmentModal
            dept={editingDept}
            onSave={handleSave}
            onClose={() => { setModalMode(null); setEditingDept(null); }}
          />
        )}
        {deletingDept && (
          <DeleteConfirm
            dept={deletingDept}
            onConfirm={handleDelete}
            onClose={() => setDeletingDept(null)}
          />
        )}
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default AIDepartmentCenter;
