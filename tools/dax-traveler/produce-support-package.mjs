#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const cli = parseArgs(process.argv.slice(2));
const outRoot = path.join(root, cli.out || path.join('artifacts', 'dax-the-traveler', 'sprint-4-support'));
const generatedDir = path.join(outRoot, 'generated');
const renderDir = path.join(outRoot, 'render');
const thumbnailDir = path.join(outRoot, 'thumbnail');

for (const dir of [outRoot, generatedDir, renderDir, thumbnailDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const now = new Date().toISOString();
const approvedMedia = loadApprovedMedia();
const daxAssets = approvedMedia
  .filter(
    (asset) =>
      asset.brand === 'Dax the Traveler' &&
      asset.usageStatus === 'Approved' &&
      asset.privacyStatus === 'Public Safe',
  )
  .map((asset) => ({
    ...asset,
    absolutePath: path.join(root, 'dax-main', 'public', asset.filePath.replace(/^\//, '')),
  }));

if (daxAssets.length === 0) {
  throw new Error('No approved public-safe Dax the Traveler assets found.');
}

const seriesCounts = countBy(daxAssets, 'relatedSeries');
const destinationCounts = countBy(daxAssets, 'location');
const tagCounts = countTags(daxAssets);

const inventory = {
  generatedAt: now,
  brand: 'Dax the Traveler',
  source: 'dax-main/src/data/approvedMedia.js',
  rule: 'Only assets marked Approved and Public Safe are included.',
  totalApprovedPublicSafeAssets: daxAssets.length,
  assetTypes: countBy(daxAssets, 'assetType'),
  seriesCounts,
  destinationCounts,
  topTags: Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([tag, count]) => ({ tag, count })),
  analyticsStatus:
    'No live YouTube/TikTok/Instagram analytics were available in this repository session, so performance scores are opportunity estimates, not historical-performance claims.',
  assets: daxAssets.map((asset) => ({
    id: asset.id,
    title: asset.title,
    filePath: asset.filePath,
    exists: fs.existsSync(asset.absolutePath),
    assetType: asset.assetType,
    location: asset.location,
    tripYear: asset.tripYear,
    relatedSeries: asset.relatedSeries,
    tags: asset.tags,
    peopleShown: asset.peopleShown,
    notes: asset.notes,
  })),
};

const opportunities = buildOpportunities(daxAssets);
const selectedOpportunity = opportunities[0];
const selectedAssets = selectedOpportunity.sourceAssetIds
  .map((id) => daxAssets.find((asset) => asset.id === id))
  .filter(Boolean);

const contentId = `dtt-${localDateStamp(new Date(now))}-puerto-rico-repurpose`;

const draftSegments = [
  {
    start: 0,
    end: 4,
    label: 'Hook card',
    overlay: 'Puerto Rico memory draft',
    danielPrompt: 'Daniel: record the real feeling or lesson behind this saved moment.',
  },
  {
    start: 4,
    end: 10,
    label: 'Original asset proof',
    overlay: 'Use original Daniel material only',
    danielPrompt: 'Name the specific clip or photo source before approving this draft.',
  },
  {
    start: 10,
    end: 17,
    label: 'Moment selection',
    overlay: 'Best moment: the decision point',
    danielPrompt: 'Explain what made the moment worth filming or remembering.',
  },
  {
    start: 17,
    end: 24,
    label: 'Viewer value',
    overlay: 'Turn the memory into one useful travel lesson',
    danielPrompt: 'Add one practical tip that is true from Daniel experience.',
  },
  {
    start: 24,
    end: 30,
    label: 'Approval gate',
    overlay: 'Ready for Daniel review',
    danielPrompt: 'Approve, revise, or reject before any public post.',
  },
];

const supportPackage = {
  generatedAt: now,
  brand: 'Dax the Traveler',
  contentId,
  status: 'READY_FOR_DANIEL_REVIEW',
  publishAllowed: false,
  purpose:
    'Support Daniel by inventorying existing approved material and preparing repurposing drafts without replacing his face, voice, or lived experience.',
  selectedOpportunity,
  selectedAssets: selectedAssets.map((asset) => ({
    id: asset.id,
    title: asset.title,
    filePath: asset.filePath,
    location: asset.location,
    relatedSeries: asset.relatedSeries,
    rights: 'Original approved repository media, marked Approved and Public Safe.',
  })),
  boundaries: {
    originalDanielMaterial:
      'Only approved repository media is used in the proof render. No third-party travel footage is pulled.',
    aiGeneratedSupport:
      'This tool creates planning records, captions, overlays, storyboard, thumbnail SVG, and a silent proof render.',
    thirdPartyMaterial:
      'None used in the local proof. Any future third-party asset requires licensing and explicit tracking.',
    personalExperience:
      'The draft uses prompts for Daniel to supply real narration. It does not fabricate that Daniel said, did, liked, bought, or experienced anything beyond existing approved asset metadata.',
  },
  draftSegments,
  draftShort: {
    format: 'Short / Reel / TikTok draft',
    durationSeconds: 30,
    workingTitle: 'The Travel Moment Worth Saving',
    finalNarrationStatus: 'NEEDS_DANIEL_OR_APPROVED_VOICE',
    captionDraft:
      'Draft built from approved Dax the Traveler media. Daniel review required before any public post.',
    thumbnailText: 'REAL TRAVEL MEMORY',
  },
  approvalGate: {
    requiredBeforePublishing: [
      'Daniel approves the selected source assets.',
      'Daniel records or approves final narration.',
      'No AI voice replacement is used without Daniel approval.',
      'Platform account mapping is verified.',
      'Any affiliate or product link is legitimate and approved.',
    ],
  },
  qc: [
    ['Personal brand protection', 'PASS', 'No face or voice replacement is attempted.'],
    ['No fabricated experience', 'PASS', 'Draft uses Daniel prompts instead of invented first-person claims.'],
    ['Original material separation', 'PASS', 'Selected assets are listed as original approved repository material.'],
    ['Third-party material', 'PASS', 'No third-party media is used.'],
    ['Publishing gate', 'BLOCKED', 'Public publishing requires Daniel approval.'],
    ['Analytics', 'PARTIAL', 'Tracking schema exists, but live platform analytics were not available.'],
    ['Revenue tracking', 'PARTIAL', 'Attribution fields exist, but no active affiliate enrollment is claimed.'],
  ],
};

const contentQueue = [
  {
    contentId,
    brand: 'Dax the Traveler',
    title: supportPackage.draftShort.workingTitle,
    status: 'READY_FOR_DANIEL_REVIEW',
    sourceAssetIds: selectedOpportunity.sourceAssetIds,
    materialType: 'ORIGINAL_DANIEL_MATERIAL_WITH_AI_GENERATED_SUPPORT',
    publishAllowed: false,
    nextOwner: 'Daniel',
    nextAction: 'Approve/revise selected assets and record final narration.',
  },
];

const analyticsRecord = {
  brand: 'Dax the Traveler',
  contentId,
  concept: selectedOpportunity.title,
  format: 'short',
  platform: 'pending approval',
  publishDate: null,
  views: 0,
  impressions: 0,
  ctr: 0,
  watchTime: 0,
  retention: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  subscribersGained: 0,
  clicks: 0,
  conversions: 0,
  revenue: 0,
  productionCost: 0,
  aiApiCost: 0,
  profitEstimate: 0,
};

const revenueTracking = {
  brand: 'Dax the Traveler',
  contentId,
  status: 'TRACKING_READY_NO_ACTIVE_MONETIZED_LINKS',
  adSpendUsd: 0,
  activeAffiliateProgramsVerified: [],
  links: [
    {
      label: 'Dax the Traveler YouTube',
      url: addUtm('https://www.youtube.com/@daxthetraveler', contentId, 'profile_link'),
      affiliate: false,
    },
    {
      label: 'Dax the Traveler Instagram',
      url: addUtm('https://www.instagram.com/daxthetraveler', contentId, 'profile_link'),
      affiliate: false,
    },
  ],
  futureMonetizationPaths: [
    'Legitimate travel gear affiliate links after approval/enrollment.',
    'Activities/tours links after approval/enrollment and destination relevance review.',
    'Sponsorships after Daniel approves brand fit.',
    'Digital travel guides after audience proof.',
  ],
};

const costRecord = {
  generatedAt: now,
  localProofRunUsd: {
    llm: 0,
    imageGeneration: 0,
    videoGeneration: 0,
    tts: 0,
    music: 0,
    storage: 0,
    api: 0,
    other: 0,
  },
  notes:
    'Local Sprint 4 support proof uses repository assets, deterministic SVG/ASS, and FFmpeg only. No paid services, orders, or public publishing.',
};

function loadApprovedMedia() {
  const sourcePath = path.join(root, 'dax-main', 'src', 'data', 'approvedMedia.js');
  const source = fs.readFileSync(sourcePath, 'utf8');
  const match = source.match(/export const approvedMedia = (\[[\s\S]*?\n\]);/);
  if (!match) {
    throw new Error('Could not locate approvedMedia array.');
  }
  return Function(`"use strict"; return (${match[1]});`)();
}

function parseArgs(args) {
  const parsed = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const next = args[index + 1];
    if (!next || next.startsWith('--')) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key] || 'Unknown';
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function countTags(items) {
  return items.reduce((counts, item) => {
    for (const tag of item.tags || []) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
    return counts;
  }, {});
}

function byId(assets, ids) {
  return ids.filter((id) => assets.some((asset) => asset.id === id));
}

function buildOpportunities(assets) {
  const opportunities = [
    {
      id: 'dtt-repurpose-001',
      title: 'Puerto Rico memory Short built around the decision point',
      format: 'Short',
      status: 'READY_FOR_DANIEL_REVIEW',
      priorityScore: 87,
      sourceAssetIds: byId(assets, ['dtt-vlog-003', 'dtt-wander-001', 'dtt-jump-001', 'dtt-kit-002']),
      why:
        'Combines adventure, logistics, and practical value from approved Puerto Rico assets without inventing a story.',
      danielNeedsToProvide:
        'Actual narration about what happened, what he felt, and one practical tip from the trip.',
      safeDraftAngle:
        'What made this Puerto Rico moment worth saving, and what another traveler should prepare before saying yes.',
    },
    {
      id: 'dtt-repurpose-002',
      title: 'Cuba arrival and street-walk recap',
      format: 'Short or 2-minute recap',
      status: 'DRAFT_RECOMMENDATION',
      priorityScore: 80,
      sourceAssetIds: byId(assets, ['dtt-jump-002', 'dtt-wander-002', 'dtt-vlog-002', 'dtt-seen-001']),
      why:
        'Approved Cuba assets provide a clear arrival-to-street narrative, but Daniel should supply first-person context before publication.',
      danielNeedsToProvide: 'Real trip details, safety boundaries, and current Cuba travel caveats before public use.',
      safeDraftAngle: 'What a first arrival in Havana looked like from Daniel original material.',
    },
    {
      id: 'dtt-repurpose-003',
      title: 'Dax Travel Kit packing tip',
      format: 'Short / carousel / affiliate-ready draft',
      status: 'DRAFT_RECOMMENDATION',
      priorityScore: 76,
      sourceAssetIds: byId(assets, ['dtt-kit-001', 'dtt-kit-002', 'dtt-jump-001']),
      why:
        'Gear assets can support low-cost monetization later, but no product or affiliate claim should be made until Daniel approves links.',
      danielNeedsToProvide: 'Actual gear list, ownership/usage confirmation, and approved monetized links if any.',
      safeDraftAngle: 'What stays in the bag for a light travel day.',
    },
  ];

  return opportunities.filter((opportunity) => opportunity.sourceAssetIds.length > 0);
}

function addUtm(url, contentId, medium) {
  const parsed = new URL(url);
  parsed.searchParams.set('utm_source', 'dax-the-traveler');
  parsed.searchParams.set('utm_medium', medium);
  parsed.searchParams.set('utm_campaign', contentId);
  return parsed.toString();
}

function localDateStamp(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function srtTimestamp(seconds) {
  const whole = Math.floor(seconds);
  const ms = Math.round((seconds - whole) * 1000);
  const h = String(Math.floor(whole / 3600)).padStart(2, '0');
  const m = String(Math.floor((whole % 3600) / 60)).padStart(2, '0');
  const s = String(whole % 60).padStart(2, '0');
  return `${h}:${m}:${s},${String(ms).padStart(3, '0')}`;
}

function assTimestamp(seconds) {
  const whole = Math.floor(seconds);
  const cs = Math.round((seconds - whole) * 100);
  const h = Math.floor(whole / 3600);
  const m = String(Math.floor((whole % 3600) / 60)).padStart(2, '0');
  const s = String(whole % 60).padStart(2, '0');
  return `${h}:${m}:${s}.${String(cs).padStart(2, '0')}`;
}

function wrapAss(text, max = 32) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4).join('\\N');
}

function buildSrt() {
  return draftSegments
    .map((segment, index) =>
      [
        index + 1,
        `${srtTimestamp(segment.start)} --> ${srtTimestamp(segment.end)}`,
        segment.overlay,
        segment.danielPrompt,
        '',
      ].join('\n'),
    )
    .join('\n');
}

function buildAss() {
  const lines = [
    '[Script Info]',
    'ScriptType: v4.00+',
    'PlayResX: 1080',
    'PlayResY: 1920',
    '',
    '[V4+ Styles]',
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    'Style: Title,Arial,72,&H00FFFFFF,&H00FFFFFF,&H00101010,&H99000000,1,0,0,0,100,100,0,0,1,4,1,8,64,64,150,1',
    'Style: Body,Arial,58,&H00FFFFFF,&H0038BDF8,&H00101010,&HBB000000,0,0,0,0,100,100,0,0,1,4,1,5,82,82,0,1',
    'Style: Footer,Arial,32,&H00F59E0B,&H00FFFFFF,&H00101010,&H99000000,0,0,0,0,100,100,0,0,1,3,1,2,60,60,130,1',
    '',
    '[Events]',
    'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
    'Dialogue: 0,0:00:00.00,0:00:30.00,Title,,0,0,0,,DAX THE TRAVELER // SUPPORT DRAFT',
    'Dialogue: 0,0:00:00.00,0:00:30.00,Footer,,0,0,0,,Non-public proof. Daniel approval and real narration required.',
  ];

  for (const segment of draftSegments) {
    lines.push(
      `Dialogue: 0,${assTimestamp(segment.start)},${assTimestamp(segment.end)},Body,,0,0,0,,${wrapAss(segment.overlay)}`,
    );
  }

  return `${lines.join('\n')}\n`;
}

function buildStoryboardSvg() {
  const rows = draftSegments
    .map((segment, index) => {
      const y = 170 + index * 155;
      return `
      <rect x="110" y="${y}" width="1700" height="116" rx="18" fill="#0F172A" stroke="#334155"/>
      <text x="150" y="${y + 36}" fill="#38BDF8" font-family="Arial" font-size="30" font-weight="800">${escapeXml(segment.label)}</text>
      <text x="150" y="${y + 78}" fill="#FFFFFF" font-family="Arial" font-size="34">${escapeXml(segment.overlay)}</text>
      <text x="760" y="${y + 48}" fill="#F59E0B" font-family="Arial" font-size="24">${escapeXml(segment.danielPrompt)}</text>`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#0A0E17"/>
  <text x="110" y="100" fill="#FFFFFF" font-family="Arial" font-size="58" font-weight="900">DAX THE TRAVELER SUPPORT STORYBOARD</text>
  <text x="110" y="142" fill="#38BDF8" font-family="Arial" font-size="28">${escapeXml(selectedOpportunity.title)}</text>
${rows}
</svg>
`;
}

function buildThumbnailSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#07111F"/>
      <stop offset="55%" stop-color="#0F3A5F"/>
      <stop offset="100%" stop-color="#7C2D12"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg)"/>
  <path d="M170 760 C460 500 760 820 1030 560 S1440 430 1710 270" fill="none" stroke="#38BDF8" stroke-width="18" stroke-dasharray="36 26"/>
  <rect x="118" y="140" width="700" height="104" rx="52" fill="#FFFFFF" opacity="0.1"/>
  <text x="160" y="210" fill="#FFFFFF" font-family="Arial" font-size="54" font-weight="900">DAX THE TRAVELER</text>
  <text x="118" y="520" fill="#FFFFFF" font-family="Arial" font-size="150" font-weight="900">REAL</text>
  <text x="118" y="680" fill="#F59E0B" font-family="Arial" font-size="150" font-weight="900">TRAVEL</text>
  <text x="118" y="820" fill="#FFFFFF" font-family="Arial" font-size="94" font-weight="900">MEMORY</text>
  <text x="124" y="940" fill="#BAE6FD" font-family="Arial" font-size="42" font-weight="700">Draft Short - Daniel approval required</text>
</svg>
`;
}

function buildApprovalMarkdown(renderReport) {
  const assetRows = selectedAssets
    .map((asset) => `| ${asset.id} | ${asset.title} | ${asset.location} | ${asset.filePath} |`)
    .join('\n');
  const qcRows = supportPackage.qc.map(([gate, status, note]) => `| ${gate} | ${status} | ${note} |`).join('\n');
  const queueRows = contentQueue
    .map((item) => `| ${item.contentId} | ${item.status} | ${item.nextOwner} | ${item.nextAction} |`)
    .join('\n');

  return `# Dax the Traveler Sprint 4 Support Package

Generated: ${now}

## Status

- Support package: READY_FOR_DANIEL_REVIEW
- Public publishing: BLOCKED_NEEDS_DANIEL_APPROVAL
- Render proof: ${renderReport.rendered ? 'CREATED' : 'NOT CREATED'}
- Voice/narration: NEEDS_DANIEL_OR_APPROVED_VOICE
- Active affiliate enrollment: NONE CLAIMED

## Purpose

Inventory approved Dax the Traveler material and create one repurposing draft without replacing Daniel's face, replacing his voice, or inventing personal travel experiences.

## Selected Opportunity

${selectedOpportunity.title}

${selectedOpportunity.why}

Daniel must provide: ${selectedOpportunity.danielNeedsToProvide}

## Source Assets

| ID | Title | Location | File |
| --- | --- | --- | --- |
${assetRows}

## Queue

| Content ID | Status | Owner | Next Action |
| --- | --- | --- | --- |
${queueRows}

## QC

| Gate | Status | Evidence |
| --- | --- | --- |
${qcRows}

## Publishing Gate

\`publishAllowed\` is false. Public posting requires Daniel approval, final narration, platform account mapping, and approved monetized links if any.

## Cost

Local proof run cost: $0.00. No paid APIs, ad spend, orders, subscriptions, or public publishing were used.

## Files

- inventory: \`generated/content-inventory.json\`
- opportunities: \`generated/repurposing-opportunities.json\`
- support package: \`generated/support-package.json\`
- queue: \`generated/content-queue.json\`
- captions: \`generated/captions.srt\`
- storyboard: \`generated/storyboard.svg\`
- thumbnail: \`thumbnail/thumbnail.svg\`
- render proof: \`${renderReport.videoPath || 'not created'}\`
`;
}

function renderProof() {
  const assPath = path.join(renderDir, 'proof.ass');
  fs.writeFileSync(assPath, buildAss());

  const existingAssets = selectedAssets.filter((asset) => fs.existsSync(asset.absolutePath));
  const videoPath = path.join(renderDir, 'dax-traveler-proof-render.mp4');
  const args = ['-y'];

  if (existingAssets.length >= 4) {
    for (const asset of existingAssets.slice(0, 4)) {
      args.push('-loop', '1', '-t', '7.5', '-i', asset.absolutePath);
    }
    args.push('-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100');
    args.push(
      '-filter_complex',
      '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[v0];[1:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[v1];[2:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[v2];[3:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[v3];[v0][v1][v2][v3]concat=n=4:v=1:a=0,format=yuv420p,ass=proof.ass[v]',
      '-map',
      '[v]',
      '-map',
      '4:a',
    );
  } else {
    args.push('-f', 'lavfi', '-i', 'color=c=0x0A0E17:s=1080x1920:d=30:r=30');
    args.push('-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100');
    args.push('-vf', 'ass=proof.ass', '-map', '0:v', '-map', '1:a');
  }

  args.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest', 'dax-traveler-proof-render.mp4');

  const ffmpeg = spawnSync('ffmpeg', args, {
    cwd: renderDir,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });

  const report = {
    generatedAt: now,
    rendered: ffmpeg.status === 0 && fs.existsSync(videoPath),
    videoPath: path.relative(root, videoPath).replace(/\\/g, '/'),
    audioSource: 'silent-placeholder',
    command: `ffmpeg ${args.join(' ')}`,
    status: ffmpeg.status,
    usedAssets: existingAssets.map((asset) => asset.filePath),
    stderrTail: (ffmpeg.stderr || '').split(/\r?\n/).slice(-25),
  };

  if (report.rendered) {
    const ffprobe = spawnSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration,size', '-of', 'json', 'dax-traveler-proof-render.mp4'],
      { cwd: renderDir, encoding: 'utf8' },
    );
    report.ffprobe = ffprobe.status === 0 ? JSON.parse(ffprobe.stdout) : { error: ffprobe.stderr };
  }

  writeJson(path.join(renderDir, 'render-report.json'), report);
  return report;
}

writeJson(path.join(generatedDir, 'content-inventory.json'), inventory);
writeJson(path.join(generatedDir, 'repurposing-opportunities.json'), opportunities);
writeJson(path.join(generatedDir, 'support-package.json'), supportPackage);
writeJson(path.join(generatedDir, 'content-queue.json'), contentQueue);
writeJson(path.join(generatedDir, 'analytics-record.json'), analyticsRecord);
writeJson(path.join(generatedDir, 'revenue-tracking-record.json'), revenueTracking);
writeJson(path.join(generatedDir, 'cost-record.json'), costRecord);
fs.writeFileSync(path.join(generatedDir, 'captions.srt'), buildSrt());
fs.writeFileSync(path.join(generatedDir, 'storyboard.svg'), buildStoryboardSvg());
fs.writeFileSync(path.join(thumbnailDir, 'thumbnail.svg'), buildThumbnailSvg());

const renderReport = renderProof();
fs.writeFileSync(path.join(outRoot, 'approval-package.md'), buildApprovalMarkdown(renderReport));

console.log(
  JSON.stringify(
    {
      ok: true,
      output: path.relative(root, outRoot).replace(/\\/g, '/'),
      rendered: renderReport.rendered,
      videoPath: renderReport.videoPath,
      contentId,
      approvedAssetsInventoried: daxAssets.length,
    },
    null,
    2,
  ),
);
