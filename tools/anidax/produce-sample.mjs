#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const cli = parseArgs(process.argv.slice(2));
const outRoot = path.join(root, cli.out || path.join('artifacts', 'anidax', 'sprint-1-sample'));
const generatedDir = path.join(outRoot, 'generated');
const renderDir = path.join(outRoot, 'render');
const thumbnailDir = path.join(outRoot, 'thumbnail');

for (const dir of [outRoot, generatedDir, renderDir, thumbnailDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const now = new Date().toISOString();
const topic = cli.topic || "Why Subaru's Return by Death is not a power fantasy";
const series = cli.series || 'Re:Zero - Starting Life in Another World';
const suppliedAudioFile = cli.audioFile ? path.resolve(root, cli.audioFile) : null;
const hasSuppliedAudio = Boolean(suppliedAudioFile && fs.existsSync(suppliedAudioFile));
const audioApprovalStatus = String(
  cli.audioApprovalStatus || (hasSuppliedAudio ? 'draft-review-audio' : 'missing'),
).toLowerCase();
const audioSourceLabel =
  cli.audioSourceLabel || (hasSuppliedAudio ? 'Supplied review audio file' : 'No narration audio supplied');
const audioReadyForFinal =
  hasSuppliedAudio && ['approved-final', 'daniel-approved', 'final-approved'].includes(audioApprovalStatus);
const audioReadyForReview = hasSuppliedAudio;
const contentId =
  cli.contentId || `anidax-${new Date(now).toISOString().slice(0, 10)}-${slugify(topic).slice(0, 64)}`;

const concept = {
  brand: 'Ani-Dax',
  format: 'short',
  productionStatus: 'READY_FOR_APPROVAL_PACKAGE',
  publishStatus: 'BLOCKED_NEEDS_DANIEL_PUBLICATION_APPROVAL',
  topic,
  series,
  contentType: 'character analysis',
  priorityFormat: 'fictional/in-universe character interview plus analysis',
  originalAngle:
    cli.angle ||
    'Frame the topic as a psychological interview transcript instead of a power ranking. The hook is that the ability or conflict only looks simple from outside the character pressure loop.',
  evidenceBoundaries: [
    'No fabricated canon quotes.',
    'No ripped, cropped, mirrored, or sped-up anime footage.',
    'Use original narration, motion graphics, silhouette layouts, clocks, reset maps, and abstract character boards.',
    'Final canon pass must verify claims against official episodes or licensed summaries before publishing.',
  ],
};

const scriptSegments = buildScriptSegments(topic, series);

const storyboard = [
  {
    time: '0-4s',
    visual: 'Black field, cyan reset loop, single question card.',
    textOverlay: 'Is this power, or punishment?',
    assetType: 'Original motion graphic',
  },
  {
    time: '4-10s',
    visual: 'Timeline fractures into three paths, only one path remains lit.',
    textOverlay: 'Control is removed.',
    assetType: 'Original vector/motion graphic',
  },
  {
    time: '10-16s',
    visual: 'Interview table silhouette, empty second chair, recorder waveform.',
    textOverlay: 'What did the last version lose?',
    assetType: 'Original composition',
  },
  {
    time: '16-23s',
    visual: 'Memory cards stack up behind the narrator frame.',
    textOverlay: 'The plot resets. The burden does not.',
    assetType: 'Original motion graphic',
  },
  {
    time: '23-30s',
    visual: 'Ani-Dax title lockup, no upload CTA until approval.',
    textOverlay: 'READY FOR DANIEL REVIEW',
    assetType: 'Brand card',
  },
];

const metadata = {
  contentId,
  title: cli.title || titleFromTopic(topic),
  description:
    "Ani-Dax character analysis draft. This video uses original narration and original motion-graphic support only. No anime clips, no fabricated quotes, and no public publishing until Daniel approves.",
  tags: ['Ani-Dax', 'anime analysis', 'ReZero', 'Subaru Natsuki', 'character writing', 'anime theory'],
  thumbnail:
    'Original thumbnail concept: fractured cyan clock over a black-violet background, text: POWER OR PUNISHMENT?',
  aiDisclosureRecommendation:
    'Recommended if AI-generated/supporting visuals or AI-assisted copy are used in the final: disclose AI-assisted production in description or internal publication checklist.',
};

const costEstimate = {
  generatedAt: now,
  localProofRunUsd: {
    llm: 0,
    image: 0,
    video: 0,
    tts: 0,
    musicSfx: 0,
    storage: 0,
    api: 0,
    other: 0,
    notes: hasSuppliedAudio
      ? 'This local proof uses deterministic text assets, supplied local/review audio, and FFmpeg only.'
      : 'This local proof uses deterministic text assets and FFmpeg only.',
  },
  finalProductionExpectedCosts: [
    {
      item: 'LLM/script polish',
      status: 'optional',
      estimateUsd: 'TBD by provider/model',
    },
    {
      item: 'Narration/TTS',
      status: hasSuppliedAudio ? 'draft/review audio supplied' : 'blocked',
      estimateUsd: hasSuppliedAudio
        ? '0 for this local review run; final narration cost depends on Daniel-approved voice path'
        : 'TBD; requires Daniel voice, approved narrator, local TTS approval, or configured TTS',
    },
    {
      item: 'Image/video generation',
      status: 'optional',
      estimateUsd: 'TBD; prefer original reusable motion templates first',
    },
  ],
};

const qc = [
  ['Originality', 'PASS', 'Angle is analysis/interview framing, not recap spam.'],
  ['Copyright posture', 'PASS', 'Uses no anime clips or copied frames in the local package.'],
  ['Canon/fact handling', 'PARTIAL', 'Stable high-level premise only; final claims need episode/source verification.'],
  ['Visual quality', 'PARTIAL', 'FFmpeg proof render verifies pipeline shape; final visuals need art pass.'],
  [
    'Narration quality',
    audioReadyForFinal ? 'PASS' : audioReadyForReview ? 'REVIEW_REQUIRED' : 'BLOCKED',
    audioReadyForFinal
      ? 'Final-approved narration audio was supplied.'
      : audioReadyForReview
        ? 'Draft review audio was supplied and rendered; Daniel must approve or replace the voice before public publishing.'
        : 'No narration audio supplied; final requires Daniel voice, approved narrator, approved local TTS, or configured TTS.',
  ],
  ['Captions', 'PASS', 'Draft SRT generated from timed script segments.'],
  ['Metadata', 'PASS', 'Title/description/tags generated with no misleading canon quote claims.'],
  ['Public publishing', 'BLOCKED', 'Requires Daniel approval and verified Ani-Dax account credential mapping.'],
];

const analyticsRecord = {
  brand: 'Ani-Dax',
  contentId,
  concept: topic,
  format: concept.format,
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

const publishReadyPayload = {
  contentId,
  brand: 'Ani-Dax',
  approvalStatus: audioReadyForFinal ? 'READY_FOR_DANIEL_REVIEW' : 'READY_FOR_DANIEL_REVIEW_VOICE_NOT_FINAL',
  publishAllowed: false,
  youtubePrivacyStatus: 'private',
  automaticCrossPostingAllowed: false,
  requiredBeforePublishing: [
    'Daniel approves concept/script.',
    'Daniel approves final narration/voice.',
    'Final canon/source check is completed for any specific claims.',
    'Final visual style/art pass is approved.',
    'Ani-Dax platform account mapping and credentials are verified.',
    'Daniel approves the specific public publishing target and metadata.',
  ],
  suggestedPlatforms: ['YouTube Shorts private draft', 'TikTok/Instagram drafts only after Daniel approval'],
  title: metadata.title,
  description: metadata.description,
  tags: metadata.tags,
  thumbnail: 'thumbnail/thumbnail.svg',
};

const monetizationPath = {
  status: 'AUDIENCE_BUILDING_FIRST_REVENUE_LATER',
  noActiveAffiliateEnrollmentClaim: true,
  activeAffiliateProgramsVerified: [],
  nearTermPaths: [
    {
      path: 'YouTube audience growth',
      status: 'later',
      requirement: 'Consistent approved publishing and platform eligibility.',
    },
    {
      path: 'Original Ani-Dax merch/memberships',
      status: 'later',
      requirement: 'Daniel-approved offer and storefront/provider setup.',
    },
    {
      path: 'Sponsors/affiliate offers',
      status: 'later',
      requirement: 'Legitimate approved partner, audience fit, and disclosure.',
    },
  ],
  currentCta: 'Subscribe/follow only after Daniel approves public publishing.',
};

const contentPackage = {
  generatedAt: now,
  concept,
  opportunityScore: {
    originality: 86,
    viewerValue: 82,
    retentionPotential: 78,
    productionRisk: 34,
    copyrightRisk: 22,
    notes:
      'Strong first Sprint 1 sample because it can be produced without copyrighted clips and demonstrates the character-interview priority format.',
  },
  researchNotes: [
    'Use only broad, stable canon premises in the draft unless sources are checked.',
    'Avoid direct quotes unless verified from licensed subtitles or official source material.',
    'Avoid pretending current trend data was fetched; no live analytics API was used in this run.',
  ],
  scriptSegments,
  storyboard,
  assetPlan: [
    'Abstract reset-loop motion graphic.',
    'Interview table silhouette.',
    'Timeline fracture cards.',
    'Ani-Dax end card.',
  ],
  metadata,
  audio: {
    supplied: hasSuppliedAudio,
    source: hasSuppliedAudio ? path.relative(root, suppliedAudioFile).replace(/\\/g, '/') : null,
    sourceLabel: audioSourceLabel,
    approvalStatus: audioApprovalStatus,
    readyForReview: audioReadyForReview,
    readyForFinal: audioReadyForFinal,
  },
  complianceReview: {
    copyright: 'No anime footage, no copyrighted screenshots, no music selected.',
    aiDisclosure: metadata.aiDisclosureRecommendation,
    monetization: 'No affiliate or product claims included.',
    approval: 'Ready for Daniel to review concept/script package; not ready to publish.',
  },
  qc,
  analyticsRecord,
  publishReadyPayload,
  monetizationPath,
  costEstimate,
};

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
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

function titleFromTopic(value) {
  if (/subaru/i.test(value) && /return by death/i.test(value) && /power fantasy/i.test(value)) {
    return "Subaru's Return by Death Is Not a Power Fantasy";
  }

  return value
    .replace(/^why\s+/i, '')
    .replace(/\bis not\b/i, 'Is Not')
    .replace(/\bpower fantasy\b/i, 'Power Fantasy')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.?!]+$/, '');
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildScriptSegments(topicValue, seriesValue) {
  const normalized = topicValue.toLowerCase();
  if (normalized.includes('return by death') || normalized.includes('subaru')) {
    return [
      {
        start: 0,
        end: 4,
        label: 'Hook',
        text: "What if Return by Death is not Subaru's advantage? What if it is the story's harshest interrogation room?",
      },
      {
        start: 4,
        end: 10,
        label: 'Angle',
        text:
          'Most power systems reward control. Return by Death removes control, then asks whether one person can carry memory, guilt, and consequence without becoming numb.',
      },
      {
        start: 10,
        end: 16,
        label: 'In-universe interview beat',
        text:
          'If Ani-Dax sat Subaru down after another reset, the first question would not be how many tries he gets. It would be: what did the last version of you lose?',
      },
      {
        start: 16,
        end: 23,
        label: 'Viewer value',
        text:
          'That is why the mechanic works. It turns suspense into character study. Every reset can move the plot, but the real cost lands inside Subaru before it lands on the timeline.',
      },
      {
        start: 23,
        end: 30,
        label: 'Close',
        text:
          'Ani-Dax takeaway: the ability is not interesting because it beats death. It is interesting because it makes survival emotionally expensive.',
      },
    ];
  }

  return [
    {
      start: 0,
      end: 4,
      label: 'Hook',
      text: `The question is not whether ${topicValue} sounds cool. The question is what pressure it puts on the character.`,
    },
    {
      start: 4,
      end: 10,
      label: 'Angle',
      text: `For ${seriesValue}, Ani-Dax should treat the topic as character evidence first and spectacle second.`,
    },
    {
      start: 10,
      end: 16,
      label: 'In-universe interview beat',
      text: 'If this character sat down for an interview, the strongest question would target the cost behind the choice, not the surface-level feat.',
    },
    {
      start: 16,
      end: 23,
      label: 'Viewer value',
      text: 'That framing gives the audience a reason to rewatch scenes for motive, consequence, and contradiction instead of just ranking power.',
    },
    {
      start: 23,
      end: 30,
      label: 'Close',
      text: 'Ani-Dax takeaway: make the analysis specific, source-check the canon, and keep the final video built from original commentary and original visuals.',
    },
  ];
}

function escapeHtml(value) {
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

function wrapAss(text, max = 34) {
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
    'Style: Title,Arial,82,&H00F9F7FF,&H0000D4FF,&H00101018,&HAA000000,1,0,0,0,100,100,0,0,1,4,1,8,70,70,190,1',
    'Style: Body,Arial,58,&H00FFFFFF,&H008B5CF6,&H00101018,&HBB000000,0,0,0,0,100,100,0,0,1,4,1,5,80,80,0,1',
    'Style: Footer,Arial,34,&H0000D4FF,&H00FFFFFF,&H00101018,&H99000000,0,0,0,0,100,100,0,0,1,3,1,2,60,60,140,1',
    '',
    '[Events]',
    'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
    `Dialogue: 0,0:00:00.00,0:00:30.00,Title,,0,0,0,,ANI-DAX // REVIEW PROOF`,
    `Dialogue: 0,0:00:00.00,0:00:30.00,Footer,,0,0,0,,Non-public FFmpeg proof render. ${hasSuppliedAudio ? (audioReadyForFinal ? 'Final-approved narration supplied.' : 'Draft narration supplied for Daniel review.') : 'Narration and final art blocked pending approved voice/assets.'}`,
  ];

  for (const segment of scriptSegments) {
    lines.push(
      `Dialogue: 0,${assTimestamp(segment.start)},${assTimestamp(segment.end)},Body,,0,0,0,,${wrapAss(segment.text)}`,
    );
  }
  return `${lines.join('\n')}\n`;
}

function buildApprovalMarkdown(renderReport) {
  const qcRows = qc.map(([gate, status, note]) => `| ${gate} | ${status} | ${note} |`).join('\n');
  const storyboardRows = storyboard
    .map((item) => `| ${item.time} | ${item.visual} | ${item.textOverlay} | ${item.assetType} |`)
    .join('\n');
  const scriptText = scriptSegments
    .map((segment) => `**${segment.label} (${segment.start}-${segment.end}s)**\n${segment.text}`)
    .join('\n\n');

  const audioLine = hasSuppliedAudio
    ? `${audioReadyForFinal ? 'FINAL APPROVED' : 'DRAFT REVIEW'} - ${audioSourceLabel} (${path.relative(root, suppliedAudioFile).replace(/\\/g, '/')})`
    : 'BLOCKED - no narration file supplied';

  return `# Ani-Dax Sprint 1 Approval Package

Generated: ${now}

## Status

- Production package: ${concept.productionStatus}
- Public publishing: ${concept.publishStatus}
- Render proof: ${renderReport.rendered ? 'CREATED' : 'NOT CREATED'}
- Audio/narration: ${audioLine}
- Publish allowed: false
- YouTube status if exported: private draft only
- Automatic cross-posting: disabled

## Concept

${concept.topic}

${concept.originalAngle}

## Script

${scriptText}

## Storyboard

| Time | Visual | Text Overlay | Asset Type |
| --- | --- | --- | --- |
${storyboardRows}

## Metadata

- Title: ${metadata.title}
- Tags: ${metadata.tags.join(', ')}
- Thumbnail: ${metadata.thumbnail}
- AI disclosure: ${metadata.aiDisclosureRecommendation}

## Publish Payload

- Content ID: ${contentId}
- Approval status: ${publishReadyPayload.approvalStatus}
- YouTube privacy: ${publishReadyPayload.youtubePrivacyStatus}
- Cross-posting: disabled until Daniel approves a specific content item and platform/account map

## QC

| Gate | Status | Evidence |
| --- | --- | --- |
${qcRows}

## Cost

Local proof run cost: $0.00. It used deterministic text assets and local FFmpeg only.

## Files

- content package: \`generated/content-package.json\`
- captions: \`generated/captions.srt\`
- publish payload: \`generated/publish-ready-payload.json\`
- analytics record: \`generated/analytics-record.json\`
- cost record: \`generated/cost-record.json\`
- thumbnail: \`thumbnail/thumbnail.svg\`
- render proof: \`${renderReport.videoPath || 'not created'}\`
- render report: \`render/render-report.json\`

## Human Approval Required

Daniel must approve final concept/script, final voice path, final visual style, and any public publishing.
`;
}

function buildThumbnailSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#05050A"/>
      <stop offset="55%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#2E1065"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="7" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <circle cx="980" cy="210" r="155" fill="none" stroke="#00D4FF" stroke-width="9" opacity="0.75" filter="url(#glow)"/>
  <path d="M980 62 L980 210 L1070 248" stroke="#A78BFA" stroke-width="10" fill="none" stroke-linecap="round" filter="url(#glow)"/>
  <path d="M150 520 C320 370 400 615 565 465 S850 420 1035 555" stroke="#00D4FF" stroke-width="8" fill="none" opacity="0.55"/>
  <rect x="72" y="70" width="590" height="86" rx="10" fill="#00D4FF" opacity="0.16"/>
  <text x="92" y="128" fill="#00D4FF" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="900">ANI-DAX ANALYSIS</text>
  <text x="82" y="300" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="96" font-weight="900">POWER</text>
  <text x="82" y="400" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="96" font-weight="900">OR</text>
  <text x="82" y="500" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="96" font-weight="900">PUNISHMENT?</text>
  <text x="84" y="585" fill="#C4B5FD" font-family="Arial, Helvetica, sans-serif" font-size="36">Return by Death as character pressure</text>
</svg>
`;
}

function buildStoryboardSvg() {
  const cards = storyboard
    .map((item, index) => {
      const y = 170 + index * 160;
      return `
        <rect x="120" y="${y}" width="1680" height="120" rx="22" fill="#111827" stroke="#1f9cf0" opacity="0.82"/>
        <text x="165" y="${y + 38}" fill="#00D4FF" font-family="Arial" font-size="30" font-weight="700">${escapeHtml(item.time)}</text>
        <text x="165" y="${y + 78}" fill="#ffffff" font-family="Arial" font-size="34">${escapeHtml(item.textOverlay)}</text>
        <text x="760" y="${y + 42}" fill="#d8b4fe" font-family="Arial" font-size="26">${escapeHtml(item.assetType)}</text>
        <text x="760" y="${y + 82}" fill="#d1d5db" font-family="Arial" font-size="24">${escapeHtml(item.visual)}</text>`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#05050A"/>
      <stop offset="50%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#2E1065"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg)"/>
  <circle cx="1650" cy="180" r="220" fill="#00D4FF" opacity="0.12"/>
  <circle cx="210" cy="930" r="280" fill="#8B5CF6" opacity="0.12"/>
  <text x="120" y="105" fill="#ffffff" font-family="Arial" font-size="58" font-weight="900">ANI-DAX SPRINT 1 STORYBOARD</text>
  <text x="120" y="145" fill="#00D4FF" font-family="Arial" font-size="26">Return by Death Is Not Subaru's Power - It Is the Price</text>
  ${cards}
</svg>
`;
}

function probeDurationSeconds(file) {
  const ffprobe = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file],
    { encoding: 'utf8' },
  );

  if (ffprobe.status !== 0) return null;
  const duration = Number.parseFloat(ffprobe.stdout);
  return Number.isFinite(duration) ? duration : null;
}

