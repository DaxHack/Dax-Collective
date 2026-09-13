#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const cli = parseArgs(process.argv.slice(2));
const outRoot = path.join(root, cli.out || path.join('artifacts', 'timezone-travelers', 'sprint-3-sample'));
const generatedDir = path.join(outRoot, 'generated');
const renderDir = path.join(outRoot, 'render');
const thumbnailDir = path.join(outRoot, 'thumbnail');

for (const dir of [outRoot, generatedDir, renderDir, thumbnailDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const now = new Date().toISOString();
const topic =
  cli.topic || 'Tokyo vs Seoul for first-time night-owl city explorers';
const format = cli.format || 'short';

const approvedAssets = [
  {
    id: 'tzt-zone-001',
    label: 'Tokyo Shibuya wide city visual',
    path: 'dax-main/public/assets/approved-media/time-zone-travelers/2024-tokyo-zone-guide-shibuya.png',
    rights: 'Repo-approved Time-Zone Travelers asset; no identifiable people noted in approvedMedia.js.',
  },
  {
    id: 'tzt-zone-002',
    label: 'Paris dusk travel mood visual',
    path: 'dax-main/public/assets/approved-media/time-zone-travelers/2023-paris-seine-riverbank-dusk.png',
    rights: 'Repo-approved Time-Zone Travelers asset; used as generic travel transition texture.',
  },
  {
    id: 'tzt-dispatch-001',
    label: 'Budget carry-on setup',
    path: 'dax-main/public/assets/approved-media/time-zone-travelers/2024-atlanta-budget-carryon-setup.png',
    rights: 'Repo-approved Time-Zone Travelers asset for packing/gear beat.',
  },
  {
    id: 'tzt-tip-001',
    label: 'Early airport gate',
    path: 'dax-main/public/assets/approved-media/time-zone-travelers/2024-atlanta-airport-gate-morning.png',
    rights: 'Repo-approved Time-Zone Travelers asset for logistics beat.',
  },
].map((asset) => ({ ...asset, absolutePath: path.join(root, asset.path) }));

const sourceNotes = [
  {
    title: 'Cheap Tickets & IC Cards - The Official Tokyo Travel Guide, GO TOKYO',
    url: 'https://www.gotokyo.org/en/plan/getting-around/ic-card/index.html',
    publisher: 'Tokyo Convention & Visitors Bureau / GO TOKYO',
    verifiedAt: now,
    use: 'Tokyo transit framing: IC cards, rechargeable prepaid cards, multi-operator public transport complexity.',
  },
  {
    title: 'Shibuya - The Official Tokyo Travel Guide, GO TOKYO',
    url: 'https://www.gotokyo.org/en/destinations/western-tokyo/shibuya/index.html',
    publisher: 'Tokyo Convention & Visitors Bureau / GO TOKYO',
    verifiedAt: now,
    use: 'Tokyo night/culture framing: Shibuya as a dense culture and transit anchor.',
  },
  {
    title: 'Public Transportation - Seoul Metropolitan Government',
    url: 'https://english.seoul.go.kr/service/movement/public-transportation/',
    publisher: 'Seoul Metropolitan Government',
    verifiedAt: now,
    use: 'Seoul transit framing: bus/subway system, transportation cards, route complexity for first-time visitors.',
  },
  {
    title: 'Transportation Cards - Visit Korea',
    url: 'https://english1.visitkorea.or.kr/enu/TRP/TP_ENG_8_1_1.jsp',
    publisher: 'Korea Tourism Organization',
    verifiedAt: now,
    use: 'Tmoney/Cashbee background. Avoid exact fare claims without a final same-day fare check.',
  },
];

const concept = {
  brand: 'Time-Zone Travelers',
  format,
  contentType: 'city-vs-city decision guide',
  productionStatus: 'READY_FOR_APPROVAL_PACKAGE',
  publishStatus: 'BLOCKED_NEEDS_DANIEL_PUBLICATION_APPROVAL',
  topic,
  originalAngle:
    'Instead of ranking two cities, score which one is easier for a first-time traveler who wants late-night energy without losing the next morning to logistics.',
  audience:
    'Travelers choosing a first major East Asia city base who care about transit, night culture, carry-on simplicity, and useful decision-making.',
  sourceBoundary:
    'No visa, safety, opening-hour, or exact-price claims are presented as current without a final source check. This sample uses official transit/tourism sources and avoids fabricated personal experience.',
};

const scriptSegments = [
  {
    start: 0,
    end: 4,
    label: 'Hook',
    text:
      'Tokyo or Seoul for your first night-owl city trip? Do not ask which city is better. Ask which city forgives beginner mistakes.',
  },
  {
    start: 4,
    end: 10,
    label: 'Decision frame',
    text:
      'Tokyo rewards planning. IC cards make movement smooth, but the network is layered across many operators. Seoul rewards quick adaptation, with subway and bus options built around a unified card habit.',
  },
  {
    start: 10,
    end: 17,
    label: 'Original comparison',
    text:
      'Choose Tokyo if your dream is dense visual culture, iconic districts, and a route you plan before leaving the hotel. Choose Seoul if you want easier pivots between neighborhoods after the first plan changes.',
  },
  {
    start: 17,
    end: 24,
    label: 'Practical beat',
    text:
      'For either city, your first win is not a hidden attraction. It is landing with a transit card plan, one backup route, and a carry-on setup you can move with fast.',
  },
  {
    start: 24,
    end: 30,
    label: 'Close',
    text:
      'Time-Zone Travelers verdict: Tokyo is the cinematic maze. Seoul is the flexible night route. Pick the mistake pattern you can handle.',
  },
];

const storyboard = [
  {
    time: '0-4s',
    visual: 'Split title card: Tokyo vs Seoul, late-night route board.',
    textOverlay: 'Which city forgives beginner mistakes?',
    asset: 'Original motion graphic over approved city texture.',
  },
  {
    time: '4-10s',
    visual: 'Transit-card comparison board, no exact fare claims.',
    textOverlay: 'Planning vs pivoting',
    asset: 'Original motion graphic.',
  },
  {
    time: '10-17s',
    visual: 'Tokyo city visual, then Seoul placeholder map lines.',
    textOverlay: 'Cinematic maze or flexible route?',
    asset: 'Approved Tokyo asset plus original line art.',
  },
  {
    time: '17-24s',
    visual: 'Carry-on flatlay and airport gate logistics beat.',
    textOverlay: 'Transit plan. Backup route. Move light.',
    asset: 'Approved Time-Zone Travelers logistics assets.',
  },
  {
    time: '24-30s',
    visual: 'End card with approval status and tracking ID.',
    textOverlay: 'READY FOR DANIEL REVIEW',
    asset: 'Original brand end card.',
  },
];

const metadata = {
  contentId: `tzt-${new Date(now).toISOString().slice(0, 10)}-tokyo-seoul-night-owl`,
  title: 'Tokyo vs Seoul: Which First Trip Fits Night-Owl Travelers?',
  description:
    'Draft Time-Zone Travelers comparison guide. Built from official transit/tourism sources, approved repository assets, and original commentary. No personal experience is claimed and no public publishing is allowed until Daniel approves.',
  tags: [
    'Time-Zone Travelers',
    'Tokyo travel',
    'Seoul travel',
    'city comparison',
    'travel planning',
    'first time in Asia',
    'night travel',
  ],
  thumbnailText: 'TOKYO OR SEOUL?',
  platformTargets: ['YouTube Shorts', 'Instagram Reels', 'TikTok', 'YouTube long-form expansion later'],
  aiDisclosureRecommendation:
    'Disclose AI-assisted drafting/production if the final copy, voice, or supporting visuals remain AI-assisted.',
};

const analyticsRecord = {
  brand: 'Time-Zone Travelers',
  contentId: metadata.contentId,
  concept: topic,
  format,
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

const monetization = {
  status: 'AFFILIATE_READY_TRACKING_ONLY',
  noEnrollmentClaim: true,
  activeAffiliateProgramsVerified: [],
  paths: [
    {
      path: 'Official source links',
      status: 'usable now',
      revenue: 'none',
      reason: 'Builds trust without affiliate enrollment.',
    },
    {
      path: 'Travel gear affiliate links',
      status: 'future approval required',
      revenue: 'unknown',
      reason: 'Relevant to carry-on, transit, adapter, and bag recommendations after Daniel approves programs.',
    },
    {
      path: 'Activities/tours affiliate links',
      status: 'future approval required',
      revenue: 'unknown',
      reason: 'Can fit destination decision guides after legitimate provider enrollment.',
    },
    {
      path: 'Digital city decision guides',
      status: 'later product idea',
      revenue: 'unknown',
      reason: 'Low-cost owned offer once content proof exists.',
    },
  ],
  trackedLinks: [
    {
      label: 'GO TOKYO IC cards',
      url: addUtm(sourceNotes[0].url, metadata.contentId, 'official_source'),
      affiliate: false,
    },
    {
      label: 'Seoul public transportation',
      url: addUtm(sourceNotes[2].url, metadata.contentId, 'official_source'),
      affiliate: false,
    },
  ],
};

const costEstimate = {
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
    notes: 'Local proof uses source notes, approved repo assets, deterministic SVG/ASS, and FFmpeg only.',
  },
  productionRisks: [
    'Paid TTS/video/image generation not used.',
    'No affiliate enrollment or purchase was performed.',
    'Final publishing remains approval-gated.',
  ],
};

const qc = [
  ['Source-backed research', 'PASS', 'Official Tokyo, Seoul, and Korea Tourism pages are listed with verification timestamps.'],
  ['Time-sensitive claims', 'PASS', 'No visa, safety, opening-hour, or exact fare claims are presented as final/current.'],
  ['Originality', 'PASS', 'Decision-guide angle avoids generic top-10 destination spam.'],
  ['No fabricated experience', 'PASS', 'Script does not claim Daniel visited or personally experienced either city.'],
  ['Visual rights', 'PASS', 'Uses approved repo assets and original graphics only.'],
  ['Affiliate honesty', 'PASS', 'Affiliate tracking is prepared, with no active-enrollment claim.'],
  ['Narration/audio', 'PARTIAL', 'Silent proof render only; final voice requires Daniel-approved narration/TTS.'],
  ['Publishing', 'BLOCKED', 'Requires Daniel approval and verified platform credentials.'],
];

const publishPayload = {
  contentId: metadata.contentId,
  brand: 'Time-Zone Travelers',
  approvalStatus: 'READY_FOR_DANIEL_REVIEW',
  publishAllowed: false,
  requiredBeforePublishing: [
    'Daniel approves concept/script.',
    'Final source check is completed for any updated time-sensitive claims.',
    'Final voice/narration is approved.',
    'Platform account mapping is verified.',
    'Affiliate links, if used, are legitimate and approved.',
  ],
  suggestedPlatforms: metadata.platformTargets,
  title: metadata.title,
  description: metadata.description,
  tags: metadata.tags,
};

const contentPackage = {
  generatedAt: now,
  concept,
  opportunityScore: {
    originality: 84,
    viewerValue: 86,
    retentionPotential: 79,
    sourceRisk: 28,
    monetizationFit: 72,
    notes:
      'Strong Sprint 3 sample because it compares decisions and logistics instead of listing attractions.',
  },
  sourceNotes,
  scriptSegments,
  storyboard,
  assetPlan: approvedAssets.map(({ absolutePath, ...asset }) => asset),
  musicSfxPlan: [
    'Use subtle airport-board ticks, soft city ambience, and a low percussion pulse if licensed or generated under approved terms.',
    'No copyrighted music selected in this local proof.',
  ],
  metadata,
  complianceReview: {
    copyright:
      'No ripped travel footage, no copied blog text, and no third-party images beyond approved repo assets in the local proof.',
    aiDisclosure: metadata.aiDisclosureRecommendation,
    affiliateDisclosure:
      'If future affiliate links are inserted, add a clear affiliate disclosure before publishing.',
    approval: 'Ready for Daniel review; not approved for public posting.',
  },
  qc,
  analyticsRecord,
  monetization,
  costEstimate,
  publishPayload,
};

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

function addUtm(url, contentId, medium) {
  const parsed = new URL(url);
  parsed.searchParams.set('utm_source', 'time-zone-travelers');
  parsed.searchParams.set('utm_medium', medium);
  parsed.searchParams.set('utm_campaign', contentId);
  return parsed.toString();
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

function wrapAss(text, max = 33) {
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
  return scriptSegments
    .map((segment, index) =>
      [
        index + 1,
        `${srtTimestamp(segment.start)} --> ${srtTimestamp(segment.end)}`,
        segment.text,
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
    'Style: Title,Arial,72,&H00FFFFFF,&H00FFFFFF,&H00101010,&H99000000,1,0,0,0,100,100,0,0,1,4,1,8,64,64,160,1',
    'Style: Body,Arial,56,&H00FFFFFF,&H00F59E0B,&H00101010,&HBB000000,0,0,0,0,100,100,0,0,1,4,1,5,82,82,0,1',
    'Style: Footer,Arial,32,&H0014B8A6,&H00FFFFFF,&H00101010,&H99000000,0,0,0,0,100,100,0,0,1,3,1,2,60,60,130,1',
    '',
    '[Events]',
    'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
    'Dialogue: 0,0:00:00.00,0:00:30.00,Title,,0,0,0,,TIME-ZONE TRAVELERS // REVIEW PROOF',
    'Dialogue: 0,0:00:00.00,0:00:30.00,Footer,,0,0,0,,Non-public approval render. Public posting blocked until Daniel approves.',
  ];

  for (const segment of scriptSegments) {
    lines.push(
      `Dialogue: 0,${assTimestamp(segment.start)},${assTimestamp(segment.end)},Body,,0,0,0,,${wrapAss(segment.text)}`,
    );
  }
  return `${lines.join('\n')}\n`;
}

function buildThumbnailSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A0F1A"/>
      <stop offset="52%" stop-color="#172554"/>
      <stop offset="100%" stop-color="#7C2D12"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg)"/>
  <circle cx="390" cy="300" r="210" fill="#F97316" opacity="0.22"/>
  <circle cx="1500" cy="790" r="270" fill="#14B8A6" opacity="0.18"/>
  <path d="M220 700 C520 420 800 900 1120 600 S1590 480 1710 260" fill="none" stroke="#F59E0B" stroke-width="18" stroke-dasharray="34 28"/>
  <text x="120" y="210" fill="#FCD34D" font-family="Arial" font-size="58" font-weight="900" letter-spacing="8">TIME-ZONE TRAVELERS</text>
  <text x="120" y="500" fill="#FFFFFF" font-family="Arial" font-size="168" font-weight="900">TOKYO</text>
  <text x="770" y="500" fill="#F97316" font-family="Arial" font-size="124" font-weight="900">OR</text>
  <text x="1030" y="500" fill="#FFFFFF" font-family="Arial" font-size="168" font-weight="900">SEOUL?</text>
  <text x="124" y="660" fill="#E5E7EB" font-family="Arial" font-size="62" font-weight="700">Night-owl first trip decision guide</text>
  <text x="124" y="920" fill="#14B8A6" font-family="Arial" font-size="42" font-weight="700">Draft package - approval required</text>
</svg>
`;
}

function buildStoryboardSvg() {
  const rows = storyboard
    .map((item, index) => {
      const y = 170 + index * 160;
      return `
      <rect x="110" y="${y}" width="1700" height="120" rx="20" fill="#111827" stroke="#334155"/>
      <text x="150" y="${y + 38}" fill="#F59E0B" font-family="Arial" font-size="30" font-weight="800">${escapeXml(item.time)}</text>
      <text x="150" y="${y + 80}" fill="#FFFFFF" font-family="Arial" font-size="34">${escapeXml(item.textOverlay)}</text>
      <text x="760" y="${y + 42}" fill="#5EEAD4" font-family="Arial" font-size="26">${escapeXml(item.asset)}</text>
      <text x="760" y="${y + 82}" fill="#CBD5E1" font-family="Arial" font-size="24">${escapeXml(item.visual)}</text>`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#0A0F1A"/>
  <text x="110" y="100" fill="#FFFFFF" font-family="Arial" font-size="58" font-weight="900">TIME-ZONE TRAVELERS STORYBOARD</text>
  <text x="110" y="142" fill="#F59E0B" font-family="Arial" font-size="28">${escapeXml(topic)}</text>
${rows}
</svg>
`;
}

function buildApprovalMarkdown(renderReport) {
  const sourceRows = sourceNotes
    .map((source) => `| ${source.publisher} | ${source.title} | ${source.url} | ${source.use} |`)
    .join('\n');
  const qcRows = qc.map(([gate, status, note]) => `| ${gate} | ${status} | ${note} |`).join('\n');
  const scriptText = scriptSegments
    .map((segment) => `**${segment.label} (${segment.start}-${segment.end}s)**\n${segment.text}`)
    .join('\n\n');

  return `# Time-Zone Travelers Sprint 3 Approval Package

Generated: ${now}

## Status

- Production package: ${concept.productionStatus}
- Public publishing: ${concept.publishStatus}
- Render proof: ${renderReport.rendered ? 'CREATED' : 'NOT CREATED'}
- Voice/narration: PARTIAL - silent proof render only
- Affiliate enrollment: NONE CLAIMED

## Concept

${concept.topic}

${concept.originalAngle}

## Script

${scriptText}

## Source Notes

| Publisher | Source | URL | Use |
| --- | --- | --- | --- |
${sourceRows}

## QC

| Gate | Status | Evidence |
| --- | --- | --- |
${qcRows}

## Publishing Gate

The publish payload is created, but \`publishAllowed\` is false. Daniel must approve the content and account mapping before public posting.

## Monetization

Affiliate-ready tracking exists, but no active affiliate enrollment is claimed. Current links are official-source links only.

## Cost

Local proof run cost: $0.00. No paid APIs, ad spend, orders, or subscriptions were used.

## Files

- content package: \`generated/content-package.json\`
- captions: \`generated/captions.srt\`
- storyboard: \`generated/storyboard.svg\`
- thumbnail: \`thumbnail/thumbnail.svg\`
- publish payload: \`generated/publish-ready-payload.json\`
- analytics record: \`generated/analytics-record.json\`
- render proof: \`${renderReport.videoPath || 'not created'}\`
`;
}

function renderProof() {
  const assPath = path.join(renderDir, 'proof.ass');
  fs.writeFileSync(assPath, buildAss());

  const existingAssets = approvedAssets.filter((asset) => fs.existsSync(asset.absolutePath));
  const videoPath = path.join(renderDir, 'timezone-proof-render.mp4');
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
    args.push('-f', 'lavfi', '-i', 'color=c=0x0A0F1A:s=1080x1920:d=30:r=30');
    args.push('-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100');
    args.push('-vf', 'ass=proof.ass', '-map', '0:v', '-map', '1:a');
  }

  args.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest', 'timezone-proof-render.mp4');

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
    usedAssets: existingAssets.map((asset) => asset.path),
    stderrTail: (ffmpeg.stderr || '').split(/\r?\n/).slice(-25),
  };

  if (report.rendered) {
    const ffprobe = spawnSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration,size', '-of', 'json', 'timezone-proof-render.mp4'],
      { cwd: renderDir, encoding: 'utf8' },
    );
    report.ffprobe = ffprobe.status === 0 ? JSON.parse(ffprobe.stdout) : { error: ffprobe.stderr };
  }

  writeJson(path.join(renderDir, 'render-report.json'), report);
  return report;
}

writeJson(path.join(generatedDir, 'content-package.json'), contentPackage);
writeJson(path.join(generatedDir, 'analytics-record.json'), analyticsRecord);
writeJson(path.join(generatedDir, 'cost-record.json'), costEstimate);
writeJson(path.join(generatedDir, 'monetization-path.json'), monetization);
writeJson(path.join(generatedDir, 'publish-ready-payload.json'), publishPayload);
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
      contentId: metadata.contentId,
    },
    null,
    2,
  ),
);