function renderProof() {
  const assPath = path.join(renderDir, 'proof.ass');
  fs.writeFileSync(assPath, buildAss());

  const videoPath = path.join(renderDir, 'ani-dax-proof-render.mp4');
  const suppliedAudioDuration = hasSuppliedAudio ? probeDurationSeconds(suppliedAudioFile) : null;
  const renderDuration = Math.max(30, suppliedAudioDuration || 0);
  const args = [
    '-y',
    '-f',
    'lavfi',
    '-i',
    `color=c=0x060610:s=1080x1920:d=${renderDuration.toFixed(3)}:r=30`,
  ];

  if (hasSuppliedAudio) {
    args.push('-i', suppliedAudioFile);
  } else {
    args.push(
    '-f',
    'lavfi',
    '-i',
      'anullsrc=channel_layout=stereo:sample_rate=44100',
    );
  }

  args.push(
    '-vf',
    'ass=proof.ass',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-t',
    renderDuration.toFixed(3),
    'ani-dax-proof-render.mp4',
  );

  const ffmpeg = spawnSync('ffmpeg', args, {
    cwd: renderDir,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 10,
  });

  const report = {
    generatedAt: now,
    rendered: ffmpeg.status === 0 && fs.existsSync(videoPath),
    videoPath: path.relative(root, videoPath).replace(/\\/g, '/'),
    audioSource: hasSuppliedAudio
      ? path.relative(root, suppliedAudioFile).replace(/\\/g, '/')
      : 'silent-placeholder',
    audioSourceLabel,
    audioApprovalStatus,
    audioReadyForReview,
    audioReadyForFinal,
    suppliedAudioDurationSeconds: suppliedAudioDuration,
    renderDurationSeconds: renderDuration,
    command: `ffmpeg ${args.join(' ')}`,
    status: ffmpeg.status,
    stderrTail: (ffmpeg.stderr || '').split(/\r?\n/).slice(-20),
  };

  if (report.rendered) {
    const ffprobe = spawnSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration,size', '-of', 'json', 'ani-dax-proof-render.mp4'],
      { cwd: renderDir, encoding: 'utf8' },
    );
    report.ffprobe = ffprobe.status === 0 ? JSON.parse(ffprobe.stdout) : { error: ffprobe.stderr };
  }

  writeJson(path.join(renderDir, 'render-report.json'), report);
  return report;
}

writeJson(path.join(generatedDir, 'content-package.json'), contentPackage);
writeJson(path.join(generatedDir, 'publish-ready-payload.json'), publishReadyPayload);
writeJson(path.join(generatedDir, 'analytics-record.json'), analyticsRecord);
writeJson(path.join(generatedDir, 'cost-record.json'), costEstimate);
writeJson(path.join(generatedDir, 'monetization-path.json'), monetizationPath);
fs.writeFileSync(path.join(generatedDir, 'captions.srt'), buildSrt());
fs.writeFileSync(path.join(generatedDir, 'storyboard.svg'), buildStoryboardSvg());
fs.writeFileSync(path.join(thumbnailDir, 'thumbnail.svg'), buildThumbnailSvg());

const renderReport = renderProof();
fs.writeFileSync(path.join(outRoot, 'approval-package.md'), buildApprovalMarkdown(renderReport));

console.log(JSON.stringify({
  ok: true,
  output: path.relative(root, outRoot).replace(/\\/g, '/'),
  rendered: renderReport.rendered,
  videoPath: renderReport.videoPath,
}, null, 2));
